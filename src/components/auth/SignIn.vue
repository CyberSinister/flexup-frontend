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
				<div class="mb-11" bis_skin_checked="1">
					<h1 class="text-gray-900 mb-3 fs-3x">Sign In</h1>
				</div>
				<!-- <div class="separator separator-content my-14" bis_skin_checked="1">
					<span class="w-125px text-gray-500 fw-semibold fs-7">Or with FlexUp</span>
				</div> -->
				<div class="fv-row mb-5 fv-plugins-icon-container" bis_skin_checked="1">
					<div class="d-flex justify-content-between align-items-center">
						<label class="form-label required">Username:</label>
						<div class="d-flex w-100 flex-column ms-4">
							<Field tabindex="1" placeholder="Username" class="form-control w-100"
							type="text" name="username" autocomplete="off" v-model="username" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="username" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="fv-row mb-5 fv-plugins-icon-container" bis_skin_checked="1">
					<div class="d-flex justify-content-between align-items-center">
						<label class="form-label required">Password:</label>
						<div class="d-flex w-100 flex-column ms-4">
							<Field tabindex="2" placeholder="Password" class="form-control w-100"
								type="password" name="password" autocomplete="off" v-model="password" />
							<div class="fv-plugins-message-container">
								<div class="fv-help-block">
									<ErrorMessage name="password" />
								</div>
							</div>
						</div>
					</div>
					<div class="fv-plugins-message-container invalid-feedback" bis_skin_checked="1"></div>
				</div>
				<el-checkbox v-model="tosAccepted">
					<template #default>I agree to the <u><a href="/legal#termsofservice" target="_blank">Terms of Service</a></u> and <u><a href="/legal#privacypolicy">Privacy Policy</a></u>.</template>
				</el-checkbox>
				<div class="d-flex justify-content-between mb-5 mt-10 align-items-center" bis_skin_checked="1">
					<button type="submit" ref="submitButton" id="login_form_submit_btn" class="btn btn-sm btn-primary"
						@click="onSubmitLogin" :disabled="!tosAccepted">
						<span class="indicator-label">Sign In</span>
						<span class="indicator-progress">Please wait...
							<span class="spinner-border spinner-border-sm align-middle ms-2"></span>
						</span>
					</button>
					<a class="link-primary float-end mt-1 btn btn-sm btn-link" href="javascript:void(0)"
						@click="switchModule('resetpassword')">Forgot Password ?</a>
				</div>
				<div bis_skin_checked="1"></div>
			</VForm>
			<div class="text-gray-500 w-100 fw-semibold fs-6" bis_skin_checked="1">Don't have an account?
				<a href="javascript:void(0)" class="link-primary ms-2" @click="switchModule('signup')">Sign up</a>
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
		const tosAccepted = ref(false);

		const switchModule = (module: "signup" | "resetPassword") => {
			router.push({ path: '/auth', hash: `#${module}` });
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
			password, tosAccepted,
			onSubmitLogin,
			login,
			submitButton,
			switchModule,
		};
	},
});
</script>