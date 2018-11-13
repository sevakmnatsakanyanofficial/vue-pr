<script>
    export default {
        methods: {
            isPhoneNumberValid: function (phoneNumber) {
                let pattern = /^[0-9]{8,8}$/
                return phoneNumber.match(pattern)
            },
            getCountryCodes: function () {
                return [
                    '374'
                ]
            },
            logout: function () {
//                if (this.watchID) {
//                    navigator.geolocation.clearWatch(this.watchID);
//				}

                document.addEventListener("deviceready", onDeviceReady, false);
                function onDeviceReady() {
                    window.FirebasePlugin.unregister
                }

                localStorage.clear()

                this.setLanguage('en')

                this.$f7.panel.close()

                this.$f7.views.main.router.navigate('/login/', {
                    reloadAll: true,
                    ignoreCache: true
                });
            }
        }
    }
</script>
