<template>
  <div>
    <el-select v-model="value1" multiple placeholder="All Orders">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'StatusFilter',
  data() {
    return {
      options: [
        {
          value: 1,
          label: 'Pending',
        },
        {
          value: 2,
          label: 'Confirmed',
        },
        {
          value: 3,
          label: 'In Transit',
        },
        {
          value: 4,
          label: 'Delivered',
        },
        {
          value: 5,
          label: 'Cancelled',
        },
      ],
      value1: [],
      value2: [],
    };
  },
};
</script>
