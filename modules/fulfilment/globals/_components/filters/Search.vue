<template>
  <div>
    <el-input
      placeholder="Search order ( order no, name, user phone)"
      prefix-icon="el-icon-search"
      v-model="search"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      search: '',
    };
  },
};
</script>

<style></style>
