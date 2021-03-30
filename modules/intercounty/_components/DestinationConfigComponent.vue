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
              @click="goToAddDestination"
              >Add destination location</el-button
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
          <el-table
            :data="filtered_destination_data"
            size="medium"
            :border="false"
          >
            <el-table-column label="Name" prop="name">
              <template slot-scope="scope">
                {{ filtered_destination_data[scope.$index]['name'] }}
              </template>
            </el-table-column>
            <el-table-column
              label="Collection centre address"
              prop="collection_centers"
            >
              <template slot-scope="scope">
                {{
                  displayCollectionCentre(
                    filtered_destination_data[scope.$index][
                      'collection_centers'
                    ],
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="Supported Vendors"
              prop="supported_vendor_types"
            >
              <template slot-scope="scope">
                {{ allowedVendors(filtered_destination_data[scope.$index]) }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" prop="action">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  class="config-button--active"
                  @click="
                    editDestination(filtered_destination_data[scope.$index])
                  "
                >
                  Edit
                </el-button>
                <el-button
                  size="mini"
                  class="config-button--archive"
                  @click="
                    removeDestination(filtered_destination_data[scope.$index])
                  "
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
            Add destination location
          </p>
          <div class="new-pricing-tab-rows">
            <div class="pickup-location">
              <p class="pricing-input-labels">Pick up location</p>
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
                    class="intercounty-pricing-inputs"
                    placeholder="Search pick up"
                    v-model="locations[0]"
                    @input="handleFocus($event, 0)"
                  ></el-input>
                </el-popover>
              </template>
            </div>
            <div>
              <p class="pricing-input-labels">Distance</p>
              <el-input
                type="text"
                v-model="radius"
                class="intercounty-pricing-inputs extra-dist"
                ><template class="pricing-prepend" slot="append">
                  KMS
                </template>
              </el-input>
            </div>
          </div>
          <div class="inter-county-map">
            <GmapMap
              ref="map0"
              :center="mapCentreLocation"
              :zoom="10"
              map-type-id="roadmap"
              class="map-content"
              :options="mapOptions"
            >
              <div v-if="markers.length > 0">
                <gmap-marker :position="get_position(0)" :icon="path_icon()" />
              </div>
            </GmapMap>
          </div>
          <div class="vendor-options">
            <p class="pricing-input-labels">
              Select Sendy supported vendor types at the destination
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
          <div class="vendor-options delivery-range-margin">
            <p class="pricing-input-labels">
              Home delivery range from the collection centre in (Kilometres) by
              the 3pl partner
            </p>
            <el-input-number v-model="max_delivery_range" :min="0" :max="10" />
          </div>

          <p class="inter-county-headers">
            Collection centre
          </p>
          <div class="vendor-options">
            <p class="pricing-input-labels">
              Physical address of the collection centre
            </p>
            <el-input
              v-model="collection_centre_address[0]"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="E.g Nation courier, Umoja building 3rd floor, Nyeri"
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
                          1,
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
                    v-model="locations[1]"
                    @input="handleFocus($event, 1)"
                  ></el-input>
                </el-popover>
              </template>
            </div>
            <div class="inter-county-map">
              <GmapMap
                ref="map1"
                :center="mapCentreLocation"
                :zoom="10"
                map-type-id="roadmap"
                class="map-content"
                :options="mapOptions"
              >
                <div v-if="markers.length > 1">
                  <gmap-marker
                    :position="get_position(1)"
                    :icon="path_icon()"
                  />
                </div>
              </GmapMap>
            </div>
          </div>
          <div
            class="vendor-options"
            v-for="n in extra_collection"
            :key="n + 1"
            :data-index="n + 1"
          >
            <a class="inter-county-headers">Collection centre {{ n + 1 }}</a>
            <i
              class="el-icon-circle-close close-icon"
              @click="removeExtraCollectionWrapper(n + 1)"
            ></i>
            <div class="vendor-options">
              <p class="pricing-input-labels">
                Physical address of the collection centre {{ n + 1 }}
              </p>
              <el-input
                v-model="collection_centre_address[n]"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="E.g Nation courier, Umoja building 3rd floor, Nyeri"
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
                            n + 1,
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
                      v-model="locations[n + 1]"
                      @input="handleFocus($event, n + 1)"
                    ></el-input>
                  </el-popover>
                </template>
              </div>
              <div class="inter-county-map">
                <GmapMap
                  :ref="`map${n + 1}`"
                  :center="mapCentreLocation"
                  :zoom="10"
                  map-type-id="roadmap"
                  class="map-content"
                  :options="mapOptions"
                >
                  <div v-if="markers.length > n + 1">
                    <gmap-marker
                      :position="get_position(n + 1)"
                      :icon="path_icon()"
                    />
                  </div>
                </GmapMap>
              </div>
            </div>
          </div>

          <div v-if="allow_add_collection" @click="addExtraCollectionWrapper()">
            <i class="el-icon-circle-plus-outline add-collection-icon"></i>
            <a class="add-collection-extra">Add collection centre</a>
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
              @click="createDestinationConfig"
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
  name: 'DestinationConfigComponent',
  components: { Loading },
  data() {
    return {
      loading_data: false,
      destination_config_data: [],
      filtered_destination_data: [],
      add_destination: false,
      visible: false,
      suggestions: [],
      pickUp: '',
      radius: '',
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
      max_delivery_range: 5,
      supported_vendor_types: [],
      locations: [],
      extra_collection: 0,
      collection_centers: [],
      destination_center: [],
      submit_status: false,
      response_status: true,
      error_msg: '',
      collection_centre_address: [],
      search_data: '',
      route_key: '',
      edit_route: false,
      delete_status: false,
      delete_response_status: true,
      service: '',
      placeService: '',
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
      if (this.destination_config_data === null) {
        return this.destination_config_data;
      } else {
        return this.destination_config_data.filter(
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
      this.filtered_destination_data = val;
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
      this.loadMapScript();
    });
    this.initiateData();
  },
  methods: {
    ...mapActions({
      request_vendor_types: 'request_vendor_types',
      request_destination_configs: 'request_intercounty_destination_configs',
      create_destination_config: 'create_pickup_config',
      remove_intercounty_record: 'remove_intercounty_record',
      update_intercounty_record: 'update_intercounty_record',
    }),
    initiateData() {
      this.fetchVendorTypes();
      this.requestDestinationData();
    },
    loadMapScript() {
      if (window.google && window.google.maps) {
        setTimeout(() => {
          this.initMap();
        }, 180);
      } else {
        const script = document.createElement('script');
        script.onload = () => {
          this.initMap();
        };
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.herokuKey}`;
        document.head.appendChild(script);
      }
    },
    initMap() {
      this.service = new window.google.maps.places.AutocompleteService();
      this.placeService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.suggestions = [];
        this.visible = false;
        return;
      }
      this.suggestions = predictions;
      this.visible = true;
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
          boundary_matched: true,
          boundary_name: 'Nairobi CBD',
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
    async requestDestinationData() {
      const arr = await this.request_destination_configs();
      this.destination_config_data = arr.destinations;
      this.filtered_destination_data = arr.destinations;
    },
    goToAddDestination() {
      this.add_destination = true;
    },
    one_step_back() {
      this.add_destination = false;
      this.clearStoreData();
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      this.service.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: ['ke', 'ug', 'tz'] },
        },
        this.displaySuggestions,
      );
    }, 500),
    handleSelect(item, input, placeId) {
      this.visible = false;
      this.searched = true;
      this.suggestions = [];
      const fromPlaceId = placeId;
      this.placeService.getDetails(
        {
          placeId: fromPlaceId,
        },
        details => {
          this.markers.splice(input, 1);
          this.locations[input] = details.name;
          const collection_marker = details.geometry;
          const data = {
            address: this.locations[input],
            lat: collection_marker.location.lat(),
            long: collection_marker.location.lng(),
          };

          const destination_config = this.destination_config_data;

          if (this.destination_config !== undefined) {
            for (let i = 0; i < destination_config.length; i++) {
              const retrived_collection_centre =
                destination_config[i].collection_centers;
              for (
                let val = 0;
                val < retrived_collection_centre.length;
                val++
              ) {
                if (
                  retrived_collection_centre[i].address !==
                  this.locations[input]
                ) {
                  data.object_id = retrived_collection_centre[i].object_id;
                }
              }
            }
          }

          if (input === 0) {
            this.destination_center.splice(input, 1);
            this.destination_center.splice(input, 0, data);
          } else {
            this.collection_centers.splice(input - 1, 1);
            this.collection_centers.splice(input - 1, 0, data);
          }
          const coordinates = {
            location: {
              lng: details.geometry.location.lng(),
              lat: details.geometry.location.lat(),
            },
          };
          this.markers.splice(input, 0, coordinates);

          const map_value = `map${input}`;
          let ref = '';
          if (input > 1) {
            ref = this.$refs[map_value][0];
          } else {
            ref = this.$refs[map_value];
          }

          const bounds = new google.maps.LatLngBounds();

          bounds.extend(details.geometry.location);
          ref.$mapObject.fitBounds(bounds);
          ref.$mapObject.setZoom(ref.$mapObject.zoom - 1);
        },
      );
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
      this.markers.splice(index, 1);
      this.collection_centers.splice(index - 1, 1);
      this.locations.splice(index, 1);
      this.extra_collection--;
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
    async removeDestination(data) {
      this.delete_status = true;
      this.delete_response_status = true;

      const payload = {
        id: data.object_id,
        route: 'destinations',
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
    editDestination(val) {
      this.supported_vendor_types = val.supported_vendor_types;
      this.locations[0] = val.name;
      this.radius = val.radius;
      this.max_delivery_range = val.max_delivery_range;
      let location = {
        address: val.name,
        lat: val.coordinates.coordinates[1],
        long: val.coordinates.coordinates[0],
        lng: val.coordinates.coordinates[0],
      };
      this.destination_center.push(location);
      const collection_cordinates = {
        location,
      };

      this.markers.splice(0, 0, collection_cordinates);

      const data = val.collection_centers;

      this.extra_collection = data.length - 1;

      for (let i = 0; i < data.length; i++) {
        location = {
          address: data[i].address,
          lat: data[i].coordinates.coordinates[1],
          long: data[i].coordinates.coordinates[0],
          lng: data[i].coordinates.coordinates[0],
          object_id: data[i].object_id,
        };

        this.collection_centers.push(location);
        this.locations[i + 1] = data[i].address;

        const collection_data = {
          location,
        };
        this.markers.splice(i + 1, 0, collection_data);
      }

      this.route_key = val.object_id;
      this.edit_route = true;
      this.add_destination = true;
    },
    clearStoreData() {
      this.locations = [];
      this.destination_center = [];
      this.supported_vendor_types = [];
      this.collection_centers = [];
      this.radius = '';
      this.max_delivery_range = 5;
      this.edit_route = false;
      this.route_key = '';
      this.route_key = false;
      this.extra_collection = 0;
      this.markers = [];
      this.collection_centre_address = [];
    },
    createDestinationConfig() {
      if (
        this.radius === '' ||
        this.max_delivery_range === '' ||
        this.collection_centre_address.length === 0 ||
        this.destination_center.length === 0 ||
        this.collection_centers.length === 0
      ) {
        this.submit_status = true;
        this.response_status = 'fail';
        this.error_msg = 'Kindly provide all values .';
      } else {
        this.submit_status = true;
        this.response_status = true;

        if (this.edit_route && this.route_key !== '') {
          this.updateDestinationConfig();
        } else {
          this.addNewDestinationConfig();
        }
      }
    },
    async addNewDestinationConfig() {
      const userInfo = this.userData.payload.data;

      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/inter_county_config/destinations',
        apiKey: false,
        params: {
          name: this.destination_center[0].address,
          lat: this.destination_center[0].lat,
          long: this.destination_center[0].long,
          country_code: 'KE',
          supported_vendor_types: this.supported_vendor_types,
          collection_centers: this.collection_centers,
          radius: parseInt(this.radius, 10),
          max_delivery_range: parseInt(this.max_delivery_range, 10),
          _user_email: userInfo.email,
          _user_id: parseInt(userInfo.admin_id, 10),
          action_user: userInfo.name,
        },
      };

      try {
        const data = await this.create_destination_config(payload);

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
    async updateDestinationConfig() {
      const payload = {
        id: this.route_key,
        route: 'destinations',
        params: {
          name: this.destination_center[0].address,
          lat: this.destination_center[0].lat,
          long: this.destination_center[0].long,
          country_code: 'KE',
          supported_vendor_types: this.supported_vendor_types,
          collection_centers: this.collection_centers,
          radius: parseInt(this.radius, 10),
          max_delivery_range: parseInt(this.max_delivery_range, 10),
          status: 1,
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
