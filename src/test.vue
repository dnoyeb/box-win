<template>
    <button @click="test">组件</button>
</template>
  
<script lang="ts" setup>

const prop = defineProps(['test'])

const test = () => {
    alert(prop.test)
}
</script>
  
<style></style>
  