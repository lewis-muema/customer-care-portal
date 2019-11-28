import { mapActions, mapGetters, mapMutations } from 'vuex';

const FetchConfigsMxn = {
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
      customPricingDetails: [],
      distancePricingTableData: [],
    };
  },
  mounted() {
    this.copId = this.user.user_details.cop_id;
    this.currency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.getSessionData.payload.data.admin_id, 10);
  },
  methods: {
    ...mapActions({
      request_pending_distance_pricing_data:
        'request_pending_distance_pricing_data',
    }),
    async getDistancePricingConfigs() {
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.currency,
          status: 'Pending',
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
  },
};
export default FetchConfigsMxn;
