<template>
  <span>
    <aside class="main-sidebar">
      <section class="sidebar">
        <div class="user-panel">
          <div class="pull-left image">
            <img
              :src="`https://care.sendyit.com/customer/include/team/${photo}`"
              class="img-circle"
              alt="User Image"
            />
          </div>
          <div class="pull-left info">
            <p>{{ name }}</p>

            <a id="online_1" href="#"
              ><i class="fa fa-circle text-success"></i> Online</a
            >

            <a id="offline_1" class="hidden" href="#"
              ><i class="fa fa-circle text-danger"></i> Offline</a
            >
          </div>
        </div>

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
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    photo() {
      return this.user.payload.data.pic;
    },
    name() {
      return this.user.payload.data.name;
    },
    post() {
      return this.user.payload.data.post;
    },
  },
  mounted() {
    // this.navigator_online();
    // console.log('hgfdsdfghjkjhg');
  },
  methods: {
    show_stat_as_online() {
      document.getElementById('offline_2').className = 'hidden';
      document.getElementById('offline_1').className = 'hidden';

      document.getElementById('online_2').className = '';
      document.getElementById('online_1').className = '';
    },

    show_stat_as_offline() {
      console_log('user is offline');

      document.getElementById('offline_2').className = '';
      document.getElementById('offline_1').className = '';

      document.getElementById('online_2').className = 'hidden';
      document.getElementById('online_1').className = 'hidden';
    },

    // navigator_online() {
    //   const old_status = document.getElementById('online_stat').value;
    //   console.log('websocket', websocket);
    //   // if (navigator.onLine) {
    //   if (websocket.connected === true) {
    //     // console_log('online');

    //     new_status = 'online';

    //     show_stat_as_online();
    //   } else {
    //     console_log('offline');

    //     // new_status = 'offline';

    //     show_stat_as_offline();
    //   }

    //   if (old_status === new_status) {
    //     console_log(' stayed the same');
    //   } else {
    //     console_log(' changed ');

    //     // ----------ion.sound.play("button_tiny");
    //   }

    //   document.getElementById('online_stat').value = new_status;
    // },
    showModal(modal) {
      $(`#usersModal`).modal('show');
    },
  },
};
</script>
