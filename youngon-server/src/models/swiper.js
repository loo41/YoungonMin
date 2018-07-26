const moogose = require('mongoose');
const Schema = moogose.Schema;

const SwiperSchema = new Schema({
  indicatorDots: {type: Boolean, default: false},                        // 是否显示控制面板
  indicatorColor: {type: String, default: 'rgba(0, 0, 0, 0.3)'},         // 指示点颜色
  indicatorActiveColor: {type: String, default: '#000000'},              // 当前选中的指示点颜色
  autoplay: {type: Boolean, default: false},                             // 是否自动切换
  current: {type: Number, default: 0},                                   // 当前所在滑块的 index
  interval: {type: Number, default: 5000},                               // 自动切换时间间隔
  duration: {type: Number, default: 500},                                // 滑动动画时长
  circular: {type: Boolean, default: false},                             // 是否采用衔接滑动
  vertical: {type: Boolean, default: false},                             // 滑动方向是否为纵向
  previousMargin: {type: Number, default: 0},                            // 前边距
  nextMargin: {type: Number, default: 0},                                // 后边距
  displayMultipleItems: {type: Number, default: 1},                      // 同时显示的滑块数量
  notice: {type: Object, default: {status: false, content: ''}},
  imgUrls: {type: Array, default: []}
})

const Swiper = moogose.model('swiper', SwiperSchema)

module.exports = Swiper