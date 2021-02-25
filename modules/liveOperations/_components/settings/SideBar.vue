<template>
  <div class="col-md-3 side-bar">
    <div
      v-for="(businessUnit, index) in businessUnits"
      :key="index"
      class="vendor-holder"
    >
      <div class="col-md-4 text-right">
        <img
          :src="
            `https://images.sendyit.com/web_platform/vendor_type/side/v2/${getVendorImg(
              businessUnit.business_unit_id,
            )}`
          "
          height="30"
        />
      </div>
      <div class="col-md-8">
        <div class="business-unit-header">{{ businessUnit.abbr }}</div>
        <div v-for="(vendorType, i) in businessUnit.vendorTypes" :key="i">
          <div
            class="vendor-labels"
            @click="
              setActiveVendorType(
                vendorType.vendor_type_id,
                vendorType.vendor_disp_name,
                businessUnit.business_unit_id,
                businessUnit.name,
              )
            "
            :class="{ 'active-vendor': active === vendorType.vendor_type_id }"
          >
            {{ vendorType.vendor_disp_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'SettingsSideBar',
  data() {
    return {
      businessUnits: null,
      active: 1,
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
    setActiveVendorType(id, vendorType, businessUnitID, businessUnitname) {
      this.active = id;
      const data = {
        vendorTypeID: id,
        vendorType,
        businessUnitID,
        businessUnitname,
      };
      this.updateActiveVendor(data);
    },
  },
};
</script>

<style></style>
