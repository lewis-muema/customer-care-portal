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
          :close-on-select="true"
          @select="onSelect($event)"
          @remove="onRemove($event)"
          class="vendor-search"
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
      resetAfter: true,
      selectedVendors: [],
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
    value(data) {
      this.selectedVendors = [];
      for (let i = 0; i < data.length; i += 1) {
        this.selectedVendors.push(data[i].vendor_type_id);
      }
      this.updateSelectedVendors(this.selectedVendors);
    },
  },
  async mounted() {
    await this.setVendorTypes();
  },
  methods: {
    ...mapMutations({
      updateSelectedVendors: 'setSelectedVendors',
    }),
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
  text-transform: capitalize;
}
.vendor-search {
  width: 25%;
}
.filter-search {
  width: 100%;
}
.filter-bar {
  margin-right: 0px;
  margin-left: 4px;
}
.typo__label {
  margin-right: 12px;
  margin-top: 0.5em;
}
.multiselect__tag {
  background-color: #3c8dbc;
  text-transform: capitalize;
}

.multiselect__option--highlight {
  background: #3c8dbc;
}
.multiselect__option--selected.multiselect__option--highlight {
  background: #3f9f4a;
}
.multiselect__tag-icon:after {
  color: #ffffff;
}

.multiselect__content {
  text-transform: capitalize;
}
.multiselect__option {
  text-transform: capitalize;
}
</style>
