<template>
  <b-container fluid style="padding-left:40px;padding-right:40px;">
    <br/>
    <message-error :error="error" :success="success" @empty-message="handler"></message-error>
    <b-row style="margin-bottom: 8px;">
      <b-col cols="3">
        <h1 style="float:left"><b>Users</b></h1>
        <div style="border-left: 1px solid #dde0e6;height:32px;float:right;"></div>
      </b-col>
      <b-col cols="4">
      <b-button variant="primary" v-b-modal.registerUser>Add User</b-button>&nbsp;
      <br/>
      <br/>
      <p>{{pagination.start}} - {{totalRows}} from ({{totalValue}}) items</p>
      </b-col>
      <b-col>
        <b-pagination align="right" :total-rows="this.pagination.totalRows" :per-page="pagination.perPage" v-model="pagination.currentPage" class="my-0" @change="fetchUsers()" />
      </b-col>
    
    </b-row>
    <b-row>
      <b-col cols="3">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-card 
            header="<b>Filter Users</b>"
            @click.native="onSubmit()">
            <b-row>
              <b-col>
                <b-form-group 
                  label="User:"
                  label-for="user">
                  <b-form-input v-model="filters.name" />
                </b-form-group>
                <b-form-group 
                  label="Active:"
                  label-for="active">
                  <b-form-select v-model="filters.active" :options="activeOptions" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-button type="submit" variant="primary">Filter</b-button> &nbsp;
            <b-button type="reset" >Reset</b-button> &nbsp;
          </b-card>
        </b-form>
      </b-col>
      <b-col>
        <b-table striped hover 
          :items="lists"
          :fields="fields">
          <!-- <template slot="role" slot-scope="row">
            {{ row.item.role | noHyphen | capitalizeAllFirstLetter }}
          </template> -->
          <!-- <template slot="active" slot-scope="row">
            {{ row.item.active | capitalizeAllFirstLetter }}
          </template> -->
          <!-- <template slot="updateStatus" slot-scope="row"> 
            <b-button variant="primary" @click="userStatusUpdate(row.item)" >Update Status</b-button>
          </template> -->
        </b-table>
      </b-col>
    </b-row>

    <br>
    halaman ke: {{ this.pagination.currentPage }}
    <br>

    <b-modal 
      id="registerUser"
      ref="registerUser"
      title="Register User"
      @ok="registerUser">
      <form>
        <b-form-group 
          label="Name:"
          label-for="name">
          <b-form-input id="name" type="text" v-model="register.name"/>
        </b-form-group>
        <b-form-group 
          label="Password:"
          label-for="password">
          <b-form-input id="password" type="password" v-model="register.password"></b-form-input>
        </b-form-group>
        <!-- <b-form-group 
          label="Active:"
          label-for="active">
           <b-form-select v-model="filters.active" :options="activeOptions" />
        </b-form-group> -->
      </form>
    </b-modal>
    <!-- <UserStatusUpdateModal ref="modalStatusUser" @reFetch="reFetchAfterUpdate"></UserStatusUpdateModal> -->
  </b-container>
</template>

<script>
import axios from 'axios';


export default {
  data () {
    return {
      filters: {
        user: '',
        active: '',
      },
      lists: [],
      error: '',
      success: '',
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        start: 0,
        counting: 0,
      },
      totalRows: 0,
      totalValue: '',
      activeOptions: [
        { value: '', text: 'Pick active user' },
        { value: true, text: 'Active' },
        { value: false, text: 'Inactive' },
      ],
      register: {
        name: '',
        password: '',
      },
      fields: [
        {key: 'no', label: 'No'},
        // {key: 'lender.name', label: 'Provider Pinjaman'},
        {key: 'user', label: 'User'},
        {key: 'active', label: 'Active'},
        // {key: 'role', label: 'Peran', sortable: true},
        {key: 'created_at', label: 'Dibuat Tanggal', sortable: true},
        // {key: 'updateStatus', label: ''},
      ],
      lender: [],
      lenderOptions: [{value: '', text: 'Pick a lender'}],
    }
  },
  mounted: function() {
    this.fetchUsers()
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
    reFetchAfterUpdate: function (response) {
      if (response === 'fetch') {
        this.fetchUsers()
      }
    },
    onSubmit: function (e) {
      e.preventDefault()
      this.pagination.currentPage = 1
      this.fetchUsers()
      window.scrollTo(0, 0)
    },
    onReset: function (e) {
      e.preventDefault()
      this.filters.lender = {}
      this.filters.email = ''
      this.filters.role = ''
      this.filters.status = ''
    },
    numbering: function () {
      let counting = 0
      let value = 0
      let counter = 0
      counting += this.pagination.perPage * this.pagination.currentPage
      this.pagination.counting = counting
      counter += this.totalValue - counting
      this.pagination.start = counting - this.pagination.perPage + 1
      if (counter <= 0 ) {
        value += this.totalValue
        this.totalRows = value
        return
      }
      value += counting
      this.totalRows = value
    },
    fetchUsers: function () {
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'user/list'
        const params = {}
        params.params = JSON.parse(JSON.stringify(this.filters))
        params.params.limit = this.pagination.perPage
        params.params.page = this.pagination.currentPage
        axios.get(url, params)
        .then((response) => {
          this.totalValue = response.data.pagination.total
          this.lists = response.data.data
          this.lists.map((record,index) => {
            let d = new Date(record.created_at)
            let m = d.getMonth() + 1;
            record.created_at = d.getDate() + '-' + ((m + 1) < 10 ? '0' + m : m) + '-' + d.getFullYear()
            delete record.updatedAt
            this.numbering()
            record.no = index + 1 + (this.pagination.currentPage * this.pagination.perPage) - this.pagination.perPage
          })
          this.pagination.totalRows = response.data.pagination.total
        })
        .catch((error) => {
          this.error += error
        })
      }, 500);
    },
    registerUser: function() {
      this.error = ''
      this.success = ''
      let url = process.env.VUE_APP_BASE_URI + 'user/register'
      axios.post(url, this.register)
      .then(() =>{
        this.success = 'User telah berhasil di daftarkan'
        this.fetchUsers()
        this.register.user = ''
        this.register.password = ''
      })
      .catch((err) => {
          console.log(err)
        for (var i=0 ; i< err.response.data.length ; i++) {
          this.error += `${err.response.data[i].message}, `
        }
      })
    },
    // userStatusUpdate: function (status) {
    //   this.$refs.modalStatusUser.showModal(status)
    // }
  }  
}
</script>
