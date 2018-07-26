<template>
</template>

<script>
import { initNav } from '@/api/nav'
export default {
  created () {
    this._init()
  },
  methods: {
    _init () {
      initNav().then(res => {
        if (!res) return
        this.$Message.info('初始化成功成功')
      })
    }
  }
}
</script>

<style>

</style>
