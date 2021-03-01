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
      :close-on-select="false"
      @select="onSelect($event)"
      @remove="onRemove($event)"
      class="multiselect"
      placeholder="All Products"
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
      value: '',
      cop_names: [],
      selected_cop_names: [],
      options: [
        { value: 'all', label: 'All Sendy Products', checked: false },
        { value: 'transportation', label: 'Transportation', checked: false },
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
      switch ('all') {
        case option.value:
          this.options.forEach(item => {
            item.checked = true;
          });
          break;
        default: {
          const index = this.options.findIndex(
            item => item.value === option.value,
          );
          this.options[index].checked = true;
          break;
        }
      }
    },
    onRemove(option) {
      switch ('all') {
        case option.value:
          this.options.forEach(item => {
            item.checked = false;
          });
          break;
        default: {
          const index = this.options.findIndex(
            item => item.value === option.value,
          );
          this.options[index].checked = false;
          break;
        }
      }
    },
    select(data) {
      return data;
    },
    submitMethod() {
      const arr = [];
      this.value.forEach(element => {
        arr.push(element.value);
      });
      this.cop_names = arr;
      this.selected_cop_names =
        this.cop_names.includes('all') ||
        this.cop_names.includes('transportation')
          ? ['normal']
          : this.cop_names;
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
