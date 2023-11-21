// params: (resolve, reject) => void
/**
 *
 * @param {resolve, reject} executor
 * ?? then 이후 반환되는 값은 "새로운" 프로미스인가?
 * rejected 됐을 경우 then onRejection, catch 만 호출됨
 * rejected 됐을 때 여러 then 체이닝이 있을 경우 가장 가까운 catch 문에 잡혀야함
 *
 * ?? prototype으로 상속 (constructor) 구현
 */
function MyPromise(executor) {
  const status = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
  }

  this.status = status.PENDING
  this.value = null
  this.error = null

  // private
  // ** 중요! 콜스택이 아니라 큐에서 처리하게 함
  const addToTaskQueue = (task) => setTimeout(task, 0)

  this.then = function (onResolve, onRejection) {
    const fulfilledTask = () => {
      console.log('then')
      onResolve(this.value)
    }
    switch (this.status) {
      case status.PENDING: {
        this.fulfilledFn = fulfilledTask
        break
      }
      case status.FULFILLED: {
        addToTaskQueue(fulfilledTask)
        break
      }
      case status.REJECTED: {
        break
      }
    }
  }

  this.resolve = function (value) {
    this.status = status.FULFILLED
    this.value = value
    addToTaskQueue(this.fulfilledFn)
  }

  this.reject = function (error) {}

  this.catch = function (callback) {
    callback(this.error)
  }

  executor(this.resolve.bind(this), this.reject.bind(this))
}

const p = new MyPromise((resolve, reject) => {
  console.log('executed')
  setTimeout(() => resolve(2), 3000)
})
p.then((value) => console.log('resolved', value))
