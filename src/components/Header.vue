<template>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-container fluid style="padding-left:30px;padding-right:40px;">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/">EZ SKIN</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item to="loan" v-show="isCs" :active="checkRouter('loan')">Loan</b-nav-item>
            <b-nav-item to="user" :active="checkRouter('user')">User</b-nav-item>
            <b-nav-item to="sales" :active="checkRouter('sales')">Sales</b-nav-item>
            <b-nav-item to="games" :active="checkRouter('games')">Games</b-nav-item>
            <b-nav-item to="logout" :active="checkRouter('logout')">Logout</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
</template>

<script>
import roles from '../roles'

export default {
  data () {
    return {
      aktif: 'active',
      isAdmin: false,
      isFinance: false,
      isCs: false,
    }
  },
  mounted: function() {
    this.checkRouter();
    // this.checkRoles();
  },
  methods: {
    callCollateralType: function () {
      this.$route.push('collateral-type')
    },
    checkRouter: function(name) {
      if (name === this.$route.name) {
        return true
      }
      
    },
    // checkRoles: function() {
    //   const emailNow = this.$store.getters.email;
    //   const admin = roles.role.superAdmin;
    //   const finance = roles.role.finance;
    //   const cs = roles.role.cs;
    //   if (admin.includes(emailNow)){
    //     this.isAdmin = true;
    //     this.isFinance = true;
    //     this.isCs = true;
    //   } else if (finance.includes(emailNow)) {
    //     this.isFinance = true;
    //   } else if (cs.includes(emailNow)){
    //     this.isCs = true;
    //     this.isFinance = true;
    //   } 
    // }
  } 
}
</script>


