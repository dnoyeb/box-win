<template>
  <Transition :name="props.animate ? 'box' : ''">
    <div class="box-win ban-select-font " @mousedown="setCurFront" :style="{
      width: recordBox.width,
      height: recordBox.height,
      left: recordBox.left,
      top: recordBox.top,
    }" :class="'box-win-' + recordBox.state, props.animate ? 'box-win-animate' : ''" ref="boxWin"
      v-show="modelValueControl" v-resize="props.resizeAble && recordBox.state == 'normal'">
      <!-- 拖拽窗体头部 -->
      <div class="box-head" :style="props.headStyle">
        <div class="box-head-left" @dblclick="onRestore($event)" @click="onRestore($event, true)"
          :style="{ cursor: props.dragAble ? recordBox.state == 'normal' ? 'move' : 'default' : 'default' }"
          v-drag="props.dragAble && recordBox.state == 'normal'">
          <slot name="head-icon" />
          <slot name="head-title">
            <span>{{ title }}</span>
          </slot>
        </div>
        <div class="box-head-right">
          <slot name="head-control"></slot>
          <div v-if="props.minShow && recordBox.state != 'min'" class="box-min" @click="onMin" />
          <div v-if="props.maxShow && recordBox.state == 'max'" class="box-restore" @click="onRestore($event)" />
          <div v-if="props.maxShow && recordBox.state != 'max'" class="box-max" @click="onMax" />
          <div v-if="props.fullShow" class="box-full" @click="onFullscreen" />
          <div v-if="props.closeShow" class="box-close" @click="onClose" />
        </div>
      </div>
      <!-- 拖拽框主要部分 -->
      <div class="box-body" :style="props.bodyStyle">
        <slot name="body" />
      </div>
      <div v-if="props.resizeAble && recordBox.state == 'normal'"
        v-for="item in ['resize-n', 'resize-s', 'resize-w', 'resize-e', 'resize-nw', 'resize-ne', 'resize-se', 'resize-sw']"
        :class="item" />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, type Slots } from "vue";
import { enterFullscreen } from '../utils/fullScreen'
import { useZIndex } from "../hooks/use-z-index";
import directives from '../directives/index'
import type { recordType } from '../types/boxWin.d'

export type Props = {
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
}

const vDrag = directives.drag
const vResize = directives.resize
// props传入数据类型约束
/** 组件调整参数默认值 */
const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  width: "500px",
  height: "60vh",
  top: '0',
  left: '0',
  animate: true,
  duration: 0.3,
  headHeight: "35px",
  dragAble: true,
  resizeAble: true,
  minShow: true,
  maxShow: true,
  fullShow: true,
  closeShow: true,
});

//记录原来的大小
const recordBox = reactive<recordType>({
  width: props.width,
  height: props.height,
  top: props.top,
  left: props.left,
  state: 'normal', //min max full normal
});

if (props.position == 'center') {
  recordBox.top = `calc(50% - ${props.height} / 2)`
  recordBox.left = `calc(50% - ${props.width} / 2)`
}

const zIndex = useZIndex()
const boxWin = ref()
const modelValueControl = ref(props.modelValue)

const exitFullscreen = () => {
  // @ts-ignore
  const full = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;//兼容不同浏览器
  if (!full && recordBox.state == 'full') {
    recordBox.state = 'normal'
    emits('exitFullscreen')
  }
}

onMounted(() => {
  //监听窗口退出全屏解决无法监听Esc按键
  window.addEventListener('resize', exitFullscreen)

})
onUnmounted(() => {
  window.removeEventListener('resize', exitFullscreen)
})

// 事件定义
const emits = defineEmits(['update:modelValue', 'fullscreen', 'exitFullscreen', 'max', 'restore', 'min', 'close']);

//最小化偏移距离
const minOffset = ref('0')
//更新最小化左边距离
const updateMinDis = () => {
  const minArr: NodeListOf<HTMLAreaElement> = document.querySelectorAll('.box-win-min');
  minOffset.value = minArr?.length * 50 + 'px';
}

//设置当前点击最前面
const setCurFront = (event: Event) => {
  boxWin.value.style.zIndex = useZIndex()
}

// 最小化控件
const onMin = () => {
  updateRecord()
  updateMinDis()
  recordBox.state = 'min'
  emits('min')
}

//更新记录
const updateRecord = () => {
  if (recordBox.state == 'normal') {
    recordBox.width = boxWin.value?.offsetWidth + 'px';
    recordBox.height = boxWin.value?.offsetHeight + 'px';
    recordBox.top = boxWin.value?.offsetTop + 'px';
    recordBox.left = boxWin.value?.offsetLeft + 'px';
  }
}

// 最大化控件
const onMax = () => {
  updateRecord()
  recordBox.state = 'max'; // 全屏状态变换
  emits('max')
};


//放大或还原
const onRestore = (e: Event, bool = false) => {
  if (bool && recordBox.state != 'min') return
  if (recordBox.state == 'normal') {
    onMax()
    return
  }
  recordBox.state = 'normal';
  emits('restore')
}

//全屏控件
const onFullscreen = () => {
  if (recordBox.state == 'full') return
  updateRecord()
  const dom = boxWin.value?.querySelector('.box-body')
  enterFullscreen(dom)
  recordBox.state = 'full'
  emits('fullscreen')
}


// 内部控制窗口开关
const onClose = () => {
  modelValueControl.value = !modelValueControl.value
  emits('update:modelValue', modelValueControl.value);
  //有动画时，完成后再通知关闭
  if (props.animate) {
    setTimeout(() => {
      emits("close");
    }, props.duration * 1000)
  } else {
    emits("close");
  }
};

defineExpose({
  close: onClose
})
</script>

<style scoped >
/* 禁止选中文字 */
.ban-select-font {
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}

.box-win {
  position: fixed;
  box-sizing: border-box;
  overflow: hidden;
  color: #fff;
  min-width: 200px;
  min-height: v-bind("props.headHeight");
  max-width: 100vw;
  max-height: 100vh;
  background-color: transparent;
  z-index: v-bind("zIndex");
  /*独立其他DOM绘制*/
  /* contain: strict; */
}

.box-win-min {
  width: 200px !important;
  height: v-bind("props.headHeight") !important;
  top: calc(100% - v-bind("props.headHeight")) !important;
  left: v-bind("minOffset") !important;
}

.box-win-max {
  width: 100vw !important;
  height: 100vh !important;
  left: 0 !important;
  top: 0 !important;
}

.box-win-animate {
  transition: width v-bind("duration + 's'"), height v-bind("duration + 's'"), left v-bind("duration + 's'"), top v-bind("duration + 's'");
  transition-timing-function: cubic-bezier(v-bind("duration"), 1, v-bind("duration"), 1);
}

.box-head {
  width: 100%;
  height: v-bind("props.headHeight");
  background: #d3d0d0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.box-head-left {
  height: 100%;
  line-height: v-bind("props.headHeight");
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
}

:deep(.box-head-left)>* {
  margin-left: 5px;
}

.box-head-right {
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.box-head-right>* {
  width: v-bind("props.headHeight");
  height: 100%;
  cursor: pointer;
  margin-left: 5px;
}

.box-min {
  background: url(../assets/min.svg) center/50% no-repeat;
}

.box-max {
  background: url(../assets/max.svg) center/50% no-repeat;
}

.box-restore {
  background: url(../assets/restore.svg) center/50% no-repeat;
}

.box-full {
  background: url(../assets/full.svg) center/50% no-repeat;
}

.box-close {
  background: url(../assets/close.svg) center/50% no-repeat;
}

.box-head-right>*:hover {
  background-color: #939393;
}

.box-close:hover {
  background-color: #f2473e;
}

.box-body {
  width: 100%;
  height: calc(100% - v-bind("props.headHeight"));
  box-sizing: border-box;
  overflow: auto;
  font-size: 13px;
  line-height: 1.6;
  background: rgb(29, 28, 28);
}

/* vue渐入渐出样式 */
.box-enter-from,
.box-leave-to {
  opacity: 0;
  transform: scale(0);
}

.box-enter-to,
.box-leave-from {
  opacity: 1;
}

.box-enter-active,
.box-leave-active {
  transition: all v-bind("duration + 's'") ease;
}

.resize-n {
  position: absolute;
  top: -5px;
  left: 0;
  right: 0;
  height: 10px;
  cursor: n-resize;
  z-index: 2;
}

.resize-e {
  position: absolute;
  top: 0;
  right: -5px;
  bottom: 0;
  width: 10px;
  cursor: w-resize;
  z-index: 2;
}

.resize-s {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 10px;
  cursor: n-resize;
  z-index: 2;
}

.resize-w {
  position: absolute;
  top: 0;
  left: -5px;
  bottom: 0;
  width: 10px;
  cursor: w-resize;
  z-index: 2;
}

.resize-nw {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 15px;
  height: 15px;
  cursor: nw-resize;
  z-index: 2;
}

.resize-ne {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  cursor: ne-resize;
  z-index: 2;
}

.resize-sw {
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 15px;
  height: 15px;
  cursor: ne-resize;
  z-index: 2;
}

.resize-se {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  cursor: nw-resize;
  z-index: 2;
}
</style>
