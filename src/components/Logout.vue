<script>
export default {
  data () {
    return {
    }
  },
  mounted: function() {
    this.authenticate()
  },
  methods: {
    authenticate: function () {
        localStorage.clear()
        window.location.href = process.env.VUE_APP_DASHBOARD_BASE_URL + 'login'
    }
  }
}

</script>
