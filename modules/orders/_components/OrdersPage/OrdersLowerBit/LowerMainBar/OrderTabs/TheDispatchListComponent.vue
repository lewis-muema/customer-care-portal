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
        {{ msg }}.
        <mark>
          <strong
            >Last Dispatch Time :
            {{
              getOrderFormattedDate(
                originalDispatchList.last_dispatch_time,
                'LLLL',
              )
            }}
          </strong>
        </mark>
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
          <th>Last Dispatch Time</th>
        </tr>
        <tr v-for="list in partnerList" :key="list.index">
          <td>{{ list.name }}</td>
          <td>{{ list.phone_no }}</td>
          <td>{{ list.distance }}</td>
          <td>{{ list.dispatch_count }}</td>
          <td>
            {{
              getOrderFormattedDate(
                list.last_dispatch_time,
                'DD/MM/YYYY, hh:mm a',
              )
            }}
          </td>
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
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheDispatchListComponent',
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
      dispatchList: null,
      partnerList: {},
      dispatchStatus: null,
      originalDispatchList: {},
      msg: '',
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
      this.dispatchStatus = data.status;
      let initialRider = 0;
      if (this.dispatchStatus) {
        this.msg = data.message;
      }

      const partnerArray = data.partner_list;
      for (let i = 0; i < partnerArray.length; i++)
        if (partnerArray[i].rider_id === 1) {
          initialRider = partnerArray[i];
          partnerArray.splice(i, 1);
          break;
        }
      this.originalDispatchList = initialRider;

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
      switch (data) {
        case data === null:
          msg =
            'Oops! something went wrong! Please check your internet connection.';
          break;
        case !data.status:
          msg = 'Order is not dispatching';
          break;
        default:
      }
    },
  },
};
</script>
