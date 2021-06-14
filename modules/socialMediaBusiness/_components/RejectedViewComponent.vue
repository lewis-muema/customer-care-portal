<template lang="html">
  <div class="">
    <div v-if="loading_data" class="centre-loader">
      <Loading />
    </div>
    <div v-else class="outline-inner-data">
      <div>
        <div
          v-if="delete_status"
          class=" col-md-12 intercounty-response response-flex-box"
        >
          <div class="response-highlight">
            <p
              class="delete-response-text"
              v-if="delete_response_status === true"
            >
              <i
                class="fa fa-spinner fa-spin loader intercounty-loader--align"
              ></i>
              Processing your request ....
            </p>
            <p
              class="delete-response-text"
              v-else-if="delete_response_status === 'declined'"
            >
              <i
                class="fa fa-check-circle intercounty-loader--align intercounty-submit-success"
              ></i>
              Social media business request declined successfully !
            </p>
            <p
              class="delete-response-text"
              v-else-if="delete_response_status === 'approved'"
            >
              <i
                class="fa fa-check-circle intercounty-loader--align intercounty-submit-success"
              ></i>
              Social media business request approved successfully !
            </p>
            <p class="delete-response-text" v-else>
              <i
                class="fa fa-exclamation-circle intercounty-loader--align intercounty-submit-error"
              ></i>
              {{ error_msg }}
            </p>
          </div>
          <div class="close-response-highlight">
            <i class="el-icon-circle-close" @click="closeHighlight()"></i>
          </div>
        </div>

        <div class="body-box col-md-12 intercounty-table">
          <el-table :data="social_biz_data" size="medium" :border="false">
            <el-table-column label="Cop Name">
              <template slot-scope="scope">
                {{ social_biz_data[scope.$index]['cop_name'] }}
              </template>
            </el-table-column>
            <el-table-column label="Cop Phone">
              <template slot-scope="scope">
                {{ social_biz_data[scope.$index]['cop_phone'] }}
              </template>
            </el-table-column>
            <el-table-column label="Email">
              <template slot-scope="scope">
                {{ social_biz_data[scope.$index]['email'] }}
              </template>
            </el-table-column>
            <el-table-column label="Instagram">
              <template slot-scope="scope">
                {{
                  social_biz_data[scope.$index]['social_media_name'] ===
                  'Instagram'
                    ? social_biz_data[scope.$index]['handle']
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column label="Facebook">
              <template slot-scope="scope">
                {{
                  social_biz_data[scope.$index]['social_media_name'] ===
                  'Facebook'
                    ? social_biz_data[scope.$index]['handle']
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column label="Date of sign up" width="150">
              <template slot-scope="scope">
                {{
                  getFormattedDate(
                    social_biz_data[scope.$index]['date_created'],
                    'MMMM Do YYYY, h:mm a',
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" prop="action" width="250">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  class="config-button--active"
                  @click="approveBusiness(social_biz_data[scope.$index])"
                >
                  Approve
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';
import axios from 'axios';
import Loading from './LoadingComponent.vue';

export default {
  name: 'RejectedViewComponent',
  components: { Loading },
  data() {
    return {
      loading_data: false,
      social_biz_data: [],
      response_status: true,
      error_msg: '',
      delete_status: false,
      delete_response_status: true,
    };
  },
  computed: {
    ...mapState(['userData']),
  },
  watch: {},
  mounted() {
    this.initiateData();
  },
  methods: {
    ...mapActions({
      request_social_biz_approvals: 'request_rejected_social__media_business',
      approve_social_biz: 'social_media_biz_approval',
    }),
    initiateData() {
      this.fetchData();
    },
    async fetchData() {
      const arr = await this.request_social_biz_approvals();
      this.social_biz_data = arr;
    },
    async approveBusiness(data) {
      this.delete_status = true;
      this.delete_response_status = true;

      const value = {
        verified: 1,
        copId: data.cop_id,
      };
      const payload = {
        app: 'ADONIS_API',
        endpoint: `social-media-businesses/${data.social_media_business_id}`,
        apiKey: false,
        params: value,
      };

      try {
        const resp = await this.approve_social_biz(payload);
        this.delete_response_status = 'approved';
        setTimeout(() => {
          this.initiateData();
        }, 2000);
      } catch (error) {
        this.delete_response_status = false;
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    async declineBusiness(data) {
      this.delete_status = true;
      this.delete_response_status = true;

      const value = {
        verified: 2,
        copId: data.cop_id,
      };
      const payload = {
        app: 'ADONIS_API',
        endpoint: `social-media-businesses/${data.social_media_business_id}`,
        apiKey: false,
        params: value,
      };

      try {
        const resp = await this.approve_social_biz(payload);
        this.delete_response_status = 'declined';
        setTimeout(() => {
          this.initiateData();
        }, 2000);
      } catch (error) {
        this.delete_response_status = false;
        this.error_msg =
          'Internal Server Error. Kindly refresh the page. If error persists contact tech support';
      }
    },
    closeHighlight() {
      this.error_msg = '';
      this.delete_response_status = true;
      this.delete_status = false;
    },
  },
};
</script>

<style lang="css">
@import './../../../assets/style/intercounty-config.css';
</style>
