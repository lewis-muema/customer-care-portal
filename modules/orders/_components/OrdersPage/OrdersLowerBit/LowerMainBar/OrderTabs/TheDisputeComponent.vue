<template>
  <div class="box-body">
    <span :class="determineClass(dispute_status)">
      {{ determineMsg(dispute_status) }}
    </span>
    <span
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
    </span>
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

    !!!!!! FIX ME !!!! Finish Dispute ++ add rights
  </div>
</template>

<script>
export default {
  name: 'TheDisputeComponent',
  props: {
    orderdetails: {
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
      orderDetails: this.orderdetails,
      moreData: this.orderdetails.order_details,
      paymentDetails: this.orderdetails.payment_details,
      dispute_status: this.orderdetails.order_details.dispute_status,
      disputeParams: {
        0: { class: 'badge bg-green pull-left', msg: 'Not disputed' },
        1: { class: 'badge bg-red pull-left', msg: 'Not Resolved' },
        2: { class: 'badge bg-aqua pull-left', msg: 'Disputed and resolved' },
      },
    };
  },
  methods: {
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
