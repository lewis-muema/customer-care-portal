<template>
  <div class="pending-requests-containers" v-loading="loadingStatus">
    <div
      v-for="(order, index) in orders"
      :key="index"
      class="pending-requests-tabs"
    >
      <div class="pending-requests-driver-details">
        <img
          v-if="order.driver_details.rider_photo"
          :src="
            `https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${order.driver_details.rider_photo}`
          "
          alt=""
          class="pending-requests-driver-photo"
        />
        <img
          v-else
          src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png"
          alt=""
          class="pending-requests-driver-photo"
        />
        <div class="pending-requests-driver-name">
          {{ order.driver_details.name }}
        </div>
        <div class="pending-requests-driver-phone">
          {{ order.driver_details.phone }}
        </div>
      </div>
      <div class="pending-requests-actions">
        <div class="pending-requests-actions-menu">
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'details'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'details')"
          >
            Details
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'edit' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'edit')"
          >
            Edit
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'owner' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'owner')"
          >
            Owner
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'action' ? 'active-actions-menu-item' : ''
            "
            @click="changeTab(index, 'action')"
          >
            Action
          </div>
          <div
            class="pending-requests-actions-menu-items"
            :class="
              order.activeMenuTab === 'advanced'
                ? 'active-actions-menu-item'
                : ''
            "
            @click="changeTab(index, 'advanced')"
          >
            Fuel Advanced
          </div>
        </div>
        <div class="pending-requests-actions-tabs">
          <div v-if="order.activeMenuTab === 'details'">
            <div class="pending-requests-actions-table-header">
              <div class="pending-requests-large-column">Order</div>
              <div class="pending-requests-standard-column">Amount</div>
              <div class="pending-requests-standard-column">Station</div>
              <div class="pending-requests-standard-column">Fuel type</div>
              <div class="pending-requests-standard-column">Order type</div>
              <div class="pending-requests-standard-column">Percentage</div>
            </div>
            <div class="pending-requests-actions-table-body">
              <div class="pending-requests-large-column">
                <div class="pending-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="pending-requests-pickup">
                  <div class="pending-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="pending-requests-destination">
                  <div class="pending-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="pending-requests-standard-column pending-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'edit'"
            class="pending-requests-edit"
          >
            <el-popover
              placement="top-start"
              title=""
              width="305"
              trigger="hover"
              popper-class="pending-requests-popover"
              content="Once a request is updated, the changes will reflect on the partner app and owners portal. Ensure the owner has approved of this edit."
            >
              <div class="pending-requests-info" slot="reference">
                <i class="fa fa-info"></i>
              </div>
            </el-popover>
            <div class="pending-requests-edit-top">
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">Fuel amount</span
                ><br />
                <input
                  type="text"
                  class="pending-requests-edit-inputs"
                  v-model="order.request_details.amount"
                />
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">Fueling station</span
                ><br />
                <select
                  name="station"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="order.request_details.station"
                  @change="
                    changeAddresses(order.request_details.station, index)
                  "
                >
                  <option
                    :value="station.station_name"
                    v-for="(station, index) in stations"
                    :key="index"
                    :label="station.station_name"
                    >{{ station.station_name }}</option
                  >
                </select>
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">Station Address</span
                ><br />
                <select
                  name="address"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="order.request_details.address"
                >
                  <option
                    :value="address.name"
                    v-for="(address, index) in addresses"
                    :key="index"
                    :label="address.name"
                    >{{ address.name }}</option
                  >
                </select>
              </div>
              <div class="pending-requests-filler">
                <span class="pending-requests-input-label">Fuel type</span
                ><br />
                <select
                  name="fuel"
                  id=""
                  class="pending-requests-edit-inputs"
                  v-model="order.request_details.fuel_type"
                >
                  <option
                    :value="fuel.name"
                    v-for="(fuel, index) in fuel_types"
                    :key="index"
                    :label="fuel.name"
                    >{{ fuel.name }}</option
                  ></select
                >
              </div>
            </div>
            <div class="pending-requests-edit-bottom">
              <button class="pending-requests-update-button">Update</button>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'owner'"
            class="pending-requests-owner-container"
          >
            <div class="pending-requests-owner-section-left">
              <div class="pending-requests-owner-details">
                <span class="pending-requests-owner-label">Name:</span>
                {{ order.owner_details.name }}
              </div>
              <div class="pending-requests-owner-details">
                <span class="pending-requests-owner-label">Phone number:</span>
                {{ order.owner_details.phone_number }}
              </div>
              <div class="pending-requests-owner-details">
                <span class="pending-requests-owner-label">Status:</span>
                {{ order.owner_details.status }}
              </div>
            </div>
            <div class="pending-requests-owner-section-right">
              <div
                class="pending-requests-owner-details approved-question-override"
              >
                Has the owner approved this request?
              </div>
              <div
                class="pending-requests-owner-details approved-input-override"
              >
                <input
                  type="radio"
                  id="owner-approval-yes"
                  class="pending-requests-spacer-2"
                />
                <span class="pending-requests-spacer-1">Yes</span>
                <input
                  type="radio"
                  id="owner-approval-no"
                  class="pending-requests-spacer-2"
                />
                <span class="pending-requests-spacer-1">No</span>
                <button class="pending-requests-update-button">Update</button>
              </div>
            </div>
          </div>
          <div
            v-if="order.activeMenuTab === 'action'"
            class="pending-requests-owner-container"
          >
            <div>
              <div
                class="pending-requests-owner-details approved-question-override"
              >
                Approve fuel advance request
              </div>
              <div>
                <input
                  type="radio"
                  id="owner-approval-yes"
                  class="pending-requests-spacer-2"
                />
                <span class="pending-requests-spacer-1">Approve</span>
                <input
                  type="radio"
                  id="owner-approval-no"
                  class="pending-requests-spacer-2"
                />
                <span class="pending-requests-spacer-1">Reject</span>
                <button class="pending-requests-update-button">Update</button>
              </div>
            </div>
          </div>
          <div v-if="order.activeMenuTab === 'advanced'">
            <div class="pending-requests-actions-table-header">
              <div class="pending-requests-standard-column-adv">DD/TT</div>
              <div class="pending-requests-large-column-adv">Order</div>
              <div class="pending-requests-standard-column-adv">Amount</div>
              <div class="pending-requests-standard-column-adv">Station</div>
              <div class="pending-requests-standard-column-adv">Fuel type</div>
              <div class="pending-requests-standard-column-adv">Order type</div>
              <div class="pending-requests-standard-column-adv">Percentage</div>
            </div>
            <div class="pending-requests-actions-table-body">
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.date_time }}
              </div>
              <div class="pending-requests-large-column-adv">
                <div class="pending-requests-orderno">
                  {{ order.request_details.order_no }}
                </div>
                <div class="pending-requests-pickup">
                  <div class="pending-requests-pickup-indicator"></div>
                  {{ order.request_details.pick_up }}
                </div>
                <div class="pending-requests-destination">
                  <div class="pending-requests-destination-indicator"></div>
                  {{ order.request_details.destination }}
                </div>
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.currency }}
                {{ thousandsSeparator(order.request_details.amount) }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.station }}<br />({{
                  order.request_details.address
                }})
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.fuel_type }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.order_type }}
              </div>
              <div
                class="pending-requests-standard-column-adv pending-requests-column-ovverride"
              >
                {{ order.request_details.percentage }} %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      loadingStatus: false,
      stations: [
        {
          station_name: 'Shell',
          station_addresses: [
            {
              name: 'Nairobi',
              id: 1,
            },
            {
              name: 'Kisumu',
              id: 2,
            },
            {
              name: 'Mombasa',
              id: 3,
            },
            {
              name: 'Maanzoni Kyumbi, Machakos',
              id: 4,
            },
          ],
        },
        {
          station_name: 'Galana',
          station_addresses: [
            {
              name: 'Nairobi',
              id: 1,
            },
            {
              name: 'Kisumu',
              id: 2,
            },
          ],
        },
      ],
      fuel_types: [
        {
          name: 'Petrol',
          id: 0,
        },
        {
          name: 'Diesel/unleaded',
          id: 1,
        },
        {
          name: 'Diesel/leaded',
          id: 2,
        },
        {
          name: 'Gasoline',
          id: 3,
        },
      ],
      addresses: [],
    };
  },
  watch: {
    orders: {
      handler(val) {
        // console.log(val);
      },
      deep: true,
    },
  },
  created() {
    this.loadingStatus = true;
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      const rawData = [
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: 'c75e9xqfts-kratos.jpg',
          },
        },
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: '',
          },
        },
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: 'c75e9xqfts-kratos.jpg',
          },
        },
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: '',
          },
        },
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: 'c75e9xqfts-kratos.jpg',
          },
        },
        {
          request_details: {
            order_no: 'AD23VX485-2PV',
            pick_up: 'ICD, Nairobi Somwhere',
            destination: 'Kamukunji DC Central (Long name)',
            amount: 20000,
            currency: 'KES',
            station: 'Shell',
            address: 'Maanzoni Kyumbi, Machakos',
            fuel_type: 'Petrol',
            order_type: 'On-demand',
            percentage: 75,
            date_time: '2020/08/24 14:00:00',
            status: 'pending',
          },
          owner_details: {
            name: 'Loice Njeri',
            phone_number: '070123456',
            status: 'pending',
          },
          admin_details: {
            name: 'Phil Ope',
            email: 'phil@sendyit.com',
            status: 'pending',
          },
          driver_details: {
            name: 'Davey',
            phone: '07988445533',
            rider_photo: '',
          },
        },
      ];
      rawData.forEach(row => {
        row.activeMenuTab = 'details';
      });
      this.loadingStatus = false;
      this.orders = rawData;
    },
    changeTab(index, data) {
      if (data === 'edit') {
        this.addresses = this.stations.find(stn => {
          return (
            stn.station_name === this.orders[index].request_details.station
          );
        }).station_addresses;
      }
      this.orders[index].activeMenuTab = data;
    },
    thousandsSeparator(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    changeAddresses(station, index) {
      const addresses = this.stations.find(stn => {
        return stn.station_name === station;
      });
      this.addresses = addresses.station_addresses;
      this.orders[index].request_details.address = this.addresses[0].name;
    },
  },
};
</script>

<style>
.pending-requests-containers {
  height: 568px;
  overflow-y: scroll;
}
.pending-requests-tabs {
  height: 180px;
  display: flex;
  margin: 10px 0px 10px 0px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
  width: 94%;
  border: 1px solid #f2f6fc;
  border-radius: 5px;
  padding-right: 10px;
}
.pending-requests-driver-photo {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin: 5px;
}
.pending-requests-driver-details {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 5px solid #ea7125;
}
.pending-requests-driver-name,
.pending-requests-driver-phone {
  color: #909399;
  font-size: 14px;
}
.pending-requests-actions-menu {
  display: flex;
  height: 40px;
  align-items: center;
}
.pending-requests-actions-menu-items {
  width: 100px;
  text-align: center;
  cursor: pointer;
  color: #919191;
  font-weight: 600;
}
.active-actions-menu-item {
  text-decoration: underline;
  color: #ea7125 !important;
}
.pending-requests-actions-table-header,
.pending-requests-actions-table-body {
  display: flex;
  padding-left: 30px;
}
.pending-requests-standard-column {
  width: 15%;
}
.pending-requests-column-ovverride {
  color: #000000;
  font-size: 14px;
  margin: 10px 0px 5px 0px;
  padding: 0px 10px 0px 0px;
}
.pending-requests-large-column {
  width: 25%;
}
.pending-requests-actions {
  width: -webkit-fill-available;
  margin-left: 50px;
}
.pending-requests-actions-table-header {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  color: #1871ac;
  font-size: 14px;
  align-items: center;
}
.pending-requests-orderno {
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0px 5px 0px;
}
.pending-requests-pickup,
.pending-requests-destination {
  font-weight: 500;
  font-size: 12px;
  color: #606266;
  margin: 5px 0px 5px 0px;
  display: flex;
  align-items: center;
}
.pending-requests-pickup-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #ea7125;
}
.pending-requests-destination-indicator {
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 10px;
  background: #1871ac;
}
.pending-requests-edit-inputs {
  border: 1px solid #dcdfe6;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  margin: 0px 5px 0px 5px;
  width: -webkit-fill-available;
  padding: 10px;
}
.pending-requests-update-button {
  background: #ea7125;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 5px;
  color: white;
  height: 40px;
  width: 100px;
  font-size: 14px;
  font-weight: 600;
  margin: 5px;
}
.pending-requests-edit {
  margin: 20px;
  position: relative;
}
.pending-requests-edit-top {
  display: flex;
}
.pending-requests-edit-bottom {
  display: flex;
  justify-content: flex-end;
}
.pending-requests-input-label {
  margin: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #1871ac;
}
.pending-requests-filler {
  width: -webkit-fill-available;
}
.pending-requests-info {
  position: absolute;
  right: 0px;
  top: -40px;
  color: #000000;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #dff1fd;
  cursor: pointer;
}
.pending-requests-popover {
  background: #1871ac;
  color: white;
}
.pending-requests-owner-container {
  display: flex;
  align-items: center;
  height: 130px;
  padding-left: 30px;
}
.pending-requests-owner-details {
  margin: 10px 0px 10px 0px;
  font-size: 14px;
}
.pending-requests-owner-label {
  color: #909090;
  margin-right: 5px;
}
.pending-requests-owner-section-left {
  width: 40%;
  border-right: 1px solid #e4e7ed;
}
.pending-requests-owner-section-right {
  width: 40%;
  padding-left: 10%;
}
.approved-question-override {
  color: #ea7125;
}
.approved-input-override {
  display: flex;
  align-items: center;
}
.pending-requests-spacer-2 {
  margin-right: 10px;
}
.pending-requests-spacer-1 {
  margin-right: 25px;
}
.pending-requests-large-column-adv {
  width: 28%;
}
.pending-requests-standard-column-adv {
  width: 12%;
}
</style>
