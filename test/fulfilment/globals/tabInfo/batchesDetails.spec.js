import Vue from 'vue';
import Vuex from 'vuex';

import {shallowMount, createLocalVue } from '@vue/test-utils'
import batchesDetails from '@/modules/fulfilment/globals/_components/tabInfo/batchesDetails.vue'

let store;
let getters;



const localVue = createLocalVue();
localVue.use(Vuex);

const batchData = {
    assigned_shipping_agent: 
    { 
        agent_id: "+254725092149", 
        agent_name: "Festus Kiambi", 
        agent_phone_number: "+254725092149",
        shipping_provider: "SENDY",
        tracking_reference: "AF63H6133-UW6",
        vehicle_identifier: "KMEZ 767K",
        vehicle_type: "MOTOR_BIKE"    
    },
    batch_id: "BT-SNZ-2750",
    batch_status: "BATCH_COMPLETED",
    batch_summary: 
     {
         estimated_measure: [{value: 0.02, value_type: "KILOGRAM"}, {value: 1, value_type: "LITRE"}],
         recommended_vehicle_type: "MOTOR_BIKE",
         total_fulfilment_fee: 0,
         total_ordered_items_count: 2,
         waypoints: 1
        },
    confirmation_pin: "7501",
    country: "KENYA",
    created_date: 1639480706000,
    direction: "INBOUND",
    hub: {hub_id: "H-9893b64a", hub_name: "Kahawa Downs"},
    order_status_ratios: {ORDER_COMPLETED: 1, ORDER_RECEIVED: 0, ORDER_IN_TRANSIT: 0, ORDER_CANCELED: 0, ORDER_IN_PROCESSING: 0, ORDER_FAILED: 0},
    orders: [ 
        {
         business_name: "Peter Pans",
         completed_date: null,
    consolidated: false,
    country: "KENYA",
    created_date: 1639480638000,
    destination_description: "Kahawa Downs Apartments, Kenya",
    destination_latitude: -1.1936399,
    destination_longitude: 36.9302601,
    destination_region: null,
    hub_name: "Kahawa Downs",
    most_recent_batch_id: "BT-SNZ-2750",
    order_id: "C-UBL-8731",
    order_recipient_name: "Peter Pans",
    order_status: "ORDER_COMPLETED",
    ordered_items_count: 2,
    scheduled_date: 1639555200000,
    shipping_agent_name: "Festus Kiambi",
    shipping_agent_vehicle_type: "MOTOR_BIKE",
    updated_date: 1639480977000}
],
    scheduled_date: 1639480706000,
}

describe('batchesDetails.vue', () => {
    beforeEach(() => {
        getters = {
            'fulfilment/getTableDetails': () => batchData,
        };
        store = new Vuex.Store({
          getters
        });
         
      });

    it('checks the tableDetail data', async() => {
       const wrapper = shallowMount(batchesDetails, { store, localVue});
       await wrapper.setData({order_detail: batchData })
       expect(wrapper.vm.order_detail).toBe(batchData);
        });
    });