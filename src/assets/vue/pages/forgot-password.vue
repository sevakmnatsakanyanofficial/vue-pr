<template>
	<f7-page login-screen class="forgot-password-page">
		<div class="logo-container"
			 v-bind:style="{
                                'background': 'url(' + logoIcon + ') no-repeat center center',
								'height': '150px'
                           }">
			<div class="white-space" style="background-color: white;"></div>
			<div class="silver-space" style="background-color: #F5F5F5;"></div>
		</div>
		<f7-login-screen-title>Reset Password</f7-login-screen-title>
		<div v-if="!verified" style="margin: 24px auto; max-width: 480px;">
			<f7-link v-on:click="$f7router.back()" style="padding-left: 16px;">{{cancelTranslate}}</f7-link>
		</div>
		<div v-if="!verified">
			<f7-list form>
				<f7-list-item>
					<f7-label>Phone number</f7-label>
					<div class="item-input-wrap country-code">
						<select v-model="countryCode">
							<option v-for="(code, index) in getCountryCodes()" v-bind:value="code">{{code}}</option>
						</select>
					</div>
					<f7-input class="phone-number">
						<input v-model="phoneNumber" name="phone-number" placeholder="Your phone number" type="text">
					</f7-input>
				</f7-list-item>
				<f7-list-item>
					<f7-label>New Password</f7-label>
					<f7-input>
						<input v-model="password" name="password" type="password" placeholder="Your password">
					</f7-input>
				</f7-list-item>
			</f7-list>

			<f7-list>
				<f7-button v-on:click="sendVerificationSms()" class="button-outline" style="width: 40%; margin: auto; border-radius: 5px;">
					{{continueTranslate}}
				</f7-button>
			</f7-list>
		</div>

		<div v-if="verified">
			<f7-list form style="position: relative;">
				<f7-list-item>
					<f7-input>
						<input v-model="token" name="token" type="text" placeholder="Code" style="text-align: center;">
					</f7-input>
				</f7-list-item>
			</f7-list>

			<f7-list>
				<f7-block-footer style="text-align: center;">
					<p>for submit enter code from sms</p>
					<a v-on:click="sendVerificationSms()">
						resend code
					</a>
				</f7-block-footer>
				<f7-button v-on:click="resetPassword()" class="button-outline" style="width: 40%; margin: auto; border-radius: 5px;">
					{{continueTranslate}}
				</f7-button>
			</f7-list>
		</div>
	</f7-page>
</template>

<script>
	export default {
		data: function () {
			return {
                countryCode: '374',
                phoneNumber: '',
                token: '',
                password: '',
                verified: false,
                logoIcon: require('assets/images/logo.png')
			}
        },
	    methods: {
            sendVerificationSms: function () {
                if (!this.countryCode) {
                    this.$f7.dialog.alert('Country code cann`t be blank', 'Ooops')
                    return false
                }

                if (!this.isPhoneNumberValid(this.phoneNumber)) {
                    this.$f7.dialog.alert('Incorrect Phone Number', 'Ooops')
                    return false
                }

                if (!this.password || this.password.length < 6) {
                    this.$f7.dialog.alert('Password must contain min 6 characters.', 'Ooops')
                    return false
                }

                this.$f7.dialog.preloader()

                let options = {
                    headers: {
                        'Accept-Language': this.language
                    }
                }

                let body = {
                    'country_code': this.countryCode,
                    'phone_number': this.phoneNumber,
                }

                let self = this

                this.$http.post('send-verification-sms', body, options)
                    .then(function (response) {
                        let responseBody = response.body
                        if (responseBody.success === true) {
                            self.verified = true
                        } else {
                            self.getHttpErrorAlert(response)
                        }
                        self.$f7.dialog.close()
                    }, function (error) {
                        self.getHttpErrorAlert(error)
                        self.$f7.dialog.close()
                    })
            },
	        resetPassword: function () {
                if (!this.countryCode) {
                    this.$f7.dialog.alert('Country code cann`t be blank', 'Ooops')
                    return false
                }

                if (!this.phoneNumber) {
                    this.$f7.dialog.alert('Incorrect Phone Number', 'Ooops')
                    return false
                }

                if (!this.token) {
                    this.$f7.dialog.alert('Code can not be blank', 'Ooops')
                    return false
                }

                if (!this.password) {
                    this.$f7.dialog.alert('Password cann`t be blank', 'Ooops')
                    return false
                }

                this.$f7.dialog.preloader()

                let options = {
                    headers: {
                        'Accept-Language': this.language
                    }
                }

                let body = {
                    'country_code': this.countryCode,
                    'phone_number': this.phoneNumber,
					'token': this.token,
                    'password': this.password
                }

                let self = this

                this.$http.post('reset-password', body, options)
                    .then(function (response) {
                        let responseBody = response.body
                        self.$f7.dialog.close()
                        if (responseBody.success === true && responseBody.success) {
                            self.$f7.dialog.alert('You can sign in with new password.', 'Success')
                            self.$f7router.navigate('/login/')
                        } else {
                            self.getHttpErrorAlert(response)
                        }
                    }, function (error) {
                        self.$f7.dialog.close()
                        self.getHttpErrorAlert(error)
                    })
            }
		}
	}
</script>

<style>
	.forgot-password-page, .forgot-password-page .login-screen-content {
		background: #F5F5F5 !important;
	}

	.logo-container > div {
		z-index: -9999;
		position: relative;
		height: 50%
	}

	.country-code {
		width: 40px !important;
		float: left;
	}

	.phone-number {
		float: left;
		width: calc(100% - 40px) !important;
	}
</style>
