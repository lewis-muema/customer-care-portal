<template>
  <div>
    <DistancePricingApprovalComponent v-if="distancePricing" :user="user" />
    <LocationPricingApprovalComponent
      v-if="locationPricing"
      :user="user"
    ></LocationPricingApprovalComponent>
    <ContainerPricingApprovalComponent
      v-if="containerPricing"
      :user="user"
    ></ContainerPricingApprovalComponent>
    <DailyRatePricingApprovalComponent :user="user" v-if="dailyRatePricing">
    </DailyRatePricingApprovalComponent>
    <MileagePricingApprovalComponent :user="user" v-if="mileagePricing">
    </MileagePricingApprovalComponent>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  layout: 'users',
  components: {
    DistancePricingApprovalComponent: () =>
      import(
        '../../../modules/biz/_components/UserActions/PricingApproval/DistancePricingApprovalComponent'
      ),
    LocationPricingApprovalComponent: () =>
      import(
        '../../../modules/biz/_components/UserActions/PricingApproval/LocationPricingApprovalComponent'
      ),
    ContainerPricingApprovalComponent: () =>
      import(
        '../../../modules/biz/_components/UserActions/PricingApproval/ContainerPricingApprovalComponent'
      ),
    MileagePricingApprovalComponent: () =>
      import(
        '../../../modules/biz/_components/UserActions/PricingApproval/MileagePricingApprovalComponent'
      ),
    DailyRatePricingApprovalComponent: () =>
      import(
        '../../../modules/biz/_components/UserActions/PricingApproval/DailyRatePricingApprovalComponent'
      ),
  },
  data() {
    return {
      copId: parseInt(this.$route.params.id, 10),
      locationPricing: false,
      distancePricing: false,
      containerPricing: false,
      dailyRatePricing: false,
      mileagePricing: false,
      defaultCurrency: '',
      secondaryCurrency: '',
      message: '',
      user: {},
    };
  },
  computed: {},
  async mounted() {
    await this.singleCopUserRequest();
    this.fetchCustomDistancePricingData();
    this.fetchDedicatedPricingData();
  },
  methods: {
    ...mapActions([
      'request_single_user',
      'request_pending_distance_pricing_data',
      'pending_dedicated_pricing_data',
    ]),
    async singleCopUserRequest() {
      const payload = { userID: this.copId, userType: 'cop' };
      try {
        const data = await this.request_single_user(payload);
        this.defaultCurrency = data.user_details.default_currency;
        this.secondaryCurrency = data.user_details.secondary_currency;
        this.user = data;
      } catch (error) {
        this.message = 'Something went wrong. Please try again.';
      }
    },
    async fetchCustomDistancePricingData() {
      const currenciesArray = [this.defaultCurrency];
      if (this.secondaryCurrency) {
        currenciesArray.push(this.secondaryCurrency);
      }
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: currenciesArray,
          status: ['Pending'],
          get_object_id: true,
          admin_id: parseInt(this.session.payload.data.admin_id, 10),
        },
      };
      try {
        const data = await this.request_pending_distance_pricing_data(payload);
        data.custom_pricing_details.forEach(row => {
          if (Object.prototype.hasOwnProperty.call(row, 'distance_pricing')) {
            this.distancePricing = true;
          }
          if (Object.prototype.hasOwnProperty.call(row, 'location_pricing')) {
            this.locationPricing = true;
          }
          if (Object.prototype.hasOwnProperty.call(row, 'container_pricing')) {
            this.containerPricing = true;
          }
        });
      } catch (error) {
        this.message = 'Something went wrong. Please try again.';
      }
    },
    async fetchDedicatedPricingData() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_dedicated_price_configs',
        apiKey: false,
        params: {
          cop_id: this.copId,
        },
      };
      try {
        const data = await this.pending_dedicated_pricing_data(payload);
        if (data.status) {
          data.data.forEach(row => {
            if (
              row.price_type === 'daily_rate' &&
              row.status === 'Pending' &&
              row.approved_by ===
                parseInt(this.session.payload.data.admin_id, 10)
            ) {
              this.dailyRatePricing = true;
            }
            if (
              (row.price_type === 'per_km_band' ||
                row.price_type === 'standard_rate_per_km') &&
              row.status === 'Pending' &&
              row.approved_by ===
                parseInt(this.session.payload.data.admin_id, 10)
            ) {
              this.mileagePricing = true;
            }
          });
        }
      } catch (error) {
        this.message = 'Something went wrong. Please try again.';
      }
    },
  },
};
</script>
