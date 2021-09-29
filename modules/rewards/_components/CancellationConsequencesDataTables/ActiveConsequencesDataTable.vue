<template>
  <div class="table-container">
    <el-table
      :data="activeCancellationConsequences"
      height="500"
      size="medium"
      :border="false"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="form-inline expand-logs-section">
            <div class="actions" v-if="props.row.actions.length">
              <div
                class="action-info"
                v-for="(action, index) in props.row.actions"
                :key="index"
              >
                <div v-if="action.action_type" class="expandable-header">
                  <label class="expandable-data">
                    {{ mapActionNames(action.action_type) }}</label
                  >
                </div>
                <div v-if="action.cancellation_fee" class="expandable-header">
                  Cancellation fee:
                  <span>
                    {{ action.currency }} {{ action.cancellation_fee }}
                  </span>
                </div>
                <div
                  v-if="action.comparator !== undefined"
                  class="expandable-header"
                >
                  Time: <span>{{ mapComparator(action.comparator) }}</span>
                  <span v-if="action.comparator">
                    {{ action.duration }} Minutes
                  </span>
                </div>
                <div v-if="action.message" class="expandable-header">
                  Message:
                  <span>{{ action.message }}</span>
                </div>
                <div class="expandable-header">
                  Order status:
                  <div class="order-status">
                    <ul>
                      <li
                        class="order-status"
                        v-for="(status,
                        index) in action.applicable_order_status"
                        :key="index"
                      >
                        {{ mapOrderStatus(status) }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Country" prop="country">
        <template slot-scope="scope">
          {{
            fetchCountry(
              activeCancellationConsequences[scope.$index]['country_code'],
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Vendor" prop="vendor_type_names">
        <template slot-scope="scope">
          <span class="stop-word-break">
            {{
              formatVendorTypeNames(
                activeCancellationConsequences[scope.$index][
                  'vendor_type_names'
                ],
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="Cancellation reason"
        width="200"
        prop="cancellation_reason_name"
      >
        <template slot-scope="scope">
          <span class="stop-word-break">
            {{
              activeCancellationConsequences[scope.$index][
                'cancellation_reason_name'
              ]
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200" prop="actions">
        <template slot-scope="scope">
          <span class="stop-word-break">
            {{
              getActionTypes(
                activeCancellationConsequences[scope.$index]['actions'],
              )
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Date added" prop="date_created">
        <template slot-scope="scope">
          {{
            getFormattedDate(
              activeCancellationConsequences[scope.$index]['date_created'],
              'DD/MM/YYYY ',
            )
          }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status">
        <template slot-scope="scope">
          {{
            activeStatus(activeCancellationConsequences[scope.$index]['status'])
          }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" prop="status" class="data" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :class="
              activeCancellationConsequences[scope.$index]['status'] === 1
                ? 'action-button--danger'
                : 'action-button--active'
            "
            @click="
              setStatusState(activeCancellationConsequences[scope.$index])
            "
          >
            {{
              loading(activeCancellationConsequences[scope.$index]['id'])
                ? 'Processing...'
                : setStatusText(activeCancellationConsequences[scope.$index])
            }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="
              openEditDialog(activeCancellationConsequences[scope.$index])
            "
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      id="cancellation-consequences-edit"
      title="Edit Cancellation Consequences"
      :visible.sync="dialogFormVisible"
      append-to-body
    >
      <cancellation-consequences-edit
        @showDialog="closeDialog"
        :consequence-data="consequences"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cancellation_consequences_table_mixin from '@/mixins/cancellation_consequences_table_mixin';
import CancellationConsequencesEdit from '../CancellationConsequencesEdit';

export default {
  name: 'ActiveConsequencesDataTable',
  components: {
    CancellationConsequencesEdit,
  },
  mixins: [cancellation_consequences_table_mixin],
  data() {
    return {
      dialogFormVisible: false,
      consequences: {},
    };
  },
  computed: {
    ...mapGetters({
      activeCancellationConsequences: 'getActiveCancellationConsequences',
    }),
  },
  methods: {
    openEditDialog(row) {
      this.dialogFormVisible = true;
      // DEEP CLONE ARRAY
      this.consequences = JSON.parse(JSON.stringify(row));
    },
    closeDialog(showDialog) {
      this.dialogFormVisible = showDialog;
    },
  },
};
</script>

<style scoped>
.action-button--danger {
  background-color: #ff4949;
  border-color: #ff4949;
  color: #fff;
}
.action-button--active {
  background-color: #13ce66;
  border-color: #13ce66;
  color: #fff;
}
.stop-word-break {
  white-space: pre-line;
  word-break: break-word;
  position: relative;
  bottom: 10px;
}
.actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.action-info {
  margin-right: 25px;
}
.expandable-data {
  font-weight: 600;
  font-size: 15px;
  color: #000000;
  margin-bottom: 3px;
}
.expand-logs-section {
  width: 100% !important;
}
.expandable-header {
  display: flex;
  flex-direction: row;
  max-width: 300px;
  font-weight: 600;
}
.expandable-header span {
  font-weight: 400;
  margin-left: 1px;
}
.expandable-header span:first-child {
  margin-left: 5px;
  font-weight: 400;
}
.expandable-header .order-status {
  margin-left: 10px;
}
.expandable-header .order-status ul {
  padding: 0;
  font-weight: 400;
}
</style>
<style>
#cancellation-consequences-edit .el-dialog {
  width: 70% !important;
  min-height: 350px;
}
</style>
