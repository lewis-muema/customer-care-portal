<template>
  <div class="body-box">
    <div v-if="receivers.length === 0 || receivers === null">
      No Allocated Invoice Receivers
    </div>
    <table
      class="table table-bordered table-striped"
      :id="`invoiced_users_${user}`"
      v-if="receivers.length > 0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(receiver, key) in receivers" :key="key">
          <td>{{ receiver.name }}</td>
          <td>{{ receiver.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TheInvoiceComponent',
  props: {
    receivers: {
      type: Array,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
  },
};
</script>
