<template>
  <div id="app">
    <table class="table  table-bordered table-hover">
      <thead>
        <tr>
          <th>Status</th>
          <th>Client</th>
          <th>Rider</th>
          <th>Time</th>
          <th>Pick up</th>
          <th>Delivery</th>
          <th>Amount</th>
          <th>Rider Amount</th>
        </tr>
      </thead>

      <tbody>
        <template v-if="Object.keys(order).length !== 0">
          <tr
            @click="toggle(orderNo)"
            :class="{ opened: opened.includes(orderNo) }"
            :key="orderNo"
          >
            <td>
              <span :id="`tip_order_${orderNo}`" data-toggle="tooltip" title="">
                <span
                  :id="`order_indicator_${orderNo}`"
                  :class="`label ${status.toLowerCase()}_ind`"
                >
                  {{ orderStatus(order) }}
                </span>
              </span>
            </td>
            <td>
              <span v-html="smartify_display(clientDetails.name, 20)"></span>
              <span
                v-if="paymentDetails.cash_status === 1"
                title="Cash"
                class="badge"
                style="float:right; background-color: transparent;"
              >
                <i class="fa fa-fw fa-money" style=" color:green;"></i
              ></span>
              <!-- <span
                v-if="priceType === 'Standard'"
                title="Standard"
                class="badge bg-aqua"
              >
                s
              </span> -->
            </td>
            <td>
              {{ orderRider(order) }}
              <span class="vendor-label">
                <span>
                  {{ vendorLabels[vendorTypeId]
                  }}{{ freightLabel(order) }}</span
                >
                &nbsp;
                <img
                  :src="
                    `https://images.sendyit.com/web_platform/vendor_type/side/v2/${vendorTypeId}.svg`
                  "
                  height="14"
                />
              </span>
            </td>
            <td>
              {{ getFormattedDate(moreData.pickup_time, 'hh.mm a DD/MM/YYYY') }}
              <span
                v-if="compareDates(moreData.pickup_time)"
                title="Scheduled for tomorrow"
                class="fa fa-clock-o pull-right delay"
              >
              </span>
            </td>

            <td v-html="smartify_display(moreData.from_name, 30)"></td>
            <td v-html="smartify_display(moreData.to_name, 30)"></td>
            <td>
              {{
                displayAmount(
                  paymentDetails.order_currency,
                  paymentDetails.order_amount,
                  vendorTypeId,
                  paymentDetails.fixed_cost,
                  paymentDetails.customer_min_amount,
                  moreData.confirm_status,
                  order,
                )
              }}
            </td>
            <td v-if="order.rider_details.vendor_type_id === 26">
              N/A
              <span
                data-toggle="tooltip"
                title="No rider amount to be displayed for intercounty orders"
                class="badge bg-info"
              >
                <i class="fa fa-info"></i>
              </span>
            </td>
            <td v-else>
              {{
                displayAmount(
                  paymentDetails.order_currency,
                  riderDetails.rider_amount,
                  vendorTypeId,
                  paymentDetails.fixed_cost,
                  paymentDetails.customer_min_amount,
                  moreData.confirm_status,
                  order,
                )
              }}
              <span
                v-if="moreData.order_status === 'pending'"
                data-toggle="tooltip"
                title="This rider amount is less VAT"
                class="badge bg-info"
              >
                <i class="fa fa-info"></i>
              </span>
              <span class="badge bg-aqua ">{{ order.city.name }} </span>

              <span> &nbsp; </span>
              <span title="Corporate Name" class="badge bg-aqua pull-right">
                {{ moreData.distance_read }} km</span
              >
            </td>
          </tr>
          <tr
            v-if="opened.includes(orderNo) && vendorTypeId !== 25"
            class="order_view_lower_cell"
          >
            <td
              colspan="9"
              class="order_view_lower_cell search-view"
              :id="`searched_order_view_lower${orderNo}`"
            >
              <div class="lower_slide_bit" :id="`bumba_${orderNo}`">
                <div class="row">
                  <div class="col-md-4">
                    <TheSideComponent :order="order" />
                  </div>
                  <div class="col-md-8">
                    <TheMainComponent
                      :order-details="orderDetails"
                      :order="order"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr
            v-if="opened.includes(orderNo) && vendorTypeId === 25"
            class="order_view_lower_cell"
          >
            <DashboardComponent :full-order="mainDetails" :orderno="orderNo" />
          </tr>
        </template>
        <tr v-else>
          <td colspan="9" class="no-order">
            No order Found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'TheRowHolder',
  components: {
    TheSideComponent: () =>
      import(
        '~/modules/orders/_components/OrdersPage/OrdersLowerBit/LowerSideBar/TheSideComponent'
      ),
    TheMainComponent: () =>
      import(
        '~/modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/TheMainComponent'
      ),
    DashboardComponent: () =>
      import(
        '~/modules/orders/_components/OrdersPage/OrdersLowerBit/FBU/DashboardComponent'
      ),
  },
  props: ['order'],
  data() {
    return {
      opened: [],
      moreData: this.order.order_details,
      clientDetails: this.order.client_details,
      riderDetails: this.order.rider_details,
      paymentDetails: this.order.payment_details,
      images: this.order.delivery_details,
      orderDetails: {
        countryCode: this.order.country_code,
        orderStatus: this.order.order_details.order_status,
        vendorID: this.order.rider_details.vendor_type_id,
      },
      mainDetails: {
        country_code: this.order.country_code,
        vendor_type_id: this.order.rider_details.vendor_type_id,
        order_status: this.order.order_details.order_status,
        order_no: this.order.order_details.order_no,
      },
    };
  },
  computed: {
    ...mapState(['delayLabels', 'vendorLabels', 'cityAbbrev']),
    vendorTypeId() {
      return this.order.rider_details.vendor_type_id;
    },
    orderNo() {
      return this.order.order_details.order_no;
    },
    status() {
      const deliveryStatus = this.moreData.delivery_status;
      const confirmStatus = this.moreData.confirm_status;
      const orderStatus = this.moreData.order_status;
      const deliveredNotesState =
        this.images.delivery_images.length > 0 &&
        this.images.delivery_images[0].physical_delivery_note_status
          ? this.images.delivery_images[0].physical_delivery_note_status
          : 'Pending Approval';
      const dnotesStatus = this.moreData.delivery_verification
        .physical_delivery_note_status
        ? deliveredNotesState
        : this.moreData.delivery_verification.physical_delivery_note_status;

      let status = orderStatus;
      if (deliveryStatus === 3 && confirmStatus === 1) {
        status = this.deliveryStatus(this.order, dnotesStatus);
      }
      if (this.moreData.dispute_status === 2) {
        status = 'disputed';
      }
      if (this.moreData.dispute_status === 3) {
        status = 'disputed & appealed';
      }
      if (this.moreData.dispute_status === 4) {
        status = 'disputed & resolved';
      }
      return status;
    },
    priceType() {
      return this.moreData.price_type === 1 ? 'Standard' : 'Express';
    },
  },
  mounted() {
    const actionClass = '';
    const arr = [];

    this.updateClass(actionClass);
    this.updateErrors(arr);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    orderStatus(order) {
      let resp = this.status;
      if (order.rider_details.vendor_type_id === 26) {
        if (
          Object.prototype.hasOwnProperty.call(
            order.order_details,
            'inter_county_order_details',
          )
        ) {
          resp = order.order_details.inter_county_order_details.status;
        }
      }
      return resp;
    },
    orderRider(order) {
      let resp = this.riderDetails.name;
      if (order.rider_details.vendor_type_id === 26) {
        if (
          Object.prototype.hasOwnProperty.call(
            order.order_details,
            'inter_county_order_details',
          )
        ) {
          resp = 'Intercounty Order';
        }
      }
      return resp;
    },
  },
};
</script>
<style scoped>
.no-order {
  background: #dddddd;
}
.search-view {
  padding: 0px;
  background-color: rgba(245, 245, 245, 0.56) !important;
  font-size: 13px;
}
.label {
  text-transform: capitalize;
}
</style>
