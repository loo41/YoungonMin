<style>
  @import url(./user.less);
</style>


<template>
  <div>
    <Table :columns="columns" :data="userListData" border ></Table>
    <div style="margin-top: 50px"><Page :total="count" :page-size="20" @on-change="_loadingMore"/></div>
    <Modal
      v-model="isaddUser"
      title="填写站员基本信息"
      @on-ok="_addUser">
      <div>
        <from class="d-from">
          <Input v-model="youngonInfo.username" placeholder="用户名" style="width: 300px"></Input>
          <Input v-model="youngonInfo.email" placeholder="邮箱" style="width: 300px"></Input>
          <Input v-model="youngonInfo.phone" placeholder="电话" style="width: 300px"></Input>
          <Input v-model="youngonInfo.motto" placeholder="座右铭" style="width: 300px"></Input>
        </from>
        <div class="d-select">
          <Select v-model="youngonInfo.grade" style="width:200px">
            <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="youngonInfo.post" style="width:200px">
            <Option v-for="item in postList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="youngonInfo.state" style="width:200px">
            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="youngonInfo.vip" style="width:200px">
            <Option v-for="item in vipList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="youngonInfo.department" style="width:200px">
            <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div>
          <div class="duty">TIME</div>
          <div>
            <Select v-model="youngonInfo.fistWorkTimeDate" style="width:200px">
              <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="youngonInfo.fistWorkTimeTime" style="width:200px">
              <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div>
            <Select v-model="youngonInfo.secondWorkTimeDate" style="width:200px">
              <Option v-for="item in dateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="youngonInfo.secondWorkTimeTime" style="width:200px">
              <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="isdelectUser"
      title="是否确定删除"
      @on-ok="_delectUser">
      <p>删除之后用户将不存在</p>
    </Modal>
  </div>
</template>

<script>
import {isYoungon, addYoungon, delectUser, getUserList} from '@/api/youngon.js'
import {validation} from './utils.js'
export default {
  data () {
    return {
      count: 0,
      youngonInfo: {
        _id: '',
        id: '',
        username: '',
        email: '',
        phone: '',
        motto: '',
        grade: '',
        post: '',
        state: '',
        vip: '',
        department: '',
        fistWorkTimeDate: '',
        fistWorkTimeTime: '',
        secondWorkTimeDate: '',
        secondWorkTimeTime: ''
      },
      isaddUser: false,
      isdelectUser: false,
      columns: [
        {title: '微信名称', key: 'nickName'},
        {title: '头像', key: 'avatarUrl',
        render: (h, params) => {
          return h('img', {
            props: {
              type: 'primary',
              size: 'small'
            },
            attrs: {
              src: params.row.avatarUrl, style: 'width: 40px;height: 40px; border-radius: 2px;'
            },
            style: {
            },
          })
        }
        }, 
        {title: '性别', key: 'gender'},
        {title: '城市', key: 'city'},
        {title: '省份', key: 'province'},
        {title: '国家', key: 'country'},
        {title: '操作', key: 'action', width: 300, align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showAdd(params)}}
             }, 'add+站员'),
            h('Button', {
              props: {type: 'error', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showdelectUser(params)}}
            }, '删除')])
        }
        }
      ],
      userListData: [
        {
          _id: 'adadwda',
          id: 'adawdawd', 
          nickName: 'John Brown', 
          avatarUrl: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',  
          gender: '1805170243@qq.com', city: '贵州',
          province: '贵州', country: '中国'
        }
      ],
      gradeList: [{value: 1, label: '大一'}, {value: 2, label: '大二'}, {value: 3, label: '大三'}, {value: 3, label: '大四'}],
      postList: [{value: 1, label: '站长'}, {value: 2, label: '副站'}, {value: 3, label: '部长'}, {value: 4, label: '正式站员'}, {value: 5, label: '实习站员'}],
      stateList: [{value: 1, label: '在站'}, {value: 2, label: '不在站'}],
      vipList: [{value: 1, label: '无'}, {value: 2, label: '普通vip'}, {value: 3, label: '尊贵vip'}],
      departmentList: [{value: 1, label: '开发部'}, {value: 2, label: '企划部'}, {value: 3, label: '运营部'}, {value: 4, label: '信息部'}],
      dateList: [{value: 1, label: '周一'}, {value: 2, label: '周二'}, {value: 3, label: '周三'}, {value: 4, label: '周四'}, {value: 4, label: '周五'}],
      timeList: [{value: 1, label: '第一大节'}, {value: 2, label: '第二大节'}, {value: 3, label: '第三大节'}, {value: 4, label: '第四大节'}]
    }
  },
  created () {
    this._getUserList(1)
  },
  methods: {
    _getUserList (page) {
      return new Promise((resolve, reject) => {
        const msg = this.$Message.loading({
            content: 'Loading...',
            duration: 0
        });
        let loding = setTimeout(msg, 2000)
        getUserList({page}).then((result) => {
          const {data, count} = result
          this.userListData = data
          this.count = count
        }).catch(() => {})
      })
    },
    _loadingMore (page) {
      this._getUserList(page)
    },
    _showAdd(params) {
      isYoungon({id: params.row.id}).then((result) => {
        if (!result) return
        this.youngonInfo = {
          _id: params.row._id, 
          id: params.row.id, 
          username: '', 
          email: '', 
          phone: '', 
          motto: '', 
          grade: '', 
          post: '', 
          vip: '', 
          state: '',
          department: '',
          fistWorkTimeDate: '',
          fistWorkTimeTime: '',
          secondWorkTimeDate: '',
          secondWorkTimeTime: ''
        },
        this.isaddUser = true
      }).catch(() => {
        this.$Message.info('站员已经存在/发生错误')
      })
    },
    async _addUser() {
      if (!(await validation(this, this.youngonInfo))) return
      addYoungon(this.youngonInfo).then((result) => {
        if (!result) return
        this.$Message.success('添加成功')
      })
    },
    _showdelectUser (params) {
      this.params = params
      this.isdelectUser = true
    },
    async _delectUser () {
      const {_id} = this.params.row
      delectUser(_id).then((result) => {
        if (!result) return
        this.userListData.splice(this.params.index, 1)
      })
    }
  }
}
</script>