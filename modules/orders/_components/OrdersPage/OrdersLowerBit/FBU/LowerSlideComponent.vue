<template>
  <td
    colspan="9"
    class="order_view_lower_cell"
    :id="`order_view_lower${order.order_details.order_no}`"
    style="padding:0px; background-color: rgba(245, 245, 245, 0.56) !important; font-size: 13px; width: 100vw;"
  >
    <TheNotificationsComponent :errors="errors" />
    <div class="lower_slide_bit" :id="`bumba_${order.order_details.order_no}`">
      <div class="row" v-if="order === null">
        loading ....
      </div>
      <div class="row" v-else>
        <div class="col-md-4">
          <TheSideComponent :order="order" />
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-12 freight-actions">
              <div class="freight-order-actions">
                <button
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'assign' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'assign'"
                >
                  <span class="fa fa-fw fa-edit"></span>
                  Assign Order
                </button>
                <button
                  class="freight-order-actions-buttons"
                  :class="ActiveTab === 'gps' ? 'active-tab' : 'inactive-tab'"
                  @click="ActiveTab = 'gps'"
                >
                  <span class="fa fa-fw fa fa-map-marker"></span>
                  GPS
                </button>
                <button
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'finances' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'finances'"
                >
                  <span class="fa fa-fw fa-usd"></span>
                  Finances
                </button>
                <button
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'status' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'status'"
                >
                  <span class="fa fa-fw fa-arrow-circle-o-up"></span>
                  Order Status
                </button>
                <button
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'cancel' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'cancel'"
                >
                  <span class="fa fa-fw fa-thumbs-down"></span>
                  Cancel
                </button>
              </div>
              <div class="freight-order-actions-tabs">
                <TheTrackerComponent
                  v-if="ActiveTab === 'gps'"
                  :order="order"
                />
                <AuxilliaryServices
                  v-if="ActiveTab === 'finances'"
                  :order="order"
                />
                <AssignRider v-if="ActiveTab === 'assign'" :order="order" />
                <OrderStatuses v-if="ActiveTab === 'status'" :order="order" />
                <TheCancelComponent
                  v-if="ActiveTab === 'cancel'"
                  :order="order"
                />
              </div>
            </div>
            <div class="col-md-12">
              <TheMainComponent :order="order" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </td>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

import TheSideComponent from '../LowerSideBar/TheSideComponent';
import TheMainComponent from '../LowerMainBar/TheMainComponent';
import TheTrackerComponent from './OrderActions/TrackerComponent';
import AuxilliaryServices from './OrderActions/AuxilliaryServices';
import TheCancelComponent from '../LowerMainBar/OrderActions/TheCancelComponent';
import AssignRider from './OrderActions/AssignRider';
import OrderStatuses from './OrderActions/OrderStatuses';
import TheNotificationsComponent from '~/components/UI/TheNotificationsComponent';

export default {
  name: 'LowerSlideComponent',
  components: {
    TheSideComponent,
    TheMainComponent,
    TheTrackerComponent,
    AssignRider,
    OrderStatuses,
    TheNotificationsComponent,
    TheCancelComponent,
    AuxilliaryServices,
  },
  props: {
    orderno: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      order: this.orderno,
      errors: [],
      GPS: false,
      Assign: false,
      ActiveTab: 'assign',
    };
  },
  mounted() {
    const notification = [];
    const actionClass = '';
    this.updateClass(actionClass);
    this.updateOrderErrors(notification);
    this.updateErrors(notification);
    this.updateNotification(actionClass);
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setErrors',
      updateNotification: 'setNotification',
      updateClass: 'setActionClass',
      updateOrderErrors: 'setActionErrors',
    }),
  },
};
</script>
