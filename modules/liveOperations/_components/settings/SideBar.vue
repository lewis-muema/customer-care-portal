<template>
  <div class="col-md-4 side-bar">
    <div v-for="(data, index) in criteria" :key="index" class="vendor-holder">
      <div class="">
        <div
          class="vendor-labels"
          @click="setActiveVendorType(data, index)"
          :class="{ 'active-vendor': active === index }"
        >
          {{ data.alert_type_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'SettingsSideBar',
  props: ['criteria'],
  data() {
    return {
      businessUnits: null,
      active: 0,
    };
  },

  computed: {
    ...mapGetters(['getBusinessUnits']),
  },
  watch: {
    getBusinessUnits(data) {
      this.businessUnits = data;
    },
  },
  async mounted() {
    await this.setActiveVendorType(this.criteria[0], 0);
  },
  methods: {
    ...mapMutations({
      updateActiveVendor: 'setActiveLiveOpsVendor',
    }),
    getVendorImg(businessUnit) {
      let image = '19.svg';
      switch (businessUnit) {
        case 1:
          image = '1.svg';
          break;
        case 2:
          image = '6.svg';
          break;
        case 3:
          image = '25.svg';
          break;
        default:
          break;
      }
      return image;
    },
    setActiveVendorType(data, index) {
      this.active = index;
      this.updateActiveVendor(data);
    },
  },
};
</script>

<style></style>
