<template>
  <div>
    <p class="assign-header no-margin">Auxiliary Services</p>
    <div class="auxilliary-tabs">
      <p
        class="advance-tabs"
        :class="
          tab === 'fuel' ? 'active-services-tab' : 'inactive-services-tab'
        "
        @click="switchTab('fuel')"
      >
        Fuel Advance
      </p>
      <!-- <p
        class="advance-tabs"
        :class="
          tab === 'products' ? 'active-services-tab' : 'inactive-services-tab'
        "
        @click="switchTab('products')"
      >
        Fuel Station Products
      </p> -->
    </div>
    <div class="finances-tab" v-if="tab === 'fuel'">
      <div class="auxilliary-inputs">
        <div class="inputs-container">
          <span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Fueling Stations</p>
              <select
                id="stations"
                name="fuel-stations"
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="selectedStation"
                @change="changeAddresses()"
              >
                <option value="">--</option>
                <option
                  :value="station.station_name"
                  v-for="(station, index) in stations"
                  :key="index"
                  >{{ station.station_name }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Station Addresses</p>
              <select
                name="fuel-stations"
                id=""
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="selectedAddress"
              >
                <option value="">--</option>
                <option
                  :value="address.id"
                  v-for="(address, x) in addresses"
                  :key="x"
                  :label="address.name"
                  >{{ address.name }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Fuel Type</p>
              <select
                v-model="fuelType"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Type here"
              >
                <option value="">--</option>
                <option
                  v-for="(fuel, i) in fuel_types"
                  :key="i"
                  :value="fuel.id"
                  :label="fuel.name"
                  >{{ fuel.name }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Amount</p>
              <input
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                v-model="fuelAmount"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46"
              />
            </span>
          </span>
          <span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Currency</p>
              <select
                name="fuel-stations"
                id=""
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="currency"
              >
                <option :value="order.payment_details.order_currency">{{
                  order.payment_details.order_currency
                }}</option>
              </select>
            </span>
          </span>
          <p class="max-advance-title" v-if="maxAdvance">
            The maximum amount you can request for this order is
            {{ order.payment_details.order_currency }}
            {{ parseFloat(maxAdvance).toFixed(2) }}
          </p>
          <button
            :class="
              activeButtonStatus && !loading
                ? 'auxillary-save-button__active'
                : 'auxillary-save-button__inactive'
            "
            v-loading="loading"
            @click="submitFuelAdvance()"
          >
            Save
          </button>
        </div>
        <div v-if="history.length > 0">
          <p class="history-header">History</p>
          <table class="history-row">
            <tr class="history-head-col history-head-row">
              <td>Station</td>
              <td>Address</td>
              <td>Date/Time</td>
              <td>Amount</td>
              <td>Fuel type</td>
              <td>Order type</td>
              <td>Status</td>
            </tr>
            <tr class="history-head-col" v-for="(row, i) in history" :key="i">
              <td>
                {{ row.request_details.station }}
              </td>
              <td>{{ row.request_details.address }}</td>
              <td>{{ timeStamp(row.request_details.date_time) }}</td>
              <td>
                {{ row.request_details.currency }}
                {{ row.request_details.amount }}
              </td>
              <td>
                {{ row.request_details.fuel_type }}
              </td>
              <td>
                {{
                  row.request_details.order_type.charAt(0).toUpperCase() +
                    row.request_details.order_type.slice(1).split('_')[0]
                }}
              </td>
              <td>
                {{ row.request_details.status }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="finances-tab" v-if="tab === 'products'">
      <div class="auxilliary-inputs">
        <div class="inputs-container">
          <span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Fueling Stations</p>
              <select
                id="stations"
                name="fuel-stations"
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="selectedStation"
              >
                <option
                  :value="station.id"
                  v-for="(station, index) in stations"
                  :key="index"
                  >{{ station.name }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Select Product</p>
              <select
                name="fuel-stations"
                id=""
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="productName"
              >
                <option value="">--</option>
                <option
                  v-for="(product, index) in products"
                  :key="index"
                  :value="product.name"
                  >{{ product.name }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Product Type</p>
              <select
                name="fuel-stations"
                id=""
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="productType"
                :disabled="filteredProduct[0] === 'n/a'"
              >
                <option value="" v-if="filteredProduct[0] !== 'n/a'">--</option>
                <option
                  v-for="(type, index) in filteredProduct"
                  :key="index"
                  :value="type"
                  >{{ type }}</option
                >
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Quantity</p>
              <select
                name="fuel-stations"
                id=""
                class="freight-assign-rider-buttons assign_inputs currency-input"
                v-model="productQuantity"
                :disabled="productQuantity === 'n/a'"
              >
                <option :value="productQuantity">{{ productQuantity }}</option>
              </select>
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Cost</p>
              <input
                v-model="Notes"
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Type here"
              />
            </span>
          </span>
          <button
            :class="
              activeButtonStatus
                ? 'auxillary-save-button__active'
                : 'auxillary-save-button__inactive'
            "
            @click="submitFuelAdvance()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: 'fuel',
      selectedStation: '',
      currency: this.order.payment_details.order_currency,
      litres: '',
      pumpRate: '',
      sendyRate: '',
      pumpRateAmount: 0,
      sendyTotalAmount: 0,
      sendyTakeAmount: 0,
      history: [],
      Notes: '',
      fuelType: '',
      products: [
        {
          name: 'Oils',
          types: ['Engine oil', 'Hydraulic oil', 'Transmission oil', 'Grease'],
          quantity: 'Litres',
        },
        {
          name: 'Lubricants',
          types: ['n/a'],
          quantity: 'Litres',
        },
        {
          name: 'Car wash service',
          types: ['n/a'],
          quantity: 'n/a',
        },
        {
          name: 'Vehicle service',
          types: ['Interim', 'Full', 'Major'],
          quantity: 'n/a',
        },
      ],
      productName: '',
      productType: '',
      productQuantity: 'n/a',
      filteredProduct: [],
      stations: [],
      fuel_types: [],
      addresses: [],
      selectedAddress: '',
      fuelAmount: '',
      loading: false,
      limit: false,
      maxAdvance: '',
    };
  },
  computed: {
    ...mapState([
      'actionErrors',
      'actionClass',
      'config',
      'vendorType',
      'userData',
    ]),
    ...mapGetters({
      getSession: 'getSession',
    }),
    activeButtonStatus() {
      if (
        this.selectedStation &&
        this.selectedAddress &&
        this.fuelType > 0 &&
        this.fuelAmount &&
        !this.limit
      ) {
        return true;
      }
      return false;
    },
  },
  watch: {
    productName(data) {
      const singleProduct = this.products.filter(product => {
        return product.name === data;
      });
      this.productQuantity =
        singleProduct.length > 0 ? singleProduct[0].quantity : 'n/a';
      this.filteredProduct =
        singleProduct.length > 0 ? singleProduct[0].types : [];
      this.productType =
        this.filteredProduct.length > 0 && this.filteredProduct[0] === 'n/a'
          ? 'n/a'
          : '';
    },
    fuelAmount(val) {
      val = val > this.maxAdvance ? this.maxAdvance : val;
      if (
        val.toString().split('.').length > 2 ||
        (val.toString().split('.').length === 2 &&
          val.toString().split('.')[1].length >= 2)
      ) {
        const formatted = parseFloat(val).toFixed(2);
        this.fuelAmount = formatted;
      }
    },
  },
  mounted() {
    this.getFuelTypes();
    this.getFuelStations();
    this.fetchOrders();
    this.fetchMaxAdvance();
  },
  methods: {
    ...mapActions({
      fuel_stations: 'fuel_stations',
      submit_fuel_advance: 'submit_fuel_advance',
      fuel_history_order: 'fuel_history_order',
      get_fuel_types: 'fuel_types',
      get_fuel_stations: 'fuel_stations',
      get_fuel_advances: 'fuel_advances',
      get_max_advance: 'max_advance',
    }),
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    switchTab(tab) {
      this.tab = tab;
    },
    timeStamp(date) {
      return moment(date).format('YYYY/MM/DD HH:mm a');
    },
    historyCurrency(name) {
      if (name !== 'Galana') {
        return this.currency;
      }
    },
    historyPoints(name) {
      if (name === 'Galana') {
        return 'pts';
      }
    },
    async fetchOrders() {
      const payload = {
        param: `?order_no=${this.order.order_details.order_no}`,
      };
      const response = await this.get_fuel_advances(payload);
      if (response.status) {
        this.history = response.data;
      }
    },
    changeAddresses() {
      const addresses = this.stations.find(
        stn => stn.station_name === this.selectedStation,
      );
      this.addresses = addresses.station_addresses;
      this.selectedAddress = '';
    },
    async submitFuelAdvance() {
      const payload = {
        app: 'ADONIS_API',
        endpoint: 'aux/fuel/fuel-advance',
        params: {
          order_no: this.order.order_details.order_no,
          fuel_station_id: this.selectedAddress,
          account_type_id: 6,
          admin_id: parseInt(this.getSession.payload.data.admin_id, 10),
          fuel_type: this.fuelType,
          amount: parseFloat(this.fuelAmount),
        },
      };
      this.loading = true;
      const data = await this.submit_fuel_advance(payload);
      this.loading = false;
      if (data.status) {
        this.updateClass('success');
        this.updateErrors([data.message]);
        this.fetchOrders();
        this.fetchMaxAdvance();
        setTimeout(() => {
          this.updateErrors([]);
          this.resetVals();
        }, 3000);
      } else {
        this.updateClass('danger');
        this.updateErrors([data.message]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 3000);
      }
    },
    async fetchMaxAdvance() {
      const payload = {
        order_no: this.order.order_details.order_no,
      };
      const data = await this.get_max_advance(payload);
      if (data.status) {
        this.maxAdvance = data.data.available_advance;
      } else {
        this.updateClass('danger');
        this.updateErrors([data.message]);
        this.limit = true;
      }
    },
    resetVals() {
      this.fuelAmount = '';
      this.selectedStation = '';
      this.selectedAddress = '';
      this.fuelType = '';
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
  },
};
</script>

<style>
.active-services-tab {
  border-top: 3px solid #1b7fc3 !important;
}
.inactive-services-tab {
  border: 0px !important;
  cursor: pointer;
}
.auxilliary-inputs {
  display: grid;
  width: auto;
}
.auxilliary-tabs {
  display: flex;
  width: max-content;
}
.advance-tabs {
  width: 150px;
  margin: 0;
  height: 45px;
  text-align: center;
  padding-top: 3%;
  padding: 5%;
  border: 1px solid #bdbdbd;
  border-bottom: 1px solid white;
}
.labeled-inputs {
  display: inline-grid;
  width: 24%;
}
.fuel-input-labels {
  margin-left: 5px !important;
}
.currency-input {
  background: white;
}
.calculations {
  width: 60%;
  display: flex;
  margin-left: auto;
  margin-top: 75px;
  margin-bottom: 10px;
  margin-right: 10px;
  border-radius: 5px;
  background: #f5f7fa;
}
.calculations-tab {
  width: 33%;
  padding: 5%;
}
.calculations-values {
  color: #266299;
  font-weight: 600;
  font-size: 20px;
}
.divider {
  height: auto;
  width: 1px;
  background: #bfd1e3;
}
.history-row {
  width: 100%;
}
.invoice {
  color: #bdbdbd;
  font-size: 12px;
  line-height: 14px;
}
.assign_inputs {
  width: 96%;
}
.history-header {
  color: #1b7fc3;
  font-weight: 600;
  font-size: 18px;
}
.history-head-row,
.history-head-col {
  height: 40px;
}
.history-head-row {
  color: #1b7fc3;
  font-weight: 500;
  font-size: 14px;
}
.inputs-container {
  padding-right: 10%;
}
.auxillary-save-button__active,
.auxillary-save-button__inactive {
  margin-top: 10px !important;
}
.max-advance-title {
  margin: 10px 5px 10px 5px;
  color: #c9531b;
  font-style: italic;
  font-weight: 600;
}
</style>
