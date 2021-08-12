<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="assignOrder"
      class="form-inline col-md-12"
    >
      <div class="form-group col-md-12">
        <textarea
          type="text"
          v-model="description"
          :id="`cancel_description_${orderNo}`"
          name="description"
          placeholder="Reason for Manual Allocation"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.description.$error,
          }"
        >
        </textarea>
        <div
          v-if="submitted && !$v.description.required"
          class="invalid-feedback"
        >
          Description is required
        </div>
      </div>
      <div :class="`col-md-12 user-search`">
        <TheSearchRiderComponent
          @riderData="searchedRider"
          :category="placehoder"
          :arr="array"
          :rider-key="0"
        />
        <div :class="`invalid ${hide}`">
          Please select a rider
        </div>
      </div>
      <br />
      <button class="btn btn-primary allocate" :disabled="!rider">
        Allocate Order to Rider
      </button>
    </form>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

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
      description: '',
      submitted: false,
      version_code: '',
      batch_no: this.order.order_details.batch_no,
      array: {},
    };
  },
  validations: {
    description: { required },
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
      assign_order: 'orders/assign_order',
      requestAppVersion: 'requestAppVersion',
    }),
    searchedRider(riderData) {
      return (this.rider = riderData.riderID);
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
    async getAppVersion() {
      const payload = {
        app: 'ADONIS_API',
        endpoint: 'version',
        apiKey: true,
      };
      try {
        this.version_code = await this.request_payment_methods(payload);
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
    },

    async assignOrder() {
      await this.requestsingleRdier(this.rider);
      this.version_code = await this.requestAppVersion();
      const notification = [];
      let actionClass = '';
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const serialNo = this.riderDetails.serial_no;
      const phoneNo = this.riderDetails.phone_no;
      const email = this.session.payload.data.email;
      const id = this.session.payload.data.admin_id;
      const name = this.session.payload.data.name;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'allocate_cc',
        apiKey: true,
        params: {
          sim_card_sn: serialNo,
          rider_phone: phoneNo,
          order_no: this.orderNo,
          distance: 9,
          polyline: 'encoded_string',
          version_code: this.version_code,
          action_user: name,
          _user_email: email,
          _user_id: id,
          allocation_reason: this.description,
          channel: 'customer_support',
          data_set: 'cc_actions',
          action_id: '',
        },
      };

      if (this.batch_no !== null) {
        payload.params.batch_no = this.batch_no;
      }
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
  margin-left: 0%;
}
.allocate:disabled .allocate[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}
.form-group.col-md-12 {
  width: 91%;
  margin-left: -2%;
}
.col-md-12 .user-search {
  padding-left: 15px;
  width: 99%;
  margin-left: -2%;
}
</style>
