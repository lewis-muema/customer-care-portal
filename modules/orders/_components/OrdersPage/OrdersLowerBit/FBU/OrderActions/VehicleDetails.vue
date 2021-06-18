<template>
  <div class="assign-details-tab">
    <p class="assign-header no-margin">Truck Details</p>
    <input
      v-if="editStatus"
      type="text"
      class="freight-assign-rider-buttons"
      autocomplete="off"
      :id="`${currentUser}_input`"
      v-model="query"
      placeholder="Truck number"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
    />
    <input
      v-else
      v-model="regNo"
      type="text"
      maxlength="15"
      class="freight-assign-rider-buttons"
      @click="triggerSearch()"
    />
    <p v-if="errorStatus" class="search-failed-owner">
      {{ error }}
    </p>
    <p class="add-owner-success">
      {{ success }}
    </p>
    <div v-show="hasItems" class="driver-suggestions">
      <p
        v-for="(item, $item) in items"
        class="single-suggestion"
        :class="activeClass($item)"
        @mousedown="hit"
        @mouseover="setActive($item)"
        @mouseout="setActive($item)"
        :key="item.id"
      >
        <span class="tt-suggestion">
          <p>
            <strong>Owner Name: {{ item.owner }}</strong>
          </p>
          <p>
            <strong>License plate No: {{ item.registration_no }}</strong>
          </p>
          <p>
            <strong>Make: {{ item.make }}</strong>
          </p>
          <p>
            <strong>Model: {{ item.model }}</strong>
          </p>
        </span>
      </p>
    </div>
    <i class="fa fa-spinner fa-spin" v-if="loading"></i>
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Insurance number"
      maxlength="15"
      v-model="insurance"
      @input="passNewVehicle()"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
    />
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Trailer number"
      maxlength="15"
      v-model="trailer"
      @input="passNewVehicle()"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
    />
    <input
      type="text"
      class="freight-assign-rider-buttons"
      placeholder="Kwartos code"
      maxlength="15"
      v-model="kwartos"
      @input="passNewVehicle()"
      :class="existingStatus ? 'inactive-assign-input' : ''"
      :readonly="existingStatus"
    />
    <span v-if="!hasItems && editStatus && query"
      ><span
        @click="addVehicle()"
        :class="saveLoading ? 'save-truck-text-inactive' : 'save-truck-button'"
      >
        Save truck details
      </span>
      <i class="fa fa-spinner fa-spin save-spinner" v-if="saveLoading"></i
    ></span>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';

export default {
  name: 'AssignRider',
  extends: VueTypeahead,
  props: {
    id: {
      type: Number,
      required: true,
    },
    ownername: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      vehicleDetails: '',
      currentUser: 'vehicle',
      limit: 10,
      minChars: 1,
      query: '',
      vehicle: 0,
      name: '',
      vehicleDisplay: '',
      hide: '',
      hideInput: 'hide',
      solr: {
        vehicles: 'VEHICLE_SEARCH',
      },
      editStatus: true,
      existingStatus: false,
      regNo: '',
      error: '',
      success: '',
      trailer: '',
      kwartos: '',
      insurance: '',
      saveLoading: false,
    };
  },
  computed: {
    ...mapState(['config']),
    placeholder() {
      return this.category;
    },

    query_string() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/\s/g, '');
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = 'vehicles';
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    solarToken() {
      return this.$env.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(registration_no:*${this.query_string}${this.query_mod}+AND+(vendor_type:25+OR+vendor_type:20))&wt=json&indent=true&row=10&sort=id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
    query_mod() {
      if (this.id > 0) {
        return `*+AND+owner_id:${this.id}`;
      }
      return '*';
    },
    errorStatus() {
      if (this.id > 0) {
        this.setError('');
      }
      if (this.id === 0 && this.query && !this.hasItems) {
        this.setError('(Please select an owner first then save the vehicle.)');
      }
      return true;
    },
  },
  watch: {
    id() {
      if (this.id === 0 && this.existingStatus) {
        this.triggerSearch();
      }
    },
    query() {
      if (this.query) {
        this.query = this.query.toUpperCase();
      }
    },
    insurance() {
      if (this.insurance) {
        this.insurance = this.insurance.toUpperCase().replace(/\s/g, '');
      }
    },
    trailer() {
      if (this.trailer) {
        this.trailer = this.trailer.toUpperCase().replace(/\s/g, '');
      }
    },
    kwartos() {
      if (this.kwartos) {
        this.kwartos = this.kwartos.toUpperCase().replace(/\s/g, '');
      }
    },
  },
  methods: {
    setError(error) {
      this.error = error;
    },
    setSuccess(success, timeout) {
      this.success = success;
      if (timeout > 0) {
        setTimeout(() => {
          this.success = '';
        }, timeout);
      }
    },
    trigger() {
      this.vehicle = null;
      this.hideInput = 'hide';
      this.hide = '';
    },
    prepareResponseData(data) {
      const results = data.response.docs;
      this.setError('');
      return results;
    },
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      this.requestsingleVehicle(item.id);
      this.reset();
      return (this.vehicle = item.id);
    },
    triggerSearch() {
      this.editStatus = true;
      this.existingStatus = false;
      this.$emit('vehiclesDetails', '');
      this.regNo = '';
      this.insurance = '';
    },
    passNewVehicle() {
      const payload = {
        registration_no: this.query,
        vendor_type: 25,
        owner_id: this.id,
        model: '',
        make: '',
        insurance_no: this.insurance,
        log_book_no: '',
        trailer: this.trailer,
        kwartos: this.kwartos,
      };
      if (this.existingStatus) {
        this.vehicleDetails.trailer = this.trailer;
        this.vehicleDetails.kwartos = this.kwartos;
        this.$emit('vehiclesDetails', this.vehicleDetails);
      } else {
        this.$emit('vehiclesDetails', payload);
      }
    },
    addVehicle() {
      if (this.id > 0) {
        const payload = {
          app: 'rider/admin_partner_api/v5/partner_portal/add_vehicle',
          payload: {
            vendor: 'Freight',
            vendor_type: 25,
            make: '',
            vendor: 'Freight',
            model: '',
            manufacture_year: '',
            box: 0,
            refrigerated: 0,
            log_book_no: '',
            insurance_no: this.insurance,
            registration_no: this.query,
            kwartos_code: this.kwartos,
            trailer_no: this.trailer,
            log_book:
              'https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/default_pic.jpg',
            vehicle:
              'https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/photo/default_pic.jpg',
            owner_id: this.id,
          },
        };
        this.saveLoading = true;
        this.add_owner_vehicle(payload).then(response => {
          this.saveLoading = false;
          if (!response.status) {
            this.error = `${response.msg}`;
          } else {
            this.setSuccess('(Awesome! Truck details have been saved!)', 5000);
            this.requestsingleVehicle(response.vehicle_id);
          }
        });
      } else {
        this.setError('(Please select an owner first then save the vehicle.)');
      }
    },
    ...mapActions({
      request_single_vehicle: 'request_single_vehicle',
      add_owner_vehicle: 'add_owner_vehicle',
    }),
    ...mapMutations({
      updateErrors: 'setErrors',
    }),
    async requestsingleVehicle(user) {
      this.loading = false;
      this.vehicleDetails = null;
      const payload = { vehicleID: user };
      try {
        const data = await this.request_single_vehicle(payload);
        this.loading = false;
        this.editStatus = false;
        this.existingStatus = true;
        this.regNo = data.registration_no;
        this.insurance = data.insurance_no;
        // eslint-disable-next-line no-multi-assign
        this.kwartos = Object.prototype.hasOwnProperty.call(
          data,
          'kwartos_code',
        )
          ? data.kwartos_code
          : '';
        this.trailer = Object.prototype.hasOwnProperty.call(data, 'trailer_no')
          ? data.trailer_no
          : '';
        data.kwartos = this.kwartos;
        data.trailer = this.trailer;
        this.$emit('vehiclesDetails', data);
        return (this.vehicleDetails = data);
      } catch {
        this.updateErrors([
          'Something went wrong. Try again or contact Tech Support',
        ]);
        setTimeout(() => {
          this.updateErrors([]);
        }, 5000);
      }
    },
  },
};
</script>

<style>
.driver-suggestions {
  position: absolute;
  width: 400px;
  background: white;
  z-index: 100;
  color: black;
}
.driver-suggestions .active {
  background-color: #0097cf;
  color: #fff;
}
.single-suggestion {
  padding-left: 20px;
}
.save-spinner {
  margin: 5px;
  font-size: 17px;
  color: #1a7fc3;
  font-weight: 600;
}
.save-truck-text-inactive {
  color: gray;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
