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
          {{ ` Delivery at waypoint ${img.waypoint_no} ` }}
        </div>
        <div class="delivery-images__signature">
          <h3>Signature</h3>
          <div class="images">
            <img
              class="signatures"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              :src="
                  `https://sendy-delivery-signatures.s3.amazonaws.com/${img.signature}`,              
              "
            />
          </div>
          <small> Order Signed By: </small>
          <span class="signature">{{ img.name }}</span>
          <small> Phone Number: </small>
          <span class="signature">{{ img.phone_no }}</span>
        </div>
        <div class="delivery-images__signature">
          <h3>Delivery Notes</h3>
          <div class="images" v-for="image in img.images" :key="image.index">
            <img
              class="delivery-images"
              data-toggle="modal"
              data-target="#ModalCenter"
              :src="
                  `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${image}`,              
              "
            />
          </div>
        </div>
        <div
          class="modal fade"
          id="exampleModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Signature
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="modalimages">
                  <img
                    class="modalimages"
                    :src="
                  `https://sendy-delivery-signatures.s3.amazonaws.com/${img.signature}`,              
              "
                  />
                </div>
                <small> Order Signed By: </small>
                <span class="signature">{{ img.name }}</span>
                <small> Phone Number: </small>
                <span class="signature">{{ img.phone_no }}</span>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="ModalCenter"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="ModalLongTitle">
                  Delivery Notes
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div
                  class="modalimages"
                  v-for="image in img.images"
                  :key="image.index"
                >
                  <img
                    class="modalimages"
                    :src="
                  `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${image}`,              
              "
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :id="`response_${orderDetails.order_details.order_no}a_11b`"></div>
      <div class="row">
        <div
          class="col-sm-3"
          v-if="
            (dispute_status === 0 || dispute_status === 1) && dispute_status < 4
          "
        >
          <div class="form-group">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action2_${orderNo}"
                  @change="update_delivery_docs_dispute_action(switched)"
                  checked
                  value="3"
                  type="radio"
                />
                Dispute Driver Documents
              </label>
            </div>
          </div>
        </div>
        <div
          class="col-sm-3"
          v-if="dispute_status === 2 || dispute_status === 3"
        >
          <div class="form-group">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action2_${orderNo}"
                  @change="update_delivery_docs_dispute_action(switched)"
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
          <div
            class="form-group"
            v-if="dispute_status === 2 || dispute_status === 3"
          >
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action1_${orderNo}"
                  value="1"
                  type="radio"
                  @change="update_delivery_docs_dispute_action(switched)"
                />
                Accept Driver Appeal
              </label>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="form-group" v-if="dispute_status === 0">
            <div class="radio">
              <label>
                <input
                  name="delivery_docs_dispute_value1_${orderNo}"
                  id="delivery_docs_action1_${orderNo}"
                  value="1"
                  type="radio"
                  @change="update_delivery_docs_dispute_action(switched)"
                />
                Accept Driver Documents
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <form id="dispute-form" @submit.prevent="determineAction">
          <div class="form-group" v-if="switched && dispute_status < 4">
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
            <textarea
              v-if="switched && dispute_status < 4"
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
              v-if="submitted && !$v.description.required && dispute_status < 4"
              class="invalid-feedback"
            >
              Description is required
            </div>
          </div>
          <div class="form-group" v-else>
            <v-select
              v-if="dispute_status > 1 && dispute_status < 4"
              :options="optionz"
              :reduce="reason => reason.code"
              name="reason"
              label="reason"
              placeholder="Select undispute reason .."
              class="form-control proximity-point"
              :id="`undispute_reason_${orderNo}`"
              v-model="reason"
              :class="{
                'is-invalid': submitted && $v.reason.$error,
              }"
            >
            </v-select>
            <div
              v-if="
                submitted &&
                  !$v.reason.required &&
                  dispute_status > 1 &&
                  dispute_status < 4
              "
              class="invalid-feedback"
            >
              undispute reason is required
            </div>
            <textarea
              v-if="dispute_status > 1 && dispute_status < 4"
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
              v-if="dispute_status > 1 && dispute_status < 4"
              class="invalid-feedback"
            >
              Description is required
            </div>
          </div>
          <button
            v-if="dispute_status < 4"
            class="btn btn-primary action-button"
          >
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
      riderDeliverImg: this.order.delivery_details.delivery_images,
      riderID: this.order.rider_details.rider_id,
      dispute_status: this.order.order_details.dispute_status,
      errors: [],
      notifications: '',
      options: [
        { code: '1', reason: 'A delivery document is missing' },
        { code: '2', reason: 'The delivery document is not clear' },
        { code: '3', reason: 'The delivery document is not valid' },
      ],
      optionz: [
        { code: '1', reason: 'The delivery document is there' },
        { code: '2', reason: 'The delivery document is clear' },
        { code: '3', reason: 'The delivery document is valid' },
      ],
      reason: '',
      description: '',
      submitted: false,
      switched: true,
    };
  },
  validations: {
    reason: { required },
    description: { required },
  },
  computed: {
    ...mapState(['config']),

    ...mapState(['userData']),
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    ...mapActions({
      perform_order_action: '$_orders/perform_order_action',
    }),
    determineAction() {
      if (this.dispute_status === 0 && !this.switched) {
        return this.verifyDnote();
      }
      if (this.dispute_status === 0 && this.switched) {
        return this.disputeOrder();
      }
      if (this.dispute_status === 1 && this.switched) {
        return this.disputeOrder();
      }
      if (this.dispute_status === 3 && this.switched) {
        return this.disputeOrder();
      }
      if (
        !this.switched &&
        (this.dispute_status === 2 || this.dispute_status === 3)
      ) {
        return this.undisputeOrder();
      }
    },
    async disputeOrder() {
      const notification = [];
      let actionClass = '';

      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const email = this.session.payload.data.email;
      const adminID = this.session.payload.data.admin_id;

      const payload = {
        app: 'ORDERS_APP',
        endpoint: 'dispute_delivery_docs_cc',
        apiKey: true,
        params: {
          _user_email: email,
          _user_id: adminID,
          action_id: 22,
          action_user: this.actionUser,
          admin_id: 0,
          channel: 'customer_support',
          cop_name: this.order.client_details.corporate_name,
          customer_email: this.order.client_details.email,
          customer_name: this.order.client_details.name,
          customer_phone: this.order.client_details.phone_no,
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

    async undisputeOrder() {
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
          dispute_delivery_doc_status: 4,
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
    async verifyDnote() {
      const notification = [];
      let actionClass = '';

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
          description: 'The delivery document is valid',
          dispute_delivery_doc_status: 1,
          dispute_docs_reason_id: 0,
          order_no: this.orderNo,
          rider_id: this.riderID,
        },
      };
      try {
        const data = await this.perform_order_action(payload);
        notification.push('Successfully verified delivery documents');
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
    update_delivery_docs_dispute_action(switched) {
      if (switched) {
        this.switched = false;
        return this.switched;
      } else {
        this.switched = true;
        return this.switched;
      }
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
.modalimages {
  max-width: 100%;
  max-height: 100%;
}
.signature {
  display: block;
  font-weight: bold;
}
</style>
