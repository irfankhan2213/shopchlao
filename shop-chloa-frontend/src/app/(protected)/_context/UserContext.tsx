"use client";
import apiRoutes from "@/services/ApiServices/apiRoutes";
import axiosInstance from "@/services/ApiServices/axiosInstance";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface FormData {
  id: string;
  name: string;

  email: string;
  phone: string;
  shopName: string;
  state: string;
  status: string;
  role?: string;
  image?: string; // Optional field for user image
}

interface UserContextType {
  user: FormData;
  updateUser: (data: Partial<FormData>) => void;
}

const LoginUserContext = createContext<UserContextType | undefined>(undefined);

export function LoginUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FormData>({
    id: "",
    name: "",

    email: "",
    phone: "",
    shopName: "",
    state: "",
    status: "",

    image: "",
  });
  const getUserData = async () => {
    axiosInstance
      .get(apiRoutes.GET_USER)
      .then((response) => {
        const userData = response.data?.user;
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name,

            email: userData.email,
            phone: userData.phone || "",
            shopName: userData.shopName || "",
            state: userData.state || "",
            status: userData.status || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Optionally handle the error, e.g., set an error state or show a notification
      });
  };
  useEffect(() => {
    getUserData();
  }, []);

  const updateUser = (data: Partial<FormData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <LoginUserContext.Provider value={{ user, updateUser }}>
      {children}
    </LoginUserContext.Provider>
  );
}

export function useLoginUserContext() {
  const context = useContext(LoginUserContext);
  if (context === undefined) {
    throw new Error(
      "useLoginUserContext must be used within a LoginUserProvider"
    );
  }
  return context;
}
