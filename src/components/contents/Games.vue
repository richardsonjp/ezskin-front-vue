<template>
  <b-container fluid style="padding-left:40px;padding-right:40px;">
    <br/>
    <!-- <message-error :error="error" :success="success" @empty-message="handler"></message-error> -->
    <b-row style="margin-bottom: 8px;">
      <b-col cols="3">
        <h1 style="float:left"><b>Games</b></h1>
        <div style="border-left: 1px solid #dde0e6;height:32px;float:right;"></div>
      </b-col>
      <b-col>
        <b-button variant="primary" v-b-modal.games>Add Sale</b-button>
        <b-pagination align="right" :total-rows=" pagination.totalRows" :per-page="pagination.perPage" v-model="pagination.currentPage" class="my-0" @change="fetchGame()" />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="3">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-card 
            header="<b>Filter Games</b>"
            @click.native="onSubmit()">
            <b-row>
              <b-col>
                <b-form-group 
                  label="Game ID:"
                  label-for="id">
                  <b-form-input v-model="filters.id" />
                </b-form-group>
                <b-form-group 
                  label="Game Name:"
                  label-for="name">
                  <b-form-input v-model="filters.name" />
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
          
        </b-table>
      </b-col>
    </b-row>

    <br>
    halaman ke: {{ this.pagination.currentPage }}
    <br>

    <b-modal  
      id="games"
      ref="games"
      title="Create New Sales"
      @ok="postGame">
      <form>
        <b-form-group 
          label="Name:"
          label-for="name">
          <b-form-input id="name" v-model="games.name"/>
        </b-form-group>
      </form>
    </b-modal>

  </b-container>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      error: '',
      success: '',
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        start: 0,
        counting: 0,
      },
      lists: [],
      filters: {
        id: '',
        name: ''
      },
      fields: [
        {key: 'no', label: 'No'},
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'Name'},
        {key: 'created_at', label: 'Created At', sortable: true},
      ],
      games: {
        name: ''
      },
    }
  },
  mounted: function() {
    this.fetchGame()
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
    onSubmit: function (e) {
      e.preventDefault()
      this.pagination.currentPage = 1
      this.fetchGame()
      window.scrollTo(0, 0)
    },
    onReset: function (e) {
      e.preventDefault()
      this.filters.id = ''
      this.filters.name = ''
    },
    errorParse: function (error) {
      this.error = error
    },
    postGame: function () {
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'game/save'
        axios.post(url, this.games)
        .then((response) => {
          // console.log(response)
        })
        .catch((error) => {
          console.log(error)
          this.error = error
        })
      }, 500);
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
    fetchGame: function () {
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'game/list'
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
          console.log(error)
          this.error = error
        })
      }, 500);
    },
    // paginationCountBatching: function (paginations) {
    //   this.pagination.currentPageBatching = paginations.currentPage
    //   this.totalValueBatching = paginations.totalValue
    // }
  }  
}
</script>
