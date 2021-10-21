<template>
  <div class="search-rider">
    <el-input
      placeholder="Enter number plate or phone number"
      autocomplete="off"
      v-model="query"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
      @click="clear"
      @blur="reset"
    >
    </el-input>

    <ul v-show="hasItems" :class="[!isActive ? 'inactiveClass' : '']">
      <li
        v-for="(item, $item) in items"
        :class="activeClass($item)"
        @mousedown="hit"
        @mousemove="setActive($item)"
        :key="item.index"
      >
        <span>{{ item.rider_name }}</span>
        <span>{{ item.phone_no }}</span>
      </li>
    </ul>
    <ul v-show="!hasItems && query !== ''">
      <li class="my-3">
        No results Found
      </li>
    </ul>
  </div>
</template>
<script>
import VueTypeahead from 'vue-typeahead';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'FindPartnerInput',
  extends: VueTypeahead,
  data() {
    return {
      isActive: true,
      query: '',
      selectedPartner: '',
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['getEnvironmentVariables']),
    query_string() {
      return this.query.trim();
    },
    solarBase() {
      return this.config['RIDER_SEARCH'];
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    src() {
      return `${this.solarBase}select?q=(rider_name:*${this.query_string}*+OR+email:*${this.query_string}*+OR+phone_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20asc&jwt=${this.solarToken}`;
    },
  },

  methods: {
    prepareResponseData(data) {
      const response = data.response.docs;
      return response;
    },
    onHit(item) {
      this.$emit('changeSelectedPartner', item);
    },
    clear() {
      this.isActive = true;
    },
  },
};
</script>
<style scoped>
.search-rider {
  position: relative;
  width: 50%;
}
ul {
  position: absolute;
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
</style>
