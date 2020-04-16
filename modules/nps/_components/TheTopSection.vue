<template>
  <div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12 nps-side">
      <div class="info-box blue-box">
        <div class="row nps-avg">
          <div class="nps-score" v-if="updated">NPS: {{ npsScore }}</div>
          <div class="nps-score" v-if="!updated">
            NPS: <i class="fa fa-spinner fa-spin loading"></i>
          </div>

          <div class="nps-range">{{ npsActiveDates }}</div>
        </div>
      </div>
    </div>
    <div class="col-md-8 row">
      <div
        v-for="(svg, index) in npsSvgs"
        :key="index"
        :class="`info-box ${svg.color}-box col-md-4`"
        @click="toggleGroup(index, svg.name)"
      >
        <div class="group-hld" :class="{ active: opened.includes(svg.name) }">
          <div class="nps-group col-md-12">
            <div class="col-md-5 ">
              <div class="nps-emoji">
                <span class="emoji-trigger">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                    <g clip-path="url(#clip0)">
                      <path :d="`${svg.path}`" fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="40" height="40" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div class="col-md-6 percentage-holder">
              <div class="percentage-score" v-if="updated">
                {{ calculatePercentage(svg.name) }}
              </div>
              <div class="percentage-score" v-if="!updated">
                <i class="fa fa-spinner fa-spin loading"></i>
              </div>

              <div class="group-text">{{ svg.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import SvgsMxn from '@/mixins/svgs_mixin';
import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheTopSection',
  mixins: [SvgsMxn, NPSMxn],
  props: {
    surveys: {
      type: Array,
      required: true,
    },
    metaData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // activeGroup: null,
      selectedClass: null,
      isActive: false,
      activeItem: null,
      totalDetractors: 10,
      totalPassives: 10,
      totalPromoters: 10,
      filters: false,
      requestedMetaData: null,
      activeDates: null,
      activeFilters: {},
      npsScore: null,
      updated: null,
      opened: [],
      groupArray: [],
      filtersUpdated: false,
      displayGroups: [],
    };
  },
  computed: {
    ...mapGetters([
      'getNPSMetaData',
      'getNPSDateRange',
      'getNPSFilters',
      'getNPSActiveGroup',
    ]),
    ...mapState(['activeGroup']),

    metaInfo() {
      return this.filters ? this.requestedMetaData : this.metaData;
    },
    npsActiveDates() {
      return this.activeDates !== null ? this.activeDates : this.npsDateRange;
    },
  },
  watch: {
    // eslint-disable-next-line require-await
    async groupArray(group) {
      const arr = [];
      const selected = await arr.concat(group);
      await this.setNPSActiveGroup(selected);
    },
    async getNPSActiveGroup(group) {
      const arr = [];
      const selected = await arr.concat(group);
      this.opened = selected;
    },
    getNPSFilters(filters) {
      this.updated = false;
      this.activeFilters = filters;
    },
    async getNPSMetaData(totals) {
      this.filters = true;
      this.requestedMetaData = totals;
      const updatescore = await this.calculateNPSScore();
      this.npsScore = this.canUpdateNPSScore(this.activeFilters)
        ? this.npsScore
        : updatescore;
      this.updated = true;
    },
    getNPSDateRange(dateRange) {
      const startDate = dateRange.startDate;
      const endDate = dateRange.endDate;
      const rangeStart = this.formatDate(startDate, 'MMM DD');
      const rangeEnd = this.formatDate(endDate, 'MMM DD');
      this.activeDates = `${rangeStart} - ${rangeEnd}`;
    },
  },
  async mounted() {
    this.npsScore = await this.calculateNPSScore();
    this.updated = true;
  },
  methods: {
    ...mapMutations(['setNPSActiveGroup']),

    canUpdateNPSScore(filters) {
      return (
        'respondent_group' in filters &&
        typeof filters.respondent_group !== 'undefined' &&
        filters.respondent_group.length !== 0
      );
    },
    calculateNPSScore() {
      const meta = this.metaInfo;
      const promoters = meta.promoter;
      const detractors = meta.detractor;
      const responses = meta.responded;
      const promoterPerc = (promoters / responses) * 100;
      const detractorPerc = (detractors / responses) * 100;

      const score = responses !== 0 ? promoterPerc - detractorPerc : 0;

      // eslint-disable-next-line no-restricted-globals
      return isNaN(score) ? 0 : score.toFixed(0);
    },
    async toggleGroup(index, group) {
      this.filtersUpdated = true;
      const arr = [];
      const savedGroup = arr.concat(this.activeGroup);
      const ind = savedGroup.indexOf(group);

      if (ind > -1) {
        await savedGroup.splice(ind, 1);
        this.groupArray = savedGroup;
      } else {
        const holder = [];
        holder.push(group);
        this.groupArray = holder.concat(savedGroup);
      }
    },

    calculatePercentage(group) {
      const grouptotal = this.metaInfo[`${group}`];
      const responses = this.metaInfo.responded;
      const score = responses !== 0 ? (grouptotal / responses) * 100 : 0;
      // eslint-disable-next-line no-restricted-globals
      return isNaN(score) ? 0 : `${score.toFixed(0)}%`;
    },
    showResponses(group) {
      const grouptotal = this.metaInfo[`${group}`];
      return `${grouptotal} responses`;
    },
  },
};
</script>
<style scoped>
.info-box {
  display: block;
  width: 84%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #ffffff;
  height: 68px;
  padding-right: 0;
  padding-left: 0;
}
.group-hld {
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.nps-score {
  width: 140px;
  height: 48px;
  font-weight: bold;
  font-size: 26px;
  line-height: 120%;
}
.loading {
  color: #ffffff;
  font-weight: 700;
  font-size: 19px;
}
.nps-avg {
  padding-top: 17px;
  padding-left: 28px;
}
.blue-box {
  background: #0f4271;
}
.green-box {
  background: #21a642;
  border-radius: 5px 0 0 5px;
}
.grey-box {
  background: #6b8399;
  border-radius: 0;
}
.red-box {
  background: #d9372b;
  border-radius: 0 5px 5px 0;
}
.nps-group {
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-top: 1 px;
  text-align: right;
  cursor: pointer;
}
.active {
  background: #104270 !important;
  height: 68px;
}
.group-text {
  line-height: 28px;
  margin-right: 2em;
  font-weight: 600;
}
.nps-emoji {
  margin-top: 23%;
  margin-right: 1em;
}
.nps-range {
  margin-top: 10px;
}
.percentage-holder {
  text-align: left;
  padding-left: 2em;
}
.percentage-score {
  font-weight: 700;
  font-size: 25px;
}
.percentage-responses {
  margin-top: 6px;
}
</style>
