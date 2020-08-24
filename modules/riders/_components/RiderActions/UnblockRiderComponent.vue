<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="unblockRider"
      class="form-inline"
    >
      <div class="form-group col-md-8">
        <label>Reason</label>
        <input
          type="text"
          v-model="narrative"
          :id="narrative"
          name="narrative"
          placeholder="Reason to unblock rider from dispatch"
          class="form-control"
          :class="{
            'is-invalid': submitted && $v.narrative.$error,
          }"
        />
        <div
          v-if="submitted && !$v.narrative.required"
          class="invalid-feedback"
        >
          Reason is required
        </div>
      </div>
      <div class="col-md-8 unblock-btn">
        <button class="btn btn-primary action-button">
          Unblock
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'UnblockRiderComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted: false,
      narrative: '',
    };
  },
  validations: {
    narrative: { required },
  },
  computed: {
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
      unblock_rider: 'unblock_rider',
    }),

    handleError(status, error) {
      const notification = [];
      let actionClass = '';
      if (!status) {
        notification.push(data.error);
        actionClass = this.display_order_action_notification(status);
        this.updateClass(actionClass);
        this.updateErrors(notification);
      }
    },
    async unblockRider() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const riderID = this.user.rider_id;
      const session_data = this.session.payload.data;

      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'unblock_rider_cc',
        apiKey: true,
        params: {
          rider_id: riderID,
          narrative: this.narrative,
          action_user: session_data.name,
          user_id: session_data.admin_id,
        },
      };
      try {
        const data = await this.unblock_rider(payload);
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
.input-group-area {
  width: 76%;
}
.form-inline .form-control {
  width: 100%;
}
.action-button {
  margin: 13px;
}
.unblock-btn {
  padding-left: 0 !important;
}
</style>
