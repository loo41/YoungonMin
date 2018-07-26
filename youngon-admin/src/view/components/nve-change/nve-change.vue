<template>
  <Modal
    v-model="nveChange"
    title="添加或者更改导航设置"
    @on-ok="_asyncOK"
    @on-cancel="_cancel"
    >
    <div>
      <div>
        <div class="img-box"><img :src="navData.url" v-if="navData.url" width="300px" height="150px;"/></div>
        <div class="uploadImg">
          <Select v-model="navData.OuterChain.type" style="width:200px">
              <Option v-for="item in outerChain" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div>
            <Upload
              ref="upload"
              name="nav"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              multiple
              type="drag"
              :action="upUrl"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
        </div>
      </div>
      <div v-if="navData.OuterChain.type === 0">
        <p class="o-type">该类型没有外连接</p>
      </div>
      <div v-else-if="navData.OuterChain.type === 1">
        <p class="o-type">外链接设置</p>
        <div class="o-input">
          <Input v-model="navData.OuterChain.url" placeholder="请输入链接地址" style="width: 300px" />
        </div>
      </div>
      <div v-else="navData.OuterChain.type === 2">
        <p class="o-type">小程序链接设置</p>
        <div class="o-input">
          <Input v-model="navData.OuterChain.appId" placeholder="请输入appId" style="width: 300px" />
          <Input v-model="navData.OuterChain.path" placeholder="请输入小程序路径" style="width: 300px" />
        </div>
        <div>
          <p class="o-type">
            添加额外的参数
            <Button type="primary" @click="_add">+</Button>
          </p>
          <div v-for="item in navData.OuterChain.extraData" class="extradata-box">
            <p>{{item.name}}</p>
            <Input v-model="item.value" placeholder="请输入参数的值" style="width: 300px" />
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import {dealWith, clone} from './utils'
import { delectImage } from '@/api/nav'
const BASEURL = `http://wy-admin.tianchenyong.top`
export default {
  data () {
    return {
      upUrl: `http://wy-admin.tianchenyong.top/Wadmin/upload`,
      delectList: [],
      newObject: {},
      outerChain: [
        {value: 0, label: '不进行其他操作'},
        {value: 1, label: '其他外部链接'},
        {value: 2, label: '其他小程序跳转'}
      ]
    }
  },
  props: {
    nveChange: {
      type: Boolean,
      default: false
    },
    navData: {
      type: Object,
      default: {
        url: '',
        OuterChain: {url: '', type: 1, appId: '', path: '', extraData: []}       
      }
    },
    close: {
      type: Function
    },
    delect: {
      type: Function
    }
  },
  watch: {
    navData () {
      this.newObject = clone(this.navData)
    }
  },
  methods: {
    async _cancel () {
      if (this.delectList.length !== 0) this.delectList.push(this.navData.url)
      for (let key in this.newObject) {
        this.navData[key] = this.newObject[key]
      }
      if (this.newObject.new) this.delect()
      if (this.delectList.length !== 0) {
        this.delectList.shift()
        await delectImage({list: this.delectList})
      }
      this.close()
    },
    async _asyncOK () {
      try {
        let info = dealWith(this, this.navData)
        if (!info) {
          this._cancel()
          return false
        }
        if(this.delectList.length !== 0) await await delectImage({list: this.delectList})
      }catch(e) {
        console.log(e)
        if (this.newObject.new) this.delect()
      }finally {
        this.close()
      }
    },
    _add () {
      this.navData.OuterChain.extraData.push({name: '', value: ''})
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.navData.OuterChain.extraData[this.navData.OuterChain.extraData.length-1].value,
              autofocus: true,
              placeholder: '请输入你的参数名字'
            },
            on: {
              input: (val) => {
                this.navData.OuterChain.extraData[this.navData.OuterChain.extraData.length-1].name = val
              }
            }
          })
        }
      })

    },
    handleSuccess (res, file) {
      this.delectList.push(this.navData.url)
      this.navData.url = `${BASEURL}/${res.url}`              // 后端返回
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过大小限制',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    }
  }
}
</script>

<style>

</style>
