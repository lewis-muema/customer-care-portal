<template>
  <tr
    order_id="AC2728669-I1C"
    data-order_no="AC2728669-I1C"
    data-order_status="0"
    data-confirm_status="0"
    data-delivery_status="0"
    data-pick_up_time="2019-07-16 17:55:09"
    data-estimated_pickup_duration="25"
    data-pickup_delay="-25"
    data-estimated_delivery_duration="5"
    data-delivery_delay="-5"
    data-confirm_time="undefined"
    data-picked_time="undefined"
    class="order_row_home new_row_here  nairobi  "
    id="main_row_AC2728669-I1C"
    onmouseover=""
    onmouseout=""
    style="font-size: 13px;"
    @click="load_lower_bit"
  >
    <td>
      <div class="min_checky"></div>
      <span id="tip_order_AC2728669-I1C" data-toggle="tooltip" title=""
        ><span
          id="order_indicator_AC2728669-I1C"
          class="label"
          style="background-color:purple;"
        >
          Cancelled
        </span></span
      >
    </td>
    <td>chris</td>
    <td>
      Sendy Driver
      <span style="float:right;">
        &nbsp;<img
          style=" margin-top: 3px;float: right; image-rendering: auto;"
          src="https://caretest.sendyit.com/customer/include/img/vendor/1.png"
          height="14"
          alt=""
      /></span>
    </td>
    <td>05.55 pm 16/07/2019 &nbsp;&nbsp;&nbsp;</td>
    <td>Marsabit Plaza</td>
    <td>Green House Mall</td>
    <td>KES 340</td>
    <td>
      KES 250
      <span title="Nairobi" class="badge bg-aqua " style="float: right;"
        >nbi</span
      >
      <span style="float: right;"> &nbsp; </span>
      <span title="Corporate Name" class="badge bg-aqua pull-right"> 2 km</span>
    </td>
  </tr>
</template>
<script>
export default {
  name: 'TheMainRowComponent',

  methods: {
    load_lower_bit() {
      console.log('joyce');
    },
  },
};
</script>
