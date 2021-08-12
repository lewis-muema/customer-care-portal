<template>
  <div class="">
    <div class="Typeahead">
      <input
        type="text"
        class="Typeahead__input"
        placeholder="Search Staff Name"
        autocomplete="off"
        v-model="query"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="reset"
        @input="update"
        @click="clear"
        @blur="reset"
        @keyup="setTypingStatus"
      />
      <ul :class="[!isActive ? 'inactiveClass' : '']">
        <li
          v-for="(item, $item) in items"
          :class="activeClass($item)"
          @mousedown="hit(item)"
          @mousemove="setActive($item)"
          :key="item.index"
        >
          <span>
            <strong>{{ item.name }}</strong>
          </span>
          <span>{{ item.email }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  extends: VueTypeahead,
  data() {
    return {
      limit: 10,
      minChars: 1,
      query: '',
      isActive: true,
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getEnvironmentVariables']),

    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.trim();
    },
    solarBase() {
      return this.config.STAFF_SEARCH;
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    src() {
      return `${this.solarBase}select?q=(name:*${this.query_string}*+OR+email:*${this.query_string}*)&wt=json&indent=true&row=10&sort=admin_id%20desc&jwt=${this.solarToken}&fq=(status:1)`;
    },
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setSearchState',
      updateSearchedAdmin: 'updateAdmins',
      updateTypingState: 'setTypingState',
    }),
    onHit(item) {
      this.updateTypingState(false);
      this.isActive = false;
      this.updateSearchState(true);
      this.$emit('adminData', item);
    },
    prepareResponseData(data) {
      this.updateTypingState(true);
      return data.response.docs;
    },
    clear() {
      this.isActive = true;
    },
    setTypingStatus() {},
  },
};
</script>

<style scoped>
.Typeahead {
}
.Typeahead__input {
  width: 100%;
  height: 40px;
  border: 1px solid #c0c4cc;
  border-radius: 8px;
  box-shadow: none;
  font-size: 14px;
  padding: 12px 26px;
  letter-spacing: 0.03em;
}
.Typeahead__input:focus {
  border-color: 2px solid #0097cf;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #0097cf;
}
ul {
  position: relative;
  padding: 0;
  margin-top: 8px;
  min-width: 90%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
li {
  padding: 6px 13px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #2c3e50;
}
.active {
  background-color: #0097cf;
  color: #fff;
}
.active span {
  color: white;
}
.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}
.inactiveClass {
  display: none;
}
</style>
