<template>
  <div>
    <!-- <button @click="testConnection">Rabbit</button> -->
    <div>
      <!-- <button @click="subscribe_to_queue">Subscribe Test</button> -->
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
export default {
  data() {
    return {
      client: null,
      new_ws: null,
      headers: {
        login: 'production',
        passcode: 'Z_EQ-T5rO-oQVx-OqL2',
      },
      url: 'wss://prod-stomp.sendyit.com:15675/ws',
    };
    this.client.debug = function(str) {
      console.log(str);
    };
  },
  methods: {
    connectCallback(message) {
      const exchangeStr = this.client.subscribe(
        '/exchange/order_pushes/sendy.orders.ke',
        ({ body }) => {
          console.log(JSON.parse(body).result);
        },
      );
    },
    errorCallback() {
      console.log('Connection Dropped Trying to Reconnect');
      this.client = Stomp.client(this.url);
      this.client.connect(
        this.headers,
        () => {
          this.connectCallback();
        },
        () => {
          this.errorCallback();
        },
      );
    },
    onmessage(message) {
      // console.log(JSON.parse(body).result);
      console.log(evt);
    },
  },

  mounted() {
    this.client = Stomp.client(this.url);

    this.client.connect(
      this.headers,
      () => {
        this.connectCallback();
      },
      () => {
        this.errorCallback();
      },
    );

    console.log(this.client);
  },
};
</script>
