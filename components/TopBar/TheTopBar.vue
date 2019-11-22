<template>
  <section class="content">
    <div class="row content-body">
      <table width="99%;">
        <tbody>
          <tr>
            <TheSearchBar />
            <TheStatusButtonsBar :orders="storedData" />
            <TheCitiesBar :orders="storedData" />
            <TheReorganizeBar />
            <rabbitMQcomponent @pushedSomething="handlePushInParent" />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="searchState" class="search-window">
      <div class="box box-info" id="new_serach_window">
        <div class="box-header" style="">
          <i class="fa fa-search"></i>
          <h3 class="box-title" id="new_serach_window_head">Search Results</h3>
          <div class="pull-right box-tools">
            <button
              class="btn btn-info btn-sm"
              data-widget="remove"
              data-toggle="tooltip"
              title="Remove"
              @click="remove"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div class="box-body">
          <TheRowHolder :order="order" :key="componentKey" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import moment from 'moment';

import TheSearchBar from '@/components/TopBar/TheSearchBar';
import TheStatusButtonsBar from '@/components/TopBar/TheStatusButtonsBar';
import TheCitiesBar from '@/components/TopBar/TheCitiesBar';
import TheReorganizeBar from '@/components/TopBar/TheReorganizeBar';
import rabbitMQcomponent from '@/modules/rabbitMQ/rabbitMQComponent';

export default {
  name: 'TheTopBar',
  components: {
    TheSearchBar,
    TheStatusButtonsBar,
    TheCitiesBar,
    TheReorganizeBar,
    rabbitMQcomponent,
    TheRowHolder: () => import('@/components/UI/TheRowHolder'),
  },
  data() {
    return {
      order: {},
      storedData: [],
      componentKey: 0,
    };
  },

  computed: {
    ...mapGetters(['getSearchedOrder', 'getSearchState', 'getHelpScoutToken']),
    searchState() {
      return this.getSearchState;
    },
  },
  watch: {
    getSearchedOrder(order) {
      this.forceRerender();
      return (this.order = order);
    },
  },
  async mounted() {
    if (localStorage.getItem('helpscoutTokenRequested') === null) {
      await this.setHelpscoutToken();
    }
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setSearchState',
      updateHelpScoutToken: 'setHelpScoutToken',
    }),
    ...mapActions({
      requestHelpscoutToken: 'request_helpscout_token',
    }),
    async setHelpscoutToken() {
      try {
        const token = await this.requestHelpscoutToken();
        const expiresIn = token.expiresIn;
        const currentDate = moment().format('LLLL');
        const expiryDatetime = moment()
          .add(expiresIn, 'seconds')
          .format('LLLL');
        token.expiryDatetime = expiryDatetime;

        this.updateHelpScoutToken(token);
        localStorage.setItem('helpscoutTokenRequested', 1);
        localStorage.setItem('helpscoutAccessToken', token.accessToken);
        localStorage.setItem('helpscoutrefreshToken', token.refreshToken);
        localStorage.setItem('helpscoutExpiryTime', expiryDatetime);
        localStorage.setItem('currentDate', currentDate);
      } catch (error) {
        console.log(error);
      }
    },
    remove() {
      this.updateSearchState(false);
    },
    forceRerender() {
      this.componentKey += 1;
    },

    handlePushInParent(pushobj) {
      const index = _.findIndex(this.storedData, [
        'order_no',
        `${pushobj.order_no}`,
      ]);

      if (index >= 0) {
        this.storedData.splice(index, 1);
        this.storedData.unshift(pushobj);
      } else {
        this.storedData.unshift(pushobj);
      }
    },
  },
};
</script>
<style scoped>
.fa-search {
  padding: 0 !important;
  color: #212529 !important;
}
.content {
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
