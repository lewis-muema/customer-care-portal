const getTrackingData = state => state.tracking_data;
const getTrackedOrder = state => state.tracked_order;
const getIsMQTTConnected = state => state.isMQTTConnected;

export default {
  getTrackingData,
  getTrackedOrder,
  getIsMQTTConnected,
};
