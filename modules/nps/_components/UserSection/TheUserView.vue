<template>
  <div class="box box-info">
    <div class="box-body nps-holder">
      <div class="nps-back-header">
        <nuxt-link class="nps-back-header row" to="/nps/dashboard">
          <div class="col-md-5">
            <span
              class="accordion-item-trigger-icon back-icon pull-left"
            ></span>
            <span class="back-text"> Back to Dashboard</span>
          </div>
        </nuxt-link>
      </div>
      <div class="row metrics-header">
        <div class="col-md-6 metrics-text">James Mbuthia Muriuki</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">sidebar</div>
      <div class="col-md-8">main bar</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheUserView',
};
</script>
