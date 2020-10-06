<template>
  <div class="approved-requests-containers" v-loading="loadingStatus">
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="approved-requests-tabs"
    >
      <div class="approved-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="approved-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="approved-requests-driver-photo"
        />
        <div class="approved-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="approved-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="approved-requests-actions">
        <div class="approved-requests-actions-menu">
          <div
            class="approved-requests-actions-menu-items"
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
            class="approved-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'approvals'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'approvals')"
          >
            Approvals
          </div>
        </div>
        <div class="approved-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="approved-requests-actions-table-header">
              <div class="approved-requests-standard-column-adv">DD/TT</div>
              <div class="approved-requests-large-column-adv">Order</div>
              <div class="approved-requests-standard-column-adv">Amount</div>
              <div class="approved-requests-standard-column-adv">Station</div>
              <div class="approved-requests-standard-column-adv">Fuel type</div>
              <div class="approved-requests-standard-column-adv">
                Order type
              </div>
              <div class="approved-requests-standard-column-adv">
                Percentage
              </div>
            </div>
            <div class="approved-requests-actions-table-body">
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ dateFormat(order.owner_details.owner_approval_date) }}
              </div>
              <div class="approved-requests-large-column-adv">
                <div class="approved-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="approved-requests-pickup">
                  <div class="approved-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="approved-requests-destination">
                  <div class="approved-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{
                  order.request_details.order_type.charAt(0).toUpperCase() +
                    order.request_details.order_type.slice(1).split('_')[0]
                }}
              </div>
              <div
                class="approved-requests-standard-column-adv approved-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'approvals'"
            class="approved-requests-owner-container"
          >
            <div class="approved-requests-owner-sections">
              <div class="approved-requests-section-header">Owner</div>
              <div class="approved-requests-owner-details">
                <span class="approved-requests-owner-label">Name:</span>
                {{ order.owner_details.name }}
              </div>
              <div class="approved-requests-owner-details">
                <span class="approved-requests-owner-label">Phone number:</span>
                {{ order.owner_details.phone_number }}
              </div>
            </div>
            <div
              class="approved-requests-owner-sections"
              v-if="order.admin_details"
            >
              <div class="approved-requests-section-header">Ops</div>
              <div class="approved-requests-owner-details">
                <span class="approved-requests-owner-label">Name:</span>
                {{ order.admin_details.name }}
              </div>
              <div class="approved-requests-owner-details">
                <span class="approved-requests-owner-label">Email:</span>
                {{ order.admin_details.email }}
              </div>
            </div>
            <div class="approved-requests-owner-sections">
              <div class="approved-requests-section-header">Status</div>
              <div class="approved-requests-owner-details">
                <span class="approved-requests-owner-label">Status:</span>
                {{ order.owner_details.status }}
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
      There are no approved requests
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import moment from 'moment';

let timer = '';

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
      pollActive: false,
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
    pollActive(val) {
      if (val) {
        this.poll();
      }
    },
    rider(val) {
      this.orders = [];
      if (val > 0) {
        this.riderParam = `&rider_id=${val}`;
      } else {
        this.riderParam = '';
      }
      this.loadingStatus = true;
      this.fetchOrders();
    },
    service(val) {
      this.orders = [];
      this.serviceParam = '';
      this.loadingStatus = true;
      this.fetchOrders();
    },
    country(val) {
      this.orders = [];
      this.countryParam = `&country_code=${val}`;
      this.loadingStatus = true;
      this.fetchOrders();
    },
    unit(val) {
      this.orders = [];
      this.unitParam = `&business_unit=${val}`;
      this.loadingStatus = true;
      this.fetchOrders();
    },
  },
  created() {
    this.loadingStatus = true;
    this.fetchOrders();
    this.pollActive = true;
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  methods: {
    ...mapActions({
      get_fuel_advances: 'fuel_advances',
    }),
    async fetchOrders() {
      const oldOrders = this.orders;
      const payload = {
        param: `?approved=1${this.params}`,
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
    poll() {
      if (this.pollActive) {
        timer = setTimeout(() => {
          this.fetchOrders();
          this.poll();
        }, 60000);
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
  },
};
</script>

<style>
.approved-requests-containers {
  height: 568px;
  overflow-y: scroll;
}
.approved-requests-tabs {
  height: 180px;
  display: flex;
  margin: 10px 0px 10px 0px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
  width: 94%;
  border: 1px solid #f2f6fc;
  border-radius: 5px;
  padding-right: 10px;
}
.approved-requests-driver-photo {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin: 5px;
}
.approved-requests-driver-details {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 5px solid #1e7d11;
}
.approved-requests-driver-name,
.approved-requests-driver-phone {
  color: #909399;
  font-size: 14px;
}
.approved-requests-actions-menu {
  display: flex;
  height: 40px;
  align-items: center;
}
.approved-requests-actions-menu-items {
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
.approved-requests-actions-table-header,
.approved-requests-actions-table-body {
  display: flex;
  padding-left: 30px;
}
.approved-requests-standard-column {
  width: 15%;
}
.approved-requests-column-ovverride {
  color: #000000;
  font-size: 14px;
  margin: 10px 0px 5px 0px;
  padding: 0px 10px 0px 0px;
}
.approved-requests-large-column {
  width: 25%;
}
.approved-requests-actions {
  width: -webkit-fill-available;
  margin-left: 50px;
}
.approved-requests-actions-table-header {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  color: #1871ac;
  font-size: 14px;
  align-items: center;
}
.approved-requests-orderno {
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0px 5px 0px;
}
.approved-requests-pickup,
.approved-requests-destination {
  font-weight: 500;
  font-size: 12px;
  color: #606266;
  margin: 5px 0px 5px 0px;
  display: flex;
  align-items: center;
}
.approved-requests-pickup-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #ea7125;
}
.approved-requests-destination-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #1871ac;
}
.approved-requests-edit-inputs {
  border: 1px solid #dcdfe6;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  margin: 0px 5px 0px 5px;
  width: -webkit-fill-available;
  padding: 10px;
}
.approved-requests-update-button {
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
.approved-requests-edit {
  margin: 20px;
  position: relative;
}
.approved-requests-edit-top {
  display: flex;
}
.approved-requests-edit-bottom {
  display: flex;
  justify-content: flex-end;
}
.approved-requests-input-label {
  margin: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #1871ac;
}
.approved-requests-filler {
  width: -webkit-fill-available;
}
.approved-requests-info {
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
.approved-requests-popover {
  background: #1871ac;
  color: white;
}
.approved-requests-owner-container {
  display: flex;
  align-items: flex-start;
  height: 130px;
  padding-left: 30px;
  padding-top: 20px;
}
.approved-requests-owner-details {
  margin: 10px 0px 10px 0px;
  font-size: 14px;
}
.approved-requests-owner-label {
  color: #909090;
  margin-right: 5px;
}
.approved-requests-owner-sections {
  width: 30%;
}
.approved-question-override {
  color: #ea7125;
}
.approved-input-override {
  display: flex;
  align-items: center;
}
.approved-requests-spacer-2 {
  margin-right: 10px;
}
.approved-requests-spacer-1 {
  margin-right: 25px;
}
.approved-requests-large-column-adv {
  width: 28%;
}
.approved-requests-standard-column-adv {
  width: 12%;
}
.approved-requests-section-header {
  color: #ea7125;
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
