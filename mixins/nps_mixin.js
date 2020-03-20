import moment from 'moment';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const NPSMxn = {
  data() {
    return {
      businessUnits: [],
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
    ...mapActions(['requestBusinessUnits']),

    async requestUnits() {
      const allCategory = {
        code: 'allaccounts',
        title: 'All',
        category: 'partner',
      };
      const businessHolder = [];

      businessHolder.push(allCategory);
      const arr = await this.requestBusinessUnits();
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
