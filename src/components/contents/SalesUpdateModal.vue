<template>
  <b-modal
  ref="modalUpdateSales"
  :title="showSalesData.name"
  @ok="updateSales">
    <form>
      <b-form-group
      label="Status:"
      label-for="status">
        <b-form-select id="status" v-model="salesUpdate.status" :options="statusOptions"></b-form-select>
      </b-form-group>
      <b-form-group
      v-show="salesUpdate.status == 'dp'"
      label="DP:"
      label-for="down_payment">
        <b-form-input id="down_payment_at" type="date" v-model="salesUpdate.down_payment_at" ></b-form-input>
        <b-form-input id="down_payment_amount" type="number" min="0" :max="salesUpdate.sell"
          v-model="salesUpdate.down_payment_amount" >
        </b-form-input>
      </b-form-group>
      <b-form-group
      v-show="salesUpdate.status == 'sold'"
      label="FP:"
      label-for="full_payment">
        <b-form-input id="full_payment_at" type="date" v-model="salesUpdate.full_payment_at" ></b-form-input>
        <b-form-input id="full_payment_amount" type="number" :min="salesUpdate.sell - salesUpdate.down_payment_amount" :max="salesUpdate.sell - salesUpdate.down_payment_amount"
          v-model="salesUpdate.full_payment_amount" ></b-form-input>
      </b-form-group>
      <b-form-group
      v-show="salesUpdate.status !== 'new'"
      label="Buyer:"
      label-for="buyer">
        <b-form-input id="buyer" v-model="salesUpdate.buyer" ></b-form-input>
      </b-form-group>
      <b-form-group
      v-show="salesUpdate.status == 'dp' || salesUpdate.status == 'sold'"
      label="Payment to:"
      label-for="payment_to">
        <b-form-input id="payment_to" v-model="salesUpdate.payment_to" ></b-form-input>
      </b-form-group>
      <b-form-group
      v-show="salesUpdate.status == 'dp' || salesUpdate.status == 'sold'"
      label="Payment by:"
      label-for="payment_by">
        <b-form-select id="payment_by" v-model="salesUpdate.payment_by" :options="paymentOptions"></b-form-select>
      </b-form-group>
      <b-form-group
      label="Note:"
      label-for="note">
        <b-form-input id="note" v-model="salesUpdate.note" ></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      salesId: '',
      salesUpdate: {
        status: '',
        exterior: '',
        float: '',
        down_payment_at: '',
        down_payment_amount: 0,
        full_payment_at: '',
        full_payment_amount: 0,
        payment_to: '',
        payment_by: '',
        note: '',
      },
      showSalesData: {
        name: ''
      },
      paymentOptions: [
        {value: '' || null, text: 'Pick Payment'},
        {value: 'bca', text: 'BCA'},
        {value: 'ovo', text: 'OVO'},
        {value: 'gopay', text: 'Gopay'},
        {value: 'dana', text: 'Dana'},
      ],      
      statusOptions: [
        {value: 'new', text: 'New'},
        {value: 'booked', text: 'Booked'},
        {value: 'dp', text: 'DP'},
        {value: 'sold', text: 'sold'},
      ],
    }
  },

  mounted: function () {
  },
  methods: {
    showModal: function (params) {
      let param = Object.assign({}, params)
      param.down_payment_at = param.down_payment_at

      let dp = new Date(param.down_payment_at)
      let mp = dp.getMonth() + 1
      param.down_payment_at = dp.getFullYear() + '/' + ((mp + 1) < 10 ? '0' + mp : mp) + '/' + dp.getDate()

      let df = new Date(param.full_payment_at)
      let mf = df.getMonth() + 1
      param.full_payment_at = df.getFullYear() + '/' + ((mf + 1) < 10 ? '0' + mf : mf) + '/' + df.getDate()

      this.salesId = params.id
      this.salesUpdate = param
      this.salesUpdate.full_payment_amount = params.sell - params.down_payment_amount
      this.showSalesData.name = params.name
      this.$refs.modalUpdateSales.show()
    },
    refetch: function (response) {
      this.$emit('reFetch', response)
    },
    updateSales: function() {
      let updateObj = {}
      if (this.salesUpdate.status == 'new') {
        updateObj.note = this.salesUpdate.note
      }
      if (this.salesUpdate.status == 'booked') {
        updateObj.status = this.salesUpdate.status
        updateObj.note = this.salesUpdate.note
        updateObj.buyer = this.salesUpdate.buyer
      }
      if (this.salesUpdate.status == 'dp') {
        updateObj.status = this.salesUpdate.status
        updateObj.note = this.salesUpdate.note
        updateObj.buyer = this.salesUpdate.buyer
        updateObj.down_payment_at = this.salesUpdate.down_payment_at
        updateObj.down_payment_amount = this.salesUpdate.down_payment_amount
        updateObj.payment_to = this.salesUpdate.payment_to
        updateObj.payment_by = this.salesUpdate.payment_by
      }
      if (this.salesUpdate.status == 'sold') {
        updateObj.status = this.salesUpdate.status
        updateObj.note = this.salesUpdate.note
        updateObj.buyer = this.salesUpdate.buyer
        updateObj.full_payment_at = this.salesUpdate.full_payment_at
        updateObj.full_payment_amount = this.salesUpdate.full_payment_amount
        updateObj.payment_to = this.salesUpdate.payment_to
        updateObj.payment_by = this.salesUpdate.payment_by
      }
      setTimeout(() => {
        const url = process.env.VUE_APP_BASE_URI + `sales/update/` + this.salesId
        axios.patch(url, updateObj)
        .then((response) => {
          this.refetch('fetch')
        })
        .catch((error) => {
          console.log('error here ???? ====>>',error)
        })
      }, 500);
    },
  }
}
</script>
