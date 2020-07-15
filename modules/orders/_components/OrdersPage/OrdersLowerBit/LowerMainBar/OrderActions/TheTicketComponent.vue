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
      const userName = this.order.client_details.name;
      const length = 39;
      const trimmedName = userName.substring(0, length);
      const email =
        this.order.client_details.email !== null
          ? this.order.client_details.email
          : 'customersupport@sendyit.com';

      const data = {
        id: this.order.order_details.order_no,
        title: this.order.order_details.order_no,
        customer: {
          firstName: trimmedName,
          lastName: '.',
          email: email.trim(),
          phone: this.order.client_details.phone_no,
        },
      };
      return data;
    },
  },
};
</script>
