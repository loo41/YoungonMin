<template>
  <div>
    <Table :columns="columns" :data="list" border ></Table>
  </div>
</template>

<script>
import {getListList, delLeave, changeCarefully} from '@/api/leave'
export default {
  data () {
    return {
      list: [],
      columns: [
        {title: 'time', key: 'timer'},
        {title: '内容', key: 'content'},
        {title: '精选', key: 'carefully'},
        {title: '昵称', key: 'userName'},
        {title: '操作', key: 'action', width: 300, align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._set(params)}}
             }, '设为精选'),
            h('Button', {
              props: {type: 'error', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._del(params)}}
            }, '删除')])
        }}
      ]
    }
  },
  created () {
    this._getLeaveList()
  },
  methods: {
    _getLeaveList () {
      getListList().then((result) => {
        this.list = result.list
      })
    },
    _set (params) {
      changeCarefully({_id: params.row._id}).then((result) => {
        this.list[params.row._index].carefully = true
      })
    },
    _del (params) {
      delLeave({_id: params.row._id}).then((result) => {
        this.list.splice(params.row._index, 1)
      })
    }
  }
}
</script>

<style>

</style>
