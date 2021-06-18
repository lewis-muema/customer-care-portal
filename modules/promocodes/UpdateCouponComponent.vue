<template>
  <div class="modal" tabindex="-1" role="dialog" id="updateCoupon">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add More Target Users</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div class="text-center" v-if="loading">
            Loading Promo Code ....
            <i class="fa fa-spinner fa-spin loader"></i>
          </div>
          <div class="text-center" v-if="coupon === null">
            No promo code found
            <i class="fa fa-spinner fa-spin loader"></i>
          </div>
          <span v-else>
            <div class="form-group col-md-12">
              <label class="reason"
                >Enter or Upload the user’s email addresses</label
              >
              <TheTagsComponent
                @emails="setTargetGroup"
                @deleteEmail="deleteEmail"
                :target-groups="targetGroups"
              />
            </div>
            <div class="row pull-right">
              <a
                class="cancel-button close"
                data-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </a>
              <button
                class="btn btn-primary action-button submit-btn"
                @click="update()"
                :disabled="!isValid || coupon[0].active === 1"
              >
                <span v-if="loading">
                  <i class="fa fa-spinner fa-spin"></i>
                  loading
                </span>
                <span v-else>Add Users </span>
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'UpdateCouponComponent',
  components: {
    TheTagsComponent: () => import('./TheTagsComponent'),
  },
  props: ['couponID', 'coupon'],
  data() {
    return {
      reason: '',
      submitted: false,
      isValid: true,
      targetedGroup: [],
      loading: false,
    };
  },
  validations: {
    reason: { required },
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData', 'config']),
    targetGroups() {
      let arr = [];
      if (this.coupon !== null || this.coupon[0].targetedGroupList.length > 0) {
        const result = this.coupon[0].targetedGroupList;
        arr =
          result.length !== 0
            ? result.map(item => ({
                text: typeof item.email === 'undefined' ? ' ' : item.email,
                tiClasses: ['ti-valid'],
              }))
            : result;
      }
      return arr;
    },
  },

  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions(['request_single_coupons', 'perform_user_action']),

    setTargetGroup(emails) {
      this.targetedGroup = emails.data;
      this.isValid = emails.status;
    },
    async update() {
      this.submitted = true;
      const notification = [];
      let actionClass = '';
      this.loading = true;
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'update_targeted',
        params: {
          data_set: 'targeted_coupon',
          action_id: 1,
          action_data: {
            coupon_name: this.coupon[0].couponName,
            targeted_group: this.targetedGroup,
          },
          request_id: '1622',
          action_user: this.actionUser,
        },
      };
      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.message);
        actionClass = this.display_order_action_notification(data.status);
        this.loading = false;
        if (data.status) {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
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

    async deleteEmail(val) {
      this.submitted = true;
      const notification = [];
      let actionClass = '';
      const email = [
        {
          email: val.data,
        },
      ];
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'update_targeted',
        params: {
          data_set: 'targeted_coupon',
          action_id: 2,
          action_data: {
            coupon_name: this.coupon[0].couponName,
            targeted_group: email,
          },
          request_id: '1622',
          action_user: this.actionUser,
        },
      };
      this.loading = true;
      try {
        const data = await this.perform_user_action(payload);
        this.loading = false;
        notification.push(data.message);
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
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
@import './_assets/styles/modals.css';
</style>
