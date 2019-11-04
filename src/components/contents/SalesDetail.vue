<template>
  <div>
    <b-row v-for="(items, index) in details" :key="index" >
        <b-col cols="6" v-for="(items, id) in items" :key="id">
        <b-card :title="index + ' info'"
          title-tag="i"
          style="font-size: 1em;">
          <h6 slot="header"
          class="mb-0">{{ id | noHyphen | capitalize }}</h6>
          <hr />
          <b-row class="mb-2" v-for="(items, index) in items" :key="index">
            <b-col sm="4" class="text-sm-right"><b>{{ index | noHyphen | capitalize }}:</b></b-col>
            <b-col v-if="id == 'market'" >{{ items | capitalize | formatMoney }}</b-col>
            <b-col v-else-if="id == 'payment'" >{{ items }}</b-col>
            <b-col v-else-if="index == 'tradeable'" >{{ items }}</b-col>
            <b-col v-else>{{ items }}</b-col>
          </b-row>
        </b-card>
        <hr />
        </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    details: {
      type: Object,
      default: ''
    },
  },
  data() {
    return {
      form: {
        groups: [],
      }
    }
  },
  mounted: function() {
  },
  methods: {
    // fetchFormDetails: function () {
    //   setTimeout(() => {
    //     const url = process.env.VUE_APP_BASE_URI + 'verifazz/' + this.formCode
    //     axios.get(url)
    //     .then((response) => {
    //       this.form = response.data
    //     })
    //     .catch((error) => {
    //       this.error = error.toString()
    //     })
    //   }, 500);
    // },
  }
}
</script>
