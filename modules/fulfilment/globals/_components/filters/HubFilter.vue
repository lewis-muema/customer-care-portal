<template>
  <div>
    <label class="typo__label">Hubs</label>
    <multiselect
      v-model="value"
      tag-placeholder="Add new hubg"
      placeholder="Search or add an hub"
      label="name"
      track-by="code"
      :options="options"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      select-label=""
      selected-label=""
      deselect-label=""
      :custom-label="customLabel"
      :close-on-select="true"
      class="multiselect"
      @input="submitMethod"
    ></multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  name: 'HubFilter',
  components: {
    Multiselect,
  },
  data() {
    return {
      value: [{ name: 'Main Warehouse', code: '1' }],
      options: [
        { name: 'Main Warehouse', code: '1' },
        { name: 'Roysambu Hub', code: '2' },
        { name: 'Tilisi', code: '3' },
      ],
    };
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
};
</script>

<style></style>
