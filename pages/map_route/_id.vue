<template>
  <div>
    map holder single

    {{ orderNo }}
  </div>
</template>
<script>
export default {
  layout: 'map',
  //   const { id } = this.$route.params
  data() {
    return {
      orderNo: this.$route.params.id,
    };
  },
};
</script>
