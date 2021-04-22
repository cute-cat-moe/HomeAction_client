import Vue from 'vue'

/**
 * 通过任务状态值获取状态文字
 */
function getMissionStatusFromValue(value) {
  switch (value) {
    case -1:
      return '已拒绝'
    case 0:
      return '待审核'
    case 1:
      return '召集中'
    case 2:
      return '进行中'
    case 3:
      return '任务完成'
    case 4:
      return '任务结束'
    default:
      return '未知状态'
  }
}

/**
 * 通过任务状态文字获取状态值
 */
function getValueFromMissionStatus(status) {
  switch (status) {
    case '已拒绝':
      return -1
    case '待审核':
      return 0
    case '召集中':
      return 1
    case '进行中':
      return 2
    case '任务完成':
      return 3
    case '任务结束':
      return 4
    default:
      return -2
  }
}

/**
 * 通过任务状态值获取相应颜色
 */
function getColorFromMissionStatusValue(statusValue) {
  switch (statusValue) {
    case -1:
    case '已拒绝':
      return 'red'
    case 0:
    case '待审核':
      return 'indigo'
    case 1:
    case '召集中':
      return 'green'
    case 2:
    case '进行中':
      return 'blue'
    case 3:
    case '任务完成':
    case 4:
    case '任务结束':
      return 'grey'
    default:
      return ''
  }
}

/**
 * 通过任务等级值获取等级文字
 */
function getMissionLevelFromValue(value) {
  switch (value) {
    case 1:
      return '一级'
    case 2:
      return '二级'
    case 3:
      return '三级'
    case 4:
      return '四级'
    default:
      return '未知'
  }
}

/**
 * 通过任务等级文字获取等级值
 */
function getValueFromMissionLevel(level) {
  switch (level) {
    case '一级':
      return 1
    case '二级':
      return 2
    case '三级':
      return 3
    case '四级':
      return 4
    default:
      return 0
  }
}

/**
 * 通过任务等级获取相应的颜色
 */
function getColorFromMissionLevelValue(levelValue) {
  switch (levelValue) {
    case 1:
    case '一级':
      return 'orange darken-1'
    case 2:
    case '二级':
      return 'orange darken-3'
    case 3:
    case '三级':
      return 'deep-orange darken-1'
    case 4:
    case '四级':
      return 'deep-orange darken-3'
    default:
      return ''
  }
}

/**
 * 通过公告消息的等级获取相应的颜色
 */
function getColorFromMissionMessageType(messageType) {
  switch (messageType) {
    case 'danger':
    case '警告':
      return 'red darken-1'
    case 'accent':
    case '关注':
      return 'orange darken-1'
    case 'info':
    case '建议':
      return 'blue darken-1'
    default:
      return 'blue-grey darken-1'
  }
}

/**
 * 通过新闻的类型值获取对应的文本
 */
function getTextFromNewsType(typeValue) {
  switch (typeValue) {
    case 'news':
    case '动态要闻':
      return '动态要闻'
    case 'rescue':
    case '救援风采':
      return '救援风采'
    case 'platform':
    case '平台公告':
      return '平台公告'
    default:
      return '动态要闻'
  }
}

/**
 * 通过新闻的类型文本获取对应的值
 */
function getNewsTypeFromText(typeText) {
  switch (typeText) {
    case 'news':
    case '动态要闻':
      return 'news'
    case 'rescue':
    case '救援风采':
      return 'rescue'
    case 'platform':
    case '平台公告':
      return 'platform'
    default:
      return 'news'
  }
}

/**
 * 通过新闻的类型值或文本获取对应的颜色
 */
function getColorFromNewsType(type) {
  switch (type) {
    case 'news':
    case '动态要闻':
      return 'blue darken-2'
    case 'rescue':
    case '救援风采':
      return 'red darken-1'
    case 'platform':
    case '平台公告':
      return 'orange darken-2'
    default:
      return 'blue darken-2'
  }
}

const ValueHandler = {
  install(Vue) {
    Vue.prototype.$ValueHandler = {
      getMissionStatusFromValue,
      getValueFromMissionStatus,
      getColorFromMissionStatusValue,
      getMissionLevelFromValue,
      getValueFromMissionLevel,
      getColorFromMissionLevelValue,
      getColorFromMissionMessageType,
      getTextFromNewsType,
      getNewsTypeFromText,
      getColorFromNewsType,
    }
  },
}

Vue.use(ValueHandler)
