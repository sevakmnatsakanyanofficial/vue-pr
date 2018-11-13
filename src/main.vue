<template>
    <!-- App -->
    <div id="app">
        <f7-statusbar></f7-statusbar>
        <f7-panel left reveal>
            <f7-view url="/panel-left/" links-view=".view-main" />
        </f7-panel>
        <f7-view v-bind:url="mainPageUrl" :main="true" class="ios-edges"></f7-view>
    </div>
</template>
<script>
    // Import Local Storage Checking
    import LocalStorageChecking from 'mixins/local-storage-checking.vue'

    export default {
        mixins: [LocalStorageChecking],
        data: function () {
            return {
                mainPageUrl: '',
            }
        },
        created: function () {
            this.runApp()
        },
        mounted: function () {
            console.log(this.$device)
        },
        methods: {
            runApp: function () {
                let isAvailableAccessToken = this.isAvailableAccessToken()
                if (isAvailableAccessToken) {
                    this.mainPageUrl = '/'
                } else {
                    if (isAvailableAccessToken === null) {
                        this.mainPageUrl = '/error/'
                    } else {
                        document.addEventListener("deviceready", onDeviceReady, false);
                        function onDeviceReady() {
                            window.FirebasePlugin.unregister
                        }

                        localStorage.clear()

                        this.setLanguage('en')

                        this.mainPageUrl = '/login/'
                    }
                }
            },
            isAvailableAccessToken: function () {
                let hasStorage = this.isAvailableLocalStorage()

                if (hasStorage) {
                    // check and set language if empty
                    if (!this.language) {
                        this.setLanguage('en')
                    }

                    if (!localStorage.getItem('accessToken')) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return null
                }
            },
        }
    }
</script>
