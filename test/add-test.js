import { shallowMount } from '@vue/test-utils';
import add from '@components/add.vue';

const expect = require('chai').expect;

const wrapper = mount(add);

const vm = wrapper.vm;