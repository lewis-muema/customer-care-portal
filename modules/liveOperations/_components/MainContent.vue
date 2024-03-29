<template>
  <div class="main-ops-holder">
    <div v-if="loading">
      <div class="text-center">
        Loading problematic orders ....
        <i class="fa fa-spinner fa-spin loader"></i>
      </div>
    </div>
    <div class="table-responsive " v-else>
      <table class="table coupon-table">
        <thead>
          <tr>
            <th class="alert-td">Alert Type</th>
            <th>Order Number</th>
            <th>Date Placed</th>
            <th>Time Problem Occured</th>
            <th>Resolution Time</th>
            <th>Customer Name</th>
            <th class="assignee-td">Assignee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="probelematicData.length === 0 || probelematicData === null">
            <td colspan="8">
              {{
                availabilityMsg === ''
                  ? 'No problematic orders found'
                  : availabilityMsg
              }}
            </td>
          </tr>
          <template v-else>
            <tr v-for="(data, index) in probelematicData" :key="index">
              <td>
                <div class="alert-status" :class="getStatus(data.alert_type)">
                  &nbsp;
                </div>
                {{ data.alert_type }}
              </td>
              <td>{{ data.order_no }}</td>
              <td>
                {{
                  getFormattedDate(
                    data.placement_time,
                    'MMM Do,  YYYY HH:mm:ss',
                  )
                }}
              </td>

              <td>
                {{
                  getFormattedDate(data.created_at, 'MMM Do,  YYYY HH:mm:ss')
                }}
              </td>
              <td>
                {{
                  data.resolution_time === null
                    ? 'N/A'
                    : determineDuration(data.resolution_time)
                }}
              </td>
              <td>{{ data.customer_name }}</td>
              <td v-if="data.status === 0 || data.status === 2">
                <div class="image-holder" v-if="data.assignee !== null">
                  <img
                    :src="`${setPhoto(data)}`"
                    class="img-circle"
                    alt="User Image"
                  />
                </div>
                {{ data.assignee === null ? 'N/A' : data.assignee_name }}
              </td>
              <td v-if="data.status === 1">
                <div class="image-holder" v-if="data.resolved_by !== null">
                  <img
                    :src="`${setPhoto(data)}`"
                    class="img-circle"
                    alt="User Image"
                  />
                </div>
                {{ data.resolved_by === null ? 'N/A' : data.resolved_by_name }}
              </td>
              <td :class="`${getAlertStatus(data.status)}-td`">
                <span
                  class="order-status"
                  :class="`${getAlertStatus(data.status)}`"
                  >{{ getAlertStatus(data.status) }}</span
                >
              </td>
              <td>
                <span class="action-status view-status" @click="viewOrder(data)"
                  >View</span
                >
                <span
                  class="action-status view-status mark-resolved"
                  @click.stop="triggerModal($event, 'resolve', data)"
                  v-if="data.status === 0 && data.assignee !== null"
                  >Mark as resolved</span
                >
                <span
                  class="action-status view-status"
                  @click.stop="triggerModal($event, 'assign', data)"
                  v-if="data.assignee === null && data.status !== 2"
                  >Assign</span
                >
                <span
                  class="action-status re-assign-status"
                  @click.stop="triggerModal($event, 'reassign', data)"
                  v-if="
                    data.assignee !== null &&
                      data.status !== 1 &&
                      data.status !== 2
                  "
                  >Reassign</span
                >
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="text-center pagination-holder">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="paginationData.total"
          @current-change="setPage"
          class="promo-pagination"
          v-if="paginationData.total >= paginationData.perPage"
          :page-size="paginationData.perPage"
          :current-page="Number(page)"
          background
        >
        </el-pagination>
      </div>
    </div>
    <ActionsModal
      :alert="alert"
      :order-no="orderNo"
      :action="action"
      @cancelEvent="handleCancel"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'MainContent',
  components: {
    ActionsModal: () => import('./ActionsModal'),
  },
  props: ['alerts', 'loading', 'availabilityMsg'],
  data() {
    return {
      page: localStorage.getItem('currentPage')
        ? localStorage.getItem('currentPage')
        : 1,
      pageSize: 10,
      AWS_URL:
        'https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/staff/team/',
      order: null,
      orderNo: null,
      action: null,
      alert: null,
      searchedOrderStatus: false,
    };
  },
  computed: {
    ...mapGetters(['getSearchedOrderStatus']),
    pagedTableData() {
      return this.orders.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page,
      );
    },
    alertsData() {
      return this.alerts;
    },
    probelematicData() {
      const response = this.alertsData === null ? [] : this.alertsData;
      return typeof response.data !== 'undefined' ? response.data : response;
    },
    paginationData() {
      const response = this.alertsData === null ? [] : this.alertsData;
      return typeof response.data !== 'undefined' ? response.pagination : [];
    },
  },
  watch: {
    getSearchedOrderStatus(status) {
      this.searchedOrderStatus = status;
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedOrder: 'setSearchedOrder',
      updateSearchState: 'setSearchState',
      updateProblematicState: 'setProblematicOrderSearched',
      updateCurrentPage: 'setCurrentPage',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    setPage(val) {
      this.page = val;
      this.updateCurrentPage(val);
      localStorage.setItem('currentPage', val);
    },
    setPhoto(order) {
      return order.admin_img
        ? `${this.AWS_URL}${order.admin_img}`
        : `${this.AWS_URL}eggy.png`;
    },
    async viewOrder(data) {
      if (data.order_no) {
        this.updateSearchState(true);
        await this.singleOrderRequest(data.order_no);
      }
    },
    async singleOrderRequest(orderNo) {
      orderNo = orderNo.trim();
      try {
        const data = await this.request_single_order(orderNo);
        this.updateSearchedOrder(data);
        this.updateProblematicState(true);
        this.$router.push('/orders');
        return (this.order = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    triggerModal(e, action, alert) {
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors([]);

      this.order = null;
      this.orderNo = alert.order_no;
      this.alert = alert;
      this.action = action;
      $(`#actionModal`).modal('show');
      e.preventDefault();
    },
    handleCancel(cancelEvent) {
      this.$emit('cancelEvent', cancelEvent);
    },
    getAlertStatus(status) {
      let alertStatus = '';
      switch (status) {
        case 1:
          alertStatus = 'resolved';
          break;
        case 0:
          alertStatus = 'unresolved';
          break;
        case 2:
          alertStatus = 'auto-resolved';
          break;
        default:
          break;
      }
      return alertStatus;
    },
    getStatus(alert) {
      let status = 'default-alert';
      switch (alert) {
        case 'Excessive Time to Confirmation - MBU':
          status = 'delayed-confirmation';
          break;
        case 'Pending Orders with More Than 3 Reallocations - SEBU':
          status = 'excess-reallocations';
          break;
        case 'TukTuk orders not confirmed in 10 minutes':
          status = 'tuktuk-confirmation-delay';
          break;
        case 'Excessive time to pickup':
          status = 'delayed-pickup';
          break;
        case 'Excessive time to pickup - SEBU':
          status = 'delayed-pickup-sebu';
          break;
        case 'Kiota orders pending for more than 10 minutes':
          status = 'kiota-pending-orders';
          break;
        case 'Confirmed orders not picked in 5 minutes':
          status = 'confirmed-orders-5-minutes';
          break;
        default:
          break;
      }
      return status;
    },
  },
};
</script>

<style></style>
