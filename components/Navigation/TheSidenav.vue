<template>
  <span>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
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
            <a
              class="fancybox fancybox.iframe fancyboxy"
              @click="showModal('biz')"
              ><i class="fa fa-users"></i> <span> Biz </span>
            </a>
          </li>

          <li id="offline_2" class="hidden">
            <a href="#"
              ><i class="fa fa-circle-o text-red"></i> <span>Offline</span></a
            >
          </li>

          <li id="online_2">
            <a href="#"
              ><i class="fa fa-circle-o text-success"></i>
              <span>Online</span></a
            >
          </li>
        </ul>
      </section>
      <!-- /.sidebar -->
      <input type="hidden" value="online" id="online_stat" />
    </aside>
    <!-- Modal -->
    <div id="usersModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <p>Some text in the modal.</p>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
<script>
export default {
  name: 'TheSidenav',
  data() {
    return {
      user: null,
    };
  },
  methods: {
    showModal(modal) {
      $(`#usersModal`).modal('show');
    },
  },
};
</script>
