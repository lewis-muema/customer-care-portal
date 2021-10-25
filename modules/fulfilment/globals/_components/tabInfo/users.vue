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
    <div
      class="fulfillment-tab-info-bottom"
      v-if="orderDetail.batches.length > 0"
    >
      <div class="fulfillment-tab-info-titles">
        Delivery Partner (s)
      </div>
      <div class="fulfilment-delivery-partners-container">
        <div
          class="fulfillment-tab-info-rider-details delivery-partners-section"
          v-for="(val, index) in orderDetail.batches"
          :key="index"
        >
          <div
            v-if="checkAvailablePartner(val)"
            class="fulfilment-delivery-partner-inner"
          >
            <img
              class="fulfillment-tab-info-rider-img"
              src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
              alt=""
            />
            <div class="fulfilment-tabs-vehicle-details">
              <div>
                {{
                  !val.assigned_shipping_agent.agent_name
                    ? '--'
                    : val.assigned_shipping_agent.agent_name
                }}
              </div>
              <div>
                {{
                  !val.assigned_shipping_agent.vehicle_identifier
                    ? 'N/A'
                    : val.assigned_shipping_agent.vehicle_identifier
                }}
              </div>
              <div class="fulfillment-tab-info-rider-phone">
                <div>
                  {{
                    !val.assigned_shipping_agent.agent_phone_number
                      ? '--'
                      : val.assigned_shipping_agent.agent_phone_number
                  }}
                </div>
              </div>
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
  methods: {
    checkAvailablePartner(val) {
      let resp = false;
      if (!val.assigned_shipping_agent) {
        resp = false;
      } else {
        resp = !!val.assigned_shipping_agent.agent_name;
      }
      return resp;
    },
  },
};
</script>

<style></style>
