<template>
  <div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12 nps-side">
      <div class="info-box blue-box">
        <div class="row nps-avg">
          <div class="nps-score">NPS: 40</div>
          <div class="nps-range">{{ npsDateRange }}</div>
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
        <div class="row group-hld" :class="{ active: index === activeItem }">
          <div class="nps-group col-md-8">
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
            <div class="group-text">{{ svg.title }}</div>
          </div>
          <div v-if="index === activeItem" class="percentage-holder col-md-3">
            <div class="percentage-score">40%</div>
            <div class="percentage-responses">20 responses</div>
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
  },
  data() {
    return {
      activeGroup: null,
      selectedClass: null,
      isActive: false,
      activeItem: null,
      totalDetractors: 10,
      totalPassives: 10,
      totalPromoters: 10,
    };
  },
  methods: {
    ...mapMutations(['setNPSActiveGroup']),

    toggleGroup(index, group) {
      this.isActive = !this.isActive;
      this.activeItem = index;
      this.activeGroup = group;
      this.setNPSActiveGroup(group);
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
.nps-score {
  width: 140px;
  height: 48px;
  font-weight: bold;
  font-size: 26px;
  line-height: 120%;
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
  padding-top: 7px;
  text-align: right;
  cursor: pointer;
}
.active {
  background: #104270 !important;
}
.group-text {
  line-height: 28px;
  margin-right: 2em;
}
.nps-emoji {
  margin-bottom: 5px;
  margin-right: 3em;
}
.nps-range {
  margin-top: 10px;
}
.percentage-holder {
  padding-right: 0;
  padding-left: 0;
}
.percentage-score {
  font-weight: 700;
  font-size: 25px;
}
.percentage-responses {
  margin-top: 6px;
}
</style>
