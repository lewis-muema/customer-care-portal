<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="ml-3">
        <div class="mb-2">
          <img src="../../assets/images/success.svg" />
          <!-- <i class="fa fa-check-circle fa-2x submit-success"></i> -->
        </div>
        <span class="title">Ticket Created</span>
        <div class="mt-2 sub-text">
          Your freshdesk {{ ticketSource }} has been <br />
          created successfully. <br />
        </div>
        <span slot="footer" class="dialog-footer">
          <hr />
          <el-button type="primary" class="primary-blue" @click="handleClose">
            Close
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'TicketSubmitModal',
  props: ['dialogVisible', 'ticketSource'],
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      updateSuccess: 'setUserActionSuccess',
    }),
    handleClose() {
      this.updateSuccess(true);
      this.$emit('close', false);
    },
  },
};
</script>
<style scoped>
.sub-text {
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  color: #000000;
}
.title {
  position: static;
  font-weight: 600;
  font-size: 21px;
  color: #303133;
}
.primary-blue {
  width: 100%;
  color: white;
  background: #324ba8;
}
.submit-success {
  color: #00ae55;
}
</style>
