<template>
  <span>
    <aside class="main-sidebar">
      <section class="sidebar">
        <div class="user-panel">
          <div class="pull-left image">
            <img :src="`${photo}`" class="img-circle" alt="User Image" />
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
            <a
              class="fancybox fancybox.iframe fancyboxy"
              @click="showModal('riders')"
              ><i class="fa fa-motorcycle"></i> <span> Riders </span>
            </a>
          </li>
          <li class="treeview">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              @click="showModal('peer')"
              ><i class="fa fa-user"></i> <span> Peer </span>
            </a>
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
      <input type="hidden" value="online" id="online_stat" />
    </aside>
    <modals :user="modalUser" />
  </span>
</template>
<script>
export default {
  name: 'TheSidenav',
  components: {
    modals: () => import('~/modules/users/_components/TheUserModalsComponent'),
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modalUser: '',
    };
  },
  computed: {
    photo() {
      const image = this.user.payload.data.pic;
      return `${this.userImage}${image}`;
    },
    name() {
      return this.user.payload.data.name;
    },
    post() {
      return this.user.payload.data.post;
    },
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

    showModal(user) {
      this.modalUser = user;
      $(`#usersModal`).modal('show');
    },
  },
};
</script>
