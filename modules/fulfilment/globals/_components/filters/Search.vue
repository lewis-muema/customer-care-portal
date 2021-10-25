<template>
  <div>
    <el-input
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      autocomplete="off"
      v-model="query"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @input="update"
      @click="clear"
      @blur="reset"
      class="search-filter"
    >
    </el-input>
    <i class="fa fa-spinner fa-spin" v-if="loading"></i>

    <ul v-show="hasItems" :class="[!isActive ? 'inactiveClass' : '']">
      <li
        v-for="(item, $item) in items"
        :class="activeClass($item)"
        @mousedown="hit"
        @mousemove="setActive($item)"
        :key="item.index"
      >
        <span>
          <strong v-if="item.order_id">{{ item.order_id }}</strong>
          <strong v-if="item.consolidatedBatchId">{{
            item.consolidatedBatchId
          }}</strong>
        </span>
        <span v-if="item.business_name"
          ><b>Business Name:</b> {{ item.business_name }}</span
        >
        <span v-if="item.recipient_name"
          ><b>Recipient Name:</b> {{ item.recipient_name }}</span
        >
        <span v-if="item.hub_name"><b>Hub:</b> {{ item.hub_name }}</span>

        <span v-if="item.direction">{{ item.direction }}</span>
        <span v-if="item.agentName"><b>Rider:</b> {{ item.agentName }}</span>
        <span v-if="item.status" :class="statusColor(item.status).activeClass">
          <strong>{{ statusColor(item.status).statusText }}</strong></span
        >
        <span v-if="item.scheduledDate"
          >Date: {{ getFormattedDate(item.scheduledDate, 'LLLL') }}</span
        >
        <span v-if="item.destination"
          ><b>Destination:</b> {{ item.destination }}</span
        >
      </li>
    </ul>
    <ul
      v-show="!hasItems && query !== ''"
      :class="[!isActive ? 'inactiveClass' : '']"
    >
      <li class="my-3">
        No results Found
      </li>
    </ul>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'Search',
  extends: VueTypeahead,
  mixins: [NotificationMxn],
  props: ['page', 'placeholder', 'section'],
  data() {
    return {
      limit: 5,
      minChars: 1,
      query: '',
      order: null,
      isActive: true,
      errors: [],
      orderTableMetrics: {
        endpoint: 'missioncontrol/orders',
        id: 'order_id',
      },
      batchTableMetrics: {
        endpoint: 'missioncontrol/batches',
        id: 'batch_id',
      },
    };
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters({
      getStatusMapping: 'fulfilment/getStatusMapping',
      getSession: 'getSession',
      getEnvironmentVariables: 'getEnvironmentVariables',
    }),
    query_string() {
      localStorage.setItem('query', this.query);
      return this.query.trim();
    },
    solarBase() {
      const solr = {
        orders: 'FULFILMENT_ORDERS',
        batches: 'FULFILMENT_BATCHES',
      };
      const search = solr[this.section];
      return this.config[search];
    },
    solarToken() {
      return this.getEnvironmentVariables.SOLR_JWT;
    },
    srcPath() {
      const orderSearch = `select?q=(order_id:"${this.query_string}"OR+status:"${this.query_string}"OR+business_name:"${this.query_string}"OR+destination:"${this.query_string}"OR+agentName:"${this.query_string}"OR+hub_name:"${this.query_string}"OR+recipient_name:"${this.query_string}")&wt=json&indent=true&row=10&sort=order_id%20desc`;

      const batchSearch = `select?q=(consolidatedBatchId:*${this.query_string}*+OR+agentName:*${this.query_string}*+OR+direction:*${this.query_string}*OR+status:*${this.query_string}*)&wt=json&indent=true&row=10&sort=consolidatedBatchId%20desc`;

      const data = {
        orders: orderSearch,
        batches: batchSearch,
      };

      return data;
    },
    src() {
      // eslint-disable-next-line prettier/prettier
      return `${this.solarBase}${this.srcPath[this.section]}&jwt=${this.solarToken}`;
    },
    tableMetrics() {
      return this.section === 'orders'
        ? this.orderTableMetrics
        : this.batchTableMetrics;
    },
    identifier() {
      const data = {
        orders: 'order_id',
        batches: 'consolidatedBatchId',
      };
      return data;
    },
    userCountries() {
      const countryCodeArray = this.getSession.payload.data.country_codes;
      return JSON.parse(countryCodeArray.toLowerCase());
    },
  },
  async mounted() {
    await this.setOrderStatuses();
  },
  methods: {
    ...mapMutations({
      updateSearchedEntity: 'fulfilment/setSearchedEntity',
      updateSearchState: 'fulfilment/setSearchState',
      isSearching: 'fulfilment/setSearchingStatus',
      updateTableData: 'fulfilment/setTableData',
      updateProcessingStatus: 'fulfilment/setProcessingStatus',
    }),
    ...mapActions({
      setOrderStatuses: 'fulfilment/mapOrderStatus',
      request_single_order: 'request_single_order',
      fetchSingleOrder: 'fulfilment/fetchSingleOrder',
      fetch_table_details: 'fulfilment/fetch_table_details',
    }),
    async onHit(item) {
      this.isActive = false;
      this.updateSearchState(true);
      this.isSearching(true);
      const orderNo = item.order_no;
      const identifier = this.identifier[this.section];

      const entityID = item[identifier];
      this.$emit('orderDetails', item);

      await this.processOrderDetails(entityID);
    },
    async processOrderDetails(entityID) {
      const payload = {
        app: 'FULFILMENT_SERVICE',
        endpoint: this.tableMetrics.endpoint,
        apiKey: false,
        params: {
          data_id: entityID,
        },
      };
      const arr = [];
      try {
        const data = await this.fetch_table_details(payload);

        if (data.status === 200) {
          const details =
            this.section === 'batches'
              ? data.data.data.batch
              : data.data.data.order;

          if (this.section === 'orders') {
            const r = {
              order_id: details.order_id,
              created_date: details.created_date,
              order_status: details.order_status,
              order_recipient_name: details.destination.name,
              ordered_items_count: details.order_items.items.length,
              scheduled_date: details.scheduled_date,
              completed_date: details.completed_date,
              consolidated: details.consolidated,
              business_name: details.business.business_name,
              most_recent_batch_id: details.batches[0].batch_id,
              destination_region: null,
              // eslint-disable-next-line prettier/prettier
              destination_description: details.destination.delivery_location.description,
              // eslint-disable-next-line prettier/prettier
              shipping_agent_name: details.batches[0].assigned_shipping_agent.agent_name,
              // eslint-disable-next-line prettier/prettier
              shipping_agent_vehicle_type: details.batches[0].assigned_shipping_agent.vehicle_type,
            };
            arr.push(r);
            this.updateTableData(arr);
            // this.updateProcessingStatus(true);
            this.updateSearchedEntity(r);
            this.isSearching(false);
            // this.updateSearchState(false);
          } else {
            const r = {
              batch_id: details.batch_id,
              batch_status: details.batch_status,
              created_date: details.created_date,
              scheduled_date: details.scheduled_date,
              hub_name: details.hub.hub_name,
              direction: details.direction,
              shipping_agent_name: details.assigned_shipping_agent.agent_name,
              // eslint-disable-next-line prettier/prettier
              shipping_agent_vehicle_type: details.assigned_shipping_agent.vehicle_type,
              order_count: details.orders.length,
            };
            arr.push(r);

            this.updateTableData(arr);
            this.updateSearchedEntity(r);
            this.isSearching(false);
          }
        } else {
          let error_response = '';
          if (Object.prototype.hasOwnProperty.call(data.data, 'errors')) {
            error_response = data.data.errors;
          } else {
            error_response = data.data.message;
          }
          this.doNotification(2, 'Unable to retrieve details ', error_response);
        }
      } catch (error) {
        this.doNotification(
          3,
          'Internal Server Error',
          'Kindly refresh the page. If error persists contact tech support',
        );
      }
      this.updateSearchState(false);
    },
    prepareResponseData(data) {
      const response = data.response.docs;
      return response;
    },
    clear() {
      this.isActive = true;
    },
    statusColor(status) {
      const transformedStatus = status;

      const filteredStatus = this.getStatusMapping.filter(
        event => event.value === status,
      );
      // eslint-disable-next-line prettier/prettier
      const label = filteredStatus.length > 0 ? filteredStatus[0].label : 'Pending';

      const activeClass = label.replace(/\s+/g, '-').toLowerCase();
      const statusText = label;

      return { activeClass, statusText };
    },
  },
};
</script>

<style scoped>
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 90%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}
li {
  padding: 6px 13px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #2c3e50;
}
.active {
  background-color: #0097cf;
  color: #fff;
}
.active span {
  color: white;
}
.search-filter {
  width: 90%;
}

.fulfilment-search-filter .pending {
  color: #b71f25;
}

.fulfilment-search-filter .confirmed,
.fulfilment-search-filter .received,
.fulfilment-search-filter .processing {
  color: #9d5004;
}
.fulfilment-search-filter .in-transit {
  color: #064a23;
}
.fulfilment-search-filter .completed,
.fulfilment-search-filter .composition {
  color: #324ba8;
}
.fulfilment-search-filter .failed {
  color: #dd4b39;
}
.fulfilment-search-filter .cancelled {
  color: #fddb97;
}
</style>
