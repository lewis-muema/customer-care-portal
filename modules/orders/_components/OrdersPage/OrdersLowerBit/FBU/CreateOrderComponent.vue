<template>
  <div>
    <button class="button--create-child">Create Child Order</button>
    <div class="child-order-inputs">
      <p class="create--order-header">Create child order</p>
      <div>
        <input
          type="number"
          class="container-inputs"
          placeholder="Container Weight"
        />
        <input
          type="text"
          class="container-inputs"
          placeholder="Empty container desination"
        />
        <select class="container-inputs">
          <option value="">Container Size</option>
          <option value="20">20 Feet</option>
          <option value="40">20 Feet</option>
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
      container_weight: '',
    };
  },
};
</script>
