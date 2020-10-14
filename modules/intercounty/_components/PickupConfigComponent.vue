<template lang="html">
  <div class="">
    <div v-if="loading_data" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <div v-if="!add_destination">
        <div class="flex-container">
          <div class="header--search">
            <input
              type="text"
              class="config-search"
              placeholder="Search for collection centre address .."
              autocomplete="off"
              v-model="search_data"
            />
            <i class="fa fa-search config-search-icon"></i>
          </div>
          <div class="header--add">
            <el-button
              type="primary"
              class="add_section"
              @click="goToAddPickUpConfig"
              >Add Pickup collection centre</el-button
            >
          </div>
        </div>

        <div
          v-if="delete_status"
          class=" col-md-12 intercounty-response response-flex-box"
        >
          <div class="response-highlight">
            <p
              class="delete-response-text"
              v-if="delete_response_status === true"
            >
              <i
                class="fa fa-spinner fa-spin loader intercounty-loader--align"
              ></i>
              Processing your request ....
            </p>
            <p
              class="delete-response-text"
              v-else-if="delete_response_status === 'success'"
            >
              <i
                class="fa fa-check-circle intercounty-loader--align intercounty-submit-success"
              ></i>
              Record removed successfully !
            </p>
            <p class="delete-response-text" v-else>
              <i
                class="fa fa-exclamation-circle intercounty-loader--align intercounty-submit-error"
              ></i>
              {{ error_msg }}
            </p>
          </div>
          <div class="close-response-highlight">
            <i class="el-icon-circle-close" @click="closeHighlight()"></i>
          </div>
        </div>

        <div class="body-box col-md-12 intercounty-table">
          <el-table :data="filtered_pickup_data" size="medium" :border="false">
            <el-table-column label="Name" prop="city_id">
              <template slot-scope="scope">
                {{ getCityName(filtered_pickup_data[scope.$index]['city_id']) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Collection centre address"
              prop="collection_centers"
            >
              <template slot-scope="scope">
                {{
                  displayCollectionCentre(
                    filtered_pickup_data[scope.$index]['collection_centers'],
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="Supported Vendors"
              prop="supported_vendor_types"
            >
              <template slot-scope="scope">
                {{ allowedVendors(filtered_pickup_data[scope.$index]) }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" prop="action">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  class="config-button--active"
                  @click="editPickUp(filtered_pickup_data[scope.$index])"
                >
                  Edit
                </el-button>
                <el-button
                  size="mini"
                  class="config-button--archive"
                  @click="removePickUp(filtered_pickup_data[scope.$index])"
                >
                  Delete
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else>
        <div class="">
          <i class="el-icon-back edit-back" @click="one_step_back" />
        </div>
        <div class="add-destination-container">
          <p class="inter-county-headers">
            Add pick up location
          </p>

          <div class="vendor-options">
            <p class="pricing-input-labels">
              Select city of the pick up location
            </p>
            <el-select
              size="medium"
              class="vendors-select"
              filterable
              placeholder="Select"
              v-model="city_id"
            >
              <el-option
                v-for="city in city_list"
                :key="city.city_id"
                :label="city.city_name"
                :value="city.city_id"
              >
              </el-option>
            </el-select>
          </div>

          <div class="vendor-options">
            <p class="pricing-input-labels">
              Physical address of the collection centre
            </p>
            <el-input
              v-model="collection_centre_address"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="E.g Sendy caravan at Westlands Total petrol station along Ojijo road"
            >
            </el-input>
          </div>

          <div class="vendor-options">
            <p class="pricing-input-labels">
              Exact location of the collection centre
            </p>
            <div class="">
              <template>
                <el-popover
                  placement="bottom"
                  width="Min width 150px"
                  v-model="visible"
                >
                  <div>
                    <div
                      class="single-suggestion"
                      v-for="suggestion in suggestions"
                      :key="suggestion.id"
                      @click="
                        handleSelect(
                          suggestion.description,
                          0,
                          suggestion.place_id,
                        )
                      "
                    >
                      {{ suggestion.description }}
                    </div>
                  </div>
                  <el-input
                    slot="reference"
                    size="large"
                    class=""
                    placeholder="Enter name of the location"
                    v-model="locations[0]"
                    @input="handleFocus($event, 0)"
                  ></el-input>
                </el-popover>
              </template>
            </div>
            <div class="inter-county-map">
              <GmapMap
                ref="map"
                :center="mapCentreLocation"
                :zoom="10"
                map-type-id="roadmap"
                class="map-content"
                :options="mapOptions"
              >
                <div v-if="markers.length > 0">
                  <gmap-marker
                    :position="get_position(0)"
                    :icon="path_icon()"
                  />
                </div>
              </GmapMap>
            </div>
          </div>

          <div class="vendor-options">
            <p class="pricing-input-labels">
              Supported vendor types at the pick up location
            </p>
            <el-select
              size="medium"
              class="vendors-select"
              filterable
              multiple
              placeholder="Select"
              v-model="supported_vendor_types"
            >
              <el-option
                v-for="vendor in vendor_list"
                :key="vendor.id"
                :label="vendor.name"
                :value="vendor.id"
              >
              </el-option>
            </el-select>
          </div>
          <div v-if="submit_status" class="intercounty-response">
            <p
              class="intercounty-response-text"
              v-if="response_status === true"
            >
              <i
                class="fa fa-spinner fa-spin loader intercounty-loader--align"
              ></i>
              Processing your request ....
            </p>
            <p
              class="intercounty-response-text"
              v-else-if="response_status === 'success'"
            >
              <i
                class="fa fa-check-circle intercounty-loader--align intercounty-submit-success"
              ></i>
              Data submitted successfully !
            </p>
            <p class="intercounty-response-text" v-else>
              <i
                class="fa fa-exclamation-circle intercounty-loader--align intercounty-submit-error"
              ></i>
              {{ error_msg }}
            </p>
          </div>

          <div class="submit-intercounty-config">
            <button
              class="new-pricing-input-buttons new-pricing-submit-button"
              @click="createPickUpConfig"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';
import axios from 'axios';
import Loading from './LoadingComponent.vue';

export default {
  name: 'PickupConfigComponent',
  components: { Loading },
  data() {
    return {
      loading_data: false,
      pickup_config_data: [],
      filtered_pickup_data: [],
      add_destination: false,
      visible: false,
      suggestions: [],
      pickUp: '',
      distance: '',
      mapCentreLocation: {
        lat: -1.3084143,
        lng: 36.7658132,
      },
      mapOptions: {
        disableDefaultUI: true,
      },
      markers: [],
      mapLoaded: false,
      vendor_list: [],
      delivery_range: 5,
      selected_vendor: [],
      locations: [],
      extra_collection: 0,
      city_id: '',
      collection_centre_address: '',
      city_list: [],
      supported_vendor_types: [],
      collection_centers: [],
      submit_status: false,
      response_status: true,
      error_msg: '',
      search_data: '',
      edit_route: false,
      route_key: '',
      delete_status: false,
      delete_response_status: true,
    };
  },
  computed: {
    ...mapState(['userData']),

    herokuKey() {
      return this.$env.HEROKU_GOOGLE_API_KEY;
    },
    allow_add_collection() {
      return this.markers.length > 1;
    },
    filteredData() {
      const self = this;
      if (this.pickup_config_data === null) {
        return this.pickup_config_data;
      } else {
        return this.pickup_config_data.filter(
          pr =>
            pr.collection_centers[0].address
              .toLowerCase()
              .indexOf(self.search_data.toLowerCase()) >= 0,
        );
      }
    },
  },
  watch: {
    filteredData(val) {
      this.filtered_pickup_data = val;
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
    });
    this.initiateData();
  },
  methods: {
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      request_pickup_configs: 'request_intercounty_pickup_configs',
      request_pickup_cities: 'request_pickup_cities',
      create_pickup_config: 'create_pickup_config',
      remove_intercounty_record: 'remove_intercounty_record',
      update_intercounty_record: 'update_intercounty_record',
    }),
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    initiateData() {
      this.requestPickUpCities();
      this.fetchVendorTypes();
    },
    async requestPickUpCities() {
      const arr = await this.request_pickup_cities();
      this.city_list = arr.cities;
      this.requestPickupData();
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
        this.vendor_list = data.vendor_types;
        return data.vendor_types;
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async requestPickupData() {
      const arr = await this.request_pickup_configs();
      this.pickup_config_data = arr.pickups;
      this.filtered_pickup_data = arr.pickups;
    },
    async removePickUp(data) {
      this.delete_status = true;
      this.delete_response_status = true;

      const userInfo = this.userData.payload.data;

      const payload = {
        id: data.object_id,
        route: 'pickups',
        params: {
          _user_email: userInfo.email,
          _user_id: userInfo.admin_id,
          action_user: userInfo.name,
        },
      };
      const resp = await this.remove_intercounty_record(payload);

      if (resp.status) {
        this.delete_response_status = 'success';
        setTimeout(() => {
          this.initiateData();
        }, 2000);
      } else {
        this.delete_response_status = false;
        this.error_msg = JSON.stringify(resp.errors[0]);
      }
    },
    goToAddPickUpConfig() {
      this.add_destination = true;
    },
    one_step_back() {
      this.add_destination = false;
      this.clearStoreData();
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=name,geometry&components=country:ke|country:ug|country:tz&key=${this.herokuKey}`,
        )
        .then(response => {
          this.suggestions = response.data.predictions;
          this.visible = true;
        });
    }, 500),
    handleSelect(item, input, placeId) {
      this.visible = false;
      this.searched = true;
      this.suggestions = [];
      const fromPlaceId = placeId;
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${fromPlaceId}&key=${this.herokuKey}`,
        )
        .then(response => {
          this.markers.splice(input, 1);
          this.collection_centers.splice(input, 1);
          this.locations[input] = response.data.result.name;
          const collection_marker = response.data.result.geometry;
          const data = {
            address: this.locations[input],
            lat: collection_marker.location.lat,
            long: collection_marker.location.lng,
          };
          if (this.pickup_config_data !== null) {
            const resp = this.pickup_config_data[input].collection_centers.find(
              position => position.address === this.locations[input],
            );
            if (resp !== undefined) {
              data.object_id = resp.object_id;
            }
          }
          this.collection_centers.splice(input, 0, data);
          this.markers.splice(input, 0, response.data.result.geometry);
          const bounds = new google.maps.LatLngBounds();
          for (const m of this.markers) {
            bounds.extend(m.location);
          }
          this.$refs.map.$mapObject.fitBounds(bounds);
          this.$refs.map.$mapObject.setZoom(this.$refs.map.$mapObject.zoom - 1);
        });
    },
    handleFocus(val, input) {
      this.searched = false;
      if (val) {
        this.search(val);
      }
    },
    get_position(index) {
      const literal = this.markers[index].location;
      return new google.maps.LatLng(literal);
    },
    get_collection_position(index) {
      const literal = this.markers[index].location;
      return new google.maps.LatLng(literal);
    },
    path_icon() {
      return {
        url:
          'https://images.sendyit.com/web_platform/orders/destination_placeholder.png',
        scaledSize: new google.maps.Size(23, 40),
      };
    },
    addExtraCollectionWrapper() {
      this.extra_collection++;
    },
    removeExtraCollectionWrapper(index) {
      this.extra_collection--;
      this.markers.splice(index, 1);
    },
    displayCollectionCentre(val) {
      let resp = 'N/A';
      if (Object.keys(val).length > 0) {
        const response = [];
        for (let i = 0; i < val.length; i++) {
          response.push(val[i].address);
          resp = response.toString();
        }
      }

      return resp;
    },
    getCityName(val) {
      let resp = '';
      if (this.city_list.length > 0) {
        const data = this.city_list.find(location => location.city_id === val);
        resp = data.city_name;
      }

      return resp;
    },
    editPickUp(val) {
      this.city_id = val.city_id;
      this.supported_vendor_types = val.supported_vendor_types;
      this.locations[0] = val.collection_centers[0].address;
      const collection_cordinates = val.collection_centers[0].coordinates;
      collection_cordinates.location = {
        lat: val.collection_centers[0].coordinates.coordinates[1],
        lng: val.collection_centers[0].coordinates.coordinates[0],
      };
      const data = {
        address: val.collection_centers[0].address,
        lat: val.collection_centers[0].coordinates.coordinates[1],
        long: val.collection_centers[0].coordinates.coordinates[0],
        object_id: val.collection_centers[0].object_id,
      };
      this.collection_centers.splice(0, 0, data);

      this.markers.splice(0, 0, collection_cordinates);

      this.route_key = val.object_id;
      this.edit_route = true;
      this.add_destination = true;
    },
    clearStoreData() {
      this.edit_route = false;
      this.route_key = '';
      this.add_destination = false;
      this.city_id = '';
      this.supported_vendor_types = [];
      this.collection_centers = [];
      this.locations = [];
      this.markers = [];
      this.collection_centre_address = [];
    },
    createPickUpConfig() {
      if (
        this.city_id === '' ||
        this.collection_centre_address === '' ||
        this.collection_centers.length === 0
      ) {
        this.submit_status = true;
        this.response_status = 'fail';
        this.error_msg = 'Kindly provide all values .';
      } else {
        this.submit_status = true;
        this.response_status = true;

        if (this.edit_route && this.route_key !== '') {
          this.updatePickUpConfig();
        } else {
          this.addNewPickUpConfig();
        }
      }
    },
    async addNewPickUpConfig() {
      const userInfo = this.userData.payload.data;

      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'inter_county_config/pickups',
        apiKey: false,
        params: {
          city_id: parseInt(this.city_id, 10),
          supported_vendor_types: this.supported_vendor_types,
          collection_centers: this.collection_centers,
          _user_email: userInfo.email,
          _user_id: userInfo.admin_id,
          action_user: userInfo.name,
        },
      };

      try {
        const data = await this.create_pickup_config(payload);

        if (data.status) {
          this.response_status = 'success';
          setTimeout(() => {
            this.submit_state = false;
            this.add_destination = false;
            this.initiateData();
          }, 2000);
        } else {
          this.response_status = 'error';
          if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
            this.error_msg = data.errors;
          } else {
            this.error_msg = data.message;
          }
        }
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async updatePickUpConfig() {
      const userInfo = this.userData.payload.data;

      const payload = {
        id: this.route_key,
        route: 'pickups',
        params: {
          city_id: parseInt(this.city_id, 10),
          supported_vendor_types: this.supported_vendor_types,
          collection_centers: this.collection_centers,
          status: 1,
          _user_email: userInfo.email,
          _user_id: userInfo.admin_id,
          action_user: userInfo.name,
        },
      };

      try {
        const data = await this.update_intercounty_record(payload);

        if (data.status) {
          this.response_status = 'success';
          setTimeout(() => {
            this.submit_state = false;
            this.add_destination = false;
            this.initiateData();
            this.clearStoreData();
          }, 2000);
        } else {
          this.response_status = 'error';
          this.error_msg = data.message;
        }
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    closeHighlight() {
      this.error_msg = '';
      this.delete_response_status = true;
      this.delete_status = false;
    },
    allowedVendors(value) {
      let resp = 'None available';
      if (Object.keys(this.vendor_list).length > 0) {
        const response = [];
        if (
          Object.prototype.hasOwnProperty.call(value, 'supported_vendor_types')
        ) {
          const arr = value.supported_vendor_types;
          for (let i = 0; i < arr.length; i++) {
            const extract = this.vendor_list.find(
              location => location.id === arr[i],
            );
            response.push(extract.name);
            resp = response.toString();
          }
        }
      }
      return resp;
    },
  },
};
</script>

<style lang="css">
@import "./../../../assets/style/intercounty-config.css";
</style>
