<template>
  <table id="peer_list" class="table  table-bordered table-hover">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Sign Up Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="userID === null">
        <td colspan="5">Search to view User details.</td>
      </tr>
      <template v-else>
        <tr
          @click="toggle('peer')"
          :class="{ opened: opened.includes('peer') }"
        >
          <td>{{ offset }}</td>
          <td>{{ userDetails.user_name }}</td>
          <td>{{ userDetails.user_email }}</td>
          <td>{{ userDetails.user_phone }}</td>
          <td>
            {{
              getFormattedDate(userDetails.date_signed_up, 'hh.mm a DD/MM/YYYY')
            }}
          </td>
        </tr>
        <tr v-if="opened.includes('peer')">
          <td colspan="5" class="user-details">
            <div class="lower_slide_bit" style="" :id="`bumba_${userID}`">
              <div class="row">
                <div class="box box-primary peer-main">
                  <TheUserActionsComponent :user="userInfo" />
                  <TheUserDetailsComponent :user="userInfo" />
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <th>&nbsp;</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Sign Up Date</th>
      </tr>
    </tfoot>
  </table>
</template>
<script>
import { mapGetters } from 'vuex';
import TheUserActionsComponent from '~/modules/peer/_components/TheUserActionsComponent';
import TheUserDetailsComponent from '~/modules/peer/_components/TheUserDetailsComponent';

export default {
  name: 'ThePeerTable',
  components: {
    TheUserActionsComponent,
    TheUserDetailsComponent,
  },
  data() {
    return {
      userID: null,
      user: null,
      userInfo: null,
      userDetails: null,
      opened: [],
      offset: 1,
      status: '',
      showClass: '',
    };
  },
  computed: {
    ...mapGetters(['getPeerUser']),
  },
  watch: {
    getPeerUser(user) {
      return (this.userID = user);
    },
  },
  mounted() {
    this.singlePeerUserRequest(this.userID);
  },
  methods: {
    singlePeerUserRequest(user) {
      this.userDetails = this.peerUser.user_details;
      this.userInfo = this.peerUser;

      return (this.user = this.peerUser);
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
  },
};
</script>
<style>
.user-details {
  padding: 0px;
  background-color: rgba(245, 245, 245, 0.56) !important;
}
</style>
