<template>
  <div>
    <DistancePricingApprovalComponent v-if="distancePricing" :user="user" />
    <LocationPricingApprovalComponent
      v-if="locationPricing"
      :user="user"
    ></LocationPricingApprovalComponent>
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
  },
  data() {
    return {
      copId: parseInt(this.$route.params.id, 10),
      locationPricing: false,
      distancePricing: false,
      containerPricing: false,
      defaultCurrency: '',
      message: '',
      user: {},
    };
  },
  computed: {},
  async mounted() {
    await this.singleCopUserRequest();
    this.fetchCustomDistancePricingData();
  },
  methods: {
    ...mapActions(['request_single_user', 'request_pricing_data']),
    async singleCopUserRequest() {
      const payload = { userID: this.copId, userType: 'cop' };
      try {
        const data = await this.request_single_user(payload);
        this.defaultCurrency = data.user_details.default_currency;
        this.user = data;
      } catch (error) {
        this.message = 'Something went wrong. Please try again.';
      }
    },
    async fetchCustomDistancePricingData() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.defaultCurrency,
          status: ['Pending', 'Active'],
        },
      };
      try {
        const data = await this.request_pricing_data(payload);
        data.custom_pricing_details.forEach(row => {
          if (Object.prototype.hasOwnProperty.call(row, 'distance_pricing')) {
            if (row.distance_pricing.status === 'Pending') {
              this.distancePricing = true;
            }
          }
          if (Object.prototype.hasOwnProperty.call(row, 'location_pricing')) {
            row.location_pricing.forEach(row1 => {
              if (row1.status === 'Pending') {
                this.locationPricing = true;
              }
            });
          }
          if (Object.prototype.hasOwnProperty.call(row, 'container_pricing')) {
            row.container_pricing.forEach(row2 => {
              if (row2.status === 'Pending') {
                this.containerPricing = true;
              }
            });
          }
        });
      } catch (error) {
        this.message = 'Something went wrong. Please try again.';
      }
    },
  },
};
</script>
