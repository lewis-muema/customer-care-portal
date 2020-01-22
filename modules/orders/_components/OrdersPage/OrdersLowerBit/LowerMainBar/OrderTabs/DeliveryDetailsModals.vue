<template>
  <div>
    <div
      class="modal fade"
      id="ModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalLongTitle">
              Delivery Notes
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="modalimages">
              <img
                class="modalimages"
                :src="
                  `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${image}`
                "
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'DeliveryDetailsModals',
  props: {
    image: {
      type: String,
      required: true,
    },
  },
};
</script>
<style>
.delivery-images {
  width: 100%;
}
.signatures {
  max-width: 300px;
}
.modalimages {
  max-width: 100%;
  max-height: 100%;
}
.signature {
  display: block;
  font-weight: bold;
}
.images {
  grid-column: span 3;
  width: 100%;
}
.images-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
.modal-dialog {
  max-width: 1000px !important;
}
</style>
