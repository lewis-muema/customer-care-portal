<template>
  <div class="modal" tabindex="-1" role="dialog" id="actionModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header view-modal-header">
          <h5 class="modal-title">
            {{ title }}
            <button
              type="button"
              class="close pull-right"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h5>
        </div>
        <div class="modal-body">
          <AssignOrder
            :action="action"
            :alert="alert"
            @cancelEvent="handleCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'ActionsModal',
  components: {
    AssignOrder: () => import('./assignOrder'),
  },
  props: ['alert', 'orderNo', 'action'],
  computed: {
    ...mapState(['userData']),
    ...mapGetters(['getLiveOpsRefresh']),
    title() {
      let titleString = '';
      switch (this.action) {
        case 'resolve':
          titleString = `Resolved Order ${this.orderNo}`;
          break;
        case 'assign':
          titleString = `Assign Order ${this.orderNo}`;
          break;
        case 'reassign':
          titleString = `ReAssign Order ${this.orderNo}`;
          break;

        default:
          break;
      }
      return titleString;
    },
  },
  methods: {
    handleCancel(cancelEvent) {
      this.$emit('cancelEvent', cancelEvent);
    },
  },
};
</script>

<style>
.modal-dialog {
  max-width: 500px !important;
}
.modal-content,
.modal-body {
  background: #ffffff;
  min-height: auto;
}
.modal-header {
  border-bottom: none;
  padding: 1rem;
}
.modal-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 140%;
  letter-spacing: 0.02em;
  color: #606266;
}
.modal-header .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
}
.alert-msg {
  font-size: 16px;
  letter-spacing: 0.02em;
  border-radius: 4px;
}
.resolve-alert {
  background: #e0f3dd !important;
  border-color: #e0f3dd;

  color: #269e16 !important;
}
.error-alert {
  color: #b71f25;
  background: #e8a7aa73;
}
.cancel-button {
  width: auto;
  margin-right: 16px;
}
.submit-btn {
  background: #527cbd;
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
}
</style>
