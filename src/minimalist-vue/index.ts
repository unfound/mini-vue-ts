import { reactive, effect } from './effect'
import { h, patch, mount } from './render'

export function testEffect () {
    const state = reactive({
        a: 1
    })
    
    effect(() => {
        console.log(`state.a: ${state.a}`)
    })
    
    const button = document.createElement('button')
    button.onclick = () => {
        state.a++
    }
    button.innerText = '点我+1'
    document.body.append(button)
}

export function testRender () {
    const vnode = h('div', {
        id: 'test'
    }, [
        h('span', { class: 'red' }, '试试看吧'),
        h('span', undefined, '不看'),
    ])

    mount(vnode, document.getElementById('app')!)

    const button = document.createElement('button')
    button.onclick = () => {
        const vnode2 = h('div', { id: 'test' }, [
            h('span', { class: 'green'}, '改变了')
        ])
        patch(vnode, vnode2)
    }
    button.innerText = '点我变色'
    document.body.append(button)
}
