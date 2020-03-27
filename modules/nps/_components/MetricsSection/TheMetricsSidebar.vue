<template>
  <div class="metrics-sidebar">
    <div class="col-md-12">
      <div class="section-header">Number of Surveys Sent</div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Clients surveyed</div>
      <div class="col-md-12 user-count" v-if="customerStatus">
        {{ customers }}
      </div>
      <div class="col-md-12 user-count" v-else>
        <div class="loader"></div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Partners surveyed</div>
      <div class="col-md-12 user-count" v-if="partnerStatus">
        {{ partners }}
      </div>
      <div class="col-md-12 user-count" v-else>
        <div class="loader"></div>
      </div>
    </div>
    <div class="col-md-12">
      <div class="col-md-12 user-header">Owners surveyed</div>
      <div class="col-md-12 user-count" v-if="ownerStatus">{{ owners }}</div>
      <div class="col-md-12 user-count" v-else>
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheMetricsSidebar',
  props: [
    'customers',
    'customerStatus',
    'partnerStatus',
    'partners',
    'owners',
    'ownerStatus',
  ],
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 133%;
}
.metrics-header {
  margin-top: 20px;
}
.metrics-sidebar {
  margin-bottom: 54px;
}
.user-header {
  font-size: 18px;
  line-height: 140%;
  color: #000000;
  margin-top: 35px;
  margin-bottom: 8px;
  font-weight: 600;
}

.user-count {
  font-weight: 400;
  font-size: 15px;
  line-height: 140%;
  margin-top: 11px;
}
.col-md-12 {
  padding-right: 0;
  padding-left: 0;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
