<template>
	<div class="bg-body d-flex flex-column align-items-stretch flex-center rounded-3 w-md-600px p-xl-20 p-lg-20 p-md-20 p-sm-20 p-10 mt-10 mx-auto"
		bis_skin_checked="1">
		<div class="d-flex flex-center flex-column flex-column-fluid px-lg-10" bis_skin_checked="1">
			<form id="logout-form" method="post" action="/logout/">
				<input type="hidden" name="csrfmiddlewaretoken"
					value="PiVCUV8dfdwYTbOdFMOsNuTx8VQWc5QvQaBrQtwmo9aqsUirjLlgJdm4gewzXXlP">
			</form>
			<VForm class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" novalidate="novalidate" method="post"
				id="kt_login_signin_form" :validation-schema="login"
				@onSubmit="onSubmitLogin">
				<input type="hidden" name="csrfmiddlewaretoken"
					value="PiVCUV8dfdwYTbOdFMOsNuTx8VQWc5QvQaBrQtwmo9aqsUirjLlgJdm4gewzXXlP">
				<div class="text-center mb-11" bis_skin_checked="1">
					<h1 class="text-gray-900 fw-bolder mb-3">Sign In</h1>
					<div class="text-gray-500 fw-semibold fs-6" bis_skin_checked="1">Your Social Campaigns</div>
				</div>
				<div class="row g-3 mb-9" bis_skin_checked="1">
					<div class="col-md-6" bis_skin_checked="1">
						<a href="javascript:void(0)"
							class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100 border border-gray-300"
							v-tooltip="`Coming soon`">
							<img alt="Logo" src="/media/logos/google-icon.svg" class="h-15px me-3">
							Sign in with Google
						</a>
					</div>
					<div class="col-md-6" bis_skin_checked="1">
						<a href="javascript:void(0)"
							class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100 border border-gray-300"
							v-tooltip="`Coming soon`">
							<img alt="Logo" src="/media/logos/apple-black.svg" class="theme-light-show h-15px me-3">
							<img alt="Logo" src="/media/logos/apple-black.svg" class="theme-dark-show h-15px me-3">
							Sign in with Apple
						</a>
					</div>
				</div>
				<div class="separator separator-content my-14" bis_skin_checked="1">
					<span class="w-125px text-gray-500 fw-semibold fs-7">Or with FlexUp</span>
				</div>
				<div class="fv-row mb-10 fv-plugins-icon-container" bis_skin_checked="1">
					<Field tabindex="1" placeholder="Username" class="form-control form-control-lg form-control-solid"
						type="text" name="username" autocomplete="off" v-model="username" />
					<div class="fv-plugins-message-container">
						<div class="fv-help-block">
							<ErrorMessage name="username" />
						</div>
					</div>
				</div>
				<div class="fv-row mb-10 fv-plugins-icon-container" bis_skin_checked="1">
					<Field tabindex="2" placeholder="Password" class="form-control form-control-lg form-control-solid"
						type="password" name="password" autocomplete="off" v-model="password" />
					<div class="fv-plugins-message-container">
						<div class="fv-help-block">
							<ErrorMessage name="password" />
						</div>
					</div>
					<a class="link-primary float-end mt-1" href="javascript:void(0)"
						@click="switchModule('resetpassword')">Forgot Password ?</a>
					<div class="fv-plugins-message-container invalid-feedback" bis_skin_checked="1"></div>
				</div>
				<div class="text-center" bis_skin_checked="1">
					<button type="submit" ref="submitButton" id="login_form_submit_btn" class="btn btn-lg btn-primary w-100 mb-5 mt-10"
						@click="onSubmitLogin">
						<span class="indicator-label">Continue</span>
						<span class="indicator-progress">Please wait...
							<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
						</span>
					</button>
				</div>
				<div bis_skin_checked="1"></div>
			</VForm>
			<div class="text-gray-500 text-center fw-semibold fs-6" bis_skin_checked="1">Don't have an account?
				<a href="javascript:void(0)" class="link-primary ms-2" @click="switchModule('signup')">Sign up</a>
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
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User, type Credentials } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import { useGetDerivedNamespace } from "element-plus";

export default defineComponent({
	name: "SignIn",
	components: {
		Field,
		VForm,
		ErrorMessage,
	},
	setup() {
		const store = useAuthStore();
		const router = useRouter();

		const username = ref('');
		const password = ref('');

		const switchModule = (module: "signup" | "resetPassword") => {
			router.replace({ hash: `#${module}` });
		};

		const submitButton = ref<HTMLButtonElement | null>(null);

		//Create form validation object
		const login = Yup.object().shape({
			username: Yup.string().required().label('Username'),
			password: Yup.string().required().label("Password"),
		});

		//Form submit function
		const onSubmitLogin = async (_values: any) => {
			try {
				console.log("login ho gya ha: ", _values)
				
				// eslint-disable-next-line
				let values = {
					username: username.value,
					password: password.value,
				}

				await login.validate(values, { abortEarly: false });
				// Clear existing errors
				store.logout();

				if (submitButton.value) {
					// eslint-disable-next-line
					submitButton.value!.disabled = true;
					// Activate indicator
					submitButton.value.setAttribute("data-kt-indicator", "on");
				}

				// Send login request
				await store.login(values);
				const error = Object.values(store.errors);
				console.log("errorrrr: ", error)

				if (error.length === 0) {
					Swal.fire({
						text: "You have successfully logged in!",
						icon: "success",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						heightAuto: false,
						customClass: {
							confirmButton: "btn fw-semibold btn-light-primary",
						},
						timer: 2000 // Autoclose after 2 seconds
					})
					console.log("login ho gya ha ")
					router.push('/dashboard'); // Use the correct case here based on autoRoutes
				} else {
					Swal.fire({
						title: error[0] as string,
						text: error[1] as string,
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Try again!",
						heightAuto: false,
						customClass: {
							confirmButton: "btn fw-semibold btn-light-danger",
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

			//Deactivate indicator
			submitButton.value?.removeAttribute("data-kt-indicator");
			// eslint-disable-next-line
			submitButton.value!.disabled = false;
		};

		return {
			username,
			password,
			onSubmitLogin,
			login,
			submitButton,
			switchModule,
		};
	},
});
</script>