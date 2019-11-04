<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import Header from './components/Header.vue'
// import Footer from './components/Footer.vue'
import Layout from './components/Layout.vue'
// import MessageError from './components/MessageError.vue'

export default {
  name: 'app',
  components: {
    // Header, Footer
    Layout
  }
}
</script>

<style>
/* html {
  font-size: 0.8em;
  background-color: #fff;
  background-image: 
  linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
  linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
} */
</style>
