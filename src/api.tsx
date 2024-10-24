import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

let logoutFn: (() => void) | null = null;

export const setLogoutFunction = (logoutFunction: () => void) => {
  logoutFn = logoutFunction;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
        {
          refreshToken,
        }
      );
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (error) {
      if (logoutFn) {
        logoutFn();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
