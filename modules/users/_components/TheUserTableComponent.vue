<template>
  <section class="content">
    <div class="row">
      <div class="box">
        <div class="box-body" :key="searchKey">
          {{ getUser }}

          <div v-if="getUser === 'biz'">
            <TheBizTable />
          </div>
          <div v-if="getUser === 'peer'">
            <ThePeerTable />
          </div>
          <div v-if="getUser === 'riders'">
            <TheRiderTable />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheUserTableComponent',
  components: {
    TheBizTable: () => import('~/modules/biz/_components/TheBizTable'),
    TheRiderTable: () => import('~/modules/riders/_components/TheRiderTable'),
    ThePeerTable: () => import('~/modules/peer/_components/ThePeerTable'),
  },
  data() {
    return {
      searchedUser: null,
      searchKey: 0,
    };
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  watch: {
    getUser(user) {
      this.forceRerender();

      return (this.searchedUser = user);
    },
  },
  methods: {
    forceRerender() {
      this.searchKey += 1;
    },
  },
};
</script>
