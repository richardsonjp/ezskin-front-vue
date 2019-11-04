<template>
  <b-card-footer>
    <b-container>
      <b-row>
        <b-col style="text-align: center;">
          Copyright by EZ SKIN 2019
        </b-col>
        <b-btn @click="topFunction()" id="myBtn" title="Go to top">
          Top
        </b-btn> 
      </b-row>
    </b-container>
  </b-card-footer>
</template>

<script>
export default {
  methods: {
    topFunction: function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<style>

</style>
