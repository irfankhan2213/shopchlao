import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (request) => {
    // const session = await getSession();
    // const token = session?.user?.token;
    // if (token) {
    //   request.headers.authorization = `${token}`;
    // }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      signOut();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
