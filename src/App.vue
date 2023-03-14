<template>
  <div>示例演示：</div>
  <button @click="createBox">createBox</button>
  <BoxWin v-model="box1" position="center" :title="'box1'" closeShow fullShow>
    <template #body>我是内容区域
      <test :test="666" />
    </template>
  </BoxWin>
  <!-- 关闭某些选项 -->
  <BoxWin v-model="box2" :resize-able="false" :title="'box2'" top="300px" :drag-able="false" closeShow fullShow
    :animate="false" width="300px" height="100px">
    <template #head-icon>
      <test :test="555" />
    </template>
  </BoxWin>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import { boxWin } from '../package/index'
import test from './test.vue'
const box1 = ref(true);
const box2 = ref(true);

const createBox = () => {
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
}
</script>

<style></style>
