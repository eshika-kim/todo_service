import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import {
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  /**
   * 레슨 신청 가능한 스케쥴 반환 메서드
   * @returns Array[]
   */
  async getSchedule() {
    const currentDate = new Date();
    const lessonSchedule = [];

    // 모든 레슨을 불러오고 요일을 기준으로 오름차순 정렬
    const allLessons = await this.lessonRepository.find();
    allLessons.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    // 7일간의 레슨을 검색하기 위함
    for (let day = 0; day < 7; day++) {
      currentDate.setDate(currentDate.getDate() + 1); // 다음날로 세팅

      let currentTime = new Date(currentDate);
      currentTime.setHours(7, 0, 0); // 오전 7시로 시간 설정

      // 해당 날짜에 오전 7시부터 23시까지 30분 간격으로 확인하면서
      while (
        currentTime.getHours() < 23 ||
        (currentTime.getHours() === 23 && currentTime.getMinutes() < 30)
      ) {
        // 예약된 레슨 확인
        const isReserved = this.isReservedLesson(currentTime, allLessons);

        // 해당 시간에 예약된 레슨이 없다면 lessonSchedule에 추가합니다.
        if (!isReserved) {
          lessonSchedule.push({
            date: currentDate.toISOString().split('T')[0],
            start_time: currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        }
        // 다음 단계로 넘어가기 위해 현재 시간을 30분씩 추가해줍니다.
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    }

    return lessonSchedule;
  }

  /**
   * findAll에서 찾은 배열에 일치하는 값이 있는 지 반환
   * @param currentTime
   * @param allLessons
   * @returns boolean
   */
  isReservedLesson(currentTime: Date, allLessons: Lesson[]): boolean {
    // 예약된 레슨 확인
    const dayOfWeek = currentTime.getDay();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    // 현재 요일과 시작 시간이 일치하는 예약된 레슨이 있는지 확인
    const isReserved = allLessons.some((lesson) => {
      return (
        lesson.dayOfWeek === dayOfWeek && lesson.startTime === currentTimeString
      );
    });
    return isReserved;
  }

  // create => isValidTimeInterval => findReservedLesson
  async create(userId: number, createLessonDto: CreateLessonDto) {
    const { instructorId, dayOfWeek, startTime, endTime } = createLessonDto;

    // 레슨시간이 30분 간격인지 1시간 간격인지 확인
    if (!this.isValidTimeInterval(startTime, endTime)) {
      throw new BadRequestException('레슨은 30분, 1시간 간격이어야 합니다.');
    }

    // 신청하려는 레슨 시간이 가능한지 확인
    if (
      !(await this.findReservedLesson(
        instructorId,
        dayOfWeek,
        startTime,
        endTime,
      ))
    ) {
      throw new ConflictException('해당 시간에 이미 예약된 레슨이 있습니다.');
    }
    const reservedLesson = await this.lessonRepository.save({
      userId,
      instructorId,
      dayOfWeek,
      startTime,
      endTime,
    });
    return reservedLesson;
  }

  async getMyLesson(userId: number, id: number) {
    const findMyLesson = await this.lessonRepository.findOne({
      where: {
        userId,
        id,
      },
    });
    if (!findMyLesson) {
      throw new BadRequestException('해당하는 레슨 정보가 없습니다.');
    }
    return findMyLesson;
  }

  // updateLesson => isValidTimeInterval => findReservedLesson
  // create와 예외처리가 비슷함
  async updateLesson(
    userId: number,
    id: number,
    updateLessonDto: UpdateLessonDto,
  ) {
    const { instructorId, dayOfWeek, startTime, endTime } = updateLessonDto;
    console.log(instructorId);
    // 레슨시간이 30분 간격인지 1시간 간격인지 확인
    if (!this.isValidTimeInterval(startTime, endTime)) {
      throw new BadRequestException('레슨은 30분, 1시간 간격이어야 합니다.');
    }
    // 해당 레슨이 존재하는지 확인
    const findLesson = await this.lessonRepository.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!findLesson) {
      throw new NotFoundException('해당 ID의 레슨을 찾을 수 없습니다.');
    }
    // 신청하려는 레슨 시간이 가능한지 확인
    if (
      await this.findReservedLesson(instructorId, dayOfWeek, startTime, endTime)
    ) {
      throw new ConflictException('해당 시간에 이미 예약된 레슨이 있습니다.');
    }

    findLesson.instructorId = instructorId;
    findLesson.dayOfWeek = dayOfWeek;
    findLesson.startTime = startTime;
    findLesson.endTime = endTime;

    return await this.lessonRepository.update({ id: id }, findLesson);
  }

  async cancelLesson(userId: number, id: number) {
    const findLesson = await this.lessonRepository.findOne({
      where: {
        userId,
        id,
      },
    });
    if (findLesson) {
      await this.lessonRepository.softDelete({ id, userId });
      return true;
    }
  }

  // 레슨 신청 시간이 30분 혹은 1시간인지 확인하는 함수
  isValidTimeInterval(startTime: string, endTime: string): boolean {
    const convertTime = (time: string) => {
      const [hours, minute] = time.split(':').map(Number);
      return hours * 60 + minute;
    };

    const estimatedTime = convertTime(endTime) - convertTime(startTime);
    return [30, 60].includes(estimatedTime);
  }

  // 신청하려는 레슨이 예약된 레슨인지 확인하는 함수
  async findReservedLesson(
    instructorId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    // 예약하려는 시간 전에 레슨의 시간을 확인합니다.
    // 레슨의 시간대의 시작이 예약 시작시간보다 작고
    // 종료가 예약 시작시간보다 크면 불가능합니다.
    // ex) 예약시간 7:30 ~ 8:00, 레슨시간 7:00 ~ 8:00 or 7:30 ~ 8:00
    const beforeLesson = await this.lessonRepository.findOne({
      where: {
        instructorId,
        dayOfWeek,
        startTime: LessThanOrEqual(startTime),
        endTime: MoreThan(startTime),
      },
    });

    // 예약하려는 시간 후의 레슨의 시간을 확인합니다.
    // 레슨의 시간대의 시작이 예약시작 시간보다 크고
    // 종료시간이 예약 종료 시간보다 크면 불가능합니다.
    // ex) 예약시간 7:30 ~ 8:30, 레슨시간 8:00 ~ 9:00
    const afterLesson = await this.lessonRepository.findOne({
      where: {
        instructorId,
        dayOfWeek,
        startTime: MoreThan(startTime),
        endTime: MoreThanOrEqual(endTime),
      },
    });
    return !!beforeLesson || !!afterLesson;
  }
}
