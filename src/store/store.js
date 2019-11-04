import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: { //stored state
    email: localStorage.getItem('email') || ''
  },
  mutations: { //mutations is use to manipulate the state
    email(state) {
      if(localStorage.getItem('store') ) {
        this.replaceState(
          Object.assign(state, localStorage.getItem('store'))
        )
      }
    }
  },
  getters: {
    email: state => state.email
  }//use to look at the state
})