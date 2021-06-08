import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';

import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import Apix from '@agog/apix';
import WarningComponent from '../../../modules/rewards/_components/WarningComponent';
import myModule from '../../../store';
import configurations from '../../../config/configs';
import auth from '../../../config/auth-token';

Vue.use(Vuex);

const localVue = createLocalVue();
localVue.use(Vuex);

Vue.component('calendar', Calendar);
Vue.component('date-picker', DatePicker);

describe('WarningComponent', () => {
  let store;
  let actions;
  let mutations;

  beforeEach(() => {
    const apix = new Apix({
      prefix: configurations.CONFIG.ADONIS_API,
      params: {
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
          Authorization: auth.jwtToken,
        },
      },
    });

    actions = {
      request_vendor_types: jest.fn(),
    };
    mutations = {
      setSelectedCountryCode: jest.fn(),
      setSelectedVendorType: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        myModule: {
          state: { data: {} },
          mutations,
          actions,
          namespaced: true,
        },
      },
    });
  });

  const wrapper = shallowMount(WarningComponent, {
    store,
    localVue,
  });

  it('mocks resetting country code & vendor type', () => {
    // store.commit('setSelectedCountryCode', null);
    // store.commit('setSelectedVendorType', null);
  });

  it('vendor types are fetched', () => {
    expect(actions.request_vendor_types).toHaveBeenCalled();
  });

  it('checks the component button name ', () => {
    expect(wrapper.find('button').text()).toBe('Add reward');
  });
});
