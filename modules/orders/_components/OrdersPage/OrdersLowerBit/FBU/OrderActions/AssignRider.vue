<template>
  <div>
    <div class="driver-assign-row">
      <div
        class="driver-assign-tabs"
        :class="
          (ActiveClass = ActiveTab
            ? 'active-driver-assign-tabs'
            : 'inactive-driver-assign-tabs')
        "
        @click="ActiveTab = !ActiveTab"
      >
        Existing
      </div>
      <div
        class="driver-assign-tabs"
        :class="
          (ActiveClass = !ActiveTab
            ? 'active-driver-assign-tabs'
            : 'inactive-driver-assign-tabs')
        "
        @click="ActiveTab = !ActiveTab"
      >
        Add New
      </div>
    </div>
    <div class="driver-assign-inputs" v-if="ActiveTab">
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Driver ID"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Driver Details"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Truck Details"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Driver Rate"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Fuel advance(KES)"
      />
      <button class="assign-order-button">Assign Order</button>
    </div>
    <div class="new-driver-assign-inputs" v-else>
      <div class="new-driver-details">
        <p class="input-labels">Driver Details</p>
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Name"
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Phone number"
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="ID number/Passport no."
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="License number"
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Driver rate"
        />
      </div>
      <div class="new-truck-details">
        <p class="input-labels">Truck Details</p>
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Truck number"
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Trailer number"
        />
        <input
          type="text"
          class="freight-assign-new-rider-buttons"
          placeholder="Fuel Advance (KES)"
        />
      </div>
      <button class="assign-order-button">Assign Order</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignRider',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ActiveClass: 'active-driver-assign-tabs',
      ActiveTab: true,
    };
  },
  methods: {
    switchTab() {},
  },
};
</script>

<style></style>
