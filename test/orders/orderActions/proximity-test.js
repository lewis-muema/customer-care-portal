import { shallowMount } from '@vue/test-utils';
import TheProximityComponent from '../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderActions/TheProximityComponent.vue';

const expect = require('chai').expect;
const assert = require('chai').assert;

describe('TheProximityComponent', () => {
  const wrapper = shallowMount(TheProximityComponent, {
    attachToDocument: true,
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
    expect(wrapper.find('button').text()).to.equal('Submit');
  });
  it('has a root element with class form-group', () => {
    // const wrapper = mount(Foo)
    expect(wrapper.is('.form-group')).to.equal(true);
  });
});
