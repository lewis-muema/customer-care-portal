<template>
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1>
      {{ breadcrumbs.name }}
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
export default {
  name: 'TheBreadCrumbView',
  middleware: 'app',

  props: {
    breadcrumbs: {
      type: Object,
      required: true,
    },
  },
};
</script>
