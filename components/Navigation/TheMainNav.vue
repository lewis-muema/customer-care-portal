<template>
  <nav class="navbar navbar-static-top">
    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
      <span class="sr-only">Toggle navigation</span>
    </a>
    <div class="navbar-custom-menu">
      <ul class="nav navbar-nav">
        <li
          class="dropdown notifications-menu "
          id="notifivarion_major_contaianber"
        >
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <i class="fa fa-bell-o"></i>
            <span class="label label-warning" id="notification_number"></span>
          </a>

          <ul class="dropdown-menu">
            <li class="header" id="notification_number_2"></li>

            <li style="">
              <ul class="menu" style="" id="notification_container">
                <li>fgrfvgdf</li>
              </ul>
            </li>
            <li class="footer">
              <a onclick="clear_all_notes();" href="#">Clear all</a>
            </li>
          </ul>
        </li>

        <li class="dropdown user user-menu">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <img
              :src="`https://care.sendyit.com/customer/include/team/${photo}`"
              class="user-image"
              alt="User Image"
            />
            <span class="hidden-xs">{{ name }}</span>
          </a>
          <ul class="dropdown-menu">
            <li class="user-header">
              <img
                :src="`https://care.sendyit.com/customer/include/team/${photo}`"
                class="img-circle"
                alt="User Image"
              />

              <p>
                {{ name }} - {{ post }}
                <small>Lets Deliver</small>
              </p>
            </li>

            <li class="user-footer">
              <div class="pull-right">
                <a class="btn btn-default btn-flat" @click="onLogout"
                  >Sign out</a
                >
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TheMainNav',
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
  methods: {
    ...mapActions(['logout']),
    onLogout() {
      this.logout();
      this.$router.push('/login');
    },
  },
};
</script>
