# box-win

一款基于vue3的仿windows弹窗。
可以组件模板编写或函数式创建。

![Image text](https://img2023.cnblogs.com/blog/1128866/202303/1128866-20230314200643602-1812928209.gif)

## 安装

```sh
npm add 'box-win'
```

两种方式：

1、组件式引入
```sh
//全局 test为自定义组件
import BoxWin from 'box-win'
app.use(BoxWin)
//或局部引入
import { BoxWin } from 'box-win'

<BoxWin v-model="box1" position="center" :title="'box1'">
    <template #body>
        我是内容区域 
        <test :test="666" />
    </template>
</BoxWin>
```

2、函数式创建
```sh
//test为自定义组件
import { boxWin } from 'box-win'

boxWin.createBoxWin({
    position: 'center',
    bodyStyle: { background: 'blue' },
    headIcon: h(test, {
      test: 111
    }),
    title: '标题',
    body: h(test, {
      test: 333
    }),
    headControl: h(test, {
      test: 444
    }),
})

```

## 配置
```sh
props参数：

    modelValue?: boolean //普通引入控制显示
    title?: string,
    width?: string; // 默认宽 —— 设置头高 宽高最好传入变量
    height?: string; // 默认高
    top?: string; // 默认距离上
    left?: string; // 默认距离左
    position?: string; // 默认比top、left优先，暂时支持center
    animate?: boolean; //是否需要动画
    duration?: number,//动画时间，单位 s
    headHeight?: string; // 默认控制栏高
    headStyle?: Record<string, any>; // 控制栏样式
    bodyStyle?: Record<string, any>; //主要内容区域样式
    resizeAble?: boolean | string; // 是否可以调整尺寸 默认可以调整
    dragAble?: boolean | string; // 是否可以拖拽 默认可拖拽
    minShow?: boolean; // 全屏控制显示 默认显示
    maxShow?: boolean; // 全屏控制显示 默认显示 
    fullShow?: boolean; // 全屏控制显示 默认显示
    closeShow?: boolean; // 关闭控制显示 默认显示
    headIcon?: Slots | HTMLElement,
    headTitle?: Slots | HTMLElement,
    headControl?: Slots | HTMLElement,
    body?: Slots | HTMLElement,

响应事件：

    'update:modelValue',
    'fullscreen', 
    'exitFullscreen', 
    'max', 'restore',
    'min',
    'close'
```

