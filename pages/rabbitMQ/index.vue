<template>
  <div>
    <button @click="testConnection">Rabbit</button>
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
    };
  },
  methods: {
    testConnection() {
      var headers = {
        login: 'staging',
        passcode: '0FAHmQQmjfsIXdro',
      };
      var connectCallback = function() {
        console.log('maybe');
      };
      var errorCallback = function() {
        console.log('sure');
      };
      this.client.connect(headers, connectCallback, errorCallback);
      console.log(Stomp);
      console.log('we are here');
    },
    subscribe_to_queue() {
      const exchangeStr = this.client.subscribe(
        '/exchange/order_actions/sendy.ordersactions.ke',
      );
      // const id2 = this.client.subscribe(exchangeStr);
      this.client.debug = function(str) {
        $('#debug').append(str + '\n');
        console.log(this.client.debug);
      };
      console.log(exchangeStr);
    },
  },

  mounted() {
    const url =
      'wss://rabbitmqtest.sendyit.com:8443/ws?apikey=4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT';

    this.client = Stomp.client(url);
  },
};
</script>
