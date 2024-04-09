<div align=center>
  <h1>Tennis Lesson</h1>
  Uglyus 과제 테니스 정기 레슨 신청 API 만들기
</div>

## API Receipt
swagger : localhost:3000/api<br><br>
**회원가입(POST)**<br>
url | http://localhost:3000/api/auth/sign-up<br>
body | phone, password<br>
<br>
**로그인(POST)**<br>
url | http://localhost:3000/api/auth/sign-in<br>
body | phone, password<br>
<br>
**레슨 가능 시간대 조회(GET)**<br>
url | http://localhost:3000/api/lessons<br>
<br>
**레슨 신청하기(POST)**<br>
url | http://localhost:3000/api/lessons<br>
body | instructorId, dayOfWeek, startTime, endTime<br>
req | userId<br>
<br>
**신청한 레슨 조회(GET)**<br>
url | http://localhost:3000/api/lessons/:id<br>
req | userId<br>
<br>
**신청한 레슨 수정(PATCH)**<br>
url | http://localhost:3000/api/lessons/:id<br>
body | instructorId, dayOfWeek, startTime, endTime<br>
req | userId<br>
<br>
**신청한 레슨 취소(DELETE)**<br>
url | http://localhost:3000/api/lessons/:id<br>
req | userId<br>
<br>
## 💾 ERD Structure
![ERD structure](/img/erd.png)
<br>
## 💡 사용한 패키지 및 라이브러리
|Skill|Desciption|
|:---|:---:|
|Jwt| 토큰 암호화|
|Cookie-parser|서버에서 쿠키를 읽을 수 있게 해주는 도구|
|Auth-guard|유저 인가를 validate하기 위함|
|config| .env 환경변수 파일을 읽어올 수 있는 모듈 |
|typeorm-naming-straitegies|타입스크립트는 카멜케이스를 사용하고 DB는 스네이크 케이스를 사용하여 호환이 되게 해주는 도구|
|class-validator, class-transformer|DTO를 사용하여 validate하는 도구|
