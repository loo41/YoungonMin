<template>
  <div>
    <div>
      <Select v-model="user" style="width:200px" @on-change="_selectUser">
        <Option v-for="(item, l) in list" :value="l" :key="item._id">{{ item.username }}</Option>
      </Select>
      <div class="select">
        <div>应该值班时间 <span class="timetable-true" style="height: 50px; width: 100px; margin-left: 20px"></span></div>
        <div>实际值班时间 <span class="timetable-actual" style="height: 50px; width: 100px; margin-left: 20px"></span></div>
        <div>实际值班时间 = 应该值班时间 <span class="sign-true" style="height: 50px; width: 100px; margin-left: 20px"></span></div>
      </div>
    </div>
    <div class="time-box">
      <div class="timetable">
      <div class="timeName">
        <div></div>
        <div>第一大节</div>
        <div>第二大节</div>
        <div>第三大节</div>
        <div>第四大节</div>
      </div>
      <div v-for="(less, i) in timetable" :key="'youngon + i'" class="timeList">
        <div v-if="i === 0">星期一</div>
        <div v-else-if="i === 1">星期二</div>
        <div v-else-if="i === 2">星期三</div>
        <div v-else-if="i === 3">星期四</div>
        <div v-else="i === 4">星期五</div>
        <div v-for="(item, index) in less" :key="'yo' + index" v-if="flagArray.length === 0">
          <div v-if="((lookUser.fistWorkTimeTime === index && lookUser.fistWorkTimeDate === i) || (lookUser.secondWorkTimeDate === i && lookUser.secondWorkTimeTime === index))" class="timetable-true"></div>
          <div v-else ></div>
        </div>
        <div v-for="(item, index) in less" :key="'yo' + index" v-if="flagArray.length !== 0">
          <div v-if="((lookUser.fistWorkTimeTime === index && lookUser.fistWorkTimeDate === i) || (lookUser.secondWorkTimeDate === i && lookUser.secondWorkTimeTime === index)) &&
          flagArray[i][index] === 1" class="sign-true"></div>
          <div v-else-if="((lookUser.fistWorkTimeTime === index && lookUser.fistWorkTimeDate === i) || (lookUser.secondWorkTimeDate === i && lookUser.secondWorkTimeTime === index))" class="timetable-true"></div>
          <div v-else-if="flagArray[i][index] === 1" class="timetable-actual"></div>
          <div v-else ></div>
        </div>
      </div>
    </div>
    <div class="otherInfo">
      <div class="record-box">
        <div>本周签到记录</div>
        <div>
          <div>开始时间</div>
          <div>结束时间</div>
          <div>签到类型</div>
          <div>签退方式</div>
        </div>
        <div v-for="(item, i) in userRecord" :key="'user' + i" class="record-list-box">
          <div>{{item.startTime}}</div>
          <div>{{item.endTime}}</div>
          <div v-show="item.signType === 1">值班</div>
          <div v-show="item.signType === 2">例会</div>
          <div v-show="item.signType === 3">补值班</div>
          <div v-show="item.signType === 4">其他</div>
          <div v-show="item.type === 1">正常</div>
          <div v-show="item.type === 2">异常</div>
        </div>
      </div>
      <div class="leave-box">
        <div class="leave">
          <div>所有请假记录</div>
          <div>
            <div>请假时间</div>
            <div>补值班时间</div>
            <div>补值班时间</div>
            <div>请假原因</div>
          </div>
          <div v-for="(item, i) in leave" :key="'leave'+i" class="leave-list">
            <div>
              {{item.startTime}}
              <span v-show="item.startClass === 0">第一大节</span>
              <span v-show="item.startClass === 1">第二大节</span>
              <span v-show="item.startClass === 2">第三大节</span>
              <span v-show="item.startClass === 3">第四大节</span>
            </div>
            <div>
              {{item.endTime}}
              <span v-show="item.startClass === 0">第一大节</span>
              <span v-show="item.startClass === 1">第二大节</span>
              <span v-show="item.startClass === 2">第三大节</span>
              <span v-show="item.startClass === 3">第四大节</span>
            </div>
            <div>
              {{item.secondEndTime}}
              <span v-show="item.startClass === 0">第一大节</span>
              <span v-show="item.startClass === 1">第二大节</span>
              <span v-show="item.startClass === 2">第三大节</span>
              <span v-show="item.startClass === 3">第四大节</span>
            </div>
            <div>{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import {getYoungonAllList, userRecordList} from '@/api/youngon.js'
export default {
  data () {
    return {
      list: [],
      user: '',
      timetable: [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]],
      lookUser: {},
      userRecord: [],
      flagArray: [],
      leave: []
    }
  },
  created () {
    this._getInfo()
  },
  methods: {
    _getInfo () {
      getYoungonAllList().then((result) => {
        this.list = result.data
      })
    },
    _selectUser (index) {
      let data = JSON.parse(JSON.stringify(this.list[index]))
      data.fistWorkTimeDate = data.fistWorkTimeDate - 1
      data.fistWorkTimeTime = data.fistWorkTimeTime - 1
      data.secondWorkTimeDate = data.secondWorkTimeDate - 1
      data.secondWorkTimeTime = data.secondWorkTimeTime - 1
      this.lookUser = data
      userRecordList({_id: this.list[index]._id}).then((result) => {
        if (!result) return
        this.userRecord = result.userRecord
        this.flagArray = result.flagArray
        this.leave = result.leave
      })
    }
  }
}
</script>

<style>
.timetable-true {
  background: red;
}
.timetable-actual {
  background: green;
}
.sign-true {
  background: #E9EAEC
}
.select {
  display: flex;
  height: 100px;
  align-items: center;
  margin-top: 20px
}
.select div {
  width: 400px;
  display: flex;
  margin-left: 20px;
}
.time-box {
  display: flex;
  justify-content: space-between;
}
.timetable {
  display: flex;
  margin-top: 50px;
  width: 60%;
}
.timeName {
  display: flex;
  flex-direction: column;
}
.timeName div{
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E9EAEC;
}
.timeList {
  display: flex;
  flex-direction: column
}
.timeList div{
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E9EAEC;
}
.otherInfo {
  width: 40%;
  background: white;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column
}
.record-box div:nth-child(1){
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record-box div:nth-child(2){
  display: flex;
}
.record-box div:nth-child(2) div{
  flex: 1;
  border: 1px solid #E9EAEC;
  display: flex;
  justify-content: center;
  align-items: center
}
.record-list-box {
  display: flex;
  flex-direction: row
}
.record-list-box div{
  height: 50px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E9EAEC;
}
.leave-box {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}
.leave {
  width: 100%;
}
.leave div:nth-child(1){
  height: 50px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.leave div:nth-child(2){
  display: flex;
}
.leave div:nth-child(2) div{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E9EAEC;
}
.leave-list{
  display: flex;
}
.leave-list div{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #E9EAEC;
}
</style>
