<template>
  <div>
    <img class="profile-user-img img-responsive rider_picture_custom" />
    <div class="rider_name_here">
      <!-- {{ riderDetails.name }} -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheRiderViewComponent',
  props: {
    orderdetails: {
      type: Object,
      required: true,
    },
  },
  // data() {
  //   return {
  //     riderDetails: this.order.rider_details,
  //     photo: null,
  //   };
  // },
  // mounted() {
  //   this.photo = this.riderDetails.photo
  //     ? this.riderDetails.photo
  //     : '1533214131993profile_picture_placeholder.png';
  // },
};
</script>
