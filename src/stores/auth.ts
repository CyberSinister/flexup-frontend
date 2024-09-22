import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import JwtService from "@/core/services/JwtService";
import { type BaseAccount } from "./accounts";
import { jwtDecode } from "jwt-decode";
import axios, { AxiosError } from "axios";
import { processErrors } from "@/core/helpers/processing";
import router from "@/router";
import { useRouter } from 'vue-router';

export interface Individual {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  mobile_number?: string;
  date_of_birth: string;
  residence_address?: string;
  residence_country?: string;
}

export interface BaseUser {
  id: number;
  username: string;
  email: string;
  mobile_number?: string;
}

export interface User extends BaseUser {
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  access_token?: string;
  refresh_token?: string;
  primary_individual: Individual | Object;
  primary_account: BaseAccount | null;
  last_fetched: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileData {
  first_name: string;
  last_name: string;
  country: string;
  currency: string;
}

export interface ImageData {
  name: string, 
  type: string,
  size: number,
}
export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const router = useRouter();

  const isAuthenticated = computed(() => {
    return (Object.keys(user.value).length>0 && JwtService.getAccessToken() !== '' && JwtService.getRefreshToken() !== '');
  });
  // implement wearning - something wrong with account
  const authModule = ref<"login" | "signup" | "resetPassword" | "completeProfile" | "warning">("login");

  const switchAuthModule = (module: "login" | "signup" | "resetPassword" | "completeProfile" | "warning") => {
    authModule.value = module;
  }

  const setUser = (_user: User) => {
    user.value = _user;
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function setAuth(authUser: User, modifyTokens: boolean = true) {
    setUser(authUser);
    errors.value = {};
    // Simulating token saving without JwtService
    // localStorage.setItem('access_token', authUser.access_token || '');
    // localStorage.setItem('refresh_token', authUser.refresh_token || '');
    if (modifyTokens) {
      JwtService.saveAccessToken(authUser.access_token || '');
      JwtService.saveRefreshToken(authUser.refresh_token || '');
    }
  }

  const setPrimaryIndividial = (individual: Individual) => {
    user.value.primary_individual = individual;
    localStorage.setItem('user', JSON.stringify(user.value));
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    user.value = {} as User;
    errors.value = [];
    // Simulating token removal without JwtService
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    JwtService.destroyTokens();
    localStorage.removeItem('user');
    router.push({ path: '/auth', hash: '#login' });
  }

  const checkIntegrity = () => {
    if (isAuthenticated.value) {
      if (user.value.primary_account) {
        console.log('User has primary account: ', user.value.primary_account)
        const givenDate = new Date(user.value.last_fetched);
        const currentDate = new Date();

        const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();
        const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

        if (differenceInMinutes >= 5) {
          fetchUserData();
        }
      } else {
        fetchUserData();
      }
    }
  }

  async function signup(signupData: SignupData) {
    try {
      const response = await axios.post("/api/v2/silque_user/user/", {
        username: signupData.username,
        email: signupData.email,
        password1: signupData.password,
        password2: signupData.password_confirmation
      }, {headers: {'Content-Type': 'application/json'}});
      // const authUser = {
      //   ...response.data.user,
      //   access_token: response.data.access,
      //   refresh_token: response.data.refresh,
      // };
      // setAuth(authUser);
      // console.log('Auth user:', authUser);
      // setAuth(authUser);
      try {
        await login({username: signupData.username, password: signupData.password});
      } catch (error) {
        setError({ title: "Signup Successful but failed to login!", message: "Please reload the page and try again or contact FlexUp support." });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('processing errors')
        let errors = processErrors(error.response.data);
        console.log('Errors:', errors);
        setError({ title: "Server returned an error!", message: errors });
      } else {
        setError({ title: "An unknown error has occured!", message: "Please reload the page and try again or contact FlexUp support." });
      }
    }
  }

  async function completeProfile(profileData: ProfileData, imageData: ImageData) {
    try {
      const response = await axios.post("/api/v2/accounts/profilecompletion/", {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        country: profileData.country,
        currency: profileData.currency,
        image: imageData
      }, { headers: { 'Content-Type': 'application/json' } });
  
    }catch (error) {
      setError({ title: "An unknown error has occured!", message: "Please reload the page and try again or contact FlexUp support." });
    }
  }

  async function login(credentials: Credentials) {
    try {
      const response = await axios.post("/api/silque_user/auth/obtain_token/", {
        username: credentials.username,
        password: credentials.password,
      }, {headers: {'Content-Type': 'application/json'}});
      const authUser = {
        ...response.data.user,
        access_token: response.data.access,
        refresh_token: response.data.refresh,
      };
      // setAuth(authUser);
      setAuth(authUser);
    } catch (error: AxiosError|any) {
      if (error?.response.status === 401) {
        setError({ title: "Sorry, can't sign you in...", message: 'The username and/or password you provided are in correct.' });
      } else {
        setError({ title: "An unknown error has occured!", message: "Please reload the page and try again or contact FlexUp support." });
      }
    }
  }

  function logout() {
    purgeAuth();
  }

  function register() {
    // Registration logic removed
  }

  function forgotPassword() {
    // Forgot password logic removed
  }

  interface JwtPayload {
    exp: number;
  }

  const getUser = () => {
    console.log('User:', user.value);
    return user.value;
  }
  
  function verifyAuth() {
    const token = JwtService.getAccessToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token); //error resolve kr la yahan sa 
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp > currentTime) {
          return true;
        } else {
          return false;
          // purgeAuth();
        }
      } catch (error) {
        purgeAuth();
        return false;
      }
    } else {
      purgeAuth();
      return false;
    }
  }

  async function fetchUserData() {
    try {
      const response = await axios.get(`/api/v2/users/user/${user.value.id}/`, {
        headers: {
          'Authorization': `Bearer ${JwtService.getAccessToken()}`
        }
      });
      const authUser = response.data as User;
      console.log('Fetched user:', authUser);
      setAuth(authUser, false);
      console.log('User fetched:', user.value);
    } catch (error) {
      purgeAuth();
    }
  }

  function loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const authUser = JSON.parse(storedUser) as User;
        setAuth(authUser, false);
      } catch (error) {
        purgeAuth();
      }
    } else {
      purgeAuth();
    }
  }

  // Load user from local storage when the store is initialized
  loadUserFromLocalStorage();

  return {
    errors,
    user, getUser, setUser,
    isAuthenticated,
    signup,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    authModule, switchAuthModule,
    fetchUserData,
    completeProfile, setPrimaryIndividial,
    checkIntegrity
  };
});

// access_token, refresh_token