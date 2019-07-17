<template>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar" style=" position:fixed;">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img
            src="https://care.sendyit.com/customer/include/team/eggy.png"
            class="img-circle"
            alt="User Image"
          />
        </div>
        <div class="pull-left info">
          <p>Joyce Kemboi</p>

          <a id="online_1" href="#"
            ><i class="fa fa-circle text-success"></i> Online</a
          >

          <a id="offline_1" class="hidden" href="#"
            ><i class="fa fa-circle text-danger"></i> Offline</a
          >
        </div>
      </div>

      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu">
        <li class="header">MAIN NAVIGATION</li>
        <li class="treeview >">
          <nuxt-link to="/orders"
            ><i class="fa fa-shopping-cart"></i>
            <span> Ongoing </span></nuxt-link
          >
          <!-- <a href="#">
            <i class="fa fa-shopping-cart"></i> <span> Ongoing </span>
          </a> -->
        </li>

        <li class="treeview">
          <nuxt-link to="/disputed"
            ><i class="fa fa-stethoscope"></i>
            <span> Disputed </span></nuxt-link
          >
        </li>

        <li class="treeview">
          <nuxt-link class="fancybox fancybox.iframe fancyboxy" to="/riders"
            ><i class="fa fa-motorcycle"></i> <span> Riders </span></nuxt-link
          >
        </li>

        <li class="treeview">
          <nuxt-link class="fancybox fancybox.iframe fancyboxy" to="/peer"
            ><i class="fa fa-user"></i> <span> Peer </span></nuxt-link
          >
        </li>

        <li class="treeview">
          <nuxt-link class="fancybox fancybox.iframe fancyboxy" to="/biz"
            ><i class="fa fa-users"></i> <span> Biz </span></nuxt-link
          >
        </li>

        <li id="offline_2" class="hidden">
          <a href="#"
            ><i class="fa fa-circle-o text-red"></i> <span>Offline</span></a
          >
        </li>

        <li id="online_2">
          <a href="#"
            ><i class="fa fa-circle-o text-success"></i> <span>Online</span></a
          >
        </li>
      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>

  <!-- <input type="hidden" value="online" id="online_stat" /> -->
</template>
<script>
export default {
  name: 'TheSidenav',

  computed: {
    toggleSidebar() {
      return this.$store.getters.toggleSidebar;
    },
  },
};
</script>
