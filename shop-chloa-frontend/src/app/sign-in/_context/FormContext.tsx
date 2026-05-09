import { createContext, useContext, useState, ReactNode } from "react";

interface FormData {
  contactType: "phone" | "email";
  phone: string;
  phone_number: string;
  countryCode: {
    dialCode: string;
    label: string;
    value: string;
  };
  token: string;
  email: string;

}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    contactType: "email",
    phone: "",
    token: "",
    email: "",  
    phone_number: "",
    countryCode: {
      dialCode: "",
      label: "",
      value: "",
    },
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
