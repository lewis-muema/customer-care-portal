<template>
  <div>
    <DistancePricingApprovalComponent :user="user" v-if="Distance" />
    <LocationPricingApprovalComponent :user="user" v-if="Location" />
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DistancePricingApprovalComponent from '@/modules/biz/_components/UserActions/PricingApproval/DistancePricingApprovalComponent';
import LocationPricingApprovalComponent from '@/modules/biz/_components/UserActions/PricingApproval/LocationPricingApprovalComponent';

export default {
  layout: 'users',
  components: {
    DistancePricingApprovalComponent,
    LocationPricingApprovalComponent,
  },
  data() {
    return {
      copID: 0,
      model: 'Distance',
      user: {},
    };
  },
  computed: {
    Distance() {
      return this.model === 'Distance';
    },
    Location() {
      return this.model === 'Location';
    },
  },
  async mounted() {
    this.model = this.$route.params.model;
    this.copID = this.$route.params.id;
    await this.singleCopUserRequest(this.copID, 'cop');
  },
  methods: {
    ...mapActions({
      request_single_user: 'request_single_user',
    }),
    async singleCopUserRequest(user, userType) {
      const payload = { userID: user, userType };
      try {
        const data = await this.request_single_user(payload);
        this.user = data;
      } catch {
        this.errors.push(
          'Something went wrong. Try again or contact Tech Support',
        );
      }
    },
  },
};
</script>
