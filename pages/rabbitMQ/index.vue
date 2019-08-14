<template>
  <div>
    <!-- <button @click="testConnection">Rabbit</button> -->
    <div>
      <button @click="subscribe_to_queue">Subscribe Test</button>
    </div>
    <div id="debug"></div>
  </div>
</template>
<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"
></script>
<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js"
></script>
<script>
const url =
  'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT';

export default {
  data() {
    return {
      client: null,
      stuff: '',
    };
    this.client.debug = function(str) {
      console.log(str);
    };
  },
  methods: {
    subscribe_to_queue() {
      const exchangeStr = this.client.subscribe(
        '/exchange/order_actions/sendy.ordersactions.ke',
      );
      // const id2 = this.client.subscribe(exchangeStr);
      // console.log(exchangeStr);
    },
  },

  mounted() {
    const url =
      'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT';

    this.client = Stomp.client(url);
    const headers = {
      login: 'staging',
      passcode: '0FAHmQQmjfsIXdro',
    };
    const connectCallback = function() {
      console.log('maybe');
    };
    const errorCallback = function() {
      console.log('sure');
    };
    this.client.connect(headers, connectCallback, errorCallback);
    // console.log(Stomp);
  },
};
</script>
