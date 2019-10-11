<template>
  <div>
    <div
      class="active tab-pane"
      id="info<?php echo $unique_rider_id;?>"
      style="color:#333;"
    >
      <!-- start body box-->
      <div class="body-box">
        <table class="table table-bordered">
          <tr>
            <td width="50%">Email</td>
            <td>{{ user.payments.email }}</td>
          </tr>
          <tr>
            <td width="50%">City</td>
            <td>{{ user.payments.city_name }}</td>
          </tr>
          <tr>
            <td width="50%">Carrier</td>
            <td>{{ determine_carrier_type() }}</td>
          </tr>
          <!-- <tr v-if="user.payments.vendor_type=== 20 || === 25">
            <td width="50%">Truck Size</td>
            <td><?php echo $more_data['truck_size'];?></td>
          </tr>
          <tr>
            <td width="50%">Truck Capacity</td>
            <td><?php echo $more_data['load_capacity'];?></td>
          </tr>
          <?php
                                    }
                                ?> -->

          <tr>
            <td width="50%">Tracking Mode</td>
            <td>{{ user.payments.tracker }}</td>
          </tr>

          <tr>
            <td width="50%">Allocation</td>
            <td>{{ determine_allocation() }}</td>
          </tr>
        </table>
      </div>
      <!-- end of box-body -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  methods: {
    determine_carrier_type() {
      if (this.user.payments.carrier_type === 1) {
        return 'Box';
      }
    },

    determine_allocation() {
      if (this.user.payments.exclusivity_status === 0) {
        return 'Open';
      }
      return 'Exculsive';
    },
  },
};
</script>
