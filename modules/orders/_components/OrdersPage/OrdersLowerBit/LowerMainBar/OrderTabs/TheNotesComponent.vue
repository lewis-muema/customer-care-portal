<template>
  <div class="post">
    <input id="pac-input" type="text" placeholder="Enter a location" />
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
    order: {
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
      notesLog: this.order,
    };
  },
  mounted() {
    if (process.client) {
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-1.299923, 36.780921),
        new google.maps.LatLng(-1.319923, 36.800921),
      );
      const gInput = document.getElementById('pac-input');
      const options = {
        bounds: defaultBounds,
        types: ['geocode'],
      };
      this.autocomplete = new google.maps.places.Autocomplete(gInput, options);
    } else {
      console.log('working on server');
    }
  },
};
</script>
