import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
  data() {
    return {
      comparator: [
        { code: 'ET', name: 'Equal to' },
        { code: 'GT', name: 'Greater than' },
        { code: 'LT', name: 'Less than' },
        { code: 'GET', name: 'Greater than or equal to' },
        { code: 'LET', name: 'Less than or equal to' },
      ],
      all_reasons_data: [],
      vendor_type: [],
      penalizing_data: [
        { code: 'DELAYED_AT_PICKUP', name: 'Delayed at pick up' },
        { code: 'DELAYED_AT_DELIVERY', name: 'Delayed at delivery ' },
        { code: 'REASSIGNED', name: 'Reassigned orders ' },
      ],
      map_actions_data: [
        {
          id: 1,
          name: 'Block',
          display_name: 'Block from dispatch',
        },
        {
          id: 2,
          name: 'Penalty_Fee',
          display_name: 'Charge a penalty fee',
        },
        {
          id: 3,
          name: 'Reallocation',
          display_name: 'Allow partner to reallocate',
        },
        {
          id: 4,
          name: 'Reschedule',
          display_name: 'Allow customer to reschedule order',
        },
        {
          id: 5,
          name: 'Notification',
          display_name: 'Trigger notification alert',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      active_countries: 'getActiveCountries',
    }),
  },
  created() {
    this.fetchAllReassignmentReasons();
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  methods: {
    ...mapActions({
      update_reward: 'update_reward',
      request_vendor_types: 'request_vendor_types',
      fetch_all_reallocation_reason: 'fetch_all_reallocation_reason',
    }),
    fetchAllReassignmentReasons() {
      this.fetch_all_reallocation_reason()
        .then(results => {
          this.all_reasons_data = results.data;
        })
        .catch(error => {
          throw error;
        });
    },
    reassignData(param, comparator, value) {
      let resp = '';
      if (Object.keys(this.comparator).length > 0) {
        if (param === 'REASSIGNED') {
          const response = [];
          const arr = JSON.parse(value);
          for (let i = 0; i < arr.length; i++) {
            const reallocationData = this.all_reasons_data.find(
              location => location.reallocation_id === arr[i],
            );
            if (reallocationData === undefined) return 'Not found!';
            response.push(reallocationData.description);
            resp = response.toString();
          }
        } else {
          const data = this.comparator.find(
            location => location.code === comparator,
          );
          resp = `${data.name} ${value} orders`;
        }
      }
      return resp;
    },
    reallocationReasonMap(reallocation_id) {
      const response = [];
      const reallocationData = this.all_reasons_data.find(
        location => location.reallocation_id === reallocation_id,
      );
      if (reallocationData === undefined) return 'Not found!';
      response.push(reallocationData.description);
      return response.toString();
    },
    penalizeLabel(val) {
      let resp = 'Orders to penalize for be';
      if (val === 'REASSIGNED') {
        resp = 'Reassign reasons to penalize';
      }
      return resp;
    },
    fetchCountry(code) {
      if (!code) return '';
      const data = this.active_countries.find(
        location => location.country_code === code,
      );
      return data.country_name;
    },
    penalizingParams(code) {
      if (!code) return 'Not found';
      if (Object.keys(this.penalizing_data).length > 0) {
        const data = this.penalizing_data.find(
          location => location.code === code,
        );
        if (!data || !Object.keys(data).length) return 'Not found';
        return data.name;
      }
    },
    actionType(actionId) {
      if (actionId <= 3) {
        return 'Partner action';
      } else if (actionId === 4) {
        return 'Customer action';
      } else if (actionId === 5) {
        return 'Partner action / Customer action';
      }
    },
    actionPenalty(action) {
      if (action.action_id === 1) {
        return `for ${action.block_hours} hours`;
      } else if (action.action_id === 2) {
        const currency = action.currency === null ? '' : action.currency;
        return `of ${currency} ${action.penalty_fee}`;
      } else {
        return '';
      }
    },
    mapActionsId(actionId) {
      if (!actionId) return '';
      const actionInfo = this.map_actions_data.filter(
        action => action.id === actionId,
      );
      return actionInfo[0].display_name;
    },
    activeStatus(state) {
      let status = 'Deactivated';
      if (state === 1) {
        status = 'Active';
      }
      return status;
    },
    actionStatus(state) {
      let status = 'Activate';
      if (state === 1) {
        status = 'Deactivate';
      }
      return status;
    },
    async handleAction(row, type) {
      let data = {};

      if (!row.from_date) row.from_date = Date.now();
      if (!row.to_date) row.to_date = Date.now();
      row.admin_id = this.getSession.payload.data.admin_id;

      data = row;

      if (row.status === 1) {
        data.status = 0;
        data.from_date = moment(row.from_date).format('YYYY-MM-DD');
        data.to_date = moment(row.to_date).format('YYYY-MM-DD');
      } else {
        data.status = 1;
        data.from_date = moment(row.from_date).format('YYYY-MM-DD');
        data.to_date = moment(row.to_date).format('YYYY-MM-DD');
      }

      const url =
        type === 'penalizing'
          ? `/penalties/${row.id}`
          : `/order-reallocation-actions/${row.id}`;

      const payload = {
        app: 'ADONIS_API',
        endpoint: url,
        apiKey: false,
        params: data,
      };

      try {
        await this.update_reward(payload);
        const initData = {
          loading_penalties: true,
        };
        this.initiateData(initData);
      } catch (error) {
        const initData = {
          loading_penalties: true,
          response_status: 'error',
          error_msg:
            'Internal Server Error. Kindly refresh the page. If error persists contact tech support',
        };
        this.initiateData(initData);
      }
    },
    async handleArchive(row, type) {
      let data = {};

      if (!row.from_date) row.from_date = Date.now();
      if (!row.to_date) row.to_date = Date.now();
      row.admin_id = this.getSession.payload.data.admin_id;

      data = row;
      data.status = 2;
      data.from_date = moment(row.from_date).format('YYYY-MM-DD');
      data.to_date = moment(row.to_date).format('YYYY-MM-DD');

      const url =
        type === 'penalizing'
          ? `/penalties/${row.id}`
          : `/order-reallocation-actions/${row.id}`;

      const payload = {
        app: 'ADONIS_API',
        endpoint: url,
        apiKey: false,
        params: data,
      };

      try {
        await this.update_reward(payload);
        const initData = {
          loading_penalties: true,
        };
        this.initiateData(initData);
      } catch (error) {
        const initData = {
          loading_penalties: true,
          response_status: 'error',
          error_msg:
            'Internal Server Error. Kindly refresh the page. If error persists contact tech support',
        };
        this.initiateData(initData);
      }
    },
    initiateData(intiData) {
      this.$emit('initiateData', intiData);
    },
  },
};
