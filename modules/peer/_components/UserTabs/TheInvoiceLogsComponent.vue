<template>
  <div class="body-box">
    <div v-if="fetch_invoice_logs === true">
      <p>
        Fetching Invoice Logs ...
        <i class="fa fa-spinner fa-spin loader"></i>
      </p>
    </div>
    <div v-else-if="fetch_invoice_logs === 'fail'">
      <p>
        Failed to retrieve Invoice Logs . Kindly retry again.
      </p>
    </div>
    <div v-else-if="fetch_invoice_logs === 'no_data'">
      <p>
        No Invoice Logs
      </p>
    </div>
    <div v-else>
      <table
        class="table table-bordered"
        :id="`business_statement_table_${user}`"
        v-if="invoice.length > 0"
      >
        <thead>
          <tr>
            <td></td>
            <td>Invoice Number</td>
            <td>Date</td>
            <td>Amount</td>
            <td>Invoice Link</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, key) in invoice" :key="key">
            <td>{{ key + 1 }}</td>
            <td>{{ invoice.invoice_number }}</td>
            <td>
              {{
                getFormattedDate(invoice.invoice_date, 'DD/MM/YYYY hh.mm a ')
              }}
            </td>
            <td>{{ currency }} {{ invoice.invoice_amount }}</td>

            <td>
              <a :href="`${invoice.signed_file_url}`">
                Download Invoice
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheInvoiceLogsComponent',
  props: {
    user: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fetch_invoice_logs: true,
      invoice: [],
    };
  },
  mounted() {
    this.fetchInvoiceLogs();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      request_invoice_logs: 'request_invoice_logs',
    }),

    async fetchInvoiceLogs() {
      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'sendy/invoice_logs',
        apiKey: true,
        params: {
          individualType: 'peer',
          individualId: this.user,
        },
      };
      try {
        const res = await this.request_invoice_logs(payload);
        const error = !this.status ? res.error : '';

        if (!res.data.length > 0) {
          this.fetch_invoice_logs = 'no_data';
        } else {
          this.fetch_invoice_logs = false;
        }

        return (this.invoice = res.data);
      } catch (error) {
        this.fetch_invoice_logs = 'fail';
      }
    },
  },
};
</script>
