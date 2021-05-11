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
            v-if="
              customerAction.customerActionInput !== actions_data.length - 1
            "
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
          Status of order to apply the cancellation fee
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
          v-model="customerAction.order_status"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'order_status',
              index,
            )
          "
        >
        </v-select>
      </div>

      <!--    time duration field (before showing message)-->
      <div
        v-if="customerAction.show_message_time_visible"
        class="form-group col-md-3 user-input"
        id="time-duration-select"
      >
        <label class="vat">
          When to show the message (minutes)
        </label>
        <el-input
          type="number"
          min="0"
          :disabled="customerAction.when_to_apply === 'immediately'"
          v-model="customerAction.show_message_time"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'show_message_time',
              index,
            )
          "
        >
          <el-select
            v-model="customerAction.when_to_apply"
            slot="prepend"
            placeholder="Select"
            @input="
              updateCustomerActionInputChanged(
                customerAction,
                'when_to_apply',
                index,
              )
            "
          >
            <el-option
              v-for="param in comparison_parameters"
              :key="param.value"
              :label="param.name"
              :value="param.value"
            >
            </el-option>
          </el-select>
          <template slot="append">Mins</template>
        </el-input>
      </div>

      <!--    time duration field (before charging fees)-->
      <div
        v-if="customerAction.apply_fees_time_visible"
        class="form-group col-md-3 user-input"
        id="apply-duration-select"
      >
        <label class="vat">
          When to apply the cancellation fee (minutes)
        </label>
        <el-input
          type="number"
          min="0"
          :disabled="customerAction.when_to_apply_fees === 'immediately'"
          v-model="customerAction.apply_fees_time"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'apply_fees_time',
              index,
            )
          "
        >
          <el-select
            v-model="customerAction.when_to_apply_fees"
            slot="prepend"
            placeholder="Select"
            @input="
              updateCustomerActionInputChanged(
                customerAction,
                'when_to_apply_fees',
                index,
              )
            "
          >
            <el-option
              v-for="param in comparison_parameters"
              :key="param.value"
              :label="param.name"
              :value="param.value"
            >
            </el-option>
          </el-select>
          <template slot="append">Mins</template>
        </el-input>
      </div>

      <!--    message to show-->
      <div
        v-if="customerAction.message_visible"
        class="form-group col-md-3 user-input"
      >
        <label class="vat"> Message to display </label>
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
import { mapActions } from 'vuex';

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
        apply_fees_time: null,
        apply_fees_time_visible: false,
        show_message_time: null,
        show_message_time_visible: false,
        when_to_apply: null,
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
      comparison_parameters: [
        {
          name: 'Less than',
          value: 'less_than',
        },
        {
          name: 'More than',
          value: 'more_than',
        },
        {
          name: 'Immediately',
          value: 'immediately',
        },
      ],
    };
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
      this.getActionValues();
    },
    async getActionValues() {
      this.actions_data = await this.fetch_cancellation_actions();
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
    resetTimeInput(currentObject, fieldValue) {
      if (fieldValue === 'immediately') {
        this.$set(currentObject, 'apply_fees_time', 0);
        this.$set(currentObject, 'show_message_time', 0);
      }
    },
    updateCustomerActionInputChanged(updatedValue, field, inputIndex) {
      const currentObject = this.customerActionInputs[inputIndex];
      if (field === 'when_to_apply') {
        this.resetTimeInput(currentObject, updatedValue[field]);
      }

      this.$set(currentObject, field, updatedValue[field]);
      this.emitAllInputValues();
    },
    customerActionSelectedChanged(selectedValue, inputIndex) {
      const { action_id } = selectedValue;
      const selectedAction = this.customerActionInputs[inputIndex];
      this.inputsVisibilityTrigger(action_id, selectedAction);
    },
    inputsVisibilityTrigger(actionID, inputValuesObject) {
      this.$set(inputValuesObject, 'apply_fees_time_visible', false);
      this.$set(inputValuesObject, 'message_visible', false);
      this.$set(inputValuesObject, 'show_message_time_visible', false);
      this.$set(inputValuesObject, 'penalty_fee_visible', false);
      this.$set(inputValuesObject, 'order_status_visible', false);

      if (actionID === 1) {
        this.$set(inputValuesObject, 'message_visible', true);
      } else if (actionID === 2 || actionID === 3) {
        this.$set(inputValuesObject, 'penalty_fee_visible', true);
        this.$set(inputValuesObject, 'order_status_visible', true);
        this.$set(inputValuesObject, 'apply_fees_time_visible', true);
      } else if (actionID === 4) {
        this.$set(inputValuesObject, 'message_visible', true);
      } else if (actionID === 5) {
        this.$set(inputValuesObject, 'show_message_time_visible', true);
        this.$set(inputValuesObject, 'message_visible', true);
      }
    },
    emitAllInputValues() {
      const inputValues = {
        customer_actions: this.customerActionInputs,
      };
      console.log('III', inputValues);
      this.$emit('actionInputValues', inputValues);
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
#time-duration-select > .el-input .el-input-group__prepend {
  width: 45%;
  padding: 0 15px 0 10px;
}
#apply-duration-select > .el-input .el-input-group__prepend {
  width: 45%;
  padding: 0 15px 0 10px;
}
#penalty-fee-input > .el-input .el-input-group__prepend {
  width: 30%;
  padding: 0 15px 0 10px;
}
</style>
