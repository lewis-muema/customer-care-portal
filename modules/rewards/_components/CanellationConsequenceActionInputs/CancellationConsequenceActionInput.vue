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
          v-model="customerAction.action_type"
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
        v-if="customerAction.cancellation_fee_visible"
        class="form-group col-md-3 user-input"
        id="penalty-fee-input"
      >
        <label class="vat"> How much is the cancellation fee? </label>
        <el-input
          placeholder="Please input amount"
          type="number"
          min="1"
          v-model="customerAction.cancellation_fee"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'cancellation_fee',
              index,
            )
          "
        >
          <template slot="prepend">{{ selectedCountryCurrency }}</template>
        </el-input>
        <div
          v-if="validateInputs(customerAction, 'cancellation_fee', index)"
          class="error"
        >
          Penalty fee value required!
        </div>
      </div>

      <!--      order status field-->
      <div
        v-if="customerAction.applicable_order_status_visible"
        class="form-group col-md-3 user-input"
      >
        <label class="vat">
          Status of order to apply the cancellation fee
        </label>
        <v-select
          :options="order_status_data"
          :reduce="name => name.value"
          chips
          multiple
          label="label"
          name="label"
          placeholder="Select"
          class="form-control select user-billing"
          :id="`value`"
          v-model="customerAction.applicable_order_status"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'applicable_order_status',
              index,
            )
          "
        >
        </v-select>
        <div
          v-if="
            validateInputs(customerAction, 'applicable_order_status', index)
          "
          class="error"
        >
          Order status value required!
        </div>
      </div>

      <!--    time duration field (before showing message/charging fee)-->
      <div
        v-if="customerAction.duration_visible"
        class="form-group col-md-3 user-input"
        id="time-duration-select"
      >
        <label class="vat">
          {{
            customerAction.action_type === 5
              ? 'When to show the message (minutes)'
              : 'When to apply the cancellation fee (minutes)'
          }}
        </label>
        <el-input
          type="number"
          min="0"
          :disabled="customerAction.comparator === 0"
          v-model="customerAction.duration"
          @input="
            updateCustomerActionInputChanged(
              customerAction,
              'message_duration',
              index,
            )
          "
        >
          <el-select
            v-model="customerAction.comparator"
            slot="prepend"
            placeholder="Select"
            @input="
              updateCustomerActionInputChanged(
                customerAction,
                'comparator',
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
        <div
          v-if="validateInputs(customerAction, 'comparator', index)"
          class="error"
        >
          Time when to apply value required!
        </div>
        <div
          v-if="validateInputs(customerAction, 'duration', index)"
          class="error"
        >
          Minutes time value required!
        </div>
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
        <div
          v-if="validateInputs(customerAction, 'message', index)"
          class="error"
        >
          Message is required!
        </div>
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
        action_type: null,
        duration: null,
        duration_visible: false,
        comparator: null,
        cancellation_fee: null,
        cancellation_fee_visible: false,
        message_visible: false,
        message: null,
        applicable_order_status_visible: false,
        applicable_order_status: null,
        customerActionInput: 0,
      },
      inputCount: 0,
      customerActionsSelected: {},
      customerActionInputs: [],
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
      when_to_apply_duration: '',
      comparison_parameters: [
        { name: 'Less than', value: 1 },
        { name: 'More than', value: 2 },
        { name: 'Immediately', value: 0 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      actions_data: 'getCancellationActions',
    }),
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions({
      fetch_cancellation_actions: 'fetch_cancellation_actions',
    }),
    initData() {
      this.getActionValues();
      this.addNewCustomerAction();
    },
    async getActionValues() {
      await this.fetch_cancellation_actions();
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
      if (fieldValue === 0) {
        this.$set(currentObject, 'duration', 0);
      }
    },
    updateCustomerActionInputChanged(updatedValue, field, inputIndex) {
      const currentObject = this.customerActionInputs[inputIndex];
      if (field === 'comparator') {
        this.resetTimeInput(currentObject, updatedValue[field]);
      }

      this.$set(currentObject, field, updatedValue[field]);
      this.emitAllInputValues();
    },
    customerActionSelectedChanged(selectedValue, inputIndex) {
      const { action_type } = selectedValue;
      const selectedAction = this.customerActionInputs[inputIndex];
      this.inputsVisibilityTrigger(action_type, selectedAction);
    },
    inputsVisibilityTrigger(actionID, inputValuesObject) {
      this.$set(inputValuesObject, 'message_visible', false);
      this.$set(inputValuesObject, 'duration_visible', false);
      this.$set(inputValuesObject, 'cancellation_fee_visible', false);
      this.$set(inputValuesObject, 'applicable_order_status_visible', false);

      if (actionID === 1 || actionID === 4) {
        this.$set(inputValuesObject, 'message_visible', true);
      } else if (actionID === 2 || actionID === 3) {
        this.$set(inputValuesObject, 'cancellation_fee_visible', true);
        this.$set(inputValuesObject, 'applicable_order_status_visible', true);
        this.$set(inputValuesObject, 'duration_visible', true);
      } else if (actionID === 5) {
        this.$set(inputValuesObject, 'duration_visible', true);
        this.$set(inputValuesObject, 'message_visible', true);
      }
    },
    validateInputs(updatedValue, field, inputIndex) {
      const currentObject = this.customerActionInputs[inputIndex];
      return currentObject[field] === '' || currentObject[field] === null;
    },
    sanitizeValues(actionData) {
      // DEEP CLONE ARRAY
      const actionValues = JSON.parse(JSON.stringify(actionData));

      const actonDataValues = actionValues.map(action => {
        // eslint-disable-next-line guard-for-in
        for (const key in action) {
          const found = key.includes('_visible');
          if (found) delete action[key];

          const exists = key.includes('customerActionInput');
          if (exists) delete action[key];

          if (action[key] === null) delete action[key];
        }
        return action;
      });
      return this.removeInvalidObjects(actonDataValues);
    },
    removeInvalidObjects(valuesArray) {
      let duplicateActionFound = false;
      let validatedArray = [];
      valuesArray.forEach(value => {
        if (value.action_type === 1 || value.action_type === 4) {
          if (Object.keys(value).length >= 2) validatedArray.push(value);
        }

        if (value.action_type === 2 || value.action_type === 3) {
          if (Object.keys(value).length >= 5) validatedArray.push(value);
        }

        if (value.action_type === 5) {
          if (Object.keys(value).length >= 4) validatedArray.push(value);
        }

        duplicateActionFound = validatedArray.some(
          action => action.action_type === value.action_type,
        );
      });

      if (duplicateActionFound) validatedArray = [];
      return validatedArray;
    },
    emitAllInputValues() {
      const actionValues = this.sanitizeValues(this.customerActionInputs);
      this.$emit('actionInputValues', actionValues);
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
  position: relative;
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
.error {
  color: red;
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
