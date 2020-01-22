<template>
  <div>
    <button
      class="button--create-child"
      @click="showing = showing ? false : true"
    >
      Create Child Order
    </button>
    <div class="child-order-inputs" v-if="showing">
      <p class="create--order-header">Create child order</p>
      <div>
        <input
          type="number"
          class="container-inputs"
          placeholder="Container Weight"
        />
        <gmap-autocomplete
          :options="map_options"
          placeholder="Empty Container Destination"
          :select-first-on-enter="true"
          class="container-inputs"
          @place_changed="setReturnDestination($event, 2)"
          @keyup="checkChangeEvents($event, 2)"
          @change="checkChangeEvents($event, 2)"
        />
        <select class="container-inputs">
          <option value="">Container Size</option>
          <option value="20">20 Feet</option>
          <option value="40">40 Feet</option>
        </select>
        <input
          type="text"
          class="container-inputs"
          placeholder="Consignee (name)"
        />
      </div>
      <div>
        <button class="create--order">create order</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CreateOrderComponent',
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
      showing: false,
      container_weight: '',
      destination: '',
      map_options: {
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
    };
  },
  methods: {
    setReturnDestination(place) {
      const countryIndex = place.address_components.findIndex(countryCode =>
        countryCode.types.includes('country'),
      );
      this.destination = {
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        waypoint_details_status: true,
        type: 'coordinates',
        country_code: place.address_components[countryIndex].short_name,
        more: {
          Estate: '',
          FlatName: '',
          place_idcustom: place.place_id,
          Label: '',
          HouseDoor: '',
          Otherdescription: '',
          Typed: '',
          Vicinity: 'Not Indicated',
          Address: 'Not Indicated',
        },
      };
      console.log(this.destination);
    },
    checkChangeEvents(event) {
      // console.log(event);
    },
  },
};
</script>
