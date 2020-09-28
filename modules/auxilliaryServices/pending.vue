<template>
  <div class="pending-requests-parent">
    <div class="rejection-request-blinder" v-if="adminApproval === 2">
      <div class="rejection-dialogue">
        <div class="rejection-dialogue-header">
          Reject request
          <span
            class="rejection-dialogue-cancel"
            v-if="adminResponse === ''"
            @click="adminApproval = ''"
            ><i class="fa fa-times"></i
          ></span>
        </div>
        <div class="rejection-dialogue-reasons" v-if="adminResponse === ''">
          <p class="rejection-dialogue-title">
            Select rejection reason
          </p>
          <el-select
            class="rejection-dialogue-select"
            name=""
            id=""
            v-model="adminApprovalReason"
          >
            <el-option
              v-for="(reason, index) in reasons"
              :value="reason"
              :label="reason"
              :key="index"
            ></el-option>
          </el-select>
          <button
            class="rejection-dialogue-confirm"
            :class="
              adminApprovalReason
                ? 'rejection-dialogue-confirm-active'
                : 'rejection-dialogue-confirm-inactive'
            "
            @click="actionAdminRequest(index)"
          >
            Confirm
          </button>
        </div>
        <div class="rejection-dialogue-response-container" v-else>
          <p class="rejection-dialogue-title">
            {{ adminResponse }}
          </p>
          <p class="rejection-dialogue-OK" @click="reset()">OK</p>
        </div>
      </div>
    </div>
    <div
      class="pending-requests-containers"
      :class="adminApproval === 2 ? 'scroll-override' : ''"
      v-loading="loadingStatus"
    >
      <div
        v-if="notification"
        class="request-notification"
        :class="
          notificationStatus === 'success'
            ? 'success-request-notification'
            : 'failed-request-notification'
        "
      >
        {{ notification }}
      </div>
      <div
        v-for="(order, index) in orders"
        :key="index"
        class="pending-requests-tabs"
        @click="rowIndex = index"
      >
        <div class="pending-requests-driver-details" :class="tabColor(index)">
          <img
            v-if="order.driver_details.rider_photo"
            :src="
              `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
            "
            alt=""
            class="pending-requests-driver-photo"
          />
          <img
            v-else
            src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
            alt=""
            class="pending-requests-driver-photo"
          />
          <div class="pending-requests-driver-name">
            {{ order.driver_details.name }}
          </div>
          <div class="pending-requests-driver-phone">
            {{ order.driver_details.phone }}
          </div>
        </div>
        <div class="pending-requests-actions">
          <div class="pending-requests-actions-menu">
            <div
              class="pending-requests-actions-menu-items"
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
              class="pending-requests-actions-menu-items"
              :class="
                order.activeMenuTab === 'edit' ? 'active-actions-menu-item' : ''
              "
              @click="changeTab(index, 'edit')"
            >
              Edit
            </div>
            <div
              class="pending-requests-actions-menu-items"
              :class="
                order.activeMenuTab === 'owner'
                  ? 'active-actions-menu-item'
                  : ''
              "
              @click="changeTab(index, 'owner')"
            >
              Owner
            </div>
            <div
              class="pending-requests-actions-menu-items"
              :class="
                order.activeMenuTab === 'action'
                  ? 'active-actions-menu-item'
                  : ''
              "
              @click="changeTab(index, 'action')"
            >
              Action
            </div>
            <div
              class="pending-requests-actions-menu-items"
              :class="
                order.activeMenuTab === 'advanced'
                  ? 'active-actions-menu-item'
                  : ''
              "
              v-if="order.fuel_advanced"
              @click="changeTab(index, 'advanced')"
            >
              Fuel Advanced
            </div>
          </div>
          <div class="pending-requests-actions-tabs">
            <div v-if="order.activeMenuTab === 'details'">
              <div class="pending-requests-actions-table-header">
                <div class="pending-requests-large-column">Order</div>
                <div class="pending-requests-standard-column">Amount</div>
                <div class="pending-requests-standard-column">Station</div>
                <div class="pending-requests-standard-column">Fuel type</div>
                <div class="pending-requests-standard-column">Order type</div>
                <div class="pending-requests-standard-column">Percentage</div>
              </div>
              <div class="pending-requests-actions-table-body">
                <div class="pending-requests-large-column">
                  <div class="pending-requests-orderno">
                    {{ order.request_details.order_no }}
                  </div>
                  <div class="pending-requests-pickup">
                    <div class="pending-requests-pickup-indicator"></div>
                    {{ order.request_details.pick_up }}
                  </div>
                  <div class="pending-requests-destination">
                    <div class="pending-requests-destination-indicator"></div>
                    {{ order.request_details.destination }}
                  </div>
                </div>
                <div
                  class="pending-requests-standard-column pending-requests-column-ovverride"
                >
                  {{ order.request_details.currency }}
                  {{ thousandsSeparator(order.request_details.amount) }}
                </div>
                <div
                  class="pending-requests-standard-column pending-requests-column-ovverride"
                >
                  {{ order.request_details.station }}<br />({{
                    order.request_details.address
                  }})
                </div>
                <div
                  class="pending-requests-standard-column pending-requests-column-ovverride"
                >
                  {{ order.request_details.fuel_type }}
                </div>
                <div
                  class="pending-requests-standard-column pending-requests-column-ovverride"
                >
                  {{
                    order.request_details.order_type === 1
                      ? 'On-demand'
                      : 'Dedicated'
                  }}
                </div>
                <div
                  class="pending-requests-standard-column pending-requests-column-ovverride"
                >
                  {{ order.request_details.percentage }} %
                </div>
              </div>
            </div>
            <div
              v-if="order.activeMenuTab === 'edit'"
              class="pending-requests-edit"
            >
              <el-popover
                placement="top-start"
                title=""
                width="305"
                trigger="hover"
                popper-class="pending-requests-popover"
                content="Once a request is updated, the changes will reflect on the partner app and owners portal. Ensure the owner has approved of this edit."
              >
                <div class="pending-requests-info" slot="reference">
                  <i class="fa fa-info"></i>
                </div>
              </el-popover>
              <div class="pending-requests-edit-top">
                <div class="pending-requests-filler">
                  <span class="pending-requests-input-label">Fuel amount</span
                  ><br />
                  <input
                    type="text"
                    class="pending-requests-edit-inputs"
                    v-model="editData[index].request_details.amount"
                    :disabled="order.owner_details.status !== 'pending'"
                  />
                </div>
                <div class="pending-requests-filler">
                  <span class="pending-requests-input-label"
                    >Fueling station</span
                  ><br />
                  <select
                    name="station"
                    id=""
                    class="pending-requests-edit-inputs"
                    v-model="editData[index].request_details.station"
                    @change="
                      changeAddresses(order.request_details.station, index)
                    "
                    :disabled="order.owner_details.status !== 'pending'"
                  >
                    <option
                      :value="station.station_name"
                      v-for="(station, index) in stations"
                      :key="index"
                      :label="station.station_name"
                      >{{ station.station_name }}</option
                    >
                  </select>
                </div>
                <div class="pending-requests-filler">
                  <span class="pending-requests-input-label"
                    >Station Address</span
                  ><br />
                  <select
                    name="address"
                    id=""
                    class="pending-requests-edit-inputs"
                    v-model="editData[index].request_details.address"
                    :disabled="order.owner_details.status !== 'pending'"
                  >
                    <option
                      :value="address.name"
                      v-for="(address, index) in addresses"
                      :key="index"
                      :label="address.name"
                      >{{ address.name }}</option
                    >
                  </select>
                </div>
                <div class="pending-requests-filler">
                  <span class="pending-requests-input-label">Fuel type</span
                  ><br />
                  <select
                    name="fuel"
                    id=""
                    class="pending-requests-edit-inputs"
                    v-model="editData[index].request_details.fuel_type"
                    :disabled="order.owner_details.status !== 'pending'"
                  >
                    <option
                      :value="fuel.name"
                      v-for="(fuel, index) in fuel_types"
                      :key="index"
                      :label="fuel.name"
                      >{{ fuel.name }}</option
                    ></select
                  >
                </div>
              </div>
              <div class="pending-requests-edit-bottom">
                <button
                  class="pending-requests-update-button"
                  :class="
                    !loading && validate(index)
                      ? 'active-update-override'
                      : 'inactive-update-override'
                  "
                  v-loading="loading && rowIndex === index"
                  @click="editFuelAdvance(index)"
                >
                  Update
                </button>
              </div>
            </div>
            <div
              v-if="order.activeMenuTab === 'owner'"
              class="pending-requests-owner-container"
            >
              <div class="pending-requests-owner-section-left">
                <div class="pending-requests-owner-details">
                  <span class="pending-requests-owner-label">Name:</span>
                  {{ order.owner_details.name }}
                </div>
                <div class="pending-requests-owner-details">
                  <span class="pending-requests-owner-label"
                    >Phone number:</span
                  >
                  {{ order.owner_details.phone_number }}
                </div>
                <div class="pending-requests-owner-details">
                  <span class="pending-requests-owner-label">Status:</span>
                  {{ order.owner_details.status }}
                </div>
              </div>
              <div
                class="pending-requests-owner-section-right"
                v-if="editData[index].owner_details.status === 'pending'"
              >
                <div v-if="approvalError" class="approve-error">
                  {{ approvalError }}
                </div>
                <div
                  class="pending-requests-owner-details approved-question-override"
                >
                  Has the owner approved this request?
                </div>
                <div
                  class="pending-requests-owner-details approved-input-override"
                >
                  <input
                    type="radio"
                    id="owner-approval-yes"
                    class="pending-requests-spacer-2"
                    :value="true"
                    v-model="approvalStatus"
                  />
                  <span class="pending-requests-spacer-1">Yes</span>
                  <input
                    type="radio"
                    id="owner-approval-no"
                    class="pending-requests-spacer-2"
                    :value="false"
                    v-model="approvalStatus"
                  />
                  <span class="pending-requests-spacer-1">No</span>
                  <button
                    class="pending-requests-update-button"
                    :class="
                      approvalStatus !== '' && !loading
                        ? 'active-update-override'
                        : 'inactive-update-override'
                    "
                    v-loading="loading && rowIndex === index"
                    @click="actionOwnerRequest(index)"
                  >
                    Update
                  </button>
                </div>
              </div>
              <div
                class="pending-requests-owner-section-right"
                v-if="editData[index].owner_details.status === 'approved'"
              >
                <span class="approved-request-title"
                  >The request has been approved by the owner</span
                >
                <span
                  @click="editData[index].owner_details.status = 'pending'"
                  class="edit-action-input"
                  >EDIT ACTION</span
                >
              </div>
              <div
                class="pending-requests-owner-section-right"
                v-if="editData[index].owner_details.status === 'rejected'"
              >
                <span class="rejected-request-title"
                  >The request has been rejected by the owner</span
                >
                <span
                  @click="editData[index].owner_details.status = 'pending'"
                  class="edit-action-input"
                  >EDIT ACTION</span
                >
              </div>
            </div>
            <div
              v-if="order.activeMenuTab === 'action'"
              class="pending-requests-owner-container"
            >
              <div v-if="!order.admin_details">
                <div
                  class="pending-requests-owner-details approved-question-override"
                >
                  Approve fuel advance request
                </div>
                <div>
                  <input
                    type="radio"
                    id="owner-approval-yes"
                    class="pending-requests-spacer-2"
                    :value="1"
                    v-model="adminApproval"
                  />
                  <span class="pending-requests-spacer-1">Approve</span>
                  <input
                    type="radio"
                    id="owner-approval-no"
                    class="pending-requests-spacer-2"
                    :value="2"
                    v-model="adminApproval"
                  />
                  <span class="pending-requests-spacer-1">Reject</span>
                  <button
                    class="pending-requests-update-button"
                    :class="
                      adminApproval !== '' && !loading
                        ? 'active-update-override'
                        : 'inactive-update-override'
                    "
                    v-loading="loading && rowIndex === index"
                    @click="actionAdminRequest(index)"
                  >
                    Update
                  </button>
                </div>
                <div v-if="approvalError" class="approve-error">
                  {{ approvalError }}
                </div>
              </div>
              <div
                class="pending-requests-action-section-right"
                v-if="
                  order.admin_details &&
                    order.admin_details.status === 'approved'
                "
              >
                <span class="approved-request-title"
                  >The request has been approved by the admin</span
                >
              </div>
              <div
                class="pending-requests-action-section-right"
                v-if="
                  order.admin_details &&
                    order.admin_details.status === 'rejected'
                "
              >
                <span class="rejected-request-title"
                  >The request has been rejected by the admin</span
                >
              </div>
            </div>
            <div v-if="order.activeMenuTab === 'advanced'">
              <div class="pending-requests-actions-table-header">
                <div class="pending-requests-standard-column-adv">DD/TT</div>
                <div class="pending-requests-large-column-adv">Order</div>
                <div class="pending-requests-standard-column-adv">Amount</div>
                <div class="pending-requests-standard-column-adv">Station</div>
                <div class="pending-requests-standard-column-adv">
                  Fuel type
                </div>
                <div class="pending-requests-standard-column-adv">
                  Order type
                </div>
                <div class="pending-requests-standard-column-adv">
                  Percentage
                </div>
              </div>
              <div class="pending-requests-actions-table-body">
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ dateFormat(order.request_details.date_time) }}
                </div>
                <div class="pending-requests-large-column-adv">
                  <div class="pending-requests-orderno">
                    {{ order.request_details.order_no }}
                  </div>
                  <div class="pending-requests-pickup">
                    <div class="pending-requests-pickup-indicator"></div>
                    {{ order.request_details.pick_up }}
                  </div>
                  <div class="pending-requests-destination">
                    <div class="pending-requests-destination-indicator"></div>
                    {{ order.request_details.destination }}
                  </div>
                </div>
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ order.request_details.currency }}
                  {{ thousandsSeparator(order.request_details.amount) }}
                </div>
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ order.request_details.station }}<br />({{
                    order.request_details.address
                  }})
                </div>
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ order.request_details.fuel_type }}
                </div>
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ order.request_details.order_type }}
                </div>
                <div
                  class="pending-requests-standard-column-adv pending-requests-column-ovverride"
                >
                  {{ order.request_details.percentage }} %
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
        There are no pending requests
      </div>
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
      stations: [],
      fuel_types: [],
      addresses: [],
      reasons: [
        'Truck has already fueled',
        'Owner has disapproved request',
        'Partner is too far from fueling station',
      ],
      adminResponse: '',
      rowIndex: '',
      approvalStatus: '',
      approvalError: '',
      adminApproval: '',
      adminApprovalReason: '',
      loading: false,
      notification: '',
      notificationStatus: '',
      riderParam: '',
      serviceParam: '',
      countryParam: '&country_code=ke',
      unitParam: '',
      editData: [],
      pollActive: false,
    };
  },
  computed: {
    ...mapState(['config', 'userData']),
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
      this.clearAdmin();
      this.loadingStatus = true;
      this.fetchOrders();
    },
    service(val) {
      this.orders = [];
      this.serviceParam = '';
      this.clearAdmin();
      this.loadingStatus = true;
      this.fetchOrders();
    },
    country(val) {
      this.orders = [];
      this.countryParam = `&country_code=${val}`;
      this.clearAdmin();
      this.loadingStatus = true;
      this.fetchOrders();
    },
    unit(val) {
      this.orders = [];
      this.unitParam = `&business_unit=${val}`;
      this.clearAdmin();
      this.loadingStatus = true;
      this.fetchOrders();
    },
  },
  created() {
    this.loadingStatus = true;
    this.fetchOrders();
    this.getFuelTypes();
    this.getFuelStations();
    this.pollActive = true;
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  methods: {
    ...mapActions({
      fuel_stations: 'fuel_stations',
      submit_fuel_advance: 'submit_fuel_advance',
      fuel_history_order: 'fuel_history_order',
      get_fuel_types: 'fuel_types',
      get_fuel_stations: 'fuel_stations',
      get_fuel_advances: 'fuel_advances',
      action_owner_request: 'action_owner_request',
      edit_owner_request: 'edit_owner_request',
    }),
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    async fetchOrders() {
      const oldOrders = this.orders;
      const payload = {
        param: `?pending=0${this.params}`,
      };
      const response = await this.get_fuel_advances(payload);
      if (response.status) {
        this.editData = [];
        response.data.forEach((row, i) => {
          row.activeMenuTab =
            oldOrders.length > 0 && oldOrders.length > i
              ? oldOrders[i].activeMenuTab
              : 'details';
          this.editData.push({
            request_details: {
              fuel_type: row.request_details.fuel_type,
              amount: row.request_details.amount,
              station: row.request_details.station,
              address: row.request_details.address,
            },
            owner_details: {
              status: row.owner_details.status,
            },
          });
          if (row.activeMenuTab === 'edit') {
            this.changeTab(i, 'edit');
          }
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
      if (data === 'edit') {
        const addresses = this.stations.find(stn => {
          return (
            stn.station_name === this.editData[index].request_details.station
          );
        });
        if (addresses) {
          this.addresses = addresses.station_addresses;
        }
        setTimeout(() => {
          const addressVal = this.addresses.find(
            stn => stn.name === this.editData[index].request_details.station,
          );
          if (!addressVal) {
            this.editData[index].request_details.address =
              this.addresses.length > 0 ? this.addresses[0].name : '';
          } else {
            this.editData[index].request_details.address = addressVal.name;
          }
        }, 500);
      }
      this.rowIndex = index;
      this.orders[index].activeMenuTab = data;
    },
    tabColor(index) {
      if (this.orders[index].activeMenuTab === 'details') {
        return 'pending-request-orange';
      }
      if (this.orders[index].activeMenuTab === 'edit') {
        return 'pending-request-blue';
      }
      if (this.orders[index].activeMenuTab === 'owner') {
        return 'pending-request-green';
      }
      if (this.orders[index].activeMenuTab === 'action') {
        return 'pending-request-yellow';
      }
      if (this.orders[index].activeMenuTab === 'advanced') {
        return 'pending-request-pink';
      }
    },
    thousandsSeparator(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    changeAddresses(station, index) {
      const addresses = this.stations.find(
        stn =>
          stn.station_name === this.editData[index].request_details.station,
      );
      this.addresses = addresses.station_addresses;
      this.editData[index].request_details.address =
        this.addresses.length > 0 ? this.addresses[0].name : '';
    },
    validate(index) {
      const data = this.editData[index].request_details;
      if (
        this.orders[index].owner_details.status === 'pending' &&
        data.fuel_type &&
        data.amount &&
        data.station &&
        data.address
      ) {
        return true;
      }
      return false;
    },
    async getFuelTypes() {
      const data = await this.get_fuel_types();
      if (data.status) {
        this.fuel_types = data.data;
      }
    },
    async getFuelStations() {
      const data = await this.get_fuel_stations();
      if (data.status) {
        this.stations = data.data;
      }
    },
    async actionOwnerRequest(index) {
      this.rowIndex = index;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/aux/owner_approve_fuel_advance',
        params: {
          owner_id: parseInt(
            this.orders[this.rowIndex].owner_details.owner_id,
            10,
          ),
          order_no: this.orders[this.rowIndex].request_details.order_no,
          approval_status: this.approvalStatus ? 1 : 2,
          fuel_advance_id: this.orders[this.rowIndex].request_details
            .fuel_advance_id,
        },
      };
      this.loading = true;
      const data = await this.action_owner_request(payload);
      this.loading = false;
      if (data.status) {
        this.showNotification('success', data.message);
        this.fetchOrders();
        this.approvalStatus = '';
      } else {
        this.showNotification('failed', data.message);
      }
    },
    async actionAdminRequest(index) {
      this.rowIndex = index;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/aux/admin_approve_fuel_advance',
        params: {
          user_id: parseInt(this.userData.payload.data.admin_id, 10),
          user_email: this.userData.payload.data.email,
          order_no: this.orders[this.rowIndex].request_details.order_no,
          approval_status: this.adminApproval,
          fuel_advance_id: this.orders[this.rowIndex].request_details
            .fuel_advance_id,
          approval_notes: this.adminApprovalReason,
        },
      };
      this.loading = true;
      const data = await this.action_owner_request(payload);
      this.loading = false;
      if (data.status) {
        if (this.adminApproval === 2) {
          this.adminResponse =
            'Action has been updated and reason sent to the partner and owner';
        } else {
          this.showNotification('success', data.message);
          this.reset();
        }
      } else {
        this.showNotification('failed', data.message);
      }
    },
    async editFuelAdvance(index) {
      this.rowIndex = index;
      const fuelVal = this.fuel_types.find(
        fl =>
          fl.name === this.editData[this.rowIndex].request_details.fuel_type,
      ).id;
      const addressVal = this.addresses.find(
        stn =>
          stn.name === this.editData[this.rowIndex].request_details.address,
      ).id;
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/aux/edit_fuel_advance',
        params: {
          order_no: this.orders[this.rowIndex].request_details.order_no,
          fuel_station_id: addressVal,
          fuel_type: fuelVal,
          amount: parseFloat(
            this.editData[this.rowIndex].request_details.amount,
          ),
          fuel_advance_id: this.orders[this.rowIndex].request_details
            .fuel_advance_id,
        },
      };
      this.loading = true;
      const data = await this.edit_owner_request(payload);
      this.loading = false;
      if (data.status) {
        this.showNotification('success', data.message);
        this.fetchOrders();
      } else {
        this.showNotification('failed', data.message);
      }
    },
    reset() {
      this.orders = [];
      this.loadingStatus = true;
      this.clearAdmin();
      this.fetchOrders();
    },
    clearAdmin() {
      this.adminApproval = '';
      this.adminApprovalReason = '';
      this.adminResponse = '';
    },
    showNotification(status, message) {
      this.notificationStatus = status;
      this.notification = message;
      setTimeout(() => {
        this.notification = '';
        this.notificationStatus = '';
      }, 5000);
    },
  },
};
</script>

<style>
.pending-requests-parent {
  position: relative;
}
.pending-requests-containers {
  height: 568px;
  overflow-y: scroll;
  z-index: 500;
  position: relative;
}
.scroll-override {
  overflow-y: hidden;
}
.pending-requests-tabs {
  height: 180px;
  display: flex;
  margin: 10px 0px 10px 0px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
  width: 94%;
  border: 1px solid #f2f6fc;
  border-radius: 5px;
  padding-right: 10px;
}
.pending-requests-driver-photo {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin: 5px;
}
.pending-requests-driver-details {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pending-requests-driver-name,
.pending-requests-driver-phone {
  color: #909399;
  font-size: 14px;
}
.pending-requests-actions-menu {
  display: flex;
  height: 40px;
  align-items: center;
}
.pending-requests-actions-menu-items {
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
.pending-requests-actions-table-header,
.pending-requests-actions-table-body {
  display: flex;
  padding-left: 30px;
}
.pending-requests-standard-column {
  width: 15%;
}
.pending-requests-column-ovverride {
  color: #000000;
  font-size: 14px;
  margin: 10px 0px 5px 0px;
  padding: 0px 10px 0px 0px;
}
.pending-requests-large-column {
  width: 25%;
}
.pending-requests-actions {
  width: -webkit-fill-available;
  margin-left: 50px;
}
.pending-requests-actions-table-header {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  color: #1871ac;
  font-size: 14px;
  align-items: center;
}
.pending-requests-orderno {
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0px 5px 0px;
}
.pending-requests-pickup,
.pending-requests-destination {
  font-weight: 500;
  font-size: 12px;
  color: #606266;
  margin: 5px 0px 5px 0px;
  display: flex;
  align-items: center;
}
.pending-requests-pickup-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #ea7125;
}
.pending-requests-destination-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #1871ac;
}
.pending-requests-edit-inputs {
  border: 1px solid #dcdfe6;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  margin: 0px 5px 0px 5px;
  width: -webkit-fill-available;
  padding: 10px;
}
.pending-requests-update-button {
  box-sizing: border-box;
  border-radius: 5px;
  color: white;
  height: 40px;
  width: 100px;
  font-size: 14px;
  font-weight: 600;
  margin: 5px;
}
.active-update-override {
  background: #ea7125;
  border: none;
}
.inactive-update-override {
  background: #dcdfe6;
  border: 1px solid #dcdfe6;
  pointer-events: none;
}
.pending-requests-edit {
  margin: 20px;
  position: relative;
}
.pending-requests-edit-top {
  display: flex;
}
.pending-requests-edit-bottom {
  display: flex;
  justify-content: flex-end;
}
.pending-requests-input-label {
  margin: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #1871ac;
}
.pending-requests-filler {
  width: -webkit-fill-available;
}
.pending-requests-info {
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
.pending-requests-popover {
  background: #1871ac;
  color: white;
}
.pending-requests-owner-container {
  display: flex;
  align-items: center;
  height: 130px;
  padding-left: 30px;
}
.pending-requests-owner-details {
  margin: 10px 0px 10px 0px;
  font-size: 14px;
}
.pending-requests-owner-label {
  color: #909090;
  margin-right: 5px;
}
.pending-requests-owner-section-left {
  width: 40%;
  border-right: 1px solid #e4e7ed;
}
.pending-requests-owner-section-right {
  width: 60%;
  padding-left: 7%;
}
.approved-question-override {
  color: #ea7125;
}
.approved-input-override {
  display: flex;
  align-items: center;
}
.pending-requests-spacer-2 {
  margin-right: 10px;
}
.pending-requests-spacer-1 {
  margin-right: 25px;
}
.pending-requests-large-column-adv {
  width: 28%;
}
.pending-requests-standard-column-adv {
  width: 12%;
}
.pending-request-orange {
  border-left: 5px solid #ea7125;
}
.pending-request-blue {
  border-left: 5px solid #1871ac;
}
.pending-request-green {
  border-left: 5px solid #43b634;
}
.pending-request-yellow {
  border-left: 5px solid #d3c657;
}
.pending-request-pink {
  border-left: 5px solid #d221a0;
}
.approved-request-title {
  color: #1e7d11;
  font-size: 14px;
  font-weight: 600;
}
.rejected-request-title {
  color: #d2212a;
  font-size: 14px;
  font-weight: 600;
}
.edit-action-input {
  color: #f28226;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding-left: 5px;
}
.approve-error {
  background: red;
  color: white;
  font-weight: 600;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
}
.pending-requests-action-section-right {
  width: 60%;
}
.reason-input-override {
  width: 200px !important;
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
.request-notification {
  position: fixed;
  width: 50%;
  height: 40px;
  text-align: center;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 12%;
  bottom: 20px;
}
.success-request-notification {
  background: #29a444;
}
.failed-request-notification {
  background: #d2212a;
}
.rejection-request-blinder {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #00000047;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  z-index: 1000;
}
.rejection-dialogue {
  width: 400px;
  height: 200px;
  background: white;
}
.rejection-dialogue-header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1871ac;
  color: white;
  font-size: 15px;
  font-weight: 700;
  position: relative;
}
.rejection-dialogue-cancel {
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.rejection-dialogue-title {
  text-align: center;
  margin: 10px;
  font-size: 14px;
}
.rejection-dialogue-reasons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rejection-dialogue-select {
  width: 250px;
  margin: 5px;
}
.rejection-dialogue-confirm {
  width: 100px;
  height: 40px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  color: white;
}
.rejection-dialogue-confirm-active {
  background: #1871ac;
}
.rejection-dialogue-confirm-inactive {
  pointer-events: none;
}
.rejection-dialogue-OK {
  color: #1a70ac;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}
.rejection-dialogue-response-container {
  margin: 35px;
}
</style>
