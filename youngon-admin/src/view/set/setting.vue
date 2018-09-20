<style>
  @import url(./set.less);
</style>

<template>
  <div class="set-box">
    <div class="set-box-view">
      <div class="set-box-image">
        <img :src="setUrl.bg"  style="height: 180px; width: 100%"/>
      </div>
      <div class="but-cen">
        <Upload
          ref="upload"
          name="set"
          :show-upload-list="false"
          :on-success="bgSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :data="inData"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          action="http://wy-admin.tianchenyong.top/Wadmin/upload-set"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
    </div>
    <div class="set-box-view">
      <div class="set-box-image">
        <img :src="setUrl.index"  style="height: 180px; width: 100%"/>
      </div>
      <div class="but-cen">
        <Upload
          ref="upload"
          name="set"
          :on-success="indexSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          :data="bgData"
          type="drag"
          action="http://wy-admin.tianchenyong.top/Wadmin/upload-set"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      setUrl: {
        bg: 'http://wy-admin.tianchenyong.top/backgroundIndex-youngon.jpg',
        index: 'http://wy-admin.tianchenyong.top/backgroundSlider-youngon.jpg'
      },
      bgData: {
        type: 'backgroundSlider'
      },
      inData: {
        type: 'backgroundIndex'
      }
    }
  },
  methods: {
    bgSuccess (res, file) {
      this.$Notice.success({
        title: '更改成功',
        desc: '文件' + file.name + '上传更改成功'
      })
    },
    indexSuccess (res, file) {
      his.$Notice.success({
        title: '更改成功',
        desc: '文件' + file.name + '上传更改成功'
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过大小限制',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    }
  }
}
</script>
