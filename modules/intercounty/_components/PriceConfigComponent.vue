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
              @click="goToAddPriceConfig"
              >Add price configuration</el-button
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
          <el-table :data="price_config_data" size="medium" :border="false">
            <el-table-column label="Pick up" prop="pickup">
              <template slot-scope="scope">
                {{
                  getCityName(
                    price_config_data[scope.$index]['pickup']['city_id'],
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column label="Destination" prop="destination">
              <template slot-scope="scope">
                {{ price_config_data[scope.$index]['destination']['name'] }}
              </template>
            </el-table-column>
            <el-table-column label="3PL price" prop="price">
              <template slot-scope="scope">
                {{
                  `${price_config_data[scope.$index]['price'][0]['currency']} ${
                    price_config_data[scope.$index]['price'][0]['partner_price']
                  }`
                }}
              </template>
            </el-table-column>
            <el-table-column label="Sendy price" prop="price">
              <template slot-scope="scope">
                {{
                  `${
                    price_config_data[scope.$index]['price'][0]['currency']
                  }  ${
                    price_config_data[scope.$index]['price'][0]['sendy_price']
                  }`
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="3pl excess weight pricing"
              prop="excess_pricing"
            >
              <template slot-scope="scope">
                {{
                  `${
                    price_config_data[scope.$index]['cost_per_kg'][0][
                      'currency'
                    ]
                  }  ${
                    price_config_data[scope.$index]['cost_per_kg'][0][
                      'partner_cost'
                    ]
                  }/Kg`
                }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" prop="action" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  class="config-button--active"
                  @click="editRoute(price_config_data[scope.$index])"
                >
                  Edit
                </el-button>
                <el-button
                  size="mini"
                  class="config-button--archive"
                  @click="removeRoute(price_config_data[scope.$index])"
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
            Intercounty orders price configuration
          </p>
          <div class="new-pricing-tab-rows">
            <div class="pickup-location">
              <p class="pricing-input-labels">
                Name of the city of the pick up location
              </p>
              <el-select
                size="medium"
                class="new-pricing-config-inputs extra-dist"
                filterable
                placeholder="Select"
                v-model="pickup"
              >
                <el-option
                  v-for="val in pickupData"
                  :key="val.object_id"
                  :label="val.city_name"
                  :value="val.object_id"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <p class="pricing-input-labels">Name of the destination</p>
              <el-select
                size="medium"
                class="new-pricing-config-inputs extra-dist"
                filterable
                placeholder="Select"
                v-model="destination"
              >
                <el-option
                  v-for="val in destinationData"
                  :key="val.object_id"
                  :label="val.name"
                  :value="val.object_id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="vendor-options delivery-range-margin">
            <p class="pricing-input-labels">
              Maximum weight that the base price covers in (KGS)
            </p>
            <el-input-number
              type="number"
              v-model="maximum_weight"
              class="new-pricing-config-inputs"
              :min="0"
              :max="10"
            />
          </div>
          <div class="new-pricing-tab-rows">
            <div class="pickup-location">
              <p class="pricing-input-labels">
                3pl base rate
              </p>
              <el-input
                type="number"
                v-model="base_rate"
                class="new-pricing-config-inputs extra-dist"
                ><template class="pricing-prepend" slot="prepend">
                  Kes
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">Sendy base rate</p>
              <el-input
                type="number"
                v-model="sendy_rate"
                class="new-pricing-config-inputs extra-dist"
                ><template class="pricing-prepend" slot="prepend">
                  Kes
                </template>
              </el-input>
            </div>
          </div>
          <div class="new-pricing-tab-rows">
            <div class="pickup-location">
              <p class="pricing-input-labels">
                3pl excess weight rate per KG
              </p>
              <el-input
                type="number"
                v-model="excess_weight_rate"
                class="new-pricing-config-inputs extra-dist"
                ><template class="pricing-prepend" slot="prepend">
                  Kes
                </template>
              </el-input>
            </div>
            <div>
              <p class="pricing-input-labels">
                Sendy commision on excess Weight rate
              </p>
              <el-input
                type="number"
                v-model="sendy_commission"
                class="new-pricing-config-inputs extra-dist"
                ><template class="pricing-prepend" slot="prepend">
                  %
                </template>
              </el-input>
            </div>
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
              @click="createRouteConfig"
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';
import axios from 'axios';
import Loading from './LoadingComponent.vue';

export default {
  name: 'PriceConfigComponent',
  components: { Loading },
  data() {
    return {
      loading_data: false,
      price_config_data: [],
      add_destination: false,
      vendor_list: [],
      maximum_weight: 5,
      selected_city: [],
      selected_destination: [],
      city_list: [],
      destination_path: [],
      base_rate: '',
      sendy_rate: '',
      sendy_commission: '',
      excess_weight_rate: '',
      cities: [],
      pickup: '',
      destination: '',
      submit_status: false,
      response_status: true,
      error_msg: '',
      pickupData: [],
      destinationData: [],
      edit_route: false,
      route_key: '',
      delete_status: false,
      delete_response_status: true,
    };
  },
  computed: {
    ...mapState(['userData']),
  },
  watch: {},
  mounted() {
    this.initiateData();
  },
  methods: {
    ...mapActions({
      request_route_data: 'request_route_data',
      request_pickup_cities: 'request_pickup_cities',
      create_route_config: 'create_pickup_config',
      request_pickup_configs: 'request_intercounty_pickup_configs',
      request_destination_configs: 'request_intercounty_destination_configs',
      remove_intercounty_record: 'remove_intercounty_record',
      update_intercounty_record: 'update_intercounty_record',
    }),
    initiateData() {
      this.requestPickUpCities();
    },
    async requestPickUpCities() {
      const arr = await this.request_pickup_cities();
      this.cities = arr.cities;
      this.fetchRouteData();
      this.requestPickupData();
      this.requestDestinationData();
    },
    async fetchRouteData() {
      const arr = await this.request_route_data();
      this.price_config_data = arr.routes;
    },
    async requestPickupData() {
      const arr = await this.request_pickup_configs();
      const data = arr.pickups;
      if (data.length > 0) {
        const response = [];
        for (let i = 0; i < data.length; i++) {
          response.push(data[i]);
          const sub_data = this.cities.find(
            location => location.city_id === data[i].city_id,
          );
          response[i].city_name = sub_data.city_name;
        }
        this.pickupData = response;
      }
    },
    async requestDestinationData() {
      const arr = await this.request_destination_configs();
      this.destinationData = arr.destinations;
    },
    async removeRoute(data) {
      this.delete_status = true;
      this.delete_response_status = true;

      const payload = {
        id: data.object_id,
        route: 'routes',
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
    editRoute(data) {
      this.pickup = data.pickup.object_id;
      this.destination = data.destination.object_id;
      this.base_rate = data.price[0].partner_price;
      this.sendy_rate = data.price[0].sendy_price;
      this.excess_weight_rate = data.cost_per_kg[0].partner_cost;
      this.sendy_commission = data.cost_per_kg[0].sendy_up_charge;
      this.maximum_weight = data.max_weight;
      this.route_key = data.object_id;
      this.edit_route = true;
      this.add_destination = true;
    },
    goToAddPriceConfig() {
      this.add_destination = true;
    },
    one_step_back() {
      this.add_destination = false;
      this.clearStoreData();
    },
    clearStoreData() {
      this.edit_route = false;
      this.route_key = '';
      this.pickup = '';
      this.destination = '';
      this.base_rate = '';
      this.sendy_rate = '';
      this.excess_weight_rate = '';
      this.sendy_commission = '';
      this.maximum_weight = '';
    },
    getCityName(val) {
      let resp = '';
      if (this.cities.length > 0) {
        const data = this.cities.find(location => location.city_id === val);
        resp = data.city_name;
      }

      return resp;
    },
    createRouteConfig() {
      if (
        this.pickup === '' ||
        this.destination === '' ||
        this.maximum_weight === '' ||
        this.sendy_rate === '' ||
        this.excess_weight_rate === '' ||
        this.sendy_commission === '' ||
        this.base_rate === ''
      ) {
        this.submit_status = true;
        this.response_status = 'fail';
        this.error_msg = 'Kindly provide all values .';
      } else {
        this.submit_status = true;
        this.response_status = true;

        if (this.edit_route && this.route_key !== '') {
          this.updateRoute();
        } else {
          this.addNewRoute();
        }
      }
    },
    async addNewRoute() {
      const userInfo = this.userData.payload.data;

      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/inter_county_config/routes',
        apiKey: false,
        params: {
          pickup: this.pickup,
          destination: this.destination,
          currency: 'KES',
          '3pl_base_price': parseInt(this.base_rate, 10),
          sendy_base_price: parseInt(this.sendy_rate, 10),
          '3pl_extra_weight_cost': parseInt(this.excess_weight_rate, 10),
          sendy_extra_weight_up_charge: parseInt(this.sendy_commission, 10),
          max_weight: parseInt(this.maximum_weight, 10),
          _user_email: userInfo.email,
          _user_id: parseInt(userInfo.admin_id, 10),
          action_user: userInfo.name,
        },
      };

      try {
        const data = await this.create_route_config(payload);

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
    async updateRoute() {
      const payload = {
        id: this.route_key,
        route: 'routes',
        params: {
          pickup: this.pickup,
          destination: this.destination,
          currency: 'KES',
          '3pl_base_price': parseInt(this.base_rate, 10),
          sendy_base_price: parseInt(this.sendy_rate, 10),
          '3pl_extra_weight_cost': parseInt(this.excess_weight_rate, 10),
          sendy_extra_weight_up_charge: parseInt(this.sendy_commission, 10),
          max_weight: parseInt(this.maximum_weight, 10),
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
  },
};
</script>

<style lang="css">
@import './../../../assets/style/intercounty-config.css';
</style>
