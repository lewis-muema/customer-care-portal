<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="allocateRider"
      class="form-inline"
    >
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
      <button class="btn btn-primary allocate">
        Allocate Rider
      </button>
    </form>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';

import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheRiderComponent',
  components: {
    TheSearchRiderComponent: () => import('./TheSearchRiderComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      placehoder: 'Select Rider account to pay',
      rider: null,
      submitted: false,
      hide: 'hide',
      array: {},
    };
  },
  validations: {
    rider: { required },
  },
  computed: {
    copID() {
      return this.user.user_details.cop_id;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      perform_user_action: 'perform_user_action',
    }),
    searchedRider(riderID) {
      return (this.rider = riderID);
    },
    async allocateRider() {
      if (this.rider === null) {
        this.hide = '';
        return;
      }
      const notification = [];
      let actionClass = '';
      const riderList = this.user.rider_list;

      const existingRider = riderList.filter(list => {
        return list.rider_id === Number(this.rider);
      });
      if (existingRider.length > 0) {
        notification.push('This rider has already been allocated to this user');
        this.updateClass('danger');
        this.updateErrors(notification);
        return;
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: 10,
          action_data: {
            rider_id: this.rider,
            cop_id: this.copID,
          },
          request_id: 18,
          action_user: this.actionUser,
        },
      };
      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          this.updateSuccess(true);
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
