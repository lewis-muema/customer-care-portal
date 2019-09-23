import Vue from 'vue';
import moment from 'moment';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import config from '~/config/configs';

Vue.mixin({
  data() {
    return {
      userImage: config.USER_IMAGE,
      riderDeliveryImg: config.RIDER_DELIVERY_IMG,
      orderColumns: [
        'Status',
        'Client',
        'Rider',
        'Time',
        'Pick up',
        'Delivery',
        'Amount',
        'Rider Amount',
      ],
      vendorTypes: {
        1: 'Bike',
        2: 'Pickup',
        3: 'Van',
        5: 'Cooler Van',
        6: 'Three Tonne Truck',
        10: 'Five Tonne Truck',
        12: 'Tuk Tuk',
        13: 'Seven Tonne Truck',
        14: 'Ten Tonne Truck',
        17: '14 Tonne Truck',
        18: '20 Tonne Truck',
        19: '24 Tonne Truck',
        20: '28 Tonne Truck',
        21: 'Runner',
        22: 'standard',
        25: 'Freight',
      },
      errorCodes: {
        403: 'Your access token has expired. Please logout and login again',
        500: 'Page not found',
      },
      trucksArray: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      logTypesColors: {
        1: 'fa-get-pocket bg-green',
        2: ' fa-thumbs-up bg-aqua',
        3: 'fa-road bg-blue',
        4: 'fa-check bg-green',
        5: 'fa-reply bg-yellow',
        6: 'fa-close bg-red',
        7: 'fa-calendar bg-purple',
        10: 'fa-envelope bg-orange',
        11: 'fa-envelope bg-blue',
        14: 'fa-envelope bg-red',
      },
      customerInfo: [
        { code: '1', reason: 'More information' },
        { code: '2', reason: 'Delivery delay' },
        { code: '3', reason: 'Customer not reachable' },
        { code: '4', reason: 'Customer feedback' },
      ],
      departments: [
        { code: '1', department: 'Operations' },
        { code: '2', department: 'Customer Support' },
      ],
      bizUser: {
        bussines_list: [
          {
            channel_name: 'Other (specify below)',
            delivey_list: {
              result: [],
              issue_types: [
                {
                  issue_name: 'More information',
                  type_id: 1,
                },
                {
                  issue_name: 'Delivery delay',
                  type_id: 2,
                },
                {
                  issue_name: 'Customer not reachable',
                  type_id: 3,
                },
                {
                  issue_name: 'Customer feedback',
                  type_id: 4,
                },
              ],
              currency_conversions: [
                {
                  rate: 37.3653,
                  from_currency: 'KES',
                  inverse_rate: 0.0267,
                  effective_date: '2019-04-28',
                  to_currency: 'UGX',
                },
                {
                  rate: 22.6973,
                  from_currency: 'KES',
                  inverse_rate: 0.044,
                  effective_date: '2019-04-28',
                  to_currency: 'TZS',
                },
                {
                  rate: 0.6159,
                  from_currency: 'UGX',
                  inverse_rate: 1.6236,
                  effective_date: '2019-04-28',
                  to_currency: 'TZS',
                },
                {
                  rate: 0.0267,
                  from_currency: 'UGX',
                  inverse_rate: 37.3653,
                  effective_date: '2019-04-28',
                  to_currency: 'KES',
                },
                {
                  rate: 0.044,
                  from_currency: 'TZS',
                  inverse_rate: 22.6973,
                  effective_date: '2019-04-28',
                  to_currency: 'KES',
                },
                {
                  rate: 1.6237,
                  from_currency: 'TZS',
                  inverse_rate: 0.6159,
                  effective_date: '2019-04-28',
                  to_currency: 'UGX',
                },
              ],
              status: true,
            },
            rider_list: {
              riders: [],
            },
            cop_type_name: 'Food',
            payment_option: 1,
            sales_agent: 0,
            payments: {
              running_balance: 0,
              paylist: [
                {
                  rb: 450,
                  amount: 450,
                  date_time: '2016-08-21 09:01:14.0',
                  pay_method: 'System',
                  txn: 'AC129I183-24C',
                  status: 'Completed',
                },
                {
                  rb: 225,
                  amount: -225,
                  date_time: '2016-08-21 09:01:17.0',
                  pay_method: 'Cash',
                  txn: 'CASH-AC129I183-24C',
                  status: 'Completed',
                },
                {
                  rb: 0,
                  amount: -225,
                  date_time: '2016-08-21 09:01:17.0',
                  pay_method: 'Cash',
                  txn: 'DISCOUNT-AC129I183-24C',
                  status: 'Completed',
                },
              ],
            },
            strict_allocation: 0,
            cop_contact_person: 'Kathleen Creavalle',
            cop_email: 'kcreavalle@sugarcane.co.ke',
            approved: 1,
            city_name: 'Nairobi',
            account_manager: 'Njeri',
            cop_name: 'Sugarcane Caribbean Food',
            cop_id: 929,
            cop_address: 'none',
            country_name: 'Kenya',
            credit_period: 15,
            cop_phone: '0722598850',
            date_signed_up: '2016-03-21 20:19:17.0',
            account_manager_id: '21',
            cop_category: 0,
            default_currency: 'KES',
            status: 1,
          },
        ],
        cop_type_list: [
          {
            cop_type_id: 1,
            name: 'Ecommerce',
          },
          {
            cop_type_id: 2,
            name: 'Legal',
          },
          {
            cop_type_id: 3,
            name: 'Hospitality',
          },
          {
            cop_type_id: 4,
            name: 'Insurance',
          },
          {
            cop_type_id: 5,
            name: 'Construction',
          },
          {
            cop_type_id: 6,
            name: 'Health Care',
          },
          {
            cop_type_id: 7,
            name: 'Grocery',
          },
          {
            cop_type_id: 8,
            name: 'Travel',
          },
          {
            cop_type_id: 9,
            name: 'NGO',
          },
          {
            cop_type_id: 10,
            name: 'Education',
          },
          {
            cop_type_id: 11,
            name: 'Consulting',
          },
          {
            cop_type_id: 12,
            name: 'Technology',
          },
          {
            cop_type_id: 13,
            name: 'Accounting',
          },
          {
            cop_type_id: 14,
            name: 'Real Estate',
          },
          {
            cop_type_id: 15,
            name: 'Banking',
          },
          {
            cop_type_id: 16,
            name: 'Agriculture',
          },
          {
            cop_type_id: 17,
            name: 'Energy',
          },
          {
            cop_type_id: 18,
            name: 'Pharmaceuticals',
          },
          {
            cop_type_id: 19,
            name: 'Retail & Wholesale',
          },
          {
            cop_type_id: 20,
            name: 'Electronics',
          },
          {
            cop_type_id: 21,
            name: 'Entertainment & Leisure',
          },
          {
            cop_type_id: 22,
            name: 'Cosmetics',
          },
          {
            cop_type_id: 23,
            name: 'Other',
          },
          {
            cop_type_id: 24,
            name: 'Advertising',
          },
          {
            cop_type_id: 25,
            name: 'Automotive',
          },
          {
            cop_type_id: 26,
            name: 'Communications',
          },
          {
            cop_type_id: 27,
            name: 'Courier',
          },
          {
            cop_type_id: 28,
            name: 'Finance',
          },
          {
            cop_type_id: 29,
            name: 'Government',
          },
          {
            cop_type_id: 30,
            name: 'Marketing',
          },
          {
            cop_type_id: 32,
            name: 'Telecom Services',
          },
          {
            cop_type_id: 33,
            name: 'Transportation',
          },
          {
            cop_type_id: 34,
            name: 'Food',
          },
          {
            cop_type_id: 35,
            name: 'Facebook Merchant',
          },
          {
            cop_type_id: 36,
            name: 'Facebook Merchant',
          },
        ],
        request_id: 1181,
        admin_list: [
          {
            admin_id: 0,
            name: 'Marketing',
            admin_type: '0',
            email: 'marketing@sendyit.com',
          },
          {
            admin_id: 1,
            name: 'Evanson KB',
            admin_type: '0',
            email: 'ebiwott@sendyit.com',
          },
          {
            admin_id: 2,
            name: 'Don',
            admin_type: '0',
            email: 'don@sendyit.com',
          },
          {
            admin_id: 3,
            name: 'Meshack',
            admin_type: '0',
            email: 'amesh@sendyit.com',
          },
          {
            admin_id: 4,
            name: 'Clifford Beta',
            admin_type: '0',
            email: 'b.clifford@sendyit.com',
          },
          {
            admin_id: 6,
            name: 'Angeline',
            admin_type: '0',
            email: 'o.angeline@sendyit.com',
          },
          {
            admin_id: 7,
            name: 'Malaika',
            admin_type: '0',
            email: 'malaika@sendyit.com',
          },
          {
            admin_id: 9,
            name: 'Peris',
            admin_type: '0',
            email: 'peris@sendyit.com',
          },
          {
            admin_id: 19,
            name: 'Marvin Kirschner',
            admin_type: '0',
            email: 'marvin@sendyit.com',
          },
          {
            admin_id: 20,
            name: 'Chris Munialo',
            admin_type: '0',
            email: 'chris@sendyit.com',
          },
          {
            admin_id: 26,
            name: 'Ian Wambai',
            admin_type: '0',
            email: 'ian@sendyit.com',
          },
          {
            admin_id: 27,
            name: 'Samuel Geno',
            admin_type: '0',
            email: 'samuel@sendyit.com',
          },
          {
            admin_id: 35,
            name: 'Dervine',
            admin_type: '0',
            email: 'ndervine@sendyit.com',
          },
          {
            admin_id: 37,
            name: 'Imelda',
            admin_type: '0',
            email: 'imelda@sendyit.com',
          },
          {
            admin_id: 42,
            name: 'joanna',
            admin_type: '0',
            email: 'joanna@sendyit.com',
          },
          {
            admin_id: 43,
            name: 'Philemon',
            admin_type: '0',
            email: 'philemon@sendyit.com',
          },
          {
            admin_id: 48,
            name: 'Francis',
            admin_type: '0',
            email: 'francis@sendyit.com',
          },
          {
            admin_id: 50,
            name: 'Michael',
            admin_type: '0',
            email: 'michael@sendyit.com',
          },
          {
            admin_id: 53,
            name: 'Susan',
            admin_type: '0',
            email: 'testacc@sendyit.com',
          },
          {
            admin_id: 54,
            name: 'Sendy User',
            admin_type: '0',
            email: 'sendycc@sendyit.com',
          },
          {
            admin_id: 55,
            name: 'Fargo User',
            admin_type: '0',
            email: 'fargocc@sendyit.com',
          },
          {
            admin_id: 56,
            name: 'Safaricom User',
            admin_type: '0',
            email: 'safcc@sendyit.com',
          },
          {
            admin_id: 57,
            name: 'Kigen Ezra',
            admin_type: '0',
            email: 'logisticscare@sendyit.com',
          },
          {
            admin_id: 58,
            name: 'Dickson Kidhaa',
            admin_type: '0',
            email: 'logisticsasstsups@sendyit.com',
          },
          {
            admin_id: 59,
            name: 'Mibei Isaack',
            admin_type: '0',
            email: 'logisticsup@sendyit.com',
          },
          {
            admin_id: 61,
            name: 'Lucy Nyambura',
            admin_type: '0',
            email: 'couriercsman@sendyit.com',
          },
          {
            admin_id: 62,
            name: 'Phil',
            admin_type: '0',
            email: 'psamoei@sendyit.com',
          },
          {
            admin_id: 65,
            name: 'Maina',
            admin_type: '0',
            email: 'maina@sendyit.com',
          },
          {
            admin_id: 67,
            name: 'Purity Wanjiku',
            admin_type: '0',
            email: 'purity@sendyit.com',
          },
          {
            admin_id: 68,
            name: 'Rachel',
            admin_type: '0',
            email: 'rachel@sendyit.com',
          },
          {
            admin_id: 69,
            name: 'Wilson Morogo',
            admin_type: '0',
            email: 'wilson@sendyit.com',
          },
          {
            admin_id: 72,
            name: 'clinton',
            admin_type: '0',
            email: 'clinton@sendyit.com',
          },
          {
            admin_id: 74,
            name: 'susan',
            admin_type: '0',
            email: 'susan@sendyit.com',
          },
          {
            admin_id: 75,
            name: 'Samson',
            admin_type: '0',
            email: 'samson@sendyit.com',
          },
          {
            admin_id: 76,
            name: 'Griffin',
            admin_type: '0',
            email: 'griffin@sendyit.com',
          },
          {
            admin_id: 77,
            name: 'Mwangi',
            admin_type: '0',
            email: 'mmwangi@sendyit.com',
          },
          {
            admin_id: 78,
            name: 'juliet',
            admin_type: '0',
            email: 'juliet@sendyit.com',
          },
          {
            admin_id: 79,
            name: 'mitchelle',
            admin_type: '0',
            email: 'mitchelle@sendyit.com',
          },
          {
            admin_id: 81,
            name: 'cynthia',
            admin_type: '0',
            email: 'cynthia@sendyit.com',
          },
          {
            admin_id: 83,
            name: 'Sandra Buyole',
            admin_type: '0',
            email: 'sandra@sendyit.com',
          },
          {
            admin_id: 87,
            name: 'Benta',
            admin_type: '0',
            email: 'benta@sendyit.com',
          },
          {
            admin_id: 88,
            name: 'Christine',
            admin_type: '0',
            email: 'christine@sendyit.com',
          },
          {
            admin_id: 90,
            name: 'Emily',
            admin_type: '0',
            email: 'emily@sendyit.com',
          },
          {
            admin_id: 92,
            name: 'Magdalene',
            admin_type: '0',
            email: 'magdalene@sendyit.com',
          },
          {
            admin_id: 93,
            name: 'Alphas Sinja',
            admin_type: '0',
            email: 'alphas@sendyit.com',
          },
          {
            admin_id: 94,
            name: 'Glenn Ogolla',
            admin_type: '0',
            email: 'glenn@sendyit.com',
          },
          {
            admin_id: 97,
            name: 'Jude Okello',
            admin_type: '0',
            email: 'jude@sendyit.com',
          },
          {
            admin_id: 99,
            name: 'Denis Gachoki',
            admin_type: '0',
            email: 'denis@sendyit.com',
          },
          {
            admin_id: 100,
            name: 'Floyd',
            admin_type: '0',
            email: 'floyd@sendyit.com',
          },
          {
            admin_id: 101,
            name: 'Lewis',
            admin_type: '0',
            email: 'lewis@sendyit.com',
          },
          {
            admin_id: 103,
            name: 'Wycliffe Nyakemwa',
            admin_type: '0',
            email: 'nwycliffe@sendyit.com',
          },
          {
            admin_id: 104,
            name: 'Nelson Chando',
            admin_type: '0',
            email: 'nelson@sendyit.com',
          },
          {
            admin_id: 107,
            name: 'Mathew Adira',
            admin_type: '0',
            email: 'mathew@sendyit.com',
          },
          {
            admin_id: 108,
            name: 'David Gikandi',
            admin_type: '0',
            email: 'gikandi@sendyit.com',
          },
          {
            admin_id: 109,
            name: 'Evans Kitum',
            admin_type: '0',
            email: 'ekitum@sendyit.com',
          },
          {
            admin_id: 111,
            name: 'George Mutua Musyoka',
            admin_type: '0',
            email: 'george@sendyit.com',
          },
          {
            admin_id: 112,
            name: 'Marita Mutemi',
            admin_type: '0',
            email: 'marita@peleza.com',
          },
          {
            admin_id: 113,
            name: 'Christine Mwaura',
            admin_type: '0',
            email: 'christine.mwaura@peleza.com',
          },
          {
            admin_id: 114,
            name: 'Nephat Gikunju',
            admin_type: '0',
            email: 'nephat.gikunju@peleza.com',
          },
          {
            admin_id: 115,
            name: 'William Ngala',
            admin_type: '0',
            email: 'william.ngala@peleza.com',
          },
          {
            admin_id: 116,
            name: 'Diana Kwamboka',
            admin_type: '0',
            email: 'Diana.Kwamboka@peleza.com',
          },
          {
            admin_id: 117,
            name: 'Phil. O',
            admin_type: '0',
            email: 'philo@sendyit.com',
          },
          {
            admin_id: 119,
            name: 'Patrick Kimote',
            admin_type: '0',
            email: 'patrick@sendyit.com',
          },
          {
            admin_id: 120,
            name: 'Immaculate Kimani',
            admin_type: '0',
            email: 'immaculate@sendyit.com',
          },
          {
            admin_id: 121,
            name: 'Oscar Miheso',
            admin_type: '0',
            email: 'oscar@sendyit.com',
          },
          {
            admin_id: 122,
            name: 'Timothy Omare',
            admin_type: '0',
            email: 'timothy@sendyit.com',
          },
          {
            admin_id: 123,
            name: 'Joseph Anyona',
            admin_type: '0',
            email: 'joseph@sendyit.com',
          },
          {
            admin_id: 124,
            name: 'Justus Kipsang',
            admin_type: '0',
            email: 'justus@sendyit.com',
          },
          {
            admin_id: 125,
            name: 'James Kiaritha',
            admin_type: '0',
            email: 'james@sendyit.com',
          },
          {
            admin_id: 126,
            name: 'VIVIAN KAGWEMA MWANGI',
            admin_type: '0',
            email: 'vivian@sendyit.com',
          },
          {
            admin_id: 128,
            name: 'Daudi Muriu',
            admin_type: '0',
            email: 'daudi@sendyit.com',
          },
          {
            admin_id: 129,
            name: 'Jeremy Sala',
            admin_type: '0',
            email: 'jeremy@sendyit.com',
          },
          {
            admin_id: 130,
            name: ' concillier ',
            admin_type: '0',
            email: 'concillier@sendyit.com',
          },
          {
            admin_id: 131,
            name: 'Dishon',
            admin_type: '0',
            email: 'dishon@sendyit.com',
          },
          {
            admin_id: 133,
            name: 'Kipkirui Langat',
            admin_type: '0',
            email: 'kipkirui.langat@peleza.com',
          },
          {
            admin_id: 134,
            name: 'Simon Gibore',
            admin_type: '0',
            email: 'simongibore@sendyit.com',
          },
          {
            admin_id: 136,
            name: 'Martin Kasasira',
            admin_type: '0',
            email: 'martin@sendyit.com',
          },
          {
            admin_id: 137,
            name: 'Caroline',
            admin_type: '0',
            email: 'caroline@sendyit.com',
          },
          {
            admin_id: 138,
            name: 'John Odhiambo',
            admin_type: '0',
            email: 'john@sendyit.com',
          },
          {
            admin_id: 139,
            name: 'Chelimo',
            admin_type: '0',
            email: 'chelimo@sendyit.com',
          },
          {
            admin_id: 140,
            name: 'Braimoh',
            admin_type: '0',
            email: 'braimoh@sendyit.com',
          },
          {
            admin_id: 141,
            name: 'Wangechi',
            admin_type: '0',
            email: 'wangechi@sendyit.com',
          },
          {
            admin_id: 142,
            name: 'Priston Muema',
            admin_type: '0',
            email: 'priston@sendyit.com',
          },
          {
            admin_id: 143,
            name: 'Dennis Abigaba',
            admin_type: '0',
            email: 'dennis@sendyit.com',
          },
          {
            admin_id: 144,
            name: 'Shelef Ndar',
            admin_type: '0',
            email: 'shelef@sendyit.com',
          },
          {
            admin_id: 145,
            name: 'Pauline Chore',
            admin_type: '0',
            email: 'pauline@sendyit.com',
          },
          {
            admin_id: 146,
            name: 'Isaac Ochieng',
            admin_type: '0',
            email: 'iochieng@sendyit.com',
          },
          {
            admin_id: 147,
            name: 'Grace Wakhungu',
            admin_type: '0',
            email: 'grace@sendyit.com',
          },
          {
            admin_id: 148,
            name: 'Joyce Kemboi',
            admin_type: '0',
            email: 'joyce@sendyit.com',
          },
          {
            admin_id: 149,
            name: 'Paul Njoroge',
            admin_type: '0',
            email: 'paul@sendyit.com',
          },
          {
            admin_id: 150,
            name: 'Everlyne Ndanu',
            admin_type: '0',
            email: 'everlyne@sendyit.com',
          },
          {
            admin_id: 151,
            name: 'David Ogola',
            admin_type: '0',
            email: 'davidogola@sendyit.com',
          },
          {
            admin_id: 152,
            name: 'Elvis Mogaka',
            admin_type: '0',
            email: 'elvis@sendyit.com',
          },
          {
            admin_id: 155,
            name: 'Anthony Ngethe',
            admin_type: '0',
            email: 'anthony@sendyit.com',
          },
          {
            admin_id: 156,
            name: 'Nickson Masikonte',
            admin_type: '0',
            email: 'nickson@sendyit.com',
          },
          {
            admin_id: 157,
            name: 'Ian Kiprop',
            admin_type: '0',
            email: 'ikiprop@sendyit.com',
          },
          {
            admin_id: 158,
            name: 'Duncan',
            admin_type: '0',
            email: 'duncan@sendyit.com',
          },
          {
            admin_id: 159,
            name: 'Zawadi Njiru',
            admin_type: '0',
            email: 'zawadi@sendyit.com',
          },
          {
            admin_id: 160,
            name: 'Cedric Kinynajui',
            admin_type: '0',
            email: 'cedric@sendyit.com',
          },
          {
            admin_id: 161,
            name: 'Doreen Erinah Wampande',
            admin_type: '0',
            email: 'doreen@sendyit.com',
          },
          {
            admin_id: 162,
            name: 'Esther Wangai',
            admin_type: '0',
            email: 'esther@sendyit.com',
          },
          {
            admin_id: 163,
            name: 'Evelyn Akol Ogwang',
            admin_type: '0',
            email: 'eakol@sendyit.com',
          },
          {
            admin_id: 164,
            name: 'Miriam Amiani',
            admin_type: '0',
            email: 'miriam@sendyit.com',
          },
          {
            admin_id: 165,
            name: 'Priscilla Kabacwamba',
            admin_type: '0',
            email: 'pkabacwamba@sendyit.com',
          },
          {
            admin_id: 167,
            name: 'Wilson Githinji',
            admin_type: '0',
            email: 'wgithinji@sendyit.com',
          },
          {
            admin_id: 168,
            name: 'Caroline Maina',
            admin_type: '0',
            email: 'carolinem@sendyit.com',
          },
          {
            admin_id: 169,
            name: 'Elijah Mbaru',
            admin_type: '0',
            email: 'elijah@sendyit.com',
          },
          {
            admin_id: 170,
            name: 'Eugene Kuria',
            admin_type: '0',
            email: 'eugene@sendyit.com',
          },
          {
            admin_id: 171,
            name: 'Jan Kevin Lorenz',
            admin_type: '0',
            email: 'kevin@sendyit.com',
          },
          {
            admin_id: 172,
            name: 'Sharon Wangari',
            admin_type: '0',
            email: 'sharon@sendyit.com',
          },
          {
            admin_id: 173,
            name: 'Yuliya Zabiyaka',
            admin_type: '0',
            email: 'yuliya@sendyit.com',
          },
          {
            admin_id: 175,
            name: 'Byron Ombuya',
            admin_type: '0',
            email: 'byron@sendyit.com',
          },
          {
            admin_id: 176,
            name: 'Peres Adhiambo',
            admin_type: '0',
            email: 'adhiambo@sendyit.com',
          },
          {
            admin_id: 177,
            name: 'Aman Patel',
            admin_type: '0',
            email: 'aman@sendyit.com',
          },
          {
            admin_id: 178,
            name: 'Kelvin Maina',
            admin_type: '0',
            email: 'kelvin@sendyit.com',
          },
          {
            admin_id: 179,
            name: 'Francis Kisiara',
            admin_type: '0',
            email: 'fkisiara@sendyit.com',
          },
          {
            admin_id: 180,
            name: 'Langat Kipkurui',
            admin_type: '0',
            email: 'kipkirui.langat@peleza.com',
          },
          {
            admin_id: 181,
            name: 'Philip Agesa',
            admin_type: '0',
            email: 'hr@sendy.co.ke',
          },
          {
            admin_id: 182,
            name: 'Vincent',
            admin_type: '0',
            email: 'hr@sendyit.com',
          },
          {
            admin_id: 183,
            name: 'Ronald',
            admin_type: '0',
            email: 'ronald@sendyit.com',
          },
          {
            admin_id: 184,
            name: 'Alex ',
            admin_type: '0',
            email: 'alex@sendyit.com',
          },
          {
            admin_id: 185,
            name: 'Fredrick',
            admin_type: '0',
            email: 'fredrickomondi@sendyit.com',
          },
          {
            admin_id: 186,
            name: 'Sydney Thiam',
            admin_type: '0',
            email: 'sydney@sendyit.com',
          },
          {
            admin_id: 187,
            name: 'Rachael Irimu',
            admin_type: '0',
            email: 'gathoni@sendyit.com',
          },
          {
            admin_id: 188,
            name: 'Narasimha Ramakesari',
            admin_type: '0',
            email: 'narasimha@sendyit.com',
          },
          {
            admin_id: 189,
            name: 'Ken Nderitu',
            admin_type: '0',
            email: 'ken@sendyit.com',
          },
          {
            admin_id: 190,
            name: 'Janet Munguti',
            admin_type: '0',
            email: 'janet@sendyit.com',
          },
          {
            admin_id: 191,
            name: 'Wendy Akute',
            admin_type: '0',
            email: 'akute@sendyit.com',
          },
          {
            admin_id: 192,
            name: 'Phillip Kitivo',
            admin_type: '0',
            email: 'philip@sendyit.com',
          },
          {
            admin_id: 193,
            name: 'Elizabeth Mithamo',
            admin_type: '0',
            email: 'elizabeth@sendyit.com',
          },
          {
            admin_id: 194,
            name: 'Christine Namara',
            admin_type: '0',
            email: 'namara@sendyit.com',
          },
          {
            admin_id: 195,
            name: 'Edwin Kuria',
            admin_type: '0',
            email: 'ekuria@sendyit.com',
          },
          {
            admin_id: 196,
            name: 'Joy Muthengi',
            admin_type: '0',
            email: 'joy@sendyit.com',
          },
          {
            admin_id: 198,
            name: 'Glories Lavoga',
            admin_type: '0',
            email: 'glories@sendyit.com',
          },
          {
            admin_id: 199,
            name: 'Amanda Fiat',
            admin_type: '0',
            email: 'amanda@sendyit.com',
          },
          {
            admin_id: 200,
            name: 'Josephine Kyokunda',
            admin_type: '0',
            email: 'josephine@sendyit.com',
          },
          {
            admin_id: 201,
            name: 'James Mutebi Mukasa',
            admin_type: '0',
            email: 'jmutebi@sendyit.com',
          },
          {
            admin_id: 202,
            name: 'Diekola Alabi',
            admin_type: '0',
            email: 'diekola@sendyit.com',
          },
          {
            admin_id: 203,
            name: 'Kihara Karua',
            admin_type: '0',
            email: 'kihara@sendyit.com',
          },
          {
            admin_id: 204,
            name: 'Nimrod Khisa',
            admin_type: '0',
            email: 'nimrod@sendyit.com',
          },
          {
            admin_id: 206,
            name: 'Jacob Mogire',
            admin_type: '0',
            email: 'jacob@sendyit.com',
          },
          {
            admin_id: 207,
            name: 'Cynthia Anyango',
            admin_type: '0',
            email: 'canyango@sendyit.com',
          },
          {
            admin_id: 208,
            name: 'Shubham',
            admin_type: '0',
            email: 'shubham@sendyit.com',
          },
          {
            admin_id: 209,
            name: 'Bare Marsa',
            admin_type: '0',
            email: 'bare@sendyit.com',
          },
          {
            admin_id: 210,
            name: 'Gibson Maina',
            admin_type: '0',
            email: 'gibson@sendyit.com',
          },
          {
            admin_id: 211,
            name: 'Valarie Keter',
            admin_type: '0',
            email: 'valerie@sendyit.com',
          },
          {
            admin_id: 212,
            name: 'Kelvin Kemei',
            admin_type: '0',
            email: 'kemei@sendyit.com',
          },
          {
            admin_id: 213,
            name: 'Dan Angima',
            admin_type: '0',
            email: 'dan@sendyit.com',
          },
          {
            admin_id: 214,
            name: 'Elizabeth Kathure',
            admin_type: '0',
            email: 'Ekathure@sendyit.com',
          },
          {
            admin_id: 215,
            name: 'Brian Githinji',
            admin_type: '0',
            email: 'bgithinji@sendyit.com',
          },
          {
            admin_id: 216,
            name: 'Rose Kariuki',
            admin_type: '0',
            email: 'rose@sendyit.com',
          },
          {
            admin_id: 217,
            name: 'Nadine Hefti',
            admin_type: '0',
            email: 'nadine@sendyit.com',
          },
          {
            admin_id: 218,
            name: 'Roina Atieno',
            admin_type: '0',
            email: 'roina@sendyit.com',
          },
          {
            admin_id: 219,
            name: 'Joseph Odhaimbo',
            admin_type: '0',
            email: 'jodhaimbo@sendyit.com',
          },
          {
            admin_id: 220,
            name: 'Kena Muigai',
            admin_type: '0',
            email: 'kena@sendyit.com',
          },
          {
            admin_id: 221,
            name: 'Stephen Konaka',
            admin_type: '0',
            email: 'stevekonaka@sendyit.com',
          },
          {
            admin_id: 222,
            name: 'Christopher Mukhovi Mmbaka',
            admin_type: '0',
            email: 'christopher@sendyit.com',
          },
          {
            admin_id: 223,
            name: 'Ian Wanyoike',
            admin_type: '0',
            email: 'ianwanyoike@sendyit.com',
          },
          {
            admin_id: 224,
            name: 'Robin Cheptile',
            admin_type: '0',
            email: 'robin@sendyit.com',
          },
          {
            admin_id: 225,
            name: 'Annie Samba',
            admin_type: '0',
            email: 'annie@sendyit.com',
          },
          {
            admin_id: 226,
            name: 'Stephen M',
            admin_type: '0',
            email: 'smugoiya@sendyit.com',
          },
          {
            admin_id: 227,
            name: 'James M',
            admin_type: '0',
            email: 'jamesm@sendyit.com',
          },
          {
            admin_id: 228,
            name: 'Raymond Gitonga',
            admin_type: '0',
            email: 'raymond@sendyit.com',
          },
          {
            admin_id: 229,
            name: 'Victor Mwangi',
            admin_type: '0',
            email: 'victor@sendyit.com',
          },
          {
            admin_id: 230,
            name: 'Jan Odhiambo',
            admin_type: '0',
            email: 'jodhiambo@sendyit.com ',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({ session: 'getSession' }),
    userData() {
      return this.session.payload.data;
    },
  },
  methods: {
    display_order_action_notification(status) {
      let displayClass = 'success';
      if (!status) {
        displayClass = 'danger';
      }

      return displayClass;
    },
    splitWords(words) {
      const n = words.split(' ');
      return n[n.length - 1];
    },
    display_code_notification(message) {
      const code = Number(this.splitWords(message));
      const notification = this.errorCodes[code];
      return notification;
    },
    getOrderFormattedDate(date, requiredFormat) {
      const dt = moment(date).format(requiredFormat);
      return dt;
    },
    getFormattedDate(date, requiredFormat) {
      const dt1 = moment(date, 'YYYY-MM-DD HH:mm:ss');
      const dt = moment(dt1).format(requiredFormat);
      return dt;
    },
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    compareDates(date) {
      let currentDate = new Date();
      currentDate = this.getFormattedDate(currentDate, 'YYYY-MM-DD');
      const orderDate = this.getFormattedDate(date, 'YYYY-MM-DD');

      if (orderDate > currentDate) {
        return true;
      }
      return false;
    },
    displayDateTime(date) {
      let displayString = '--';
      if (typeof date !== 'undefined') {
        displayString = this.getFormattedDate(date, 'h.mm a');
      }
      return displayString;
    },
    displayDateRange(dateRange) {
      let displayString = '--';
      if (typeof dateRange !== 'undefined') {
        const range = dateRange.split('to');

        const eta_split = dateRange.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const timeFrom = this.getFormattedDate(start, 'h.mm a');
        const timeTo = this.getFormattedDate(end, 'h.mm a');
        displayString = `${timeFrom} - ${timeTo}`;
      }
      return displayString;
    },
    // eslint-disable-next-line prettier/prettier
    displayAmount(currency, amount, vendor_type_id,fixed_cost, customer_min_amount,confirm_status) {
      // eslint-disable-next-line prettier/prettier
      const computedAmount = this.determineOrderAmounts(amount, vendor_type_id, fixed_cost, customer_min_amount, confirm_status);
      currency = currency || '';
      amount = this.numberWithCommas(computedAmount);
      let amountString = `${currency} ${amount}`;
      if (vendor_type_id === 25 && confirm_status < 1) {
        amountString = '-';
      }
      return amountString;
    },
    // eslint-disable-next-line prettier/prettier
    determineOrderAmounts(amount, vendorTypeID, fixedCost,  customerMinAmount, confirmStatus) {
      const freightArray = [20, 25];
      if (freightArray.includes(vendorTypeID) && !fixedCost) {
        if (confirmStatus < 1) {
          amount = customerMinAmount;
        }
      }
      return amount;
    },
    determine_vendor_name(vendorTypeID) {
      const vendorTypes = this.vendorTypes;
      let vendorName;
      if (vendorTypes[vendorTypeID] === 'undefined') {
        vendorName = 'New vendor type!';
      } else {
        vendorName = vendorTypes[vendorTypeID];
      }
      return vendorName;
    },
    showCurrencyBasedAmounts(orderDetails, currencyConversions, amount) {
      const clientCurrency = orderDetails.client_details.default_currency;
      const riderCurrency = orderDetails.rider_details.default_currency;
      const orderCurrency = orderDetails.payment_details.order_currency;

      const clientConversionArray = this.getSpecificCurrencyConversion(
        orderCurrency,
        clientCurrency,
        currencyConversions,
      );
      const clientAmount = this.calculateConvertedAmount(
        clientConversionArray,
        amount,
        orderCurrency,
        clientCurrency,
      );
      const riderAmount = this.calculateConvertedAmount(
        clientConversionArray,
        amount,
        orderCurrency,
        riderCurrency,
      );

      amount = Number(amount).toLocaleString('en');
      return `${orderCurrency} ${amount}${clientAmount}${riderAmount}`;
    },

    getSpecificCurrencyConversion(
      fromCurrency,
      toCurrency,
      currency_conversions,
    ) {
      const res = currency_conversions.filter(conversion =>
        conversion.from_currency.includes(fromCurrency),
      );
      const newArray = res.filter(arr => arr.to_currency.includes(toCurrency));
      return newArray;
    },

    calculateConvertedAmount(
      conversionArray,
      orderAmount,
      orderCurrency,
      currency,
    ) {
      let convertedAmount = '';

      if (currency !== orderCurrency) {
        convertedAmount = conversionArray[0].rate * orderAmount;
        convertedAmount = Number(convertedAmount).toLocaleString('en');
        convertedAmount = `<span class="col-md-8 pull-right exchangerate"> ( ${currency} ${convertedAmount} )</span>`;
      }

      return convertedAmount;
    },
    display_conditional_amounts(orderDetails, currencyConversions, amount) {
      let displayAmount = 0;
      const convertedAmount = this.showCurrencyBasedAmounts(
        orderDetails,
        currencyConversions,
        amount,
      );
      if (amount > 0) {
        displayAmount = convertedAmount;
      }
      return displayAmount;
    },
    smartify_display(myString, myLength) {
      if (myString !== null && parseInt(myString.length) > myLength) {
        const myTruncatedString = myString.substring(0, myLength);

        return `<span data-toggle="tooltip" title="${myString}">${myTruncatedString}  ...  <span>`;
      } else {
        return myString;
      }
    },
    showCity(city) {
      let cityName;
      if (city.id === 1 || city.id === 2 || city.id === 3) {
        cityName = city.name;
      } else {
        cityName = 'Other';
      }
      return cityName;
    },
  },
});
