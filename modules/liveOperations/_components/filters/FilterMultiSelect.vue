<template>
  <div>
    <multiselect
      select-label=""
      selected-label=""
      deselect-label=""
      v-model="value"
      :options="data"
      :multiple="true"
      track-by="name"
      :close-on-select="true"
      :custom-label="customLabel"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      class="filter-search"
    >
      <span
        class="checkbox-label"
        slot="option"
        slot-scope="scope"
        @click.self="select(scope.option)"
      >
        {{ scope.option.name }}
        <input
          class="test"
          type="checkbox"
          v-model="scope.option.checked"
          @focus.prevent
        />
      </span>
    </multiselect>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

export default {
  name: 'FilterMultiSelect',
  components: {
    Multiselect,
  },
  props: ['category', 'data'],
  data() {
    return {
      value: [],
      selectedAdmins: [],
      selectedAlerts: [],
    };
  },
  computed: {
    admins() {
      return this.data;
    },
    alerts() {
      return this.data;
    },
  },
  watch: {
    value(data) {
      this.selectedAdmins = [];
      this.selectedAlerts = [];
      for (let i = 0; i < data.length; i += 1) {
        if (this.category === 'admins') {
          this.selectedAdmins.push(data[i].admin_id);
        } else {
          this.selectedAlerts.push(data[i].id);
        }
      }
      return this.category === 'admins'
        ? this.updateSelectedAdmins(this.selectedAdmins)
        : this.updateSelectedAlerts(this.selectedAlerts);
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedAlerts: 'setSelectedAlerts',
      updateSelectedAdmins: 'setSelectedAdmins',
    }),
    customLabel(option) {
      return option.name;
    },
    onSelect(option) {
      const index =
        this.category === 'admins'
          ? this.data.findIndex(item => item.admin_id === option.admin_id)
          : this.data.findIndex(item => item.id === option.id);

      if (this.category === 'admins') {
        this.admins[index].checked = true;
      } else {
        this.alerts[index].checked = true;
      }
    },

    onRemove(option) {
      const index =
        this.category === 'admins'
          ? this.data.findIndex(item => item.admin_id === option.admin_id)
          : this.data.findIndex(item => item.id === option.id);

      if (this.category === 'admins') {
        this.admins[index].checked = false;
      } else {
        this.alerts[index].checked = false;
      }
    },
    select(data) {
      return data;
    },
  },
};
</script>
