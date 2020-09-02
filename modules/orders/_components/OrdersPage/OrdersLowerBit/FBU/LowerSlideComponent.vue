<template>
  <td
    colspan="9"
    class="order_view_lower_cell cell-override"
    :id="`order_view_lower${order.order_details.order_no}`"
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
                  v-if="
                    order.order_details.confirm_status === 0 &&
                      !cancelStatus() &&
                      hasFreightPermissions()
                  "
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
                  v-if="!completeStatus() && !cancelStatus()"
                  class="freight-order-actions-buttons"
                  :class="ActiveTab === 'gps' ? 'active-tab' : 'inactive-tab'"
                  @click="ActiveTab = 'gps'"
                >
                  <span class="fa fa-fw fa fa-map-marker"></span>
                  GPS
                </button>
                <button
                  v-if="
                    !completeStatus() &&
                      !cancelStatus() &&
                      hasFreightPermissions()
                  "
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
                  v-if="
                    !completeStatus() &&
                      !cancelStatus() &&
                      hasFreightPermissions()
                  "
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
                  v-if="
                    order.order_details.confirm_status !== 0 &&
                      !completeStatus() &&
                      !cancelStatus() &&
                      canReallocate()
                  "
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'reallocate' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'reallocate'"
                >
                  <span class="fa fa-fw fa-arrow-circle-o-up"></span>
                  Reallocate
                </button>
                <button
                  v-if="!completeStatus() && !cancelStatus() && canCancel()"
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'cancel' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'cancel'"
                >
                  <span class="fa fa-fw fa-thumbs-down"></span>
                  Cancel
                </button>
                <button
                  v-if="completeStatus() || cancelStatus()"
                  class="freight-order-actions-buttons"
                  :class="
                    ActiveTab === 'ticket' ? 'active-tab' : 'inactive-tab'
                  "
                  @click="ActiveTab = 'ticket'"
                >
                  <span class="fa fa-fw fa-envelope"></span>
                  Ticket
                </button>
              </div>
              <div class="freight-order-actions-tabs">
                <div
                  v-if="actionErrors.length > 0"
                  :class="`alert alert-${actionClass}`"
                  :id="`error_holder_${order.order_details.order_no}`"
                >
                  <ul>
                    <li v-for="error in actionErrors" :key="error.index">
                      <b>{{ error }}</b>
                    </li>
                  </ul>
                </div>
                <TheTrackerComponent
                  v-if="
                    ActiveTab === 'gps' &&
                      (!completeStatus() && !cancelStatus())
                  "
                  :order="order"
                />
                <AuxilliaryServices
                  v-if="
                    ActiveTab === 'finances' &&
                      (!completeStatus() &&
                        !cancelStatus() &&
                        hasFreightPermissions())
                  "
                  :order="order"
                />
                <AssignRider
                  v-if="
                    ActiveTab === 'assign' &&
                      (!completeStatus() &&
                        !cancelStatus() &&
                        hasFreightPermissions())
                  "
                  :order="order"
                />
                <OrderStatuses
                  v-if="
                    ActiveTab === 'status' &&
                      (!completeStatus() &&
                        !cancelStatus() &&
                        hasFreightPermissions())
                  "
                  :order="order"
                />
                <TheReallocateComponent
                  v-if="
                    ActiveTab === 'reallocate' &&
                      (order.order_details.confirm_status !== 0 &&
                        !completeStatus() &&
                        !cancelStatus() &&
                        canReallocate())
                  "
                  :order="order"
                />
                <TheCancelComponent
                  v-if="
                    ActiveTab === 'cancel' &&
                      (!completeStatus() && !cancelStatus() && canCancel())
                  "
                  :order="order"
                />
                <TheTicketComponent
                  v-if="
                    ActiveTab === 'ticket' &&
                      (completeStatus() || cancelStatus())
                  "
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import TheSideComponent from '../LowerSideBar/TheSideComponent';
import TheMainComponent from '../LowerMainBar/TheMainComponent';
import TheTrackerComponent from './OrderActions/TrackerComponent';
import AuxilliaryServices from './OrderActions/AuxilliaryServices';
import TheCancelComponent from '../LowerMainBar/OrderActions/TheCancelComponent';
import TheTicketComponent from '../LowerMainBar/OrderActions/TheTicketComponent';
import TheReallocateComponent from '../LowerMainBar/OrderActions/TheReallocateComponent';
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
    TheReallocateComponent,
    TheNotificationsComponent,
    TheCancelComponent,
    TheTicketComponent,
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
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData']),
  },
  mounted() {
    const notification = [];
    const actionClass = '';
    this.updateClass(actionClass);
    this.updateOrderErrors(notification);
    this.updateErrors(notification);
    this.updateNotification(actionClass);
    this.ActiveTabStatus();
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setErrors',
      updateNotification: 'setNotification',
      updateClass: 'setActionClass',
      updateOrderErrors: 'setActionErrors',
    }),
    ActiveTabStatus() {
      if (this.order.order_details.confirm_status === 0) {
        this.ActiveTab = 'assign';
      } else {
        this.ActiveTab = 'gps';
      }
    },
    completeStatus() {
      if (this.order.order_details.delivery_status === 3) {
        return true;
      }
      return false;
    },
    cancelStatus() {
      if (this.order.order_details.order_status === 'cancelled') {
        return true;
      }
      return false;
    },
    hasFreightPermissions() {
      const privileges = JSON.parse(this.userData.payload.data.privilege);
      if (
        Object.prototype.hasOwnProperty.call(privileges, 'freight_actions') &&
        (privileges.freight_actions ||
          privileges.freight_actions_1 ||
          privileges.freight_actions_2 ||
          privileges.freight_actions_3)
      ) {
        return true;
      }
      return false;
    },
    canReallocate() {
      const privileges = JSON.parse(this.userData.payload.data.privilege);
      if (
        Object.prototype.hasOwnProperty.call(privileges, 'reassign_orders') &&
        privileges.reassign_orders
      ) {
        return true;
      }
      return false;
    },
    canCancel() {
      const adminType = this.userData.payload.data.admin_type;
      if (adminType !== 1) {
        return true;
      }
      return false;
    },
  },
};
</script>
