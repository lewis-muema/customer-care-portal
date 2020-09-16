<template>
  <div class="row col-md-12">
    <div class="reversal-choice col-md-6">
      <h3>Select Busines Unit</h3>
      <div
        class="form-group type-group"
        :class="{
          'active-sub-category': businessUnit === sub.business_unit_id,
        }"
        v-for="(sub, i) in businessUnits"
        :key="i"
      >
        <input
          type="radio"
          :id="sub.business_unit_id"
          name="method"
          :value="sub.business_unit_id"
          class="options-radio"
          v-model="businessUnit"
        />
        <label :for="sub.business_unit_id" class="option-label"
          >{{ sub.name }} ({{ sub.abbr }})</label
        >
      </div>
      <div
        v-if="
          categoryDetails.name === 'credit-note' &&
            submitted &&
            businessUnit === ''
        "
        class="group-error empty-results"
      >
        Business Unit is required
      </div>
    </div>
    <div class="reversal-choice col-md-6 reversal-inputs">
      <div class="form-group methods-holder">
        <label>Amount</label>

        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ currency }}</span>
          </div>
          <div class="input-group-area amount-input">
            <input
              type="number"
              v-model="amount"
              :id="`amount`"
              name="amount"
              placeholder="Amount"
              class="form-control"
            />
          </div>
          <div
            v-if="
              categoryDetails.name === 'credit-note' &&
                submitted &&
                amount === ''
            "
            class="group-error empty-results"
          >
            Amount is required
          </div>
        </div>
      </div>
      <div class="form-group methods-holder">
        <label>Other Notes</label>
        <input
          type="text"
          v-model="narrative"
          :id="narrative"
          name="narrative"
          placeholder="Notes"
          class="form-control narrative-input"
        />
        <div
          v-if="
            categoryDetails.name === 'credit-note' &&
              submitted &&
              narrative === ''
          "
          class="group-error empty-results"
        >
          Payment Narrative is required
        </div>
      </div>
      <span>
        <button
          :disabled="disabled || reversing"
          class="btn btn-primary action-button reversal-button pull-right"
          @click="emit_reversal()"
        >
          Submit Reversal
          <i v-if="reversing" class="fa fa-spinner fa-spin loader"></i>
        </button>
      </span>
    </div>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TheCreditNotesComponent',
  props: [
    'businessUnits',
    'currency',
    'categoryDetails',
    'userID',
    'userType',
    'user',
  ],
  data() {
    return {
      businessUnit: '',
      submitted: false,
      amount: '',
      narrative: '',
      reversing: false,
    };
  },
  computed: {
    disabled() {
      return (
        this.businessUnit === '' || this.narrative === '' || this.amount === ''
      );
    },
  },
  methods: {
    emit_reversal() {
      this.submitted = true;
      const data = {
        reversalCategory: 'credit-note',
        currency: this.currency,
        reversalAmount: this.amount,
        narrative: this.narrative,
        businessUnit: this.businessUnit,
      };
      if (this.userType === 'biz') {
        const vat_exempt = this.user.cop_details.vat_exempt;
        data.vat_exempt = vat_exempt ? 1 : 0;
      }
      this.$emit('creditNoteData', data);
    },
  },
};
</script>
<style scoped>
@import '@/assets/style/reversal.css';
</style>
