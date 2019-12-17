<template>
  <div>
    <div class="child-orders-table">
      <div class="child-orders-table-head">
        <div class="child1">Edit</div>
        <div class="child2"></div>
        <div class="child3">Container Number</div>
        <div class="child4">Truck Size</div>
        <div class="child5">Empty Container Destination</div>
        <div class="child6"></div>
      </div>
      <div v-for="(container, index) in containerDetails" :key="index" class="">
        <div
          class="child-orders-table-row"
          @click="showing = showing ? false : true"
        >
          <div class="child1"><span class="fa fa-fw fa-edit"></span></div>
          <div class="child2">save</div>
          <div class="child3">{{ container.container_number }}</div>
          <div class="child4">{{ container.container_size_feet }}</div>
          <div class="child5">{{ container.name }}</div>
          <div class="child6">cancel order</div>
        </div>
        <div>
          <LowerSlideComponent v-if="showing" :orderno="order" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LowerSlideComponent from './LowerSlideComponent';

export default {
  name: 'CreateOrderComponent',
  components: {
    LowerSlideComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // containers: [
      //   {
      //     consignee:order.freight_details.consignee,
      //     container_destination: {
      //       coordinates: '-1.3355024,36.878165699999954',
      //       country_code: 'KE',
      //       more: {
      //         Address: 'Not Indicated',
      //         Estate: '',
      //         FlatName: '',
      //         HouseDoor: '',
      //         Label: '',
      //         Otherdescription: '',
      //         Road: '',
      //         Typed: '',
      //         Vicinity: 'Not Indicated',
      //         landmark: '',
      //         place_idcustom: 'ChIJl5shhwUSLxgR56PeRSrUirg',
      //         viewport: {
      //           northeast: {
      //             lat: 0,
      //             lng: 0,
      //           },
      //           southwest: {
      //             lat: 0,
      //             lng: 0,
      //           },
      //         },
      //       },
      //       name: 'Inland Container Depot',
      //       recipient_name: null,
      //       recipient_phone: null,
      //       waypoint_details_status: true,
      //     },
      //     container_number: freight_details.container_number,
      //     container_size_feet: freight_details.container_size_feet,
      //     container_weight_tonnes: freight_details.container_weight_tonnes,
      //   },
      // ],
      containerDetails: this.order.freight_details,
      showing: false,
    };
  },
};
</script>
