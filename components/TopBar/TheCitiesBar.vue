<template>
  <td class="city-class">
    <span v-for="city in cities" :key="city.city_id">
      {{ city.city_name }}
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
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'TheCitiesBar',
  data() {
    return {
      citiesData: [],
      cities: null,
      checkedCities: [],
      selectedCities: [],
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters(['getCities']),

    countryCodes() {
      return this.userData.payload.data.country_codes;
    },
  },
  watch: {
    getCities(cities) {
      this.checkedCities = [];
      for (let i = 0; i < cities.length; i += 1) {
        this.citiesData.push(cities[i].city_id);
      }
      // eslint-disable-next-line guard-for-in
      for (const key in this.citiesData) {
        this.checkedCities.push(this.citiesData[key]);
      }
      return (this.cities = cities);
    },
  },
  mounted() {
    const countryCode = JSON.parse(this.countryCodes);
    this.setCities({
      code: 'ke',
      params: {
        code: countryCode,
      },
    });
  },
  methods: {
    ...mapMutations({
      updateSelectedCities: 'setSelectedCities',
    }),
    ...mapActions(['setCities']),
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
