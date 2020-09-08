<template>
  <div>
    <div v-if="typeDetails.name === 'partial-invoice'">
      <div class="form-group col-md-12 methods-holder">
        <label>Invoice Reversal type</label>
        <v-select
          :options="types"
          :reduce="status => status.code"
          name="status"
          label="status"
          class="form-control select"
          placeholder="Please select"
          :id="`status`"
          v-model="InvoiceReversaltype"
        >
        </v-select>
        <div
          v-if="submitted && InvoiceReversaltype === ''"
          class="group-error empty-results"
        >
          Invoice Reversal type is required
        </div>
      </div>
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
              :id="`amount`"
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
    <div velse>
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
              :id="`amount`"
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
  props: ['invoiceDetails', 'typeDetails', 'currency', 'userID', 'userType'],
  data() {
    return {
      amountTypes: [
        {
          code: 'VAT',
          title: 'VAT (Value Added Tax)',
        },
        {
          code: 'other-amount',
          title: 'Other Invoice charge',
        },
      ],
      types: [
        { code: 'VAT', status: 'VAT (Value Added Tax)' },
        { code: 'other-amount', status: 'Other Invoice charge' },
      ],
      InvoiceReversaltype: '',
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
      console.log('this.reversalCategory', this.reversalCategory);
      return this.InvoiceReversaltype === 'VAT'
        ? this.reversalAmount === '' ||
            this.newInvoiceAmount === '' ||
            this.InvoiceReversaltype === '' ||
            this.narrative === ''
        : this.reversalAmount === '' || this.narrative === '';
    },
  },
  watch: {
    reversalAmount(amount) {
      this.newInvoiceAmount =
        this.InvoiceReversaltype === 'VAT'
          ? this.invoiceDetails.invoice_amount - this.invoiceDetails.vat_amount
          : this.invoiceDetails.invoice_amount - this.reversalAmount;
      this.newInvoiceAmount = amount === '' ? '' : this.newInvoiceAmount;
    },
    InvoiceReversaltype(data) {
      this.reversalAmount =
        data === 'VAT' ? this.invoiceDetails.vat_amount : '';
      this.newInvoiceAmount =
        data === 'VAT'
          ? this.invoiceDetails.invoice_amount - this.invoiceDetails.vat_amount
          : '';
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
        invoiceReversaltype: this.InvoiceReversaltype,
        reversalAmount: this.reversalAmount,
        newInvoiceAmount: this.newInvoiceAmount,
        narrative: this.narrative,
        reversalID: this.typeDetails.id,
      });
    },
  },
};
</script>
<style scoped>
@import '@/assets/style/reversal.css';
</style>
