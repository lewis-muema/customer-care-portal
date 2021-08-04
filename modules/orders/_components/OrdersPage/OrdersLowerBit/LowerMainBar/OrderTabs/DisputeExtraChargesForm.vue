<template>
  <section>
    <!--    TODO remove this warning-->
    <el-alert
      title="This feature is not ready for use yet!"
      type="warning"
      effect="dark"
    >
    </el-alert>

    <form id="dispute-form" @submit.prevent="submitDisputeDialog">
      <div class="form-group">
        <v-select
          :options="disputes"
          :reduce="name => name.id"
          chips
          name="reason"
          label="reason"
          placeholder="Select dispute type"
          class="form-control proximity-point"
          :id="`name`"
          v-model="dispute_type"
        >
        </v-select>
        <div v-if="submitted && !$v.dispute_type.required" class="is-invalid">
          Dispute type has to be selected
        </div>
      </div>

      <textarea
        type="text"
        v-model="dispute_description"
        name="description"
        placeholder="Description"
        class="form-control"
      >
      </textarea>
      <div
        v-if="submitted && !$v.dispute_description.required"
        class="is-invalid"
      >
        Dispute description is required
      </div>

      <!--    TODO enable button-->
      <div slot="footer" class="dialog-footer">
        <button class="btn btn-primary action-button" disabled>
          Submit
        </button>
      </div>
    </form>

    <div class="info" v-if="submitted && !error">
      <i class="fa fa-spinner fa-spin loader invoice-loader--align"></i>
      Dispute being submitted...
    </div>

    <el-alert
      v-if="error"
      title="An error has occurred! Please try again."
      type="error"
      effect="dark"
    >
    </el-alert>
  </section>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'DisputeExtraChargesForm',
  props: {
    disputeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      disputes: [
        { id: '1', reason: 'Waiting time' },
        { id: '2', reason: 'Extra distance' },
      ],
      dispute_type: null,
      dispute_reason_id: null,
      dispute_description: '',
      submitted: false,
      error: false,
    };
  },
  validations: {
    dispute_type: { required },
    dispute_description: { required },
  },
  methods: {
    closeDisputeDialog() {
      this.$emit('closeDisputeDialog', false);
    },
    async submitDisputeDialog() {
      this.error = false;
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const payload = {
        dispute_type: parseInt(this.dispute_type),
        dispute_reason_id: parseInt(this.dispute_type),
        dispute_description: this.dispute_description,
        ...this.disputeData,
      };
      const results = await this.$store.dispatch(
        'orders/create_charges_dispute',
        payload,
      );

      if (results.status) return this.closeDisputeDialog();
      if (!results.status) this.error = true;
    },
  },
};
</script>

<style scoped>
.el-alert {
  margin-top: 15px;
}
.is-invalid {
  color: red;
  height: auto;
  margin-bottom: 5px;
}
button {
  margin-top: 20px;
}
.info {
  color: #a9aaaf;
  display: flex;
  margin: 10px 0;
  align-items: center;
  padding: 7px;
  border: solid 1px grey;
  border-radius: 5px;
  background-color: #f4f4f5;
}
.info i {
  margin-right: 5px;
}
</style>
