<script>
    // Import Common Methods mixin
    import CommonMethods from 'mixins/common-methods.vue'

    export default {
        mixins: [CommonMethods],
        methods: {
            getHttpErrorAlert: function(httpResponse) {
                if ((httpResponse.status).toString()[0] === '4') {
                    if (httpResponse.status === 401) {
                        this.logout()
                        return
                    } else {
                        this.$f7.dialog.alert(httpResponse.statusText, 'Ooops')
                    }
                } else if ((httpResponse.status).toString()[0] === '5') {
                    this.$f7.dialog.alert('Server Error', 'Ooops')
                } else {
                    this.$f7.dialog.alert('There is an error. Please, check Internet connection too', 'Ooops')
                }
            }
        }
    }
</script>
