<style>
  @import url(./user.less);
</style>

<template>
<div>
  <Table :columns="columns" :data="youngonListData" border ></Table>
  <Modal
    v-model="isUpdate"
    title="填写站员基本信息"
    @on-ok="_updateYoungon">
    <div>
      <from class="d-from">
        <Input v-model="youngonPersonInfo.username" placeholder="姓名" style="width: 300px"></Input>
        <Input v-model="youngonPersonInfo.email" placeholder="邮箱" style="width: 300px"></Input>
        <Input v-model="youngonPersonInfo.phone" placeholder="电话" style="width: 300px"></Input>
        <Input v-model="youngonPersonInfo.motto" placeholder="座右铭" style="width: 300px"></Input>
      </from>
      <div class="d-select">
        <Select v-model="youngonPersonInfo.grade" style="width:200px">
          <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="youngonPersonInfo.post" style="width:200px">
          <Option v-for="item in postList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="youngonPersonInfo.state" style="width:200px">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="youngonPersonInfo.vip" style="width:200px">
          <Option v-for="item in vipList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="youngonPersonInfo.department" style="width:200px">
          <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
  </Modal>
  <Modal
      v-model="isdelectYoungon"
      title="是否确定删除"
      @on-ok="_delectYoungon">
      <p>删除之后用户将不存在</p>
    </Modal>
  </div>
</div>
</template>

<script>
import {updateYoungon, delectYoungon, getYoungonList} from '@/api/youngon.js'
import {validation} from './utils.js'
export default {
  data () {
    return {
      page: 1,
      youngonPersonInfo: {},
      isUpdate: false,
      isdelectYoungon: false,
      columns: [
        {title: '姓名', key: 'username'},
        {title: '头像', key: 'headerImg',
        render: (h, params) => {
          return h('img', {
            props: {type: 'primary', size: 'small'},
            attrs: {src: params.row.headerImg, style: 'width: 40px;height: 40px; border-radius: 50%;'},
          })
        }
        }, 
        {title: '电话', key: 'phone'},
        {title: '邮箱', key: 'email'},
        {title: '座右铭', key: 'motto'},
        {title: '职务', key: 'post'},
        {title: '年纪', key: 'grade'},
        {title: '状态', key: 'state'},
        {title: 'vip', key: 'vip'},
        {title: '操作', key: 'action', width: 300, align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showupdate(params)}}
             }, '更改信息'),
            h('Button', {
              props: {type: 'error', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showdelectYoungon(params)}}
            }, '删除')])
        }
        }
      ],
      gradeList: [{value: 1, label: '大一'}, {value: 2, label: '大二'}, {value: 3, label: '大三'}, {value: 3, label: '大四'}],
      postList: [{value: 1, label: '站长'}, {value: 2, label: '部长'}, {value: 3, label: '正式站员'}, {value: 3, label: '实习站员'}],
      stateList: [{value: 1, label: '在站'}, {value: 2, label: '不在站'}],
      vipList: [{value: 1, label: '无'}, {value: 2, label: '普通vip'}, {value: 3, label: '尊贵vip'}],
      departmentList: [{value: 1, label: '开发部'}, {value: 1, label: '企划部'}, {value: 1, label: '运营部'}, {value: 1, label: '信息部'},],
      youngonListData: [{
        _id: 'adwdwa',
        id: 'adwdaw',
        username: '田陈永',
        email: '1805170243@qq.com',
        phone: '17320098939',
        headerImg: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',                                 // 头像
        motto: '生活和远方',                                                          // 座右铭
        grade: 2,                                                                    // 1代码大一 2大二  3大三 4大四
        post: 2,                                                                     // 1代表站长 2代表部长 3代表正式站员 4代表实习站员
        state: 1, 
        vip: 1                                                                      // 设计权限问题
      }]
    }
  },
  created () {this._getYoungonList()},
  methods: {
    _getYoungonList () {
      return new Promise((resolve, reject) => {
        const msg = this.$Message.loading({
            content: 'Loading...',
            duration: 0
        });
        let loding = setTimeout(msg, 2000)
        getYoungonList({page: this.page}).then((result) => {
          if (!result) return
          const {data} = result
          this.youngonListData = data
        }).catch(() => {})
      })
    },
    _showupdate (params) {
      this.params = params
      this.youngonPersonInfo = params.row
      this.isUpdate = true
    },
    async _updateYoungon () {
      if (!(await validation(this, this.youngonPersonInfo))) return
      const {_id} = this.params.row
      updateYoungon(this.youngonPersonInfo).then((result) => {
        if (!result) return
        this.$Message.success('更新成功')
      })
    },
    _showdelectYoungon (params) {
      this.params = params
      this.isdelectYoungon = true
    },
    async _delectYoungon() {
      const {_id} = this.params.row
      delectYoungon(_id).then(async(result) => {
        if (!result) return
        this.$Message.error('删除成功')
        await this._getYoungonList()
      })
    }
  }
}
</script>

<style>

</style>
