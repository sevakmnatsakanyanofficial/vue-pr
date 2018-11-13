<template>
	<f7-page>
		<f7-navbar v-bind:title="aboutTranslate" back-link="Back"></f7-navbar>
		

		<f7-block strong>
			<p>
				.
			</p>
			<p style="overflow: auto">
				<span class="social-icon-container">
					<a v-on:click="openUrlInAppBrowser('https://www.')"><i class="f7-icons">world</i></a>
				</span>
				<span class="social-icon-container">
					<a v-on:click="openUrlInAppBrowser('https://www.facebook.com')"><i class="f7-icons">social_facebook</i></a>
				</span>
				<span class="social-icon-container">
					<a v-on:click="openUrlInAppBrowser('https://www.instagram.com')"><i class="f7-icons">social_instagram</i></a>
				</span>
				<span class="social-icon-container">
					<a v-on:click="openUrlInAppBrowser('https://www.linkedin.com')"><i class="f7-icons">social_linkedin</i></a>
				</span>
			</p>
		</f7-block>
	</f7-page>
</template>

<script>
	export default {
        computed: {
            connection: function () {
                return window.connection
            }
        },
	    methods: {
            openUrlInAppBrowser: function (url) {
                if (this.connection) {
                    let ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes')
                }
            }
		}
	}
</script>

<style scoped>
	.social-icon-container {
		width: calc(100% / 4);
		display: block;
		float: left;
		text-align: center;
	}
</style>
