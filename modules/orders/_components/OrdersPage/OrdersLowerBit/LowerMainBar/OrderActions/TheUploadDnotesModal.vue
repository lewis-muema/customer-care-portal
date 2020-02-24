<template>
  <div class="modal" tabindex="-1" role="dialog" :id="`${order}`">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"></h5>
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
          <div class="modalimages" :id="`${image}`">
            <img class="modalimages" :src="image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheUploadDnotesModal',
  props: ['image', 'order'],
};
</script>
<style scoped>
.modal-body {
  background: #ecf0f5;
}
.modal-dialog {
  max-width: 1000px !important;
}
.modalimages {
  max-width: 100%;
  max-height: 100%;
}
</style>
