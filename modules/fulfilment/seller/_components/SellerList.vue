<template lang="html">
  <div class="">
    <div class="">
      <div class="">
        <el-input
          placeholder="Search"
          prefix-icon="el-icon-search"
          class="mc-seller-search-input"
          v-model="search"
        >
        </el-input>
      </div>
      <div class="fulfilment-table-wrapper mc-seller-table-wrapper">
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-key="getRowKey"
          :expand-row-keys="expand_keys"
          @row-click="expandTableRow"
          @expand-change="handleRowExpand"
          header-cell-class-name="mc-seller-header"
        >
          <el-table-column prop="business_name" label="Business name">
          </el-table-column>
          <el-table-column prop="client_name" label="Client name">
          </el-table-column>
          <el-table-column prop="email" label="Email address">
          </el-table-column>
          <el-table-column prop="phone_no" label="Phone number">
          </el-table-column>
          <el-table-column prop="creation_date" label="Account creation date">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              {{ props.row }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SellerList',
  components: {},
  data() {
    return {
      mode: 'SellerList',
      search: '',
      tableData: [
        {
          id: 100,
          business_name: 'Marini Natural',
          client_name: 'Corey Mwendo',
          email: 'coreym@gmail.com',
          phone_no: '0734465094',
          creation_date: '23 Aug 2021',
        },
        {
          id: 200,
          business_name: 'Marini Natural',
          client_name: 'Corey Mwendo',
          email: 'coreym@gmail.com',
          phone_no: '0734465094',
          creation_date: '23 Aug 2021',
        },
        {
          id: 300,
          business_name: 'Marini Natural',
          client_name: 'Corey Mwendo',
          email: 'coreym@gmail.com',
          phone_no: '0734465094',
          creation_date: '23 Aug 2021',
        },
        {
          id: 400,
          business_name: 'Marini Natural',
          client_name: 'Corey Mwendo',
          email: 'coreym@gmail.com',
          phone_no: '0734465094',
          creation_date: '23 Aug 2021',
        },
      ],
      expand_id: 0,
      expand_keys: [],
      tableKey: 0,
    };
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapActions({}),
    getRowKey(row) {
      return row.id;
    },
    expandTableRow(row) {
      if (this.expand_keys.includes(row.id)) {
        this.expand_keys = [];
      } else {
        this.expand_id = row.id;
        this.expand_keys = [];
        this.expand_keys.push(row.id);
      }
    },
    handleRowExpand(row) {
      if (this.expand_keys.includes(row.id)) {
        this.expand_keys = [];
      } else {
        this.expand_id = row.id;
        this.expand_keys = [];
        this.expand_keys.push(row.id);
      }
    },
  },
};
</script>
