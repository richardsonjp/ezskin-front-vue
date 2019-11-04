<template>
  <b-card class="text-center fullpadding">
    Welcome Ez Skin Dashboard
    <br>
    <big><b>{{ this.user }}</b></big>
    <br>
    Please Click Some Menu on Top. 
    <!-- {{ count }} -->
    <!-- <button @click="increment">Increment</button> -->
  </b-card>
</template>


<script>


export default {
  data () {
    return {
      user: localStorage.getItem('user'),
      aktif: 'active'
    }
  },
  computed: {
    count () {
      return this.store.state.count
    }
  },
  mounted: function() {
    // alert(process.env.VUE_APP_BASE_URI);
    // if (typeof(Storage) !== "undefined") {
    //   // alert(this.$route.query.key);
    //   // alert(this.$route.query.refresh_key);
    //   if (this.$route.query.key && this.$route.query.refresh_key) {
    //     localStorage.token = this.$route.query.key;
    //     localStorage.refresh_token = this.$route.query.refresh_key;
    //     this.$router.push({path: '/'});
    //   } else {
    //     this.$router.push({path: 'fail-login'});
    //   }
    // } else {
    //   // Sorry! No Web Storage support..
    //   alert('Sorry, you need upgrade or change to latest browser for use this feature')
    // }
    
    // 
  },
  methods: {
    increment: function () {
      // call mutation 
      this.store.commit('increment', 10)
      this.store.dispatch('increment', 20)
    },
    getCookie: function (cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
    },

    checkCookie: function() {
      var token = this.getCookie("token");
      if (token != "") {
          alert("Welcome again " + token);
      } 
      // else {
      //     username = prompt("Please enter your name:", "");
      //     if (username != "" && username != null) {
      //         setCookie("username", username, 365);
      //     }
      // }
    }


  } 
}
</script>

<style scoped>
  .fullpadding {
    padding: 100px;
  }
</style>