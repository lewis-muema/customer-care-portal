<template>
  <TheTicketForm :order="order" :category="category" :ticket="ticketData" />
</template>
<script>
import TheTicketForm from '~/components/UI/TheTicketComponent';

export default {
  name: 'TheTicketComponent',
  components: {
    TheTicketForm,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      category: 'order',
    };
  },
  computed: {
    ticketData() {
      const userName = this.order.client_details.name.split(' ');

      const data = {
        id: this.order.order_details.order_no,
        title: this.order.order_details.order_no,
        customer: {
          firstName: userName[0],
          lastName: userName.length > 1 ? userName[1] : '. ',
          email: this.order.client_details.email,
          phone: this.order.client_details.phone_no,
        },
      };
      return data;
    },
  },
};
</script>
