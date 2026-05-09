import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Checkbox,
  Paper,
  InputAdornment,
} from "@mui/material";
import { cn } from "@/lib/utils";

// Types
export type OptionType = {
  id?: string | number;
  label: string;
  value: string;
  [key: string]: any; // Allow additional properties
};

interface LazyLoadingAutocompleteProps {
  // Core props
  placeholder: string;
  apiService: (page: number, search: string) => Promise<OptionType[]>;
  handleOnChange: (value: OptionType | OptionType[] | null) => void;

  // Optional props
  value?: OptionType | OptionType[] | null;
  multiple?: boolean;
  getOptionLabel?: (option: string | OptionType) => string;
  isOptionEqualToValue?: (option: OptionType, value: OptionType) => boolean;
  renderOption?: (
    props: any,
    option: OptionType,
    state: any
  ) => React.ReactNode;
  startAdornmentIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";

  // Pagination props
  enablePagination?: boolean;
  totalPages?: number;

  // Styling
  sx?: any;
  paperSx?: any;

  // Advanced props
  freeSolo?: boolean;
  disableCloseOnSelect?: boolean;
  filterSelectedOptions?: boolean;
  limitTags?: number;
  noOptionsText?: string;
  loadingText?: string;
  pageSize?: number;
  // Callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onDelete?: (value: OptionType) => void;
}

const emptyOptions: readonly OptionType[] = [];

const LazyLoadingAutocomplete: React.FC<LazyLoadingAutocompleteProps> = ({
  placeholder,
  apiService,
  handleOnChange,
  value = null,
  multiple = false,
  getOptionLabel = (option) =>
    typeof option === "string" ? option : option.label,
  isOptionEqualToValue = (option, value) => option.value === value.value,
  renderOption,
  startAdornmentIcon,
  loading: externalLoading = false,
  disabled = false,
  error = false,
  helperText,
  label,
  fullWidth = true,
  size = "medium",
  variant = "outlined",
  enablePagination = false,
  totalPages = 100,
  sx,
  paperSx,
  freeSolo = false,
  disableCloseOnSelect,
  filterSelectedOptions = false,
  limitTags = 2,
  pageSize = 20,
  noOptionsText = "No options",
  loadingText = "Loading...",
  onOpen,
  onClose,
  onDelete,
}) => {
  // State management
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly OptionType[]>(emptyOptions);
  const [internalLoading, setInternalLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loading = externalLoading || internalLoading;

  // Debounced fetch function
  const fetchOptions = useCallback(
    async (page: number, search: string, append: boolean = false) => {
      let active = true;

      if (!append) {
        setInternalLoading(true);
      }

      try {
        const results = await apiService(page, search);

        if (!active) return;

        if (append && page > 1) {
          // Append new results for pagination
          setOptions((prevOptions) => {
            const newOptions = [...prevOptions, ...results];
            // Remove duplicates based on id
            const uniqueOptions = newOptions.filter(
              (option, index, arr) =>
                arr.findIndex((item) => item.id === option.id) === index
            );
            return uniqueOptions;
          });

          // Check if we have more pages
          setHasMore(!(results.length < pageSize) && page < totalPages);
        } else {
          // Replace options for new search
          let newOptions: readonly OptionType[] = results || [];

          // Keep current value in options if it exists and not in results
          if (value && !multiple) {
            const valueInResults = results.some((result) =>
              isOptionEqualToValue(result, value as OptionType)
            );
            if (!valueInResults) {
              newOptions = [value as OptionType, ...results];
            }
          } else if (value && multiple && Array.isArray(value)) {
            const missingValues = value.filter(
              (val) =>
                !results.some((result) => isOptionEqualToValue(result, val))
            );

            newOptions = [...missingValues, ...results];
          }

          setOptions(newOptions);
          setCurrentPage(1);
          setHasMore(!(results.length < pageSize) && totalPages > 1);
        }

        setLastSearchTerm(search);
      } catch (error) {
        console.error("Error fetching options:", error);
        if (active) {
          if (!append) {
            setOptions(emptyOptions);
          }
        }
      } finally {
        if (active && !append) {
          setInternalLoading(false);
        }
      }

      return () => {
        active = false;
      };
    },
    [apiService, value, multiple, isOptionEqualToValue, totalPages]
  );

  // Handle input changes with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only fetch if the search term has changed
    if (lastSearchTerm === inputValue && hasInitialLoad) {
      return;
    }

    // Only fetch if component is open or it's the first time
    if (!open && hasInitialLoad) {
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchOptions(1, inputValue, false);
      setHasInitialLoad(true);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue, fetchOptions]);

  // Initialize options when component opens for the first time
  useEffect(() => {
    if (open && !hasInitialLoad) {
      fetchOptions(1, "", false);
    }
  }, [open, fetchOptions, hasInitialLoad]);

  // Handle pagination scroll
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      if (!enablePagination || !hasMore || loading) return;

      const listboxNode = event.currentTarget;
      const position = listboxNode.scrollTop + listboxNode.clientHeight;

      if (listboxNode.scrollHeight - position <= 1) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchOptions(nextPage, inputValue, true);
      }
    },
    [enablePagination, hasMore, loading, currentPage, inputValue, fetchOptions]
  );

  // Custom Paper component
  const CustomPaper = (props: any) => (
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
        ...paperSx,
      }}
    />
  );

  // Default render option
  const defaultRenderOption = (props: any, option: OptionType, state: any) => {
    const { selected } = state;
    const { key, ...otherProps } = props;

    return (
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
    );
  };

  return (
    <Autocomplete
      sx={{
        height: "calc(var(--spacing) * 10)",
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
      open={open}
      onOpen={() => {
        setOpen(true);
        onOpen?.();
      }}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
      value={value}
      onChange={(event, newValue) => {
        if (multiple) {
          setOptions(
            newValue ? [...(newValue as OptionType[]), ...options] : options
          );
        } else {
          setOptions(newValue ? [newValue as OptionType, ...options] : options);
        }
        handleOnChange(newValue as any);

        if (freeSolo && inputValue && !multiple) {
          setInputValue("");
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      options={options}
      loading={loading}
      multiple={multiple}
      freeSolo={freeSolo}
      disabled={disabled}
      disableCloseOnSelect={disableCloseOnSelect ?? multiple}
      filterSelectedOptions={filterSelectedOptions}
      limitTags={limitTags}
      fullWidth={fullWidth}
      size={size}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // Disable client-side filtering
      noOptionsText={loading ? loadingText : noOptionsText}
      loadingText={loadingText}
      renderOption={renderOption || defaultRenderOption}
      slots={{
        paper: CustomPaper,
      }}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          style: { maxHeight: "300px" },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant={variant}
          error={error}
          helperText={helperText}
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
          className={cn(
            "text-sm font-medium placeholder:text-muted-foreground! shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] rounded-lg",
            "focus:ring-2 focus:ring-primary focus:outline-none"
          )}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              style: {
                padding: "0.5rem 0.75rem",
                fontSize: "0.875rem",
              },
            },
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornmentIcon && (
                    <InputAdornment position="start">
                      {startAdornmentIcon}
                    </InputAdornment>
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default LazyLoadingAutocomplete;
