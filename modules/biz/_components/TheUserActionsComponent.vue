<template>
  <div class="body-box user_button_view">
    <div id="tabs" class="container">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="force_blue"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('agile', copID)"
            :id="`agile_${copID}`"
          >
            <span class="fa fa-fw fa-thumb-tack"></span>
            Agile
          </a>
        </li>
        <li class="nav-item">
          <a
            class="force_blue"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('edit', copID)"
            :id="`edit_${copID}`"
          >
            <span class="fa fa-fw  fa-pencil"></span>
            Edit
          </a>
        </li>
        <li class="nav-item">
          <a
            class="force_blue"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('payment', copID)"
            :id="`payment_${copID}`"
          >
            <span class="fa fa-fw fa-ruble"></span>
            Payment
          </a>
        </li>
        <li class="nav-item">
          <a
            class="force_blue"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('rider', copID)"
            :id="`rider_${copID}`"
          >
            <span class="fa fa-fw fa-list-alt"></span>
            Rider
          </a>
        </li>
        <li class="nav-item">
          <a
            class="force_blue"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('invoice', copID)"
            :id="`invoice_${copID}`"
          >
            <span class="fa fa-fw fa-usd"></span>
            Invoice
          </a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="body-box">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
            :id="`error_holder_${copID}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error.index">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`agile_${copID}`"
            role="tabpanel"
            v-if="showTab === `agile_${copID}`"
          >
            agile
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`edit_${copID}`"
            role="tabpanel"
            v-if="showTab === `edit_${copID}`"
          >
            edit
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payment_${copID}`"
            role="tabpanel"
            v-if="showTab === `payment_${copID}`"
          >
            payment
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`rider_${copID}`"
            role="tabpanel"
            v-if="showTab === `rider_${copID}`"
          >
            rider
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`invoice_${copID}`"
            role="tabpanel"
            v-if="showTab === `invoice_${copID}`"
          >
            invoice
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'TheUserActionsComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      copID: null,
      showTab: null,
      show: false,
      active: false,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass']),
  },
  mounted() {
    this.copID = this.user.user_details.cop_id;
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
    }),
    clearErrorMessages() {
      const notification = [];
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },

    viewTab(tab, copID) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${copID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
<style>
.user_button_view {
  min-height: 231px;
  padding: 16px 10px 0px 10px;
}
</style>
