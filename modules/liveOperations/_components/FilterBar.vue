<template>
  <div class="filter-container">
    <h3 class="filter-title">
      {{ isAdmin ? 'Problematic Orders' : 'My Problematic Orders' }}
    </h3>
    <div>
      <template v-for="(filter, index) in filters">
        <div
          class="form-check form-check-inline filter-radio-check"
          :key="index"
        >
          <input
            class="form-check-input"
            type="radio"
            name="exampleRadios"
            :id="`resolution_${index}`"
            :value="`${filter.code}`"
            :checked="checked === filter.code"
            @change="setStatus(filter.code)"
          />
          <label
            class="form-check-label filter-check-label"
            :class="`${filter.name}`"
          >
            {{ filter.filterTitle }}
            <div
              v-if="filter.name !== 'problematic-orders'"
              class="filter-total text-center"
              :class="`${filter.name}-total`"
            >
              {{ filter.total }}
            </div>
          </label>
        </div>
      </template>
    </div>
    <div class="filters-holder">
      <div class="col-md-4 columns">
        <label for="admin" class="select-label"></label>
        <SearchComponent @searchedOrder="handleOrderSearch" />
      </div>
      <div class="col-md-8 row columns">
        <div class="col-md-4 col-xs-6" v-if="isAdmin">
          <label for="admin" class="select-label">Filter By Assignee</label>
          <FilterMultiSelect category="admins" :data="adminList" />
        </div>
        <div class="col-md-4 col-xs-6">
          <label for="admin" class="select-label">Filter Alert Type</label>
          <FilterMultiSelect category="alerts" :data="alertTypes" />
        </div>
        <div class="col-md-4 col-xs-6" v-if="isAdmin">
          <label for="admin" class="select-label"></label>
          <button class="btn filter-button pull-right" @click="showSettings()">
            View Problematic Orders Criteria
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'Filterbar',
  components: {
    SearchComponent: () => import('./filters/SearchComponent'),
    FilterMultiSelect: () => import('./filters/FilterMultiSelect'),
  },
  props: ['isAdmin', 'filters'],
  data() {
    return {
      checked: null,
      adminList: [],
      alertType: 'all',
      asignee: 'all',
      loading: false,
      requested: false,
      alertTypes: [],
      orderNo: null,
    };
  },
  computed: {
    ...mapGetters(['getAdmins']),
  },
  watch: {
    getAdmins(admins) {
      const arr = [];

      for (let i = 0; i < admins.length; i += 1) {
        admins[i].checked = false;
        arr.push(admins[i]);
      }
      return (this.adminList = arr);
    },
    asignee(adminID) {
      this.updateAdminID(adminID);
    },
    alertType(alertID) {
      this.updateAlertType(alertID);
    },
  },
  async mounted() {
    this.retrieveAlertTypes();
    await this.setAdmins();
  },
  methods: {
    ...mapMutations({
      updateAlertStatus: 'setAlertStatus',
      updateAdminID: 'setAdminID',
      updateAlertType: 'setAlertType',
      updateSelectedOrder: 'setSelectedOrder',
    }),
    ...mapActions(['setAdmins', 'request_alert_types']),

    showSettings() {
      this.$router.push('/liveOperations/settings');
    },
    setStatus(code) {
      this.updateAlertStatus(code);
    },
    handleOrderSearch(searchedOrder) {
      this.$emit('searchedOrder', searchedOrder);
    },
    async retrieveAlertTypes() {
      this.loading = true;
      this.requested = true;

      try {
        const response = await this.request_alert_types();
        const arr = [];

        for (let i = 0; i < response.length; i += 1) {
          response[i].checked = false;
          arr.push(response[i]);
        }
        this.alertTypes = arr;
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
  },
};
</script>

<style></style>
