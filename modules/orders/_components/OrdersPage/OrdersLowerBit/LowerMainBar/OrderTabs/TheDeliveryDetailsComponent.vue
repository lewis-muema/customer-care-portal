<template>
  <span>
    <div
      v-if="typeof riderDeliverImg === 'undefined' || riderDeliverImg === null"
    >
      No docs found for this delivery
    </div>
    <div v-else>
      <div
        class="delivery-images table"
        v-for="img in riderDeliverImg"
        :key="img.index"
      >
        <div class="delivery-images__header">
          {{ ` Delivery Point 1 at ${img.waypoint_no} at ` }}
        </div>
        {{ `${customConfig.RIDER_DELIVERY_IMG}${img.img}` }}
        <div class="delivery-images__signature">
          <h3>Signatures</h3>
          <div class="images">
            <img
              @click="
                lightbox.openImage(
                  `${customConfig.RIDER_DELIVERY_IMG}${img.img}`,
                )
              "
              :src="`${customConfig.RIDER_DELIVERY_IMG}${img.img}`"
            />
          </div>
          <small style="display: block;">By: {{ img.name }}</small>
        </div>
        *******FIX THIS*****
      </div>
      <div :id="`response_${orderDetails.order_details.order_no}a_11b`"></div>
      <div class="row">
        <div
          class="col-sm-3"
          v-if="orderDetails.order_details.dispute_delivery_doc_status === 2"
        >
          <div class="form-group">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_<?php echo $unique_order_id;?>"
                  id="delivery_docs_action2_<?php echo $unique_order_id;?>"
                  checked
                  value="3"
                  type="radio"
                />
                Reject Customer Dispute
              </label>
            </div>
          </div>
        </div>
        <div class="col-sm-3" v-else>
          <div class="form-group">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_<?php echo $unique_order_id;?>"
                  id="delivery_docs_action2_<?php echo $unique_order_id;?>"
                  onchange="update_delivery_docs_dispute_action('<?php echo $unique_order_id;?>')"
                  checked
                  value="2"
                  type="radio"
                />
                Reject Driver Appeal
              </label>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="form-group">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_<?php echo $unique_order_id;?>"
                  id="delivery_docs_action1_<?php echo $unique_order_id;?>"
                  value="1"
                  type="radio"
                  onchange="update_delivery_docs_dispute_action('<?php echo $unique_order_id;?>')"
                />
                Accept Driver Appeal
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'TheDeliveryDetailsComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order,
      riderDeliverImg: this.order.rider_deliver_img,
    };
  },
  computed: {
    ...mapState(['customConfig']),
  },
  mounted() {
    console.log('rider delibv', this.customConfig);
  },
};
// rider_deliver_img
</script>
