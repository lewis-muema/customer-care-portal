<template lang="html">
  <div class="">
    <div class="">
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
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="mc-seller-stats-cards-outer">
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
                  <div
                    class="mc-seller-card-description stats-count"
                    data-target="534"
                  >
                    0
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total orders awaiting delivery
                  </div>
                  <div
                    class="mc-seller-card-description stats-count"
                    data-target="230"
                  >
                    0
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total cancelled orders
                  </div>
                  <div
                    class="mc-seller-card-description stats-count"
                    data-target="900"
                  >
                    0
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6" class="mc-seller-stats-sum">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total failed deliveries
                  </div>
                  <div
                    class="mc-seller-card-description stats-count"
                    data-target="500"
                  >
                    0
                  </div>
                </el-card>
              </el-col>

              <el-col :span="6" class="mc-seller-stats-total-amount">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Total paid to date
                  </div>
                  <div class="mc-seller-card-description">
                    KES 23,500
                  </div>
                </el-card>
              </el-col>

              <el-col :span="6" class="mc-seller-stats-overdue-payment">
                <el-card shadow="always">
                  <div class="mc-seller-card-title">
                    Overdue payments
                  </div>
                  <div class="mc-seller-card-description">
                    KES 345,278
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
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SellerStats',
  components: {},
  data() {
    return {
      mode: 'SellerStats',
      componentKey: 0,
      country_list: [],
      country: '',
      filterDate: '',
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
        this.country_list.push({
          code: country.code,
          name: country.name,
        });
      });
    },
  },
  mounted() {
    this.fetchCountries();
    this.startStartsCount();
  },
  methods: {
    ...mapActions({
      fetchCountries: 'fulfilment/fetchHubCountries',
    }),
    ...mapMutations({
      setSellerPage: 'fulfilment/setSellerPage',
      setSingleSellerPage: 'fulfilment/setSingleSellerPage',
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
    }),
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
  },
};
</script>
