import * as mutations  from './types'
export default{
  changeName(context){
    context.commit(mutations.CHANGE_NAME) 
  },
  increment(state, payload) {
    state.commit('increment', payload)
  }
}