<template>
  <div class="filter-bar row">
    <div class="col-md-6 col-xs-6">
      <div class="col-md-9">
        <SearchCouponComponent />
      </div>
    </div>
    <div class="col-md-4 col-xs-6">
      <select name="fuel-stations" class="filter-select pull-right">
        <option
          :value="country.id"
          v-for="(country, index) in getCountries"
          :key="index"
        >
          {{ country.country_name }}
        </option>
      </select>
    </div>
    <div class="col-md-2 col-xs-6">
      <button
        class="btn btn-primary action-button filter-button pull-right"
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
  data() {
    return {
      countries: [],
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
    triggerModal(e) {
      $('#newCoupon').modal('show');
      e.preventDefault();
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
  padding: 4px 16px;
  background: #527cbd;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.04em;
}
</style>
