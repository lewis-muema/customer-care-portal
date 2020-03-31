<template>
  <div>
    <form
      id="reallocate-form"
      @submit.prevent="submitPayment"
      class="form-inline"
    >
      <div class="form-group col-md-6 bill-div user-input">
        <label>Amount</label>
        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ user.default_currency }}</span>
          </div>
          <div class="input-group-area">
            <input
              type="text"
              v-model="amount"
              name="amount"
              placeholder="Amount"
              class="form-control"
            />
          </div>
          <div v-if="submitted && !$v.amount.required" class="invalid-feedback">
            Amount is required
          </div>
        </div>
      </div>
      <div class="form-group col-md-6 user-input">
        <label class="bill">Business Units</label>
        <v-select
          :options="businessUnits"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select Business Unit"
          class="form-control select user-billing"
          :id="`billing_types`"
          v-model="businessUnit"
          :class="{
            'is-invalid': submitted && $v.businessUnit.$error,
          }"
        >
        </v-select>
        <div
          v-if="submitted && !$v.businessUnit.required"
          class="invalid-feedback"
        >
          Business Unit is required
        </div>
      </div>
      <div class="form-group col-md-6">
        <label class="bill">Other Notes</label>
        <input
          type="text"
          v-model="narrative"
          :id="narrative"
          name="narrative"
          placeholder="Narrative"
          class="form-control bill-input"
          :class="{
            'is-invalid': submitted && $v.narrative.$error,
          }"
        />
        <div
          v-if="submitted && !$v.narrative.required"
          class="invalid-feedback"
        >
          Narrative is required
        </div>
      </div>

      <div class="form-group col-md-6 user-input">
        <label class="bill">Payment Method</label>
        <v-select
          :options="sendyEntities"
          :reduce="name => name.value"
          name="name"
          label="name"
          placeholder="Select Sendy Entity"
          class="form-control select user-billing"
          :id="`sendy_entities`"
          v-model="sendyEntity"
        >
        </v-select>
      </div>

      <button
        class="btn btn-primary action-button"
        :disabled="checkSubmitStatus()"
      >
        Pay
      </button>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TopUpComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amount: '',
      narrative: '',
      submitted: false,
      account: '',
      ischecked: false,
      clientNo: '',
      businessUnit: '',
      refNo: '',
      peer: null,
      hide: '',
      businessUnits: [
        { value: 1, name: 'Merchant Business Units - MBU' },
        { value: 2, name: 'Enterprise Business Units - EBU' },
        { value: 3, name: 'Freight Business Units - FBU' },
      ],
      sendyEntities: [{ value: 1, name: 'Sendy Entity' }],
      sendyEntity: 1,
      submit_status: false,
    };
  },
  validations: {
    amount: { required },
    narrative: { required },
    businessUnit: { required },
  },

  computed: {
    actionUser() {
      return this.session.payload.data.name;
    },
    transactionID() {
      const arr = this.billingTypes;
      const index = arr
        .map(c => {
          return c.value;
        })
        .indexOf(this.billingType);
      const selectedType = arr[index];
      return typeof selectedType !== 'undefined'
        ? selectedType.transactionID
        : '';
    },
    client() {
      return this.isPeer();
    },
  },

  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      request_payment_methods: 'request_payment_methods',
      perform_user_action: 'perform_user_action',
    }),
    isPeer() {
      if (this.clientNo.length > 5) {
        if (this.clientNo.includes('sendy')) {
          this.peer = false;
          return this.peer;
        } else {
          this.peer = true;
          return this.peer;
        }
      }
    },
    async submitPayment() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const riderID = this.user.rider_id;
      const riderCurrency = this.user.default_currency;

      const payload = {
        app: 'PARTNERS_APP',
        endpoint: 'sendy/rt_actions',
        apiKey: true,
        params: {
          channel: 'rider_team',
          data_set: 'rt_actions',
          action_id: 10,
          action_data: {
            rider_id: riderID,
            entity_id: 1,
            business_unit: this.businessUnit,
            amount: this.amount,
            narrative: this.narrative,
            currency: riderCurrency,
            action_user: this.actionUser,
          },
          request_id: 202,
          action_user: this.actionUser,
        },
      };

      this.submit_status = true;

      setTimeout(() => {
        this.submit_status = false;
      }, 5000);

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
    checkSubmitStatus() {
      return this.submit_status;
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
.bill {
  width: 100%;
  margin-left: -15px;
}
.bill-check {
  margin: 15px 0 15px -13px;
}
.charge_commission--label {
  margin: 0 4px 0;
}
.bill-div {
  padding-left: 0;
}
.input-group-area {
  width: 80%;
  border-radius: 0 0.25rem 0.25rem 0;
}
.form-inline label {
  align-items: center;
  justify-content: left;
  margin-bottom: 0;
  font-size: small;
}
.bill-input {
  margin-left: -15px;
}
.select {
  margin-left: -15px;
  padding: 0;
  width: 95%;
}
.display-input {
  margin-left: 14px;
}
.user-input {
  margin-bottom: 15px;
}
.search-invalid {
  /* display: none; */
  width: 100%;
  margin-top: 0.25rem;
  font-size: 46%;
  color: #dc3545;
}
.invalid-feedback {
  border: none;
}
</style>
