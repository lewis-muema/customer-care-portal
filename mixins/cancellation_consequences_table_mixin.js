import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedCancellationConsequence: null,
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
    console.log('TABLE ', this.activeCancellationConsequences);
  },
  methods: {
    ...mapActions({
      fetch_cancellation_actions: 'fetch_cancellation_actions',
      update_cancellation_status: 'update_cancellation_reason',
    }),
    getActionValues() {
      this.fetch_cancellation_actions().then(data => {
        console.log(data);
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
    loading(currentRow, selectedRow) {
      return currentRow === selectedRow;
    },
    async setStatusState(row) {
      this.selectedCancellationConsequence = row.id;
      const payload = {
        ...row,
        admin_id: this.getSession.payload.data.admin_id,
        status: row.status === 1 ? 0 : 1,
        country_filter: this.getCurrentUsersCountryCode(),
      };

      await this.update_cancellation_status(payload);
      setTimeout(() => {
        this.selectedCancellationConsequence = null;
      }, 3000);
    },
  },
};
