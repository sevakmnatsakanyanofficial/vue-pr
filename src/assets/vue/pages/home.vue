<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link class="panel-open" open-panel="left" icon="fa fa-bars"></f7-link>
            </f7-nav-left>
            <div class="title">name </div>
        </f7-navbar>

        <div class="map-container">
            <GmapMap style="width: 100%; min-height: 100%; height: auto;"
                     v-bind:center="mapCenter"
                     v-bind:zoom="mapStartZoom"
                     v-bind:disableDefaultUI="true"
                     v-bind:gestureHandling="'greedy'"
                     v-bind:styles="mapStyles"
            >
                <GmapCluster v-bind:maxZoom="mapClusterMaxZoom">
                    <GmapMarker
                            v-for="(xxxx, index) in xxxxx"
                            v-bind:position="xxxx.position"
                            v-bind:icon="xxxxxx"
                            v-on:click="openInfoSheet(xxxx.id)"
                    >
                    </GmapMarker>
                </GmapCluster>

            </GmapMap>
        </div>

        <f7-sheet v-on:sheet:open="initSwiper()" v-on:sheet:closed="setSelectedType(null)" id="InfoSheet"
                  v-bind:style="{
                        'width': 'calc(100% - 30px)',
                        'margin-left': '15px',
                        'margin-right': '15px',
                        'margin-bottom': '13px',
                        'border': '7px',
                        'border-radius': '7px'
                  }">
            <f7-toolbar style="border-top-left-radius: 7px; border-top-right-radius: 7px;">
                <f7-link></f7-link>
                <f7-link style="color: white;" class="sheet-close">
                    {{closeTranslate}}
                </f7-link>
            </f7-toolbar>
            <div class="block" style="margin-top: 0;">
                <f7-row no-gap>
                    <f7-col width="100">
                        <p class="sd-data">
                            <span>{{selectedTitle}}</span>
                            <span
                                    v-bind:style="{
									    'background': 'url(' + feedbackStarSmallIcon + ') left center',
									    'width': (16 * (5 - selectedRating)) + 'px',
									    'text-align': 'center',
									    'height': '15px',
									    'float': 'right',
									    'margin-top': '5px'
									}"
                            >
                            </span>
                            <span
                                    v-bind:style="{
                                        'background': 'url(' + feedbackStarFillSmallIcon + ') left center',
										'width': (17 * selectedRating) + 'px',
										'text-align': 'center',
										'height': '15px',
										'float': 'right',
										'margin-top': '5px'
                                    }"
                            >
                            </span>
                        </p>
                        <p class="-data">
                            <span>{{selectedAddress}}</span>
                        </p>
                    </f7-col>
                    
                </f7-row>
                <p v-bind:class="{disabled: !selectedType}" class="row">
                    <a v-on:click="booking()" style="width: 100%;" class="button button-outline sheet-close">
                        {{continueTranslate}}
                    </a>
                </p>
            </div>
        </f7-sheet>

        <div v-on:click="setMapCenter(null, null)" class="navigation-icon">
            <i class="f7-icons" slot="media">navigation_fill</i>
        </div>
        <div v-if="!connection" class="internet-connection-error-alert">
            <p>There is an error with internet connection.</p>
            <div  v-on:click="onRefresh()" class="refresh-icon">
                <i class="f7-icons" slot="media">refresh_round_fill</i>
            </div>
        </div>
        <div v-if="!geolocationDetected" class="geolocation-error-alert">
            <div class="background"></div>
            <p>We can not detect your location</p>
        </div>

    </f7-page>
</template>
<script>
    // Import Common Methods mixin
    import CommonMethods from 'mixins/common-methods.vue'

    export default {
        mixins: [CommonMethods],
        data: function () {
            return {
                accessTokenAvailability: false,
                geolocationDetected: true,
                userLocationLat: 40.177538,
                userLocationLng: 44.512654,
                mapStartZoom: 18,
                mapClusterMaxZoom: 12,
                watchID: 0,
                rateValue: null,
                clickCount: 0,
                clickTimer: null,
                feedbackStarIcon: require('assets/images/rating.png'),
                feedbackStarFillIcon: require('assets/images/rating-fill.png'),
                feedbackStarSmallIcon: require('assets/images/rating-small.png'),
                feedbackStarFillSmallIcon: require('assets/images/rating-fill-small.png'),
                mapStyles: [
                    {
                        "featureType": "poi.attraction",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.government",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.medical",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.school",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.sports_complex",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#400000"
                            }
                        ]
                    }
                ]
            }
        },
        computed: {
            connection: function () {
                return window.connection
            },
            mapCenter: function () {
                return {lat: this.userLocationLat, lng: this.userLocationLng}
            }
        },
        mounted: function () {
            let self = this
            this.$f7.utils.nextTick(function () {
                self.initFunctions()
            })
        },
        methods: {
            initFunctions: function () {
                let self = this

                window.FirebasePlugin.onNotificationOpen(function(notification) {
                    let bookingId = null

                    console.log(notification);
                    if (notification.tap) {
                        // app is not running
                        console.log('not running')

                        if (typeof notification.booking_canceled !== 'undefined') {
                            if (Boolean(notification.booking_canceled) === true) {
                                if (typeof notification.booking_id !== 'undefined') {
                                    if (Number(notification.booking_id)) {
                                        self.getCanceledBooking(bookingId)
                                    }
                                }
                            }
                        }
                    } else {
                        //app is running
                        console.log('running')
                        if (typeof notification.booking_completed !== 'undefined') {
                            if (Boolean(notification.booking_completed) === true) {
                                if (typeof notification.booking_id !== 'undefined') {
                                    if (Number(notification.booking_id)) {
                                        bookingId = notification.booking_id
                                    }
                                }
                                self.getNotRatedBookings(bookingId)
                            }
                        }

                        if (typeof notification.booking_canceled !== 'undefined') {
                            if (Boolean(notification.booking_canceled) === true) {
                                if (typeof notification.booking_id !== 'undefined') {
                                    if (Number(notification.booking_id)) {
                                        self.getCanceledBooking(bookingId)
                                    }
                                }
                            }
                        }
                    }
                }, function(error) {
                    console.log('Notifffffffffffff errrrr');
                    console.error(error);
                    // reload maybe
                });

//                // for ios only
//                window.FirebasePlugin.hasPermission(function(data){
//                    console.log(data.isEnabled);
//                    if (!data.isEnabled)
//                    	window.FirebasePlugin.grantPermission();
//                });

//                if (!this.connection) {
//                    if (this.watchID) {
//                        navigator.geolocation.clearWatch(self.watchID);
//                    }
//                }

                function onSuccess(position) {
                    self.userLocationLat = position.coords.latitude
                    self.userLocationLng = position.coords.longitude

                    self.geolocationDetected = true;

                }

                function onError(error) {
//                    self.geolocationDetected = false;
                    console.log(error.message)

                    if (error.code === error.PERMISSION_DENIED) {
                        self.$f7.dialog.alert(error.message, 'Ooops')
                        cordova.plugins.diagnostic.isLocationAvailable(function(available){
                            console.log("Location is " + (available ? "available" : "not available"));
                        }, function(error){
                            console.error("The following error occurred: "+error);
                            cordova.plugins.diagnostic.switchToSettings(function(){
                                console.log("Successfully switched to Settings app");
                            }, function(error){
                                console.error("The following error occurred: "+error);
                            });
                        });
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        self.$f7.dialog.alert(error.message, 'Ooops')
                    } else {
                        // PositionError.TIMEOUT
                        self.$f7.dialog.alert('Can not detect your location.', 'Ooops')
                        cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
                            console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
                        }, function(error){
                            console.error("The following error occurred: "+error);
                            cordova.plugins.diagnostic.switchToSettings(function(){
                                console.log("Successfully switched to Settings app");
                            }, function(error){
                                console.error("The following error occurred: "+error);
                            });
                        });
                    }
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 3000 });

                if (self.connection) {
//                    self.watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000 });

                    self.getNotRatedBookings(null)
                }
            },
            booking: function () {

                /////
            },
            setSelectedType: function (id) {
                ////
            },
            isSwiperItemSelected: function (TypeId) {
                return this.selectedType === TypeId
            },
            isTypeEnableFor: function (TypeId) {
                let result = false
                this.selectedType.forEach(function (data) {
                    if (data.id === typeId) {
                        result = true
                        return
                    }
                })
                return result
            },
            getTypes: function () {
                let self = this

                if (self.connection) {
                    self.$f7.dialog.preloader()

                    const accessToken = localStorage.getItem('accessToken')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': self.language
                        },
                        params: {
                            'per-page': 1000000
                        }
                    }

                    self.$http.get('some-types', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
                                self.Types = responseBody.items.map(function (data) {
                                    return {
                                        id: Number(data.id),
                                        name: data.name,
                                        path: data._links.icon_path.href,
                                        icon: data.icon,
                                        mime_type: data.mime_type
                                    }
                                })
                                self.$f7.dialog.close()
                            } else {
                                self.$f7.dialog.close()
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.$f7.dialog.close()
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            getAll: function () {
                let self = this

                if (self.connection) {
                    self.$f7.dialog.preloader()

                    const accessToken = localStorage.getItem('accessToken')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': self.language,
                            'X-User-Latitude': (self.userLocationLat).toString(),
                            'X-User-Longitude': (self.userLocationLng).toString(),
                        },
                        params: {
                            'fields': 'id,title,country_code,phone_number,address,latitude,longitude',
                            'expand': 'ratingAverage',
                            'per-page': 1000000
                        }
                    }

                    self.$http.get('somerequest', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
                                self.someee = responseBody.items.map(function (data) {
                                    let Types = data.some.map(function (data) {
                                        return {
                                            id: data.some_type_id
                                        }
                                    })

                                    return {
                                        id: Number(data.id),
                                        title: data.title,
                                        address: data.address,
                                        rating: data.ratingAverage,
                                        someTypes: someTypes,
                                        position: {lat: Number(data.latitude), lng: Number(data.longitude)}
                                    }
                                })
                                self.$f7.dialog.close()
                            } else {
                                self.$f7.dialog.close()
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.$f7.dialog.close()
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            findById: function (id) {
                for (let i = 0; i < this.some.length; i++) {
                    if (this.some[i].id === id) {
                        return this.some[i]
                    }
                }
            },
            isDoubleClick: function (event) {
                this.clickCount ++
                if(this.clickCount === 1) {
                    let self = this
                    this.clickTimer = setTimeout(function() {
                        console.log('click')
                        self.clickCount = 0
                    }, 700)
                    return false
                } else {
                    clearTimeout(this.clickTimer)
                    console.log('dbclick')
                    this.clickCount = 0
                    return true
                }
            },
            openInfoSheet: function () {
                ////
            },
            initSwiper: function () {
                let mySwiper = this.$f7.swiper.create('.swiper-container', {
                    speed: 400,
                    spaceBetween: 30,
                    direction: 'horizontal',
                    setWrapperSize: true,
                    effect: "slide", // "slide", "fade", "cube", "coverflow", "flip"
                    slidesPerView: 3,
                    centeredSlides: false,
                    loop: false
                });

                mySwiper.init()
            },
            getCanceledBooking: function (bookingId) {
                let self = this

                if (self.connection) {

                    const accessToken = localStorage.getItem('accessToken')

                    const userId = localStorage.getItem('userId')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': self.language
                        },
                        params: {
                            'fields': 'id,started_at',
                            's[id]': bookingId,
                            's[created_by]': Number(userId),
                        },
                    }

                    self.$http.get('bookings', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
                                responseBody.items.forEach(function (data) {
                                    let date = new Date(data.started_at * 1000)
                                    let year = date.getFullYear()
                                    let month = date.getMonth()
                                    let day = date.getDay()
                                    let hours = date.getHours()
                                    let minutes = "0" + date.getMinutes()
                                    let formattedDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes.substr(-2)
                                    self.$f7.dialog.create({
                                        title:  'Ooops',
                                        text: 'Booking is canceled by provider ' + data.some.title + ' for ' + formattedDate,
                                        buttons: [
                                            {
                                                text: 'OK',
                                            },
                                        ],
                                    }).open()
                                })
                            } else {
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            getNotRatedBookings: function (bookingId) {
                let self = this

                if (self.connection) {

                    const accessToken = localStorage.getItem('accessToken')

                    const userId = localStorage.getItem('userId')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': self.language
                        },
                        params: {
                            'fields': 'id',
                            's[created_by]': Number(userId),
                            's[status]': 'completed',
                            's[rated]': 0,
                            'per-page': 5
                        },
                    }

                    if (bookingId) {
                        options.params['s[id]'] = bookingId
                    }

                    self.$http.get('bookings', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
                                responseBody.items.forEach(function (data) {
                                    console.log(data.id)
                                    self.$f7.dialog.create({
                                        title:  'Send your feedback',
                                        text: 'На сколько оцениваете предоставленные Вам услуги от провайдера',
                                        content:
                                        '<div>' +
                                        '<img id="feedback-star-1" src="'+ self.feedbackStarIcon +'" width="20%">' +
                                        '<img id="feedback-star-2" src="'+ self.feedbackStarIcon +'" width="20%">' +
                                        '<img id="feedback-star-3" src="'+ self.feedbackStarIcon +'" width="20%">' +
                                        '<img id="feedback-star-4" src="'+ self.feedbackStarIcon +'" width="20%">' +
                                        '<img id="feedback-star-5" src="'+ self.feedbackStarIcon +'" width="20%">' +
                                        '</div>',
                                        buttons: [
                                            {
                                                text: self.cancelTranslate,
                                                bold: true,
                                                onClick: function() {
                                                    // use value 0 for cancel and not saving as rating
                                                    self.setRating(data.id, 0)
                                                }
                                            },
                                            {
                                                text: self.sendTranslate,
                                                bold: true,
                                                onClick: function() {
                                                    self.setRating(data.id, self.rateValue)
                                                }
                                            }
                                        ],
                                        on: {
                                            opened: function () {
                                                for (let i = 1; i <= 5; i++) {
                                                    self.$$('#feedback-star-' + i).on('click', function () {
                                                        self.setRatingStars(i)
                                                    })
                                                }
                                            }
                                        }
                                    }).open()
                                })
                            } else {
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            setRatingStars: function (value) {
                let self = this
                self.rateValue = value
                let i;
                for (i = 1; i <= value; i++) {
                    document.getElementById('feedback-star-'+i).src = self.feedbackStarFillIcon
                }
                for (let j = i; j <= 5; j++) {
                    document.getElementById('feedback-star-'+j).src = self.feedbackStarIcon
                }
            },
            setRating: function (bookingId, value) {
                let self = this

                if (self.connection) {
                    self.$f7.dialog.preloader()

                    const accessToken = localStorage.getItem('accessToken')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': self.language
                        }
                    }

                    let body = {
                        'value': value
                    }

                    self.$http.post('bookings/' + bookingId + '/rate', body, options)
                        .then(function (response) {
                            self.$f7.dialog.close()
                            if (response.ok === true) {
                                self.rateValue = null
                                self.$f7.dialog.alert('We save your rate success.', 'Thank you')
                            } else {
                                self.rateValue = null
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.rateValue = null
                            self.$f7.dialog.close()
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            onRefresh: function () {
                if (this.connection) {
                    this.initFunctions()
                }
            },
            setMapCenter: function (lat, lng) {
                if (lat && lng) {
                    this.userLocationLat = lat
                    this.userLocationLng = lng
                } else {
                    let self = this

                    function onSuccess(position) {
                        self.userLocationLat = 0
                        self.userLocationLng = 0
                        setTimeout(function () {
                            self.userLocationLat = position.coords.latitude
                            self.userLocationLng = position.coords.longitude
                        }, 100)
                    }

                    function onError(error) {
                        if (error.code === error.PERMISSION_DENIED) {
                            self.$f7.dialog.alert(error.message, 'Ooops')
                        } else if (error.code === error.POSITION_UNAVAILABLE) {
                            self.$f7.dialog.alert(error.message, 'Ooops')
                        } else {
                            // PositionError.TIMEOUT
                            self.$f7.dialog.alert(error.message, 'Ooops')
                        }
                    }

                    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 3000 });
                }
            },
        }
    };

</script>

<style scoped>
    p {
        margin: 0.5em 0;
    }

    .map-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }

    .swiper-slide {
        background: #fff;
        box-sizing: border-box;
        border: 1px solid #ccc;
        min-height: 100%;
        height: auto;
    }

    .swiper-slide span {
        text-align:center;
        vertical-align: middle;
        display: block;
        margin: 53px 0px 0px 0px;
        font-size: 21px;
        width: 100%;
        overflow-x: hidden;
    }

    .swiper-container {
        height: 85px;
    }

    .navigation-icon {
        position: absolute;
        right: 3%;
        bottom: 5%;
        z-index: 9999;
    }

    .internet-connection-error-alert {
        position: absolute;
        text-align: center;
        bottom: calc(50% - 2em);
        width: 100%;
        z-index: 9999;
    }

    .geolocation-error-alert > div {
        position: absolute;
        text-align: center;
        z-index: 9999;
        background-color: silver;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.7;
    }

    .geolocation-error-alert > p {
        position: absolute;
        text-align: center;
        top: 50%;
        left: 0;
        right: 0;
        z-index: 999999;
        font-size: 1.5em;
    }

    .internet-connection-error-alert > p {
        font-size: 2em;
    }

    .refresh-icon {
        right: calc(50% - 2em);
        z-index: 9999;
    }

    .refresh-icon > i {
        font-size: 4em;
    }

    .content-block {
        margin: 0 !important;
        margin-bottom: 22px !important;
    }

    .swiper-slide-border-none {
        border: none;
    }

    .swiper-slide-disable {
        opacity: 0.5;
        pointer-events: none;
    }

    .swiper-slide {
        border-radius: 10px;
    }

    .internet-connection-error-alert .refresh-icon:active {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
    }
</style>
