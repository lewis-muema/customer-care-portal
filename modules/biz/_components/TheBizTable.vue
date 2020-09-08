<template>
  <div class="table-responsive">
    <table class="table  table-bordered table-hover" :key="bizTable">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>Acc No</th>
          <th>Cop Name</th>
          <th>Cop Phone</th>
          <th>Email</th>
          <th>Acc Manager</th>

          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="copID === null">
          <td colspan="8">Search to view Biz details.</td>
        </tr>
        <template v-else>
          <tr v-if="userDetails === null">
            <i class="fa fa-spinner fa-spin loader"></i>
          </tr>
          <tr
            v-else
            @click="toggle('biz')"
            :class="{ opened: opened.includes('biz') }"
          >
            <td>{{ offset }}</td>
            <td>SENDY {{ userDetails.cop_id }}</td>
            <td>
              <span data-toggle="tooltip" :title="`${userDetails.cop_name}`">
                {{ smartify_display(userDetails.cop_name, 20) }}
              </span>
            </td>
            <td align="right">{{ userDetails.cop_phone }}</td>
            <td>{{ userDetails.cop_email }}</td>
            <td>
              {{
                userDetails.account_manager
                  ? userDetails.account_manager
                  : 'No account manager'
              }}
            </td>
            <td>
              <span :class="`label label-${showClass}`"> {{ status }}</span>
            </td>
            <td>
              {{
                getFormattedDate(
                  userDetails.date_signed_up,
                  'hh.mm a DD/MM/YYYY',
                )
              }}
            </td>
          </tr>
          <tr v-if="opened.includes('biz')">
            <td colspan="8" class="user-details">
              <div class="lower_slide_bit" style="" :id="`bumba_${copID}`">
                <div class="row">
                  <TheSideComponent :details="userDetails" />
                  <TheMainComponent :user="userInfo" />
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <th>&nbsp;</th>
          <th>Acc No</th>
          <th>Cop Name</th>
          <th>Cop Phone</th>
          <th>Email</th>
          <th>Acc Manager</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'TheBizTable',
  components: {
    TheSideComponent: () =>
      import('~/modules/biz/_components/TheSideComponent'),
    TheMainComponent: () =>
      import('~/modules/biz/_components/TheMainComponent'),
  },
  data() {
    return {
      copID: null,
      user: null,
      userDetails: null,
      userInfo: null,
      opened: [],
      offset: 1,
      bizTable: 0,
    };
  },
  computed: {
    ...mapGetters(['getBizUser', 'getUserActionSuccess']),
    status() {
      let status = 'Pending';
      if (this.userDetails !== null && this.userDetails.approved === 1) {
        status = 'Approved';
      }
      return status;
    },
    showClass() {
      let showClass = 'warning';
      if (this.userDetails !== null && this.userDetails.approved === 1) {
        showClass = 'success';
      }
      return showClass;
    },
  },
  watch: {
    getBizUser(user) {
      this.singleCopUserRequest(user, 'cop');
      return (this.copID = user);
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
    ...mapActions({
      request_single_user: 'request_single_user',
    }),
    async singleCopUserRequest(user, userType) {
      this.opened = [];
      this.userInfo = null;
      this.userDetails = null;
      const payload = { userID: user, userType };
      try {
        const data = await this.request_single_user(payload);
        this.userDetails = data.user_details;
        return (this.userInfo = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
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
    determineStatus() {
      let status = 'Pending';
      let showClass = 'warning';
      if (this.userDetails.approved === 1) {
        status = 'Approved';
        showClass = 'success';
      }
      this.showClass = showClass;
      return (this.status = status);
    },
    smartify_display(myString, myLength) {
      if (myString !== null && parseInt(myString.length) > myLength) {
        myString = myString.substring(0, myLength);
        myString = `${myString}...`;
      }
      return myString;
    },
    forceRerender() {
      this.bizTable += 1;
    },
  },
};
</script>
<style scoped>
.user-details {
  padding: 0px;
  background-color: rgba(245, 245, 245, 0.56) !important;
}
</style>
