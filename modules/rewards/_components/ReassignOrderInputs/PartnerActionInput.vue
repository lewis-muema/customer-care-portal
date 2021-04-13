<template>
  <div class="input-container">
    <div class="form-group col-md-4 user-input reposition-select-input">
      <label class="vat">
        Reassignment reason to penalize
      </label>
      <v-select
        :options="reassignment_reason"
        :reduce="name => name.reallocation_id"
        name="name"
        label="description"
        placeholder="Select "
        class="form-control select user-billing"
        :id="`name`"
        @input="reassignmentReasonChanged()"
        v-model="reassignmentReasonPenalize"
      >
      </v-select>
    </div>
    <!--    partner action dropdown-->
    <div
      class="row replica"
      v-for="(partnerAction, index) in partnerActionInputs"
      :key="`partnerAction-${index}`"
    >
      <div class="form-group col-md-4 user-input">
        <label class="vat"> Partner action </label>
        <v-select
          :options="partner_actions_data"
          :reduce="name => name.id"
          :name="partnerAction.partnerActionInput"
          label="display_name"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`name`"
          @input="partnerActionSelectedChanged(partnerAction, index)"
          v-model="partnerAction.partner_action_id"
        >
        </v-select>
        <div class="input-counter">
          <div
            v-if="partnerAction.partnerActionInput !== 3"
            class="add-input"
            @click="addNewPartnerAction"
          >
            + Select another partner action
          </div>
          <div
            v-if="partnerActionInputs.length > 1"
            class="remove-input"
            @click="removePartnerAction(index)"
          >
            x Remove action
          </div>
        </div>
      </div>

      <!--    how long field-->
      <div
        v-if="partnerAction.block_hours_visible"
        class="form-group col-md-4 user-input"
      >
        <label class="vat">
          For how long
        </label>
        <el-input
          type="number"
          min="0"
          value="0.01"
          step="0.01"
          v-model="partnerAction.block_hours"
          @input="
            updatePartnerActionInputChanged(partnerAction, 'block_hours', index)
          "
        >
          <template slot="append">hours</template>
        </el-input>
      </div>

      <!--    charge penalty fee message-->
      <div
        v-if="partnerAction.penalty_fee_visible"
        class="form-group col-md-4 user-input"
      >
        <label class="vat"> How much </label>
        <el-input
          placeholder="Please input amount"
          type="number"
          min="1"
          v-model="partnerAction.penalty_fee"
          @input="
            updatePartnerActionInputChanged(partnerAction, 'penalty_fee', index)
          "
        >
        </el-input>
      </div>

      <!--    message to show partner-->
      <div
        v-if="partnerAction.partner_message_visible"
        class="form-group col-md-4 user-input"
      >
        <label class="vat"> Message to show partner </label>
        <el-input
          placeholder="Please input"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="partnerAction.partner_message"
          @input="
            updatePartnerActionInputChanged(
              partnerAction,
              'partner_message',
              index,
            )
          "
        >
        </el-input>
      </div>
    </div>

    <!--    customer action dropdown-->
    <div
      class="row replica"
      v-for="(customerAction, index) in customerActionInputs"
      :key="`customerAction-${index}`"
    >
      <div class="form-group col-md-4 user-input">
        <label class="vat"> Customer action </label>
        <v-select
          :options="customer_actions_data"
          :reduce="name => name.id"
          :name="customerAction.customerActionInput"
          label="display_name"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`name`"
          @input="customerActionSelectedChanged(customerAction, index)"
          v-model="customerAction.customer_action_id"
        >
        </v-select>
        <div class="input-counter">
          <div
            v-if="
              customerActionInputs.length >= 1 &&
                customerAction.customerActionInput !== 1
            "
            class="add-input"
            @click="addNewCustomerAction"
          >
            + Select another customer action
          </div>
          <div
            v-if="customerActionInputs.length > 1"
            class="remove-input"
            @click="removeCustomerAction(index)"
          >
            x Remove action
          </div>
        </div>
      </div>

      <!--    how long field-->
      <div
        v-if="customerAction.reschedule_hours_visible"
        class="form-group col-md-4 user-input"
      >
        <label class="vat">
          For how long
        </label>
        <el-input
          type="number"
          min="0"
          value="0.01"
          step="0.01"
          v-model="customerAction.reschedule_hours"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'reschedule_hours',
              index,
            )
          "
        >
          <template slot="append">hours</template>
        </el-input>
      </div>

      <!--   message to show customer-->
      <div
        v-if="customerAction.customer_message_visible"
        class="form-group col-md-4 user-input"
      >
        <label class="vat"> Message to show customer </label>
        <el-input
          placeholder="Please input"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="customerAction.customer_message"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'customer_message',
              index,
            )
          "
        >
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PartnerAction',
  data() {
    return {
      partnerAction: {
        partner_action_id: null,
        block_hours: null,
        block_hours_visible: false,
        after_how_long: null,
        after_how_long_visible: false,
        penalty_fee: null,
        penalty_fee_visible: false,
        partner_message_visible: false,
        partner_message: '',
        partnerActionInput: 0,
      },
      customerAction: {
        customer_action_id: null,
        customer_message_visible: false,
        customer_message: '',
        reschedule_hours_visible: false,
        reschedule_hours: null,
        customerActionInput: 0,
      },
      partnerInputCount: 0,
      customerInputCount: 0,
      partnerActionsSelected: {},
      partnerActionInputs: [],
      customerActionInputs: [],
      partner_actions_data: [
        {
          id: 1,
          action_type: 1,
          name: 'Block',
          display_name: 'Block from dispatch',
          user_type: '[1]',
        },
        {
          id: 2,
          action_type: 1,
          name: 'Penalty_Fee',
          display_name: 'Charge a penalty fee',
          user_type: '[1,2]',
        },
        {
          id: 3,
          action_type: 2,
          name: 'Reallocation',
          display_name: 'Allow partner to reallocate',
          user_type: '[1]',
        },
        {
          id: 5,
          action_type: 2,
          name: 'Notification',
          display_name: 'Trigger notification alert',
          user_type: '[1,2]',
        },
      ],
      customer_actions_data: [
        {
          id: 5,
          action_type: 1,
          name: 'trigger_notification',
          display_name: 'Trigger a notification to the customer',
          user_type: '[1]',
        },
        {
          id: 4,
          action_type: 2,
          name: 'Reschedule',
          display_name: 'Automatically reschedule the order',
          user_type: '[2]',
        },
      ],
      reassignmentReasonPenalize: '',
      reassignment_reason: [],
      actionsCodesArray: [],
    };
  },
  computed: {
    ...mapGetters({
      reallocationReasons: 'getReallocationReasons',
    }),
  },
  watch: {
    reallocationReasons() {
      this.filterReassignmentReasons();
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.addNewPartnerAction();
      this.addNewCustomerAction();
      this.filterReassignmentReasons();
    },
    filterReassignmentReasons() {
      this.reassignmentReasonPenalize = '';
      this.reassignment_reason = this.reallocationReasons.filter(
        reason => reason.status === 1,
      );
    },
    addNewPartnerAction() {
      this.partnerActionInputs.push({
        ...this.partnerAction,
        partnerActionInput: this.partnerInputCount++,
      });
    },
    removePartnerAction(inputIndex) {
      this.partnerActionInputs.splice(inputIndex, 1);
    },
    reassignmentReasonChanged() {
      this.$emit('actionValues', {
        reassignment_reason_penalize: this.reassignmentReasonPenalize,
        partner_actions: this.partnerActionInputs,
        customer_actions: this.customerActionInputs,
      });
    },
    updatePartnerActionInputChanged(updatedValue, field, inputIndex) {
      const currentObject = this.partnerActionInputs[inputIndex];
      this.$set(currentObject, field, updatedValue[field]);
      this.emitAllInputValues();
    },
    partnerActionSelectedChanged(selectedValue, inputIndex) {
      const { partner_action_id } = selectedValue;
      const selectedAction = this.partnerActionInputs[inputIndex];
      this.partnerInputsVisibilityTrigger(partner_action_id, selectedAction);
    },
    partnerInputsVisibilityTrigger(actionID, inputValuesObject) {
      this.$set(inputValuesObject, 'block_hours_visible', false);
      this.$set(inputValuesObject, 'partner_message_visible', false);
      this.$set(inputValuesObject, 'penalty_fee_visible', false);
      this.$set(inputValuesObject, 'partner_message_visible', false);

      if (actionID === 1) {
        this.$set(inputValuesObject, 'block_hours_visible', true);
        this.$set(inputValuesObject, 'partner_message_visible', true);
      } else if (actionID === 2) {
        this.$set(inputValuesObject, 'penalty_fee_visible', true);
        this.$set(inputValuesObject, 'partner_message_visible', true);
      } else if (actionID === 5) {
        this.$set(inputValuesObject, 'partner_message_visible', true);
      }
    },
    addNewCustomerAction() {
      this.customerActionInputs.push({
        ...this.customerAction,
        customerActionInput: this.customerInputCount++,
      });
    },
    removeCustomerAction(inputIndex) {
      this.customerActionInputs.splice(inputIndex, 1);
    },
    customerActionSelectedChanged(selectedValue, inputIndex) {
      const { customer_action_id } = selectedValue;
      const selectedAction = this.customerActionInputs[inputIndex];
      this.customerInputsVisibilityTrigger(customer_action_id, selectedAction);
      this.emitAllInputValues();
    },
    updateCustomerActionInputChanged(updatedValue, field, inputIndex) {
      const currentObject = this.customerActionInputs[inputIndex];
      this.$set(currentObject, field, updatedValue[field]);
      this.emitAllInputValues();
    },
    customerInputsVisibilityTrigger(actionID, inputValuesObject) {
      this.$set(inputValuesObject, 'customer_message_visible', false);
      this.$set(inputValuesObject, 'reschedule_hours_visible', false);
      if (actionID === 5) {
        this.$set(inputValuesObject, 'customer_message_visible', true);
      } else if (actionID === 4) {
        this.$set(inputValuesObject, 'customer_message_visible', true);
        this.$set(inputValuesObject, 'reschedule_hours_visible', true);
      }
    },
    emitAllInputValues() {
      this.$emit('actionValues', {
        reassignment_reason_penalize: this.reassignmentReasonPenalize,
        partner_actions: this.partnerActionInputs,
        customer_actions: this.customerActionInputs,
      });
    },
  },
};
</script>

<style scoped>
.replica {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
}
.vat {
  text-align: left;
  display: block;
}
.input-counter {
  display: flex;
  flex-direction: column;
}
.add-input {
  cursor: pointer;
  margin-top: 5px;
}
.remove-input {
  cursor: pointer;
  margin-top: 5px;
  color: #777373;
}
.input-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.user-input {
  margin-top: 15px;
}
.reposition-select-input {
  right: 15px;
}
.v-select {
  padding: 0;
}
</style>
