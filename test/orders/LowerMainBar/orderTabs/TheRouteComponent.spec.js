<<<<<<< HEAD:test/orders/orderTabs/route-test.js
import { shallowMount, mount } from '@vue/test-utils';
import Vue from 'vue';
import TheRouteComponent from '../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderTabs/TheRouteComponent.vue';

const expect = require('chai').expect;
const assert = require('chai').assert;
=======
import { shallowMount } from '@vue/test-utils';
import TheRouteComponent from '../../../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderTabs/TheRouteComponent.vue';
>>>>>>> 2620258f (improved renaming of the components for structure clarity):test/orders/LowerMainBar/orderTabs/TheRouteComponent.spec.js

describe('TheRouteComponent', () => {
  const wrapper = shallowMount(TheRouteComponent, {
    attachToDocument: true,
    propsData: {
      order: [
        {
          name: 'Mombasa Island',
          label: 'Mombasa Island',
          flat_name: '',
          house_door: '',
          road: 'Baringo Rd, Mombasa',
          other_description: '',
        },
        {
          name: 'Eldoret',
          label: '',
          flat_name: '',
          house_door: '',
          road: 'Unnamed Road, Eldoret',
          other_description: '',
        },
      ],
    },
  });
  it('displays items from the list ', () => {
    const Constructor = Vue.extend(TheRouteComponent);
    const ListComponent = new Constructor().$mount();
    // console.log('ListComponent', ListComponent.$el);
    expect(ListComponent.$el.textContent).to.contain('Building');
  });
});
