<template>
    <div>
        <Header v-if="showHeaderFooter"/>
        <router-view></router-view>
        <Footer v-if="showHeaderFooter"/>
    </div>
</template>

<script>
import Header from './Header.vue'
import Footer from './Footer.vue'

export default {
  components: {
    Header, Footer
  },
  mounted: function () {
    if (this.$route.name == 'login') {
      this.showHeaderFooter = false
    } else {
      this.showHeaderFooter = true
    }
  },
  data () {
    return {
      showHeaderFooter: false
    }
  }
}

</script>

<style>
html {
  font-size: 0.8em;
}
body{
  background: #BDC3C7;
}
</style>