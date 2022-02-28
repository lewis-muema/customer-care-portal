<template>
  <div>
    <div class="fulfillment-tab-info-top">
      <div class="fulfillment-tab-info-recipient">
        <div>
          <div
            class="fulfillment-tab-info-description"
            v-if="
              orderDetail.payment_details.payment_status ===
                'PAYMENT_SUCCESS' ||
                orderDetail.payment_details.payment_status === 'PAYMENT_FAIL' ||
                orderDetail.payment_details.payment_status ===
                  'PAYMENT_FAILED_CHARGE_ATTEMPT'
            "
          >
            <div class="mc-seller-payment-details-header">
              Total amount:
            </div>
            <div>
              {{ orderDetail.order_items.currency }}
              {{ orderDetail.order_items.total }}
            </div>
          </div>
          <div
            class="fulfillment-tab-info-description"
            v-if="
              orderDetail.payment_details.payment_status ===
                'PAYMENT_PENDING_CHARGE_CONFIRMATION' ||
                orderDetail.payment_details.payment_status ===
                  'PAYMENT_PENDING_CHARGE_ATTEMPT'
            "
          >
            <div class="mc-seller-payment-details-header">
              Total amount to be paid:
            </div>
            <div>
              {{ orderDetail.payment_details.currency }}
              {{ orderDetail.payment_details.total_amount }}
            </div>
          </div>
          <div class="fulfillment-tab-info-description">
            <div class="mc-seller-payment-details-header">
              Payment option:
            </div>
            <div>
              {{
                orderDetail.payment_details.payment_status === ''
                  ? 'N/A'
                  : orderDetail.payment_details.payment_status
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PaymentDetails',
  data() {
    return {
      orderDetail: {},
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.orderDetail = this.getTableDetails;
  },
  methods: {},
};
</script>

<style></style>
