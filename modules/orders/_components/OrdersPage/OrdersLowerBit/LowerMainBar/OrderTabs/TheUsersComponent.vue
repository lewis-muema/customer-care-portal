<template>
  <table class="table table-bordered">
    <tbody>
      <tr>
        <td width="50%">Order No</td>
        <td>{{ moreData.order_no }}</td>
      </tr>
      <tr
        v-if="
          nextOrder !== '' && orderDetails.rider_details.vendor_type_id === 21
        "
      >
        <td width="50%">Standard bike order</td>
        <td>
          <span class="companion_order" @click="request_one_order(nextOrder)">
            {{ nextOrder }}
          </span>
        </td>
      </tr>
      <tr v-if="previousOrder !== ''">
        <td width="50%">
          {{ displayArray[orderDetails.rider_details.vendor_type_id] }}
        </td>
        <td>
          <span
            class="companion_order"
            @click="request_one_order(previousOrder)"
            >{{ previousOrder }}
          </span>
        </td>
      </tr>
      <tr v-if="moreData.batch_no">
        <td width="50%">Batch no</td>
        <td>
          <span
            class="companion_order"
            @click="request_one_order(moreData.order_no)"
          >
            {{ moreData.batch_no }}
          </span>
        </td>
      </tr>
      <tr>
        <td width="50%">Corporate name</td>
        <td>
          {{
            orderDetails.client_details.corporate_name === 'Sendy'
              ? 'Peer'
              : orderDetails.client_details.corporate_name
          }}
        </td>
      </tr>
      <tr>
        <td width="50%">Client name</td>
        <td>{{ orderDetails.client_details.name }}</td>
      </tr>
      <tr>
        <td width="50%">Client email</td>
        <td>{{ orderDetails.client_details.email }}</td>
      </tr>
      <tr>
        <td width="50%">Client phone</td>
        <td>{{ orderDetails.client_details.phone_no }}</td>
      </tr>
      <tr>
        <td width="50%">Rider name</td>
        <td>{{ orderDetails.rider_details.name }}</td>
      </tr>
      <tr>
        <td width="50%">Rider phone</td>
        <td>{{ orderDetails.rider_details.phone_no }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'TheUsersComponent',
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
      deliveryVerification: null,
      sampleOrder: null,
      nextOrder: null,
      previousOrder: null,
      displayArray: {
        21: 'Standard bike order',
        1: 'Standard runner order',
      },
    };
  },
  mounted() {
    this.sampleOrder = this.singleOrder();
    this.deliveryVerification = this.sampleOrder.delivery_verification;
    this.nextOrder = this.sampleOrder.delivery_verification.next_order;
    this.previousOrder = this.sampleOrder.delivery_verification.previous_order;
  },
  methods: {},
};
</script>
