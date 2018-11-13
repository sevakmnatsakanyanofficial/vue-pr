<script>
    /**
     * for translation to the name of the text need add Translate
     */
    export default {
        data: function () {
            return {
                language: localStorage.getItem('language')
            }
        },
        computed: {
            settingsTranslate: function () {
                let language = this.language

                language = String(language)

                switch(language) {
                    case 'hy':
                        return 'Կարգավորումներ'
                        break
                    case 'ru':
                        return 'Настройки'
                        break
                    default:
                        return 'Settings'
                        break
                }
            },
            languageTranslate: function () {
                let language = this.language

                language = String(language)

                switch(language) {
                    case 'hy':
                        return 'Լեզու'
                        break
                    case 'ru':
                        return 'Язык'
                        break
                    default:
                        return 'Language'
                        break
                }
            },
            aboutTranslate: function () {
                let language = this.language

                language = String(language)

                switch(language) {
                    case 'hy':
                        return 'Մեր մասին'
                        break
                    case 'ru':
                        return 'О нас'
                        break
                    default:
                        return 'About'
                        break
                }
            },
            closeTranslate: function () {
                let language = this.language

                language = String(language)

                switch(language) {
                    case 'hy':
                        return 'Փակել'
                        break
                    case 'ru':
                        return 'Закрыть'
                        break
                    default:
                        return 'Close'
                        break
                }
            },
        },
        methods: {
            setLanguage: function (language) {
                var languageChangedEvent = new Event('language:changed')
                localStorage.setItem('language', language)
                this.language = localStorage.getItem('language')
                document.dispatchEvent(languageChangedEvent)
            },
            changeLanguage: function () {
                this.language = localStorage.getItem('language')
            }
        },
        created: function () {
            this.$nextTick(function () {
                document.addEventListener('language:changed', this.changeLanguage)
            })
        }
    }
</script>
