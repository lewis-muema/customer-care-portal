<template>
  <section class="content">
    <div class="row">
      <div class="col-xs-12 content-holder">
        <nuxt />
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'TheMainSection',
};
</script>

<style>
.content-holder {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  /* float: left; */
  width: 100%;
}
.full-width {
  margin-top: 0 !important;
  margin-left: 0 !important;
}
</style>
