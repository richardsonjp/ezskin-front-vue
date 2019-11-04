<template>
  <div>
    <center><message-error :error="error" :success="success" @empty-message="handler"></message-error></center>
    <b-row style="margin-top:5%">
      <b-col cols="1" col sm="2" md="3" lg="4"></b-col>
        <b-col cols="10" col sm="8" md="6" lg="4">
          <b-card title="">
            <div style="text-align: center;">
              <h4><b>EZ SKIN Administration</b></h4>
            </div>
            <b-form-group 
              horizontal
              :label-cols="3"
              breakpoint="lg"
              label="User"
              label-for="user">
                <b-form-input id="user" type="text" v-model="login.name" @keyup.enter.native="trigger"></b-form-input>
            </b-form-group>
            <b-form-group horizontal
              :label-cols="3"
              breakpoint="lg"
              label="Password"
              label-for="password">
                <b-form-input id="password" type="password" v-model="login.password" @keyup.enter.native="trigger"></b-form-input>
            </b-form-group>
            <b-form-group horizontal
              :label-cols="3"
              breakpoint="lg"
              label-for="buttonLogin">
                <b-button variant="primary" id="buttonLogin" ref="sendReply" @click="authenticate()" class="button-add">
                  <b>Sign in</b>
                </b-button>
            </b-form-group>
          </b-card>
        </b-col>
      <b-col cols="1" col sm="2" md="3" lg="4"></b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      login: {
        name: '',
        password: '',
      },
      error: '',
      success: '',
      url: 'http://127.0.0.1:3333/auth/login',
    }
  },
  methods: {
    handler: function (alertType) {
      if (alertType == 'error') {
        this.error = ''
      }
      if (alertType == 'success') {
        this.success = ''
      }
    },
    authenticate: function () {
      axios.post(this.url, this.login)
      .then((result) =>{
        if (result.data) {
          localStorage.setItem('user', this.login.name)
          localStorage.setItem('token', result.data.authorization)
          window.location.href = process.env.VUE_APP_DASHBOARD_BASE_URL        
        }
      })
      .catch((err) =>{
        this.error = 'Invalid User/Password.'
        this.login.user = ''
        this.login.password = ''
      })
    },
    trigger: function () {
      this.authenticate()
    },
  }
}

</script>

<style>
/* .button-add {
    background-image: url('../assets/payfazz-icon.png');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 24px;
} */
html {
  font-size: 0.8em;
}
.fullpadding {
  padding: 100px;
}
#buttonLogin{
  font-size: 10px;
  width: 20%;
  margin-right: 20%;
}
#verified{
  float: right;
  width: 30%;
  height: 30%;
}
body{
  background: #f2f4f5
}
.cardsign{
  top: 50px;
  outline: #f2f4f5
}
.text{
  font-size: 16px;
}
</style>