export default [
  {
    path: '/',
    component: require('./assets/vue/pages/home.vue')
  },
  {
    path: '/panel-left/',
    component: require('./assets/vue/pages/panel-left.vue')
  },
  {
    path: '/login/',
    component: require('./assets/vue/pages/login.vue')
  },
  {
    path: '/signup/',
    component: require('./assets/vue/pages/signup.vue')
  },
  {
    path: '/booking/:branchId/:carTypeId',
    component: require('./assets/vue/pages/booking.vue')
  },
  {
    path: '/profile/',
    component: require('./assets/vue/pages/profile.vue')
  },
  {
    path: '/history/',
    component: require('./assets/vue/pages/history.vue')
  },
  {
    path: '/about/',
    component: require('./assets/vue/pages/about.vue')
  },
  {
    path: '/reset-password/:countryCode/:phoneNumber',
    component: require('./assets/vue/pages/reset-password.vue')
  },
  {
    path: '/forgot-password/',
    component: require('./assets/vue/pages/forgot-password.vue')
  },
  {
    path: '/language/',
    component: require('./assets/vue/pages/language.vue')
  },
  {
    path: '/error/',
    component: require('./assets/vue/pages/error.vue')
  }
]
