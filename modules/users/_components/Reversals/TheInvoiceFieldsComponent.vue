<template>
  <div>
    <div v-if="typeDetails.name === 'partial-invoice'">
      <div class="form-group methods-holder">
        <label>Amount</label>

        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ currency }}</span>
          </div>
          <div class="input-group-area amount-input">
            <input
              type="text"
              v-model="reversalAmount"
              name="amount"
              placeholder="Amount"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="form-group methods-holder">
        <label>New Invoice Amount</label>

        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ currency }}</span>
          </div>
          <div class="input-group-area amount-input">
            <input
              type="text"
              v-model="newInvoiceAmount"
              name="amount"
              placeholder="Amount"
              class="form-control"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form-group methods-holder">
        <label>Invoice Total</label>

        <div class="input-group">
          <div class="input-group-icon">
            <span> {{ currency }}</span>
          </div>
          <div class="input-group-area amount-input">
            <input
              type="text"
              v-model="reversalAmount"
              name="amount"
              placeholder="Amount"
              class="form-control"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="form-group methods-holder">
        <label>Narration</label>
        <input
          type="text"
          v-model="narrative"
          name="narrative"
          placeholder="Enter text"
          class="form-control narrative-input"
        />
      </div>
    </div>
    <span v-if="typeDetails.name !== ''">
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
</template>
<script>
export default {
  name: 'TheInvoiceFieldsComponent',
  props: [
    'invoiceDetails',
    'typeDetails',
    'currency',
    'userID',
    'userType',
    'referenceNumber',
  ],
  data() {
    return {
      submitted: false,
      vat_amount: '',
      reversalAmount: '',
      newInvoiceAmount: '',
      narrative: '',
      reversing: false,
    };
  },
  computed: {
    disabled() {
      return (
        this.reversalAmount === '' ||
        this.newInvoiceAmount === '' ||
        this.narrative === ''
      );
    },
  },
  watch: {
    reversalAmount(amount) {
      this.newInvoiceAmount =
        amount === ''
          ? ''
          : this.invoiceDetails.invoice_amount - this.reversalAmount;
    },
  },
  mounted() {
    this.reversalAmount =
      this.typeDetails.name === 'full-invoice'
        ? this.invoiceDetails.invoice_amount
        : '';
  },
  methods: {
    emit_reversal() {
      this.$emit('invoiceReversalData', {
        reversalCategory: 'invoice-reversal',
        reversalType: this.typeDetails.name,
        currency: this.currency,
        reversalAmount: parseFloat(this.reversalAmount),
        newInvoiceAmount: this.newInvoiceAmount,
        narrative: this.narrative,
        reversalID: this.typeDetails.id,
        invoiceNumber: this.referenceNumber,
        vatRate: this.invoiceDetails.vat_rate,
      });
    },
  },
};
</script>
<style scoped>
@import '@/assets/style/reversal.css';
.input-group-area {
  width: 92%;
}
</style>
