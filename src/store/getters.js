export default {
  name(state){
      return state.name
  }, 
  message(state) {
    return state.message.toUpperCase()
  }, 
  counter(state) {
    return state.count
  }
}