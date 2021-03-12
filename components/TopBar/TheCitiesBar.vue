<template>
  <div class="">
    <span class=""> Filter Town </span> <br />
    <multiselect
      select-label=""
      selected-label=""
      deselect-label=""
      v-model="checkedCities"
      :options="options"
      :multiple="true"
      track-by="value"
      :custom-label="customLabel"
      :close-on-select="true"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      class="multiselect"
      placeholder="Search Towns"
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
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'cityBar',
  components: {
    Multiselect,
  },
  data() {
    return {
      options: [{ value: 'all', label: 'All Towns', checked: false }],
      citiesData: [],
      cities: null,
      checkedCities: [{ value: 'all', label: 'All Towns', checked: false }],
      selectedCities: [],
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters(['getCities']),
    countryCodes() {
      return this.userData.payload.data.country_codes;
    },
  },
  watch: {
    getCities(cities) {
      this.options = [{ value: 'all', label: 'All Towns', checked: true }];
      this.unitsdata = [];
      cities.forEach(city => {
        this.options.push({
          value: city.city_id,
          label: city.city_name,
          checked: false,
        });
        this.citiesData.push(city.city_id);
      });
    },
  },
  mounted() {
    if (process.client) {
      const countryCode = JSON.parse(this.countryCodes);
      this.setCities({
        params: {
          code: countryCode,
        },
      });
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedCities: 'setSelectedCities',
    }),
    ...mapActions(['setCities']),

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
    submitMethod() {
      const arr = [];
      this.checkedCities.forEach(element => {
        arr.push(element.value);
      });
      this.selectedCities = arr.includes('all') ? this.citiesData : arr;
      this.updateSelectedCities(this.selectedCities);
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
