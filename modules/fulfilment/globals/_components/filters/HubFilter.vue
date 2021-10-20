<template>
  <div class="fulfilment-multiselect">
    <label class="typo__label fulfilment-filter-header">Hubs</label>
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
  name: 'HubsFilter',
  components: {
    Multiselect,
  },
  data() {
    return {
      checkedOptions: { code: 'all', name: 'All Hubs', checked: true },
      hubs: [],
      options: [{ code: 'all', name: 'All Hubs', checked: true }],
      selectedHubs: [],
    };
  },
  computed: {
    ...mapGetters({
      getHubs: 'fulfilment/getHubs',
    }),
  },
  watch: {
    getHubs(hubs) {
      this.options = [{ code: 'all', name: 'All Hubs', checked: true }];
      hubs.forEach(hub => {
        this.options.push({
          code: hub.hub_id,
          name: hub.hub_name,
          checked: false,
        });
        this.hubs.push(hub.hub_id);
      });
    },
  },
  mounted() {
    this.fetchHubs();
  },

  methods: {
    ...mapMutations({
      updateSelectedHubs: 'fulfilment/setSelectedHubs',
    }),
    ...mapActions({
      fetchHubs: 'fulfilment/fetchHubs',
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
      this.selectedHubs = this.checkedOptions.code;
      this.updateSelectedHubs(this.selectedHubs);
    },
  },
};
</script>
