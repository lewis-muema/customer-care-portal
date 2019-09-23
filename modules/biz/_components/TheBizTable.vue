<template>
  <table id="" class="table  table-bordered table-hover">
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
        <tr @click="toggle('biz')" :class="{ opened: opened.includes('biz') }">
          <td>{{ offset }}</td>
          <td>SENDY {{ userDetails.cop_id }}</td>
          <td>
            <span data-toggle="tooltip" :title="`${myString}`">
              {{
                myTruncatedString !== null
                  ? `${myTruncatedString}...`
                  : myTruncatedString
              }}
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
              getFormattedDate(userDetails.date_signed_up, 'hh.mm a DD/MM/YYYY')
            }}
          </td>
        </tr>
        <tr v-if="opened.includes('biz')">
          <td colspan="8" class="user-details">
            <div class="lower_slide_bit" style="" :id="`bumba_${copID}`">
              <div class="row">
                <TheSideComponent :details="userDetails" />
                <TheMainComponent />
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
</template>
<script>
import { mapGetters } from 'vuex';

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
      opened: [],
      offset: 1,
      status: '',
      showClass: '',
      myTruncatedString: null,
      myString: '',
      rows: [{ id: 1, name: 'Bill', handle: 'bill' }],
    };
  },
  computed: {
    ...mapGetters(['getBizUser']),
  },
  watch: {
    getBizUser(user) {
      return (this.copID = user);
    },
  },
  mounted() {
    this.singleCopUserRequest(this.copID);
    this.smartify_display(this.userDetails.cop_name, 20);
    this.determineStatus();
  },
  methods: {
    singleCopUserRequest(user) {
      this.userDetails = this.bizUser.bussines_list[0];
      return (this.user = this.bizUser);
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
        this.myTruncatedString = myString.substring(0, myLength);
      }
      return (this.myString = myString);
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
