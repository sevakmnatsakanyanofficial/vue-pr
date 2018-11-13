// Import Vue
import Vue from 'vue'

// Import Google Map
import * as VueGoogleMaps from 'vue2-google-maps'

// Import Google Map Cluster
import GmapCluster from 'vue2-google-maps/dist/components/cluster'

// Import Vue Resource
import VueResource from 'vue-resource'

// Import Framework7
import Framework7 from 'framework7/dist/framework7.esm.bundle.js'

// Import Framework7 Vue
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js'

// Import F7 Style
import Framework7CSS from 'framework7/dist/css/framework7.css'

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css'

// Import Fontawesome Theme Styles
import FontAwesome from 'font-awesome/css/font-awesome.css'

// Import App Custom Styles
import AppStyles from './assets/sass/main.scss'

// Import App Component
import app from './main.vue'

// Import Routes
import routes from './routes.js'

// Import Vuex Storage
import store from './assets/vuex/storage.js'

// Import Translation mixin
import Translation from 'mixins/translation.vue'

// Import Error Handler mixin
import HttpErrorHandler from 'mixins/http-error-handler.vue'

// Install Plugin
Vue.use(Framework7Vue, Framework7)

// Init Google Map Vue Plugin
Vue.use(VueGoogleMaps, {
  load: {
    key: 'awdsd',
    // libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})

// Init Vue Resource
Vue.use(VueResource)

// Init Translation mixin
Vue.mixin(Translation)

// Init Http Error Handler mixin
Vue.mixin(HttpErrorHandler)

// Init google map cluster
Vue.component('GmapCluster', GmapCluster)

// Init common http data
// Local
Vue.http.options.root = 'http://api.some.loc/v1/'
Vue.http.headers.common['X-Api-Validation-Key'] = 'ascasds' //
Vue.http.headers.common['X-User-Timezone'] = (new Date().getTimezoneOffset()).toString() // /60 for hours
Vue.http.headers.common['X-User-Time'] = (Math.floor(new Date().getTime()/1000)).toString()

let theme = 'md'
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0]
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Init internet connection listener
  if (navigator.connection.type !== Connection.NONE) {
    window.connection = true
  }

  document.addEventListener("offline", onOffline, false);

  function onOffline() {
    window.connection = false
  }

  document.addEventListener("online", onOnline, false);

  function onOnline() {
    window.connection = true
  }
}

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app,
  },
  framework7: {
    id: 'asdcs',
    theme, // md or ios
    // smartSelectOpenIn: 'picker',
    // /* Uncomment to enable Material theme: */
    // materialRipple: false,
    // fastClicks: true,
    // animatePages: false,
    // swipeout: false,
    // material: true,
  },
  routes,
})
