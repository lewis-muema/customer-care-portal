import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

const NPSMxn = {
  data() {
    return {
      businessUnits: [],
      surveyComponentKey: 0,
      surveyTotalsComponentKey: 1,
      metricsComponent: 2,
      countries: [],
      requiredCountries: ['KE', 'UG'],
      allCategory: {
        code: null,
        title: 'All',
      },
      customerGroups: [
        {
          code: 'owner',
          title: 'Owner',
          category: 'owner',
        },
        {
          code: 'peer',
          title: 'Customer - Peer',
          category: 'peer',
        },
        {
          code: 'cop',
          title: 'Customer - Business',
          category: 'cop',
        },
      ],
      groups: [
        {
          code: 'allgroups',
          title: 'All',
          category: 'group',
        },
        {
          code: 'promoter',
          title: 'Promoters',
          category: 'group',
        },
        {
          code: 'passive',
          title: 'Passives',
          category: 'group',
        },
        {
          code: 'detractor',
          title: 'Detractors',
          category: 'group',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getBusinessUnits']),

    firstDayOfCurrentMonth() {
      const startOfMonth = moment()
        .startOf('month')
        .format('YYYY-MM-DD 00:00:00');
      return this.convertToUTC(startOfMonth);
    },
    lastDayOfCurrentMonth() {
      const endOfMonth = moment()
        .endOf('month')
        .format('YYYY-MM-DD 00:00:00');
      return this.convertToUTC(endOfMonth);
    },
    npsDateRange() {
      // eslint-disable-next-line prettier/prettier
        const startOfMonth = moment().startOf('month').format('MMM DD');
      // eslint-disable-next-line prettier/prettier
        const endOfMonth   = moment().endOf('month').format('MMM DD');
      return `${startOfMonth} - ${endOfMonth}`;
    },
  },
  mounted() {
    this.requestUnits();
  },
  methods: {
    ...mapActions(['setBusinessUnits']),

    formatDate(date, format) {
      return moment(date).format(format);
    },
    isEmpty(obj) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;
    },
    convertToUTC(date) {
      return moment.utc(date).format();
    },
    convertToLocalTime(date, format) {
      return moment(date)
        .local()
        .format(format);
    },
    getDateFromNow(date) {
      const dt1 = this.convertToLocalTime(date, 'YYYY.MM.DD HH:mm:ss');
      return moment(dt1).fromNow();
    },
    forceRerender() {
      this.surveyComponentKey += 1;
      this.paginationComponentKey += 1;
      this.surveyComponentKey += 1;
      this.metricsComponent += 1;
    },
    removeElement(array, elem) {
      const index = array.indexOf(elem);
      if (index > -1) {
        array.splice(index, 1);
      }
      return array;
    },
    async requestUnits() {
      const allCategory = {
        code: 'allaccounts',
        title: 'All',
        category: 'partner',
      };
      const businessHolder = [];

      businessHolder.push(allCategory);
      const arr = await this.setBusinessUnits();
      for (let i = 0; i < arr.length; i += 1) {
        const data = {
          code: arr[i].abbr,
          title: `Partner - ${arr[i].abbr}`,
          category: 'partner',
        };
        businessHolder.push(data);
      }
      const accountTypes = businessHolder.concat(this.customerGroups);
      this.businessUnits = accountTypes;
    },
  },
};
export default NPSMxn;
