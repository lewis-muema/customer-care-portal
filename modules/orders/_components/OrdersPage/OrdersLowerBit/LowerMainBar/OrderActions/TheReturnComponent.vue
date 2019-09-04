<template>
  <div>
    <div :id="`response_${orderNo}_return`"></div>

    <table class="table table-bordered">
      <tbody>
        <tr>
          <td>One way:</td>
          <td>
            sdfsdfsd
          </td>
        </tr>
        <tr>
          <td>Return:</td>
          <td>
            2343543
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="
        moreData.errand_mode === 'one_way' && paymentDetails.cash_status === 1
      "
    >
      <p>
        Advice the user to place another order. <br />
        Making a cash order return from the customer care is
        <strong>currently</strong> not supported.
      </p>
    </div>
    <div
      v-if="
        moreData.errand_mode === 'one_way' && paymentDetails.cash_status !== 1
      "
    >
      <button
        class="btn btn-primary"
        onclick=" return_delivery('<?php echo $unique_order_id;?>'); record_response_global('<?php echo $unique_order_id;?>','6');"
      >
        <span class="glyphicon glyphicon-retweet"></span> Set as return
      </button>
    </div>
    <div v-if="moreData.errand_mode === 'return'">
      <p>
        Order Already set as Return
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheReturnComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderNo: this.order.order_details.order_no,
      paymentDetails: this.order.payment_details,
      moreData: this.order.order_details,
    };
  },
};
</script>
