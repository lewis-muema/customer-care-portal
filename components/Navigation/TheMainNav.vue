<template>
  <nav class="navbar navbar-static-top">
    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
      <span class="sr-only">Toggle navigation</span>
    </a>
    <div class="navbar-custom-menu">
      <ul class="nav navbar-nav">
        <li class="dropdown user user-menu">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <img :src="`${photo}`" class="user-image" alt="User Image" />
            <span class="hidden-xs">{{ name }}</span>
          </a>
          <ul class="dropdown-menu">
            <li class="user-header">
              <img :src="`${photo}`" class="img-circle" alt="User Image" />

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
    ...mapActions(['logout']),
    async onLogout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
};
</script>
