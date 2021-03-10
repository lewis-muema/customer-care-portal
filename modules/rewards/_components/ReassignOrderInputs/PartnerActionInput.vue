<template>
  <div class="input-container">
    <div class="form-group col-md-4 user-input reposition-select-input">
      <label class="vat repositionTitle">
        Reassignment reason to penalize
      </label>
      <v-select
        :options="reassignment_reason"
        :reduce="name => name.code"
        name="name"
        label="name"
        placeholder="Select "
        class="form-control select user-billing"
        :id="`name`"
        v-model="reassignmentReasonPenalize"
      >
      </v-select>
      <!--      <div-->
      <!--        v-if="submitted && !$v.reassignment_reason_penalize.required"-->
      <!--        class="rewards_valid"-->
      <!--      >-->
      <!--        Reassignment reason is required-->
      <!--      </div>-->
    </div>
    <div
      class="form-group col-md-4 user-input"
      v-for="(partnerAction, index) in partnerActionInputs"
      :key="index"
    >
      <label class="vat"> Partner action </label>
      <v-select
        :options="partner_actions_data"
        :reduce="name => name.id"
        :name="partnerAction.count"
        label="display_name"
        placeholder="Select"
        class="form-control select user-billing"
        :id="`name`"
        v-model="partnerAction.action"
      >
      </v-select>
      <!--    <div v-if="submitted && !$v.partnerActions.required" class="rewards_valid">-->
      <!--      Partner action is required-->
      <!--    </div>-->
      <div class="add-input" @click="addNewPartnerAction">
        + Select another partner action
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartnerAction',
  data() {
    return {
      partnerAction: { action: null, partnerActionSelect: 0 },
      partnerActions: '',
      partner_actions_data: [
        {
          id: 1,
          action_type: 1,
          name: 'Block',
          display_name: 'Block from dispatch',
          input_datatype: 'Integer',
          user_type: '[1]',
          status: 1,
        },
        {
          id: 2,
          action_type: 1,
          name: 'Penalty_Fee',
          display_name: 'Charge a penalty fee',
          input_datatype: 'Integer',
          user_type: '[1,2]',
          status: 1,
        },
        {
          id: 3,
          action_type: 2,
          name: 'Reallocation',
          display_name: 'Allow partner to reallocate',
          input_datatype: 'Integer',
          user_type: '[1]',
          status: 1,
        },
        {
          id: 4,
          action_type: 2,
          name: 'Reschedule',
          display_name: 'Allow customer to reschedule order',
          input_datatype: 'Integer',
          user_type: '[2]',
          status: 1,
        },
        {
          id: 5,
          action_type: 2,
          name: 'Notification',
          display_name: 'Trigger notification alert',
          input_datatype: 'Integer',
          user_type: '[1,2]',
          status: 1,
        },
      ],
      partnerActionInputs: [],
      count: 0,
      reassignmentReasonPenalize: '',
      reassignment_reason: [
        { code: 3, name: 'Client is not reachable' },
        { code: 5, name: 'I do not have a box' },
        { code: 7, name: `I can't access CBD` },
        { code: 8, name: 'My bike broke-down' },
        { code: 9, name: 'Police arrest' },
        { code: 10, name: 'My Vehicle is Open' },
        { code: 11, name: 'My Vehicle is Closed' },
        { code: 12, name: 'The load cannot fit in my vehicle' },
        { code: 13, name: 'My Vehicle broke down' },
      ],
    };
  },
  created() {
    this.addNewPartnerAction();
  },
  methods: {
    addNewPartnerAction() {
      this.partnerActionInputs.push({
        ...this.partnerAction,
        partnerActionSelect: this.count++,
      });
      console.log('>>>', this.partnerActionInputs);
    },
    removePartnerAction(index) {
      // Vue.delete(this.apartments, index);
    },
  },
};
</script>

<style scoped>
.vat {
  text-align: left;
  display: block;
}
.add-input {
  cursor: pointer;
  margin-top: 10px;
}
.input-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.user-input {
  margin-bottom: 15px;
}
.reposition-select-input {
  position: relative;
  top: -23px;
}
.repositionTitle {
  position: relative;
  top: 15px;
}
.v-select {
  padding: 0;
}
</style>
