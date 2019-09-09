const getTrackingData = state => state.tracking_data;
const getTrackedOrder = state => state.tracked_order;
const getIsMQTTConnected = state => state.isMQTTConnected;
const getMarkers = state => state.map.markers;
const getPolyline = state => state.map.polyline;
const getVendors = state => state.map.vendors;
const getOrders = state => state.orders;
const getOrderColumns = state => state.orderColumns;
const getSampleData = state => state.sampleData;

export default {
  getTrackingData,
  getTrackedOrder,
  getIsMQTTConnected,
  getMarkers,
  getPolyline,
  getVendors,
  getOrders,
  getOrderColumns,
  getSampleData,
};
