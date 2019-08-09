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

export default {
  setTrackingData,
  setTrackedOrder,
  setIsMQTTConnected,
};
