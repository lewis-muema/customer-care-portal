<template>
  <div>
    <div class="">
      <p class="add-hub-label">
        Name of hub
      </p>
      <el-input v-model="hub_name" type="input" placeholder=""> </el-input>
    </div>
    <div class="add-hub-selector">
      <p class="add-hub-label">
        Select country
      </p>
      <el-select
        class="add-hub-select"
        filterable
        placeholder="Select"
        v-model="country"
      >
        <el-option
          v-for="val in country_list"
          :key="val.id"
          :label="val.name"
          :value="val.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="">
      <p class="add-hub-label">
        Location
      </p>
      <el-input v-model="location" type="input" placeholder="Enter location">
      </el-input>
    </div>
    <div class="add-hub-selector">
      <p class="add-hub-label">
        Type of hub
      </p>
      <el-select
        class="add-hub-select"
        filterable
        placeholder="Select"
        v-model="hub_type"
      >
        <el-option
          v-for="val in hub_list"
          :key="val.id"
          :label="val.name"
          :value="val.id"
        >
        </el-option>
      </el-select>
    </div>

    <el-button type="primary" class="full-width action-submit-button">
      Add hub
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'AddHub',
  data() {
    return {
      hub_name: '',
      location: '',
      country: '',
      country_list: [
        {
          id: 1,
          name: 'Kenya',
        },
      ],
      hub_type: '',
      hub_list: [
        {
          id: 1,
          name: 'Main Hub',
        },
      ],
    };
  },
};
</script>

<style scoped>
.batch-details-holder {
  background: #f8fafb;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  padding: 16px;
}
.add-hub-selector {
  margin-top: 3%;
  margin-bottom: 3%;
}
.add-hub-label {
  margin-bottom: 6.1px;
}
.add-hub-select {
  width: 100%;
}
</style>
