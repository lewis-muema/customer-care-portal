<template>
  <div class="filters-container">
    <div class="filters-title">Filters</div>
    <div class="filters-section-titles">Auxilliary Services</div>
    <div class="filters-section-items-holder">
      <div
        v-for="(service, index) in auxilliary"
        :key="index"
        class="filters-section-items"
        :class="activeService === index ? 'active-filters' : ''"
        @click="activeService = index"
      >
        {{ service.name }}
      </div>
    </div>
    <div class="filters-section-titles">Country</div>
    <div class="filters-section-items-holder">
      <div
        v-for="(ctry, index) in country"
        :key="index"
        class="filters-section-items"
        :class="activeCountry === index ? 'active-filters' : ''"
        @click="activeCountry = index"
      >
        {{ ctry.name }}
      </div>
    </div>
    <div class="filters-section-titles">Partner Profile</div>
    <div class="filters-section-items-holder">
      <div
        v-for="(Bunit, index) in BU"
        :key="index"
        class="filters-section-items"
        :class="activeBU === index ? 'active-filters' : ''"
        @click="activeBU = index"
      >
        {{ Bunit.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeService: '',
      activeCountry: '',
      activeBU: '',
      auxilliary: [
        {
          name: 'All',
        },
        {
          name: 'Fuel',
        },
        {
          name: 'Tyre',
        },
      ],
      country: [
        {
          name: 'Kenya',
        },
        {
          name: 'Uganda',
        },
      ],
      BU: [
        {
          name: 'MBU',
        },
        {
          name: 'EBU',
        },
        {
          name: 'FBU',
        },
      ],
    };
  },
};
</script>

<style>
.filters-container {
  padding: 50px 0px 0px 30px;
  height: 600px;
  overflow-y: scroll;
}
.filters-title {
  font-size: 20px;
  font-weight: 700;
  padding: 10px 0px 20px 0px;
}
.filters-section-titles {
  font-size: 18px;
  font-weight: 600;
  padding: 15px 0px 15px 0px;
}
.filters-section-items-holder {
  padding: 0px 20px 0px 20px;
}
.filters-section-items {
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding-left: 10%;
  background: white;
  color: black;
  font-size: 14px;
  font-weight: 700;
  width: 80%;
  margin: 5px 0px 5px 0px;
  cursor: pointer;
}
.active-filters {
  background: #c9531b;
  color: white;
}
</style>
