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
          <li class="header">Fulfilment</li>
          <li class="treeview >">
            <nuxt-link to="/orders"
              ><i class="fa fa-shopping-cart"></i>
              <span> Transport Orders</span></nuxt-link
            >
          </li>
          <li class="treeview">
            <a
              class="fancybox fancybox.iframe fancyboxy fulfilment-cursor"
              @click="showFulfilment"
            >
              <img src="../../assets/images/fulfilment.png" alt="" />
              <span class="fulfilment-nav">
                Fulfilment
                <font-awesome-icon
                  class="chevron-icon-position"
                  icon="chevron-down"
                  :class="revertFulfilmentIcon"
                  width="15px"
              /></span>
            </a>
          </li>

          <li class="treeview >" v-show="fulfilment_view">
            <nuxt-link to="/fulfilment/inbound"
              ><img src="../../assets/images/fulfilment.png" alt="" />
              <span class="fulfilment-nav">
                Inbound
              </span></nuxt-link
            >
          </li>
          <li class="treeview >" v-show="fulfilment_view">
            <nuxt-link to="/fulfilment/outbound"
              ><img src="../../assets/images/fulfilment.png" alt="" />
              <span class="fulfilment-nav">
                Outbound
              </span></nuxt-link
            >
          </li>
          <li class="treeview">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/riders"
              @click="showModal('riders', $event)"
              ><i class="fa fa-motorcycle"></i> <span> Riders </span>
            </a>
          </li>
          <li class="treeview">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/peer"
              @click="showModal('peer', $event)"
              ><i class="fa fa-user"></i> <span> Peer </span>
            </a>
          </li>

          <li class="treeview">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/biz"
              @click="showModal('biz', $event)"
              ><i class="fa fa-users"></i> <span> Biz </span>
            </a>
          </li>

          <li class="treeview" v-if="permissions.auto_rewards">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/rewards"
              @click="showModal('rewards', $event)"
              ><i class="fa fa-tasks"></i>
              <span> Auto Rewards and Penalties </span>
            </a>
          </li>

          <li class="treeview" v-if="permissions.create_orders">
            <nuxt-link to="/offlineOrders"
              ><i class="fa fa-plus-circle"></i>
              <span> Create Order </span></nuxt-link
            >
          </li>
          <li class="treeview >">
            <nuxt-link to="/nps/dashboard"
              ><i class="fa fa-bars"></i> <span> Nps </span></nuxt-link
            >
          </li>
          <li class="treeview" v-if="permissions.approve_permit_refund">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/refund"
              @click="showModal('refund', $event)"
              ><i class="fa fa-handshake-o"></i>
              <span> Permit Refund </span>
            </a>
          </li>
          <li class="treeview" v-if="permissions.intercounty_price_config">
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/intercounty"
              @click="showModal('intercounty', $event)"
              ><i class="fa fa-cogs"></i>
              <span> Intercounty Configuration </span>
            </a>
          </li>
          <li class="treeview" v-if="permissions.approve_social_media_biz">
            >
            <a
              class="fancybox fancybox.iframe fancyboxy"
              href="/socialMediaBusiness"
              @click="showModal('socialMediaBusiness', $event)"
              ><i class="fa fa-instagram"></i>
              <span> Social Media Biz Approval</span>
            </a>
          </li>

          <li id="offline_2" class="hidden">
            <a href="#"
              ><i class="fa fa-circle-o text-red"></i> <span>Offline</span></a
            >
          </li>
          <li class="treeview" v-if="permissions.auxilliary_services">
            <nuxt-link to="/auxilliary"
              ><i class="fa fa-money text-grey"></i>
              <span> Auxiliary services </span></nuxt-link
            >
          </li>
          <li class="treeview" v-if="permissions.view_promocodes">
            <nuxt-link to="/promocodes"
              ><i class="fa fa-tags text-grey"></i>
              <span> Promo Codes </span></nuxt-link
            >
          </li>
          <li class="treeview" v-if="permissions.view_live_operations">
            <nuxt-link to="/liveOperations"
              ><i class="fa fa-wifi text-grey"></i>
              <span> Live Operations </span></nuxt-link
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
import { mapMutations, mapGetters } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronDown);

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
      fulfilment_view: false,
    };
  },
  computed: {
    ...mapGetters(['getSession']),

    photo() {
      console.log('user', this.user.payload);
      const image = this.user.payload.data.pic;
      return `${this.userImage}${image}`;
    },
    name() {
      return this.user.payload.data.name;
    },
    post() {
      return this.user.payload.data.post;
    },
    permissions() {
      return JSON.parse(this.user.payload.data.privilege);
    },
    revertFulfilmentIcon() {
      return {
        'rotate-transform': true,
        rotate: this.fulfilment_view,
      };
    },
  },
  methods: {
    ...mapMutations({
      updateUser: 'setSearchedUser',
    }),
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
    showModal(user, e) {
      this.modalUser = user;
      this.updateUser(user);
      $(`#usersModal`).modal('show');
      e.preventDefault();
    },
    showFulfilment() {
      this.fulfilment_view = !this.fulfilment_view;
    },
  },
};
</script>
<style scoped>
.fulfilment-nav {
  margin-left: 5%;
}
.chevron-icon-position {
  margin-left: 25%;
}
.fulfilment-cursor {
  cursor: pointer;
}
</style>
