<style>
  @import url(./nav.less);
</style>

<template>
  <div class="swiper-box">
    <div class="swiper">
      <!-- 提交设置  -->
      <div class="swiper-list-box update">
        <Button type="primary" icon="arrow-up-a" @click="_updateSwiper">更新</Button>
        <Button type="warning" icon="refresh" style="margin-left: 20px;" @click="_getListInfo">还原</Button>
      </div>
      
      <div class="swiper-list-box">
        <p>是否显示控制面板</p>
        <i-switch size="large" :value="swiperObject.indicatorDots" @on-change="_changeindicatorDots">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>

      <div class="swiper-list-box">
        <p>是否自动切换</p>
        <i-switch size="large" :value="swiperObject.autoplay" @on-change="_changeautoplay">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>

      <div class="swiper-list-box">
        <p>是否采用衔接滑动</p>
        <i-switch size="large" :value="swiperObject.circular"  @on-change="_changecircular">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>

      <div class="swiper-list-box">
        <p>滑动方向是否为纵向</p>
        <i-switch size="large" :value="swiperObject.vertical"  @on-change="_changevertical">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </div>

      <div class="swiper-list-box">
        <p>指示点颜色</p>
        <ColorPicker v-model="swiperObject.indicatorColor" />
      </div>
      
      <div class="swiper-list-box">
        <p>当前选中的指示点颜色</p>
        <ColorPicker v-model="swiperObject.indicatorActiveColor" />
      </div>

      <div class="swiper-list-box">
        <p>当前所在滑块的 index</p>
        <Slider v-model="swiperObject.current" style="width: 50%" :max="swiperObject.imgUrls.length+1"/>
      </div>

      <div class="swiper-list-box">
        <p>自动切换时间间隔</p>
        <Slider v-model="swiperObject.interval" style="width: 50%" :min="100" :max="10000" :step="100"/>
      </div>

      <div class="swiper-list-box">
        <p>滑动动画时长</p>
        <Slider v-model="swiperObject.duration" style="width: 50%" :min="100" :max="1000" :step="50"/>
      </div>

      <div class="swiper-list-box">
        <p>同时显示的滑块数量</p>
        <Slider v-model="swiperObject.displayMultipleItems" style="width: 50%" :min="0" :max="10" :step="1"/>
      </div>

      <div class="swiper-list-box">
        <p>前边距</p>
        <Slider v-model="swiperObject.previousMargin" style="width: 50%" :min="0" :max="500" :step="1"/>
      </div>

      <div class="swiper-list-box">
        <p>后边距</p>
        <Slider v-model="swiperObject.nextMargin" style="width: 50%" :min="0" :max="500" :step="1"/>
      </div>

      <!-- 公告设置  -->
      <div class="swiper-list-box">
        <p>公告</p>
        <div class="notice">
          <i-switch size="large" :value="swiperObject.notice.status"  @on-change="_changenotice">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <Input v-model="swiperObject.notice.content" placeholder="公告内容" style="width: 300px" />
        </div>
      </div>

      <!-- 导航图设置  -->
      <div class="swiper-list-box img-box">
        <div class="img-box-title">导航图片及其链接设置</div>
        <div class="img-box-but">
          <Button type="primary" icon="plus-round" @click="_add">add+</Button>
        </div>
        <div v-for="(item, index) in swiperObject.imgUrls" class="img-box_swaper">
          <div>
            <img :src="item.url" width="300px" height="150px;">
          </div>
          <div>
             <Select v-model="item.OuterChain.type" style="width:200px" disabled>
                <Option v-for="item in outerChain" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div>
            <Button type="primary" icon="wrench" @click="_change(index)">更改</Button>
            <Button type="warning" icon="arrow-up-c" @click="_up(index)">排名</Button>
            <Button type="error" icon="trash-a" @click="_delectImg(index)">删除</Button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <nve-change 
        :nveChange="nveChangeInfo.nveChange" 
        :navData="nveChangeInfo.navData"
        :close="_close"
        :delect="_delect"
      />
    </div>
  </div>
</template>

<script>
import NveChange from '@/view/components/nve-change/nve-change'
import { updateSwiper, getSwiperInfo } from '@/api/nav'
import { delwidthRex } from './utils'
export default {
  components: {
    NveChange
  },
  data () {
    return {
      nveChangeInfo: {
        nveChange: false,
        navData: {}
      },
      outerChain: [
        {value: 0, label: '不进行其他操作'},
        {value: 1, label: '外部跳转'},
        {value: 2, label: '其他小程序跳转'}
      ],
      swiperObject: {
        indicatorDots: false,                      // 是否显示控制面板
        indicatorColor: 'rgba(0, 0, 0, 0.3)',      // 指示点颜色
        indicatorActiveColor: '#000000',           // 当前选中的指示点颜色
        autoplay: false,                           // 是否自动切换
        current: 0,                                // 当前所在滑块的 index
        interval: 5000,                            // 自动切换时间间隔
        duration: 500,                             // 滑动动画时长
        circular: false,                           // 是否采用衔接滑动
        vertical: false,                           // 滑动方向是否为纵向
        previousMargin: 0,                         // 前边距
        nextMargin: 0,                             // 后边距
        displayMultipleItems: 1,                   // 同时显示的滑块数量
        notice: {                                  // 公告
          status: true,
          content: "测试公告"
        },
        imgUrls: [
          {
            url: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',   // 图片地址
            OuterChain: {url: '', type: 1, appId: '', path: '', extraData: []}                                               // 外联地址 type类型 0 1 2                                                            // 0 是不展示 1是跳转的小程序 2是网页跳转
          }, 
          {
            url: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',
            OuterChain: {url: '', type: 1, appId: '', path: '', extraData: []}
          }
        ]
      }
    }
  },
  created () {
    this._getListInfo()
  },
  methods: {
    _changeindicatorDots (status) {
      this.swiperObject.indicatorDots = status
    },
    _changeautoplay (status) {
      this.swiperObject.autoplay = status
    },
    _changecircular (status) {
      this.swiperObject.circular = status
    },
    _changevertical (status) {
      this.swiperObject.vertical = status
    },
    _changenotice (status) {
      this.swiperObject.notice.status = status
    },
    _getListInfo () {
      getSwiperInfo().then((result) => {
        if (!result) return
        this.swiperObject = result.data[0]
      })
    },
    _add () {
      this.nveChangeInfo.nveChange = true
      let flagObject = {
        url: '',
        OuterChain: {url: '', type: 1, appId: '', path: '', extraData: []},
        new: true,
      }
      this.nveChangeInfo.navData = flagObject
      this.swiperObject.imgUrls.push(flagObject)
    },
    _change (i) {
      this.nveChangeInfo.nveChange = true
      this.nveChangeInfo.navData = this.swiperObject.imgUrls[i]
    },
    _close () {
      this.nveChangeInfo.nveChange = false
    },
    _delect () {
      this.swiperObject.imgUrls.splice(this.swiperObject.imgUrls.length-1, 1)
    },
    _delectImg (i) {
      this.swiperObject.imgUrls.splice(i, 1)
    },
    _up (index) {
      if (index === 0) {
        this.$Message.info('已经是第一个了')
        return
      }
      const betweenValueUp = this.swiperObject.imgUrls[index-1]
      const betweenValueAfter = this.swiperObject.imgUrls[index]
      this.swiperObject.imgUrls.splice(index, 1, betweenValueUp)
      this.swiperObject.imgUrls.splice(index-1, 1, betweenValueAfter)
    },
    _updateSwiper () {
      // const data = delwidthRex(this, this.swiperObject)
      updateSwiper(this.swiperObject).then((result) => {
        if (!result) return
        this.$Message.info('更新成功')
      })
    }
  }
}
</script>