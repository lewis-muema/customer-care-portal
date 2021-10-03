import { shallowMount } from '@vue/test-utils';
import StatusBadge from '@/modules/fulfilment/globals/_components/StatusBadge';

describe('StatusBadge Component', () => {
  const wrapper = shallowMount(StatusBadge, {
    propsData: {
      status: 'pending',
    },
  });
  it('should initialize component', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should get the correct passed status props', () => {
    expect(wrapper.props().status).toBe('pending');
  });

  it('should ensure active class matches passed prop', () => {
    const shallowWrapper = shallowMount(StatusBadge, {
      propsData: { status: 'confirmed' },
    });
    expect(shallowWrapper.vm.activeClass).toBe('confirmed');
  });
  it('should call orderstatus function on init', async () => {
    const orderStatusColor = jest.spyOn(
      StatusBadge.methods,
      'orderStatusColor',
    );
    await shallowMount(StatusBadge, { propsData: { status: 'pending' } });
    expect(orderStatusColor).toHaveBeenCalled();
  });

  it('should revert to default status if passed status does not match conditions', () => {
    const shallowWrapper = shallowMount(StatusBadge, {
      propsData: { status: 'foo' },
    });
    expect(shallowWrapper.vm.activeClass).toBe('confirmed');
  });
});
