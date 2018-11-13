<script>
    export default {
        methods: {
            isAvailableLocalStorage: function() {
                var mod = 'modernizr'
                try {
                    localStorage.setItem(mod, mod)
                    localStorage.removeItem(mod)
                    return true
                } catch(e) {
                    return false
                }
            }
        }
    }
</script>
