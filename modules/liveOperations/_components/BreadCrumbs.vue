<template>
  <div class="filter-bar row">
    <div class="col-md-9 col-xs-6">
      <div class="col-md-9 col-xs-6 row">
        <label class="typo__label">Filter Vendor Type:</label>

        <multiselect
          select-label=""
          selected-label=""
          deselect-label=""
          v-model="value"
          :options="vendorTypes"
          :multiple="true"
          track-by="vendor_type_id"
          :custom-label="customLabel"
          :close-on-select="false"
          @select="onSelect($event)"
          @remove="onRemove($event)"
        >
          <span
            class="checkbox-label"
            slot="option"
            slot-scope="scope"
            @click.self="select(scope.option)"
          >
            {{
              scope.option.vendor_type_id === 4 ||
              scope.option.vendor_type_id === 7
                ? `${scope.option.vendor_type_name} ${scope.option.vendor_disp_name}`
                : scope.option.vendor_disp_name
            }}
            <input
              class="test"
              type="checkbox"
              v-model="scope.option.checked"
              @focus.prevent
            />
          </span>
        </multiselect>
      </div>
    </div>
    <div class="col-md-3 col-xs-6">
      <TheDatePicker />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'BreadCrumbs',
  components: {
    Multiselect,
    TheDatePicker: () => import('./TheDatePicker'),
  },
  data() {
    return {
      value: [],
      vendorTypes: [],
    };
  },
  computed: {
    ...mapGetters(['getVendorTypes']),
  },
  watch: {
    getVendorTypes(data) {
      const arr = [];

      const All = {
        vendor_type_id: null,
        vendor_type_name: 'All',
        vendor_disp_name: 'All Vendor Types',
        checked: false,
      };
      arr.push(All);
      for (let i = 0; i < data.length; i += 1) {
        data[i].checked = false;
        arr.push(data[i]);
      }
      this.vendorTypes = arr;
    },
  },
  async mounted() {
    await this.setVendorTypes();
  },
  methods: {
    ...mapActions(['setVendorTypes']),
    customLabel(option) {
      return `${option.vendor_disp_name}`;
    },
    onSelect(option) {
      const index = this.vendorTypes.findIndex(
        item => item.vendor_type_id === option.vendor_type_id,
      );
      this.vendorTypes[index].checked = true;
    },

    onRemove(option) {
      const index = this.vendorTypes.findIndex(
        item => item.vendor_type_id === option.vendor_type_id,
      );
      this.vendorTypes[index].checked = false;
    },
    select(data) {
      return data;
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.checkbox-label {
  display: block;
}

.test {
  position: absolute;
  right: 1vw;
}
.multiselect {
  box-sizing: content-box;
  display: inline-block;
  position: relative;
  width: 25%;
}
.filter-bar {
  margin-right: 0px;
  margin-left: 4px;
}
.typo__label {
  margin-right: 12px;
  margin-top: 0.5em;
}
</style>
