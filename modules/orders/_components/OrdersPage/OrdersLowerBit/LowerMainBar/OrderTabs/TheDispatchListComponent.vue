<template>
  <div class="body-box">
    <div v-if="dispatchList === null && !dispatchStatus">
      Requesting dispatch list ...
    </div>
    <div v-if="dispatchList !== null && !dispatchStatus">
      Order is not dispatching.
    </div>
    <div v-if="dispatchStatus && !this.check_partner_list(partnerList)">
      <p>
        No driver has been found. Please check whether there is a driver nearby
        or if the nearby drivers have the correct carrier type. Other factors to
        check are the vendor type, order exclusivity to the account, driver
        exclusivity, driver approval status among others. Check
        <a
          href="https://gitlab.com/sendy/docs/wikis/order-dispatch-checklist"
          target="_blank"
          >https://gitlab.com/sendy/docs/wikis/order-dispatch-checklist</a
        >
        for more.
      </p>
    </div>
    <table
      v-if="dispatchStatus && this.check_partner_list(partnerList)"
      class="table table-bordered"
    >
      <tbody>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Distance</th>
          <th>Dispatch Count</th>
        </tr>
        <tr v-for="list in partnerList" :key="list.index">
          <td>{{ list.name }}</td>
          <td>{{ list.phone_no }}</td>
          <td>{{ list.distance }}</td>
          <td>{{ list.dispatch_count }}</td>
        </tr>
      </tbody>
    </table>
    <div
      align="right"
      class="padded-button-wrapper"
      id="recheck_details9_<?php echo $unique_order_id;?>"
    >
      <span @click="dispatchListRequest()" class="btn btn-primary">
        Recheck
      </span>
    </div>
  </div>
  <!-- /.box-body -->
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheDispatchListComponent',
  props: {
    orderdetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.orderdetails,
      moreData: this.orderdetails.order_details,
      dispatchList: null,
      partnerList: {},
      dispatchStatus: null,
    };
  },
  mounted() {
    this.dispatchListRequest();
  },
  methods: {
    ...mapActions({
      request_dispatch_list: '$_orders/request_dispatch_list',
    }),
    async dispatchListRequest() {
      const payload = {
        app: 'DISPATCH_LIST',
        endpoint: 'dispatch_list',
        apiKey: true,
        params: { order_no: this.moreData.order_no },
      };
      const data = await this.request_dispatch_list(payload);
      // this.dispatchList = data;
      this.dispatchStatus = data.status;

      const partnerArray = data.partner_list;

      for (let i = 0; i < partnerArray.length; i++)
        if (partnerArray[i].rider_id === 1) {
          partnerArray.splice(i, 1);
          break;
        }
      this.partnerList = partnerArray;
      return (this.dispatchList = data);
    },
    check_partner_list(partnerList) {
      let partners = true;
      if (partnerList.length < 1) {
        partners = false;
      }
      return partners;
    },
    show_notification(data) {
      let msg;
      //  if(data === null) {
      //    msg = '';
      //  } elseif() {

      //  }
      switch (data) {
        case data === null:
          msg =
            'Oops! something went wrong! Please check your internet connection.';
          break;
        case !data.status:
          msg = 'Order is not dispatching';
          break;
        // case data.:
        //   msg = 'Order is not dispatching';
        //   break;
        default:
        // code block
      }
    },
  },
};
</script>
