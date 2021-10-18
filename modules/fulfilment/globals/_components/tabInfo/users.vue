<template>
  <div>
    <div class="fulfillment-tab-info-top">
      <div class="fulfillment-tab-info-seller">
        <div class="fulfillment-tab-info-titles">Seller</div>
        <div>
          <div class="fulfillment-tab-info-description">
            <i class="fa fa-user fulfillment-tab-info-description-icon"></i>
            <div>{{ orderDetail.business.business_name }}</div>
          </div>
          <div class="fulfillment-tab-info-description">
            <i class="fa fa-phone fulfillment-tab-info-description-icon"></i>
            <div>
              {{
                !orderDetail.business.business_phone
                  ? '--'
                  : orderDetail.business.business_phone
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="fulfillment-tab-info-recipient">
        <div class="fulfillment-tab-info-titles">Recipient</div>
        <div>
          <div class="fulfillment-tab-info-description">
            <i class="fa fa-user fulfillment-tab-info-description-icon"></i>
            <div>{{ orderDetail.destination.name }}</div>
          </div>
          <div class="fulfillment-tab-info-description">
            <i class="fa fa-phone fulfillment-tab-info-description-icon"></i>
            <div>
              {{
                !orderDetail.destination.phone_number
                  ? '--'
                  : orderDetail.destination.phone_number
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fulfillment-tab-info-bottom">
      <div class="fulfillment-tab-info-titles">
        Delivery Partner
      </div>
      <div class="fulfillment-tab-info-rider-details">
        <img
          class="fulfillment-tab-info-rider-img"
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
        />
        <div class="fulfilment-tabs-vehicle-details">
          <div>John Otieno</div>
          <div>KCEK 345V</div>
          <div class="fulfillment-tab-info-rider-phone">
            <div>
              +25471234567
            </div>
            <div class="fulfillment-tab-info-view-batch">
              View Batch
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UsersInfo',
  data() {
    return {
      orderDetail: {},
    };
  },
  computed: {
    ...mapGetters({
      getTableDetails: 'fulfilment/getTableDetails',
    }),
  },
  beforeMount() {
    this.orderDetail = this.getTableDetails;
  },
};
</script>

<style></style>
