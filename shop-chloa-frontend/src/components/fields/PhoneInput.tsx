import React, { useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type propsType = {
  country?: string;
  handelOnChange?: (countryCodeName: any, data: CountryData) => void;
  placeholder?: string;
  name: string;
  defaultValue?: string;
  bgColor?: string;
  [key: string]: any;
};

export default function PhoneInputComp({
  country = "in",
  handelOnChange,
  placeholder,
  name,
  defaultValue,
  bgColor = "#F9FAFB",
}: propsType) {
  const { control } = useFormContext();
  const [borderColor, setBorderColor] = useState<string>("var(--input)");

  return (
    <FormField
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormLabel>Mobile Number<span className="text-red-600">*</span></FormLabel>
          <FormControl>
            <PhoneInput
              onChange={(e, data: CountryData) => {
                onChange(e);
                handelOnChange && handelOnChange(e, data);
              }}
              onFocus={() => setBorderColor("var(--primary)")}
              onBlur={() => setBorderColor("var(--input)")}
              value={value?.length || value?.length == 0 ? value : defaultValue}
              placeholder={placeholder}
              country={country}
              containerStyle={{
                background: "transparent",
              }}
              countryCodeEditable={false}
              buttonStyle={{
                background: "#F9FAFB",
                borderRadius: "6px",
                borderColor: "white",

                height: "2rem",
                margin: "auto",
                marginLeft: "2px",
              }}
              // dropdownStyle={{
              //   background: "black",
              // }}
              inputProps={{
                style: {
                  borderRadius: "6px",
                  borderColor: `${borderColor} !important`,
                  width: "100%",
                  border: `solid 1px ${borderColor}`,
                  background: bgColor,
                  paddingTop:"0.25rem",
                  paddingBottom:"0.25rem",
                  overflow: "hidden",
                  height: "2.25rem",
                  boxShadow: `0px 0px 2px 0px ${borderColor}`,
                  paddingLeft: "2.8rem",
                },
              }}
              // specialLabel=""
              // type={`${textType}`}
              // onChange={(phone) => this.setState({ phone })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
      control={control}
      name={name}
    />
  );
}
