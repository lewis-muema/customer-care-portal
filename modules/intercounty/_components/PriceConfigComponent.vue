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
        <div class="body-box col-md-12 intercounty-table">
          <el-table :data="price_config_data" size="medium" :border="false">
            <el-table-column label="Pick up" prop="pickup">
              <template>
                Name
              </template>
            </el-table-column>
            <el-table-column label="Destination" prop="destination">
              <template>
                Pending
              </template>
            </el-table-column>
            <el-table-column label="3PL price" prop="price">
              <template>
                Pending
              </template>
            </el-table-column>
            <el-table-column label="Sendy price" prop="sendy_price">
              <template>
                Name
              </template>
            </el-table-column>
            <el-table-column
              label="3pl excess weight pricing"
              prop="excess_pricing"
            >
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
                v-model="selected_city"
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
            <div>
              <p class="pricing-input-labels">Name of the destination</p>
              <el-select
                size="medium"
                class="new-pricing-config-inputs extra-dist"
                filterable
                placeholder="Select"
                v-model="selected_destination"
              >
                <el-option
                  v-for="destination in destination_path"
                  :key="destination.destination_id"
                  :label="destination.name"
                  :value="destination.destination_id"
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
                type="text"
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
                type="text"
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
                type="text"
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
                type="text"
                v-model="sendy_commission"
                class="new-pricing-config-inputs extra-dist"
                ><template class="pricing-prepend" slot="prepend">
                  %
                </template>
              </el-input>
            </div>
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
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    goToAddPriceConfig() {
      this.add_destination = true;
    },
    one_step_back() {
      this.add_destination = false;
    },
  },
};
</script>

<style lang="css">
@import "./../../../assets/style/intercounty-config.css";
</style>
