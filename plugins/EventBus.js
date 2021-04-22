import Vue from 'vue'

const eventBus = {}

eventBus.install = function (Vue) {
  Vue.prototype.$Bus = new Vue()
}

Vue.use(eventBus)
