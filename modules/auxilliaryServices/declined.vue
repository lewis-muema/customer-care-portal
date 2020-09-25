<template>
  <div class="declined-requests-containers" v-loading="loadingStatus">
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="declined-requests-tabs"
    >
      <div class="declined-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="declined-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="declined-requests-driver-photo"
        />
        <div class="declined-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="declined-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="declined-requests-actions">
        <div class="declined-requests-actions-menu">
          <div
            class="declined-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'details'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'details')"
          >
            Details
          </div>
          <div
            class="declined-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'reason' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'reason')"
          >
            Reason
          </div>
        </div>
        <div class="declined-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="declined-requests-actions-table-header">
              <div class="declined-requests-standard-column-adv">DD/TT</div>
              <div class="declined-requests-large-column-adv">Order</div>
              <div class="declined-requests-standard-column-adv">Amount</div>
              <div class="declined-requests-standard-column-adv">Station</div>
              <div class="declined-requests-standard-column-adv">Fuel type</div>
              <div class="declined-requests-standard-column-adv">
                Order type
              </div>
              <div class="declined-requests-standard-column-adv">
                Percentage
              </div>
            </div>
            <div class="declined-requests-actions-table-body">
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ dateFormat(order.request_details.date_time) }}
              </div>
              <div class="declined-requests-large-column-adv">
                <div class="declined-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="declined-requests-pickup">
                  <div class="declined-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="declined-requests-destination">
                  <div class="declined-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="declined-requests-standard-column-adv declined-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'reason'"
            class="declined-requests-owner-container"
          >
            <div class="declined-requests-owner-sections">
              <div class="declined-requests-section-header">
                Rejected by {{ declinedUser(order) }}
              </div>
              <div class="declined-requests-owner-details">
                <span class="declined-requests-owner-label">{{
                  order.admin_details.reason
                    ? order.admin_details.reason
                    : 'No reason given'
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="orders.length === 0 && !loadingStatus"
      class="no-requests-container"
    >
      There are no declined requests
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
      orders: [],
      loadingStatus: false,
      riderParam: '',
      serviceParam: '',
      countryParam: '&country_code=ke',
      unitParam: '',
    };
  },
  computed: {
    params() {
      return `${this.riderParam}${this.serviceParam}${this.countryParam}${this.unitParam}`;
    },
  },
  watch: {
    orders: {
      handler(val) {
        // console.log(val);
      },
      deep: true,
    },
    rider(val) {
      this.orders = [];
      if (val > 0) {
        this.riderParam = `&rider_id=${val}`;
      } else {
        this.riderParam = '';
      }
      this.fetchOrders();
    },
    service(val) {
      this.orders = [];
      this.serviceParam = '';
      this.fetchOrders();
    },
    country(val) {
      this.orders = [];
      this.countryParam = `&country_code=${val}`;
      this.fetchOrders();
    },
    unit(val) {
      this.orders = [];
      this.unitParam = `&business_unit=${val}`;
      this.fetchOrders();
    },
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    ...mapActions({
      get_fuel_advances: 'fuel_advances',
    }),
    async fetchOrders() {
      this.loadingStatus = true;
      const oldOrders = this.orders;
      const payload = {
        param: `?declined=1${this.params}`,
      };
      const response = await this.get_fuel_advances(payload);
      if (response.status) {
        response.data.forEach((row, i) => {
          row.activeMenuTab =
            oldOrders.length > 0 && oldOrders.length > i
              ? oldOrders[i].activeMenuTab
              : 'details';
        });
        this.loadingStatus = false;
        this.orders = response.data;
      } else {
        this.loadingStatus = false;
        this.orders = [];
      }
    },
    changeTab(index, data) {
      this.orders[index].activeMenuTab = data;
    },
    thousandsSeparator(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    declinedUser(order) {
      if (order.owner_details.status === 'rejected') {
        return 'Owner';
      }
      if (order.admin_details.status === 'rejected') {
        return 'Ops';
      }
    },
  },
};
</script>

<style>
.declined-requests-containers {
  height: 568px;
  overflow-y: scroll;
}
.declined-requests-tabs {
  height: 180px;
  display: flex;
  margin: 10px 0px 10px 0px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
  width: 94%;
  border: 1px solid #f2f6fc;
  border-radius: 5px;
  padding-right: 10px;
}
.declined-requests-driver-photo {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin: 5px;
}
.declined-requests-driver-details {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 5px solid #d2212a;
}
.declined-requests-driver-name,
.declined-requests-driver-phone {
  color: #909399;
  font-size: 14px;
}
.declined-requests-actions-menu {
  display: flex;
  height: 40px;
  align-items: center;
}
.declined-requests-actions-menu-items {
  width: 100px;
  text-align: center;
  cursor: pointer;
  color: #919191;
  font-weight: 600;
}
.active-actions-menu-item {
  text-decoration: underline;
  color: #ea7125 !important;
}
.declined-requests-actions-table-header,
.declined-requests-actions-table-body {
  display: flex;
  padding-left: 30px;
}
.declined-requests-standard-column {
  width: 15%;
}
.declined-requests-column-ovverride {
  color: #000000;
  font-size: 14px;
  margin: 10px 0px 5px 0px;
  padding: 0px 10px 0px 0px;
}
.declined-requests-large-column {
  width: 25%;
}
.declined-requests-actions {
  width: -webkit-fill-available;
  margin-left: 50px;
}
.declined-requests-actions-table-header {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  color: #1871ac;
  font-size: 14px;
  align-items: center;
}
.declined-requests-orderno {
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0px 5px 0px;
}
.declined-requests-pickup,
.declined-requests-destination {
  font-weight: 500;
  font-size: 12px;
  color: #606266;
  margin: 5px 0px 5px 0px;
  display: flex;
  align-items: center;
}
.declined-requests-pickup-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #ea7125;
}
.declined-requests-destination-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #1871ac;
}
.declined-requests-edit-inputs {
  border: 1px solid #dcdfe6;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  margin: 0px 5px 0px 5px;
  width: -webkit-fill-available;
  padding: 10px;
}
.declined-requests-update-button {
  background: #ea7125;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 5px;
  color: white;
  height: 40px;
  width: 100px;
  font-size: 14px;
  font-weight: 600;
  margin: 5px;
}
.declined-requests-edit {
  margin: 20px;
  position: relative;
}
.declined-requests-edit-top {
  display: flex;
}
.declined-requests-edit-bottom {
  display: flex;
  justify-content: flex-end;
}
.declined-requests-input-label {
  margin: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #1871ac;
}
.declined-requests-filler {
  width: -webkit-fill-available;
}
.declined-requests-info {
  position: absolute;
  right: 0px;
  top: -40px;
  color: #000000;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #dff1fd;
  cursor: pointer;
}
.declined-requests-popover {
  background: #1871ac;
  color: white;
}
.declined-requests-owner-container {
  display: flex;
  align-items: flex-start;
  height: 130px;
  padding-left: 30px;
  padding-top: 20px;
}
.declined-requests-owner-details {
  margin: 10px 0px 10px 0px;
  font-size: 14px;
}
.declined-requests-owner-label {
  color: #909090;
  margin-right: 5px;
}
.declined-requests-owner-sections {
  width: 30%;
}
.declined-question-override {
  color: #ea7125;
}
.declined-input-override {
  display: flex;
  align-items: center;
}
.declined-requests-spacer-2 {
  margin-right: 10px;
}
.declined-requests-spacer-1 {
  margin-right: 25px;
}
.declined-requests-large-column-adv {
  width: 28%;
}
.declined-requests-standard-column-adv {
  width: 12%;
}
.declined-requests-section-header {
  color: #d2212a;
  font-weight: 600;
  font-size: 14px;
}
.no-requests-container {
  width: 90%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c9531b;
  font-size: 15px;
  font-weight: 600;
}
</style>
