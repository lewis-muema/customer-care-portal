<template>
  <td class="city-class">
    <span>
      Nairobi
      <input checked id="val_nairobi" type="checkbox" onChange="city_selector()"
    /></span>

    <span>
      Kisumu
      <input checked id="val_kisumu" type="checkbox" onChange="city_selector()"
    /></span>

    <span>
      Mombasa
      <input checked id="val_mombasa" type="checkbox" onChange="city_selector()"
    /></span>

    <span>
      Other places
      <input checked id="val_other" type="checkbox" onChange="city_selector()"
    /></span>

    <span>
      Intercity
      <input
        checked
        id="val_intercity"
        type="checkbox"
        onChange="city_selector()"
    /></span>

    <span>
      Ecommerce
      <input
        checked
        id="val_ecommerce"
        type="checkbox"
        onChange="city_selector()"
    /></span>
  </td>
</template>
<script>
export default {
  name: 'TheCitiesBar',
};
</script>
