import moment from 'moment';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const LiveOpsMxn = {
  data() {
    return {
      businessUnits: [],
    };
  },
  computed: {
    ...mapGetters(['getBusinessUnits']),
    firstDayOfCurrentMonth() {
      const startOfMonth = moment()
        .startOf('month')
        .format('YYYY-MM-DD');
      return this.formatDate(this.convertToUTC(startOfMonth), 'YYYY-MM-DD');
    },
    lastDayOfCurrentMonth() {
      const endOfMonth = moment()
        .endOf('month')
        .format('YYYY-MM-DD');
      return this.formatDate(this.convertToUTC(endOfMonth), 'YYYY-MM-DD');
    },
    npsDateRange() {
      const startOfMonth = moment()
        .startOf('month')
        .format('MMM DD');
      const endOfMonth = moment()
        .endOf('month')
        .format('MMM DD');
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
      const formattedDate = moment(dt1).fromNow();
      return formattedDate;
    },
    async requestUnits() {
      const arr = await this.setBusinessUnits();

      this.businessUnits = arr;
    },
  },
};
export default LiveOpsMxn;
