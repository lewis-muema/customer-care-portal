<template>
  <div>
    <div class="">
      <p class="add-hub-label">
        Name of hub
      </p>
      <el-input v-model="hub_name" type="input" placeholder=""> </el-input>
    </div>
    <div class="add-hub-selector">
      <p class="add-hub-label">
        Select country
      </p>
      <el-select
        class="add-hub-select"
        filterable
        placeholder="Select"
        v-model="country"
      >
        <el-option
          v-for="val in country_list"
          :key="val.id"
          :label="val.name"
          :value="val.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="">
      <p class="add-hub-label">
        Location
      </p>
      <div class="add-hub-popover">
        <template>
          <el-popover
            placement="bottom"
            width="Min width 150px"
            v-model="visible"
            class="add-hub-popover"
          >
            <div>
              <div
                class="single-suggestion"
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                @click="
                  handleSelect(suggestion.description, 0, suggestion.place_id)
                "
              >
                {{ suggestion.description }}
              </div>
            </div>
            <el-input
              slot="reference"
              size="large"
              class=""
              placeholder="Enter location"
              v-model="location"
              @input="handleFocus($event, 0)"
            ></el-input>
          </el-popover>
        </template>
      </div>
    </div>
    <div class="add-hub-selector">
      <p class="add-hub-label">
        Type of hub
      </p>
      <el-select
        class="add-hub-select"
        filterable
        placeholder="Select"
        v-model="hub_type"
      >
        <el-option
          v-for="val in hub_list"
          :key="val.id"
          :label="val.name"
          :value="val.id"
        >
        </el-option>
      </el-select>
    </div>

    <el-button
      type="primary"
      class="full-width action-submit-button"
      @click="addHub"
    >
      Add hub
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'AddHub',
  mixins: [NotificationMxn],
  data() {
    return {
      visible: false,
      hub_name: '',
      suggestions: [],
      location: '',
      location_data: {},
      country: '',
      country_list: [
        {
          id: 1,
          name: 'Kenya',
        },
      ],
      hub_type: '',
      hub_list: [
        {
          id: 1,
          name: 'Main Hub',
        },
      ],
      service: '',
      placeService: '',
    };
  },
  computed: {
    ...mapGetters(['getEnvironmentVariables']),
    herokuKey() {
      return this.getEnvironmentVariables.HEROKU_GOOGLE_API_KEY;
    },
  },
  watch: {
    location(val) {
      if (val === '') {
        this.location_data = {};
      }
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.loadMapScript();
    });
  },
  methods: {
    loadMapScript() {
      if (window.google && window.google.maps) {
        setTimeout(() => {
          this.initMap();
        }, 180);
      } else {
        const script = document.createElement('script');
        script.onload = () => {
          this.initMap();
        };
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.herokuKey}`;
        document.head.appendChild(script);
      }
    },
    initMap() {
      this.service = new window.google.maps.places.AutocompleteService();
      this.placeService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );
    },
    // eslint-disable-next-line func-names
    search: _.debounce(function(val) {
      this.service.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: ['ke'] },
        },
        this.displaySuggestions,
      );
    }, 500),
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.suggestions = [];
        this.visible = false;
        return;
      }
      this.suggestions = predictions;
      this.visible = true;
    },
    handleFocus(val, input) {
      if (val) {
        this.search(val);
      }
    },
    handleSelect(item, input, placeId) {
      this.visible = false;
      this.suggestions = [];
      const fromPlaceId = placeId;
      this.placeService.getDetails(
        {
          placeId: fromPlaceId,
        },
        details => {
          this.location = details.name;
          const geo_location = details.geometry;
          const data = {
            address: this.location,
            lat: geo_location.location.lat(),
            long: geo_location.location.lng(),
          };

          this.location_data = data;
        },
      );
    },
    addHub() {
      if (
        this.location !== '' &&
        this.hub_name !== '' &&
        this.country !== '' &&
        this.hub_type !== ''
      ) {
        // process add hub flow
      } else {
        this.doNotification(2, 'Add Hub Error', 'Kindly provide all values');
      }
    },
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },
  },
};
</script>

<style scoped>
.batch-details-holder {
  background: #f8fafb;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  padding: 16px;
}
.add-hub-selector {
  margin-top: 3%;
  margin-bottom: 3%;
}
.add-hub-label {
  margin-bottom: 6.1px;
}
.add-hub-select {
  width: 100%;
}
.single-suggestion {
  cursor: pointer;
  height: 25px;
  padding-right: 15px;
}
</style>
