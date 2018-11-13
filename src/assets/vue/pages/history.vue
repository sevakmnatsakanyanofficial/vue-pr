<template>
	<f7-page infinite @infinite="onInfiniteScroll">
		<f7-navbar v-bind:title="historyTranslate" back-link="Back"></f7-navbar>

		<f7-block strong style="padding-left: 0; padding-right: 0;">
			<f7-card v-for="(booking, index) in bookings" class="data-table">
				<f7-card-content>
					<table>
						<tbody>
						<tr>
							<td class="label-cell">//</td>
							<td class="label-cell">//</td>
						</tr>
						<tr>
							<td class="label-cell">{{statusTranslate}}</td>
							<td class="label-cell">{{booking.status}}</td>
						</tr>
						<tr>
							<td class="label-cell">{{totalTranslate}}</td>
							<td class="label-cell">{{booking.total_price}} &#1423;</td>
						</tr>
						</tbody>
					</table>
				</f7-card-content>
				<f7-card-content>
					<f7-chip v-for="(service, index) in booking.services" v-bind:text="getServiceTypeTitle(service.id)"></f7-chip>
				</f7-card-content>
				<f7-card-footer v-if="booking.cancelHref">
					<a href="#" class="link" v-on:click="cancelBooking(booking)">{{cancelTranslate}}</a>
				</f7-card-footer>
			</f7-card>
		</f7-block>

	</f7-page>
</template>

<script>
    export default {
        data: function () {
            return {
                bookings: [],
				serviceTypes: [],
				_links: null,
				_meta: null,
                loading: false
            }
        },
		computed: {
            connection: function () {
                return window.connection
            }
        },
        mounted: function () {
            let self = this
            this.$f7.utils.nextTick(function () {
                self.getServicesTypes()
                self.onInfiniteScroll()
            })
        },
        methods: {
            getHoursMinutes: function (hours, minutes) {
				return hours + ':' + minutes
            },
            getMonthYear: function (month, year) {
                return month + '.' + year
            },
            getFullDateWithTime: function (day, month, year, hours, minutes) {
                return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
            },
            getServiceTypeTitle: function (serviceTypeId) {
                let title = ''
                this.serviceTypes.forEach(function (data) {
                    if (data.id === Number(serviceTypeId)) {
                        title = data.title
						return
                    }
                })
				return title
            },
            getServicesTypes: function () {
                let self = this
                if (self.connection) {
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

                    self.$http.get('service-types', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
								self.serviceTypes = responseBody.items.map(function (data) {
                                    return {
                                        id: data.id,
                                        title: data.title
									}
                                })
                            } else {
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            getBookings: function (nextPage = 1) {
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
                            'fields': 'id,branch_id,amount,decimal_part,status,started_at,ended_at',
                            'expand': 'branch,bookingServices',
                            's[user_id]': Number(userId),
                            'sort': '-ended_at',
                            'per-page': 4,
                            'page': nextPage
                        }
                    }

                    self.$http.get('bookings', options)
                        .then(function (response) {
                            let responseBody = response.body
                            if (response.ok === true) {
                                self._links = responseBody._links
                                self._meta = responseBody._meta

								responseBody.items.forEach(function (data) {
                                    let startDate = new Date(data.started_at * 1000)

                                    let startYear = startDate.getFullYear()
                                    let startMonth = startDate.getMonth() + 1
                                    let startDay = startDate.getDate()
                                    let startHours = startDate.getHours()
                                    let startMinutes = startDate.getMinutes()

                                    if (startDay < 10) {
                                        startDay = '0' + startDay
                                    }

                                    if (startMinutes < 10) {
                                        startMinutes = '0' + startMinutes
                                    }

                                    if (startHours < 10) {
                                        startHours = '0' + startHours
                                    }

                                    if (startMonth < 10) {
                                        startMonth = '0' + startMonth
                                    }

                                    let endDate = new Date(data.ended_at * 1000)

                                    let endYear = endDate.getFullYear()
                                    let endMonth = endDate.getMonth() + 1
                                    let endDay = endDate.getDate()
                                    let endHours = endDate.getHours()
                                    let endMinutes = endDate.getMinutes()

                                    if (endDay < 10) {
                                        endDay = '0' + endDay
                                    }

                                    if (endMinutes < 10) {
                                        endMinutes = '0' + endMinutes
                                    }

                                    if (endHours < 10) {
                                        endHours = '0' + endHours
                                    }

                                    if (endMonth < 10) {
                                        endMonth = '0' + endMonth
                                    }

                                    let services = data.bookingServices.map(function (data) {
										return {
										    id: data.branchService.service_type_id
										}
                                    })

									let cancelHref = ''

									if (typeof data._links !== 'undefined' && typeof data._links.cancel !== 'undefined') {
                                        cancelHref = data._links.cancel.href
									}

                                    let result = {
                                        id: Number(data.id),
                                        start_year: startYear,
                                        start_month: startMonth,
                                        start_day: startDay,
                                        start_hours: startHours,
                                        start_minutes: startMinutes,
                                        end_year: endYear,
                                        end_month: endMonth,
                                        end_day: endDay,
                                        end_hours: endHours,
                                        end_minutes: endMinutes,
                                        branch_id: data.branch_id,
                                        branch_title: data.branch.title,
                                        branch_address: data.branch.address,
                                        total_price: (data.amount / data.decimal_part),
                                        services: services,
                                        status: data.status,
                                        cancelHref: cancelHref
                                    }

                                    self.bookings.push(result)
                                })

                                if (self._meta.pageCount === 1 || self._meta.totalCount === 0) {
                                    self.$f7.infiniteScroll.destroy(self.$$('.infinite-scroll'))
                                    // Remove preloader
                                    self.$$('.infinite-scroll-preloader').remove()
                                }

                            } else {
                                self.$f7.infiniteScroll.destroy(self.$$('.infinite-scroll'))
                                // Remove preloader
                                self.$$('.infinite-scroll-preloader').remove()
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.$f7.infiniteScroll.destroy(self.$$('.infinite-scroll'))
                            // Remove preloader
                            self.$$('.infinite-scroll-preloader').remove()
                            self.getHttpErrorAlert(error)
                        })
                } else {
                    self.$f7.infiniteScroll.destroy(self.$$('.infinite-scroll'))
                    // Remove preloader
                    self.$$('.infinite-scroll-preloader').remove()
				}
            },
            cancelBooking: function (booking) {
                let self = this
                if (self.connection) {
                    self.$f7.dialog.preloader()

                    const accessToken = localStorage.getItem('accessToken')

                    let options = {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                            'Accept-Language': this.language
                        }
                    }

                    let body = {}

                    self.$http.post(booking.cancelHref, body, options)
                        .then(function (response) {
                            self.$f7.dialog.close()
                            if (response.ok === true) {
                                let responseBody = response.body
                                self.$f7.dialog.alert('Booking Canceled', 'Success')
                                booking.status = responseBody.status

                                let cancelHref = ''

                                if (typeof responseBody._links !== 'undefined' && typeof responseBody._links.cancel !== 'undefined') {
                                    cancelHref = responseBody._links.cancel.href
                                }

								booking.cancelHref = cancelHref
                            } else {
                                self.getHttpErrorAlert(response)
                            }
                        }, function (error) {
                            self.$f7.dialog.close()
                            self.getHttpErrorAlert(error)
                        })
                }
            },
            onInfiniteScroll: function () {
                let self = this
                // Exit, if loading in progress
                if (self.loading)
                    return

                // Set loading flag
                self.loading = true

                // Emulate 1s loading
                setTimeout(function () {
                    // Reset loading flag
                    self.loading = false

                    if (self._meta && self._meta.currentPage === self._meta.pageCount) {
                        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                        self.$f7.infiniteScroll.destroy(self.$$('.infinite-scroll'))
                        // Remove preloader
                        self.$$('.infinite-scroll-preloader').remove()
                        return
                    }

                    let nextPage = 1

                    if (self._meta) {
                        nextPage = self._meta.currentPage + 1
                    }

                    // Generate new items HTML
                    self.getBookings(nextPage)

                }, 1000)
            }
        }
    }
</script>

<style scoped>
	.infinite-scroll-preloader {
		margin-top:-20px;
		margin-bottom: 10px;
		text-align: center;
	}
	.infinite-scroll-preloader .preloader {
		width:34px;
		height:34px;
	}
</style>
