<template>
  <section class="content-header">
    <h1>
      {{ pageBreadCrumbs.name }}
      <small> {{ pageBreadCrumbs.description }} </small>
    </h1>
    <div class="breadcrumb business-units" v-if="route === 'orders'">
      <span>
        <input type="checkbox" @click="checkAll()" v-model="isCheckAll" />
        All
      </span>

      <span v-for="unit in unitsdata" :key="unit.index">
        <input
          type="checkbox"
          :value="unit"
          v-model="businessUnits"
          @change="updateCheckall()"
        />{{ unit }}
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
  props: {
    route: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isCheckAll: true,
      unitsdata: ['FBU', 'MBU', 'EBU'],
      selectedUnits: '',
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
      },
    };
  },

  computed: {
    pageBreadCrumbs() {
      const routeName = this.route;
      const links = this.breadCrumbs;
      return links[routeName];
    },
  },
  mounted() {
    this.setBreadcrumbs();
  },
  methods: {
    setBreadcrumbs() {
      console.log('breadcrumbs');
      this.$store.dispatch('setBreadCrumbs');
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.businessUnits = [];
      if (this.isCheckAll) {
        // eslint-disable-next-line guard-for-in
        for (const key in this.unitsdata) {
          this.businessUnits.push(this.unitsdata[key]);
        }
        this.printValues();
      }
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
      this.selectedUnits = '';
      // eslint-disable-next-line guard-for-in
      for (const key in this.businessUnits) {
        this.selectedUnits += `${this.businessUnits[key]}, `;
      }
      console.log('selectedUnits', this.selectedUnits);
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
