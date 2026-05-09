import React, { ReactElement, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import {
  Autocomplete,
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
  id: string;
  name: string;
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
  handleOnChange: (value: optionsType | optionsType[]) => void;

  onDelete?: (value: optionsType) => void;
  multiple?: boolean;
  getOptionLabel?: (value: optionsType) => string;
  refresh?: number;
  totalPage?: number;
  startAdornmentIcon?: any;
  placeholder: string;
}

function MultiSelect({
  placeholder,
  handleOnChange,
  getOptionLabel,
  isOptionEqualToValue,
  value,
  multiple = true,
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
    <Autocomplete
      sx={{
        height: "calc(var(--spacing) * 10)",
        borderColor: "var(--input)",
        "& .MuiAutocomplete-inputRoot": {
          padding: "0",
          paddingInlineStart: "0.25rem",
          borderRadius: "calc(var(--radius) + 4px)",
          "&:hover": {
            borderColor: "var(--primary)",
          },
        },
        
        borderRadius: "calc(var(--radius) + 4px)",
        backgroundColor: "var(--background)",
        color: "var(--muted-foreground)",
        ...sx,
      }}
      limitTags={2}
      multiple={multiple}
      value={value}
      onBlur={() => {
        if (rest.freeSolo && searchValue && !multiple) {
          handleOnChange(searchValue as any);
        }
      }}
      disableCloseOnSelect
      onChange={(e, value) => {
        handleOnChange(value as optionsType | optionsType[]);
        if (rest.freeSolo && searchValue && !multiple) {
          setSearchValue("");
        }
      }}
      isOptionEqualToValue={
        isOptionEqualToValue
          ? isOptionEqualToValue
          : (options, value) => options === value
      }
      getOptionLabel={
        getOptionLabel
          ? (value) => getOptionLabel(value as optionsType)
          : (value) => (typeof value === "string" ? value : value.name)
      }
      popupIcon={<ChevronDown size={20} />}
      slots={{
        paper: CustomPaper,
      }}
      renderTags={(values, getTagProps) => {
        const chips = values.length > 2 ? values.slice(0, 2) : values;
        return (
          <>
            {chips?.map((value: any, index) => {
              return (
                <React.Fragment key={index}>
                  <Chip
                    color="warning"
                    sx={{
                      color: "var(--primary)",
                      fontSize: "14px",
                      height: "30px",
                      margin: "1px !important",
                      marginLeft: "0.25rem !important",
                      backgroundColor: "var(--card) !important",
                      borderRadius: "20px !important",
                      borderColor: "var(--primary)",
                      "& .MuiChip-deleteIcon": {
                        color: "var(--muted-foreground)",
                        "&:hover": {
                          color: "var(--primary)",
                        },
                      },
                    }}
                    variant="outlined"
                    label={getOptionLabel ? getOptionLabel(value) : value.label}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      onDelete && onDelete(value);
                    }}
                  />
                </React.Fragment>
              );
            })}
            {values.length > 2 && <span className="text-muted-foreground ps-1">+{values.length - 2}</span>}
          </>
        );
      }}
      renderOption={(props: any, option: any, { selected }) => (
        <li
          className={cn(
            "flex items-center rounded-lg text-sm cursor-pointer",
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
              // style={{ marginRight: 1 }}
              checked={selected}
              sx={{
                color: "var(--primary)",
                padding: "0.25rem",
              }}
            />
          )}
          {props.key}
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
                padding: "0.5rem 0.75rem",
                fontSize: "1rem",
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

export default MultiSelect;
