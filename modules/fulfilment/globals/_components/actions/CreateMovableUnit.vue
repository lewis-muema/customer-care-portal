<template>
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
  >
    <el-form-item label="Pick up location of the movable unit">
      <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>
    <el-form-item label="Destination of the movable unit">
      <el-select
        v-model="formLabelAlign.region"
        placeholder="Select hub"
        class="full-width"
      >
        <el-option
          v-for="item in getHubs"
          :key="item.hub_id"
          :label="item.hub_name"
          :value="item.hub_id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="Do you have a preferred driver at the pick up location?"
    >
      <el-select
        v-model="formLabelAlign.preferedDriver"
        placeholder="Select"
        class="full-width"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="Enter their phone number or the vehicle reg number"
      placeholder="Enter Full Number plate / Phone Number"
      v-if="formLabelAlign.preferedDriver === 'yes'"
    >
      <el-input v-model="formLabelAlign.rider"></el-input>
    </el-form-item>

    <el-button type="primary" class="full-width action-submit-button">
      Create Movable Unit
    </el-button>
  </el-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CreateMovableUnit',
  data() {
    return {
      labelPosition: 'top',
      formLabelAlign: {
        name: '',
        region: '',
        preferedDriver: 'no',
        rider: '',
      },
      options: [
        {
          value: 'yes',
          label: 'Yes',
        },
        {
          value: 'no',
          label: 'No',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getHubs: 'fulfilment/getHubs',
    }),
  },
};
</script>

<style></style>
