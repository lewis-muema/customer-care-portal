<template>
  <div class="col-md-4">
    <div class="box box-primary user-side">
      <ul class="timeline timeline-inverse">
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"> </i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">SENDY{{ details.cop_id }}</h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ channel }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.cop_type_name }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.payment_option === 1 ? 'Prepay' : 'Postpay' }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-user bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              Contact Person - {{ details.cop_contact_person }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.cop_email }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-check bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.approved === 1 ? 'Approved' : 'Pending' }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.city_name }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.cop_address }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.country_name }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              {{ details.cop_category === 0 ? 'Merchant' : 'Enterprise' }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-user bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              Sales Ops Agent -
            </h3>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TheSideComponent',
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    channel() {
      return this.details.channel_name
        ? this.details.channel_name
        : 'Unspecified Channel name';
    },
  },
};
</script>
<style scoped>
.timeline-inverse {
  margin-top: 35px;
}
.user-side {
  padding-bottom: 1px;
  border-top: 3px solid #3c8dbc;
}
</style>
