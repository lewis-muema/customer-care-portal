<template lang="html">
  <div class="row">
    <!--    TODO return page loader to wait for table data load-->
    <!--    <div v-if="loading_messages" class="centre-loader">-->
    <!--      <Loading />-->
    <!--    </div>-->
    <div class="outline-inner-data">
      <el-button
        type="primary"
        @click="showCancellationConsequencesForm"
        class="add_section"
        >Add cancellation consequences<i
          :class="add_btn ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i
      ></el-button>
      <cancellation-consequences-form v-if="add_btn" />

      <el-tabs id="cancellation-table" type="card">
        <el-tab-pane label="Active reasons">
          <active-cancellations-data-table />
        </el-tab-pane>
        <el-tab-pane label="Deactivated reasons">
          <deactivated-cancellations-data-table />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DeactivatedCancellationsDataTable from './CancellationReasonsDataTables/DeactivatedCancellationsDataTable';
import CancellationConsequencesForm from './CancellationConsequencesForm';
import Loading from './LoadingComponent.vue';
import ActiveCancellationsDataTable from './CancellationReasonsDataTables/ActiveCancellationsDataTable';

export default {
  name: 'CancellationConsequencesComponent',
  components: {
    // Loading,
    CancellationConsequencesForm,
    ActiveCancellationsDataTable,
    DeactivatedCancellationsDataTable,
  },
  data() {
    return {
      loading_messages: true,
      add_btn: false,
    };
  },
  methods: {
    showCancellationConsequencesForm() {
      let status = false;
      if (!this.add_btn) {
        status = true;
      }
      this.add_btn = status;
    },
    showLoader(loaderState) {
      this.loading_messages = loaderState;
    },
  },
};
</script>

<style>
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
  border-top: 3px solid #c4c4c4;
  border-right: solid 1px #c4c4c4;
  border-left: solid 1px #c4c4c4;
}
.el-tabs--card > .el-tabs__header {
  //border-bottom: solid 1px #dad6d6;
}
#cancellation-table .el-tabs__item.is-active {
  font-size: 16px;
  color: #000000;
}
</style>

<style lang="css" scoped>
.option-title {
  font-weight: 600;
}
.form-inline .form-control {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline {
  width: 50% !important ;
}
.form-inline .custom-select,
.form-inline .input-group {
  width: 100%;
  border-radius: 0.25rem;
}
.form-inline {
  margin-left: 2%;
}
.centre-loader {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.outline-inner-data {
  width: 100%;
}
.invoice-number-highlight {
  color: #00ae55;
}
.table-content {
  max-width: 98%;
  margin-left: 1%;
  margin-top: 2%;
}
.table-content-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.table-content-info i {
  font-size: 25px;
  color: #969393;
  margin-right: 20px;
}
.table-content-info span {
  font-size: 20px;
  font-weight: 500;
}
.table-background {
  background: #fff;
}
.add_section {
  background: #ffffff;
  border: 1px solid #000000;
  color: #1f1d1d;
  margin-left: 2%;
  width: auto;
  margin-bottom: 1%;
}
.add_section:focus,
.add_section:hover {
  background: #ffffff !important;
  border: 1px solid #000000 !important;
  color: #1f1d1d;
  cursor: pointer;
}
.config-input {
  margin-left: -15px;
}
.config-div {
  padding-left: 0;
}
.config {
  width: 100%;
  margin-left: -15px;
}
.invalid-feedback {
  font-size: 14px !important;
}
.config-submit {
  padding-left: 2px !important;
}
.date-input {
  margin-left: -15px;
  width: 100% !important;
}
.rewards_valid {
  font-size: 14px !important;
  color: #dc3545;
  margin-left: -4% !important;
}
.input-with-select {
  margin-left: -6%;
}
.add-reward-section {
  width: 80% !important;
  min-height: 340px;
}
.user-textarea {
  margin-right: 9%;
}
#cancellation-table {
  margin-left: 10px;
  margin-top: 50px;
}
</style>
