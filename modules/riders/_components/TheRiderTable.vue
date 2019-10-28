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
      <tr v-if="riderDetails === null">
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
          <td>{{ riderDetails.rider_name }}</td>
          <td>{{ riderDetails.phone_no }}</td>
          <td>{{ determine_vendor_name(riderDetails.vendor_type) }}</td>
          <td>{{ riderDetails.city_name }}</td>
          <td>{{ get_carrier_type(riderDetails.carrier_type) }}</td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.current_list.length > 0
                ? Math.round(riderDetails.current_list[0].rb)
                : '0'
            }}
          </td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.loans_list.length > 0
                ? Math.round(riderDetails.loans_list[0].rb)
                : '0'
            }}
          </td>
          <td>
            {{ riderDetails.default_currency }}
            {{
              riderDetails.savings_list.length > 0
                ? Math.round(riderDetails.savings_list[0].rb)
                : '0'
            }}
          </td>
          <td>{{ riderDetails.email }}</td>
          <td>
            {{ get_suspension_status(riderDetails.rider_stat) }}
          </td>
        </tr>

        <tr v-if="opened.includes('rider')">
          <td colspan="10" class="user-details">
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
      opened: [],
      riderTable: 0,
    };
  },
  computed: {
    ...mapGetters(['getRider', 'getUserActionSuccess']),
  },
  watch: {
    getRider(user) {
      this.requestsingleRdier(user, 'rider');
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
      this.requestsingleRdier(this.riderID, 'rider');
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
      const payload = { riderID: user };
      try {
        const data = await this.request_single_rider(payload);
        this.riderDetails = data;
        console.log(
          'This is the data that has gotten to the component',
          this.riderDetails,
        );
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    get_vendor_type(vendor) {
      // eslint-disable-next-line eqeqeq
      console.log('these are the vendor types', this.vendorTypes);
    },
    get_carrier_type(carrier) {
      if (carrier === 1) {
        return 'Box';
      }
      return 'No box';
    },

    get_suspension_status(suspension) {
      if (suspension === 0) {
        return 'Inactive';
      }
      if (suspension === 1) {
        return 'Active';
      }
      if (suspension === 2) {
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
