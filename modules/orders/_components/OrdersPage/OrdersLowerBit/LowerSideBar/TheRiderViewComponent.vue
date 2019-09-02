<template>
  <div>
    <img
      class="profile-user-img img-responsive rider_picture_custom"
      :src="
        `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${photo}`
      "
    />
    <div class="rider_name_here">
      {{ riderDetails.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheRiderViewComponent',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      riderDetails: this.order.rider_details,
      photo: null,
    };
  },
  mounted() {
    this.photo = this.riderDetails.photo
      ? this.riderDetails.photo
      : '1533214131993profile_picture_placeholder.png';
  },
};
</script>
