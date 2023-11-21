const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
}

addToTaskQueue = (task) => setTimeout(task, 0)
isEmpty = (arr) => Array.isArray(arr) && arr.length === 0

class MyPromise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = null
    this.error = null
    this.fulfilledTasks = []

    executor(MyPromise.resolve.bind(this), MyPromise.reject.bind(this))
  }

  static resolve(value) {
    if (this.status !== STATUS.PENDING) {
      return this
    }
    this.value = value
    this.status = STATUS.FULFILLED
    this.fulfilledTasks.forEach((task) => {
      addToTaskQueue(task)
    })
  }

  static reject(error) {
    if (this.status !== STATUS.PENDING) {
      return this
    }
    this.error = error
    this.status = STATUS.REJECTED
    if (this.rejectedFunc) {
      this.rejectedFunc()
    }
  }

  then(onFulfilled, onRejected) {
    console.log('in then, ', this.status)
    const fulfilledTask = () => {
      this.value = onFulfilled(this.value)
    }

    switch (this.status) {
      case STATUS.PENDING: {
        this.fulfilledTasks.push(fulfilledTask)
        return this
      }
      case STATUS.FULFILLED: {
        addToTaskQueue(fulfilledTask)
        return this
      }
      case STATUS.REJECTED: {
        if (onRejected) {
          addToTaskQueue(() => onRejected(this.error))
        }
        return this
      }
    }
  }

  catch(onRejected) {
    console.log('in catch', this.status)
    const rejectedTask = () => onRejected(this.error)
    switch (this.status) {
      case STATUS.PENDING: {
        this.rejectedFunc = rejectedTask
        return this
      }
      case STATUS.FULFILLED: {
        return this
      }
      case STATUS.REJECTED: {
        addToTaskQueue(rejectedTask)
        return this
      }
    }
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('start')
    resolve(1)
  }, 5000)
})
  .then((value) => {
    console.log('then 1.', value)
    return value + 1
  })
  .then((value) => {
    console.log('then 2.', value)
  })
  .then(() => {
    console.log('finally', this)
  })

// const p2 = new MyPromise((_, reject) => {
//   setTimeout(() => reject('error!'), 5000)
// })
//   .then((value) => console.log('then', value))
//   .catch((err) => console.log('catched', err))

// test
// 1. Resolve
// - then 체이닝이 가능한가
// - then을 통해 반환되는 값이 올바르게 전달되는가

// 2. Reject
// - reject된 경우
//      1) 중간 then (onFulfilled) 함수는 호출되지 않는다
//      2) 가장 가까운 catch가 호출된다
//      3) 호출된 catch 이후 함수는 호출되지 않는다.

// 3. throw error: 중간에 에러가 발생한 경우
// - 에러 발생 전 then은 올바르게 동작한다 (resolve와 동일)
// - 에러 발생 후 catch에 에러가 잡힌다 (reject와 동일)
