import moment from 'moment';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const offlineOrderMxn = {
  methods: {
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
    formatDateMonthyear(date) {
      return this.convertToLocalTime(date, 'DD MMMM YYYY');
    },
    async requestUnits() {
      const arr = await this.requestBusinessUnits();

      this.businessUnits = arr;
    },
    CommaSeperator(value) {
      const result = Math.round(value);
      return result.toLocaleString();
    },
  },
};
export default offlineOrderMxn;
