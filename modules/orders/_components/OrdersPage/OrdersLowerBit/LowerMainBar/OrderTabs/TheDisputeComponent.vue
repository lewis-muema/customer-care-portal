<template>
  <div class="box-body">
    <span :class="determineClass(this.dispute_status)">
      {{ determineMsg(this.dispute_status) }}
    </span>
    <!-- <span
      v-if="
        paymentDetails.extra_distance_amount > 0 ||
          paymentDetails.waiting_time_amount > 0
      "
    >
      <span
        @click="activate_dispute_content(moreData.order_no)"
        class="badge bg-green pull-left"
        style="margin-left:2px;background-color:#3c8dbc;cursor:pointer;"
      >
        Dispute
      </span>
    </span> -->
    <br />
    <br />
    <table class="table table-bordered">
      <tr>
        <td width="50%">Extra distance amount</td>
        <td
          v-html="
            display_conditional_amounts(
              orderDetails,
              rates,
              paymentDetails.extra_distance_amount,
            )
          "
        ></td>
      </tr>
      <tr></tr>

      <tr>
        <td>Waiting time amount</td>
        <td
          v-html="
            display_conditional_amounts(
              orderDetails,
              rates,
              paymentDetails.waiting_time_amount,
            )
          "
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'TheDisputeComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
      moreData: this.order.order_details,
      paymentDetails: this.order.payment_details,
      dispute_status: this.order.order_details.dispute_status,
      errors: [],
      notifications: '',
      disputeParams: {
        0: { class: 'badge bg-green pull-left', msg: 'Not disputed' },
        1: { class: 'badge bg-green pull-left', msg: 'Verified' },
        2: { class: 'badge bg-red pull-left', msg: 'Disputed ' },
        3: { class: 'badge bg-aqua pull-left', msg: 'Appealed' },
        4: { class: 'badge bg-aqua pull-left', msg: 'Disputed and resolved' },
      },
    };
  },
  mounted() {
    const notification = [];
    const actionClass = '';
    this.updateClass(actionClass);
    this.updateErrors(notification);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    determineClass(disputeStatus) {
      const disputeClass = this.disputeParams[disputeStatus];
      return disputeClass.class;
    },
    determineMsg(disputeStatus) {
      const disputeClass = this.disputeParams[disputeStatus];
      return disputeClass.msg;
    },
  },
};
</script>
