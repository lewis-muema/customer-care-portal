<template>
  <span>
    <div v-if="!valid" class="invalid-error">
      Please enter valid email addresses
    </div>
    <div class="row tag-display" :class="{ 'invalid-holder': !valid }">
      <vue-tags-input
        v-model="tag"
        :tags="tags"
        class="myclass tags-input"
        :placeholder="placeholderText"
        @tags-changed="newTags => (tags = newTags)"
        @before-deleting-tag="updateDeleted"
      />
      <div class="text-right">
        <i class="fa fa-spinner fa-spin loader spinner" v-if="posted"></i>
      </div>
    </div>
  </span>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'TheTagsComponent',
  components: {
    VueTagsInput,
  },
  props: ['targetGroups'],
  data() {
    return {
      tag: '',
      tags: this.targetGroups,
      posted: false,
      success: false,
      fail: false,
      mounted: false,
      placeholderText: 'Enter Email Addresses (Press "enter" after each email)',
      emails: null,
      valid: true,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    };
  },
  watch: {
    // eslint-disable-next-line require-await
    async tags(tags) {
      this.valid = true;
      if (this.mounted) {
        this.posted = true;
        this.success = false;
        this.fail = false;
        const arr = [];
        for (let i = 0; i < tags.length; i += 1) {
          if (!this.isEmailValid(tags[i].text)) {
            this.valid = false;
            return;
          }
          const obj = { email: tags[i].text };
          arr.push(obj);
          this.valid = true;
        }
        this.emails = arr;
        this.$emit('emails', {
          data: arr,
          status: this.valid,
        });
        this.posted = false;
      }
    },
    valid(status) {
      if (!status) {
        this.$emit('emails', {
          data: this.emails,
          status: this.valid,
        });
      }
    },
  },
  mounted() {
    this.mounted = true;
  },
  methods: {
    ...mapActions({
      update_nps_tags: 'update_nps_tags',
    }),
    isEmailValid(email) {
      // eslint-disable-next-line no-nested-ternary
      return this.reg.test(email);
    },
    updateDeleted(val) {
      this.$emit('deleteEmail', {
        data: val.tag.text,
      });
      val.deleteTag();
    },
  },
};
</script>
<style>
.loader {
  color: #3c8dbc;
  margin-top: 9px;
  margin-left: 10px;
}
.tag-display {
  margin-left: 0px;
  border: 1px solid #c0c4cc;
  width: 350px;
  border-radius: 6px;
  padding: 1em 0;
}
.check {
  color: #4ca643;
}
.times {
  color: #d9372e;
}

.vue-tags-input {
  background: #ffffff !important;
  cursor: pointer;
  max-width: 100% !important;
  margin-left: 5px;
  width: 100% !important;
}
.ti-input {
  border: none !important;
  background: #ffffff !important;
}
.ti-tags {
  background: #ffffff !important;
  padding: 7px !important;
}
.ti-new-tag-input-wrapper input {
  background: #ffffff !important;
}
.ti-new-tag-input-wrapper input {
  background: #ffffff !important;
}

.vue-tags-input {
  background: #324652;
}
.ti-new-tag-input-wrapper input {
  min-width: 200px !important;
}
.ti-new-tag-input-wrapper input::placeholder {
  font-size: 12px;
  letter-spacing: 0.25px;
  color: #606266;
}
.invalid-error {
  color: red;
}
.invalid-holder {
  border: 1px solid red;
}
</style>
