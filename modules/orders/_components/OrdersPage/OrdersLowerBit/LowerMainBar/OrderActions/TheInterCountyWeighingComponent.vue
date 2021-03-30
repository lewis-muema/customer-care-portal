<template>
  <span>
    <div class="highlight-weighing-header weight-estimate-margin">
      Estimated weight of the parcel
    </div>
    <div>
      {{ fetchOrderWeight(order.order_details.inter_county_order_details) }} kg
    </div>
    <br />
    <form @submit.prevent="approveWeight" class="form-group">
      <div class="form-group">
        <div class="highlight-weighing-header">
          Actual Weight of the parcel
        </div>
        <br />
        <div class="">
          <el-input-number v-model="parcel_weight" :min="1" :max="50" />
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary action-button">
          Update Weight
        </button>
      </div>
    </form>
  </span>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheInterCountyWeighingComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      parcel_weight: 1,
    };
  },
  computed: {
    ...mapState(['userData']),
  },
  created() {},
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      update_intercounty_delivery_state: 'update_intercounty_delivery_state',
    }),
    async approveWeight() {
      const notification = [];
      let actionClass = '';

      const userInfo = this.userData.payload.data;

      const payload = {
        route: 'update_weight',
        params: {
          _user_email: userInfo.email,
          _user_id: userInfo.admin_id,
          action_user: userInfo.name,
          channel: 'customer_support',
          data_set: 'cc_actions',
          order_no: this.orderNo,
          final_weight: this.parcel_weight,
        },
      };
      try {
        const data = await this.update_intercounty_delivery_state(payload);

        if (data.status) {
          notification.push(data.reason);
          actionClass = this.display_order_action_notification(data.status);
        } else {
          if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
            this.error_msg = data.errors;
          } else {
            this.error_msg = data.reason;
          }
          notification.push(this.error_msg);
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
    fetchOrderWeight(order) {
      let resp = '';
      if (order.final_weight === null) {
        resp = order.approximate_weight;
      } else {
        resp = order.final_weight;
      }
      return resp;
    },
  },
};
</script>
<style scoped>
.highlight-weighing-header {
  color: #000000;
  font-weight: 600;
}
.weight-estimate-margin {
  margin-bottom: 1%;
}
</style>
