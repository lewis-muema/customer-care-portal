<template>
  <div>
    <TheBreadCrumbView :route="page" />
    <section class="content">
      <div class="row">
        <div class="box box-info">
          <div class="box-body">
            <div v-if="user === null" class="text-center">
              <i class="fa fa-spinner fa-spin loader text-center"></i>
            </div>
            <div v-else class="row">
              <div class="info-holder col-md-10 offset-md-1 3cx">
                <br />
                <h4 class="text-center">User Calling ....</h4>
                <hr />
                <div class="row">
                  <div class="col-md-6 details">
                    <table class="table info-tb">
                      <tr>
                        <td><strong>Caller Name : </strong></td>
                        <td>
                          {{
                            user.caller_name !== '' ? user.caller_name : 'N/A'
                          }}
                        </td>
                        <td><strong>Date signed In : </strong></td>
                        <td>
                          {{
                            user.date_signed_up
                              ? getFormattedDate(
                                  user.date_signed_up,
                                  'hh.mm a DD/MM/YYYY',
                                )
                              : '-'
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Caller Type : </strong></td>
                        <td>
                          {{
                            user.caller_type !== '' ? user.caller_type : 'N/A'
                          }}
                        </td>
                        <td><strong>Account ID. : </strong></td>
                        <td>
                          {{ user.account_id !== '' ? user.account_id : 'N/A' }}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Phone No. : </strong></td>
                        <td>
                          {{ user.phone_no !== '' ? user.phone_no : 'N/A' }}
                        </td>
                        <td><strong>Email. : </strong></td>
                        <td>
                          {{ user.email !== '' ? user.email : 'N/A' }}
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="col-md-6 details ticket-holder">
                    <div class="ticket">
                      <TheTicketComponent
                        :category="category"
                        :ticket="ticketData"
                      />
                    </div>
                  </div>
                  <br />
                </div>
                <div class="row" v-if="order !== null">
                  <h4 class="heading">Latest Orders</h4>
                  <hr />
                  <table class="table table-bordered col-md-11 table-3cx">
                    <thead>
                      <th>Status</th>
                      <th>Order No</th>
                      <th>Rider</th>
                      <th>Time</th>
                      <th>Pick Up</th>
                      <th>Destination</th>
                      <th>Amount</th>
                      <th>Rider Amount</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ order.order_details.order_status }}</td>
                        <td>{{ order.order_details.order_no }}</td>
                        <td>{{ order.rider_details.name }}</td>
                        <td>
                          {{
                            getFormattedDate(
                              order.order_details.pickup_time,
                              'hh.mm a DD/MM/YYYY',
                            )
                          }}
                        </td>
                        <td>{{ order.order_details.from_name }}</td>
                        <td>{{ order.order_details.to_name }}</td>
                        <td>
                          {{ order.payment_details.order_currency }}.
                          {{ order.payment_details.order_amount }}
                        </td>
                        <td>
                          {{ order.rider_details.default_currency }}.
                          {{ order.rider_details.rider_amount }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="row"
                  v-if="statement !== null && statement.length !== 0"
                >
                  <h4 class="heading">Latest Statement</h4>
                  <hr />
                  <table class="table table-bordered col-md-11 table-3cx">
                    <thead>
                      <th>Txn</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>RB</th>
                      <th>Method</th>
                      <th>Narrative</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ statement[0].txn }}</td>
                        <td>
                          {{
                            getFormattedDate(
                              statement[0].date_time,
                              'hh.mm a DD/MM/YYYY',
                            )
                          }}
                        </td>
                        <td>
                          <span v-if="user.caller_type !== 'owner'">
                            {{ user.currency !== '' ? user.currency : '' }}.
                          </span>
                          {{ statement[0].amount }}
                        </td>
                        <td>
                          <span v-if="user.caller_type !== 'owner'">
                            {{ user.currency !== '' ? user.currency : '' }}.
                          </span>
                          {{ statement[0].rb }}
                        </td>
                        <td>{{ statement[0].pay_method }}</td>
                        <td>{{ statement[0].pay_narrative }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';

import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import TheBreadCrumbView from '@/components/Navigation/TheBreadCrumbView';

export default {
  name: 'user',
  layout: 'users',
  components: {
    TheBreadCrumbView,
    TheTicketComponent: () => import('./TheUserTicketingComponent'),
  },
  data() {
    return {
      explorerError: null,
      user: null,
      page: 'user',
      userDetails: {},
      order: null,
      statement: null,
      search: false,
      types: {
        'peer|rider': 'rider',
        'peer|owner|rider': 'rider',
        'owner|rider': 'rider',
        'peer|owner': 'peer',
        rider: 'riders',
        cop: 'biz',
        peer: 'peer',
        owner: 'owner',
      },
    };
  },
  computed: {
    contactID() {
      return this.$route.query ? this.$route.query.contactID : null;
    },
    phone() {
      return this.$route.query ? this.$route.query.phone : null;
    },
    category() {
      let cat = null;
      if (this.user.caller_type) {
        const type = this.user.caller_type;
        const allTypes = this.types;
        cat = allTypes[type] ? allTypes[type] : 'rider';
      }
      return cat;
    },
    ticketData() {
      const userName = this.user.caller_name;
      const id = this.user.account_id;

      const data = {
        id,
        title: `SENDY${id} ( ${this.category})`,
        customer: {
          firstName: userName,
          lastName: '.',
          email: this.user.email,
          phone: this.user.phone_no,
        },
      };
      return data;
    },
  },
  async mounted() {
    if (this.phone !== null) {
      await this.retrieve_user();
      if (this.user !== null) {
        const latestOrder = this.user.latest_order.order_no;
        if (latestOrder !== null && latestOrder !== 'WIP') {
          const orderNo = this.user.latest_order.order_no;
          await this.singleOrderRequest(orderNo);
        }
        const cat = this.category === 'biz' ? 'cop' : this.category;
        await this.singleUserRequest(this.user.account_id, cat);
      }
    } else {
      this.explorerError =
        'Could not retrieve user details. Check the user phone number';
    }
  },
  methods: {
    ...mapActions([
      'explorer',
      'request_single_order',
      'request_single_user',
      'request_single_rider',
      'request_owner_statement',
    ]),
    display_search() {
      this.search = true;
    },

    async retrieve_user() {
      try {
        const user = await this.explorer(this.phone);
        this.user = user;
      } catch (error) {
        this.explorerError =
          'Could not retrieve user details. Check the user phone number';
      }
    },
    async singleOrderRequest(orderNo) {
      try {
        const data = await this.request_single_order(orderNo);
        return (this.order = data);
      } catch {
        this.errors.push('Failed to retrieve order details');
      }
    },
    async singleUserRequest(ID, userType) {
      const payload = { userID: ID, userType, riderID: ID };
      let data = null;
      try {
        switch (userType) {
          case 'peer':
            data = await this.request_single_user(payload);
            this.statement = data.payments;
            break;
          case 'cop':
            data = await this.request_single_user(payload);
            this.statement = data.payments;
            break;
          case 'rider':
            data = await this.request_single_rider(payload);
            this.statement = data.current_list;
            break;
          case 'owner':
            // eslint-disable-next-line no-case-declarations
            const pload = {
              app: 'PARTNER_API',
              endpoint: 'partner_portal/owner_statement',
              apiKey: false,
              params: {
                owner_id: ID,
                from: this.user.date_signed_up,
                to: moment.utc().format(),
              },
            };
            data = await this.request_owner_statement(pload);
            if (data.status) {
              const payments = data.msg.statement;
              if (payments.length !== 0) {
                const arr = {
                  txn: payments[0].txn,
                  amount: payments[0].amount,
                  date_time: payments[0].pay_time,
                  rb: payments[0].running_balance,
                  pay_method: payments[0].pay_narrative,
                  pay_narrative: payments[0].pay_narrative,
                };
                this.statement = [];
                this.statement.push(arr);
              }
            }
            break;
          default:
        }
        return this.statement;
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
  },
};
</script>
<style scoped>
.info-holder {
  border: 1px solid #212529;
  height: auto;
}
hr {
  margin-top: 0;
  border-top: 1px solid #212529;
}
.title {
  margin: 20px 0 0 0;
  font-weight: 700;
  font-size: inherit;
}
.details {
  width: 49%;
  float: left;
}
.info-tb td,
.info-tb th {
  border-top: none;
}
.ticket {
  border: 1px solid #212529;
}
.ticket-holder h4 {
  font-size: 14px;
}
.ticket-holder .form-control {
  width: 100% !important;
}
.heading {
  margin-left: 25px;
}
.table-3cx {
  margin-left: 25px;
}
.table-bordered th {
  border: 1px solid #f5f7fa;
}
.table-bordered > tbody > tr > td {
  border: 1px solid #212529;
}
.table-3cx > thead > th {
  border: 1px solid #212529;
}
.ticket-holder {
  padding-right: 6em;
}
.ticket > .form-inline > .form-group > .form-control {
  width: 100%;
}
.form-control {
  display: inline-block;
  width: 100% !important;
  vertical-align: middle;
  border: 1px solid #212529 !important;
}
.vs__dropdown-toggle {
  border: none;
}
.search-button {
  margin: 17px 60px 0 0;
}
</style>
