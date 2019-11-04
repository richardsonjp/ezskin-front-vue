<template>
  <b-container fluid style="padding-left:40px;padding-right:40px;">
    <b-col>
      <p>{{pagination.start}} - {{totalRows}} from ({{totalValue}}) items</p>
      <b-pagination align="right" :total-rows=" pagination.totalRows" :per-page="pagination.perPage" v-model="pagination.currentPage" class="my-0" @change="fetchSalesCsgo()" />
    </b-col>
    <b-row>
      <b-col cols="3">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-card
            header="<b>Filter Sales</b>"
            @click.native="onSubmit()">
            <b-row>
              <b-col>
                <b-form-group 
                  label="Name:"
                  label-for="name">
                  <b-form-input v-model="filters.name"/>
                </b-form-group>
                <b-form-group 
                  label="Status:"
                  label-for="status">
                  <b-form-select v-model="filters.status" :options="statusOptions"></b-form-select>
                </b-form-group>
                <b-form-group 
                  label="Buyer:"
                  label-for="buyer">
                  <b-form-input v-model="filters.buyer" />
                </b-form-group>
                <b-form-group 
                  label="Bought by:"
                  label-for="bought_by">
                  <b-form-input v-model="filters.bought_by" />
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
          <template slot="show_details" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <SalesDetail :details="row.item.details"></SalesDetail>
          </template>
          <template slot="edit" slot-scope="row">
            <b-button size="sm" variant="primary" @click="salesUpdateOpenModal(row.item)" class="mr-2">Update Item</b-button>
          </template>
          <!-- <template slot="buy" slot-scope="row">
            {{ row.item.buy | formatMoney }}
          </template>
          <template slot="sell" slot-scope="row">
            {{ row.item.sell | formatMoney }}
          </template> -->
          <template slot="profit" slot-scope="row">
            {{ row.item.profit | formatMoney }}
          </template>
        </b-table>
      </b-col>
    </b-row>
    <SalesUpdateModal ref="modalUpdateSales" @reFetch="reFetchAfterUpdate"></SalesUpdateModal>
  </b-container>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    csgoFilter: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      filters: {
        name: '',
        status: '',
        buyer: '',
        bought_by: '',
        gameId: '',
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
      statusOptions: [
        {value: '', text: 'Select a status'},
        {value: 'new', text: 'New'},
        {value: 'booked', text: 'Booked'},
        {value: 'dp', text: 'DP'},
        {value: 'sold', text: 'sold'},
      ],
      fields: [
        {key: 'no', label: 'No'},
        {key: 'name', label: 'Nama'},
        {key: 'profit', label: 'Profit'},
        {key: 'status', label: 'Status'},
        {key: 'bought_by', label: 'Bought by'},
        {key: 'buyer', label: 'Buyer'},
        // {key: 'tradeable_at', label: 'Tradeable'},
        {key: 'created_at', label: 'Created At', sortable: true},
        {key: 'show_details', label: ''},
      ],
    }
  },
  mounted: function() {
    // console.log('isi filteran gamess',this.csgoFilter)
    // if (this.csgoFilter) {
      this.fetchSalesCsgo(this.csgoFilter)
    // }
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
        this.fetchSalesCsgo(this.csgoFilter)
      }
    },
    sharePagination: function(obj) {
      this.$emit('pagination-count-SalesCsgo', obj)
    },
    onSubmit: function (e) {
      e.preventDefault()
      this.pagination.currentPage = 1
      this.fetchSalesCsgo(this.csgoFilter)
      window.scrollTo(0, 0)
    },
    onReset: function (e) {
      e.preventDefault()
      this.filters.registeredUserId = ''
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
    fetchSalesCsgo: function (csgoFilter) {
      this.filters.gameId = csgoFilter || this.csgoFilter
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + 'sales/list'
        const params = {}
        params.params = JSON.parse(JSON.stringify(this.filters))
        params.params.limit = this.pagination.perPage
        params.params.page = this.pagination.currentPage
        axios.get(url, params)
        .then((response) => {
          this.totalValue = response.data.pagination.total
          this.lists = response.data.data
          this.lists.map((record,index) => {
            // if (record.status == 'new') {
            //   record._cellVariants = {status: 'primary'}
            // }
            if (record.status == 'booked') {
              record._cellVariants = {status: 'warning'}
            }
            if (record.status == 'dp') {
              record._cellVariants = {status: 'danger'}
            }
            if (record.status == 'sold') {
              record._cellVariants = {status: 'success'}
            }
            let d = new Date(record.created_at)
            let dt = new Date(record.tradeable_at)
            let m = d.getMonth() + 1;
            let mt = dt.getMonth() + 1;
            record.created_at = d.getDate() + '-' + ((m + 1) < 10 ? '0' + m : m) + '-' + d.getFullYear()
            record.tradeable_at = dt.getDate() + '-' + ((mt + 1) < 10 ? '0' + mt : mt) + '-' + dt.getFullYear()
            if (record.down_payment_at) {
            let dp = new Date(record.down_payment_at)
            let mp = dp.getMonth() + 1;
            record.down_payment_at = dp.getDate() + '-' + ((mp + 1) < 10 ? '0' + mp : mp) + '-' + dp.getFullYear()
            }
            if (record.full_payment_at) {
            let fp = new Date(record.full_payment_at)
            let mp = fp.getMonth() + 1;
            record.full_payment_at = fp.getDate() + '-' + ((mp + 1) < 10 ? '0' + mp : mp) + '-' + fp.getFullYear()
            }
            record.price = {
              buy: record.buy,
              sell: record.sell,
              profit: record.profit,
            }
            record.item = {
              tradeable: record.tradeable_at,
              exterior: record.exterior,
              float: record.float,
              note: record.note,
            }
            record.payment = {
              DP_date: record.down_payment_at,
              DP_amount: record.down_payment_amount,
              FP_date: record.full_payment_at,
              FP_amount: record.full_payment_amount,
            }
            record.payment_type = {
              payment_to: record.payment_to,
              payment_by: record.payment_by,
            }
            record.details = {
              item: {market: record.price, item_info: record.item,}, payment: {payment: record.payment, payment_type: record.payment_type}
            }
            this.numbering()
            record.no = index + 1 + (this.pagination.currentPage * this.pagination.perPage) - this.pagination.perPage
          })
          this.sharePagination({totalValue: this.totalValue, currentPage: this.pagination.currentPage})
          this.pagination.totalRows = response.data.pagination.total
        })
        .catch((error) => {
          this.error = error
        })
      }, 500);
    },
    salesUpdateOpenModal: function (params) {
      this.$refs.modalUpdateSales.showModal(params)
    },
  }  
}
</script>
