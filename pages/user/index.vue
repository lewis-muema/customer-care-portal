<template>
  <div>
    <TheBreadCrumbView :route="page" />
    <section class="content">
      <div class="row">
        <div class="box">
          <div class="box-body box box-primary">
            <div v-if="user === null" class="text-center">
              <i class="fa fa-spinner fa-spin loader text-center"></i>
            </div>
            <div v-else>
              <h3 class="text-center">Caller Details</h3>
              <table class="table table-bordered col-md-8 offset-md-2">
                <tbody>
                  <tr>
                    <td width="50%"><strong>Caller Name</strong></td>
                    <td>
                      {{ user.caller_name !== '' ? user.caller_name : 'N/A' }}
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"><strong>Caller Type</strong></td>
                    <td>
                      {{ user.caller_type !== '' ? user.caller_type : 'N/A' }}
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"><strong>Caller Phone</strong></td>
                    <td>
                      {{ user.phone_no !== '' ? user.phone_no : 'N/A' }}
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"><strong>Caller Account ID</strong></td>
                    <td>
                      {{ user.account_id !== '' ? user.account_id : 'N/A' }}
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"><strong>Caller Email</strong></td>
                    <td>
                      {{ user.email !== '' ? user.email : 'N/A' }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3 class="text-center">Latest Order Details</h3>
              <table class="table table-bordered col-md-8 offset-md-2">
                <tbody>
                  <tr>
                    <td width="50%"><strong>Order No</strong></td>
                    <td>
                      {{
                        user.latest_order.order_no !== null
                          ? user.latest_order.order_no
                          : 'N/A'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td width="50%"><strong>Order status</strong></td>
                    <td>
                      {{
                        user.latest_order.status !== null
                          ? user.latest_order.status
                          : 'N/A'
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';

export default {
  name: 'user',
  layout: 'users',
  components: {
    TheBreadCrumbView,
  },
  data() {
    return {
      explorerError: null,
      user: null,
      page: 'user',
    };
  },
  computed: {
    contactID() {
      return this.$route.query ? this.$route.query.contactID : null;
    },
    phone() {
      return this.$route.query ? this.$route.query.phone : null;
    },
  },
  mounted() {
    if (this.phone !== null) {
      this.retrieve_user();
    } else {
      this.explorerError =
        'Could not retrieve user details. Check the user phone number';
    }
  },
  methods: {
    ...mapActions(['explorer']),

    async retrieve_user() {
      try {
        const user = await this.explorer(this.phone);
        this.user = user;
      } catch (error) {
        this.explorerError =
          'Could not retrieve user details. Check the user phone number';
      }
    },
  },
};
</script>
