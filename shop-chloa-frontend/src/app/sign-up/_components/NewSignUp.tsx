"use client";
import React from "react";
import { useForm as useFormHook } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver as zodResolverHook } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
  Store,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { signUpApi } from "../_apisServices";
import PhoneInput from "@/components/fields/PhoneInput";
import { IndianStates } from "@/lib/constant";
import Autocomplete from "@/components/mui/Autocomplete";

const userSchema = zod
  .object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type UserFormType = zod.infer<typeof userSchema>;

function PersonalInfoStep({ onNext }: { onNext: (userId: string) => void }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const form = useFormHook<UserFormType>({
    resolver: zodResolverHook(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });
  const [apiError, setApiError] = React.useState("");
  const { setError } = form;
  const handleError = (errors: string[]) => {
    errors?.forEach((error: any) => {
      if (error?.includes("email")) {
        if (error.includes("already")) {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        } else {
          setError("email", {
            type: "manual",
            message: error,
          });
        }
      } else {
        setError("root.serverError", {
          type: "manual",
          message: error,
        });
      }
    });
  };

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsLoading(true);

  //   signUpApi({
  //     email: values.email,
  //     phone: values.phone_number,
  //     shopName: formData?.company_name || "",
  //     name: formData?.owner_name || "",
  //     state: values?.countryCode?.value === "IN" ? values.state || "" : "",

  //     country: values.countryCode?.label || "",
  //   })
  //     .then(async (res) => {
  //       if (res.ok) {
  //         const result = await res.json();

  //         const token = result?.token;

  //         updateFormData({
  //           phone: values.phone,
  //           phone_number: values.phone_number,
  //           email: values.email,
  //           countryCode: values.countryCode,
  //           state: values.state,
  //           token: token,
  //         });
  //         setCurrentStep(3);
  //       } else {
  //         const error = await res.json();
  //         console.log("error", error);
  //         if (error.message) {
  //           handleError([error.message]);
  //         } else {
  //           setError("root.serverError", {
  //             type: "manual",
  //             message: "Something went wrong. Please try again.",
  //           });
  //         }

  //         // if (error.error === "Your account is locked.") {
  //         //   throw new CustomError(error.error || "Invalid credentials");
  //         // }
  //         throw new Error(error.error || "Invalid credentials");
  //       }
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }
  const handleUserSubmit = async (values: UserFormType) => {
    setApiError("");
    try {
      const response = await signUpApi({
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const result = isJson ? await response.json() : null;

      if (response.ok && result) {
        const user = result.user;
        const token = result.token;

        onNext(user.id);
      } else {
        const error = isJson ? result : { message: "Something went wrong." };
        console.log("error", error);
        if (error.message) {
          handleError([error.message]);
        } else {
          setError("root.serverError", {
            type: "manual",
            message: "Something went wrong. Please try again.",
          });
        }

        // if (error.error === "Your account is locked.") {
        //   throw new CustomError(error.error || "Invalid credentials");
        // }
        throw new Error(error.error || "Invalid credentials");
      }
    } catch (err: any) {
      setApiError(err.message || "User creation failed");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUserSubmit)}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      {...field}
                      required
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        {...field}
                        required
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pl-10 pr-10"
                        {...field}
                        required
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {apiError && <div className="text-red-600 text-sm">{apiError}</div>}
          <div className="flex justify-center">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
      {/* Divider */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </div>
      {/* Social Signup Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full">
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>
      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}

const storeSchema = zod.object({
  storeName: zod.string().min(1, "Store name is required"),
  businessType: zod.string().min(1, "Business type is required"),
  phoneNumber: zod.string().min(1, "Phone number is required"),
  address: zod.string().min(1, "Address is required"),
  city: zod.string().min(1, "City is required"),
  state: zod.string().min(1, "State is required"),
  agreeToTerms: zod.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});
type StoreFormType = zod.infer<typeof storeSchema>;

function StoreInfoStep({
  userId,
  onBack,
}: {
  userId: string;
  onBack: () => void;
}) {
  const form = useFormHook<StoreFormType>({
    resolver: zodResolverHook(storeSchema),
    defaultValues: {
      storeName: "",
      businessType: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      agreeToTerms: true,
    },
    mode: "onTouched",
  });
  const [apiError, setApiError] = React.useState("");

  const handleStoreSubmit = async (values: StoreFormType) => {
    setApiError("");
    try {
      const res = await fetch("/api/update-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...values }),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Store update failed");
      alert("Signup successful!");
    } catch (err: any) {
      setApiError(err.message || "Store update failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleStoreSubmit)}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold">Store Information</h3>
        </div>
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Store Name</FormLabel>
              <div className="relative">
                <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Enter your store name"
                    className="pl-10"
                    {...field}
                    required
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <PhoneInput
          name="phoneNumber"
          placeholder="Enter contact number"
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Store Address</FormLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Street address"
                    className="pl-10"
                    {...field}
                    required
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  State<span className="text-red-600">*</span>
                </FormLabel>

                <FormControl>
                  <Autocomplete
                    placeholder="Enter State"
                    options={IndianStates.map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    defaultValue={field.value}
                    {...field}
                    onChange={(e: any, value: any) => {
                      field.onChange(value?.value || "");
                    }}
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <Separator />
              <div className="flex items-start space-x-2">
                <FormControl>
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                </FormControl>
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    Privacy Policy
                  </Link>
                  {". "}By creating an account, I confirm that the store
                  information provided is accurate.
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {apiError && <div className="text-red-600 text-sm">{apiError}</div>}
        <div className="flex justify-between">
          <Button
            type="submit"
            className="gradient-primary w-full hover:opacity-90 transition-opacity"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function NewSignup() {
  const [step, setStep] = React.useState(1);

  const [userId, setUserId] = React.useState("");

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* Header */}
        {/* <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Your Store
          </h1>
          <p className="text-muted-foreground">
            Set up your account and store information
          </p>
        </div> */}
        <Card className="shadow-elegant border-border/50 rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Welcome to ShopChlao
            </CardTitle>
            <CardDescription className="text-center">
              Create your account and set up your store details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <PersonalInfoStep
                onNext={(id: string) => {
                  setUserId(id);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <StoreInfoStep userId={userId} onBack={() => setStep(1)} />
            )}
          </CardContent>
        </Card>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="hover:text-foreground underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:text-foreground underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
