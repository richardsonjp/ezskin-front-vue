import store from './store'
export default {
  store,
  // install (Vue, options) {
  install (Vue) {
    Vue.prototype.store = store
  }
}