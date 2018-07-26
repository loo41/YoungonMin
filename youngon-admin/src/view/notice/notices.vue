<style>
  @import url(./notice.less);
</style>

<template>
  <div>
    <div class="trends" v-for="(item, index) in noticeList" :key="index">
      <div class="trends-title">
        <div>标题: {{item.title}}</div>
        <div>作者: {{item.author}}</div>
      </div>
      <div style="width: 200px;"><img :src="item.picture" class="trends-img"/></div>
      <div>
        <Button type="primary" icon="arrow-up-a" @click="_change(index)">更改</Button>
        <Button type="warning" icon="error" style="margin-left: 20px;" @click="_Showdelect(index)">删除</Button>
      </div>
    </div>
    <div>
      <Modal
        v-model="updateTrends"
        title="更改动态"
        @on-ok="_updateTrends"
        @on-cancel="_cancel"
        >
        <div>
          <div class="trends-change_title">
            <Input v-model="content.title"  />
            <Input v-model="content.author" />
          </div>
          <div class="trends-change_image">
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
              action="http://wy-admin.tianchenyong.top/Wadmin/upload"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
            <img :src="content.picture" style="width: 200px; height: 100px;" />
          </div>
        </div>
      </Modal>
    </div>
    <div>
      <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>Delete confirmation</span>
        </p>
        <div style="text-align:center">
            <p>你确定删除它</p>
            <p>删除之后将没有此动态</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" @click="_delect">Delete</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {updateContent, delect, getList} from '@/api/notice-trend'
import { delectImage } from '@/api/nav'
export default {
  data () {
    return {
      updateTrends: false,
      page: 1,
      modal2: false,
      content: {},
      noticeList: [{
        _id: 'adwdwadwa',
        title: 'adwadwadwa',
        picture: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',
        author: 'Tcyong',
        timer: '1256'
      },
      {
        _id: 'adwdwadwa',
        title: 'adwadwadwa',
        picture: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',
        author: 'Tcyong',
        timer: '1256'
      }],
      delectList: []
    }
  },
  created () {
    this._getlist()
  },
  methods: {
    _getlist () {
      getList({page: this.page, type: 2}).then((result) => {
        if (!result) return
        this.page = this.page+1
        this.noticeList = result.data   // 20
      })
    },
    _Showdelect (index) {
      this.modal2 = true
      this.content = this.noticeList[index]
      this.content.i = index
    },
    async _updateTrends () {
      this.content.type = 2
      updateContent(this.content).then((result) => {
        if (!result) return
        this.$Message.success('更新成功')
      })
      await delectImage({list: this.delectList})
    },
    async _cancel () {
      if (this.delectList.length === 0) return
      this.delectList.push(this.content.picture)
      this.delectList.shift()
      delectImage.then(() => {
        this.$Message.success('多余图片已经删除')
      }) 
    },
    _cancel () {return null},
    _change (index) {
      this.updateTrends = true
      this.content = this.noticeList[index]
    },
    _delect () {
      delect({_id: this.content._id, type: 2}).then((result) => {
        if (!result) return
        this.$Message.success('删除成功')
        this.modal2 = false
        this.noticeList.splice(this.content.i, 1)
      })
    },
    handleSuccess (res, file) {
      this.delectList.push(this.content.picture)
      this.content.picture = `${BASEURL}/${res.url}`                 // 后端返回
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
