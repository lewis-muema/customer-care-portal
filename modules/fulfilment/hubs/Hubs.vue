<template lang="html">
  <div class="box box-info">
    <div class="fulfilment-header hubs-header-flex">
      <div class="">
        <h1 class="fulfilment-label">Hubs</h1>
      </div>
      <div class="fulfilment-label add-hub-outer">
        <el-button
          type="primary"
          size="medium"
          class="fulfilment-add-hub-button"
          @click="displayDialog"
        >
          Add Hub
        </el-button>
      </div>
    </div>
    <div class="box-body ">
      <div class="fulfilment-container ">
        <div class="fulfilment-tabs" :key="componentKey">
          <HubSection class="hub-margin" />
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      class="addHubDialog"
      :visible.sync="displayHubDialog"
      width="30%"
    >
      <AddHubDialog />
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

import HubSection from './_components/HubsComponent.vue';
import AddHubDialog from './_components/AddHubDialog.vue';

export default {
  name: 'HubView',
  components: { HubSection, AddHubDialog },
  data() {
    return {
      mode: 'HubsView',
      componentKey: 0,
      displayHubDialog: false,
      title: 'Add hub',
    };
  },
  computed: {
    ...mapGetters({
      getHubDialog: 'fulfilment/getHubDialog',
    }),
  },
  watch: {
    getHubDialog(val) {
      if (val) {
        this.displayHubDialog = false;
        this.handleTab();
        this.resetHubDialog(false);
      }
    },
  },
  mounted() {
    const page = { name: 'HubsView' };
    this.handleClick(page);
  },
  methods: {
    ...mapMutations({
      updateActivePage: 'setActivePage',
      setFulfilmentType: 'fulfilment/setFulfilmentType',
      setTableData: 'fulfilment/setTableData',
      resetHubDialog: 'fulfilment/resetHubDialog',
    }),
    handleTab() {
      this.componentKey += 1;
    },
    handleClick(tab) {
      this.setTableData([]);
      this.updateActivePage(this.mode);
      this.setFulfilmentType(this.mode);
      this.handleTab();
    },
    displayDialog() {
      this.displayHubDialog = true;
    },
  },
};
</script>
