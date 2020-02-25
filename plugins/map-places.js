import Vue from 'vue';
import VueGoogleAutocomplete from 'vue-google-autocomplete';

Vue.use(VueGoogleAutocomplete);

if (process.BROWSER_BUILD) {
  Vue.component('vue-google-autocomplete', VueGoogleAutocomplete);
}
