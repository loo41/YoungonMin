<template>
  <div>
    <div class="joke-title-box">
      <div>序号</div>
      <div>用户名</div>
      <div>内容</div>
      <div>时间</div>
      <div>操作</div>
    </div>
    <div>
      <div v-for="(item, i) in list" :key="i" class="joke-list-box">
        <div>{{i+1}}</div>
        <div>{{item.username}}</div>
        <div>{{item.content}}</div>
        <div>{{item.timer}}</div>
        <div><Button type="error" @click="_delect(item._id, i)">删除</Button></div>
      </div>
    </div>
  </div>
</template>

<script>
import {getJokeList, delJoke} from '@/api/youngon.js'
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this._getJokeList()
  },
  methods: {
    _getJokeList () {
      getJokeList().then((result) => {
        if (!result) return
        this.list = result.list
      })
    },
    _delect (_id, i) {
      delJoke({_id: _id}).then((result) => {
        if (!result) return
        this.list.splice(i, 1)
      })
    }
  }
}
</script>

<style>
.joke-title-box {
  height: 50px;
  display: flex;
}
.joke-title-box div{
  flex: 1;
  border: 1px solid #E9EAEC;
  display: flex;
  justify-content: center;
  align-items: center;
}
.joke-list-box {
  height: 50px;
  display: flex;
}
.joke-list-box div{
  flex: 1;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
