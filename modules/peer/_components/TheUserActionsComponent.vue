<template>
  <div class="body-box user_button_view_peer">
    <div id="tabs" class="container custom_more">
      <ul class="nav nav-tabs buttons-tab" id="myTab" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('payment', userID)"
            :id="`payment_${userID}`"
          >
            <span class="fa fa-fw fa-ruble"></span>
            Payment
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link action-list"
            data-toggle="tab"
            aria-expanded="false"
            @click="viewTab('bill', userID)"
            :id="`bill_${userID}`"
          >
            <span class="fa fa-fw fa-bitcoin"></span>
            Bill
          </a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="body-box">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
            :id="`error_holder_${userID}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error.index">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`payment_${userID}`"
            role="tabpanel"
            v-if="showTab === `payment_${userID}`"
          >
            pay
          </div>
          <div
            :class="`tab-pane fade ${show} ${active}`"
            :id="`bill_${userID}`"
            role="tabpanel"
            v-if="showTab === `bill_${userID}`"
          >
            bill
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
      userID: null,
      showTab: null,
      show: false,
      active: false,
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass']),
  },
  mounted() {
    this.userID = this.user.user_details.user_id;
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

    viewTab(tab, userID) {
      this.clearErrorMessages();

      this.showTab = `${tab}_${userID}`;
      this.active = 'active';
      this.show = 'show';
    },
  },
};
</script>
<style>
.user_button_view_peer {
  min-height: 10px;
  padding: 0px 0px 9px 0px;
  background: #f9f9f9;
}
.buttons-tab {
  padding: 10px;
}
</style>
