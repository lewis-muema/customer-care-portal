<template>
  <div class="col-md-4">
    <div class="box box-primary" style="padding-bottom:1px;">
      <div class="map_custom" :id="`${details.payments.rider_id}`">
        <img
          :src="
            `https://maps.googleapis.com/maps/api/staticmap?center=-1.300041,36.780792&zoom=13&size=351x200&maptype=roadmap&markers=color:blue%7Clabel:R%7C-1.300041,36.780792&key=${googleApiKey}`
          "
          width="351px"
          height="200px;"
        />
      </div>
      <!-- end profile image -->
      <img
        class="profile-user-img img-responsive rider_picture_custom"
        :src="
          `https://api.sendyit.com/parcel/doc/photo/${details.payments.rider_id};?>`
        "
      />

      <div class="rider_name_here">
        {{ details.payments.rider_name }}
      </div>
      <ul class="timeline timeline-inverse" style="margin-top:35px;">
        {{
          this.determine_delivery_status()
        }}
        <div class="timeline-item">
          <span class="time">
            {{ details.delivery_detail.user_name }}
          </span>

          <h3 class="timeline-header no-border">
            {{ details.delivery_detail.from_name }}
            {{ details.delivery_detail.to_name }}
          </h3>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'SideComponent',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    console.log('this is the prop data', this.details);
    return {
      riderSideClass: null,
    };
  },
  computed: {
    googleApiKey() {
      return this.$env.GOOGL_API_KEY;
    },
    ...mapState(['config']),
  },

  methods: {
    determine_delivery_status() {
      const delivery_status = this.details.delivery_detail.delivery_status;
      const confirm_status = this.details.delivery_detail.confirm_status;
      if (delivery_status === 3) {
        this.riderSideClass = 'fa fa-thumbs-up bg-green fasendy';
      }
      if (delivery_status === 2) {
        this.riderSideClass = 'fa  fa-road bg-yellow fasendy';
      }
      if (delivery_status === 0) {
        this.riderSideClass = 'fa fa-clock-o bg-orange fasendy';
      }
      if (confirm_status === 0) {
        this.riderSideClass = 'fa fa-exclamation bg-red fasendy';
      }
    },
  },
};
</script>
<style scoped></style>
