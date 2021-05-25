import { shallowMount } from '@vue/test-utils';
import TheRouteComponent from '../../../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderTabs/TheRouteComponent.vue';

describe('TheRouteComponent', () => {
  const wrapper = shallowMount(TheRouteComponent, {
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
    expect(
      wrapper
        .findAll('th')
        .at(2)
        .text(),
    ).toBe('Building');
  });
});
