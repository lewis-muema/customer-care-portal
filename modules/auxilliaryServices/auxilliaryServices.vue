<template>
  <div class="auxilliary-services-container">
    <div class="auxilliary-services-filters">
      <div class="filters-container">
        <div class="filters-title">Filters</div>
        <div class="filters-section-titles">Auxilliary Services</div>
        <div class="filters-section-items-holder">
          <div
            v-for="(service, index) in auxilliary"
            :key="index"
            class="filters-section-items"
            :class="activeService === index ? 'active-filters' : ''"
            @click="activeService = index"
          >
            {{ service.name }}
          </div>
        </div>
        <div class="filters-section-titles">Country</div>
        <div class="filters-section-items-holder">
          <div
            v-for="(ctry, index) in country"
            :key="index"
            class="filters-section-items"
            :class="activeCountry === index ? 'active-filters' : ''"
            @click="activeCountry = index"
          >
            {{ ctry.name }}
          </div>
        </div>
        <div class="filters-section-titles">Partner Profile</div>
        <div class="filters-section-items-holder">
          <div
            v-for="(Bunit, index) in BU"
            :key="index"
            class="filters-section-items"
            :class="activeBU === index ? 'active-filters' : ''"
            @click="activeBU = index"
          >
            {{ Bunit.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="auxilliary-services-tabs">
      <div class="auxilliary-services-search">
        <div v-if="activeClassAux !== 'overview'">
          <i class="fa fa-search text-grey auxilliary-services-search-icon"></i>
          <input
            v-if="this.editStatus"
            type="text"
            class="auxilliary-services-search-input"
            autocomplete="off"
            :id="`${currentUser}_input`"
            v-model="query"
            placeholder="Enter partner name / phone no"
            @keydown.down="down"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @input="update"
          />
          <input
            v-else
            type="text"
            class="auxilliary-services-search-input"
            v-model="idNo"
            @click="triggerSearch()"
          />
          <div v-show="hasItems" class="driver-suggestions aux-suggestions">
            <p
              v-for="(item, $item) in items"
              class="single-suggestion"
              :class="activeClass($item)"
              @mousedown="hit"
              @mouseover="setActive($item)"
              @mouseout="setActive($item)"
              :key="item.rider_id"
            >
              <span class="tt-suggestion">
                <p>
                  <strong>Name: {{ item.rider_name }}</strong>
                </p>
                <p>
                  <strong>Phone No: {{ item.phone_no }}</strong>
                </p>
                <p>
                  <strong>Email: {{ item.email }}</strong>
                </p>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="auxilliary-services-menu">
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClassAux = 'overview'"
          :class="activeClassAux === 'overview' ? 'auxilliary-active-tab' : ''"
        >
          Overview
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClassAux = 'pending'"
          :class="activeClassAux === 'pending' ? 'auxilliary-active-tab' : ''"
        >
          Pending Requests
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClassAux = 'approved'"
          :class="activeClassAux === 'approved' ? 'auxilliary-active-tab' : ''"
        >
          Approved Requests
        </div>
        <div
          class="auxilliary-services-menu-tab"
          @click="activeClassAux = 'declined'"
          :class="activeClassAux === 'declined' ? 'auxilliary-active-tab' : ''"
        >
          Declined Requests
        </div>
      </div>
      <div class="auxilliary-services-tab-containers">
        <pending
          v-if="activeClassAux === 'pending'"
          :rider="rider"
          :service="auxilliary[activeService].name"
          :country="country[activeCountry].code"
          :unit="activeBU !== '' ? BU[activeBU].name : ''"
        />
        <overview
          v-if="activeClassAux === 'overview'"
          :rider="rider"
          :service="auxilliary[activeService].name"
          :country="country[activeCountry].code"
          :unit="activeBU !== '' ? BU[activeBU].name : ''"
        />
        <approved
          v-if="activeClassAux === 'approved'"
          :rider="rider"
          :service="auxilliary[activeService].name"
          :country="country[activeCountry].code"
          :unit="activeBU !== '' ? BU[activeBU].name : ''"
        />
        <declined
          v-if="activeClassAux === 'declined'"
          :rider="rider"
          :service="auxilliary[activeService].name"
          :country="country[activeCountry].code"
          :unit="activeBU !== '' ? BU[activeBU].name : ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import VueTypeahead from 'vue-typeahead';

import order_store from './_store';
import RegisterStoreModule from '@/mixins/register_store_module';
import pending from './pending';
import overview from './overview';
import declined from './declined';
import approved from './approved';

export default {
  name: 'TheAuxilliaryServicesComponent',
  components: {
    pending,
    overview,
    approved,
    declined,
  },
  extends: VueTypeahead,
  data() {
    return {
      activeClassAux: 'overview',
      currentUser: 'rider',
      solr: {
        riders: 'RIDER_SEARCH',
      },
      editStatus: true,
      existingStatus: false,
      riderDetails: '',
      limit: 10,
      minChars: 1,
      query: '',
      rider: 0,
      name: '',
      riderDisplay: '',
      hide: '',
      hideInput: 'hide',
      idNo: '',
      data: [],
      activeService: 1,
      activeCountry: 0,
      activeBU: '',
      auxilliary: [
        {
          name: 'All',
        },
        {
          name: 'Fuel',
        },
      ],
      country: [
        {
          name: 'Kenya',
          code: 'ke',
        },
        {
          name: 'Uganda',
          code: 'ug',
        },
      ],
      BU: [
        {
          name: 'EBU',
        },
        {
          name: 'FBU',
        },
      ],
    };
  },
  computed: {
    ...mapState(['config']),
    placeholder() {
      return this.category;
    },

    query_string() {
      localStorage.setItem('query', this.query);
      const q = this.query;
      return q.replace(/\s/g, '');
    },
    solarBase() {
      const solrArray = this.solr;
      const currentUser = 'riders';
      const userSearch = solrArray[currentUser];
      return this.config[userSearch];
    },
    solarToken() {
      return this.$env.SOLR_JWT;
    },
    src() {
      const searchString = `${this.solarBase}select?q=(rider_name:*${this.query_string}*+OR+phone_no:*${this.query_string}*)&wt=json&indent=true&row=10&sort=rider_id%20desc&jwt=${this.solarToken}`;
      return searchString;
    },
  },
  watch: {
    activeClassAux(val) {
      this.activeService = 1;
      this.activeCountry = 0;
      this.activeBU = '';
      this.triggerSearch();
    },
  },
  created() {
    this.registerOrdersStore();
  },
  methods: {
    registerOrdersStore() {
      // eslint-disable-next-line no-underscore-dangle
      const moduleIsRegistered =
        // eslint-disable-next-line no-underscore-dangle
        this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_auxilliary', order_store);
      }
    },
    trigger() {
      this.rider = null;
      this.hideInput = 'hide';
      this.hide = '';
    },
    prepareResponseData(data) {
      const results = data.response.docs;

      return results;
    },
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      this.editStatus = false;
      this.existingStatus = true;
      this.riderDisplay = `${item.rider_name} | ${item.phone_no}`;
      this.idNo = `${item.rider_name} | ${item.phone_no}`;
      this.reset();
      return (this.rider = parseInt(item.rider_id, 10));
    },
    triggerSearch() {
      this.editStatus = true;
      this.existingStatus = false;
      this.rider = 0;
    },
  },
};
</script>

<style>
.auxilliary-services-container {
  display: flex;
  background: white;
  height: 698px;
  overflow-y: scroll;
}
.auxilliary-services-filters {
  width: 20%;
}
.auxilliary-services-tabs {
  width: 80%;
}
.auxilliary-services-search {
  display: flex;
  justify-content: flex-end;
  height: 70px;
  align-items: center;
  padding: 30px 75px 30px 50px;
}
.auxilliary-services-search-input {
  border: 1px solid #dcdfe6;
  height: 50px;
  width: 250px;
  padding: 20px;
  border-radius: 7px;
}
.auxilliary-services-menu {
  display: flex;
  height: 60px;
  align-items: center;
}
.auxilliary-services-menu-tab {
  width: 20%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}
.auxilliary-services-search-icon {
  position: absolute;
  margin: auto;
}
.auxilliary-active-tab {
  color: #c9531b !important;
}
.aux-suggestions {
  top: 70px;
}
.filters-container {
  padding: 50px 0px 0px 30px;
  height: 600px;
  overflow-y: scroll;
}
.filters-title {
  font-size: 20px;
  font-weight: 700;
  padding: 10px 0px 20px 0px;
}
.filters-section-titles {
  font-size: 18px;
  font-weight: 600;
  padding: 15px 0px 15px 0px;
}
.filters-section-items-holder {
  padding: 0px 20px 0px 20px;
}
.filters-section-items {
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding-left: 10%;
  background: white;
  color: black;
  font-size: 14px;
  font-weight: 700;
  width: 80%;
  margin: 5px 0px 5px 0px;
  cursor: pointer;
}
.active-filters {
  background: #c9531b;
  color: white;
}
</style>
