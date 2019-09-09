<template>
  <div class="post">
    <div class="user-block">
      <img
        class="img-circle img-bordered-sm"
        src="https://caretest.sendyit.com/customer/include/dist/img/user1-128x128.jpg"
        alt="user image"
      />
      <span class="username">
        <a href="#"> {{ this.client }}</a>
        <a href="#" class="pull-right btn-box-tool"
          ><i class="fa fa-times"></i
        ></a>
      </span>
      <span class="description"> </span>
    </div>
    <p v-if="!notesLog.length">No notes found</p>
    <p v-for="note in notesLog" :key="note.index">{{ note.msg }}</p>
  </div>
</template>
<script>
export default {
  name: 'TheNotesComponent',
  props: {
    orderdetails: {
      type: Array,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      notesLog: this.orderdetails,
    };
  },
  mounted() {},
};
</script>
