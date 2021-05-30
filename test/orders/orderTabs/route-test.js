import { shallowMount } from '@vue/test-utils';
import TheRouteComponent from '../../../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderTabs/TheRouteComponent.vue';

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
