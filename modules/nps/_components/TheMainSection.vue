<template>
  <div class="row">
    <div class="col-md-3 col-sm-6 col-xs-12 nps-side">
      <div class="nps-sidebar">
        <div class="nps-header">
          <nuxt-link class="nps-header" to="/nps/metrics">
            View Metrics
          </nuxt-link>
        </div>
        <span class="vertical-header"><h5>Filters</h5></span>
        <div class="vertical-menu">
          <ul class="menu-list">
            <li v-for="(menu, index) in sideMenu" :key="index">
              <a
                href="#"
                class="active"
                v-if="menu.name !== null"
                @click="toggle(index)"
                :class="{ opened: opened.includes(index) }"
              >
                {{ menu.name }}
                <span class="accordion-item-trigger-icon pull-right"></span>
              </a>
              <ul class="sub-menu" v-if="opened.includes(index)">
                <li v-for="(option, i) in menu.child" :key="i">
                  <a
                    href="#"
                    @click="
                      toggleActive(option.code, menu.code, option.category)
                    "
                    :class="{ selected: selected.includes(option.code) }"
                    >{{ option.title }}</a
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-md-8 col-sm-12 col-xs-12 row">
      <TheMainDisplayComponent :surveys="surveys" :meta-data="metaData" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import NPSMxn from '@/mixins/nps_mixin';

export default {
  name: 'TheMainSection',
  components: {
    TheMainDisplayComponent: () =>
      import('~/modules/nps/_components/MainSection/TheMainDisplay'),
  },
  mixins: [NPSMxn],

  props: {
    surveys: {
      type: Array,
      required: true,
    },
    metaData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeItem: 0,
      isActive: false,
      activeGroups: [],
      activeCountries: [],
      activeAccounts: [],
      activeBusinessUnits: [],
      opened: [0, 1],
      selected: [null, 'allgroups', 'allaccounts', 'allcountries'],
    };
  },
  computed: {
    ...mapState(['activeGroup']),

    ...mapGetters(['getCountries']),

    sideMenu() {
      const menu = [
        {
          name: 'Groups',
          code: 'groups',
          child: this.groups,
        },
        {
          name: 'Country',
          code: 'countries',
          child: this.countries,
        },
        {
          name: 'Account Type',
          code: 'accounts',
          child: this.businessUnits,
        },
      ];
      return menu;
    },
  },
  watch: {
    async activeGroups(group) {
      const arr = [];
      const selected = arr.concat(group);
      await this.setNPSActiveGroup(selected);
    },
    async activeCountries(countries) {
      const arr = [];
      const selected = arr.concat(countries);
      await this.setActiveCountries(selected);
    },
    async activeAccounts(account) {
      const arr = [];
      const selected = arr.concat(account);
      await this.setActiveAccountTypes(selected);
    },
    async activeBusinessUnits(unit) {
      const arr = [];
      const selected = arr.concat(unit);
      await this.setActiveBusinessUnits(selected);
    },
    getCountries(countries) {
      const allCategory = {
        code: 'allcountries',
        title: 'All',
        category: 'country',
      };
      this.countries.push(allCategory);

      const obj2 = this.requiredCountries;
      const arr = countries.filter(i => obj2.includes(i.country_code));
      for (let i = 0; i < arr.length; i += 1) {
        const data = {
          code: arr[i].country_code,
          title: arr[i].country_name,
          category: 'country',
        };
        this.countries.push(data);
      }
    },
  },
  mounted() {
    this.setCountries();
  },
  methods: {
    ...mapMutations([
      'setNPSActiveGroup',
      'setActiveCountries',
      'setActiveAccountTypes',
      'setActiveBusinessUnits',
    ]),
    ...mapActions(['setCountries']),

    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    removeGroupIndex(code, group, category) {
      switch (group) {
        case 'groups':
          // eslint-disable-next-line no-case-declarations
          const indexCode = this.activeGroups.indexOf(code);
          this.activeGroups.splice(indexCode, 1);
          break;
        case 'countries':
          // eslint-disable-next-line no-case-declarations
          const i = this.activeCountries.indexOf(code);
          this.activeCountries.splice(i, 1);
          break;
        case 'accounts':
          // eslint-disable-next-line no-case-declarations
          const key = this.activeAccounts.indexOf(category);
          this.activeAccounts.splice(key, 1);
          this.removeAccountTypes(category, code);
          break;
        default:
      }
    },
    addAccountTypes(category, code) {
      if (category === 'partner') {
        this.activeBusinessUnits.push(code);
      }
    },
    removeAccountTypes(category, code) {
      if (category === 'partner') {
        const key = this.activeBusinessUnits.indexOf(code);
        this.activeBusinessUnits.splice(key, 1);
      }
    },
    addGroupIndex(code, group, category) {
      switch (group) {
        case 'groups':
          if (code === 'allgroups') {
            this.activeGroups = [];
          } else {
            this.activeGroups.push(code);
          }
          break;
        case 'countries':
          if (code === 'allcountries') {
            this.activeCountries = [];
          } else {
            this.activeCountries.push(code);
          }
          break;
        case 'accounts':
          if (code === 'allaccounts') {
            this.activeAccounts = [];
          } else {
            this.activeAccounts.push(category);
            this.addAccountTypes(category, code);
          }

          break;
        default:
      }
    },
    toggleActive(code, group, category) {
      const allCategory = `all${group}`;
      const indexAll = this.selected.indexOf(allCategory);

      if (code !== allCategory && indexAll > -1) {
        this.selected.splice(indexAll, 1);
      }

      const index = this.selected.indexOf(code);

      if (index > -1) {
        this.selected.splice(index, 1);
        this.removeGroupIndex(code, group, category);
      } else {
        this.selected.push(code);
        const indexAll2 = this.selected.indexOf(allCategory);

        if (code === allCategory && indexAll2 > -1) {
          this.handleAllItem(code, group, category);
          this.selected.push(code);
        }
        this.addGroupIndex(code, group, category);
      }
    },
    handleAllItem(code, group, category) {
      const sideMenu = this.sideMenu;
      const filteredMenu = sideMenu.filter(menu => {
        return menu.code === group;
      });

      const menuItems = filteredMenu.length !== 0 ? filteredMenu[0].child : [];
      for (let i = 0; i < menuItems.length; i++) {
        const menuCode = menuItems[i].code;
        const indexCode = this.selected.indexOf(menuCode);
        if (indexCode > -1) {
          this.selected.splice(indexCode, 1);
          this.removeGroupIndex(menuCode, group, category);
        }
      }
    },
    toggleMenu(code) {
      this.isActive = !this.isActive;
      this.activeItem = code;
    },
  },
};
</script>
<style scoped>
.nps-header {
  color: #f57f20;
  font-weight: 600;
  font-size: 20px;
  line-height: 50%;
  margin-bottom: 33px;
}
.nps-sidebar {
  margin-top: 34px;
}
.vertical-menu {
  width: 232px;
  height: 536px;
  overflow-y: auto;
}

.menu-list {
  list-style: none;
  padding-left: 0;
  padding-right: 7px;
}
.sub-menu {
  list-style: none;
  padding-left: 10px;
}
.vertical-menu a {
  background-color: #ffffff;
  color: black;
  display: block;
  padding: 10px;
  text-decoration: none;
}

.vertical-menu a:hover {
  background-color: #ccc;
}

.selected {
  background: #0f4271 !important;
  border-radius: 100px !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  margin-top: 3px;
}
.vertical-header h5 {
  font-weight: 600;
  line-height: 140%;
  color: #000000;
}
.opened > .accordion-item-trigger-icon {
  -webkit-transform: translateY(-2px) rotate(225deg) !important;
}

.All {
  background: #0f4271 !important;
  border-radius: 100px !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
</style>
