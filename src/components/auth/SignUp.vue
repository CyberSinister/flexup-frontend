<template>
	<div class="bg-body d-flex flex-column align-items-stretch flex-center rounded-3 w-md-600px p-xl-20 p-lg-20 p-md-20 p-sm-20 p-10 mt-10 mx-auto"
		bis_skin_checked="1">
		<div class="d-flex flex-center flex-column flex-column-fluid px-lg-10" bis_skin_checked="1">
			<div class="">
				<VForm class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" novalidate="novalidate"
					id="kt_login_signup_form" :validation-schema="registration" @submit="onSubmitSignUp">
					<div class="text-start mb-10">
						<h1 class="text-gray-900 mb-3 fs-3x">Sign Up</h1>
					</div>
					<div class="row fv-row">
						<div class="col-12 mb-4">
							<label class="form-label required">Username</label>
							<Field class="form-control" type="text"
								placeholder="Username" name="username" autocomplete="off"
								style="background-color: #f4f4f4f4 !important;" v-model="username" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="username" />
									<span v-if="usernameError.length>0" class="text-danger">{{ usernameError }}</span>
								</div>
							</div>
						</div>
						<div class="col-12 mb-4">
							<label class="form-label required">Email Address</label>
							<Field class="form-control" type="text"
								placeholder="Email" name="email" autocomplete="off"
								style="background-color: #f4f4f4f4 !important;" v-model="email" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="email" />
									<span v-if="emailError.length>0" class="text-danger">{{ emailError }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="fv-row mb-7" data-kt-password-meter="true">
						<div class="mb-1">
							<div class="position-relative mb-3">
								<label class="form-label required">Password</label>
								<Field class="form-control" type="password"
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
					<div class="fv-row mb-4">
						<label class="form-label required">Password Confirmation</label>
						<Field class="form-control" type="password"
							placeholder="Confirm Password" name="password_confirmation" autocomplete="off"
							style="background-color: #F8F8F8F8;" v-model="password_confirmation" />
						<div class="fv-plugins-message-container">
							<div class="fv-help-block">
								<ErrorMessage name="password_confirmation" />
							</div>
						</div>
					</div>
					<!-- <el-form :model="signupForm" :rule="signupFormRules">
						<el-form-item label="Username" prop="username">
							<el-input v-model="signupForm.username" />
						</el-form-item>
						<el-form-item label="Email Address" prop="email">
							<el-input type="email" v-model="signupForm.email" />
						</el-form-item>
						<el-form-item label="Password" prop="password">
							<el-input v-model="signupForm.password" />
						</el-form-item>
						<el-form-item label="Password Confirmation" prop="password_confirmation">
							<el-input v-model="signupForm.password_confirmation" />
						</el-form-item>
						<el-checkbox v-model="tosAccepted">
							<template #default>I agree to the <u><router-link to="/legal#termsofservice">Terms of Service</router-link></u> and <u><router-link to="/legal#privacypolicy">Privacy Policy</router-link></u>.</template>
						</el-checkbox>
					</el-form> -->
					<el-checkbox v-model="tosAccepted">
						<template #default>I agree to the <u><router-link to="/legal#termsofservice">Terms of Service</router-link></u> and <u><router-link to="/legal#privacypolicy">Privacy Policy</router-link></u>.</template>
					</el-checkbox>
					<div class="d-flex flex-stack mt-4">
						<button type="button" ref="submitButton" id="submit_btn" class="btn btn-sm btn-primary" @click="onSubmitSignUp" :disabled="!tosAccepted">
							<span class="indicator-label">Sign Up</span>
							<span v-if="checkingUsername" class="indicator-progress">Checking username...
								<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
							</span>
							<span v-else-if="checkingEmail" class="indicator-progress">Checking email...
								<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
							</span>
							<span v-else class="indicator-progress">Please wait...
								<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
							</span>
						</button>
					</div>
					<div class="text-gray-500 w-100 fw-semibold fs-6 mt-3" bis_skin_checked="1">Already have an account?
						<a href="javascript:void(0)" class="link-primary ms-2" @click="switchModule('login')">Sign In</a>
					</div>
				</VForm>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, watch } from 'vue';
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

		const tosAccepted = ref(false);
		const username = ref('');
		const checkingUsername = ref(false);
		const usernameError = ref('');

		const email = ref('');
		const checkingEmail = ref(false);
		const emailError = ref('');

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

		const checkAvailability = debounce(async (field, value) => {
			try {
				if (field === 'U') {
					checkingUsername.value = true;
					try {
						const response = await ApiService.query(`/check-username?username=${value}`, {});
						console.log('username check response:', response);
						if (response.data.valid) {
							usernameError.value = '';
						} else {
							usernameError.value = 'Username is already taken';
						}
					} catch (error) {
						console.error('Username Check Error:', error);
						usernameError.value = 'Username is already taken';
					}
					checkingUsername.value = false;
				} else if (field === 'E') {
					checkingEmail.value = true;
					try {
						const response = await ApiService.query(`/check-email?email=${value}`, {});
						console.log('email check response:', response);
						if (response.data.valid) {
							emailError.value = '';
						} else {
							console.log('email is taken')
							emailError.value = 'Email is already taken';
						}
					} catch (error) {
						console.error('Email Check Error:', error);
						emailError.value = 'Email is already taken';
					}
					checkingEmail.value = false;
				}
			} catch (error) {
				console.error(error);
			}
		}, 500);

		const registration = Yup.object().shape({
			username: Yup.string().required().label('Username'),
			email: Yup.string().email().required().label('Email'),
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

				if (usernameError.value.length>0 || emailError.value.length>0) {
					Swal.fire({
						icon: 'error',
						title: 'Please fix the errors in the form',
						text: 'Username and Email must be unique',
					});
					if (submitButton.value) {
						submitButton.value.removeAttribute('data-kt-indicator');
						submitButton.value.disabled = tosAccepted.value ? false : true;
					}
					return;
				}

				await store.signup(values);
				const error = Object.values(store.errors);

				if (error.length === 0) {
					router.push({path: '/auth', hash: '#completeProfile'});
					switchModule('completeProfile');
					//.then(() => {
					// 	 // Adjust this route as necessary
					// });
				} else {
					Swal.fire({
						title: error[0] as string,
						html: error[1].includes('<ul')?error[1]:`<span class="text-danger">${error[1]}</span>` as string,
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
				console.log('Eerrrrrrrrrrrrrrrrrrrror:', error);
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
				submitButton.value.disabled = tosAccepted.value ? false : true;
			}
		};

		onMounted(() => {
			nextTick(() => {
				PasswordMeterComponent.bootstrap();
			});
		});

		watch(username, (newUsername) => {
			if (newUsername) {
				console.log('Username changed')
				checkAvailability('U', newUsername);
			}
		});

		watch(email, (newEmail) => {
			if (newEmail) {
				console.log('Email changed')
				checkAvailability('E', newEmail);
			}
		});

		watch(checkingUsername, (newValue) => {
			if (submitButton.value) {
				if (newValue) {
					submitButton.value.disabled = true;
					submitButton.value.setAttribute('data-kt-indicator', 'on');
				} else {
					submitButton.value.disabled = tosAccepted.value ? false : true;
					submitButton.value.removeAttribute('data-kt-indicator');
				}
			}
		});

		watch(checkingEmail, (newValue) => {
			if (submitButton.value) {
				if (newValue) {
					submitButton.value.disabled = true;
					submitButton.value.setAttribute('data-kt-indicator', 'on');
				} else {
					submitButton.value.disabled = tosAccepted.value ? false : true;
					submitButton.value.removeAttribute('data-kt-indicator');
				}
			}
		});

		return {
			onSubmitSignUp, tosAccepted,
			registration,
			submitButton,
			switchModule,
			username, usernameError, checkingUsername,
			email, emailError, checkingEmail,
			password, password_confirmation
		};
	},
});
</script>

<style scoped>
/* Add your custom styles here */
</style>
