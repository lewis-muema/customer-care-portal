import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedCancellationConsequence: null,
      order_status_data: [
        {
          label: 'Before an order has been confirmed',
          reason: 'BEFORE_CONFIRMATION',
          value: 1,
        },
        {
          label: 'Before arrival at pickup location',
          reason: 'AFTER_CONFIRMATION',
          value: 2,
        },
        {
          label: 'After arrival at pick up location',
          reason: 'AFTER_ARRIVAL_AT_PICK_UP',
          value: 3,
        },
      ],
      comparison_parameters: [
        { name: 'Less than', value: 1 },
        { name: 'More than', value: 2 },
        { name: 'Immediately', value: 0 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
      actions_data: 'getCancellationActions',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  created() {
    this.getActionValues();
  },
  methods: {
    ...mapActions({
      fetch_cancellation_actions: 'fetch_cancellation_actions',
      update_cancellation_consequences: 'update_cancellation_consequences',
    }),
    getActionValues() {
      this.fetch_cancellation_actions()
        .then()
        .catch(err => {
          throw err;
        });
    },
    fetchCountry(code) {
      if (!code) return '';
      const data = this.active_countries.find(
        location => location.country_code === code,
      );
      return data.country_name;
    },
    getActionTypes(actionsArray) {
      const actionTypeArray = [];
      actionsArray.forEach(action => actionTypeArray.push(action.action_type));
      const duplicateCleanArray = [...new Set(actionTypeArray)];
      const actionData = this.mapActionTypesToAction(duplicateCleanArray);
      const actionName = actionData.map(action => {
        return ` ${action}`;
      });
      return actionName.toString();
    },
    mapActionTypesToAction(actionsIdArray) {
      const dataArray = [];
      actionsIdArray.map(actionType => {
        const data = this.actions_data.find(action => action.id === actionType);
        dataArray.push(data.display_name);
      });
      return dataArray;
    },
    mapActionNames(actionType) {
      const { display_name } = this.actions_data.find(
        action => action.id === actionType,
      );
      return display_name;
    },
    mapComparator(comparator) {
      const { name } = this.comparison_parameters.find(
        parameter => parameter.value === comparator,
      );
      return name;
    },
    mapOrderStatus(statusCode) {
      const { label } = this.order_status_data.find(
        status => status.value === statusCode,
      );
      return `${label}.`;
    },
    formatVendorTypeNames(vendorNamesArray) {
      if (!vendorNamesArray.length) return '';
      const formattedNames = vendorNamesArray.map(vendor => {
        return ` ${vendor}`;
      });
      return formattedNames.toString();
    },
    activeStatus(status) {
      return status === 1 ? 'Active' : 'Deactivated';
    },
    setStatusText(row) {
      return row.status === 1 ? 'Deactivate' : 'Activate';
    },
    getCurrentUsersCountryCode() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray);
    },
    loading(currentRow) {
      return currentRow === this.selectedCancellationConsequence;
    },
    async setStatusState(row) {
      this.selectedCancellationConsequence = row.id;
      const payload = {
        ...row,
        vendor_type_ids: JSON.parse(row.vendor_type_ids),
        admin_id: this.getSession.payload.data.admin_id,
        admin_name: this.getSession.payload.data.name,
        status: row.status === 1 ? 0 : 1,
        country_filter: this.getCurrentUsersCountryCode(),
      };

      await this.update_cancellation_consequences(payload);
      setTimeout(() => {
        this.selectedCancellationConsequence = null;
      }, 3000);
    },
  },
};
