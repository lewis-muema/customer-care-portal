<template>
  <form id="reallocate-form" @submit.prevent="bill" class="form-inline">
    <div :class="`col-md-6 user-search`">
      <TheSearchRiderComponent @riderID="searchedRider" :category="category" />
    </div>
    <div class="form-group col-md-6 bill-div">
      <div class="input-group">
        <div class="input-group-icon">
          <span> {{ currency }}</span>
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
    <div class="form-group  col-md-6">
      <input
        type="text"
        v-model="refNo"
        name="refNo"
        placeholder="Ref No"
        class="form-control bill"
        :class="{
          'is-invalid': submitted && $v.refNo.$error,
        }"
      />
      <div v-if="submitted && !$v.refNo.required" class="invalid-feedback">
        Reference No is required
      </div>
    </div>
    <div class="form-group col-md-6">
      <input
        type="text"
        v-model="narrative"
        name="narrative"
        placeholder="Narrative"
        class="form-control bill"
        :class="{
          'is-invalid': submitted && $v.narrative.$error,
        }"
      />
      <div v-if="submitted && !$v.narrative.required" class="invalid-feedback">
        Narrative is required
      </div>
    </div>
    <div class="form-group col-md-12 bill-check">
      <input
        value="1"
        name="charge_biz_commission"
        id="charge_biz_commission>"
        type="checkbox"
        class=""
        @click="check($event)"
        v-model="checked"
        checked
      />
      <label for="" class="charge_commission--label">Charge Commission</label>
    </div>
    <button class="btn btn-primary action-button">
      Process
    </button>
  </form>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheBillingComponent',
  components: {
    TheSearchRiderComponent: () => import('./TheSearchRiderComponent'),
  },
  extends: VueTypeahead,

  props: {
    user: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentUser: 'rider',
      rider: 0,
      amount: '',
      narrative: '',
      checked: true,
      refNo: '',
      limit: 5,
      minChars: 1,
      submitted: false,
      query: '',
      category: 'billing',
      solr: {
        riders: 'RIDER_SEARCH',
      },
    };
  },
  validations: {
    amount: { required },
    refNo: { required },
    narrative: { required },
  },
  computed: {
    ...mapState(['config']),

    actionUser() {
      return this.session.payload.data.name;
    },
    query_string() {
      localStorage.setItem('query', this.query);
      return this.query;
    },
    isProduction() {
      return this.$env.APP_ENV !== 'production';
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = 'riders';
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    solarToken() {
      return this.$env.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(rider_name:*${this.query_string}*+OR+email:*${this.query_string}*+OR+phone_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
    copID() {
      return this.user.user_details.cop_id;
    },
    actionID() {
      return this.rider > 0 ? 14 : 13;
    },
    requestID() {
      return this.rider > 0 ? 1611 : 110;
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
    check(e) {
      if (e.target.checked) {
        return (this.checked = e.target.value);
      }
    },
    searchedRider(riderID) {
      return (this.rider = riderID);
    },

    async bill() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const notification = [];
      let actionClass = '';

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/cc_actions',
        apiKey: true,
        params: {
          channel: 'customer_support_peer_biz',
          data_set: 'cc_actions',
          action_id: this.actionID,
          action_data: {
            amount: this.amount,
            ref_no: this.refNo,
            cop_id: this.copID,
            user_id: 0,
            narrative: this.narrative,
            currency: this.currency,
            deduct_commission: this.checked,
          },
          request_id: this.requestID,
          action_user: this.actionUser,
        },
      };
      if (this.rider > 0) {
        payload.params.action_data.rider_id = this.rider;
      }
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
  margin: 25px -15px 0 -15px;
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
</style>
