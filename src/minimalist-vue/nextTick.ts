const resolvedPromise = Promise.resolve()

export function nextTick<T> (this: T, fn?: (this: T) => void): Promise<void> {
    const p = resolvedPromise
    return fn ? p.then(this ? fn.bind(this) : fn) : p
}

setTimeout(() => {
    console.log('0')
    resolvedPromise.then(() => console.log('1'))
}, 0)
resolvedPromise.then(() => {
    console.log('2')
}).then(() => {
    console.log('3')
    return new Promise(resolve => setTimeout(() => {resolve(1); console.log('4')}, 0))
}).then(() => {
    console.log('5')
})
console.log('6')

// 6 2 3 0 1 4 5