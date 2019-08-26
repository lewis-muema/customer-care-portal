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
      riderDetails: this.order,
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
<style>
profile-user-img {
  margin: 0 auto;
  width: 100px;
  padding: 3px;
  border: 3px solid #d2d6de;
}
.rider_picture_custom {
  width: 100px;
  height: 100px;
  margin-top: -65px;
  float: left;
  margin-left: 17px;
  background-color: white;
  /* z-index: 9999; */
  position: absolute;
  border: 3px solid #d2d6de;
  padding: 3px;
}
.rider_name_here {
  margin-top: -50px;
  margin-bottom: 10px;
  margin-left: 125px;
}
</style>
