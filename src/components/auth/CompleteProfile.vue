<template>
  <div class="bg-body d-flex flex-column align-items-stretch flex-center rounded-3 w-md-600px p-xl-20 p-lg-20 p-md-20 p-sm-20 p-10 mt-10 mx-auto">
    <div class="d-flex flex-center flex-column flex-column-fluid px-lg-10">
      <VForm class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" 
        :validation-schema="login"
        @submit="onSubmitLogin"
      >
        <div class="text-center mb-4">
          <h1 class="text-gray-900 fw-bolder mb-3">Welcome to FlexUp!</h1>
          <div class="text-gray-500 fw-semibold fs-6">
            Your email {{ currentUser.email }} has now been confirmed, thank you. Please complete your profile so that we can create your personal account.
          </div>
        </div>
		<div class="row">
			<div class="col-12">
				<div class="form-group mb-4">
					<div class="d-flex w-100 justify-content-between">
						<label class="form-label fs-6 fw-semibold required">Image:</label>
					</div>
					<div class="symbol symbol-100px symbol-circle" for="account_image">
						<label class="symbol-label cursor-pointer" :style="{ backgroundImage: `url(${imageData})`} ">
							<input ref="imageField" type="file" name="account_image" id="account_image" class="d-none" accept=".png, .jpg, .jpeg" @change="onFileChange" />
						</label>
					</div>
				</div>
			</div>
		</div>
        <div class="row">
          <div class="col-xl-6 col-md-6 fv-row mb-7">
            <Field tabindex="1" placeholder="First Name" 
              class="form-control form-control-lg form-control-solid"
              name="first_name" v-model="first_name" />
            <ErrorMessage name="first_name" class="fv-help-block text-danger" />
          </div>

          <div class="col-xl-6 col-md-6 fv-row mb-7">
            <Field tabindex="2" placeholder="Last Name" 
              class="form-control form-control-lg form-control-solid"
              name="last_name" v-model="last_name" />
            <ErrorMessage name="last_name" class="fv-help-block text-danger" />
          </div>
        </div>

        <div class="row fv-row mb-7">
			<div class="col-xl-6 col-md-6">
				<el-select
				class="form-control form-control-lg form-control-solid"
				placeholder="Select Country"
				filterable
				name="country"
				tabindex="0"
				@change="selectDefaultCurrency"
				v-model="country">
				<el-option
					v-for="(_obj, _country) in countries"
					:key="_country"
					:value="_country"
					:label="_obj.name_long"
					:selected="_country == country"
					class="form-control form-control-lg form-control-solid">
					{{ _obj.name_long }}
				</el-option>
				</el-select>
			</div>
          <div class="col-xl-6 col-md-6">
            <el-select
              class="form-control form-control-lg form-control-solid"
              placeholder="Select Currency"
			  filterable
			  name="currency"
			  tabindex="0"
              v-model="currency">
              <el-option v-for="(_obj, _currency) in currencies" 
			  :key="_currency" 
			  :value="_currency" 
			  :label="`${_obj.symbol} ${_obj.long_name}`"
			  :selected="_currency == currency">
                {{ _obj.symbol }} {{ _obj.long_name }}
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="text-center">
          <button type="button" ref="submitButton" id="login_form_submit_btn" class="btn btn-lg btn-primary w-100 mb-5 mt-10" @click="onSubmitProfileDetails">
            <span class="indicator-label">Continue</span>
            <span class="indicator-progress">Please wait...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
        </div>
      </VForm>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import { useAuthStore, type ProfileData, type Individual  } from "@/stores/auth";
import { useAccountsStore, type Account } from "@/stores/accounts";

import { useRouter } from "vue-router";
import { useOptionsetStore } from "@/stores/optionsets";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import * as Yup from "yup";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

export default defineComponent({
	name: "CompleteProfile",
	components: { Field, VForm, ErrorMessage },
	setup() {
		const store = useAuthStore();
		const currentUser = store.user;

		const accountStore = useAccountsStore();
		const router = useRouter();
		const optionsets = useOptionsetStore();
		const submitButton = ref<HTMLButtonElement | null>(null);

		const first_name = ref('');
		const last_name = ref('');
		const country = ref('');
		const currency = ref('');
		const imageField = ref<null|HTMLInputElement>(null);
		const countries = computed(() => {
			return optionsets.getCountries();
		});
		
		const currencies = computed(() => {
			return optionsets.getCurrencies();
		})

		const selectDefaultCurrency = () => {
			if (country.value) {
				const selectedCountry = countries.value[country.value];
				console.log(selectedCountry)
				if (selectedCountry) {
					currency.value = selectedCountry.currency;
				}
			}
		}

		const baseUrl = ApiService.getBaseUrl();

		const maxFileSize = 2 * 1024 * 1024;
		const imageData = ref(`${baseUrl}/static/img/image-placeholder.svg`);
		const onFileChange = (e) => {
		  const file = e.target.files[0];
		
		  if (file.size > maxFileSize) {
			Swal.fire({
			  icon: 'error',
			  title: 'File too large',
			  text: 'The selected file is too large. Please select a file that is less than 2MB in size.',
			});
			if (imageField.value) {
				imageField.value.value = '';
			}
			return;
		  }
		  const reader = new FileReader();
		
		  reader.onload = (e) => {
			if (e.target) {
			  imageData.value = e.target.result;
			}
		  };
		
		  reader.readAsDataURL(file);
		};
		
		const onSubmitProfileDetails = async (_profileData: any,_imageDataObj: any) => {
			try {
				const formData = new FormData();
				formData.append('first_name', first_name.value);
				formData.append('last_name', last_name.value);
				formData.append('country', country.value);
				formData.append('currency', currency.value);

				if (imageField.value && imageField.value.files.length>0) {
					formData.append('image', imageField.value.files[0]);
				}

				console.log('Submit utton: ', submitButton.value)

				if (submitButton.value) {
					console.log('Submit Button: ', submitButton.value)
					submitButton.value.disabled = true;
					console.log('Disabling Submit Button: ', submitButton.value)
					submitButton.value.setAttribute('data-kt-indicator', 'on');
				}
				
				const error = Object.values(store.errors);

				if (error.length === 0) {
					try {
						const response = await ApiService.multipartPost('/api/v2/accounts/profilecompletion/', formData);
						console.log("completion: ", response)
						accountStore.setAccount(response.data as Account);
						accountStore.primaryAccount = response.data as Account;
						store.setPrimaryIndividial(response.data.owner_individual as Individual);
					
						router.push('/dashboard');
					} catch (error) {
						if (error.response) {
							if (error.response.data) {
								let errors = []
								if (error.response.data.non_field_errors) {
									errors = error.response.data.non_field_errors;
								} else {
									errors = Object.entries(error.response.data).map(([key, value]) => {
										return `${key}: ${value}`;
									});
								}

								Swal.fire({
									'title': 'Profile completion failed',
									'html': errors.join('<br>'),
									'icon': 'error',
								})
							} else {
								Swal.fire({
									icon: 'error',
									title: 'Something went wrong - Profile completion failed...',
									text: "An unexpected error has occurred. Please reload the page and try again or contact FlexUp support."
								})
							}
						} else {
							Swal.fire({
								icon: 'error',
								title: 'Something went wrong - Profile completion failed...',
								text: "An unexpected error has occurred. Please reload the page and try again or contact FlexUp support."
							})
						}
						
						console.log(error)
					}
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
					const formattedErrors = error.errors.map(e => `<li>${e}</li>`).join('');
					Swal.fire({
						icon: 'error',
						title: 'There are errors in your form:',
						html: `<ul class="text-danger text-start">${formattedErrors}</ul>`,
					});
				} else {
					Swal.fire({
						icon: 'error',
						title: '[CRITICAL] Something went wrong - Profile completion failed...',
						text: "An unexpected error has occurred. Please reload the page and try again or contact FlexUp support."
				});
				}
			}

			if (submitButton.value) {
				console.log('Enabling')
				submitButton.value.removeAttribute('data-kt-indicator');
				submitButton.value.disabled = false;
			}
		};
		const login = Yup.object().shape({
			first_name: Yup.string().required("First Name is required"),
			last_name: Yup.string().required("Last Name is required"),
			country: Yup.string().required("Country is required"),
			currency: Yup.string().required("Currency is required"),
		});

		const onSubmitLogin = async (values: any) => {
			try {
				console.log("Submitting: ", values);
				Swal.fire("Logged In!", "You have successfully logged in!", "success");
				router.push("/dashboard");
			} catch (error) {
				Swal.fire("Error", "Something went wrong during login.", "error");
			}
		};

		const logout = () => {
			store.logout();
		};

		return {
			first_name,
			last_name, currentUser,
			country,
			currency,
			countries,
			currencies,
			login, imageField,
			onSubmitLogin, submitButton,
			logout, selectDefaultCurrency,
			onSubmitProfileDetails,
			onFileChange,imageData,
		};
	},
});
</script>
<style scoped>

:deep(.el-input__wrapper) {
    align-items: center !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
	display: flex !important;
	justify-content: center !important;
	padding: 0 !important;
}
:deep(.el-select__wrapper) {
    align-items: center !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
	display: flex !important;
	justify-content: center !important;
	padding: 0 !important;
}
.el-input__wrapper{
	border: 0px;
    box-shadow: none;
    background-color: #f9f9f9;
}

</style>
