<template>
  <div>
    <form id="edit-form" @submit.prevent="editUser">
      edit
    </form>
  </div>
</template>
<script>
export default {
  name: 'TheEditComponent',
  data() {
    return {
      options: [
        { code: '1', reason: 'No partner' },
        { code: '2', reason: 'Delay' },
        { code: '3', reason: 'Customer error' },
      ],
    };
  },
};
</script>
