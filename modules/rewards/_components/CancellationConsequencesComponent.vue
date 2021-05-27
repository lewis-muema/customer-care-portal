<template lang="html">
  <div class="row">
    <div v-if="loading_messages" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
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
        <el-tab-pane label="Active consequences">
          <active-consequences-data-table />
        </el-tab-pane>
        <el-tab-pane label="Deactivated consequences">
          <deactivated-consequences-data-table />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DeactivatedConsequencesDataTable from './CancellationConsequencesDataTables/DeactivatedConsequencesDataTable';
import CancellationConsequencesForm from './CancellationConsequencesForm';
import Loading from './LoadingComponent.vue';
import ActiveConsequencesDataTable from './CancellationConsequencesDataTables/ActiveConsequencesDataTable';

export default {
  name: 'CancellationConsequencesComponent',
  components: {
    Loading,
    CancellationConsequencesForm,
    ActiveConsequencesDataTable,
    DeactivatedConsequencesDataTable,
  },
  data() {
    return {
      loading_messages: true,
      add_btn: false,
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession(session) {
      return session;
    },
  },
  created() {
    this.getAllCancellationConsequences();
  },
  methods: {
    ...mapActions({
      fetch_set_cancellation_consequences:
        'fetch_set_cancellation_consequences',
    }),
    getCurrentUsersCountryCode() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray);
    },
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
    async getAllCancellationConsequences() {
      const countryCodes = this.getCurrentUsersCountryCode();
      try {
        await this.fetch_set_cancellation_consequences(countryCodes);
        this.loading_messages = false;
      } catch (err) {
        this.loading_messages = false;
        throw err;
      }
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
