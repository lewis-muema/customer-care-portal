<template>
  <div class="input-container">
    <!--    action dropdown-->
    <div
      class="row replica"
      v-for="(customerAction, index) in customerActionInputs"
      :key="`customerAction-${index}`"
    >
      <div class="form-group col-md-3 user-input">
        <label class="vat"> Action </label>
        <v-select
          :options="actions_data"
          :reduce="name => name.id"
          :name="customerAction.customerActionInput"
          label="display_name"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`name`"
          @input="customerActionSelectedChanged(customerAction, index)"
          v-model="customerAction.action_id"
        >
        </v-select>
        <div class="input-counter">
          <div
            v-if="customerAction.customerActionInput !== 3"
            class="add-input"
            @click="addNewCustomerAction"
          >
            + Select another partner action
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

      <!--    charge penalty fee message-->
      <div
        v-if="customerAction.penalty_fee_visible"
        class="form-group col-md-3 user-input"
        id="penalty-fee-input"
      >
        <label class="vat"> How much is the cancellation fee? </label>
        <el-input
          placeholder="Please input amount"
          type="number"
          min="1"
          v-model="customerAction.penalty_fee"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'penalty_fee',
              index,
            )
          "
        >
          <template slot="prepend">{{ selectedCountryCurrency }}</template>
        </el-input>
      </div>

      <!--      order status field-->
      <div
        v-if="customerAction.order_status_visible"
        class="form-group col-md-3 user-input"
      >
        <label class="vat">
          What status of the order should we apply the cancellation fee?
        </label>
        <v-select
          :options="order_status_data"
          :reduce="name => name.value"
          chips
          label="label"
          name="label"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`value`"
          v-model="order_status"
        >
        </v-select>
      </div>

      <!--    how long field-->
      <div
        v-if="customerAction.apply_time_visible"
        class="form-group col-md-3 user-input"
        id="apply-duration-select"
      >
        <label class="vat">
          When to apply the cancellation fee
        </label>
        <el-input
          type="number"
          min="0"
          v-model="customerAction.apply_time"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'apply_time',
              index,
            )
          "
        >
          <el-select
            v-model="customerAction.when_to_apply_duration"
            slot="prepend"
            placeholder="Select"
          >
            <el-option
              v-for="value in comparison_Values"
              :key="value.code"
              :label="value.name"
              :value="value.code"
            >
            </el-option>
          </el-select>
          <template slot="append">Mins</template>
        </el-input>
      </div>

      <!--    message to show customer-->
      <div
        v-if="customerAction.message_visible"
        class="form-group col-md-3 user-input"
      >
        <label class="vat"> Message to display to customer </label>
        <el-input
          placeholder="Please input"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="customerAction.message"
          @input="
            updateCustomerActionInputChanged(customerAction, 'message', index)
          "
        >
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CancellationConsequenceActionInput',
  props: {
    selectedCountryCurrency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      customerAction: {
        action_id: null,
        apply_time: null,
        apply_time_visible: false,
        when_to_apply_duration: null,
        penalty_fee: null,
        penalty_fee_visible: false,
        message_visible: false,
        message: '',
        order_status_visible: false,
        order_status: null,
        customerActionInput: 0,
      },
      inputCount: 0,
      customerActionsSelected: {},
      customerActionInputs: [],
      actions_data: [],
      reassignmentReasonPenalize: '',
      reassignment_reason: [],
      actionsCodesArray: [],
      order_status_data: [
        {
          label: 'Before an order has been confirmed',
          reason: 'BEFORE_CONFIRMATION',
          value: 1,
        },
        {
          label: 'Before arrival at pickup location',
          reason: 'AFTER_CONFIRMATION',
          value: 2,
        },
        {
          label: 'After arrival at pick up location',
          reason: 'AFTER_ARRIVAL_AT_PICK_UP',
          value: 3,
        },
      ],
      order_status: [],
      when_to_apply_duration: '',
      comparison_Values: [
        {
          name: 'Less than',
          code: 0,
        },
        {
          name: 'More than',
          code: 1,
        },
        {
          name: 'Immediately',
          code: 2,
        },
      ],
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
    ...mapActions({
      fetch_cancellation_actions: 'fetch_cancellation_actions',
    }),
    initData() {
      this.addNewCustomerAction();
      this.filterReassignmentReasons();
      this.getActionValues();
    },
    async getActionValues() {
      this.actions_data = await this.fetch_cancellation_actions();
    },
    filterReassignmentReasons() {
      this.reassignment_reason = this.reallocationReasons.filter(
        reason => reason.status === 1,
      );
    },
    addNewCustomerAction() {
      this.customerActionInputs.push({
        ...this.customerAction,
        customerActionInput: this.inputCount++,
      });
    },
    removeCustomerAction(inputIndex) {
      this.customerActionInputs.splice(inputIndex, 1);
    },
    reassignmentReasonChanged() {
      this.$emit('actionValues', {
        reassignment_reason_penalize: this.reassignmentReasonPenalize,
        partner_actions: this.customerActionInputs,
        customer_actions: this.customerActionInputs,
      });
    },
    updateCustomerActionInputChanged(updatedValue, field, inputIndex) {
      const currentObject = this.customerActionInputs[inputIndex];
      this.$set(currentObject, field, updatedValue[field]);
      this.emitAllInputValues();
    },
    customerActionSelectedChanged(selectedValue, inputIndex) {
      const { action_id } = selectedValue;
      const selectedAction = this.customerActionInputs[inputIndex];
      this.inputsVisibilityTrigger(action_id, selectedAction);
    },
    inputsVisibilityTrigger(actionID, inputValuesObject) {
      this.$set(inputValuesObject, 'apply_time_visible', false);
      this.$set(inputValuesObject, 'message_visible', false);
      this.$set(inputValuesObject, 'penalty_fee_visible', false);
      this.$set(inputValuesObject, 'order_status_visible', false);

      if (actionID === 1) {
        this.$set(inputValuesObject, 'message_visible', true);
      } else if (actionID === 2) {
        this.$set(inputValuesObject, 'penalty_fee_visible', true);
        this.$set(inputValuesObject, 'order_status_visible', true);
        this.$set(inputValuesObject, 'apply_time_visible', true);
      } else if (actionID === 5) {
        this.$set(inputValuesObject, 'message_visible', true);
      }
    },
    emitAllInputValues() {
      this.$emit('actionValues', {
        reassignment_reason_penalize: this.reassignmentReasonPenalize,
        partner_actions: this.customerActionInputs,
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
  margin-bottom: 3px;
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
.input-with-select {
  margin-left: -6%;
}
</style>

<style>
#apply-duration-select > .el-input .el-input-group__prepend {
  width: 45%;
  padding: 0 15px 0 10px;
}
#penalty-fee-input > .el-input .el-input-group__prepend {
  width: 30%;
  padding: 0 15px 0 10px;
}
</style>
