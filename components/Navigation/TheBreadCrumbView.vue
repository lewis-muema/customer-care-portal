<template>
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      <!-- {{ baseUrl }} -->
      <small> {{ breadcrumbs.description }} </small>
    </h1>
    <ol class="breadcrumb">
      <li>
        <a href="#"
          ><i class="fa fa-dashboard"></i> {{ breadcrumbs.mainName }}</a
        >
      </li>
      <li>{{ breadcrumbs.category }}</li>
      <li class="active">{{ breadcrumbs.subCategory }}</li>
    </ol>
  </section>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'TheBreadCrumbView',

  computed: {
    ...mapGetters({
      breadcrumbs: 'breadcrumbs',
    }),
  },
  mounted() {
    this.setBreadcrumbs();
  },
  methods: {
    setBreadcrumbs() {
      console.log('breadcrumbs');
      this.$store.dispatch('setBreadCrumbs');
    },
  },
};
</script>
