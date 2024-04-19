<div align=center>
  <h1>TODO 정기 구독 서비스</h1>
  비회원은 email, password로 가입<br>
  처음 가입 시 plan은 FREE<br>
  

</div>
<br>

## 테이블 생성 쿼리<br>
.env는 편의상 일부러 삭제하지 않았습니다.

## 테이블 생성 쿼리<br>

```
CREATE DATABASE simplelogis
```

## 데이터 쿼리 파일위치<br>

```
루트폴더 > user.sql
루트폴더 > todo.sql
```

<br>
## 서버 실행 방법<br>

```sh
1) 패키지 설치 npm i
2) 서버 실행 npm run start:dev
```

## API Receipt
**회원가입(POST)**<br>
- url : http://localhost:3000/api/auth/sign-up<br>

- body(JSON)<br>

```JSON
{
    "email":"abc@abc.com",
    "password":"a1234"
}
```

```JSON
{
    "email":"abc1@abc.com",
    "password":"a1234"
}
```
---


**로그인(POST)**<br>
- url : http://localhost:3000/api/auth/sign-in<br>

- body(JSON) <br>

```JSON
{
    "email":"abc@abc.com",
    "password":"a1234"
}
```

```JSON
{
    "email":"abc1@abc.com",
    "password":"a1234"
}
```
---

**결제하기(PATCH)**<br>
- url : http://localhost:3000/api/users/plan<br>

- body(JSON) <br>

성공예시 : BASIC <br>

```JSON
{
    "plan":"BASIC",
    "cost": 3000
}
```

성공 예시 : PRO <br>

```JSON
{
    "plan":"PRO",
    "cost": 5000
}
```

실패 예시 <br>

```JSON
{
    "plan":"BASIC",
    "cost": 5000
}
```
---

**Todo 만들기 (POST)**<br><br>
- url : http://localhost:3000/api/todos<br>
- body(JSON) <br>
성공 예시<br>

```JSON
{
    "content":"오늘할일",
    "flag":1,
    "priority":1
}
```

실패 예시<br>

```JSON
{
    "content": 1234,
    "flag":"성공",
    "priority":"3+"
}
```

실패 예시<br>

```JSON
{
    "content": 1234,
    "flag":"성공",
    "priority":"3+"
}
```

실패 예시<br>

```JSON
{
    "content": "내일 할일",
    "flag":"성공",
    "priority":"3+"
}
```
---

**Todo 기본 조회 (GET)**<br>
- url : http://localhost:3000/api/todos<br>
- 결과 : 최신 수정순으로 해당 유저의 todo리스트 데이터 반환
<br>

---

**Todo 우선순위 내림차순으로 페이지 조회 (GET)**<br>
- url : http://localhost:3000/api/todos/{:page}<br>
- 결과 : 우선순위 중요도 순으로 해당 유저의 todo리스트 5개씩 해당 페이지의 데이터 반환
<br>

---

**Todo 수정 (GET)**<br>
- url | http://localhost:3000/api/todos/{id}<br>
body(JSON) |<br>
성공 예시<br>

```JSON
{
    "content":"수정된 오늘할일",
    "flag":1,
    "priority":1
}
```

실패 예시<br>

```JSON
{
    "content":"실패된 오늘할일",
    "flag":"1+",
    "priority":1
}
```

실패 예시<br>

```JSON
{
    "content":123,
    "flag":3,
    "priority":4
}
```

---

**todo 삭제(DELTE)**<br>
- url : http://localhost:3000/api/todos/{id}<br>
- 결과 : 유저의 todo_id번 값이 삭제됨

---

## 💾 ERD Structure
![ERD structure](/img/drawSQL-image-export-2024-04-19.png)
<br>

