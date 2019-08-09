<template>
  <div class="box box-info">
    <div class="box-body">
      <hr />
      <section class="section">
        <div id="app">
          <ul>
            <div
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="limit"
            >
              <li
                v-for="post in posts"
                style="margin-bottom: 2rem;"
                data-aos="slide-up"
                data-aos-offset="100"
                data-aos-easing="ease-out-back"
                :key="post.id"
              >
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      {{ post.title }}
                    </p>
                  </header>
                  <div class="card-content">
                    <div class="content">
                      <p>{{ post.body }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// import AOS from 'aos';
// import 'aos/dist/aos.css';

export default {
  name: 'Home',
  data() {
    return {
      posts: [],
      limit: 10,
      busy: false,
    };
  },
  computed: {
    ...mapGetters(['getOrders']),
    autoLoadDisabled() {
      return this.loading || this.commentsData.length === 0;
    },
  },
  watch: {
    getOrders(ordersData) {
      const newOrders = this.orders.concat(ordersData.data);
      console.log('edcvgyedcghdec', newOrders);
      return (this.orders = ordersData);
    },
  },
  created() {
    this.loadMore();
    // AOS.init();
  },
  mounted() {
    // this.setOrders({
    //   page: 1,
    //   //   params: {
    //   //     status: 'all',
    //   //     request_id: 11,
    //   //   },
    // });

    console.log('data', this.todos);
  },
  methods: {
    ...mapActions(['setOrders']),
    // initialOrderRequest() {
    //   this.setOrders();
    // },
    loadMore() {
      console.log('Adding 10 more data results');
      this.busy = true;
      const orders = axios
        .get('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
          const append = response.data.slice(
            this.posts.length,
            this.posts.length + this.limit,
          );
          console.log('llll', append);
          console.log('ppp', this.posts);

          this.posts = this.posts.concat(append);
          this.busy = false;
        });
    },
  },
};
</script>
