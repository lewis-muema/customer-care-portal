<template>
  <td class="city-class">
    <span v-for="city in cities" :key="city.city_id">
      {{ city.name }}
      <input
        type="checkbox"
        :value="city.city_id"
        v-model="checkedCities"
        @change="updateCheckall()"
      />
    </span>
  </td>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheCitiesBar',
  data() {
    return {
      citiesData: [],
      cities: [
        {
          city_id: 1,
          name: 'Nairobi',
        },
        {
          city_id: 2,
          name: 'Mombasa',
        },
      ],
      checkedCities: [],
      selectedCities: [],
    };
  },
  mounted() {
    this.checkedCities = [];
    for (let i = 0; i < this.cities.length; i += 1) {
      this.citiesData.push(this.cities[i].city_id);
    }
    // eslint-disable-next-line guard-for-in
    for (const key in this.citiesData) {
      this.checkedCities.push(this.citiesData[key]);
    }
  },
  methods: {
    ...mapMutations({
      updateSelectedCities: 'setSelectedCities',
    }),
    updateCheckall() {
      if (this.checkedCities.length === this.citiesData.length) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
      this.printValues();
    },
    printValues() {
      this.selectedCities = [];
      // eslint-disable-next-line guard-for-in
      for (const key in this.checkedCities) {
        // this.selectedCities += `${this.checkedCities[key]}, `;
        this.selectedCities.push(this.checkedCities[key]);
      }
      this.updateSelectedCities(this.selectedCities);
    },
  },
};
</script>
