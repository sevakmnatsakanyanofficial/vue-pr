<template>
	<f7-page>
		<f7-navbar v-bind:title="languageTranslate" back-link="Back"></f7-navbar>

		<f7-block strong>
			<f7-list form>
				<f7-list-item radio name="language" value="hy" title="Հայերեն" v-on:click="setLanguage('hy')" v-bind:checked="isChecked('hy')"></f7-list-item>
				<f7-list-item radio name="language" value="en" title="English" v-on:click="setLanguage('en')" v-bind:checked="isChecked('en')"></f7-list-item>
				<f7-list-item radio name="language" value="ru" title="Русский" v-on:click="setLanguage('ru')" v-bind:checked="isChecked('ru')"></f7-list-item>
			</f7-list>
		</f7-block>
	</f7-page>
</template>

<script>
	export default {
	    methods: {
	        isChecked: function (language) {
				let lng = this.language

				if (String(lng) === language) {
				    return true
				} else {
				    return false
				}
            }
		}
	}
</script>
