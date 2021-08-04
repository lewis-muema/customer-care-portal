<template>
  <div class="box-body">
    <span :class="determineClass(this.dispute_status)">
      {{ determineMsg(this.dispute_status) }}
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
              paymentDetails.waiting_time_amount,
            )
          "
        ></td>
      </tr>
    </table>

    <el-button
      v-if="showDisputeButton"
      @click="activate_dispute_content(moreData)"
      class="dispute-btn"
      type="primary"
      size="medium"
      plain
    >
      Dispute Extra Charges
    </el-button>

    <el-dialog
      title="Dispute Extra Charges"
      :visible.sync="showDisputeDialog"
      width="30%"
    >
      <dispute-extra-charges
        :dispute-data="disputeData"
        @closeDisputeDialog="closeDisputeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import DisputeExtraCharges from './DisputeExtraChargesForm';

export default {
  name: 'TheDisputeComponent',
  components: { DisputeExtraCharges },
  props: {
    order: {
      type: Object,
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
      showDisputeDialog: false,
      disputeData: {},
    };
  },
  computed: {
    showDisputeButton() {
      return (
        this.paymentDetails.extra_distance_amount > 0 ||
        this.paymentDetails.waiting_time_amount > 0
      );
    },
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
    closeDisputeDialog(value) {
      this.showDisputeDialog = value;
    },
    activate_dispute_content(moreData) {
      this.showDisputeDialog = true;
      console.log('...', this.order);
      const { name, email, phone_no } = this.orderDetails.client_details;
      this.disputeData = {
        order_no: moreData.order_no,
        name,
        email,
        phone: phone_no,
      };
    },
  },
};
</script>

<style>
.dispute-btn {
  margin-top: 10px;
}
</style>
