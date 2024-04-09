# project
과제제출용 private github

## API Receipt
회원가입(POST)
url | http://localhost:3000/api/auth/sign-up
body | phone, password

로그인(POST)
url | http://localhost:3000/api/auth/sign-in
body | phone, password

레슨 가능 시간대 조회(GET)
url | http://localhost:3000/api/lessons

레슨 신청하기(POST)
url | http://localhost:3000/api/lessons
body | instructorId, dayOfWeek, startTime, endTime
req | userId

신청한 레슨 조회(GET)
url | http://localhost:3000/api/lessons/:id
req | userId

신청한 레슨 수정(PATCH)
url | http://localhost:3000/api/lessons/:id
body | instructorId, dayOfWeek, startTime, endTime
req | userId

신청한 레슨 취소(DELETE)
url | http://localhost:3000/api/lessons/:id
req | userId

## 💾 ERD Structure
![ERD structure](/img/erd.png)

## 💡 사용한 패키지 및 라이브러리
|Skill|Desciption|
|:---|:---:|
|Jwt| 토큰 암호화|
|Cookie-parser|서버에서 쿠키를 읽을 수 있게 해주는 도구|
|Auth-guard|유저 인가를 validate하기 위함|
|config| .env 환경변수 파일을 읽어올 수 있는 모듈 |
|typeorm-naming-straitegies|타입스크립트는 카멜케이스를 사용하고 DB는 스네이크 케이스를 사용하여 호환이 되게 해주는 도구|
|class-validator, class-transformer|DTO를 사용하여 validate하는 도구|
