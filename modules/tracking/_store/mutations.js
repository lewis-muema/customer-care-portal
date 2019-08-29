/* eslint no-param-reassign: "error" */
const setTrackingData = (state, payload) => {
  state.tracking_data = payload;
};
const setTrackedOrder = (state, payload) => {
  state.tracked_order = payload;
};
const setIsMQTTConnected = (state, payload) => {
  state.isMQTTConnected = payload;
};
const setMarkers = (state, payload) => {
  payload.forEach((value, i) => {
    let icon = 'destination';
    if (i === 0) {
      icon = 'pickup';
    }
    const marker = {
      position: {
        lat: Number(value.coordinates.split(',')[0]),
        lng: Number(value.coordinates.split(',')[1]),
      },
      icon,
    };
    state.map.markers.push(marker);
  });
};

const setPolyline = (state, payload) => {
  state.map.polyline.path = payload;
};
const setVendorMarkers = (state, payload) => {
  let visible = false;
  if ('page' in state) {
    // order placement
    if (state.page === 0) {
      visible = true;
    } else if ('overide_visible' in payload) {
      // tracking
      visible = true;
    }
  }

  const id = payload.rider_id;
  const value = {
    position: {
      lat: payload.lat,
      lng: payload.lng,
    },
    vendor_type: payload.vendor_type,
    rotation: payload.bearing,
    visible,
  };

  Vue.set(state.map.vendors, id, value);
};

export default {
  setTrackingData,
  setTrackedOrder,
  setIsMQTTConnected,
  setMarkers,
  setPolyline,
  setVendorMarkers,
};
