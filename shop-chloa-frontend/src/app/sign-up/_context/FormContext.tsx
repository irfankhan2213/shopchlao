import { createContext, useContext, useState, ReactNode } from "react";

interface FormData {
  // Basic Details
  owner_name: string;
  company_name: string;
  state: string;

  // Contact Details
  phone: string;
  phone_number: string;
  email: string;
  countryCode?: {
    value: string;
    dialCode: string;
    label: string;
  };
  token?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    owner_name: "",
    company_name: "",
    state: "",
    phone: "",
    phone_number: "",
    email: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
