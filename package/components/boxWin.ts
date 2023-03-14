
import { shallowReactive, render, createVNode, getCurrentInstance } from 'vue'
import BoxWinConstructor from './BoxWin.vue'
import type { BoxWinHandler, BoxWinContext, IBoxwin, BoxWinParams } from '../types/boxWin'
import { getAppendTo } from '../utils/index'

class BoxWin implements IBoxwin {

    index = 1;

    instances: BoxWinContext[] = shallowReactive([])

    getInstance(id: string) {
        const idx = this.instances.findIndex((instance) => instance.id === id)
        const current = this.instances[idx]
        let prev: BoxWinContext | undefined
        if (idx > 0) {
            prev = this.instances[idx - 1]
        }
        return { current, prev }
    }

    closeBoxWin(instance: BoxWinContext) {
        const idx = this.instances.indexOf(instance)
        if (idx === -1) return

        this.instances.splice(idx, 1)
        const { handler } = instance
        handler.close()
    }

    createBoxWin(
        { appendTo, context, ...options }: BoxWinParams,
    ): BoxWinContext {

        const userOnClose = options.onClose

        const container = document.createElement('div')

        const id = 'boxWin' + this.index++

        const props = {
            id,
            ...options,
            onClose: () => {
                userOnClose?.()
                this.closeBoxWin(instance)
            },
        }

        const vnode = createVNode(
            BoxWinConstructor,
            props,
            {
                'head-icon': () => props.headIcon,
                'head-title': () => props.headTitle,
                'head-control': () => props.headControl,
                body: () => props.body,
            }
        )

        vnode.appContext = context || getCurrentInstance()?.appContext

        render(vnode, container)

        // instances will remove this item when close function gets called. So we do not need to worry about it.
        getAppendTo(appendTo)!.appendChild(container.firstElementChild!)

        const vm = vnode.component!

        const handler: BoxWinHandler = {
            // instead of calling the onClose function directly, setting this value so that we can have the full lifecycle
            // for out component, so that all closing steps will not be skipped.
            close: () => {
                render(null, container)
            },
        }

        const instance: BoxWinContext = {
            id,
            vnode,
            vm,
            handler,
            props: (vnode.component as any).props,
        }
        this.instances.push(instance)
        return instance
    }
}

const boxWin: IBoxwin = new BoxWin()

export default boxWin
