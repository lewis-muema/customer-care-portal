<template>
  <div class="row tag-display">
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      class="myclass tags-input"
      @tags-changed="newTags => (tags = newTags)"
    />
    <div class="text-right">
      <i class="fa fa-spinner fa-spin loader spinner" v-if="posted"></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'TheTagsComponent',
  components: {
    VueTagsInput,
  },
  props: ['savedTags', 'survey'],
  data() {
    return {
      tag: '',
      tags: [],
      posted: false,
      success: false,
      fail: false,
      mounted: false,
    };
  },
  watch: {
    async tags(tags) {
      if (this.mounted) {
        this.posted = true;
        this.success = false;
        this.fail = false;
        const arr = [];
        for (let i = 0; i < tags.length; i += 1) {
          arr.push(tags[i].text);
        }
        await this.updateNPSTags(arr);
        this.posted = false;
      }
    },
  },
  mounted() {
    const result =
      this.savedTags !== null ? JSON.parse(this.savedTags) : this.savedTags;
    const saved =
      result !== null
        ? result.map(item => ({
            text: item,
            tiClasses: ['ti-valid'],
          }))
        : [];
    this.tags = saved;
    this.mounted = true;
  },
  methods: {
    ...mapActions({
      update_nps_tags: 'update_nps_tags',
    }),
    async updateNPSTags(tags) {
      const payload = {
        app: 'ADONIS_API',
        endpoint: `nps/surveys/${this.survey}`,
        params: {
          tags,
        },
      };
      try {
        const data = await this.update_nps_tags(payload);
        if (data.data.success) {
          this.success = true;
        } else {
          this.fail = true;
        }
      } catch (error) {
        this.fail = true;
      }
    },
  },
};
</script>
<style scoped>
.loader {
  color: #3c8dbc;
  margin-top: 9px;
  margin-left: 10px;
}
.tag-display {
  margin-left: 0;
}
.check {
  color: #4ca643;
}
.times {
  color: #d9372e;
}

.vue-tags-input {
  background: #f5f7fa;
  cursor: pointer;
  max-width: 100%;
}
</style>
