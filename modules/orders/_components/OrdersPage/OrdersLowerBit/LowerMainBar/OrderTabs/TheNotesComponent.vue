<!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
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
    <div v-else>
      <div v-if="notesLog[0].msg === 'none' || notesLog[0].msg === 'NOTES: '">
        <div class="">
          <div class="route-header">
            Pickup instructions at {{ notesData()[0].name }}
          </div>
          <div v-if="checkPickUpNotes(notesData()[0])">
            <div v-if="displayNotes(notesData()[0])" class="notes-text">
              <div>
                {{ notesData()[0].msg }}
              </div>
            </div>

            <div
              v-if="notesData()[0].recipient_phone !== null"
              class="additional-instructions-content additional-instructions-wrapper"
            >
              <div class="additional-instructions__flex">
                <i
                  class=" el-icon-phone-outline additional-instructions__image recipient_contact-icon"
                />
              </div>
              <div class="additional-notes-outer">
                <div class="additional-notes-recipient">
                  {{ notesData()[0].recipient_phone }}
                </div>
              </div>
            </div>
          </div>
          <div class="" v-else>
            No notes provided.
          </div>
        </div>

        <div v-for="(val, index) in notesData()" v-if="index > 0" :key="index">
          <div class="route-header">
            Drop off instructions at {{ val.name }}
          </div>
          <div v-if="checkPickUpNotes(val)">
            <div v-if="displayNotes(val)" class="notes-text">
              <div>
                {{ val.msg }}
              </div>
            </div>

            <div
              v-if="val.recipient_phone !== null"
              class="additional-instructions-content additional-instructions-wrapper"
            >
              <div class="additional-instructions__flex">
                <i
                  class=" el-icon-phone-outline additional-instructions__image recipient_contact-icon"
                />
              </div>
              <div class="additional-notes-outer">
                <div class="additional-notes-recipient">
                  {{ val.recipient_phone }}
                </div>
              </div>
            </div>
          </div>
          <div class="" v-else>
            No notes provided.
          </div>
        </div>
      </div>
      <div v-else>
        {{ notesLog[0].msg }}
      </div>
    </div>
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
  mounted() {},
  methods: {
    notesData() {
      return this.notesLog.slice(1);
    },
    checkPickUpNotes(val) {
      let resp = true;
      if (
        val.recipient_phone === null &&
        (Object.prototype.hasOwnProperty.call(val, 'msg') === false ||
          val.msg === null)
      ) {
        resp = false;
      }
      return resp;
    },
    displayNotes(val) {
      const resp = true;
      if (
        val.msg === null ||
        Object.prototype.hasOwnProperty.call(val, 'msg') === false
      ) {
        return false;
      }
      return resp;
    },
  },
};
</script>
<style media="screen">
.additional-instructions__flex {
  flex-basis: 4%;
}
.additional-instructions__image {
  height: 30px;
  min-width: 30px;
}
.recipient_contact-icon {
  font-size: 23px;
}
.additional-notes-outer {
  flex-direction: column;
  flex: 1;
}
.additional-notes-recipient {
  padding: 3px;
}
.additional-instructions-wrapper {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-basis: 43%;
}
.additional-instructions-content {
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin-top: 1%;
}
.notes-text {
  margin-top: 1%;
}
.route-header {
  color: #000;
  font-size: 13px;
}
</style>
