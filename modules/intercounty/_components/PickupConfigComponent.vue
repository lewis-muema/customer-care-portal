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
              placeholder="Search ..."
              autocomplete="off"
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
        <div class="body-box col-md-12 intercounty-table">
          <el-table
            :data="destination_config_data"
            size="medium"
            :border="false"
          >
            <el-table-column label="Name" prop="name">
              <template>
                Name
              </template>
            </el-table-column>
            <el-table-column label="Collection centre address" prop="centre">
              <template>
                Pending
              </template>
            </el-table-column>
            <el-table-column label="Actions" prop="action">
              <template>
                Pending
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
              v-model="selected_pickup_centre"
            >
              <el-option
                v-for="city in city_list"
                :key="city.city_id"
                :label="city.name"
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
              placeholder="Select"
              v-model="selected_vendor"
            >
              <el-option
                v-for="vendor in vendor_list"
                :key="vendor.vendor_id"
                :label="vendor.name"
                :value="vendor.vendor_id"
              >
              </el-option>
            </el-select>
          </div>

          <div class="submit-intercounty-config">
            <button class="new-pricing-input-buttons new-pricing-submit-button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import Loading from './LoadingComponent.vue';

export default {
  name: 'PickupConfigComponent',
  components: { Loading },
  data() {
    return {
      loading_data: false,
      destination_config_data: [],
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
      selected_pickup_centre: [],
      city_list: [],
    };
  },
  computed: {
    herokuKey() {
      return this.$env.HEROKU_GOOGLE_API_KEY;
    },
    allow_add_collection() {
      return this.markers.length > 1;
    },
  },
  watch: {},
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
    });
  },
  methods: {
    goToAddPickUpConfig() {
      this.add_destination = true;
    },
    one_step_back() {
      this.add_destination = false;
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&fields=geometry&key=${this.herokuKey}`,
        )
        .then(response => {
          console.log('response', response.data.predictions);
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
  },
};
</script>

<style lang="css">
@import "./../../../assets/style/intercounty-config.css";
</style>
