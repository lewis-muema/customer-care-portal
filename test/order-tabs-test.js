import { shallowMount } from '@vue/test-utils';
import TheProximityComponent from '../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderActions/TheProximityComponent.vue';

const expect = require('chai').expect;

describe('TheProximityComponent', () => {
  const wrapper = shallowMount(TheProximityComponent, {
    propsData: {
      order: {
        order_details: {
          order_no: 'AC92UM132-6BV',
          errand_mode: 'one_way',
        },
        rider_details: {
          vendor_type_id: 2,
        },
      },
    },
  });
});
