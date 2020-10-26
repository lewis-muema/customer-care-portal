<template>
  <div>
    <img
      class="profile-user-img img-responsive rider_picture_custom"
      :src="
        `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${photo}`
      "
    />
    <div class="rider_name_here">
      {{ riderName(riderDetails) }}
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
    };
  },
  computed: {
    photo() {
      return this.riderDetails.photo
        ? this.riderDetails.photo
        : '1533214131993profile_picture_placeholder.png';
    },
  },
  methods: {
    riderName(val) {
      let resp = val.name;
      if (val.vendor_type_id === 26) {
        resp = 'Intercounty Order';
      }
      return resp;
    },
  },
};
</script>
