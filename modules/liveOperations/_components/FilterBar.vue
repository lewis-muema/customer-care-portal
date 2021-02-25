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
        <SearchComponent />
      </div>
      <div class="col-md-8 row columns">
        <div class="col-md-4 col-xs-6" v-if="isAdmin">
          <label for="admin" class="select-label">Filter By Assignee</label>
          <select name="asignee" v-model="asignee" class="filter-select">
            <option value="all">All </option>
            <template v-for="(admin, index) in adminList">
              <option :value="admin.admin_id" :key="index">
                {{ admin.name }}
              </option>
            </template>
          </select>
        </div>
        <div class="col-md-4 col-xs-6">
          <label for="admin" class="select-label">Filter Alert Type</label>
          <select name="alertType" v-model="alertType" class="filter-select">
            <option value="all">All Alerts </option>
            <template v-for="(alert, index) in alertTypes">
              <option :value="alert.name" :key="index">
                {{ alert.title }}
              </option>
            </template>
          </select>
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
  },
  props: ['isAdmin', 'filters'],
  data() {
    return {
      checked: null,
      adminList: [],
      alertType: 'all',
      asignee: 'all',
    };
  },
  computed: {
    ...mapGetters(['getAdmins']),
    alertTypes() {
      const data = [
        {
          title: 'Offline Partners',
          name: 'offline-partners',
        },
        {
          title: 'Delayed Delivery',
          name: 'delayed-delivery',
        },
        {
          title: 'Delayed Pickup',
          name: 'delayed-pickup',
        },
      ];
      return data;
    },
  },
  watch: {
    getAdmins(admins) {
      return (this.adminList = admins);
    },
    asignee(adminID) {
      this.updateAdminID(adminID);
    },
  },
  async mounted() {
    await this.setAdmins();
  },
  methods: {
    ...mapMutations({
      updateAlertStatus: 'setAlertStatus',
      updateAdminID: 'setAdminID',
    }),
    ...mapActions(['setAdmins']),

    showSettings() {
      this.$router.push('/liveOperations/settings');
    },
    setStatus(code) {
      this.updateAlertStatus(code);
    },
  },
};
</script>

<style></style>
