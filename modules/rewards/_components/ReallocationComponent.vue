<template lang="html">
  <div class="row">
    <div v-if="loading_messages" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <el-button
        type="primary"
        @click="showReallocationReasons"
        class="add_section"
        >Add reallocation reason<i
          :class="add_btn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i
      ></el-button>
      <form
        id="reallocate-form"
        @submit.prevent="add_custom_reallocation_reason"
        class="form-inline add-reward-section"
        v-if="add_btn"
      >
        <div class="form-group col-md-12 user-input">
          <label class="vat"> Country </label>
          <v-select
            :options="country_code"
            :reduce="name => name.code"
            name="name"
            label="name"
            placeholder="Select "
            class="form-control select user-billing"
            :id="`name`"
            v-model="country"
          >
          </v-select>
          <div v-if="submitted && !$v.country.required" class="rewards_valid">
            Country is required
          </div>
        </div>

        <div class="form-group col-md-12 user-input">
          <label class="vat"> Vendor Type </label>
          <v-select
            :options="vendor_type"
            :reduce="name => name.id"
            multiple
            chips
            name="name"
            label="name"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`name`"
            v-model="vendorType"
          >
          </v-select>
          <div
            v-if="submitted && !$v.vendorType.required"
            class="rewards_valid"
          >
            Vendor type has to be selected
          </div>
        </div>

        <div class="form-group col-md-12 user-input">
          <label class="vat"> When to display the reallocation reason </label>
          <v-select
            :options="when_to_display_Reason"
            :reduce="name => name.value"
            label="label"
            placeholder="Select"
            class="form-control select user-billing"
            :id="`value`"
            v-model="whenToDisplayReason"
          >
            <template v-slot:option="option">
              <div class="option-title">{{ option.label }}</div>
              <div class="option-description">{{ option.description }}</div>
            </template>
          </v-select>
          <div
            v-if="submitted && !$v.whenToDisplayReason.required"
            class="rewards_valid"
          >
            When to display reallocation reason is required
          </div>
        </div>

        <div class="form-group col-md-12 user-input ">
          <label class="vat">Reallocation reason</label>
          <el-input
            v-model="reallocation_reason"
            :id="`message`"
            class="message-input"
          >
          </el-input>
          <div
            v-if="submitted && !$v.reallocation_reason.required"
            class="rewards_valid"
          >
            Reallocation reason is required
          </div>
        </div>

        <div class="form-group  col-md-12 config-submit">
          <button
            class="btn btn-primary action-button"
            :disabled="checkSubmitStatus()"
          >
            Submit
          </button>
        </div>
      </form>

      <div v-if="submit_status" class="response-section">
        <p class="response-text" v-if="response_status === true">
          <i class="fa fa-spinner fa-spin loader invoice-loader--align"></i>
          Processing your request ....
        </p>
        <p class="response-text" v-else-if="response_status === 'success'">
          <i
            class="fa fa-check-circle invoice-loader--align submit-success"
          ></i>
          Reallocation reason created !
        </p>
        <p class="response-text" v-else>
          <i
            class="fa fa-exclamation-circle invoice-loader--align submit-error"
          ></i>
          {{ error_msg }}
        </p>
      </div>

      <div class="body-box col-md-12 table-content">
        <div class="table-content-info">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
          <span class="table-content-info-text">
            Partner reallocation reasons
          </span>
        </div>
        <el-table
          :data="set_reallocation_reasons"
          size="medium"
          :border="false"
        >
          <el-table-column label="Country" prop="country">
            <template slot-scope="scope">
              {{
                fetchCountry(set_reallocation_reasons[scope.$index]['country'])
              }}
            </template>
          </el-table-column>
          <el-table-column label="Vendor" prop="vendor_type">
            <template slot-scope="scope">
              {{
                vendor(set_reallocation_reasons[scope.$index]['vendor_type'])
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="Reallocation reason"
            width="180"
            prop="Reason_description"
          >
          </el-table-column>
          <el-table-column
            label="When to display"
            width="180"
            prop="order_status"
          >
            <template slot-scope="scope">
              {{
                formatOrderStatus(
                  set_reallocation_reasons[scope.$index]['order_status'],
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Date added" prop="date_added">
            <template slot-scope="scope">
              {{
                getFormattedDate(
                  set_reallocation_reasons[scope.$index]['date_added'],
                  'DD/MM/YYYY ',
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="status">
            <template slot-scope="scope">
              {{
                activeStatus(set_reallocation_reasons[scope.$index]['status'])
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="Actions"
            prop="status"
            class="data"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                :class="
                  set_reallocation_reasons[scope.$index]['status'] === 1
                    ? 'action-button--danger'
                    : 'action-button--active'
                "
                @click="setStatusState(set_reallocation_reasons[scope.$index])"
              >
                Deactivate
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';
import Loading from './LoadingComponent.vue';

export default {
  name: 'PenaltiesComponent',
  components: { Loading },
  data() {
    return {
      submitted: false,
      loading_messages: true,
      submit_status: false,
      response_status: true,
      sendyEntities: [],
      set_reallocation_reasons: [],
      error_msg: '',
      add_btn: false,
      reallocation_reason: '',
      country_code: [
        { code: 'KE', name: 'Kenya' },
        { code: 'UG', name: 'Uganda' },
      ],
      vendor_type: [],
      vendorType: [],
      country: '',
      when_to_display_Reason: [
        {
          label: 'Order has been confirmed',
          value: 'CONFIRMED',
          description:
            '(Order has been confirmed but the partner is yet to get to the pick up location) ',
        },
        {
          label: 'Partner has arrived at the pick up',
          value: 'ARRIVED_AT_PICK_UP',
          description:
            '(Partner has arrived at pick up location but is yet to pick up the order.)',
        },
      ],
      whenToDisplayReason: '',
      submit_state: false,
    };
  },
  validations: {
    reallocation_reason: { required },
    vendorType: { required },
    country: { required },
    whenToDisplayReason: { required },
  },
  computed: {
    ...mapGetters(['getSession']),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  mounted() {
    this.initiateData();
  },

  methods: {
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      fetch_set_reallocation_reason: 'fetch_set_reallocation_reason',
      update_status_state: 'update_status_state',
      add_reallocation_reason: 'add_reallocation_reason',
    }),
    initiateData() {
      this.clearData();
      this.fetchVendorTypes();
      this.fetchSetReallocationReasons();
    },
    clearData() {
      this.submit_status = false;
      this.add_btn = false;
      this.country = '';
      this.vendor_type = [];
      this.vendorType = [];
      this.reallocation_reason = '';
      this.whenToDisplayReason = '';
    },
    showReallocationReasons() {
      let status = false;
      if (!this.add_btn) {
        status = true;
      }
      this.add_btn = status;
    },
    async fetchVendorTypes() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'VENDORS',
        endpoint: 'types',
        apiKey: false,
        params: {
          pickup_country_code: 'KE',
          dropoff_country_code: 'KE',
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        this.vendor_type = data.vendor_types;
        this.loading_messages = false;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchSetReallocationReasons() {
      const notification = [];
      let actionClass = '';
      try {
        const results = await this.fetch_set_reallocation_reason();
        console.log('>>>>', results.data);
        this.set_reallocation_reasons = results.data;
        this.loading_messages = false;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    checkSubmitStatus() {
      return this.submit_state;
    },
    vendor(id) {
      if (!id) return '';
      let name = '';
      if (Object.keys(this.vendor_type).length > 0) {
        const data = this.vendor_type.find(location => location.id === id);
        name = data.name;
      }
      return name;
    },
    activeStatus(status) {
      return status === 1 ? 'Active' : 'Deactivated';
    },
    formatOrderStatus(orderStatus) {
      if (!orderStatus) return '';
      return orderStatus === 'CONFIRMED'
        ? 'Order has been confirmed'
        : 'Partner has arrived at the pick up';
    },
    fetchCountry(id) {
      if (!id) return '';
      const data = this.country_code.find(location => location.code === id);
      return data.name;
    },
    async setStatusState(row) {
      const data = {
        id: row.id,
        status: row.status,
      };

      const payload = {
        app: 'ADONIS_API',
        endpoint: `vendor-type-reallocation-reasons/${row.id}`,
        apiKey: false,
        params: data,
      };

      try {
        const resp = await this.update_status_state(payload);

        if (resp.status === 200) {
          this.loading_messages = true;
          this.initiateData();
        }
      } catch (error) {
        this.loading_messages = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async add_custom_reallocation_reason() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.submit_status = true;
      this.response_status = true;
      this.submit_state = true;

      if (this.country === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'A country selection is required!';
      } else if (!this.vendorType.length) {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'Vendor type has to be selected!';
      } else if (this.reallocation_reason === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = 'A relocation reason is needed ';
      } else if (this.whenToDisplayReason === '') {
        this.submit_state = false;
        this.response_status = 'error';
        this.error_msg = ' When to display reallocation reason is required';
      }

      const data = {
        country: this.country,
        vendor_type: this.vendorType,
        reason: this.reallocation_reason,
        order_status: this.whenToDisplayReason,
      };
      console.log('PPP', data);
      const payload = {
        app: 'ADONIS_API',
        endpoint: `reallocation-reasons`,
        apiKey: false,
        params: data,
      };

      try {
        const result = await this.add_reallocation_reason(payload);

        if (result.status === 200) {
          setTimeout(() => {
            this.submit_state = false;
            this.loading_messages = true;
            this.initiateData();
          }, 5000);
        } else {
          this.loading_messages = true;
          this.initiateData();
        }
      } catch (error) {
        this.loading_messages = true;
        this.initiateData();
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
  },
};
</script>

<style lang="css" scoped>
.option-title {
  font-weight: 600;
}
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline {
  width: 50% !important ;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.user-input {
  margin-bottom: 15px;
}
.form-inline {
  margin-left: 2%;
}
.centre-loader {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.outline-inner-data {
  width: 100%;
}
.response-section {
  width: 95.5%;
  height: 55px;
  background: rgba(255, 255, 255, 0.91);
  border: 2px solid #00ae55;
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 2%;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 28px;
}
.invoice-loader--align {
  margin-left: 2%;
  margin-right: 1%;
}
.submit-success {
  color: #00ae55;
}
.submit-error {
  color: #ff0000;
}
.response-text {
  margin-top: 1%;
}
.invoice-number-highlight {
  color: #00ae55;
}
.table-content {
  max-width: 98%;
  margin-left: 1%;
  margin-top: 2%;
}
.table-content-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.table-content-info i{
 font-size: 25px;
 color: #969393;
  margin-right: 20px;
}
.table-content-info span{
  font-size: 20px;
  font-weight: 500;
}
.table-background {
  background: #fff;
}
.add_section {
  background: #ffffff;
  border: 1px solid #000000;
  color: #1f1d1d;
  margin-left: 2%;
  width: auto;
  margin-bottom: 1%;
}
.add_section:focus,
.add_section:hover {
  background: #ffffff !important;
  border: 1px solid #000000 !important;
  color: #1f1d1d;
  cursor: pointer;
}
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.vat {
  width: 100%;
  margin-left: -15px;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
  height: 2%;
}
.v-select
.vs__dropdown-menu
.option-description {
  margin-top: 5px;
  width: 100%;
  color: #868080;
  font-size: 11px;
  white-space: initial;
}
.v-select
.vs__dropdown-menu
.vs__dropdown-option--highlight
.option-description {
  color: #FFFFFF;
}
.user-input {
  margin-bottom: 34px;
  width: 30%;
}
.form-inline {
  margin-left: 2%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.vat-inline {
  max-width: 72% !important;
}
.config-input {
  margin-left: -15px;
}
.config-div {
  padding-left: 0;
}
.config {
  width: 100%;
  margin-left: -15px;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
.date-input {
  margin-left: -15px;
  width: 100% !important;
}
.rewards_valid {
  font-size: 14px !important;
  color: #dc3545;
  margin-left: -4% !important;
}
.input-with-select {
  margin-left: -6%;
}
.add-reward-section {
  width: 80% !important;
  min-height: 340px;
}
.user-textarea {
  margin-right: 9%;
}
.message-input {
  margin-left: -5%;
}
.action-button--danger {
  background-color: #ff4949;
  border-color: #ff4949;
  color: #fff;
}
.action-button--active {
  background-color: #13ce66;
  border-color: #13ce66;
  color: #fff;
}
.action-button--archive {
  background-color: #3c8dbc;
  border-color: #3c8dbc;
  color: #fff;
}
</style>
