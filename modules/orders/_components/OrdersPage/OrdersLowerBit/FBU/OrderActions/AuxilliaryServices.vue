<template>
  <div class="finances-tab">
    <p class="assign-header no-margin">Auxilliary Services</p>
    <div class="auxilliary-inputs">
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Phone number"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Driver's license"
      />
      <input
        type="text"
        class="freight-assign-rider-buttons"
        placeholder="Driver rate"
      />
    </div>
    <button class="auxillary-save-button">Save</button>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
