<template>
  <table class="table table-bordered">
    <tbody>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Building</th>
        <th>Floor</th>
        <th>Road</th>
        <th>Other</th>
      </tr>
      <tr v-for="(p, index) in path" :key="p.index">
        <td>{{ index + 1 }}</td>
        <td>{{ p.name }}</td>
        <td>{{ p.flat_name ? p.flat_name : '' }}</td>
        <td>{{ p.house_door ? p.house_door : '' }}</td>
        <td>{{ p.road ? p.road : '' }}</td>
        <td>{{ p.other_description ? p.other_description : '' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'TheRouteComponent',
  props: {
    order: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      path: this.order,
    };
  },
};
</script>
