<template>
  <div class="box box-info coupon-holder">
    <div class="box-body coupon-display">
      <h3 class="box-title">Promo Codes</h3>
      <span>
        <div>
          <FilterBar />
        </div>
      </span>
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
        <div class="table-responsive ">
          <button
            class="pull-right search-btn"
            @click="requestCoupons()"
            v-if="searched"
          >
            <i class="fa fa-arrow-left"></i>
            Back to list
          </button>
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
                <td colspan="8">No promo codes found.</td>
              </tr>
              <template v-else>
                <tr
                  v-for="(coupon, index) in pagedTableData"
                  :key="index"
                  @click="
                    triggerModal(
                      $event,
                      'viewCoupon',
                      coupon,
                      setCouponStatus(coupon.active),
                    )
                  "
                >
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
                  <td>
                    {{ coupon.couponType === 1 ? coupon.currency : '' }}
                    {{
                      coupon.couponType === 1
                        ? numberWithCommas(coupon.couponAmount)
                        : `${coupon.couponAmount * 100}%`
                    }}
                  </td>
                  <td>
                    {{ coupon.currency }}
                    {{ numberWithCommas(coupon.maxDiscountAmount) }}
                  </td>
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
                      @click.stop="triggerModal($event, 'updateCoupon', coupon)"
                      :class="{ disabledLink: coupon.active === 1 }"
                      >Edit</span
                    >
                    <span class="vl"></span>
                    <span
                      class="text-link text-deactivate"
                      @click.stop="
                        triggerModal($event, 'deactivateCoupon', coupon)
                      "
                      :class="{ disabledLink: coupon.active === 1 }"
                      >Deactivate</span
                    >
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <el-pagination
            layout="prev, pager, next"
            :total="this.coupons.length"
            @current-change="setPage"
            class="promo-pagination"
            v-if="coupons.length >= pageSize"
          >
          </el-pagination>
        </div>
      </span>
    </div>
    <DeactivateCoupon :coupon-name="couponName" />
    <UpdateCoupon :coupon-id="couponID" :loading="loading" :coupon="coupon" />
    <ViewCoupon
      :coupon-id="couponID"
      :loading="loading"
      :coupon="coupon"
      :coupon-status="status"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-vars */
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'PromoCodes',
  components: {
    FilterBar: () => import('./FilterCouponComponent'),
    DeactivateCoupon: () => import('./DeactivateCouponComponent'),
    UpdateCoupon: () => import('./UpdateCouponComponent'),
    ViewCoupon: () => import('./ViewCouponComponent'),
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
      action: '',
      status: null,
      page: 1,
      pageSize: 10,
      searched: false,
    };
  },
  computed: {
    ...mapGetters(['getCouponCountry', 'getSearchState', 'getSearchedCoupon']),

    couponStatus() {
      const data = [
        { status: 'active', value: 0, title: 'Active' },
        { status: 'inactive', value: 1, title: 'Expired' },
        { status: 'scheduled', value: 2, title: 'Scheduled' },
        { status: 'scheduled', value: 3, title: 'Scheduled' },
      ];
      return data;
    },
    pagedTableData() {
      return this.coupons.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page,
      );
    },
  },
  watch: {
    couponID(ID) {
      this.requestSingleCoupon(ID);
    },
    async getSearchedCoupon(ID) {
      if (ID !== null) {
        this.loading = true;
        this.coupons = null;
        await this.requestSingleCoupon(ID);
        this.coupons = this.coupon;
        this.loading = false;
      }
    },
    getSearchState(status) {
      this.searched = status;
    },
    getCouponCountry(code) {
      this.country = code;
      this.loading = true;
      this.coupons = null;
      this.requestCoupons();
    },
  },
  mounted() {
    this.country = this.getCouponCountry;
    this.requestCoupons();
    this.setCountries();
  },
  methods: {
    ...mapMutations({
      updateSearchState: 'setSearchState',
    }),
    ...mapActions([
      'request_coupons',
      'setCountries',
      'request_single_coupons',
    ]),
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    setPage(val) {
      this.page = val;
    },

    setCouponStatus(status) {
      const data = this.couponStatus.filter(coupon => coupon.value === status);
      return data[0];
    },

    async requestCoupons() {
      this.loading = true;
      this.requested = true;
      this.coupons = null;
      this.updateSearchState(false);

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
    triggerModal(e, modal, coupon, status) {
      const actionClass = '';
      this.updateClass(actionClass);
      this.updateErrors([]);

      this.coupon = null;
      this.loading = true;
      this.couponName = coupon.couponName;
      this.couponID = coupon.couponId;
      this.status = typeof status !== 'undefined' ? status : null;
      $(`#${modal}`).modal('show');
      e.preventDefault();
    },
  },
};
</script>

<style>
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
.promo-pagination > .btn-prev,
.promo-pagination > .btn-next {
  background-color: #fafdfe !important;
}
.el-pager,
.el-pager li {
  background-color: #fafdfe !important;
}
.search-btn {
  border: none;
  background: #fafdfe;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #527cbd;
  padding: 0 2.5em 1em 0;
}
</style>
