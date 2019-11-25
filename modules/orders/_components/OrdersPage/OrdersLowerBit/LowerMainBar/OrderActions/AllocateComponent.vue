<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="assignOrder"
      class="form-inline"
    >
      <div :class="`col-md-12 user-search`">
        <TheSearchRiderComponent
          @riderID="searchedRider"
          :category="placehoder"
        />
        <div :class="`invalid ${hide}`">
          Please select a rider
        </div>
      </div>
      <br />
      <button class="btn btn-primary allocate">
        Allocate Order to Rider
      </button>
    </form>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  name: 'AllocateComponent',
  components: {
    TheSearchRiderComponent: () =>
      import(
        '../../../../../../biz/_components/UserActions/TheSearchRiderComponent'
      ),
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      placehoder: 'Search for rider',
      orderNo: this.order.order_details.order_no,
      rider: null,
      hide: 'hide',
      riderDetails: null,
    };
  },
  computed: {
    ...mapGetters(['getRider']),
  },
  watch: {
    async getRider(user) {
      await this.requestsingleRdier(user, 'rider');
      return (this.riderID = user);
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      request_single_rider: 'request_single_rider',
      assign_order: '$_orders/assign_order',
    }),
    searchedRider(riderID) {
      return (this.rider = riderID);
    },
    async requestsingleRdier(user) {
      const notification = [];
      const actionClass = '';
      this.riderDetails = null;
      const payload = { riderID: user };
      try {
        const data = await this.request_single_rider(payload);
        return (this.riderDetails = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    async assignOrder() {
      await this.requestsingleRdier(this.rider);
      const notification = [];
      let actionClass = '';

      const serialNo = this.riderDetails.serial_no;
      const phoneNo = this.riderDetails.phone_no;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'rider_app_confirm',
        apiKey: true,
        params: {
          sim_card_sn: serialNo,
          rider_phone: phoneNo,
          order_no: this.orderNo,
          distance: 9,
          polyline: 'encoded_string',
          version_code: 600,
        },
      };
      try {
        const data = await this.assign_order(payload);
        if (data.status) {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        } else {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
<style scoped>
.invalid {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 14px;
  color: #dc3545;
}
.allocate {
  margin: 10px 0;
}
</style>