<template>
  <div class="">
    <span class=""> Filter Business Unit </span> <br />
    <multiselect
      select-label=""
      selected-label=""
      deselect-label=""
      v-model="businessUnits"
      :options="options"
      :multiple="true"
      track-by="value"
      :custom-label="customLabel"
      :close-on-select="true"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      class="multiselect"
      placeholder="Search Business Unit"
      @input="submitMethod"
    >
      <span
        class="checkbox-label"
        slot="option"
        slot-scope="scope"
        @click.self="select(scope.option)"
      >
        <input
          class="test"
          type="checkbox"
          v-model="scope.option.checked"
          @focus.prevent
        />
        <span class="ml-4">
          {{ scope.option.label }}
        </span>
      </span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'BusinessUnitFilter',
  components: {
    Multiselect,
  },
  data() {
    return {
      value: '',
      options: [{ value: 'all', label: 'All Business Units', checked: true }],
      isCheckAll: true,
      unitsdata: [],
      units: [],
      selectedUnits: [],
      businessUnits: [
        { value: 'all', label: 'All Business Units', checked: false },
      ],
    };
  },
  computed: {
    ...mapGetters(['getBusinessUnits', 'getOrderStatuses']),
  },
  watch: {
    getBusinessUnits(data) {
      this.options = [
        { value: 'all', label: 'All Business Units', checked: true },
      ];
      this.unitsdata = [];
      data.forEach(item => {
        this.options.push({
          value: item.abbr,
          label: item.abbr,
          checked: false,
        });
        this.unitsdata.push(item.abbr.toLowerCase().trim());
      });
    },
  },
  mounted() {
    if (process.client) {
      this.requestUnits();
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedUnits: 'setSelectedBusinessUnits',
    }),
    ...mapActions(['setBusinessUnits']),
    async requestUnits() {
      await this.setBusinessUnits();
    },
    customLabel(option) {
      return `${option.label}`;
    },
    onSelect(option) {
      const index = this.options.findIndex(item => item.value === option.value);
      this.options[index].checked = true;
    },
    onRemove(option) {
      const index = this.options.findIndex(item => item.value === option.value);
      this.options[index].checked = false;
    },
    select(data) {
      return data;
    },
    productMethod() {
      const arr = [];
      this.value.forEach(element => {
        arr.push(element.value);
      });
      this.cop_names = arr;
      this.selected_cop_names =
        this.cop_names.includes('all') || this.cop_names.includes('logistics')
          ? ['normal']
          : this.cop_names;
      this.updateSelectedCopNames(this.selected_cop_names);
    },
    submitMethod() {
      const arr = [];
      this.businessUnits.forEach(element => {
        arr.push(element.value.toLowerCase().trim());
      });
      this.units = arr;
      this.selectedUnits =
        this.units.includes('all') || this.units.length <= 0
          ? this.unitsdata
          : this.units;
      this.updateSelectedUnits(this.selectedUnits);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.input-text {
  width: 166px;
  left: 16px;
  top: 8px;
  bottom: 8px;
  background: #ffffff;
  border: 1px solid #c0c4cc;
  box-sizing: border-box;
  border-radius: 8px;
}
.span-left {
  margin-left: 18px;
}
.multiselect {
  width: 196px;
}
.test {
  position: absolute;
  left: 1vw;
}
</style>
