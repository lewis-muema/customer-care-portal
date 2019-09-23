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

          <div class="modal-body">
            <span v-if="user !== ''">
              <TheUserPageComponent :user="user" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
<script>
export default {
  name: 'TheUserModalsComponent',
  components: {
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
    userComponent() {
      return `<${this.user} />`;
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
  top: -18px;
  right: -18px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 8040;
}
.modal-content {
  max-height: 30px;
  overflow-y: auto;
}
</style>
