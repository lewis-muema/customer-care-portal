import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import vSelect from 'vue-select';
import TheProximityComponent from '../../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderActions/TheProximityComponent.vue';

Vue.component('v-select', vSelect);

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
  it('checks the component button name ', () => {
    expect(wrapper.find('button').text()).toBe('Submit');
  });
  it('has a root element with class form-group', () => {
    expect(wrapper.find('form').classes()).toContain('form-group');
  });
});
