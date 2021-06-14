<template>
  <div class="filter-bar row">
    <div class="col-md-6 col-xs-6">
      <div class="col-md-9">
        <SearchCouponComponent />
      </div>
    </div>
    <div class="col-md-4 col-xs-6">
      <select
        name="country_code"
        v-model="countryCode"
        class="filter-select pull-right"
        @change="setCountryFilter"
      >
        <option value="ALL">All Countries </option>
        <template v-for="(country, index) in getCountries">
          <option
            :value="country.country_code"
            :key="index"
            v-if="country.status === 1"
          >
            {{ country.country_name }}
          </option>
        </template>
      </select>
    </div>
    <div class="col-md-2 col-xs-6" v-if="permissions.create_promocode">
      <button
        class="btn btn-primary filter-button pull-right"
        @click="triggerModal($event)"
      >
        Create New Promo Code
      </button>
    </div>
    <NewCouponComponent />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'FilterCouponCOmponent',
  components: {
    SearchCouponComponent: () => import('./SearchCouponComponent'),
    NewCouponComponent: () => import('./NewCouponComponent'),
  },
  props: ['permissions'],
  data() {
    return {
      countries: [],
      countryCode: 'ALL',
    };
  },
  computed: {
    ...mapGetters(['getCountries']),
  },
  watch: {
    getCountries(data) {
      this.countries = data;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
      setCouponCounty: 'setCouponCounty',
    }),
    triggerModal(e) {
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors([]);

      $('#newCoupon').modal('show');
      e.preventDefault();
    },
    setCountryFilter() {
      this.setCouponCounty(this.countryCode);
    },
  },
};
</script>

<style scoped>
.filter-bar {
  padding: 3em 0;
  display: inline-flex;
  width: 100%;
}
.filter-select {
  width: 80%;
  height: 44px;
  background: #ffffff;
  border: 1px solid #c0c4cc;
  border-radius: 8px;
  padding: 10px;
}
.filter-button {
  padding: 4px 8px;
  background: #527cbd;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.04em;
  color: #ffffff;
}
</style>
