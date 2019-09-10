<template>
  <div class="body-box">
    <div align="" :id="`view_details13_${order_no}`">
      <iframe
        :id="`comment_frame_${order_no}`"
        class="order_map_here"
        style="height:600px; background-color:#fff;"
        src=""
      >
        Comment</iframe
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheCommentsComponent',
  props: {
    order: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      order_no: this.order,
    };
  },
};
</script>
