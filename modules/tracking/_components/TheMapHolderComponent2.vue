<template>
  <span>
    {{ partnerData }}
    <div
      id="map-canvas4"
      style="width: 100%; height: 446px;"
      class="tracking_map"
    ></div>
    <div
      id="over_map"
      :class="
        determine_class(
          orderDetails.delivery_status,
          orderDetails.confirm_status,
        )
      "
    >
      <table width="100%" class="tracking_map_table">
        <tr>
          <td id="f10">
            <span :id="`f2${orderDetails.order_no}`"></span><br />
            <span :id="`f3${orderDetails.order_no}`"></span>
          </td>
          <td id="f20">
            <span :id="`f1${orderDetails.order_no}`"></span>
            <span :id="`f4${orderDetails.order_no}`"></span><br />
            <span :id="`f5${orderDetails.order_no}`"></span>
          </td>
          <td id="f30">
            <span :id="`f11${orderDetails.order_no}`"></span><br />
            <span :id="`f12${orderDetails.order_no}`"></span><br />
          </td>
          <td id="f40">
            <span :id="`f6${orderDetails.order_no}`"></span><br />
            <span :id="`f7${orderDetails.order_no}`"></span>
          </td>
        </tr>
      </table>
    </div>
  </span>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import mqtt from 'mqtt';

export default {
  name: 'TheMapHolderComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order.order_details,
      riderDetails: this.order.rider_details,
      positions: null,
      partnerData: null,
      cityId: 1,
      riderLocation: 0,
      distToPickUp: 'N/A',
      timeToPickUp: 'N/A',
      distToDelivery: 'N/A',
      timeToDelivery: 'N/A',
    };
  },
  computed: {
    ...mapState(['jwtToken']),
  },
  created() {},
  async mounted() {
    const riderArray = [17179];

    const riderData = await this.requestPartnerLastPosition(riderArray);
    this.partnerData = riderData;
    this.initialize(riderData, this.order);
  },
  methods: {
    ...mapActions({
      request_partner_last_position: '$_tracking/request_partner_last_position',
    }),
    determine_class(deliveryStatus, confirmStatus) {
      let displayClass = '';
      if (deliveryStatus === 0 && confirmStatus === 0) {
        displayClass = 'hidden';
      }
      return displayClass;
    },
    async requestPartnerLastPosition(riderArray) {
      const payload = {
        app: 'POSITIONS',
        endpoint: 'partner_cached_position',
        apiKey: true,
        params: { rider_id: riderArray },
      };
      const data = await this.request_partner_last_position(payload);
      const partnerArray = data.partnerArray[0];
      let riderTime = '';
      let riderLat = -1.299923;
      let riderLong = 36.780921;
      let speed = 0;
      let status;
      if (JSON.parse(data.status) && partnerArray !== 'undefined') {
        speed = partnerArray.speed;
        riderLat = partnerArray.lat;
        riderLong = partnerArray.lng;
        riderTime = partnerArray.time;
        status = data.status;
      }
      const partnerData = {
        latitude: riderLat,
        course: 0,
        time: riderTime,
        longitude: riderLong,
        online_status: 'Speed',
        riderName: this.riderDetails.name,
        phoneNo: this.riderDetails.phone_no,
        speed,
        vendorTypeId: this.riderDetails.vendor_type_id,
        status,
      };
      return partnerData;
    },
    initialize(riderData, order) {
      const pickUpLocation = '-1.3001097,36.772822099999985';
      const deliveryLocation = '-1.294629,36.812681999999995';
      const pickUpDelay = 0;
      if (riderData !== null) {
        const partnerLocation = `${riderData.latitude},${riderData.longitude}`;

        const pickupDist = this.distance_earth(partnerLocation, pickUpLocation);
        const pickupTime = Math.round((pickupDist * 60) / 30) + 10;

        const deliveryDist = this.distance_earth(
          partnerLocation,
          deliveryLocation,
        );
        const deliveryTime = Math.round((deliveryDist * 60) / 30) + 10;

        this.riderLocation = partnerLocation;
        this.distToPickUp = pickupDist;
        this.timeToPickUp = pickupTime;
        this.distToDelivery = deliveryDist;
        this.timeToDelivery = deliveryTime;
      }

      // ********** FIX ME!!! Handle time delay ****************//
      this.data_to_display_on_bar(
        order,
        this.distToPickUp,
        this.timeToPickUp,
        this.distToDelivery,
        this.timeToDelivery,
        pickUpDelay,
      );
      const orderNo = order.order_details.order_no;

      this.display_rider_info(riderData, orderNo);

      let myPath = order.paths;
      if (myPath.length <= 2) {
        myPath = [
          {
            coordinates: order.order_details.from,
            name: order.order_details.from_name,
          },
          {
            coordinates: order.order_details.to,
            name: order.order_details.to_name,
          },
        ];
      }

      const polyline = order.order_details.polyline[0];
      const myPathArray = [];

      for (let mp = 0; mp < myPath.length; mp += 1) {
        const cordinate = myPath[mp].coordinates.split(',');
        myPathArray.push([
          myPath[mp].name,
          parseFloat(cordinate[0]),
          parseFloat(cordinate[1]),
          mp + 1,
          'url',
        ]);
      }

      const myLatlng = new google.maps.LatLng(
        riderData.latitude,
        riderData.longitude,
      );
      // const center = new google.maps.LatLng(-1.299923, 36.780921);
      // const mapOptions = {
      //   zoom: 14,
      //   center: myLatlng,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP,
      // };

      console.log('myPath', myLatlng);

      this.initMQTT();
    },
    // eslint-disable-next-line prettier/prettier
    data_to_display_on_bar(order, distToPickUp, timeToPickUp, distToDelivery, timeToDelivery, pickUpDelay) {
      // ********** FIX ME!!! Handle time metrics ****************//
      let f11_data = `Pickup time  0 mins`;
      let f12_data = `Pickup delay 0  mins`;
      let f6_data = `Delivery time 0  mins`;
      let f7_data = `Delivery delay  0  mins`;

      let pickupDist = 0;
      let pickupTime = 0;
      let timeMetric = 0;
      let delay = 0;
      const calculated_sum_id = order.order_details.calculated_sum_id; // ****FIX ME !!! DISPALY CORRECT calculated sum id
      const orderNo = order.order_details.order_no;

      if (typeof calculated_sum_id !== 'undefined') {
        if (calculated_sum_id <= 2) {
          pickupDist = distToPickUp;
          pickupTime = timeToPickUp;
          timeMetric = 0; // ****FIX ME !!! DISPALY CORRECT TIME
          delay = pickUpDelay;
        } else if (Number(calculated_sum_id) === 3) {
          pickupDist = distToDelivery;
          pickupTime = timeToDelivery;
          timeMetric = 0; // ****FIX ME !!! DISPALY CORRECT TIME
          delay = pickUpDelay;
        }
        f11_data = `${pickupDist} kms to pickup`;
        f12_data = `${pickupTime}  mins to pickup`;
        f6_data = `ETD:  ${timeMetric} mins`;
        f7_data = `Pick up delay  ${delay}  mins`;
      }
      document.getElementById(`f11${orderNo}`).innerHTML = f11_data;
      document.getElementById(`f12${orderNo}`).innerHTML = f12_data;
      document.getElementById(`f6${orderNo}`).innerHTML = f6_data;
      document.getElementById(`f7${orderNo}`).innerHTML = f7_data;
    },

    display_rider_info(riderData, orderNo) {
      let rider_online_status;
      let rider_name;
      let rider_phone = 'N/A';
      let rider_speed = 'N/A';
      let simple_split_date;
      let mydate;
      let str_date = 'N/A';
      let f1_data;
      let f2_data;
      let f3_data;
      let f4_data;
      let f5_data;
      let timeDifference;
      let dateDisplay;

      if (riderData !== null) {
        rider_online_status = `${riderData.online_status}  at `;
        rider_name = riderData.riderName;
        rider_phone = riderData.phoneNo;
        rider_speed = `${Math.round(riderData.speed)}  km/h`;
        console.log('huku', rider_online_status);

        if (riderData.time) {
          simple_split_date = riderData.time.split('.');
          const today = this.get_current_timestamp();
          const riderTime = riderData.time;

          const a = new Date(today);
          const b = new Date(riderTime);

          timeDifference = Math.abs(a - b);

          mydate = new Date(simple_split_date[0]);
          str_date = mydate.toString('h:mm tt dd/MM/yyyy');
        }
      }

      if (timeDifference > 3600000) {
        rider_online_status = 'Offline';
        rider_speed = '';
      }

      document.getElementById(`f1${orderNo}`).innerHTML = rider_online_status;
      document.getElementById(`f2${orderNo}`).innerHTML = rider_name;
      document.getElementById(`f3${orderNo}`).innerHTML = rider_phone;
      document.getElementById(`f4${orderNo}`).innerHTML = rider_speed;

      if (timeDifference > 1800000 && timeDifference < 3600000) {
        document.getElementById(
          `f5${orderNo}`,
        ).innerHTML = `Last seen:  ${str_date}`;
      }
    },
    get_current_timestamp() {
      const currentdate = new Date();
      const year = currentdate.getFullYear();
      const month = currentdate.getMonth() + 1;
      const day = currentdate.getDate();
      const hour = currentdate.getHours();
      const minutes = currentdate.getMinutes();
      const seconds = currentdate.getSeconds();
      const today = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
      return today;
    },
    refreshRiderPosition(data) {
      rider_marker.setPosition({
        lat: data.lat,
        lng: data.lng,
      });
    },
    distance_earth(from, to) {
      const fromBit = from.split(',');
      const toBit = to.split(',');

      const lat1 = parseFloat(fromBit[0]);
      const lon1 = parseFloat(fromBit[1]);

      const lat2 = parseFloat(toBit[0]);
      const lon2 = parseFloat(toBit[1]);

      const p = 0.017453292519943295; // Math.PI / 180
      const c = Math.cos;
      const a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

      const distance = Math.round(12742 * Math.asin(Math.sqrt(a)) * 1.4); // 2 * R; R = 6371 km
      return distance;
    },
    getDriverCityAndTrackingNo() {
      const tracking_no = this.riderDetails.serial_no;
      const city_id = Number(this.cityId);
      let city_code = '';
      if (city_id === 1) {
        city_code = 'ke-nairobi';
      } else if (city_id === 2) {
        city_code = 'ke-mombasa';
      } else if (city_id === 3) {
        city_code = 'ke-thika';
      } else if (city_id === 4) {
        city_code = 'ke-nakuru';
      } else if (city_id === 5) {
        city_code = 'ke-kisumu';
      } else {
        city_code = 'ke-nairobi';
      }
      return `${city_code}/${tracking_no}`;
    },

    initMQTT() {
      const clientId = `mqttjs_cc_${Math.random()
        .toString(16)
        .substr(2, 8)}_${Math.random()}_${new Date().getTime()}`;

      const host = 'wss://chat.sendyit.com:443';

      const options = {
        keepalive: 10,
        clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
          topic: 'WillMsg',
          payload: 'Connection Closed abnormally..!',
          qos: 0,
          retain: false,
        },
        username: 'sendy',
        password: '93a3a43dbac9ddd362702fb525b42a2d',
        rejectUnauthorized: false,
      };

      const client = mqtt.connect(host, options);

      client.subscribe(
        `partner_app_positions/${this.getDriverCityAndTrackingNo()}`,
        { qos: 0 },
      );

      client.on('message', (topic, message, packet) => {
        datae = JSON.parse(message.toString());
        this.refreshRiderPosition(datae);
      });

      client.on('close', () => {
        console.log(`${clientId} disconnected`);
      });

      client.on('error', () => {
        console.log(err);
        client.end();
      });
      client.on('connect', () => {
        console.log(`client connected:${clientId}`);
      });
    },
  },
};
</script>
