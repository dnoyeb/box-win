import { Props } from '../components/BoxWin.vue'
// 窗体记录数据类型约束
export type BoxWinParams = Props & {
    appendTo: HTMLElement,
    context: AppContext,
    onClose: Function
}

export interface recordType {
    width: string;
    height: string;
    top: string;
    left: string;
    state: string;
}

export interface IBoxwin {
    getInstance: Function
    closeBoxWin: Function
    createBoxWin: Function
}

export interface BoxWinHandler {
    close: () => void
}

export type BoxWinContext = {
    id: string,
    vnode: VNode
    handler: BoxWinHandler
    vm: ComponentInternalInstance
    props: any
}

export declare interface AppContext {
    app: App;
    config: AppConfig;
    mixins: ComponentOptions[];
    components: Record<string, Component>;
    directives: Record<string, Directive>;
    provides: Record<string | symbol, any>;
    /* Excluded from this release type: optionsCache */
    /* Excluded from this release type: propsCache */
    /* Excluded from this release type: emitsCache */
    /* Excluded from this release type: reload */
    /* Excluded from this release type: filters */
}