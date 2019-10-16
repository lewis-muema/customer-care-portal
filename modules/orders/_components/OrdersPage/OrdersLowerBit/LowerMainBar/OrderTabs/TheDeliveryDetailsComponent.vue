<template>
  <span>
    <div v-if="typeof riderDeliverImg.length > 0">
      No docs found for this delivery
    </div>
    <div v-else>
      <div
        class="delivery-images table"
        v-for="img in riderDeliverImg"
        :key="img.index"
      >
        <div class="delivery-images__header">
          {{ ` Delivery at waypoint ${img.waypoint_no} ` }}
        </div>
        <div class="delivery-images__signature">
          <h3>Signatures</h3>
          <div class="images">
            <img
              class="signatures"
              @click="
                lightbox.openImage(
                  `https://sendy-delivery-signatures.s3.amazonaws.com/${img.img}`,
                )
              "
              :src="
                  `https://sendy-delivery-signatures.s3.amazonaws.com/${img.img}`,              
              "
            />
          </div>
          <small style="display: block;">By: {{ img.name }}</small>
        </div>
        <div class="delivery-images__signature">
          <h3>Delivery Notes</h3>
          <div
            class="images"
            v-for="image in img.delivery_image"
            :key="image.index"
          >
            <img
              class="delivery-images"
              @click="
                lightbox.openImage(
                  `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${image.images}`,
                )
              "
              :src="
                  `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${image.images}`,              
              "
            />
          </div>
          <small style="display: block;">By: {{ img.name }}</small>
        </div>
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
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action2_${orderNo}"
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
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action2_${orderNo}"
                  onchange="update_delivery_docs_dispute_action('${orderNo}')"
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
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action1_${orderNo}"
                  value="1"
                  type="radio"
                  onchange="update_delivery_docs_dispute_action('${orderNo}')"
                />
                Accept Driver Appeal
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <form id="dispute-form" @submit.prevent="disputeOrder">
          <div class="form-group">
            <v-select
              :options="options"
              :reduce="reason => reason.code"
              name="reason"
              label="reason"
              placeholder="Select dispute reason .."
              class="form-control proximity-point"
              :id="`dispute_reason_${orderNo}`"
              v-model="reason"
              :class="{
                'is-invalid': submitted && $v.reason.$error,
              }"
            >
            </v-select>
            <div
              v-if="submitted && !$v.reason.required"
              class="invalid-feedback"
            >
              dispute reason is required
            </div>
          </div>
          <div class="form-group">
            <textarea
              type="text"
              v-model="description"
              :id="`dispute_description_${orderNo}`"
              name="description"
              placeholder="Description"
              class="form-control"
              :class="{
                'is-invalid': submitted && $v.description.$error,
              }"
            >
            </textarea>
            <div
              v-if="submitted && !$v.description.required"
              class="invalid-feedback"
            >
              Description is required
            </div>
          </div>
          <button class="btn btn-primary action-button">
            submit
          </button>
        </form>
      </div>
    </div>
  </span>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

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
      orderNo: this.order.order_details.order_no,
      riderDeliverImg: this.order.delivery_details.rider_delivery_image,
      riderID: this.order.rider_details.rider_id,
      errors: [],
      notifications: '',
      options: [
        { code: '1', reason: 'A delivery document is missing' },
        { code: '2', reason: 'The delivery document is not clear' },
        { code: '3', reason: 'The delivery document is not valid' },
      ],
      reason: '',
      description: '',
      submitted: false,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['config']),

    ...mapState(['userData']),
  },
  methods: {
    test() {
      console.log('this is the image data', this.order);
    },
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    async disputeOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispute_delivery_docs_cc',
        apiKey: true,
        params: {
          admin_id: 0,
          cop_name: this.order.client_details.corporate_name,
          customer_email: this.order.client_details.email,
          customer_name: this.order.client_details.name,
          customer_phone: this.order.client_details.phone_no,
          action_id: 22,
          channel: 'customer_support',
          data_set: 'cc_actions',
          description: this.description,
          dispute_delivery_doc_status: 2,
          dispute_docs_reason_id: this.reason,
          order_no: this.orderNo,
          rider_id: this.riderID,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification.push(data.reason);
        actionClass = this.display_order_action_notification(data.status);
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>
<style>
.delivery-images {
  max-width: 300px;
}
.signatures {
  max-width: 300px;
}
</style>
