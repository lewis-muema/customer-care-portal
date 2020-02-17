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
      defaultCurrency: '',
      vendorTypes: [],
      tableData: [],
      customPricingDetails: [],
      distancePricingTableData: [],
      locationPricingTableData: [],
    };
  },
  mounted() {
    this.copId = this.user.user_details.cop_id;
    this.defaultCurrency = this.user.user_details.default_currency;
    this.adminId = parseInt(this.session.payload.data.admin_id, 10);
  },
  computed: {
    ...mapGetters({
      configuredDistancePricing: 'getConfiguredDistancePricing',
      configuredLocationPricing: 'getConfiguredLocationPricing',
      getSessionData: 'getSession',
      pendingLocationPricing: 'getPendingLocationPricing',
    }),
  },
  methods: {
    ...mapActions({
      request_pending_distance_pricing_data:
        'request_pending_distance_pricing_data',
      request_pricing_data: 'request_pricing_data',
      request_vendor_types: 'request_vendor_types',
      send_mail_to_admin: 'send_mail_to_admin',
    }),
    async getDistancePricingConfigs() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.defaultCurrency,
          status: ['Pending'],
          admin_id: this.adminId,
        },
      };
      try {
        const data = await this.request_pending_distance_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          this.distancePricingTableData = this.pendingDistancePricing;
          this.locationPricingTableData = this.pendingLocationPricing;
        } else {
          this.distancePricingTableData = [];
          this.locationPricingTableData = [];
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchCustomDistancePricingData() {
      const notification = [];
      let actionClass = '';
      const payload = {
        app: 'PRICING_SERVICE',
        endpoint: 'pricing/price_config/get_custom_distance_details',
        apiKey: false,
        params: {
          cop_id: this.copId,
          currency: this.defaultCurrency,
          status: ['Pending', 'Active'],
        },
      };
      try {
        const data = await this.request_pricing_data(payload);
        if (data.status) {
          this.customPricingDetails = data.custom_pricing_details;
          this.distancePricingTableData = this.configuredDistancePricing;
          this.locationPricingTableData = this.configuredLocationPricing;
        } else {
          this.distancePricingTableData = [];
          this.locationPricingTableData = [];
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    async fetchVendorTypes(countryCode) {
      const notification = [];
      let actionClass = '';
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
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
    addRow(model) {
      if (model === 'Distance') {
        const distancePricingRow = {
          city: '',
          name: '',
          base_cost: '',
          base_km: '',
          cost_per_km_above_base_km: '',
          additional_location_cost: '',
          waiting_time_cost_per_min: '',
          loader_cost: '',
          service_fee: '',
          insurance: '',
          client_fee: '',
          cancellation_fee: '',
        };
        this.tableData.push(distancePricingRow);
      } else if (model === 'Location') {
        const locationPricingRow = {
          id: 1,
          name: '',
          cop_id: 1,
          cop_name: '',
          currency: 'KES',
          admin_id: 1,
          service_fee: 0,
          from: '',
          from_location: {
            type: 'Point',
            coordinates: [36.799157, -1.299287],
          },
          to_location: {
            type: 'Point',
            coordinates: [39.671947, -4.056442],
          },
          to: '',
          status: '',
          city: '',
          order_amount: 0,
          rider_amount: 0,
        };
        this.tableData.push(locationPricingRow);
      }
    },
    async sendEmailNotification(mail, name) {
      const notification = [];
      let actionClass = '';
      const crmName = this.getSessionData.payload.data.name;
      const copName = this.user.user_details.cop_name;
      const payload = {
        app: 'AUTH',
        endpoint: 'v1/send_email',
        apiKey: false,
        params: {
          name,
          email: mail,
          message: `${crmName} has created a custom pricing for ${copName}. Kindly review and approve the custom pricing.`,
          subject: `Requires approval - Custom pricing for ${copName}`,
        },
      };
      try {
        const data = await this.send_mail_to_admin(payload);
        if (data.result.status) {
          notification.push('Custom price configs created successfully.');
          actionClass = this.display_order_action_notification(data.status);
        } else {
          notification.push(data.error);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push('Something went wrong. Please try again.');
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
export default PricingConfigsMxn;
