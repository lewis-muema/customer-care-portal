<template>
  <div class="table-responsive">
    <table
      id="peer_list"
      class="table  table-bordered table-hover"
      :key="peerTable"
    >
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
        <template v-else-if="details !== null">
          <tr v-if="loading">
            <i class="fa fa-spinner fa-spin loader"></i>
          </tr>
          <tr
            v-else
            @click="toggle('peer')"
            :class="{ opened: opened.includes('peer') }"
          >
            <td>{{ offset }}</td>
            <td>{{ details.user_name }}</td>
            <td>{{ details.user_email }}</td>
            <td>{{ details.user_phone }}</td>
            <td>
              {{
                getFormattedDate(details.date_signed_up, 'hh.mm a DD/MM/YYYY')
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
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

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
      details: null,
      opened: [],
      offset: 1,
      status: '',
      showClass: '',
      peerTable: 0,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['getPeerUser', 'getUserActionSuccess']),
  },
  watch: {
    getPeerUser(user) {
      this.loading = true;
      this.singlePeerUserRequest(user, 'peer');
      return (this.userID = user);
    },
    async getUserActionSuccess(status) {
      const arr = [];
      this.userInfo = null;
      this.details = null;
      const index = this.opened.indexOf('peer');
      this.opened.splice(index, 1);
      this.forceRerender();
      this.updateSuccess(false);
      this.updateClass('');
      this.updateErrors(arr);
      await this.singlePeerUserRequest(this.userID, 'peer');
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
    async singlePeerUserRequest(user, userType) {
      this.opened = [];
      this.details = null;
      this.userInfo = null;
      this.forceRerender();
      const payload = { userID: user, userType };
      try {
        const data = await this.request_single_user(payload);
        this.details = data.user_details;
        this.loading = false;
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
    forceRerender() {
      this.peerTable += 1;
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
