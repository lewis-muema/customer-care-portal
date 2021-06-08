<template>
  <span :id="`mmm${orderNo}`">
    <div class="order_map_here">
      <div
        :id="`map-canvas4-${orderNo}`"
        :ref="`map-canvas4-${orderNo}`"
        style="width: 100%; height: 446px;"
        class="tracking_map"
      ></div>
      <div
        :id="`over_map_${orderNo}`"
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
              <span :id="`f2${orderNo}`"> {{ rider_name }}</span
              ><br />
              <span :id="`f3${orderNo}`">{{ rider_phone }}</span>
            </td>
            <td id="f20">
              <span :id="`f1${orderNo}`"> {{ rider_online_status }}</span>
              <span :id="`f4${orderNo}`"> {{ rider_speed }}</span
              ><br />
              <span
                :id="`f5${orderNo}`"
                v-if="timeDifference > 1800000 && timeDifference < 3600000"
                >{{ `Last seen:  ${str_date}` }}</span
              >
            </td>
            <td id="f30">
              <span v-if="pickupETA !== null" :id="`f11${orderNo}`">{{
                pickupETA
              }}</span>
              <span :id="`f12${orderNo}`"> {{ pickupTime }}</span
              ><br />
            </td>
            <td id="f40">
              <span v-if="deliveryETA !== null" :id="`f6${orderNo}`">
                {{ deliveryETA }}</span
              ><br />
              <span :id="`f7${orderNo}`"> {{ deliveryTime }}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div align="right">
      <span @click="recheckMap(order)" class="btn btn-primary recheck">
        Recheck
      </span>
    </div>
  </span>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import mqtt from 'mqtt';

export default {
  name: 'TheMapComponent',
  props: ['order', 'eta'],
  props: {
    order: {
      type: Object,
      required: true,
    },
    eta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderDetails: this.order.order_details,
      riderDetails: this.order.rider_details,
      orderNo: this.order.order_details.order_no,
      positions: null,
      partnerData: null,
      cityId: 1,
      riderLocation: 0,
      distToPickUp: 'N/A',
      timeToPickUp: 'N/A',
      distToDelivery: 'N/A',
      timeToDelivery: 'N/A',
      riderMarker: {},
      pickupETA: null,
      pickupTime: '',
      deliveryETA: null,
      deliveryTime: '',
      rider_online_status: '',
      rider_name: '',
      rider_phone: '',
      rider_speed: '',
      str_date: '',
      timeDifference: '',
    };
  },
  computed: {
    ...mapState(['jwtToken']),
    pickUpLocation() {
      return this.orderDetails.from;
    },
    deliveryLocation() {
      return this.orderDetails.to;
    },
  },
  created() {},
  async mounted() {
    const riderArray = [this.order.rider_details.rider_id];
    const riderData = await this.requestPartnerLastPosition(riderArray);
    this.partnerData = riderData;
    this.initialize(riderData, this.order);
    this.data_to_display_on_bar(this.order, this.eta);
    this.display_rider_info(riderData, this.orderNo);
  },
  methods: {
    ...mapActions({
      request_partner_last_position: 'orders/request_partner_last_position',
    }),
    determine_class(deliveryStatus, confirmStatus) {
      let displayClass = '';
      if (deliveryStatus === 0 && confirmStatus === 0) {
        displayClass = 'hidden';
      }
      return `${displayClass} map_bar`;
    },
    recheckMap(order) {
      this.initialize(this.partnerData, order);
    },
    async requestPartnerLastPosition(riderArray) {
      const payload = {
        app: 'POSITIONS',
        endpoint: 'partner_cached_position',
        apiKey: true,
        params: { rider_id: riderArray },
      };
      let data = null;

      try {
        const lastPosition = await this.request_partner_last_position(payload);
        data = lastPosition.data;
      } catch (error) {
        this.updateNotification(
          'Something went wrong. Failed to retrieve partner last position',
        );
      }
      const defaultLocations = this.pickUpLocation.split(',');

      let riderTime = '';
      let riderLat = defaultLocations[0];
      let riderLong = defaultLocations[1];
      let speed = 0;
      let status = data.status;
      if (JSON.parse(data.status)) {
        const partnerArray = data.partnerArray[0];
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
      const pickUpLocation = this.pickUpLocation;
      const deliveryLocation = this.deliveryLocation;
      const pickUpDelay = 0;
      let map = {};
      let marker = {};
      let myLatlngr;

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

      this.data_to_display_on_bar(order, this.eta);
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
      if (
        Object.prototype.hasOwnProperty.call(order, 'freight_details') &&
        order.freight_details
      ) {
        const locations = [];
        order.freight_details.containers.container_details[0].path[0].forEach(
          row => {
            locations.push(row);
          },
        );
        myPath = locations;
      }
      const polyline = order.order_details.polyline[0];
      const myPathArray = [];
      for (let mp = 0; mp < myPath.length; mp += 1) {
        if (myPath.length) {
          const cordinate = myPath[mp].coordinates.split(',');
          myPathArray.push([
            myPath[mp].name,
            parseFloat(cordinate[0]),
            parseFloat(cordinate[1]),
            mp + 1,
            'url',
            myPath[mp].waypoint_type
              ? myPath[mp].waypoint_type.toLowerCase()
              : '',
          ]);
        }
      }
      // eslint-disable-next-line prettier/prettier
      const centerLat = riderData.latitude;
      // eslint-disable-next-line prettier/prettier
      const centerLong = riderData.longitude;
      const defaultLocations = this.pickUpLocation.split(',');

      let myLatlng = new google.maps.LatLng(centerLat, centerLong);
      const center = new google.maps.LatLng(
        defaultLocations[0],
        defaultLocations[1],
      );

      const mapOptions = {
        zoom: 14,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      const divRef = `map-canvas4-${this.orderNo}`;
      // eslint-disable-next-line prettier/prettier
      const mapID = document.getElementById(`map-canvas4-${this.orderNo}`);
      map = new google.maps.Map(mapID, mapOptions);

      const locations = myPathArray;

      if (riderData !== null) {
        myLatlngr = new google.maps.LatLng(
          riderData.latitude,
          riderData.longitude,
        );
        if (riderData.status) {
          let vendorIcon = this.show_vendor_image(order, riderData);
          vendorIcon = {
            url: vendorIcon, // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
          };
          this.riderMarker = new google.maps.Marker({
            position: myLatlngr,
            icon: vendorIcon,
            map,
            title: riderData.name,
          });
        }
      }
      for (let i = 0; i < locations.length; i += 1) {
        let imgIcon =
          locations[i][5] === 'pickup'
            ? 'https://images.sendyit.com/web_platform/orders/pickup_placeholder.png'
            : 'https://images.sendyit.com/web_platform/orders/destination_placeholder.png';

        if (i === 0) {
          imgIcon =
            'https://images.sendyit.com/web_platform/orders/pickup_placeholder.png';
        }

        imgIcon = {
          url: imgIcon, // url
          scaledSize: new google.maps.Size(23, 40), // scaled size
        };

        myLatlng = new google.maps.LatLng(locations[i][1], locations[i][2]);
        marker = new google.maps.Marker({
          position: myLatlng,
          icon: imgIcon,
          map,
          title: locations[i][0],
        });
      }

      const allpaths = [];
      const allpaths1 = [];

      for (let i = 0; i < locations.length; i += 1) {
        allpaths.push(new google.maps.LatLng(locations[i][1], locations[i][2]));
      }
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      const decodedLevels = this.decodeLevels(
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      );

      const setRegion = new google.maps.Polyline({
        path: decodedPath,
        strokeColor: '#1691BF',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map,
      });
      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < locations.length; i += 1) {
        const lat = parseFloat(locations[i][1]);
        const long = parseFloat(locations[i][2]);
        const point = new google.maps.LatLng(lat, long);
        bounds.extend(point);
      }

      if (riderData !== null) {
        bounds.extend(myLatlngr);
      }

      // center the map to a specific spot (city)
      map.setCenter(center);

      // center the map to the geometric center of all markers
      map.setCenter(bounds.getCenter());

      map.fitBounds(bounds);

      // remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1);

      // set a minimum zoom
      // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }

      this.initMQTT();
    },
    decodeLevels(encodedLevelsString) {
      const decodedLevels = [];

      for (let i = 0; i < encodedLevelsString.length; ++i) {
        const level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
      }

      return decodedLevels;
    },
    displayDateTime(date) {
      let displayString = '--';
      if (typeof date !== 'undefined') {
        displayString = this.getFormattedDate(date, 'h.mm a DD/MM/YYYY');
      }
      return displayString;
    },
    displayDateRange(dateRange) {
      let displayString = '--';
      if (typeof dateRange !== 'undefined') {
        const range = dateRange.split('to');

        const eta_split = dateRange.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const timeFrom = this.getFormattedDate(start, 'h.mm a DD/MM/YYYY');
        const timeTo = this.getFormattedDate(end, 'h.mm a DD/MM/YYYY');
        displayString = `${timeFrom} - ${timeTo}`;
      }
      return displayString;
    },
    // eslint-disable-next-line prettier/prettier
    data_to_display_on_bar(order, ETA) {
      this.pickupTime =
        typeof ETA.picked !== 'undefined'
          ? `Pickup Time: ${this.displayDateTime(ETA.picked)}`
          : '';
      this.pickupETA =
        typeof ETA.etp !== 'undefined'
          ? `Pickup ETA: ${this.displayDateRange(ETA.etp)} `
          : '';
      this.deliveryTime =
        typeof ETA.delivered !== 'undefined'
          ? `Delivery Time: ${this.displayDateTime(ETA.delivered)} `
          : '';
      this.deliveryETA =
        typeof ETA.etd !== 'undefined'
          ? `Delivery ETA: ${this.displayDateRange(ETA.etd)} `
          : '';
      const orderNo = order.order_details.order_no;
    },

    show_vendor_image(order, riderData) {
      const deliveryStatus = order.order_details.delivery_status;
      const confirmStatus = order.order_details.confirm_status;
      let vendor_icon = '';
      const vendorType = riderData.vendorTypeId;

      if (
        deliveryStatus === 2 ||
        (deliveryStatus === 0 && confirmStatus === 1)
      ) {
        vendor_icon = `https://images.sendyit.com/web_platform/vendor_type/top/${vendorType}.png`;
      }
      return vendor_icon;
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
      this.rider_online_status = rider_online_status;
      this.rider_name = rider_name;
      this.rider_phone = rider_phone;
      this.rider_speed = rider_speed;
      this.str_date = str_date;
      this.timeDifference = timeDifference;
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
      this.riderMarker.setPosition({
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
        const datae = JSON.parse(message.toString());
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
