<template>
  <span>
    <div id="usersModal" class="modal fade" role="dialog">
      <div class="modal-dialog user-modal">
        <div class="modal-content">
          <button
            type="button"
            class="close fancybox-item fancybox-close"
            data-dismiss="modal"
          >
            <i class="fa fa-times-circle" aria-hidden="true"></i>
          </button>

          <div class="modal-body" :class="setBackground()">
            <span v-if="getTokenExpiryStatus">
              <TheGlobalNotification />
            </span>
            <span v-else>
              <span v-if="user !== ''">
                <TheUserPageComponent :user="user" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import TheGlobalNotification from '@/components/UI/TheGlobalNotification';

export default {
  name: 'TheUserModalsComponent',
  components: {
    TheGlobalNotification,
    TheUserPageComponent: () =>
      import('~/modules/users/_components/TheUserPageComponent'),
  },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getTokenExpiryStatus', 'getUser']),
    userType() {
      const user = this.getUser === '' ? this.routeName : this.getUser;
      return user;
    },
    routeName() {
      return this.$route.name;
    },

    userComponent() {
      return `<${this.user} />`;
    },
  },
  methods: {
    setBackground() {
      if (this.userType === 'intercounty') {
        return 'interCountyBackground';
      }
      return '';
    },
  },
};
</script>
<style>
.modal-content {
  width: 1263px;
  position: relative;
  background: #f9f9f9;
  color: #444;
  text-shadow: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  padding: 16px;
  min-height: 675px;
}
.user-modal {
  width: 1263px;
  height: auto;
  position: fixed;
  top: 37px;
  left: 88px;
  opacity: 1;
  overflow: visible;
}
.modal-header {
  padding: 0;
}
.modal-body {
  background: #ecf0f5;
}
.fancybox-close {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 8040;
}
.modal-content {
  max-height: 30px;
  overflow-y: auto;
}
.interCountyBackground {
  background-color: rgba(245, 245, 245, 0.56) !important;
}
</style>
