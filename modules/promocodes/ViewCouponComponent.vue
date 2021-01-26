<template>
  <div class="modal" tabindex="-1" role="dialog" id="viewCoupon">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <span v-if="loading">
          Loading promo code data <i class="fa fa-spinner fa-spin loader"></i>
        </span>
        <span v-if="!loading && coupon === null">
          Promo code not found
          <i class="fa fa-spinner fa-spin loader"></i>
        </span>
        <span v-else>
          <div class="modal-header view-modal-header">
            <h5 class="modal-title">
              {{ title }}
              <button
                type="button"
                class="close pull-right"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            <h6 class="modal-title">
              <span class="sub-header">
                {{ couponData !== null ? subheader : '' }}</span
              >
              <span
                v-if="!loading && coupon !== null && couponStatus !== null"
                class="status-chip"
                :class="`status-${couponStatus}`"
                >{{ couponStatus }}</span
              >
            </h6>
          </div>
          <div class="modal-body">
            <div class="col-md-12 coupon-hlder" v-if="couponData !== null">
              <div class="col-md-6">
                <label class="view-label"> Start Date </label>
                <p class="view-text ">
                  {{
                    getFormattedDate(
                      couponData.couponStartDate,
                      'MMM Do,  YYYY',
                    )
                  }}
                </p>
              </div>
              <div class="col-md-6 view-modal-header">
                <label class="view-label"> End Date </label>
                <p class="view-text ">
                  {{
                    getFormattedDate(couponData.couponEndDate, 'MMM Do,  YYYY')
                  }}
                </p>
              </div>
            </div>
            <div class="col-md-12 coupon-hlder" v-if="couponData !== null">
              <div class="col-md-6">
                <label class="view-label"> Discount Amount </label>
                <p class="view-text ">
                  {{ couponData.couponType === 1 ? couponData.currency : '' }}
                  {{
                    couponData.couponType === 1
                      ? this.numberWithCommas(couponData.couponAmount)
                      : `${couponData.couponAmount * 100}% `
                  }}
                </p>
              </div>
              <div class="col-md-6">
                <label class="view-label"> Maximum Discount Amount </label>
                <p class="view-text ">
                  {{ couponData.currency }}
                  {{ this.numberWithCommas(couponData.maxDiscountAmount) }}
                </p>
              </div>
            </div>
            <div class="col-md-12 coupon-hlder" v-if="couponData !== null">
              <div class="col-md-6">
                <label class="view-label"> Maximum Usage Per User </label>
                <p class="view-text ">
                  {{ couponData.maxUsageUser }}
                </p>
              </div>
              <div class="col-md-6">
                <label class="view-label"> Maximum Total Usage </label>
                <p class="view-text ">
                  {{ couponData.maxTotalUsage }}
                </p>
              </div>
            </div>
            <div class="col-md-12 coupon-hlder" v-if="couponData !== null">
              <div class="col-md-6">
                <label class="view-label"> Usage Count </label>
                <p class="view-text ">
                  {{ couponData.usageCount }}
                </p>
              </div>
            </div>
            <div class="col-md-12 coupon-hlder" v-if="couponData !== null">
              <div class="col-md-12">
                <label class="view-label"> Targeted Group </label>
                <div class="target-holder" v-if="targetGroups.length !== 0">
                  <template v-for="(targetGroup, index) in targetGroups">
                    <p class="view-text col-md-6 link-text " :key="index">
                      {{ isEmpty(targetGroup) ? 'N/A' : targetGroup.email }}
                    </p>
                  </template>
                </div>
                <div class="" v-else>
                  N/A
                </div>
              </div>
            </div>
          </div>
          <div class="row pull-right">
            <a
              class="cancel-button close"
              data-dismiss="modal"
              aria-label="Close"
            >
              Cancel
            </a>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewCouponComponent',
  props: ['couponID', 'coupon', 'loading', 'couponStatus'],
  computed: {
    couponData() {
      return this.coupon !== null ? this.coupon[0] : null;
    },
    title() {
      return this.couponData !== null ? this.couponData.couponName : '';
    },
    subheader() {
      return this.couponData.couponType === 1
        ? `${this.couponData.currency} ${this.numberWithCommas(
            this.couponData.couponAmount,
          )} | Cash | `
        : `${this.couponData.couponAmount * 100}% | Percentage | `;
    },
    targetGroups() {
      return this.couponData !== null ||
        this.couponData.targetedGroupList.length > 0
        ? this.couponData.targetedGroupList
        : [];
    },
  },
  methods: {
    isEmpty(obj) {
      for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }

      return JSON.stringify(obj) === JSON.stringify({});
    },
  },
};
</script>

<style scoped>
@import './_assets/styles/modals.css';
.view-modal-header {
  display: block !important;
}
.modal-title {
  width: 100%;
  font-size: 24px;
}
.view-label {
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #909399;
}
.view-text {
  font-size: 16px;

  letter-spacing: 0.25px;
}
.coupon-hlder {
  display: flex;
}
.target-holder {
  background: #fafdfe;
  height: 40em;
  height: 80vh;
  overflow-y: auto;
}
.link-text {
  font-size: 14px;
  line-height: 20px;
  text-decoration-line: underline;
  color: #527cbd;
}
.sub-header {
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.02em;
  color: #909399;
}
</style>
