<template>
  <div class="fulfilment-multiselect">
    <label class="typo__label fulfilment-filter-header">Filter Countries</label>
    <multiselect
      v-model="checkedOptions"
      placeholder="Search Hubs"
      label="name"
      track-by="code"
      :options="options"
      :multiple="false"
      :taggable="true"
      select-label=""
      selected-label=""
      deselect-label=""
      :custom-label="customLabel"
      :close-on-select="true"
      class="multiselect"
      @input="submitMethod"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      :disabled="processing"
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
        <span class="ml-2">
          {{ scope.option.name }}
        </span>
      </span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CountryFilter',
  components: {
    Multiselect,
  },
  data() {
    return {
      checkedOptions: { code: 'all', name: 'All Countries', checked: true },
      hubs: [],
      options: [{ code: 'all', name: 'All Countries', checked: true }],
      selectedCountry: [],
      processing: false,
    };
  },
  computed: {
    ...mapGetters({
      getSupportedCountries: 'fulfilment/getSupportedCountries',
    }),
  },
  watch: {
    getSupportedCountries(countries) {
      this.options = [{ code: 'all', name: 'All Countries', checked: true }];
      countries.forEach(country => {
        this.options.push({
          code: country.code,
          name: country.name,
          checked: false,
        });
      });
    },
    getProcessingStatus(status) {
      this.processing = status;
    },
  },
  mounted() {
    this.fetchCountries();
  },

  methods: {
    ...mapMutations({
      updateSelectedCountry: 'fulfilment/setSelectedCountry',
    }),
    ...mapActions({
      fetchCountries: 'fulfilment/fetchHubCountries',
    }),

    customLabel(option) {
      return `${option.name}`;
    },
    onSelect(option) {
      const index = this.options.findIndex(item => item.code === option.code);
      const previousIndex = this.options.findIndex(
        item => item.code === this.checkedOptions.code,
      );

      this.options[index].checked = true;
      this.options[previousIndex].checked = false;
    },
    onRemove(option) {
      const index = this.options.findIndex(item => item.code === option.code);

      this.options[index].checked = false;
    },
    select(data) {
      return data;
    },
    submitMethod() {
      this.selectedCountry = this.checkedOptions.name;
      this.updateSelectedCountry(this.selectedCountry);
    },
  },
};
</script>
