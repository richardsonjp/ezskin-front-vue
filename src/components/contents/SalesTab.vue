<template>
  <b-container fluid style="padding-left:40px;padding-right:40px;">
    <br/>
    <message-error :error="error" :success="success" @empty-message="handler"></message-error>
    <b-row style="margin-bottom: 8px;">
      <b-col cols="3">
        <h1 style="float:left"><b>Sales Data</b></h1>
        <div style="border-left: 1px solid #dde0e6;height:32px;float:right;"></div>
      </b-col>
      <b-col>
        <b-button variant="primary" v-b-modal.addSales>Add Sale</b-button>
      </b-col>
    </b-row>

      <b-tabs small card>
        <b-row style="margin-bottom: 8px;">
          <b-tab :title="'All Sales' + ` (${totalValueSalesAll})`">
            <SalesAll ref="all" :gameFilter="gameOptionsParse" @error-parse="errorParse" @pagination-count-SalesAll="paginationCountSalesAll"></SalesAll>
          </b-tab>

          <b-tab :title="'CSGO' + ` (${totalValueSalesCsgo})`">
            <SalesCsgo ref="csgo" :csgoFilter="csgoFilter" @error-parse="errorParse" @pagination-count-SalesCsgo="paginationCountSalesCsgo" ></SalesCsgo>
          </b-tab>

          <b-tab :title="'DotA' + ` (${totalValueSalesDota})`">
            <SalesDota ref="dota" :dotaFilter="dotaFilter" @error-parse="errorParse" @pagination-count-SalesDota="paginationCountSalesDota" ></SalesDota>
          </b-tab>

        </b-row>
      </b-tabs>
    <br>
    page: {{ this.pagination.currentPage }}
    <br>

    <b-modal  
      id="addSales"
      ref="addSales"
      title="Create New Sales"
      @ok="postSales">
      <form>
        <b-form-group 
          label="Name:"
          label-for="name">
          <b-form-input id="name" v-model="addSales.name"/>
        </b-form-group>
        <b-form-group 
          label="Game:"
          label-for="game">
          <b-form-select v-model="selectedGame" :options="gameOptions"></b-form-select>
        </b-form-group>
        <b-form-group 
          v-show="selectedGame.name == 'csgo'"
          label="Exterior:"
          label-for="exterior">
          <b-form-input id="exterior" v-model="addSales.exterior"/>
        </b-form-group>
        <b-form-group 
          v-show="selectedGame.name == 'csgo'"
          label="Float:"
          label-for="float">
          <b-form-input id="float" v-model="addSales.float"/>
        </b-form-group>
        <b-form-group 
          label="Buy:"
          label-for="buy">
          <b-form-input id="buy" type="number" v-model="addSales.buy"/>
        </b-form-group>
        <b-form-group 
          label="Sell:"
          label-for="sell">
          <b-form-input id="sell" type="number" v-model="addSales.sell"/>
        </b-form-group>
        <b-form-group 
          label="Tradeable at:"
          label-for="tradeable"
          description="begin filter end created date loan, not dependant with start date">
          <b-form-input 
            id="tradeable"
            v-model="addSales.tradeable_at"
            type="date">
          </b-form-input>
        </b-form-group>
        <b-form-group 
          label="Note:"
          label-for="note">
          <b-form-input id="note" v-model="addSales.note"/>
        </b-form-group>
      </form>
    </b-modal>

  </b-container>
</template>

<script>
import axios from 'axios';
// import SalesAll from './SalesAll.vue';
// import SalesCsgo from './SalesCsgo.vue';

export default {
  data () {
    return {
      error: '',
      success: '',
      pagination: {
        currentPage: 1,
      },
      totalValueSalesAll: '',
      totalValueSalesCsgo: '',
      totalValueSalesDota: '',
      selectedGame: {
        id: '',
        name: ''
      },
      addSales: {
        game_id: '',
      },
      gameOptions: [{value: {id: '', name: ''}, text: 'select game'}],
      gameOptionsParse: [{value: '', text: 'select game'}],
      csgoFilter: '',
      dotaFilter: '',
    }
  },
  mounted: function() {
    this.fetchGameOptions()
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
    errorParse: function (error) {
      this.error = error
    },
    fetchGameOptions: function () {
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'game/options'
        axios.get(url)
        .then((response) => {
          response.data.data.map((record, index) => {
            let obj = {value: {id: record.id, name: record.name}, text: record.name}
            let parse = {value: record.id, text: record.name}
            if (record.name == 'csgo') {
              let csgoFilter = record.id
              this.$refs.csgo.fetchSalesCsgo(csgoFilter)
              this.csgoFilter = record.id
            }
            if (record.name == 'dota') {
              console.log(record)
              let dotaFilter = record.id
              this.$refs.dota.fetchSalesDota(dotaFilter)
              this.dotaFilter = record.id
            }
            this.gameOptions.push(obj)
            this.gameOptionsParse.push(parse)
          })
        })
        .catch((error) => {
          error.response.data.map((err) => {
            this.error = this.error + err.message
          })
        })
      }, 500);
    },
    postSales: function () {
      this.addSales.game_id = this.selectedGame.id
      if (localStorage.getItem('user')) {
        this.addSales.bought_by = localStorage.getItem('user')
      }
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'sales/post'
        axios.post(url, this.addSales)
        .then((response) => {
          this.$refs.all.fetchSalesAll()
          this.$refs.csgo.fetchSalesCsgo(this.csgoFilter)
          this.$refs.dota.fetchSalesDota(this.dotaFilter)
        })
        .catch((error) => {
          error.response.data.map((err) => {
            this.error = this.error + err.message
          })
        })
      }, 500);
    },
    paginationCountSalesAll: function (paginations) {
      this.pagination.currentPage = paginations.currentPage
      this.totalValueSalesAll = paginations.totalValue
    },
    paginationCountSalesCsgo: function (paginations) {
      this.pagination.currentPage = paginations.currentPage
      this.totalValueSalesCsgo = paginations.totalValue
    },
    paginationCountSalesDota: function (paginations) {
      this.pagination.currentPage = paginations.currentPage
      this.totalValueSalesDota = paginations.totalValue
    },
  }  
}
</script>
