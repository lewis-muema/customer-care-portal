<template>
  <div>
    <form id="agile-form" @submit.prevent="pushToAgile">
      Push the corporate to Agile <br /><br />

      <button class="btn btn-primary action-button">
        Push to Agile
      </button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'TheAgileComponent',
};
</script>
