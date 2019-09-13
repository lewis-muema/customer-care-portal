<template>
  <td class="search-td">
    <div class="Typeahead">
      <i class="fa fa-spinner fa-spin" v-if="loading"></i>
      <template v-else>
        <i class="fa fa-search" v-show="isEmpty"></i>
        <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
      </template>

      <input
        type="text"
        class="Typeahead__input"
        placeholder="Search for Order No/ Customer name/ User Phone"
        autocomplete="off"
        v-model="query"
        @keydown.down="down"
        @keydown.up="up"
        @keydown.enter="hit"
        @keydown.esc="reset"
        @blur="reset"
        @input="update"
      />
      <ul v-show="hasItems">
        <li
          v-for="(item, $item) in items"
          :class="activeClass($item)"
          @mousedown="hit"
          @mousemove="setActive($item)"
          :key="item.index"
        >
          <p>
            <strong>{{ item.order_no }}</strong>
          </p>
          <p>Client: {{ item.user_name }}</p>
          <p>Client phone: {{ item.user_phone }}</p>
          <p>Rider: {{ item.rider_name }}</p>
          <p>Date: {{ item.rider_name }}</p>
        </li>
      </ul>
    </div>
  </td>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import config from '~/config/configs';

export default {
  extends: VueTypeahead,
  data() {
    return {
      limit: 5,
      minChars: 2,
      query: '',
      order: null,
    };
  },
  computed: {
    query_string() {
      return this.query;
    },
    src() {
      return `${config.SOLR_BASE}select?q=(order_no:*${this.query_string}*+OR+user_phone:*${this.query_string}*+OR+user_name:*${this.query_string}*)&jwt=${config.SOLR_JWT}`;
    },
  },
  methods: {
    ...mapMutations({
      updateSearchedOrder: 'setSearchedOrder',
    }),
    ...mapActions({
      request_single_order: 'request_single_order',
    }),
    async onHit(item) {
      try {
        const data = await this.request_single_order('AD35T3848-78B');
        this.updateSearchedOrder(data);
        return (this.order = data);
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
    prepareResponseData(data) {
      return data.response.docs;
    },
  },
};
</script>

<style scoped>
.Typeahead {
  position: relative;
}
.Typeahead__input {
  width: 90%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.Typeahead__input:focus {
  border-color: 2px solid #0097cf;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #0097cf;
}
.fa-times {
  cursor: pointer;
}

i {
  float: right;
  position: relative;
  top: 16px;
  right: 6px;
  opacity: 1;
}
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
li {
  padding: 10px 16px;
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
</style>
