<template>
	<div class="bg-body d-flex flex-column align-items-stretch flex-center rounded-3 w-md-600px p-xl-20 p-lg-20 p-md-20 p-sm-20 p-10 mt-10 mx-auto"
		bis_skin_checked="1">
		<div class="d-flex flex-center flex-column flex-column-fluid px-lg-10" bis_skin_checked="1">
			<div class="d-flex flex-stack py-2 w-100 justify-content-between">
				<div class="me-2">
					<a @click="switchModule('login')" class="btn btn-icon bg-light rounded-circle">
						<span class="svg-icon svg-icon-dark svg-icon-2hx">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path opacity="0.5"
									d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
									fill="currentColor"></path>
								<path
									d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
									fill="currentColor"></path>
							</svg>
						</span>
					</a>
				</div>
				<div class="m-0">
					<span class="text-gray-500 fw-bold fs-5 me-2">Already a member ?</span>
					<a href="javascript:void(0)" class="link-primary fw-bold fs-5" @click="switchModule('login')">Sign
						In</a>
				</div>
			</div>
			<div class="pb-20">
				<VForm class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" novalidate="novalidate"
					id="kt_login_signup_form" :validation-schema="registration" @submit="onSubmitSignUp">
					<div class="text-start mb-10">
						<h1 class="text-gray-900 mb-3 fs-3x">Sign Up</h1>
						<div class="text-gray-500 fw-semibold fs-6">Introducing a simple & virtuous way to start and
							grow your business</div>
					</div>
					<div class="row fv-row mb-7">
						<div class="col-xl-6">
							<Field class="form-control form-control-lg form-control-solid" type="text" name="username"
								placeholder="Username" autocomplete="off"
								style="background-color: #f4f4f4f4 !important;" v-model="username" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="username" />
								</div>
							</div>
						</div>
						<div class="col-xl-6">
							<Field class="form-control form-control-lg form-control-solid" type="text"
								placeholder="Email" name="email" autocomplete="off"
								style="background-color: #f4f4f4f4 !important;" v-model="email" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="email" />
								</div>
							</div>
						</div>
					</div>
					<div class="fv-row mb-10" data-kt-password-meter="true">
						<div class="mb-1">
							<div class="position-relative mb-3">
								<Field class="form-control form-control-lg form-control-solid" type="password"
									placeholder="Password" name="password" autocomplete="off"
									style="background-color: #F8F8F8F8;"v-model="password"  />
								<div class="fv-plugins-message-container">
									<div class="fv-help-block">
										<ErrorMessage name="password" />
									</div>
								</div>
							</div>
							<div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
								<div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
								<div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
								<div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
								<div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
							</div>
						</div>
						<div class="text-muted">Use 8 or more characters with a mix of letters, numbers & symbols.</div>
					</div>
					<div class="fv-row mb-10">
						<Field class="form-control form-control-lg form-control-solid" type="password"
							placeholder="Confirm Password" name="password_confirmation" autocomplete="off"
							style="background-color: #F8F8F8F8;" v-model="password_confirmation" />
						<div class="fv-plugins-message-container">
							<div class="fv-help-block">
								<ErrorMessage name="password_confirmation" />
							</div>
						</div>
					</div>
					<div class="d-flex flex-stack">
						<button type="button" ref="submitButton" id="submit_btn" class="btn btn-dark" @click="onSubmitSignUp">
							<span class="indicator-label">Continue</span>
							<span class="indicator-progress">Please wait...
								<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
							</span>
						</button>
					</div>
				</VForm>
			</div>
			<div class="d-flex flex-stack mt-15 justify-content-between w-100" bis_skin_checked="1">
				<div class="d-flex" bis_skin_checked="1">
					<a href="https://silquetech.com" target="_blank">CoSys</a>
				</div>
				<div class="d-flex fw-semibold text-primary fs-base gap-5" bis_skin_checked="1">
					<a href="/legal" target="_blank" bis_skin_checked="1">Terms</a>
					<a href="/legal" target="_blank" bis_skin_checked="1">Plans</a>
					<a href="/contact" target="_blank" bis_skin_checked="1">Contact Us</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted } from 'vue';
import { ErrorMessage, Field, Form as VForm } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, type User, type SignupData } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { PasswordMeterComponent } from '@/assets/ts/components';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import ApiService from '@/core/services/ApiService';

export default defineComponent({
	name: 'SignUp',
	components: {
		Field,
		VForm,
		ErrorMessage,
	},
	setup() {
		const store = useAuthStore();
		const router = useRouter();
		const submitButton = ref<HTMLButtonElement | null>(null);

		const username = ref('');
		const email = ref('');
		const password = ref('');
		const password_confirmation = ref('');

		function debounce(func, wait) {
			let timeout;
			return function (...args) {
				return new Promise((resolve, reject) => {
					clearTimeout(timeout);
					timeout = setTimeout(async () => {
						try {
							const result = await func.apply(this, args);
							resolve(result);
						} catch (error) {
							reject(error);
						}
					}, wait);
				});
			};
		}

		async function isUsernameValid(value) {
			try {
				const response = await ApiService.query(`/check-username?username=${value}`, {});
				console.log('Value: ', value)
				console.log('Response: ', response)
				return response.data.valid;
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error checking username availability',
					text: `${error}`,
				})
				console.error('Error checking username availability:', error);
				return false;
			}
		}
		const debouncedIsUsernameValid = debounce(isUsernameValid, 300);

		async function isEmailValid(value) {
			try {
				const response = await ApiService.query(`/check-email?email=${value}`, {});
				return response.data.valid;
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error checking email availability',
					text: `${error}`,
				})
				console.error('Error checking email availability:', error);
				return false;
			}
		}
		const debouncedIsEmailValid = debounce(isEmailValid, 300);

		const registration = Yup.object().shape({
			username: Yup.string().required()
				.label('Username')
				.test('is-username-taken', 'Username is already taken', async (value) => {
				const isValid = await debouncedIsUsernameValid(value);
				return isValid;
			}),
			email: Yup.string().required().email().label('Email').test('is-email-taken', 'Email is already taken', async (value) => {
				const isValid = await debouncedIsEmailValid(value);
				return isValid;
			}),
			password: Yup.string().required().label('Password'),
			password_confirmation: Yup.string()
				.required()
				.oneOf([Yup.ref('password')], 'Passwords must match')
				.label('Password Confirmation'),
		});

		const switchModule = (module: 'login' | 'resetPassword' | 'completeProfile') => {
			router.replace({ hash: `#${module}` });
		};

		const onSubmitSignUp = async (_values: any) => {
			try {
				const values = {
					username: username.value,
					email: email.value,
					password: password.value,
					password_confirmation: password_confirmation.value,
				} as SignupData;

				if (submitButton.value) {
					submitButton.value.disabled = true;
					submitButton.value.setAttribute('data-kt-indicator', 'on');
				}

				await registration.validate(values, { abortEarly: false });

				await store.signup(values);
				const error = Object.values(store.errors);

				if (error.length === 0) {
					Swal.fire({
						text: 'You have successfully signed up!',
						icon: 'success',
						buttonsStyling: false,
						confirmButtonText: 'Ok, got it!',
						heightAuto: false,
						customClass: {
							confirmButton: 'btn fw-semibold btn-light-primary',
						},
					}) 
					router.push('/auth#completeProfile');
					switchModule('completeProfile');
					//.then(() => {
					// 	 // Adjust this route as necessary
					// });
				} else {
					Swal.fire({
						title: error[0] as string,
						text: error[1] as string,
						icon: 'error',
						buttonsStyling: false,
						confirmButtonText: 'Try again!',
						heightAuto: false,
						customClass: {
							confirmButton: 'btn fw-semibold btn-light-danger',
						},
					}).then(() => {
						store.errors = {};
					});
				}
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					// Handle validation errors
					const formattedErrors = error.errors.map(e => `<li>${e}</li>`).join('');
					Swal.fire({
						icon: 'error',
						title: 'There are errors in your form:',
						html: `<ul class="text-danger text-start">${formattedErrors}</ul>`,
					})
					console.error('Validation errors:', error.errors);
				} else {
					// Handle other errors (e.g., API errors)
					console.error('Login failed:', error);
					Swal.fire({
						icon: 'error',
						title: 'Something went wrong - Login failed...',
						message: "An unexpected error has occured. Please reload the page and try again or contact FlexUp support."
					})
				}
			}

			if (submitButton.value) {
				submitButton.value.removeAttribute('data-kt-indicator');
				submitButton.value.disabled = false;
			}
		};

		onMounted(() => {
			nextTick(() => {
				PasswordMeterComponent.bootstrap();
			});
		});

		return {
			onSubmitSignUp,
			registration,
			submitButton,
			switchModule,
			username, email,
			password, password_confirmation
		};
	},
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
