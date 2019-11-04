// import * as mutations  from './types'
export default {
  change_name(state){
    state.name = "Michael Jackson"
  },
  increment(state, payload) {
    state.count+=payload;
  }
}