<template>
  <div class="table-container">
    <el-table
      :data="activeCancellationConsequences"
      height="500"
      size="medium"
      :border="false"
    >
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
      <el-table-column label="Actions" prop="status" class="data" width="150">
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import cancellation_consequences_table_mixin from '@/mixins/cancellation_consequences_table_mixin';
import { mapGetters } from 'vuex';

export default {
  name: 'ActiveConsequencesDataTable',
  mixins: [cancellation_consequences_table_mixin],
  computed: {
    ...mapGetters({
      activeCancellationConsequences: 'getActiveCancellationConsequences',
    }),
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
</style>
