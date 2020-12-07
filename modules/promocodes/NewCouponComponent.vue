<template>
  <div class="modal" tabindex="-1" role="dialog" id="newCoupon">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <NavigationComponent
            @menuItem="setActive"
            previous-step="first"
            :step="step"
            v-if="step !== 1"
          />
          <h5 class="modal-title">Create New Promo Code</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div
            v-if="actionErrors.length > 0"
            :class="`alert alert-${actionClass}`"
          >
            <ul>
              <li v-for="error in actionErrors" :key="error">
                <b>{{ error }}</b>
              </li>
            </ul>
          </div>
          <ul class="nav nav-tabs nav-justified">
            <li class="nav-item coupon-nav">
              <a
                class="nav-link coupon-link"
                :class="{ active: isActive('first') }"
              ></a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link coupon-link"
                :class="{ active: isActive('second') }"
              ></a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link coupon-link"
                :class="{ active: isActive('third') }"
              ></a>
            </li>
          </ul>
          <div class="tab-content py-3" id="myTabContent">
            <div
              class="tab-pane fade"
              :class="{ 'active show': isActive('first') }"
              id="first"
              v-if="step === 1"
            >
              <div class="form-group user-input">
                <label class="vat"> Promo Code Name </label>

                <input
                  type="text"
                  v-model="couponName"
                  name="couponName"
                  placeholder="Eg. XMAS2020"
                  class="form-control config-input"
                  :class="{
                    'is-invalid':
                      submitted && $v.couponName.$error && step === 1,
                  }"
                />
                <div
                  v-if="submitted && !$v.couponName.required && step === 1"
                  class="invalid-feedback"
                >
                  Coupon Name is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="config"> Start Date</label>
                <date-picker
                  v-model="couponStartDate"
                  class="date-input"
                  :input-props="{
                    placeholder: 'Select Date',
                    readonly: false,
                    class: 'form-control config-input ',
                  }"
                  :class="{
                    'is-invalid':
                      submitted && $v.couponStartDate.$error && step === 1,
                  }"
                />
                <div
                  class="invoice_valid"
                  v-if="submitted && !$v.couponStartDate.required && step === 1"
                >
                  Start Date is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="config"> End Date</label>
                <date-picker
                  v-model="couponEndDate"
                  class="date-input"
                  :input-props="{
                    placeholder: 'Select Date',
                    readonly: false,
                    class: 'form-control config-input ',
                  }"
                  :class="{
                    'is-invalid':
                      submitted && $v.couponEndDate.$error && step === 1,
                  }"
                />
                <div
                  class="invoice_valid"
                  v-if="submitted && !$v.couponEndDate.required && step === 1"
                >
                  End Date is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="bill">Target Country</label>
                <select
                  name="country"
                  v-model="country"
                  class="form-control"
                  :class="{
                    'is-invalid': submitted && $v.country.$error && step === 1,
                  }"
                >
                  <option value="">Select Country</option>
                  <option
                    :value="country.country_code"
                    v-for="(country, index) in getCountries"
                    :key="index"
                  >
                    {{ country.country_name }}
                  </option>
                </select>
                <div
                  v-if="submitted && !$v.country.required && step === 1"
                  class="invalid-feedback"
                >
                  Target Country is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="bill">Targeted User Type</label>
                <select
                  name="userType"
                  v-model="userType"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      submitted &&
                      $v.userType.$error &&
                      step === 1 &&
                      step === 1,
                  }"
                >
                  <option value="">Select User Type</option>
                  <option
                    :value="user.userType"
                    v-for="(user, index) in userTypes"
                    :key="index"
                  >
                    {{ user.title }}
                  </option>
                </select>
                <div
                  v-if="
                    submitted &&
                      !$v.userType.required &&
                      step === 1 &&
                      step === 1
                  "
                  class="invalid-feedback"
                >
                  Targeted User Type is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="bill">Is this a Sendy Staff Promo?</label>
                <select
                  name="isSendyCoupon"
                  v-model="isSendyCoupon"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      submitted && $v.isSendyCoupon.$error && step === 1,
                  }"
                >
                  <option value="">Select</option>
                  <option
                    :value="operator.value"
                    v-for="(operator, index) in operators"
                    :key="index"
                  >
                    {{ operator.title }}
                  </option>
                </select>
                <div
                  v-if="submitted && !$v.isSendyCoupon.required && step === 1"
                  class="invalid-feedback"
                >
                  is Sendy Staff Promo value is required
                </div>
              </div>

              <NavigationComponent
                @menuItem="setActive"
                next-step="second"
                :step="step"
              />
            </div>
            <div
              class="tab-pane fade"
              :class="{ 'active show': isActive('second') }"
              id="second"
              v-if="step === 2"
            >
              <div class="form-group user-input">
                <label class="bill">Coupon Type</label>
                <select
                  name="couponType"
                  v-model="couponType"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      submitted && $v.couponType.$error && step === 2,
                  }"
                >
                  <option value="">Select</option>
                  <option
                    :value="coupon.type"
                    v-for="(coupon, index) in couponTypes"
                    :key="index"
                  >
                    {{ coupon.title }}
                  </option>
                </select>
                <div
                  v-if="submitted && !$v.couponType.required && step === 2"
                  class="invalid-feedback"
                >
                  Coupon Type is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="vat"> Discount Amount or Percentage </label>
                <input
                  type="number"
                  v-model="couponAmount"
                  name="couponName"
                  placeholder="Eg. XMAS2020"
                  class="form-control config-input"
                  :class="{
                    'is-invalid':
                      submitted && $v.couponAmount.$error && step === 2,
                  }"
                />
                <div
                  v-if="submitted && !$v.couponAmount.required && step === 2"
                  class="invalid-feedback"
                >
                  Discount Amount or Percentage is required and should be a
                  number
                </div>
              </div>
              <div class="form-group user-input">
                <label class="vat"> Maximum Discount Amount </label>
                <input
                  type="number"
                  v-model="maxDiscountAmount"
                  name="couponName"
                  placeholder="Eg. XMAS2020"
                  class="form-control config-input"
                  :class="{
                    'is-invalid':
                      submitted && $v.maxDiscountAmount.$error && step === 2,
                  }"
                />
                <div
                  v-if="
                    submitted && !$v.maxDiscountAmount.required && step === 2
                  "
                  class="invalid-feedback"
                >
                  Maximum Discount Amount is required and should be a number
                </div>
              </div>
              <div class="form-group user-input">
                <label class="vat"> Maximum Usage Per User </label>
                <input
                  type="number"
                  v-model="maxUsageUser"
                  name="couponName"
                  placeholder="Eg. XMAS2020"
                  class="form-control config-input"
                  :class="{
                    'is-invalid':
                      submitted && $v.maxUsageUser.$error && step === 2,
                  }"
                />
                <div
                  v-if="submitted && !$v.maxUsageUser.required && step === 2"
                  class="invalid-feedback"
                >
                  Maximum Usage Per User is required
                </div>
              </div>
              <div class="form-group user-input">
                <label class="vat"> Total Maximum Usage </label>
                <input
                  type="number"
                  v-model="maxTotalUsage"
                  name="couponName"
                  placeholder="Eg. XMAS2020"
                  class="form-control config-input"
                  :class="{
                    'is-invalid':
                      submitted && $v.maxTotalUsage.$error && step === 2,
                  }"
                />
                <div
                  v-if="submitted && !$v.maxTotalUsage.required && step === 2"
                  class="invalid-feedback"
                >
                  Total Maximum Usage is required
                </div>
              </div>
              <NavigationComponent
                @menuItem="setActive"
                next-step="third"
                :step="step"
              />
            </div>
            <div
              class="tab-pane fade"
              :class="{ 'active show': isActive('third') }"
              id="third"
              v-if="step === 3"
            >
              <div class="form-group bill-check">
                <label class="vat"
                  >Are you targeting specific individual users?</label
                >
                <div class="row">
                  <template v-for="(operator, index) in operators">
                    <div class="col-md-6 radio-holder" :key="operator.title">
                      <input
                        type="radio"
                        v-model="is_targeted"
                        name="is_targeted"
                        class=" radio form-control coupon-radio"
                        :key="index"
                        :value="operator.value"
                      />
                      <label
                        class="charge_commission--label"
                        :key="operator.value"
                      >
                        &nbsp; {{ operator.title }}</label
                      >
                    </div>
                  </template>
                </div>
              </div>
              <template v-if="is_targeted">
                <div class="form-group user-input">
                  <label for=""
                    >Enter or Upload the user’s email addresses</label
                  >
                  <TheTagsComponent @emails="setTargetGroup" />
                </div>
                <div class="form-group col-md-12">
                  <label class="reason"
                    >Why are you targeting these specific users?</label
                  >
                  <textarea
                    type="text"
                    v-model="reason"
                    name="reason"
                    class="form-control"
                    placeholder="Enter Reason"
                  >
                  </textarea>
                </div>
              </template>
              <div class="row">
                <button
                  class="btn btn-primary action-button filter-button new-btn"
                  @click="createPromoCode()"
                  :disabled="!isValid"
                >
                  Create Promo Code
                </button>
              </div>
              <NavigationComponent @menuItem="setActive" :step="step" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';

import { VueTabs, VTab } from 'vue-nav-tabs';
import 'vue-nav-tabs/themes/vue-tabs.css';
import { required } from 'vuelidate/lib/validators';
import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import moment from 'moment';

export default {
  name: 'NewCouponComponent',
  components: {
    DatePicker,
    NavigationComponent: () => import('./NavigationTabsComponent'),
    TheTagsComponent: () => import('./TheTagsComponent'),
  },
  data() {
    return {
      activeItem: 'first',
      step: 1,
      couponName: '',
      couponStartDate: '',
      couponEndDate: '',
      country: '',
      userType: '',
      isSendyCoupon: '',
      couponType: '',
      couponAmount: '',
      maxDiscountAmount: '',
      maxUsageUser: '',
      maxTotalUsage: '',
      is_targeted: false,
      reason: '',
      isValid: true,
      targetedGroup: [],
      submitted: false,
      userTypes: [
        { userType: 'peer', title: 'Peer User' },
        { userType: 'cop', title: 'Cop User' },
      ],
      couponTypes: [
        { type: 1, title: 'Cash' },
        { type: 2, title: 'Percentage' },
      ],
      operators: [{ value: true, title: 'Yes' }, { value: false, title: 'No' }],
    };
  },
  computed: {
    ...mapState(['actionErrors', 'actionClass', 'userData', 'config']),
    ...mapGetters(['getCountries']),

    rules() {
      let rules = {};
      const stepOneRules = {
        couponName: { required },
        couponStartDate: { required },
        couponEndDate: { required },
        country: { required },
        userType: { required },
        isSendyCoupon: { required },
      };
      const stepTwoRules = {
        couponType: { required },
        couponAmount: { required },
        maxDiscountAmount: { required },
        maxUsageUser: { required },
        maxTotalUsage: { required },
      };

      const stepThreeRules = {
        is_targeted: { required },
      };

      const test = { ...stepOneRules, ...stepTwoRules };
      const test2 = { ...test, ...stepThreeRules };
      switch (this.step) {
        case 1:
          rules = stepOneRules;
          break;
        case 2:
          rules = { ...stepOneRules, ...stepTwoRules };
          break;
        case 3:
          rules = { ...stepOneRules, ...stepTwoRules, ...stepThreeRules };
          break;

        default:
          break;
      }

      return rules;
    },
    actionUser() {
      return this.session.payload.data.name;
    },
  },
  validations() {
    return this.rules;
  },
  methods: {
    ...mapMutations({
      updateErrors: 'setActionErrors',
      updateClass: 'setActionClass',
      updateSuccess: 'setUserActionSuccess',
    }),
    ...mapActions(['perform_user_action']),

    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive(menuItem) {
      this.submitted = true;
      this.$v.$touch();

      if (menuItem.direction === 'next' && this.$v.$invalid) {
        return;
      }

      this.activeItem = menuItem.nextStep;
      this.step = menuItem.step;
    },
    setTargetGroup(emails) {
      this.targetedGroup = emails.data;
      this.isValid = emails.status;
    },
    async createPromoCode() {
      this.submitted = true;
      const notification = [];
      let actionClass = '';

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        app: 'CUSTOMERS_APP',
        endpoint: 'create_coupon_code',
        apiKey: true,
        params: {
          data_set: 'coupon_actions',
          action_id: 1,
          action_data: {
            coupon_name: this.couponName,
            coupon_type: this.couponType,
            coupon_discount: Number(this.couponAmount),

            coupon_start_date: `${moment(this.couponStartDate).format(
              'YYYY-MM-DD',
            )}`,
            coupon_end_date: `${moment(this.couponEndDate).format(
              'YYYY-MM-DD',
            )}`,
            maximum_usage: Number(this.maxTotalUsage),
            maximum_usage_user: Number(this.maxUsageUser),
            max_discount_amount: Number(this.maxDiscountAmount),
            country_code: `${this.country}`,
            sendy_staff_promo: this.isSendyCoupon ? 1 : 0,
            is_targeted: this.is_targeted,
            targeted_group: this.targetedGroup,
            targeted_file: null,
          },
          request_id: '1622',
          action_user: this.actionUser,
        },
      };
      try {
        const data = await this.perform_user_action(payload);
        notification.push(data.message);
        actionClass = this.display_order_action_notification(data.status);
        if (data.status) {
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }
      } catch (error) {
        notification.push(
          'Something went wrong. Try again or contact Tech Support',
        );
        actionClass = 'danger';
      }
      this.updateClass(actionClass);
      this.updateErrors(notification);
    },
  },
};
</script>

<style scoped>
@import './_assets/styles/modals.css';
</style>
