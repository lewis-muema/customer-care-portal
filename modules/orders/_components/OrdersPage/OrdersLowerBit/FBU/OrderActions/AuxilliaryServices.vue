<template>
  <div>
    <p class="assign-header no-margin">Auxilliary Services</p>
    <div class="auxilliary-tabs">
      <p
        class="advance-tabs"
        :class="
          tab === 'fuel' ? 'active-services-tab' : 'inactive-services-tab'
        "
        @click="switchTab('fuel')"
      >
        Fuel Advance
      </p>
      <p
        class="advance-tabs"
        :class="
          tab === 'tyre' ? 'active-services-tab' : 'inactive-services-tab'
        "
        @click="switchTab('tyre')"
      >
        Tyre Advance
      </p>
    </div>
    <div class="finances-tab" v-if="tab === 'fuel'">
      <div class="auxilliary-inputs">
        <span>
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Pump rate (KES)"
          />
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Litres"
          />
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Fueling station name"
          />
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Partner rate (KES)"
          />
        </span>
        <button class="auxillary-save-button">Save</button>
      </div>
    </div>
    <div class="finances-tab" v-if="tab === 'tyre'">
      <div class="auxilliary-inputs">
        <span>
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Amount in KES"
          />
          <input
            type="text"
            class="freight-assign-rider-buttons"
            placeholder="Partner rate (KES)"
          />
        </span>
        <button class="auxillary-save-button">Save</button>
      </div>
    </div>
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
  data() {
    return {
      tab: 'fuel',
    };
  },
  methods: {
    switchTab(tab) {
      this.tab = tab;
    },
  },
};
</script>

<style>
.active-services-tab {
  border-top: 3px solid #1b7fc3 !important;
}
.inactive-services-tab {
  border: 0px !important;
  cursor: pointer;
}
.auxilliary-inputs {
  display: grid;
}
.auxilliary-tabs {
  display: flex;
  width: max-content;
}
.advance-tabs {
  width: 120px;
  margin: 0;
  height: 45px;
  text-align: center;
  padding-top: 3%;
  padding: 5%;
  border: 1px solid #bdbdbd;
  border-bottom: 1px solid white;
}
</style>
