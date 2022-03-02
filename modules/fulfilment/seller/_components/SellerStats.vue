<template lang="html">
  <div class="">
    <div>
      <div class="mc-seller-filters">
        <div class="mc-seller-duration-dropdown">
          <div class="vehicle-header">Filter Duration</div>
          <el-date-picker
            v-model="filterDate"
            type="date"
            placeholder="Pick a day"
            class="fulfilment-date-class reschedule-fulfilment-date"
          >
          </el-date-picker>
        </div>

        <div class="">
          <div class="vehicle-header">Filter Countries</div>
          <el-select
            v-model="country"
            class="mc-seller-country-filter hub-field"
          >
            <el-option
              v-for="item in country_list"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="mc-seller-stats-cards-outer" v-loading="fetching">
        <div class="mc-seller-stats-cards-inner">
          <div class="mc-seller-search">
            <img
              src="https://images.sendyit.com/mission_control/all-sellers.svg"
              alt=""
              class="mc-seller-search-img"
              @click="directToSellers('all-sellers')"
            />
          </div>
          <div class="mc-seller-stats-cards">
            <el-row :gutter="12">
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total orders delivered
                  </div>
                  <div class="mc-seller-card-description stats-count">
                    {{ formatNumber(statsData.total_orders_delivered) }}
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total orders awaiting delivery
                  </div>
                  <div class="mc-seller-card-description stats-count">
                    {{ formatNumber(statsData.total_orders_awaiting_delivery) }}
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total cancelled orders
                  </div>
                  <div class="mc-seller-card-description stats-count">
                    {{ formatNumber(statsData.total_cancelled_orders) }}
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total failed deliveries
                  </div>
                  <div class="mc-seller-card-description stats-count">
                    {{ formatNumber(statsData.total_failed_deliveries) }}
                  </div>
                </el-card>
              </el-col>

              <el-col :span="6" class="mc-seller-stats-total-amount">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total paid to date
                  </div>
                  <div class="mc-seller-card-description">
                    {{ statsData.currency }}
                    {{ formatNumber(statsData.total_paid_to_date) }}
                  </div>
                </el-card>
              </el-col>

              <el-col :span="6" class="mc-seller-stats-overdue-payment">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Overdue payments
                  </div>
                  <div class="mc-seller-card-description">
                    {{ statsData.currency }}
                    {{ formatNumber(statsData.overdue_payments) }}
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SellerStats',
  components: {},
  data() {
    return {
      mode: 'SellerStats',
      componentKey: 0,
      country_list: [],
      fetching: true,
      country: null,
      filterDate: null,
      statsData: {
        total_paid_to_date: 0,
        overdue_payments: 0,
        total_orders_awaiting_delivery: 0,
        total_cancelled_orders: 0,
        total_orders_delivered: 0,
        total_failed_deliveries: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      getSupportedCountries: 'fulfilment/getSupportedCountries',
    }),
  },
  watch: {
    getSupportedCountries(countries) {
      countries.forEach(country => {
        const hasDuplicate = this.checkDuplicate(this.country_list, country);

        if (!hasDuplicate) {
          this.country_list.push({
            code: country.code,
            name: country.name,
          });
        }
      });
    },
    filterDate(val) {
      const payload = {
        lowerLimitDate: moment(val).format('YYYY-MM-DD'),
      };

      if (this.country !== null) {
        payload.country = this.country;
      }
      this.filteredStatsRequest(payload);
    },
    country(val) {
      const payload = {
        country: val,
      };

      if (this.filterDate !== null) {
        payload.lowerLimitDate = moment(val).format('YYYY-MM-DD');
      }
      this.filteredStatsRequest(payload);
    },
  },
  mounted() {
    this.fetching = true;
    this.initiateSellerStats();
    this.fetchCountries();
  },
  methods: {
    ...mapActions({
      fetchCountries: 'fulfilment/fetchHubCountries',
      getSellerStats: 'fulfilment/getSellerStats',
    }),
    ...mapMutations({
      setSellerPage: 'fulfilment/setSellerPage',
      setSingleSellerPage: 'fulfilment/setSingleSellerPage',
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
    }),
    async initiateSellerStats() {
      const response = await this.getSellerStats();
      if (Object.keys(response).length > 0) {
        this.statsData = response;
        this.fetching = false;
      }
    },
    checkDuplicate(arraySet, newVal) {
      for (let i = 0; i < arraySet.length; i++) {
        if (arraySet[i].name === newVal.name) {
          return true;
        }
      }
      return false;
    },
    formatNumber(val) {
      return val.toLocaleString();
    },
    startStartsCount() {
      const counters = document.querySelectorAll('.stats-count');
      const speed = 200;

      counters.forEach(counter => {
        const updateCount = () => {
          const target = parseInt(+counter.getAttribute('data-target'));
          const count = parseInt(+counter.innerText);
          const increment = Math.trunc(target / speed);

          if (count < target) {
            counter.innerText = count + increment;
            setTimeout(updateCount, 1);
          } else {
            count.innerText = target;
          }
        };
        updateCount();
      });
    },
    directToSellers(page) {
      this.setSellerPage(page);
      this.setSingleSellerPage(page);
      this.updateActivePage(page);
      this.setFulfilmentType(page);
    },
    async filteredStatsRequest(payload) {
      this.fetching = true;
      const response = await this.getSellerStats(payload);
      if (Object.keys(response).length > 0) {
        this.statsData = response;
        this.fetching = false;
      }
    },
  },
};
</script>
