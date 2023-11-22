## Reference

- [프로미스 스펙 및 요구사항](https://github.com/promises-aplus/promises-spec)
- [프로미스 구현](https://www.promisejs.org/implementing/)

## trouble

### 에러 발생 후의 리턴값으로 then 체이닝

- then 의 onResolved 콜백함수를 task 배열에 저장하고 있음
- 에러 발생 시점을 알 수 없음
- 에러 발생 시

### then, catch 등의 메소드는 "새로운" 프로미스를 반환한다?

- then, catch는 본래 프로미스 (시작 프로미스)의 상태와 상관없이
- 항상 pending 상태의 '새로운' 프로미스를 반환한다
- 즉시

### yeild와 프로미스의 관계

- 반환값을 미룬다는 부분에서 비슷한 것 같음,,,
