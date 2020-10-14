<template>
  <section class="content-header" v-if="typeof pageBreadCrumbs !== 'undefined'">
    <h1>
      {{ pageBreadCrumbs.name }}
      <small> {{ pageBreadCrumbs.description }} </small>
    </h1>
    <div class="breadcrumb business-units" v-if="route === 'orders'">
      <span>
        <input type="checkbox" @click="checkAll()" v-model="isCheckAll" />
        All
      </span>
      <span v-for="unit in units" :key="unit.index">
        <input
          type="checkbox"
          :value="unit.abbr"
          v-model="businessUnits"
          @change="updateCheckall()"
        />{{ unit.abbr }}
      </span>
    </div>
    <ol class="breadcrumb">
      <li>
        <a href="#"
          ><i class="fa fa-dashboard"></i> {{ pageBreadCrumbs.mainName }}</a
        >
      </li>
      <li>{{ pageBreadCrumbs.description }}</li>
      <li class="active">{{ pageBreadCrumbs.name }}</li>
    </ol>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheBreadCrumbView',
  props: ['route'],
  data() {
    return {
      isCheckAll: true,
      unitsdata: [],
      units: null,
      selectedUnits: [],
      businessUnits: [],

      breadCrumbs: {
        peer: {
          name: 'Peer',
          description: 'clients',
          mainName: 'Home',
        },

        biz: {
          name: 'Business',
          description: 'clients',
          mainName: 'Home',
        },
        orders: {
          name: 'Ongoing',
          description: 'Orders',
          mainName: 'Home',
        },
        riders: {
          name: 'Riders',
          description: 'Rider',
          mainName: 'Home',
        },
        invoice: {
          name: 'Invoice Numbers',
          description: 'invoices',
          mainName: 'Home',
        },
        rewards: {
          name: 'Rewards and Penalties',
          description: '',
          mainName: 'Home',
        },
        refund: {
          name: 'Permits Refunds',
          description: '',
          mainName: 'Home',
        },
        intercounty: {
          name: 'Intercounty Price Configuration',
          description: '',
          mainName: 'Home',
        },
        user: {
          name: 'User',
          description: '3CX Users',
          mainName: 'Home',
        },
      },
    };
  },

  computed: {
    ...mapGetters(['getBusinessUnits', 'getOrderStatuses']),

    pageBreadCrumbs() {
      const routeName = this.route;
      const links = this.breadCrumbs;
      return links[routeName];
    },
  },
  watch: {
    getBusinessUnits(data) {
      for (let i = 0; i < data.length; i += 1) {
        this.unitsdata.push(data[i].abbr);
      }
      return (this.units = data);
    },
  },
  mounted() {
    if (process.client) {
      this.requestUnits();
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedUnits: 'setSelectedBusinessUnits',
    }),
    ...mapActions(['setBusinessUnits', 'requestBusinessUnits']),
    async requestUnits() {
      const arr = await this.requestBusinessUnits();
      await this.setBusinessUnits();
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.businessUnits = [];
      if (this.isCheckAll) {
        // eslint-disable-next-line guard-for-in
        for (const key in this.units) {
          this.businessUnits.push(this.units[key].abbr);
        }
      }
      this.printValues();
    },
    updateCheckall() {
      if (this.businessUnits.length === this.unitsdata.length) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
      this.printValues();
    },
    printValues() {
      this.selectedUnits = [];
      // eslint-disable-next-line guard-for-in
      for (const key in this.businessUnits) {
        this.selectedUnits.push(this.businessUnits[key].toLowerCase().trim());
      }
      this.updateSelectedUnits(this.selectedUnits);
    },
    toggle_show(status) {},
  },
};
</script>
<style scoped>
.breadcrumb > li {
  padding: 0 7px;
}
.breadcrumb > .active {
  color: #777;
}
.business-units {
  right: 220px;
  color: #333;
  font-size: 13px;
  background: #ecf0f5;
  border: 1px solid #3333;
}
.business-units > span {
  padding-left: 26px;
}
</style>
