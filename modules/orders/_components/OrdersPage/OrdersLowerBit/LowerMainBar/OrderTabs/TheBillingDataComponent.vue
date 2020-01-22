<template lang="html">
  <div v-if="!loading" class="dashboard">
    <iframe
      class="iframe"
      :src="showBoard()"
      frameborder="0"
      width="100%"
      height="100%"
      allowtransparency
    />
  </div>
</template>
<script>
const jwt = require('jsonwebtoken');

export default {
  data() {
    return {
      loading: true,
      resource_id: 1129,
    };
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    showBoard() {
      const METABASE_SITE_URL = 'https://metabase.sendyit.com';
      const METABASE_SECRET_KEY =
        'baddc28e2149d570c8967cd8c6589e13d7356cd6a1c71e50f07d5f08d6b3bdc6';

      const payload = {
        resource: { dashboard: this.resource_id },
        params: {
          business_id: this.account,
        },
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      };
      const token = jwt.sign(payload, METABASE_SECRET_KEY);

      const iframeUrl = `${METABASE_SITE_URL}/public/question/${token}#bordered=true&titled=true`;

      return iframeUrl;
    },
  },
};
</script>
<style lang="css">
.iframe {
  min-height: 142vh;
}
.dashboard {
  height: auto;
}
.body--grey {
  background-color: #f9fbfc !important;
}
</style>
