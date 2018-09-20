<style>
  @import url(./notice.less);
</style>

<template>
  <div class="trend-box">
    <div class="swiper-list-box" style="margin-bottom: 20px;">
      <Button type="primary" icon="arrow-up-a" @click="_up">提交</Button>
      <Button type="warning" icon="refresh" style="margin-left: 20px;" @click="_clearContent">清空</Button>
    </div>
    <div class="upload">
      <Input v-model="trend.title" placeholder="请输入标题"  style="width: 400px"/>
      <Upload
        ref="upload"
        name="nav"
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        multiple
        type="drag"
        action="http://wy-admin.tianchenyong.top/Wadmin/upload"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
      </Upload>
      <img :src="trend.picture" class="upload-img"/>
    </div>
    <div>
      <mavon-editor 
        v-model="trend.value"
        placeholder="请输入内容......" 
        @change="_addContent"
        ref="md" 
        @imgAdd="$imgAdd" 
        @imgDel="$imgDel"
      />
    </div>
  </div>
</template>

<script>
import $ from 'axios';
import {upNotice} from '@/api/notice-trend'
const BASEURL = `http://wy-admin.tianchenyong.top`
export default {
  data () {
    return {
      trend: {
        title: '',
        picture: '',
        value: '',
        content: ''
      },
      delectList: []
    }
  },
  methods: {
    _up () {
      for (let key in this.trend) {
        if (!this.trend[key]) {
          this.$Message.error('不允许为空')
          return
        }
      }
      upNotice(this.trend).then((result) => {
        if (!result) return
        this.$Message.success('成功')
        this._clearContent()
      })
    },
    _addContent(value, render) {
      this.trend.content = render
    },
    $imgAdd(pos, $file){
      let formdata = new FormData();
      formdata.append('nav', $file);
      $({
        url: `${BASEURL}/Wadmin/upload`,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((result) => {
        if (!result) return
        const {url} = result.data
        url = `${BASEURL}/${url}`
        const $vm = this.$refs.md
        $vm.$img2Url(pos, url)
      })
    },
    $imgDel(pos) {
      console.log(pos)
    },
    _clearContent () {
      this.trend = {
        title: '',
        picture: '',
        content: '',
        value: ''
      }
    },
    handleSuccess (res, file) {
      this.delectList.push(this.trend.picture)
      this.trend.picture = `${BASEURL}/${res.url}`                 // 后端返回
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

