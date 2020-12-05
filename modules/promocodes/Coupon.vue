<template>
  <div class="box box-info coupon-holder">
    <div class="box-body coupon-display">
      <h3 class="box-title">Promo Codes</h3>
      <span v-if="coupons === null">
        <div class="text-center">
          <span v-if="loading">
            Loading Promo Codes ....
            <i class="fa fa-spinner fa-spin loader"></i>
          </span>
          <span v-if="!loading && requested">
            No promocodes found
          </span>
        </div>
      </span>
      <span v-else>
        <div>
          <FilterBar />
        </div>
        <div class="table-responsive ">
          <table class="table coupon-table">
            <thead>
              <tr>
                <th>Promo Code Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Coupon Type</th>
                <th>Discount Amount</th>
                <th>Max Discount Amount</th>
                <th>Max Usage Per User</th>
                <th>Max Total Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="coupons.length === 0">
                <td colspan="8">There are no promo codes in the system.</td>
              </tr>
              <template v-else>
                <tr v-for="(coupon, index) in coupons" :key="index">
                  <td>{{ coupon.couponName }}</td>
                  <td>
                    {{
                      getFormattedDate(coupon.couponStartDate, 'MMM Do,  YYYY')
                    }}
                  </td>
                  <td>
                    {{
                      getFormattedDate(coupon.couponEndDate, 'MMM Do,  YYYY')
                    }}
                  </td>
                  <td>{{ coupon.couponType === 1 ? 'Cash' : 'Percentage' }}</td>
                  <td>{{ coupon.couponAmount }}</td>
                  <td>{{ coupon.maxDiscountAmount }}</td>
                  <td>{{ coupon.maxUsageUser }}</td>
                  <td>{{ coupon.maxTotalUsage }}</td>
                  <td>
                    <span
                      class="status-chip"
                      :class="`status-${setCouponStatus(coupon.active).status}`"
                      >{{ setCouponStatus(coupon.active).title }}</span
                    >
                  </td>
                  <td>
                    <span
                      class="text-link text-update"
                      @click="triggerModal($event, 'updateCoupon', coupon)"
                      :class="{ disabledLink: coupon.active === 1 }"
                      >Edit</span
                    >
                    <span class="vl"></span>
                    <span
                      class="text-link text-deactivate"
                      @click="triggerModal($event, 'deactivateCoupon', coupon)"
                      :class="{ disabledLink: coupon.active === 1 }"
                      >Deactivate</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </span>
    </div>
    <DeactivateCoupon :coupon-name="couponName" />
    <UpdateCoupon :coupon-id="couponID" :loading="loading" :coupon="coupon" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'PromoCodes',
  components: {
    FilterBar: () => import('./FilterCouponComponent'),
    DeactivateCoupon: () => import('./DeactivateCouponComponent'),
    UpdateCoupon: () => import('./UpdateCouponComponent'),
  },
  data() {
    return {
      coupons: null,
      loading: false,
      requested: false,
      country: 'ALL',
      couponName: null,
      couponID: null,
      coupon: null,
    };
  },
  computed: {
    couponStatus() {
      const data = [
        { status: 'active', value: 0, title: 'Active' },
        { status: 'inactive', value: 1, title: 'Expired' },
        { status: 'scheduled', value: 2, title: 'Scheduled' },
      ];
      return data;
    },
  },
  watch: {
    couponID(ID) {
      this.requestSingleCoupon(ID);
    },
  },
  mounted() {
    this.country = 'ALL';
    this.requestCoupons();
    this.setCountries();
  },
  methods: {
    ...mapActions([
      'request_coupons',
      'setCountries',
      'request_single_coupons',
    ]),

    setCouponStatus(status) {
      const data = this.couponStatus.filter(coupon => coupon.value === status);
      return data[0];
    },

    async requestCoupons() {
      this.loading = true;
      this.requested = true;
      const payload = {
        country: this.country,
      };

      try {
        const data = await this.request_coupons(payload);
        this.coupons = data.status ? data.message : null;
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async requestSingleCoupon(ID) {
      this.loading = true;
      this.requested = true;
      const payload = {
        id: ID,
      };

      try {
        const data = await this.request_single_coupons(payload);
        this.coupon = data.status ? data.message : null;
        this.loading = false;
      } catch (error) {
        this.response_status = 'error';
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    triggerModal(e, modal, coupon) {
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors([]);

      if (coupon.active !== 1) {
        this.coupon = null;
        this.loading = true;
        this.couponName = coupon.couponName;
        this.couponID = coupon.couponId;
        $(`#${modal}`).modal('show');
        e.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.coupon-display {
  background: #fafdff;
  border-radius: 8px;
  padding: 32px 24px;
}

.coupon-holder {
  padding: 24px;
  background: #f2f6fc;
}
.coupon-table > tbody > tr > td {
  padding: 16px;
}
.status-chip {
  padding: 6px 12px;
  border-radius: 116px;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #fafdff;
}
.status-active {
  background: #aee0a8;
}
.status-inactive {
  background: #fcc6c8;
}
.status-scheduled {
  background: #c8e8fc;
}
.vl {
  border-left: 1px solid #dcdfe6;
  height: 500px;
  margin: 0 10px;
}
.text-link {
  font-weight: 600;
  letter-spacing: 0.4px;
  cursor: pointer;
}
.text-update {
  color: #527cbd;
}
.text-deactivate {
  color: #d2212a;
}
.disabledLink {
  opacity: 0.3;
  cursor: default;
}
</style>
