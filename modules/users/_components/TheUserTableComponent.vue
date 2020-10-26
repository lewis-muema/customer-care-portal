<template>
  <section class="content">
    <div class="row">
      <div class="box" :class="setBackground()">
        <div class="box-body" :key="searchKey" :class="setInterCountyMargin()">
          <div v-if="userType === 'biz'">
            <TheBizTable />
          </div>
          <div v-if="userType === 'peer'">
            <ThePeerTable />
          </div>
          <div v-if="userType === 'riders'">
            <TheRiderTable />
          </div>
          <div class="mega" v-if="userType === 'rewards'">
            <RewardsView />
          </div>
          <div class="mega" v-if="userType === 'refund'">
            <RefundsView />
          </div>
          <div class="mega" v-if="userType === 'intercounty'">
            <InterCountyPriceConfigView />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheUserTableComponent',
  components: {
    TheBizTable: () => import('~/modules/biz/_components/TheBizTable'),
    TheRiderTable: () => import('~/modules/riders/_components/TheRiderTable'),
    ThePeerTable: () => import('~/modules/peer/_components/ThePeerTable'),
    RewardsView: () => import('~/modules/rewards/_components/RewardsView'),
    RefundsView: () => import('~/modules/refunds/_components/RefundsView'),
    InterCountyPriceConfigView: () =>
      import('~/modules/intercounty/_components/InterCountyPriceConfigView'),
  },
  data() {
    return {
      searchedUser: null,
      searchKey: 0,
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    userType() {
      const user = this.getUser === '' ? this.routeName : this.getUser;
      return user;
    },
    routeName() {
      return this.$route.name;
    },
  },
  watch: {
    getUser(user) {
      this.forceRerender();

      return (this.searchedUser = user);
    },
  },
  methods: {
    forceRerender() {
      this.searchKey += 1;
    },
    setBackground() {
      if (this.userType === 'intercounty') {
        return 'inter-county-border';
      } else if (
        this.userType === 'invoice' ||
        this.userType === 'rewards' ||
        this.userType === 'refund'
      ) {
        return 'invoice-background';
      } else {
        return '';
      }
    },
    setInterCountyMargin() {
      if (this.userType === 'intercounty') {
        return 'inter-county-margin';
      }
      return '';
    },
  },
};
</script>
<style>
.container {
  max-width: 100%;
  margin: 0 auto;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding-left: 0;
}
.form-control {
  font-size: 15px;
}
.buttons-tab {
  padding-bottom: 10px;
}
.nav-tabs > li {
  float: left;
  margin-bottom: -1px;
}
.nav > li {
  position: relative;
  display: block;
}
.fa-class {
  padding-right: 2px;
}
.force_blue {
  color: #3c8dbc !important;
  cursor: pointer;
}

.vs__dropdown-toggle {
  padding: 6px 4px;
  color: #ccc;
  border: 1px solid #ccc;
  width: 100%;
}
.vs__dropdown-toggle ::placeholder {
  color: #666;
}
.form-control {
  font-size: 13px;
  background-color: #fff !important;
}
.vs__dropdown-menu {
  border-top: 1px solid #d3d7de;
}
.invoice-background {
  border-top: 0px !important;
  box-shadow: none !important;
  background: #ecf0f5 !important;
  margin-top: 2%;
}
.inter-county-margin {
  margin-top: 1%;
}
.inter-county-border {
  border-top: 1px solid #d2d6de;
}
</style>
