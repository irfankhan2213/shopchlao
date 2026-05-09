import React, { ReactElement, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  Checkbox,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type optionsType = {
  id?: string;
  label: string;
  value: string;
};

interface propsType
  extends Omit<
    AutocompleteProps<
      optionsType | string,
      boolean | undefined,
      boolean | undefined,
      boolean,
      React.ElementType
    >,
    "renderInput" | "getOptionLabel" | "multiple"
  > {
  renderInput?: (
    params: AutocompleteRenderInputParams
  ) => React.ReactNode | undefined;

  onDelete?: (value: optionsType) => void;
  multiple?: boolean;
  getOptionLabel?: (value: optionsType) => string;
  refresh?: number;
  totalPage?: number;
  startAdornmentIcon?: any;
  placeholder: string;
}

function Autocomplete({
  placeholder,
  getOptionLabel,
  isOptionEqualToValue,
  value,
  multiple = false,
  refresh = 1,
  onDelete,
  options,
  totalPage = 100,
  sx,
  startAdornmentIcon,
  ...rest
}: propsType) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const CustomPaper = (props: any) => {
    return (
      <Paper
        elevation={8}
        {...props}
        className={cn(
          "bg-popover text-popover-foreground border  rounded-lg p-1"
        )}
        sx={{
          fontSize: "0.875rem",
          borderRadius: "calc(var(--radius) + 4px)",
          boxShadow:
            "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        }}
      />
    );
  };

  return (
    <MuiAutocomplete
      sx={{
        height: "calc(var(--spacing) * 15)",
        borderColor: "var(--input)",
        "& .MuiAutocomplete-inputRoot": {
          padding: "0",
          borderRadius: "calc(var(--radius) + 4px)",
          "&:hover": {
            borderColor: "var(--primary)",
          },
        },
        backgroundColor: "var(--background)",
        color: "var(--muted-foreground)",
        ...sx,
      }}
      className={cn(" rounded-lg", rest.className)}
      limitTags={2}
      multiple={multiple}
      value={value}
      isOptionEqualToValue={
        isOptionEqualToValue
          ? isOptionEqualToValue
          : (options, value) => options === value
      }
      getOptionLabel={
        getOptionLabel
          ? (value) => getOptionLabel(value as optionsType)
          : (value) => (typeof value === "string" ? value : value.label)
      }
      popupIcon={<ChevronDown size={16} />}
      slots={{
        paper: CustomPaper,
      }}
      renderOption={(props: any, option: any, { selected }) => (
        <li
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg text-sm cursor-pointer",
            selected && "bg-accent text-accent-foreground",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          {...props}
          sx={{
            borderRadius: "calc(var(--radius) + 4px)",
          }}
          key={option?.id || props?.key}
        >
          {multiple && (
            <Checkbox
              checked={selected}
              sx={{
                color: "var(--primary)",
              }}
            />
          )}
          {option.label || props.key}
        </li>
      )}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          value={searchValue}
          onChange={(e) => {
            if (setSearchValue) {
              setSearchValue(e.target.value);
            }
          }}
          sx={{
            "& .MuiInputBase-root": {
              padding: "0",
            },
            "& .MuiOutlinedInput-notchedOutline ": {
              borderColor: "var(--input) !important",
              borderRadius: "calc(var(--radius) + 4px) !important",
              borderWidth: "1px !important",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "var(--mute-foreground)", // Replace with your desired color
              fontSize: "0.875rem",
            },
            "& .MuiAutocomplete-input::placeholder": {
              color: "var(--muted-foreground) !important",
              opacity: "1",
              fontWeight: "500",
            },
          }}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              style: {
                padding: "0.6rem 0.75rem",
                fontSize: "0.875rem",
              },
            },
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornmentIcon && (
                    <InputAdornment position="start" className="ps-2">
                      {startAdornmentIcon}
                    </InputAdornment>
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
            },
          }}
          className={cn(
            "text-sm font-medium placeholder:text-muted-foreground! shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-lg",
            "focus:ring-2 focus:ring-primary focus:outline-none"
          )}
          placeholder={placeholder}
        />
      )}
      loading={isLoading}
      options={options}
    />
  );
}

export default Autocomplete;
