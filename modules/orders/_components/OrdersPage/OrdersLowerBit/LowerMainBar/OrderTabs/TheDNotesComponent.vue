<template>
  <span>
    <div v-if="typeof DeliverImg === 'undefined' || DeliverImg === null">
      No DNotes found for this delivery
    </div>
    <div v-else>
      <p class="status-paragraph">
        Status:
        <span :class="`color-${status.color}`">{{ status.status }}</span>
      </p>
      <button
        @click="toggle('dnote')"
        v-if="status.state"
        :class="({ opened: opened.includes('dnote') }, button)"
      >
        Update
      </button>
      <div v-if="opened.includes('dnote')">
        <div
          v-if="errors.length > 0"
          :class="`alert alert-${actionClass}`"
          :id="`dnote_response_${orderNo}`"
        >
          <ul>
            <li v-for="error in errors" :key="error.index">
              <b>{{ error }}</b>
            </li>
          </ul>
        </div>
        <form id="cancel-form" @submit.prevent="submitDnote">
          <div class="update-docs">
            <table class="table dnote-table">
              <tr>
                <td>
                  <VueCtkDateTimePicker
                    class="pick-delivery-docs-date form-control"
                    v-model="deliveryDate"
                    formatted="DD-MM-YYYY HH:mm:00"
                    format="DD-MM-YYYY HH:mm:00 "
                    output-format="DD-MM-YYYY HH:mm:00"
                    label="Delivery Date"
                    hint=""
                    :no-header="true"
                    input-size="sm"
                    :class="{
                      'is-invalid': submitted && $v.deliveryDate.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.deliveryDate.required"
                    class="invalid-feedback"
                  >
                    Delivery Date is required
                  </div>
                </td>
                <td>
                  <input
                    id=""
                    v-model="comment"
                    class="delivery-doc-comment form-control"
                    type="text"
                    placeholder="Comment (optional)"
                  />
                </td>

                <td colspan="3">
                  <button class="submit-doc-approval">
                    Submit
                  </button>
                </td>
                <td></td>
                <td></td>
              </tr>
            </table>

            <p class="update-docs__notification"></p>
          </div>
        </form>
      </div>
    </div>
  </span>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheDNotesComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      opened: [],
      deliveryDate: '',
      comment: '',
      submitted: false,
      errors: [],
      actionClass: '',
      DeliverImg: this.order.delivery_details.rider_delivery_image,
    };
  },
  validations: {
    deliveryDate: { required },
  },
  computed: {
    orderNo() {
      return this.order.order_details.order_no;
    },
    button() {
      return 'tab-pane__update-button';
    },
    status() {
      let status = 'Not Delivered';
      let color = 'red';
      let state = true;
      const arr = {};
      const imgStatus = Object.prototype.hasOwnProperty.call(
        this.order.delivery_details,
        'rider_delivery_image',
      );
      if (
        imgStatus &&
        this.order.delivery_details.rider_delivery_image[0]
          .physical_delivery_note_status === 2
      ) {
        status = 'Delivered';
        color = 'green';
        state = false;
      }
      arr.status = status;
      arr.color = color;
      arr.state = state;

      return arr;
    },
  },
  mounted() {
    const arr = [];
    this.updateErrors(arr);
    this.updateClass('');
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    async submitDnote() {
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'approve_d_notes_n_credit_partner',
        apiKey: true,
        params: {
          order_no: this.orderNo,
          tab: 'dnotes',
          comment: this.comment,
        },
      };

      try {
        const data = await this.perform_order_action(payload);
        const msg = data.message;
        const status = data.status;
        this.errors.push(msg);
        this.actionClass = this.display_order_action_notification(status);
      } catch (error) {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        this.actionClass = 'danger';
      }
    },
  },
};
</script>
<style scoped>
.status-paragraph {
  font-size: 15px;
  font-weight: 600;
}
.color-red {
  color: #dc4a38;
}
.color-green {
  color: #51a65b;
}
.tab-pane__update-button {
  width: 90px;
  height: 40px;
  border-radius: 5px;
  background-color: #f57f20;
  color: white;
  font-size: 14px;
  font-weight: 700;
  outline: none;
}
.update-docs {
  padding-top: 30px;
  padding-bottom: 20px;
}
.pick-delivery-docs-date {
  margin-right: 1%;
  height: 45px;
  border-style: solid;
  border-width: 0.2px;
  border-color: #cccccc;
  padding-left: 0;
}
.delivery-doc-comment {
  /* width: 25%; */
  margin-right: 1%;
  height: 36px;
  padding-left: 15px;
  margin-top: 6px;
}
.submit-doc-approval {
  width: 100%;
  margin-right: 1%;
  height: 45px;
  background: #3c8dbc;
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: 5px;
}
.header-picker[data-v-6d49f11d] {
  display: none !important;
}
datepicker-controls {
  background: #3c8dbc !important;
}
.dnote-table tr:hover {
  background: none !important;
}
.dnote-table td {
  border: none;
}
.header-picker {
  padding: 0 !important;
  background-color: #fff !important;
  display: none !important;
}
.datetimepicker .datepicker {
  min-width: 372px !important;
  width: 376px !important;
}
</style>
