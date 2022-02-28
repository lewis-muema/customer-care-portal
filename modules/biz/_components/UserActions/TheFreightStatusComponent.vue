<template>
  <div class="row">
    <form
      id="reallocate-form"
      @submit.prevent="update_biz_approval"
      class="form-inline freight-approval-inline"
    >
      <div class="form-group col-md-6 user-input">
        <v-select
          :options="approval_state"
          :reduce="name => name.code"
          name="name"
          label="name"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`approval_value`"
          v-model="approval_value"
          :class="{
            'is-invalid': submitted && $v.approval_value.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.approval_value.required"
          class="invalid-feedback"
        >
          Approval value is required
        </div>
      </div>

      <div class="form-group  col-md-12 config-submit">
        <button class="btn btn-primary action-button" :disabled="loading">
          Process
          <span v-if="loading">
            <i class="fa fa-spinner fa-spin loader"></i
          ></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheFreightStatusComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      vatCompliance: false,
      submitted: false,
      approval_state: [
        { code: 2, name: 'Activate' },
        { code: 3, name: 'Deactivate' },
      ],
      approval_value: '',
      loading: false,
    };
  },

  validations: {
    approval_value: { required },
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      update_freight_status: 'update_freight_status',
    }),
    // eslint-disable-next-line require-await
    async update_biz_approval() {
      const notification = [];
      let actionClass = '';
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = {
        app: 'ADONIS_API',
        endpoint: 'freight-status',
        apiKey: false,
        params: {
          freightStatus: this.approval_value,
          copId: this.user.user_details.cop_id,
        },
      };
      this.loading = true;
      try {
        const data = await this.update_freight_status(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
        this.loading = false;
        if (data.status) {
          this.updateSuccess(true);
        }
      } catch (error) {
        this.loading = false;
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
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
.user-input {
  margin-bottom: 15px;
}
.form-inline {
  margin-left: 2%;
}
.freight-approval-inline {
  width: 83% !important;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
</style>
