<template>
  <div class="col-md-4">
    <div class="box box-primary user-side">
      <ul class="timeline timeline-inverse">
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"> </i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class"> Account </span>: SENDY{{
                details.cop_id
              }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Channel </span>: {{ channel }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Industry </span> :
              {{ details.cop_type_name }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class"> Payment Option</span> :
              {{ details.payment_option === '1' ? 'Prepay' : 'Postpay' }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-user bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class"> Contact Person </span> :
              {{ details.cop_contact_person }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Contact Email</span> :
              {{ details.cop_email }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-check bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Approval Status</span> :
              {{ details.approved === 1 ? 'Approved' : 'Pending' }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Address </span> :
              {{ details.cop_address }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class">Country </span> : {{ country }}
            </h3>
          </div>
        </li>
        <li>
          <i class="fa fa-get-pocket bg-green fasendy"></i>
          <div class="timeline-item">
            <h3 class="timeline-header no-border">
              <span class="cop-class"> Category</span> :
              {{ details.cop_category === 0 ? 'Merchant' : 'Enterprise' }}
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
    country() {
      let country = this.details.country_name;
      if (country === '' || country === 'undefined') {
        country = 'Unspecified';
      }
      return country;
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
.cop-class {
  color: #010910;
  font-weight: 600;
}
</style>
