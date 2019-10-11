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
        <th>Suspension Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="riderID === null">
        <td colspan="10">Search to view Rider details.</td>
      </tr>
      <template v-else>
        <tr v-if="riderDetails === null">
          <i class="fa fa-spinner fa-spin loader"></i>
        </tr>
        <tr
          @click="toggle('rider')"
          :class="{ opened: opened.includes('rider') }"
        >
          <td>{{ this.riders_data.payments.rider_name }}</td>
          <td>{{ this.riders_data.phone_no }}</td>
          <td>{{ this.get_vendor_type() }}</td>
          <td>{{ this.riders_data.payments.city_name }}</td>
          <td>{{ this.get_carrier_type() }}</td>
          <td>
            {{ this.riders_data.payments.default_currency }}
            {{ this.riders_data.running_bal }}
          </td>
          <td>
            {{ this.riders_data.payments.default_currency }}
            {{ this.riders_data.payments.loan_list.running_balance }}
          </td>
          <td>
            {{ this.riders_data.payments.default_currency }}
            {{ this.riders_data.payments.savings_list.running_balance }}
          </td>
          <td>{{ this.riders_data.payments.rider_status }}</td>
          <td>{{ this.get_suspension_status() }}</td>
        </tr>

        <tr v-if="opened.includes('rider')">
          <td colspan="10" class="user-details">
            <div class="lower_slide_bit" style="" :id="`bumba_${riderID}`">
              <div class="row">
                <SideComponent :details="this.riders_data" />
                <MainComponent :rider="this.riders_data" />
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
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
      riderID: null,
      riderDetails: null,
      opened: [],
      riderTable: 0,
    };
  },
  computed: {
    ...mapGetters(['getRider', 'getUserActionSuccess']),
  },
  watch: {
    getRider(user) {
      return (this.riderID = user);
    },
    getUserActionSuccess(status) {
      const arr = [];
      this.userInfo = null;
      this.userDetails = null;
      const index = this.opened.indexOf('biz');
      this.opened.splice(index, 1);
      this.forceRerender();
      this.updateSuccess(false);
      this.updateClass('');
      this.updateErrors(arr);
      this.singleCopUserRequest(this.copID, 'cop');
    },
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    get_rdier() {
      console.log(this.riders_data);
      this.riderDetails = this.riders_data;
    },
    get_vendor_type() {
      // eslint-disable-next-line eqeqeq
      if (this.riders_data.payments.vendor_type == 1) {
        return 'Bike';
        // eslint-disable-next-line no-unreachable
      }
    },
    get_carrier_type() {
      console.log(this.riders_data);
      if (this.riders_data.payments.carrier_type === 1) {
        return 'Box';
      }
    },

    get_suspension_status() {
      if (this.riders_data.payments.rider_stat === 0) {
        return 'Inactive';
      }
      if (this.riders_data.payments.rider_stat === 1) {
        return 'Active';
      }
      if (this.riders_data.payments.rider_stat === 2) {
        return 'Suspended';
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
