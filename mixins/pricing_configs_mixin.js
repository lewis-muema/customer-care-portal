import { mapActions, mapGetters, mapMutations } from 'vuex';

const PricingConfigsMxn = {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      copId: '',
      adminId: '',
      currency: '',
      vendorTypes: [],
      customPricingDetails: [],
      distancePricingTableData: [],
    };
  },
  mounted() {
    this.copId = this.user.user_details.cop_id;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.session.payload.data.admin_id, 10);
  },
  computed: {
    ...mapGetters({
      configuredDistancePricing: 'getConfiguredDistancePricing',
    }),
  },
  methods: {
    ...mapActions({
      request_pending_distance_pricing_data:
        'request_pending_distance_pricing_data',
      request_pricing_data: 'request_pricing_data',
      request_vendor_types: 'request_vendor_types',
    }),
    async getDistancePricingConfigs() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.currency,
          status: ['Pending'],
          admin_id: this.adminId,
        },
      };
      try {
        const data = await this.request_pending_distance_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          return (this.distancePricingTableData = this.pendingDistancePricing);
        } else {
          return (this.distancePricingTableData = []);
        }
      } catch (error) {
        this.status = false;
      }
    },
    async fetchCustomDistancePricingData() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.currency,
          status: ['Pending', 'Active'],
        },
      };
      try {
        const data = await this.request_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          return (this.distancePricingTableData = this.configuredDistancePricing);
        } else {
          this.distancePricingTableData = [];
        }
      } catch (error) {
        this.status = false;
      }
    },
    async fetchVendorTypes(countryCode) {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'vendors/types',
        apiKey: false,
        params: {
          pickup_country_code: countryCode,
          dropoff_country_code: countryCode,
        },
      };
      try {
        const data = await this.request_vendor_types(payload);
        return (this.vendorTypes = data.vendor_types);
      } catch (error) {
        this.status = false;
      }
    },
  },
};
export default PricingConfigsMxn;
