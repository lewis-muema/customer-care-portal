/* eslint-disable no-shadow */ /* eslint-disable vue/valid-v-bind */ /*
eslint-disable no-shadow */ /* eslint-disable no-shadow */ /* eslint-disable
no-shadow */
<template>
  <table
    id="rider_list"
    class="table  table-bordered table-hover"
    :key="riderTable"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Vendor</th>
        <th>City</th>
        <th>Box</th>
        <th>Current</th>
        <th>Loan</th>
        <th>Savings</th>
        <th>Status</th>
        <th>Online Status</th>
        <th>Order Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="riderID === null">
        <td colspan="11">Search to view Rider details.</td>
      </tr>
      <template v-else>
        <tr v-if="loading">
          <i class="fa fa-spinner fa-spin loader"></i>
        </tr>
        <tr
          v-else-if="riderDetails !== null"
          @click="toggle('rider')"
          :class="{ opened: opened.includes('rider') }"
        >
          <td>{{ riderDetails.rider_name }}</td>
          <td>{{ riderDetails.phone_no }}</td>
          <td>{{ determine_vendor_name(riderDetails.vendor_type) }}</td>
          <td>{{ riderDetails.city_name }}</td>
          <td>
            {{
              get_carrier_type(
                riderDetails.carrier_type,
                riderDetails.vendor_type,
              )
            }}
          </td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.current_list.length > 0
                ? new Intl.NumberFormat().format(
                    Math.round(riderDetails.current_list[0].rb),
                  )
                : '0'
            }}
          </td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.loans_list.length > 0
                ? new Intl.NumberFormat().format(
                    Math.round(riderDetails.loans_list[0].rb),
                  )
                : '0'
            }}
          </td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.savings_list.length > 0
                ? new Intl.NumberFormat().format(
                    Math.round(riderDetails.savings_list[0].rb),
                  )
                : '0'
            }}
          </td>
          <td>
            <span :class="`label label-${showClass}`">
              {{ get_account_status(riderDetails.status) }}
            </span>
          </td>
          <td>
            <span :class="`label label-${showClass1}`">
              {{ get_online_status(riderDetails.rider_stat) }}
            </span>
          </td>
          <td>
            <span :class="`label label-${showClass}`">
              {{
                getOrderServiceStatus(
                  riderDetails.delivery_detail,
                  riderDetails.status,
                )
              }}
            </span>
          </td>
        </tr>

        <tr v-if="opened.includes('rider')">
          <td colspan="11" class="user-details">
            <div class="lower_slide_bit" style="" :id="`bumba_${riderID}`">
              <div class="row">
                <SideComponent :details="riderDetails" />
                <MainComponent :rider="riderDetails" />
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Vendor</th>
        <th>City</th>
        <th>Box</th>
        <th>Current</th>
        <th>Loan</th>
        <th>Savings</th>
        <th>Status</th>
        <th>Online Status</th>
        <th>Order Status</th>
      </tr>
    </tfoot>
  </table>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheRiderTable',
  components: {
    SideComponent: () => import('~/modules/riders/_components/SideComponent'),
    MainComponent: () => import('~/modules/riders/_components/MainComponent'),
  },
  data() {
    return {
      riderID: null,
      user: null,
      riderInfo: null,
      riderDetails: null,
      orderDetails: '',
      opened: [],
      riderTable: 0,
      loading: false,
      showClass: '',
      showClass1: '',
    };
  },
  computed: {
    ...mapGetters(['getRider', 'getUserActionSuccess']),
  },
  watch: {
    getRider(user) {
      this.loading = true;
      this.requestsingleRdier(user, 'rider');
      return (this.riderID = user);
    },
    async getUserActionSuccess(status) {
      const arr = [];
      this.riderDetails = null;
      const index = this.opened.indexOf('biz');
      this.opened.splice(index, 1);
      this.forceRerender();
      this.updateSuccess(false);
      this.updateClass('');
      this.updateErrors(arr);
      await this.requestsingleRdier(this.riderID, 'rider');
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions({
      request_single_rider: 'request_single_rider',
    }),
    async requestsingleRdier(user) {
      this.opened = [];
      this.riderDetails = null;
      const payload = { riderID: user };
      try {
        const data = await this.request_single_rider(payload);
        this.loading = false;
        return (this.riderDetails = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    get_carrier_type(carrier, vendorType) {
      if (
        vendorType === 1 ||
        vendorType === 11 ||
        vendorType === 22 ||
        vendorType === 23 ||
        vendorType === 24
      ) {
        if (carrier === 1) {
          return 'Box';
        }
        return 'No box';
      } else {
        if (carrier === 1) {
          return 'Open';
        } else {
          return 'Closed';
        }
      }
    },

    get_online_status(suspension) {
      let showClass1 = 'warning';
      if (suspension === 0) {
        suspension = 'offline';
        showClass1 = 'warning';
        this.showClass1 = showClass1;
        return (this.suspension = suspension);
      }
      if (suspension === 1) {
        suspension = 'online';
        showClass1 = 'success';
        this.showClass1 = showClass1;
        return (this.suspension = suspension);
      }
      if (suspension === 2) {
        suspension = 'suspended';
        showClass1 = 'danger';
        this.showClass1 = showClass1;
        return (this.suspension = suspension);
      }
    },
    getOrderServiceStatus(orders, status) {
      // eslint-disable-next-line func-names
      let printMe = orders.find(function(item) {
        if (item.order_status === 'confirmed') {
          return true;
        }
        if (item.order_status === 'in transit') {
          return true;
        }
        if (item.order_status === 'delivered') {
          return false;
        }
      });
      if (printMe) {
        printMe = printMe.order_status;
      } else {
        printMe = 'delivered';
      }
      if (printMe === 'confirmed' || printMe === 'in transit') {
        return 'Busy';
      }
      if (printMe === 'delivered') {
        if (status === 1) {
          return 'available';
        } else {
          return 'unreachable';
        }
      }
    },
    get_account_status(status) {
      let showClass = 'warning';
      if (status === 1) {
        status = 'active';
        showClass = 'success';
        this.showClass = showClass;
        return (this.status = status);
      }
      if (status === 0) {
        status = 'Deactivated';
        showClass = 'danger';
        this.showClass = showClass;
        return (this.status = status);
      }
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    forceRerender() {
      this.riderTable += 1;
    },
  },
};
</script>
<style>
.user-details {
  background-color: rgba(245, 245, 245, 0.56) !important;
}
</style>
