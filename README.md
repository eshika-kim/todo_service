<div align=center>
  <h1>TODO 정기 구독 서비스</h1>
  비회원은 email, password로 가입<br>
  처음 가입 시 plan은 FREE<br>
  

</div>
<br>
## 테이블 생성 쿼리


<br>
## 서버 실행 방법<br>
1) 패키지 설치 npm i <br>
2) 서버 실행 npm run start:dev<br>

## API Receipt
**회원가입(POST)**<br>
url | http://localhost:3000/api/auth/sign-up<br>
body(JSON) |<br>
{
    "email":"abc@abc.com",
    "password":"a1234"
}
<br>
{
    "email":"abc1@abc.com",
    "password":"a1234"
}
<br>
<br>
**로그인(POST)**<br>
url | http://localhost:3000/api/auth/sign-in<br>
body(JSON) |<br>
<br>
{
    "email":"abc@abc.com",
    "password":"a1234"
}
<br>
{
    "email":"abc1@abc.com",
    "password":"a1234"
}
<br>
**결제하기(PATCH)**<br>
url | http://localhost:3000/api/users/plan<br>
body(JSON) |<br>
성공예시 : BASIC <br>
{
    "plan":"BASIC",
    "cost": 3000
}
<br>
성공 예시 : PRO <br>
{
    "plan":"PRO",
    "cost": 5000
}
<br>
실패 예시 <br>
{
    "plan":"BASIC",
    "cost": 3000
}
<br>
**Todo 만들기 (POST)**<br>
url | http://localhost:3000/api/todos<br>
body(JSON) |<br>
성공 예시<br>
{
    "content":"오늘할일",
    "flag":1,
    "priority":1
}
실패 예시<br>
{
    "content": 1234,
    "flag":"성공",
    "priority":"3+"
}
실패 예시<br>
{
    "content": 1234,
    "flag":"성공",
    "priority":"3+"
}
<br>
실패 예시<br>
{
    "content": "내일 할일",
    "flag":"성공",
    "priority":"3+"
}
<br>
**Todo 조회 (GET)**<br>
url | http://localhost:3000/api/todos<br>
<br>
**Todo 수정 (GET)**<br>
url | http://localhost:3000/api/todos/{id}<br>
body(JSON) |<br>
성공 예시<br>
{
    "content":"수정된 오늘할일",
    "flag":1,
    "priority":1
}
실패 예시<br>
{
    "content":"실패된 오늘할일",
    "flag":"1+",
    "priority":1
}
실패 예시<br>
{
    "content":123,
    "flag":3,
    "priority":4
}
**todo 삭제(DELTE)**<br>
url | http://localhost:3000/api/todos/{id}<br>
## 💾 ERD Structure
![ERD structure](/img/drawSQL-image-export-2024-04-18.png)
<br>

