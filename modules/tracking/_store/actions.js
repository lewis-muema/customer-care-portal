/* eslint consistent-return: "error" */
/* eslint no-unused-vars: "error" */
/* eslint consistent-return: ["error", { "treatUndefinedAsUnspecified": true }] */

import mqtt from 'mqtt';

const getTrackingData = function getTrackingData(
  { commit, dispatch, state },
  data,
) {
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'pending_delivery',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        if (response.status) {
          if (state.tracked_order === data.order_no) {
            commit('setTrackingData', response.data);
            commit('$_orders/setPolyline', response.data.polyline, {
              root: true,
            });
            commit('$_orders/setMarkers', response.data.path, {
              root: true,
            });
          }
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error => {
        reject(error);
        // handle failure to dispatch to global store
      },
    );
  });
};

const cancelOrder = function cancelOrder({ dispatch }, data) {
  const payload = {
    app: 'PRIVATE_API',
    endpoint: 'cancel_order',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
        // handle failure to dispatch to global store
      },
    );
  });
};

// eslint consistent-return: "error"
const trackMQTT = function trackMQTT({ commit, state }) {
  if (state.tracking_data.confirm_status > 0) {
    const trackingNo = state.tracking_data.rider.phone_no_1;
    const cityId = state.tracking_data.city_id;
    let cityCode = '';

    switch (cityId) {
      case 1:
        cityCode = 'ke-nairobi';
        break;
      case 2:
        cityCode = 'ke-mombasa';
        break;
      case 3:
        cityCode = 'ke-thika';
        break;
      case 4:
        cityCode = 'ke-nakuru';
        break;
      case 5:
        cityCode = 'ke-kisumu';
        break;
      case 6:
        cityCode = 'ke-eldoret';
        break;
      case 7:
        cityCode = 'ug-kampala';
        break;
      default:
        cityCode = 'ke-nairobi';
    }

    const uri = `${cityCode}/${trackingNo}`;

    const clientId = `mqttjs_wtp_${Math.random()
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

    client.on('error', () => {
      // handle error
      client.end();
    });

    client.on('connect', () => {
      commit('setIsMQTTConnected', true);
    });

    client.subscribe(`partner_app_positions/${uri}`, {
      qos: 0,
    });

    client.on('message', (topic, message) => {
      const vendor = JSON.parse(message.toString());
      vendor.overide_visible = true;
      commit('$_orders/setVendorMarkers', vendor, { root: true });
    });

    client.on('close', () => {
      // closed
    });
  }
};

const runningBalance = function runningBalance({ dispatch }, data) {
  const payload = {
    app: 'PRIVATE_API',
    endpoint: 'running_balance',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
        // handle failure to dispatch to global store'
      },
    );
  });
};

const saveOrderDetails = function saveOrderDetails({ dispatch }, data) {
  const payload = {
    values: data,
    app: 'NODE_PRIVATE_API',
    endpoint: 'remember_order',
  };
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
      },
    );
  });
};

const requestETASms = function requestETASms({ dispatch }, data) {
  const payload = {
    values: data,
    app: 'PRIVATE_API',
    endpoint: 'send_sms',
  };
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        resolve(response);
      },
      error => {
        reject(error);
      },
    );
  });
};

const requestRiderLastPosition = function requestRiderLastPosition(
  { dispatch },
  data,
) {
  const payload = {
    values: data,
    app: 'NODE_PRIVATE_API',
    endpoint: 'last_partner_position',
  };
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        reject(error);
      },
    );
  });
};

export default {
  getTrackingData,
  cancelOrder,
  trackMQTT,
  runningBalance,
  saveOrderDetails,
  requestETASms,
  requestRiderLastPosition,
};
