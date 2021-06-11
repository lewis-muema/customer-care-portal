import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';

import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import WarningComponent from '~/modules/rewards/_components/WarningComponent';
import { buildVuexFromNuxt } from '../../nuxt-store.mock';
import * as main from '~/store';

Vue.use(Vuex);
Vue.use(ElementUI, { locale });

const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store(buildVuexFromNuxt(main));

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

describe('WarningComponent', () => {
  let wrapper;

  const spyFetchVendorTypes = jest.spyOn(
    WarningComponent.methods,
    'fetchVendorTypes',
  );
  const spyFetchReassignmentReasons = jest.spyOn(
    WarningComponent.methods,
    'fetchReassignmentReasons',
  );
  const spyRequestRewards = jest.spyOn(
    WarningComponent.methods,
    'requestRewards',
  );

  beforeEach(() => {
    wrapper = mount(WarningComponent, {
      data() {
        return {
          loading_messages: false,
        };
      },
      store,
      localVue,
    });
  });

  it('Resetting country code & vendor type', () => {
    wrapper.vm.$store.dispatch('resetSelectedVendorType', null);
    wrapper.vm.$store.dispatch('resetSelectedCountryCode', null);
    expect(store.state.selectedVendorType).toBeNull();
    expect(store.state.selectedCountryCode).toBeNull();
  });

  it('Vendor types are fetched', () => {
    expect(spyFetchVendorTypes).toHaveBeenCalled();
    expect(wrapper.vm.$data.vendor_type.length).toBe(0);
  });

  it('Fetch request rewards', () => {
    expect(spyRequestRewards).toHaveBeenCalled();
  });

  it('Fetch reallocation reasons', () => {
    expect(spyFetchReassignmentReasons).toHaveBeenCalled();
  });

  it('checks the component button name ', () => {
    const button = wrapper.find('.el-button--primary');
    expect(button.text()).toBe('Add warning message');
  });

  it('checks the form is visible when button is clicked ', async () => {
    const button = wrapper.find('.el-button--primary');
    button.trigger('click');
    await wrapper.vm.$nextTick();

    const form = wrapper.find('form').classes();
    expect(form).toContain('add-reward-section');
  });
});
