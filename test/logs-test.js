import { shallowMount } from '@vue/test-utils';
// import TheLogsComponent from '../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerSideBar/TheLogsComponent.vue';
import TheOrderComponent from '../modules/orders/_components/OrdersPage/OrdersLowerBit/LowerMainBar/OrderTabs/TheOrderComponent.vue';

import functions from '../store/global';
// const myLib = '../plugins/main';

const expect = require('chai').expect;

const showCurrencyBasedAmounts = functions.showCurrencyBasedAmounts;
const getSpecificCurrencyConversion = functions.getSpecificCurrencyConversion;
const calculateConvertedAmount = functions.calculateConvertedAmount;

const wrapper = shallowMount(TheOrderComponent);
console.log('warapper', wrapper);

// describe('TheOrderComponent', () => {
//   it('renders with shallowMount and does not initialize API call', () => {
//     console.log('warapper', wrapper);
//     // const logsData = TheLogsComponent.data();
//     // expect(logsData.logTypesColors).to.have.keys([1, 2, 3, 4, 5, 6, 7, 11]);
//   });
// });
