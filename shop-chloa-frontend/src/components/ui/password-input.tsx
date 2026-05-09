import * as React from "react";

import { cn } from "@/lib/utils";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export interface PasswordInputProps
  extends React.ComponentProps<"input"> {}

const PasswordInput = (
  {

    className,
    ...props
  }: PasswordInputProps 
) => {
  const [type, setType] = React.useState("password");
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors  placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
  
        {...props}
      />
      <div className="absolute h-9 cursor-pointer top-0 right-2 flex items-center">
        {type == "password" ? (
          <IoMdEye
            size={"24"}
            color="hsl(var(--muted-foreground))"
            onClick={() => {
              setType("text");
            }}
          />
        ) : (
          <IoMdEyeOff
            size={"24"}
            color="hsl(var(--muted-foreground))"
            onClick={() => {
              setType("password");
            }}
          />
        )}
      </div>
    </div>
  );
};
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
