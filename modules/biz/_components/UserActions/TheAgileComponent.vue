<template>
  <div>
    <form id="agile-form" @submit.prevent="pushToAgile">
      Push the corporate to Agile <br /><br />

      <button class="btn btn-primary action-button">
        Push to Agile
      </button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'TheAgileComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    // doSend('{"channel":"customer_support_peer_biz","data_set":"cc_actions","action_id":12, "action_data":{"fname":"'+fname+'","lname":"'+lname+'","cop_name":" '+cop_name+'","cop_email":"'+cop_email+'","cop_address":"'+cop_address+'","cop_phone":"'+cop_phone+'"}, "request_id":17}');

    pushToAgile() {
      const notification = [];
      // let actionClass = '';
      const str = this.user.user_details.cop_contact_person;
      const name = str.split(' ');
      console.log('name', name);
      // const payload = {
      //   app: 'CUSTOMERS_APP',
      //   endpoint: 'sendy/cc_actions',
      //   apiKey: true,
      //   params: {
      //     channel: 'customer_support_peer_biz',
      //     data_set: 'cc_actions',
      //     action_id: 12,
      //     action_data: {
      //       fname: this.rider,
      //       cop_id: this.copID,
      //     },
      //     request_id: 18,
      //     action_user: this.actionUser,
      //   },
      // };
    },
  },
};
</script>
