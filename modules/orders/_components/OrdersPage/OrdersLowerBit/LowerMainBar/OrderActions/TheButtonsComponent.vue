<template>
  <ul class="nav nav-tabs" style="border:0px !important;">
    <li class="2019-05-15 11:43:16.0">
      <a
        class="force_blue"
        href="#tab_3abAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
        onclick=""
        id="distab_3abAC43F8829-12W"
      >
        <span class="fa fa-fw fa-wifi"></span>
        Dispatch
      </a>
    </li>
    <li class="">
      <a
        class="force_blue"
        style="width:100px!important;"
        href="#tab_15abAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
        onclick=""
      >
        <span class="fa fa-fw fa-link"></span>
        Re-Allocate
      </a>
    </li>
    <li class="">
      <a
        class="force_blue"
        href="#tab_1aAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
      >
        <span class="fa-class fa fa-thumbs-down"></span>
        Cancel
      </a>
    </li>
    <li class="">
      <a
        class="force_blue"
        href="#tab_2aAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
      >
        <span class="fa-class fa fa-calendar"></span>
        Schedule
      </a>
    </li>
    <li class="">
      <a
        class="force_blue"
        href="#tab_6aAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
      >
        <span class="fa-class fa fa-retweet"></span>
        Return
      </a>
    </li>

    <li class="">
      <a
        class="force_blue"
        href="#tab_7aAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
      >
        <span class="fa-class fa fa-paste"></span>
        Sms Link
      </a>
    </li>

    <li class="">
      <a
        class="force_blue"
        href="#tab_5aAC43F8829-12W"
        data-toggle="tab"
        aria-expanded="false"
      >
        <span class="fa-class fa fa-envelope"></span>
        Ticket
      </a>
    </li>

    <!------------- closed endpoints ----->
  </ul>
</template>
<script>
export default {
  name: 'TheButtonsComponent',
};
</script>
<style>
.nav-tabs > li {
  float: left;
  margin-bottom: -1px;
}
.nav > li {
  position: relative;
  display: block;
}
.fa-class {
  padding-right: 2px;
}
</style>
