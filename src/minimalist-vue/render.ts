export type BaseTypes = string | number | boolean

export function isBaseTypes <T>(data: BaseTypes | T): data is BaseTypes {
    if (
        typeof data === 'string'
        || typeof data === 'number'
        || typeof data === 'boolean'
    ) {
        return true
    }
    return false
}

export const EMPTY_OBJ: {
    readonly [key: string]: any
} = {}

export interface VNode {
    el?: HTMLElement
    tag: string
    props?: Record<string, string>
    children?: BaseTypes | VNode[]
}

export function h (tag: string, props?: Record<string, string>, children?: BaseTypes | VNode[]): VNode {
    return {
        tag,
        props,
        children
    }
}

export function mount (vnode: VNode, container: HTMLElement) {
    const { tag, props, children } = vnode
    const el = vnode.el = document.createElement(tag)
    if (props) {
        Object.keys(props).forEach(
            prop => el.setAttribute(prop, props[prop])
        )
    }

    if (isBaseTypes(children)) {
        el.textContent = String(children)
    } else {
        children?.forEach(child => {
            mount(child, el)
        })
    }

    container.appendChild(el)
}

export function patch (oldNode: VNode, newNode: VNode) {
    if (oldNode.tag === newNode.tag) {
        const el = (newNode.el = oldNode.el!)
        const newProps = newNode.props || EMPTY_OBJ
        const oldProps = oldNode.props || EMPTY_OBJ
        patchProps(el, newProps, oldProps)
        patchChildren(el, oldNode.children, newNode.children)
    } else {
        const parentNode = oldNode.el?.parentElement
        if (parentNode) {
            parentNode.removeChild(oldNode.el!)
            mount(newNode, parentNode)
        }
    }
}

export function patchProps (el: HTMLElement, oldProps: Record<string, string>, newProps: Record<string, string>) {
    if (oldProps === newProps) return
    for (const key in newProps) {
        const oldVal = newProps[key]
        const newVal = oldProps[key]
        if (oldVal !== newVal && key !== 'value') {
            setDomProp(el, key, newVal)
        }
    }
    for (const key in oldProps) {
        if (!(key in newProps)) {
            setDomProp(el, key)
        }
    }
}

export function setDomProp (el: HTMLElement, key: string, val?: string) {
    if (!val) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, val)
    }
}

export function patchChildren (el: HTMLElement, oldChildren?: BaseTypes | VNode[], newChildren?: BaseTypes | VNode[]) {
    if (!oldChildren && !newChildren) return
    if (!newChildren || isBaseTypes(newChildren)) {
        el.innerHTML = String(newChildren || '')
        return
    }
    if (!oldChildren || isBaseTypes(oldChildren)) {
        oldChildren = []
    }
    const children: HTMLElement[] = []
    newChildren.forEach((newVn, index) => {
        const oldVn = (oldChildren as VNode[])[index]
        if (oldVn) {
            patch(oldVn, newVn)
        } else {
            children.push(newVn.el!)
        }
    })
    const oldLen = oldChildren.length
    const newLen = newChildren.length
    if (oldLen > newLen) {
        for (let i = oldLen - newLen; i < oldLen; i++) {
            el.removeChild(oldChildren[i].el!)
        }
    }
    el.append(...children)
}
