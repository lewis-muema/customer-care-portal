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
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Notes (Optional)</p>
              <input
                v-model="Notes"
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Type here"
              />
            </span>
          </span>
          <span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Pump Rate</p>
              <input
                v-model="pumpRate"
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Amount/litre"
              />
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Sendy Rate</p>
              <input
                v-model="sendyRate"
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Amount/litre"
              />
            </span>
            <span class="labeled-inputs">
              <p class="no-margin fuel-input-labels">Total Litres</p>
              <input
                v-model="litres"
                type="text"
                class="freight-assign-rider-buttons assign_inputs"
                placeholder="Litres"
              />
            </span>
          </span>
          <div class="calculations">
            <div class="calculations-tab">
              <p class="no-margin">Pump Total</p>
              <p class="calculations-values">
                {{ currency }} {{ pumpRateAmount }}
              </p>
            </div>
            <div class="divider"></div>
            <div class="calculations-tab">
              <p class="no-margin">Sendy Total</p>
              <p class="calculations-values">
                {{ currency }} {{ sendyTotalAmount }}
              </p>
            </div>
            <div class="divider"></div>
            <div class="calculations-tab">
              <p class="no-margin">Sendy Take</p>
              <p class="calculations-values">
                {{ sendyTakeCurrency }} {{ sendyTakeAmount }}
                {{ points }}
              </p>
            </div>
          </div>
          <button
            :class="
              activeButtonStatus
                ? 'auxillary-save-button__active'
                : 'auxillary-save-button__inactive'
            "
            @click="submitFuelAdvance(true)"
          >
            Save
          </button>
        </div>
        <div v-if="history.length > 0">
          <p class="history-header">History</p>
          <table class="history-row">
            <tr class="history-head-col history-head-row">
              <td>Station</td>
              <td>Litres</td>
              <td>Date/Time</td>
              <td>Pump price</td>
              <td>Sendy Price</td>
              <td>Sendy Take</td>
              <td>Notes</td>
              <td>Invoice Number</td>
            </tr>
            <tr class="history-head-col" v-for="(row, i) in history" :key="i">
              <td>
                {{ row.fuel_station_name }}
              </td>
              <td>{{ row.litres }}</td>
              <td>{{ timeStamp(row.timestamp) }}</td>
              <td>
                {{ order.payment_details.order_currency }} {{ row.pump_price }}
              </td>
              <td>
                {{ order.payment_details.order_currency }} {{ row.sendy_price }}
              </td>
              <td>
                {{ historyCurrency(row.fuel_station_name) }}
                {{ row.sendy_take }} {{ historyPoints(row.fuel_station_name) }}
              </td>
              <td>{{ row.notes }}</td>
              <td class="invoice">Click here to add</td>
            </tr>
          </table>
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
      stations: [],
      selectedStation: 1,
      currency: this.order.payment_details.order_currency,
      litres: '',
      pumpRate: '',
      sendyRate: '',
      pumpRateAmount: 0,
      sendyTotalAmount: 0,
      sendyTakeAmount: 0,
      history: [],
      Notes: '',
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
    activeButtonStatus() {
      if (
        this.litres > 0 &&
        this.pumpRate > 0 &&
        this.sendyRate > 0 &&
        this.selectedStation > 0 &&
        this.sendyTakeAmount > -1
      ) {
        return true;
      }
      return false;
    },
    sendyTakeCurrency() {
      if (this.selectedStation === 3) {
        return '';
      }
      return this.currency;
    },
    points() {
      if (this.selectedStation === 3) {
        return 'pts';
      }
      return '';
    },
  },
  watch: {
    selectedStation(data) {
      if (this.activeButtonStatus) {
        this.submitFuelAdvance(false);
      }
    },
    litres(data) {
      if (this.sendyTakeAmount === '--' || this.sendyTakeAmount < 0) {
        this.resetVals();
      }
      if (this.activeButtonStatus) {
        this.trigger();
      }
    },
    sendyRate(data) {
      if (this.sendyTakeAmount === '--' || this.sendyTakeAmount < 0) {
        this.resetVals();
      }
      if (this.activeButtonStatus) {
        this.trigger();
      }
    },
    pumpRate(data) {
      if (this.sendyTakeAmount === '--' || this.sendyTakeAmount < 0) {
        this.resetVals();
      }
      if (this.activeButtonStatus) {
        this.trigger();
      }
    },
  },
  mounted() {
    this.getFuelStations();
    this.getFuelHistory();
  },
  methods: {
    ...mapActions({
      fuel_stations: 'fuel_stations',
      submit_fuel_advance: 'submit_fuel_advance',
      fuel_history_order: 'fuel_history_order',
    }),
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    // eslint-disable-next-line func-names
    trigger: _.debounce(function() {
      this.submitFuelAdvance(false);
    }, 500),
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
    async getFuelStations() {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/aux/fuel_stations',
        params: {
          _user_email: this.userData.payload.data.email,
          _user_id: this.userData.payload.data.admin_id,
          action_user: this.userData.payload.data.name,
          channel: 'aux',
          data_set: 'cc_actions',
        },
      };
      const data = await this.fuel_stations(payload);
      this.stations = data.fuel_stations;
    },
    async submitFuelAdvance(status) {
      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'v1/aux/fuel_advance',
        params: {
          _user_email: this.userData.payload.data.email,
          _user_id: this.userData.payload.data.admin_id,
          action_user: this.userData.payload.data.name,
          channel: 'aux',
          data_set: 'cc_actions',
          order_no: this.order.order_details.order_no,
          cop_id: 0,
          fuel_station_id: this.selectedStation,
          pump_rate: this.pumpRate,
          sendy_rate: this.sendyRate,
          total_litres: this.litres,
          notes: this.Notes,
          save: status,
        },
      };
      const data = await this.submit_fuel_advance(payload);
      if (status) {
        if (data.status) {
          this.updateClass('success');
          this.updateErrors([`${data.reason}`]);
          this.getFuelHistory();
          this.selectedStation = 1;
          this.litres = '';
          this.pumpRate = '';
          this.sendyRate = '';
          this.pumpRateAmount = 0;
          this.sendyTotalAmount = 0;
          this.sendyTakeAmount = 0;
          this.Notes = '';
        } else {
          this.updateClass('danger');
          this.updateErrors(['Something went wrong. Please try again']);
        }
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      } else {
        if (data.status) {
          this.pumpRateAmount = data.pump_total;
          this.sendyTotalAmount = data.sendy_total;
          this.sendyTakeAmount = data.sendy_take;
        } else {
          this.pumpRateAmount = '--';
          this.sendyTotalAmount = '--';
          this.sendyTakeAmount = '--';
          this.updateClass('danger');
          this.updateErrors([data.reason]);
          setTimeout(() => {
            this.updateErrors([]);
          }, 5000);
        }
      }
    },
    resetVals() {
      this.pumpRateAmount = 0;
      this.sendyTotalAmount = 0;
      this.sendyTakeAmount = 0;
    },
    async getFuelHistory() {
      const payload = {
        order_no: this.order.order_details.order_no,
      };
      const data = await this.fuel_history_order(payload);
      this.history = data;
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
  width: 120px;
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
  width: 33%;
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
  width: auto;
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
</style>
