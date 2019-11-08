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
          v-else
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
          <td>{{ get_account_status(riderDetails.status) }}</td>
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
        <th>Suspension Status</th>
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
      opened: [],
      riderTable: 0,
    };
  },
  computed: {
    ...mapGetters(['getRider', 'getUserActionSuccess']),
  },
  watch: {
    async getRider(user) {
      await this.requestsingleRdier(user, 'rider');
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

    get_account_status(status) {
      if (status === 1) {
        return 'Active';
      }
      return 'Deactivated';
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
