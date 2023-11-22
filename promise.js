const PENDING = 0
const FULFILLED = 1
const REJECTED = 2
let count = 0

function MyPromise(executor) {
  let state = PENDING
  let value = null
  let handlers = []
  const id = ++count

  function fulfill(result) {
    state = FULFILLED
    value = result
    handlers.forEach(handle)
    handlers = []
  }

  function reject(error) {
    state = REJECTED
    value = error
    handlers.forEach(handle)
    handlers = []
  }

  function resolve(result) {
    // TODO: can handle promise
    console.log('resolve', id)
    try {
      fulfill(result)
    } catch (e) {
      reject(e)
    }
  }

  function doResolve(fn, onFulfilled, onRejected) {
    let done = false
    try {
      fn(
        (value) => {
          if (done) return
          done = true
          onFulfilled(value)
        },
        (reason) => {
          if (done) return
          done = true
          onRejected(reason)
        }
      )
    } catch (e) {
      if (done) return
      done = true
      onRejected(e)
    }
  }

  function handle(handler) {
    console.log('handle', id)
    switch (state) {
      case PENDING: {
        handlers.push(handler)
        break
      }
      case FULFILLED: {
        if (handler.onFulfilled && typeof handler.onFulfilled === 'function') {
          // 그냥 바로 호출함
          handler.onFulfilled(value)
        }
        break
      }
      case REJECTED: {
        if (handler.onRejected && typeof handler.onRejected === 'function') {
          handler.onRejected(value)
        }
        break
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {
    setTimeout(() => {
      console.log('done', id)
      handle({ onFulfilled, onRejected })
    }, 0)
  }

  this.then = function (onFulfilled, onRejected) {
    console.log('then', id)
    let self = this
    return new MyPromise((resolve, reject) => {
      self.done(
        (result) => {
          if (typeof onFulfilled === 'function') {
            try {
              resolve(onFulfilled(result))
            } catch (e) {
              reject(e)
            }
          } else {
            resolve(result)
          }
        },
        (error) => {
          if (typeof onRejected === 'function') {
            try {
              resolve(onRejected(error))
            } catch (e) {
              reject(e)
            }
          } else {
            reject(error)
          }
        }
      )
    })
  }

  this.catch = function (onRejected) {
    let self = this
    return new MyPromise((resolve, reject) => {
      self.done(
        (result) => resolve(result),
        (error) => {
          if (onRejected && typeof onRejected === 'function') {
            try {
              resolve(onRejected(error))
            } catch (e) {
              reject(e)
            }
          } else {
            reject(error)
          }
        }
      )
    })
  }

  console.log('init', id)
  doResolve(executor, resolve, reject)
}

// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve(1), 5000)
// }).done((value) => console.log('done', value))

// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve(1), 5000)
// })
//   .then((v) => console.log('then 1', v))
//   .then((v) => console.log('then 2', v))
//   .then((v) => console.log('then 3', v))

const p1 = new MyPromise((resolve, reject) => {
  // setTimeout(() => reject(1), 5000)
  setTimeout(() => resolve(1), 5000)
})
  .then((v) => {
    console.log('then 1', v)
    return v + 1
  })
  .then((v) => {
    console.log('then 2', v)
    return v + 1
  })
  .catch((v) => {
    console.log('catch 3', v)
    return v + 1
  })
  .then((v) => {
    console.log('then 4', v)
    return v + 1
  })

// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => reject(1), 5000)
//   // setTimeout(() => resolve(1), 5000)
// })
//   .then((v) => console.log('then 3', v))
//   .catch(3)
//   .catch((e) => {
//     console.log('catch 2', e)
//     return 2
//   })
//   .catch((e) => console.log('catch 3', e))
//   .then((v) => console.log('then 1', v))
//   .then((v) => {
//     console.log('then 2', v)
//     throw v
//   })
//   .catch((e) => console.log('catch 4', e))
