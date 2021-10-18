import { createLocalVue, shallowMount } from '@vue/test-utils';
import StatusBadge from '@/modules/fulfilment/globals/_components/StatusBadge';

const localVue = createLocalVue();
localVue.use(Vuex);

let getters;
let store;

describe('StatusBadge Component', () => {
  getters = {
    getStatusMapping: () => [],
  };

  store = new Vuex.Store({
    namespaced: true,
    mutations,
  });
  const wrapper = shallowMount(StatusBadge, {
    propsData: {
      status: 'order_in_processing',
    },
    localVue,
    store,
  });
  it('should initialize component', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should get the correct passed status props', () => {
    expect(wrapper.props().status).toBe('order_in_processing');
  });

  it('should call orderstatus function on init', async () => {
    const orderStatusColor = jest.spyOn(
      StatusBadge.methods,
      'orderStatusColor',
    );
    await shallowMount(StatusBadge, {
      propsData: { status: 'order_in_processing' },
    });
    expect(orderStatusColor).toHaveBeenCalled();
  });

  it('should revert to default status if passed status does not match conditions', () => {
    const shallowWrapper = shallowMount(StatusBadge, {
      propsData: { status: 'foo' },
    });
    expect(shallowWrapper.vm.activeClass).toBe('pending');
  });
});
