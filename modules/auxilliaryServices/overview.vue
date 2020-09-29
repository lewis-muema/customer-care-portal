<template>
  <div class="overview-content-holder" v-loading="loadingStatus">
    <div class="date-filter-input">
      <el-date-picker
        v-model="filterdate"
        type="daterange"
        range-separator="-"
        start-placeholder="From"
        end-placeholder="To"
      >
      </el-date-picker>
    </div>
    <div class="date-filter-title">
      The data you are currently viewing is from {{ startDate }}
    </div>
    <div>
      <div class="overview-tab-sections">
        <div class="overview-tabs-upper">
          <div class="icon-container green-bg">
            <img src="https://images.sendyit.com/CCredesign/money.png" alt="" />
          </div>
          <div class="filter-section-desc">Total fuel amount advanced</div>
          <div class="filter-section-amount">
            {{ currency }}
            {{
              total_fuel_amount_advanced
                ? parseFloat(total_fuel_amount_advanced).toFixed(2)
                : ''
            }}
          </div>
        </div>
        <div class="overview-tabs-upper">
          <div class="icon-container brown-bg">
            <img
              src="https://images.sendyit.com/CCredesign/gas_pump.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total litres advanced</div>
          <div class="filter-section-amount">
            {{
              total_litres_advanced
                ? parseFloat(total_litres_advanced).toFixed(2)
                : ''
            }}
          </div>
        </div>
        <div class="overview-tabs-upper">
          <div class="icon-container orange-bg">
            <img src="https://images.sendyit.com/CCredesign/link.png" alt="" />
          </div>
          <div class="filter-section-desc">Total requests</div>
          <div class="filter-section-amount">{{ total_requests }}</div>
        </div>
      </div>
      <div class="overview-tab-sections">
        <div class="overview-tabs-lower">
          <div class="icon-container blue-bg">
            <img
              src="https://images.sendyit.com/CCredesign/contact.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total partners</div>
          <div class="filter-section-amount">{{ total_partners }}</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container pink-bg">
            <img
              src="https://images.sendyit.com/CCredesign/success.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total approvals</div>
          <div class="filter-section-amount">{{ total_approvals }}</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container red-bg">
            <img
              src="https://images.sendyit.com/CCredesign/failed.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total Rejects</div>
          <div class="filter-section-amount">{{ total_rejects }}</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container yellow-bg">
            <img src="https://images.sendyit.com/CCredesign/graph.png" alt="" />
          </div>
          <div class="filter-section-desc">Sendy take</div>
          <div class="filter-section-amount">
            {{ currency }}
            {{ sendy_take ? parseFloat(sendy_take).toFixed(2) : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import moment from 'moment';

export default {
  props: {
    rider: {
      type: Number,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      filterdate: '',
      params: '',
      total_fuel_amount_advanced: '',
      total_litres_advanced: '',
      total_requests: '',
      total_partners: '',
      total_approvals: '',
      total_rejects: '',
      sendy_take: '',
      currency: '',
      loadingStatus: false,
      dateParam: '',
      unitParam: '',
      countryParam: '?country_code=KE',
      serviceParam: '',
    };
  },
  computed: {
    allParams() {
      return `${this.countryParam}${this.dateParam}${this.unitParam}${this.serviceParam}`;
    },
    startDate() {
      if (this.filterdate) {
        return moment(this.filterdate[0]).format('YYYY-MM-DD');
      }
      return moment()
        .startOf('month')
        .format('YYYY-MM-DD');
    },
  },
  watch: {
    filterdate(val) {
      if (val) {
        this.dateParam = `&from_date=${new Date(
          val[0],
        ).toISOString()}&to_date=${new Date(val[1]).toISOString()}`;
      } else {
        this.dateParam = '';
      }
      this.fetchStats();
    },
    service(val) {
      this.serviceParam = '';
      this.fetchStats();
    },
    country(val) {
      this.countryParam = `?country_code=${val.toUpperCase()}`;
      this.fetchStats();
    },
    unit(val) {
      this.unitParam = `&business_unit=${val.toUpperCase()}`;
      this.fetchStats();
    },
  },
  created() {
    this.fetchStats();
  },
  methods: {
    ...mapActions({
      get_fuel_stats: 'fuel_stats',
    }),
    async fetchStats() {
      this.loadingStatus = true;
      const payload = {
        param: `${this.allParams}`,
      };
      const data = await this.get_fuel_stats(payload);
      this.loadingStatus = false;
      if (data.status) {
        this.total_fuel_amount_advanced = data.data.total_amount_advanced;
        this.total_litres_advanced = data.data.total_litres_advanced;
        this.total_requests = data.data.total_requests;
        this.total_partners = data.data.no_of_riders;
        this.total_approvals = data.data.approved_advances;
        this.total_rejects = data.data.rejected_advances;
        this.sendy_take = data.data.sendy_take;
        this.currency = data.data.currency;
      }
    },
  },
};
</script>

<style>
.overview-content-holder {
  padding: 20px;
}
.overview-tab-sections {
  display: flex;
  height: 200px;
  align-items: center;
  justify-content: center;
}
.overview-tabs-upper {
  width: 33%;
  height: 90%;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  margin: 10px;
  border: 1px solid #f2f6fc;
}
.overview-tabs-lower {
  width: 24%;
  height: 90%;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  margin: 10px;
  border: 1px solid #f2f6fc;
}
.icon-container {
  padding: 15px;
  border-radius: 50px;
}
.green-bg {
  background: #f5fbf4;
}
.brown-bg {
  background: #fffaf5;
}
.orange-bg {
  background: #fffbf5;
}
.blue-bg {
  background: #fafdff;
}
.pink-bg {
  background: #fff9fe;
}
.red-bg {
  background: #fff8f8;
}
.yellow-bg {
  background: #fffff5;
}
.filter-section-desc {
  color: #dcdcdc;
  font-size: 14px;
}
.filter-section-amount {
  color: #909399;
  font-weight: 500;
  font-size: 36px;
}
.date-filter-title {
  color: #f28226;
  margin: 10px 0px 10px 10px;
}
.date-filter-input {
  margin: 0px 0px 0px 10px;
}
</style>
