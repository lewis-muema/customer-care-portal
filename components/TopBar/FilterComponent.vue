<template>
  <div class="">
    <span class=""> Filter Products </span> <br />
    <multiselect
      select-label=""
      selected-label=""
      deselect-label=""
      v-model="value"
      :options="options"
      :multiple="true"
      track-by="value"
      :custom-label="customLabel"
      :close-on-select="true"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      class="multiselect"
      placeholder="Search Products"
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
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'FilterComponent',
  components: {
    Multiselect,
  },
  data() {
    return {
      value: [
        {
          value: 'all',
          label: 'All Sendy Products',
          checked: true,
        },
      ],
      cop_names: [],
      selected_cop_names: [],
      options: [
        { value: 'all', label: 'All Sendy Products', checked: true },
        { value: 'normal', label: 'Transportation', checked: false },
        { value: 'Kiota', label: 'Kiota', checked: false },
        { value: 'SendyGO', label: 'Sendy GO', checked: false },
      ],
    };
  },
  methods: {
    ...mapMutations({
      updateSelectedCopNames: 'setSelectedCopNames',
    }),
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
    submitMethod(option) {
      switch (true) {
        case this.value.length <= 0:
          this.selected_cop_names = ['all'];
          break;
        default: {
          const arr = [];
          this.value.forEach(element => {
            arr.push(element.value);
          });
          this.cop_names = arr;
          this.selected_cop_names = this.cop_names.includes('normal')
            ? ['normal']
            : this.cop_names;
          break;
        }
      }
      this.value =
        option.length !== 0 && option.value === 'all' ? [option] : this.value;
      this.updateSelectedCopNames(this.selected_cop_names);
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
