<template>
  <div class="row main-metric-section">
    <div class="col-md-12">
      <div class="section-header">Survey activity per account</div>
    </div>
    <div class="row">
      <div
        v-for="(userInfo, index) in userMetrics"
        :key="index"
        class="col-md-6 metrics-holder"
      >
        <div class="user-header">{{ userInfo.user }}</div>
        <div class="row">
          <div
            v-for="(subSection, i) in userInfo.child"
            :key="i"
            class="col-md-4 sub-holder"
          >
            <div class="sub-section-heading">{{ subSection.name }}</div>
            <div class="sub-section-value">{{ subSection.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheMetricsMainSection',
  data() {
    return {
      userMetrics: [
        {
          user: 'Client Peer',
          child: [
            {
              name: 'No. Surveyed',
              value: 345,
            },
            {
              name: 'No. Responses',
              value: 145,
            },
            {
              name: '% Commented',
              value: '100%',
            },
            {
              name: '% Responded',
              value: '16%',
            },
            {
              name: '% Dismissed',
              value: '345%',
            },
          ],
        },
        {
          user: 'Client Business',
          child: [
            {
              name: 'No. Surveyed',
              value: 345,
            },
            {
              name: 'No. Responses',
              value: 145,
            },
            {
              name: '% Commented',
              value: '100%',
            },
            {
              name: '% Responded',
              value: '16%',
            },
            {
              name: '% Dismissed',
              value: '345%',
            },
          ],
        },
        {
          user: 'Partner 2W',
          child: [
            {
              name: 'No. Surveyed',
              value: 345,
            },
            {
              name: 'No. Responses',
              value: 145,
            },
            {
              name: '% Commented',
              value: '100%',
            },
            {
              name: '% Responded',
              value: '16%',
            },
            {
              name: '% Dismissed',
              value: '345%',
            },
          ],
        },
      ],
    };
  },
};
</script>
<style scoped>
.section-header {
  font-weight: 600;
  font-size: 24px;
  line-height: 133%;
}
.metrics-holder {
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  width: 100%;
  margin-right: 3em;
  margin-top: 3em;
  max-width: 46%;
  padding-top: 12px;
}
.user-header {
  font-size: 20px;
  line-height: 32px;
  color: #0f4271;
}
.sub-section-heading {
  font-size: 14px;
  line-height: 28px;
  color: #6b8399;
}
.sub-section-value {
  font-weight: 600;
  font-size: 20px;
  line-height: 140%;
  color: #000000;
}
.main-metric-section {
  margin-right: 29px;
  margin-bottom: 29px;
  margin-left: 0;
}
.sub-holder {
  margin-bottom: 20px;
}
</style>
