<template>
  <div>
    <div class="child-orders-table">
      <div class="child-orders-table-head">
        <div class="child1">Status</div>
        <div class="child2">Container Number</div>
        <div class="child3">Truck Size</div>
        <div class="child4">Empty Container Destination</div>
        <div class="child5"><p class="edit-container-icon">Edit</p></div>
        <div class="child6"></div>
        <div class="child7"></div>
      </div>
      <div v-for="(container, index) in containerDetails" :key="index" class="">
        <div class="child-orders-table-row" @click="toggle(index)">
          <div class="child1">
            <button class="container-button" :class="buttons[0].class">
              {{ buttons[0].text }}
            </button>
          </div>
          <div class="child2">
            <span v-if="rowIndex.includes(index)"
              ><input
                type="text"
                class="container-edit-input"
                v-model="editedContainers[index].container_number"/></span
            ><span v-else>{{ container.container_number }}</span>
          </div>
          <div class="child3">
            <span v-if="rowIndex.includes(index)">
              <select
                name=""
                id=""
                class="container-edit-input"
                v-model="editedContainers[index].container_size_feet"
              >
                <option value="20">20</option>
                <option value="40">40</option>
              </select>
            </span>
            <span v-else>{{ container.container_size_feet }}</span>
          </div>
          <div class="child4">
            <span v-if="rowIndex.includes(index)"
              ><input
                type="text"
                class="container-edit-input"
                v-model="editedContainers[index].name"/></span
            ><span v-else>{{ container.name }}</span>
          </div>
          <div class="child5">
            <span class="input-blinder" v-if="rowIndex.includes(index)"></span>
            <span
              class="fa fa-fw fa-edit pointer edit-container-icon"
              @click="edit(index)"
            ></span>
          </div>
          <div class="child6 pointer" @click="save(index)">
            <span class="input-blinder" v-if="!rowIndex.includes(index)"></span>
            <p class="edit-container-icon container-save-input">save</p>
          </div>
          <div class="child7 pointer container-cancel-input">cancel order</div>
        </div>
        <div>
          <LowerSlideComponent
            v-if="activeTab.includes(index)"
            :index="index"
            :orderno="order"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LowerSlideComponent from './LowerSlideComponent';

export default {
  name: 'CreateOrderComponent',
  components: {
    LowerSlideComponent,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
    rates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // containers: [
      //   {
      //     consignee:order.freight_details.consignee,
      //     container_destination: {
      //       coordinates: '-1.3355024,36.878165699999954',
      //       country_code: 'KE',
      //       more: {
      //         Address: 'Not Indicated',
      //         Estate: '',
      //         FlatName: '',
      //         HouseDoor: '',
      //         Label: '',
      //         Otherdescription: '',
      //         Road: '',
      //         Typed: '',
      //         Vicinity: 'Not Indicated',
      //         landmark: '',
      //         place_idcustom: 'ChIJl5shhwUSLxgR56PeRSrUirg',
      //         viewport: {
      //           northeast: {
      //             lat: 0,
      //             lng: 0,
      //           },
      //           southwest: {
      //             lat: 0,
      //             lng: 0,
      //           },
      //         },
      //       },
      //       name: 'Inland Container Depot',
      //       recipient_name: null,
      //       recipient_phone: null,
      //       waypoint_details_status: true,
      //     },
      //     container_number: freight_details.container_number,
      //     container_size_feet: freight_details.container_size_feet,
      //     container_weight_tonnes: freight_details.container_weight_tonnes,
      //   },
      // ],
      containerDetails: this.order.freight_details,
      showing: false,
      activeTab: [],
      rowIndex: [],
      editedContainers: [],
      buttons: [
        { class: 'pending-container', text: 'Pending' },
        { class: 'transit-container', text: 'In Transit' },
        { class: 'ec-container', text: 'EC delivery' },
        { class: 'complete-container', text: 'Completed' },
      ],
    };
  },
  methods: {
    toggle(i) {
      if (!this.rowIndex.includes(i)) {
        if (!this.activeTab.includes(i)) {
          this.activeTab.push(i);
        } else {
          this.activeTab = this.activeTab.filter(item => {
            return item !== i;
          });
        }
      }
    },
    edit(i) {
      if (!this.activeTab.includes(i)) {
        if (!this.rowIndex.includes(i)) {
          if (this.editedContainers.length === 0) {
            this.editedContainers = this.containerDetails;
          }
          this.rowIndex.push(i);
        }
      }
    },
    save(i) {
      if (this.rowIndex.includes(i)) {
        this.rowIndex = this.rowIndex.filter(item => {
          return item !== i;
        });
        this.containerDetails[i] = this.editedContainers[i];
        if (this.rowIndex.length === 0) {
          this.editedContainers = [];
        }
        this.toggle(i);
      }
    },
  },
};
</script>
