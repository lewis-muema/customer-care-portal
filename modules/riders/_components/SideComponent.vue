<template>
  <div class="col-md-4">
    <div class="box box-primary" style="padding-bottom:1px;">
      <div class="map_custom" :id="`${details.rider_id}`">
        <img
          :src="
            `https://maps.googleapis.com/maps/api/staticmap?center=-1.300041,36.780792&zoom=13&size=351x200&maptype=roadmap&markers=color:blue%7Clabel:R%7C-1.300041,36.780792&key=${googleApiKey}`
          "
          width="351px"
          height="200px;"
        />
      </div>
      <img
        class="profile-user-img img-responsive rider_picture_custom"
        :src="`https://api.sendyit.com/parcel/doc/photo/${details.rider_id}`"
      />

      <div class="rider_name_here">
        {{ details.rider_name }}
      </div>

      <ul class="timeline timeline-inverse" style="margin-top:35px;">
        <li v-for="delivery in details.delivery_detail" :key="delivery.index">
          <i
            :class="
              `${log[delivery.order_status.replace(/ +/g, '')] ||
                'fa fa-envelope bg-blue fasendy'} `
            "
          >
          </i>
          <div class="timeline-item">
            <span class="time">
              {{ delivery.user_name }}
            </span>
            <h3 class="timeline-header no-border">
              {{ delivery.from_name }}
              {{ delivery.to_name }}
            </h3>
          </div>
        </li>
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
    return {
      riderSideClass: null,
      log: {
        delivered: 'fa fa-thumbs-up bg-green fasendy',
        intransit: 'fa  fa-road bg-yellow fasendy',
        pending: 'fa fa-exclamation bg-red fasendy',
        confirmed: 'fa fa-clock-o bg-orange fasendy',
      },
    };
  },
  computed: {
    googleApiKey() {
      return this.$env.GOOGL_API_KEY;
    },
    ...mapState(['config']),
  },
};
</script>
<style scoped>
.rider_picture_custom {
  margin-top: -114px;
}
</style>
