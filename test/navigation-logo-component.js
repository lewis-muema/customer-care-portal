import { shallowMount } from '@vue/test-utils';
import TheLogo from '../components/Navigation/TheLogo.vue';

const expect = require('chai').expect;

const wrapper = shallowMount(TheLogo);

const vm = wrapper.vm;

// console.log(wrapper);
