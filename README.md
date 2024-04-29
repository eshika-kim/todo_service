<div align=center>
  <h1>TODO 정기 구독 서비스</h1>
  비회원은 email, password로 가입<br>
  처음 가입 시 plan은 FREE<br>
</div>
<br>

## 04/26 feedback

### USER CREATE
- 회원가입 시 비밀번호가 영소문자 + 숫자 조합을 하지 않아도 string타입이면 통과 됨
  - DTO에 정규식 표현을 넣어 영소문자 + 숫자조합만 통과되도록 변경
  ```
  /src/user/entities/user.entity.ts 22 ~ 28번째 줄
  ```

### TODO GET
1. find 메서드 여러 개 => 한 개로 변경 <br>

```
/src/todo/todo.service.ts
```

2. 반환 값 추가 : user_id, todo_id, count 포함 <br><br>

3. 정렬 방식 변경 <br>
- sort 
```
수정최신 정렬 : http://localhost:3000/api/todos
우선순위 정렬 : http://localhost:3000/api/todos?sort=priority
완료여부 정렬 : http://localhost:3000/api/todos?sort=flag
```

- 한 번에 볼 todo개수 : 5 or 10개 (기본 값 : 5)<br>
```
수정최신 정렬 : http://localhost:3000/api/todos?size=10
우선순위 정렬 : http://localhost:3000/api/todos?sort=priority&size=10
완료여부 정렬 : http://localhost:3000/api/todos?sort=flag&size=10
```
- 페이지 번호 조회<br>
```
수정최신 정렬 : http://localhost:3000/api/todos?size=10&page=2
우선순위 정렬 : http://localhost:3000/api/todos?sort=priority&size=10&page=2
완료여부 정렬 : http://localhost:3000/api/todos?sort=flag&size=10&page=2
```

4. 쿼리 유효성 검사 dto 추가
```
/src/todo/dto/get-todo.dto.ts
```

### TODO CREATE
- 예외처리 한 번에 처리하여 코드 반복 감소 <br>
```
/src/todo/todo.service.ts 34 ~ 44번째 줄
```

### TODO UPDATE
- todo 수정 시 아이디가 없을 때 성공 메세지 반환하는 오류<br>
  - 실패 메세지 반환(400)하도록 변경<br>

### TODO DELETE
- todo 삭제 시 아이디가 없을 때 성공 메세지 반환하는 오류<br>
  - 실패 메세지 반환(400)하도록 변경<br>
- 물리적 삭제 => 논리적 삭제로 변경
  ```
  /src/todo/todo.service.ts 110~112번째 줄
  ```
  이로 인한 select query도 deleted_at = null만 조회하도록 변경하였습니다!

## 데이터 쿼리 파일 변경<br>
update 하였습니다!
```
# 루트폴더
user_240429.sql
# 루트폴더
todo_240429.sql
```

## 참고 사항 <br>
.env는 편의상 삭제하지 않았습니다.

## 테이블 생성 쿼리<br>

```
CREATE DATABASE simplelogis
```




## 서버 실행 방법<br>

```sh
# 1) 패키지 설치
$ npm i

# 2) 서버 실행
$ npm run start:dev
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

