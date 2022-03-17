export type anyFn = () => any

let activeEffect: anyFn | undefined = void 0
const targetMap = new WeakMap()

export class Dep {
    list = new Set<anyFn>()

    depend () {
        if (activeEffect) {
            this.list.add(activeEffect)
        }
    }

    notify () {
        this.list.forEach(effect => effect())
    }
}

export function effect<T = any> (fn: () => T) {
    activeEffect = fn
    activeEffect()
    activeEffect = void 0
}

export function getDep (target: object, prop: string | symbol): Dep {
    let depMap: Map<string | symbol, Dep> | undefined = targetMap.get(target)
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }
    let dep = depMap.get(prop)
    if (!dep) {
        dep = new Dep()
        depMap.set(prop, dep)
    }

    return dep
}

export function reactive<T extends object>(obj: T): T
export function reactive(obj: object) {
    return new Proxy(obj, {
        get (target, prop, receiver) {
            const dep = getDep(target, prop)
            dep.depend()
            return Reflect.get(target, prop, receiver)
        },
        set (target, prop, newVal, receiver) {
            const dep = getDep(target, prop)
            if (Reflect.get(target, prop, receiver) !== newVal) {
                const value = Reflect.set(target, prop, newVal, receiver)
                dep.notify()
                return value
            }
            return false
        }
    })
}
