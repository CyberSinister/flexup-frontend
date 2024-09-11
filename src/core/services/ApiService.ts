import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";


const backendUrl = import.meta.env.VITE_APP_API_URL;

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL = backendUrl;

    // Add request interceptor
    ApiService.vueInstance.axios.interceptors.request.use((config) => {
      const token = JwtService.getAccessToken(); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          console.log("fighter", error)
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/obtain_token') && !originalRequest.url.includes('/refresh_token')) {
            originalRequest._retry = true;
            try {
              console.log('Refreshing token')
              const newAccessToken = await JwtService.refreshToken();
              console.log('New access token:', newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return ApiService.vueInstance.axios(originalRequest);
            } catch (refreshError) {
              console.log('Error while refreshing token:', refreshError);
              JwtService.destroyTokens();
              try {
                const router = useRouter();
                console.log('ROUTER: ', router)
                router.push({ name: 'Login' });
              } catch (e) {
                console.log('Well shiat')
              }
              // Optionally redirect to login page
              return Promise.reject(refreshError);
            }
          }
        } catch (e) {
          if (e.code == 'ERR_NETWORK') {
            Swal.fire({
              icon: 'error',
              title: 'Network Error',
              text: 'The FlexUp control panel server is unreachable. Please check your internet connection and try again.',
            })
          } else {
            throw e;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getBaseUrl(): string {
    return backendUrl;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getAccessToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> { //, _setHeader:boolean = true 
    return ApiService.vueInstance.axios.post(`${resource}`, params);
  }
1
  public static patch(resource: string, params: any): Promise<AxiosResponse> { //, _setHeader:boolean = true 
    return ApiService.vueInstance.axios.patch(`${resource}`, params);
  }

  public static multipartPost(resource: string, params: any): Promise<AxiosResponse> { //, _setHeader:boolean = true 
    
    return ApiService.vueInstance.axios.post(`${resource}`, params, {
      headers: {
        "Authorization": `Token ${JwtService.getAccessToken()}`,
        "Content-Type": "multipart/form-data"
      }
    });
  }

  public static multipartPut(resource: string, params: any): Promise<AxiosResponse> { //, _setHeader:boolean = true 
    
    return ApiService.vueInstance.axios.patch(`${resource}`, params, {
      headers: {
        "Authorization": `Token ${JwtService.getAccessToken()}`,
        "Content-Type": "multipart/form-data"
      }
    });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;