<template>
  <div class="modal" tabindex="-1" role="dialog" id="deactivateCoupon">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Promo Code Deactivation</h5>
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
          <div class="form-group col-md-12">
            <label class="reason"
              >Once you confirm, this action cannot be reversed</label
            >
            <textarea
              type="text"
              v-model="reason"
              name="reason"
              class="form-control coupon-reason"
              placeholder="Enter Reason"
              :class="{
                'is-invalid': submitted && $v.reason.$error,
              }"
            >
            </textarea>
            <div
              v-if="submitted && !$v.reason.required"
              class="invalid-feedback"
            >
              Coupon deactivation reason is required
            </div>
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
              @click="deactivate()"
            >
              Deactivate Promo Code
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'DeactivateCouponComponent',
  props: ['couponName'],
  data() {
    return {
      reason: '',
      submitted: false,
    };
  },
  validations: {
    reason: { required },
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData', 'config']),
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions(['perform_user_action']),
    async deactivate() {
      this.submitted = true;
      const notification = [];
      let actionClass = '';

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'create_coupon_code',
        apiKey: true,
        params: {
          data_set: 'coupon_actions',
          action_id: 3,
          action_data: {
            coupon_name: this.couponName,
            coupon_type: null,
            coupon_discount: null,
            coupon_start_date: null,
            coupon_end_date: null,
            maximum_usage: null,
            maximum_usage_user: null,
            max_discount_amount: null,
            country_code: null,
            sendy_staff_promo: null,
            is_targeted: false,
            targeted_group: [],
            targeted_file: null,
          },
          request_id: '1622',
          action_user: this.actionUser,
        },
      };

      try {
        const data = await this.perform_user_action(payload);
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
.coupon-reason {
  padding: 8px 16px;
  width: 360px;
  border: 1px solid #c0c4cc;
  border-radius: 8px;
}
.cancel-button {
  width: auto;
  margin-right: 16px;
}
.submit-btn {
  background: #527cbd;
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
}
</style>
