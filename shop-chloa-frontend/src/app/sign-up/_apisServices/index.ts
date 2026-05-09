import axiosInstance from "@/services/ApiServices/axiosInstance";
import apiRoutes from "@/services/ApiServices/apiRoutes";
const apiServerUrl =
  process.env.NEXT_PUBLIC_APP_API_BASE_URL || "http://localhost:3000";

export const signUpApi = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) =>
  await fetch(`${apiServerUrl}${apiRoutes.SIGN_UP}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });

export const sendOtpApi = async (data: { phone?: string; email?: string }) =>
  await fetch(`${apiServerUrl}${apiRoutes.SEND_OTP}`, {
    method: "POST",
    body: JSON.stringify({
      phone: data?.phone,
      email: data?.email,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const updateStoreApi = async (data: any, token: string) => {
    return await axiosInstance.post(
      `${apiRoutes.UPDATE_STORE}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

export const verifyOtpApi = async (data: { otp: string; token: string }) =>
  await fetch(`${apiServerUrl}${apiRoutes.VERIFY_OTP}`, {
    method: "POST",
    body: JSON.stringify({
      otp: data?.otp,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${data?.token}`,
    },
  });
