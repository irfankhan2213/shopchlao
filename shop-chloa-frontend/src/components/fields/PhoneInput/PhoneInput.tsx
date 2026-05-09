import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import parsePhoneNumber, { AsYouType } from "libphonenumber-js";
import flags from "react-phone-number-input/flags";
import { CheckIcon, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { timezoneToCountry } from "@/lib/constant";
import { phoneSelectOptions } from "./utils";
import { Metadata } from "libphonenumber-js";

const metadata = new Metadata();

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange: (
      value: string,
      selectedCountry: {
        label: string;
        value: RPNInput.Country;
        dialCode: string;
      } | null,
      number: string
    ) => void;
    onCountrySelect?: (country: {
      label: string;
      value: string;
      dialCode: string;
    }) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      const inputRef = React.useRef<HTMLInputElement>(null);

      const [caretPosition, setCaretPosition] = React.useState(0);
      const [cleanedInputValue, setCleanedInputValue] = React.useState("");
      const [selectedCountry, setSelectedCountry] = React.useState<{
        label: string;
        value: RPNInput.Country;
        dialCode: string;
      } | null>(null);
      const [userLocationCountryCode, setUserLocationCountryCode] =
        React.useState<{ label: string; value: RPNInput.Country }>();
      const formatInputValue = React.useCallback(() => {
        if (inputRef.current) {
          const asYouType = new AsYouType(selectedCountry?.value);

          // Handle the raw input by removing formatting characters
          const cleanedInput = cleanedInputValue;

          const formattedNumber = asYouType.input(cleanedInput);

          const formattedTemplate = asYouType.getTemplate() || "";
          const newCaretPosition = calculateNewCaretPosition(
            caretPosition,
            inputRef.current.value,
            formattedNumber
          );
          if (cleanedInput.length > formattedTemplate.indexOf(")")) {
            inputRef.current.value = formattedNumber;
          }
          inputRef?.current?.setSelectionRange(
            newCaretPosition,
            newCaretPosition
          );
        }
      }, [cleanedInputValue, selectedCountry]);
      const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.target.value;
          if (/^\d*$/.test(input)) {
            const asYouType = new AsYouType(selectedCountry?.value);
            metadata.selectNumberingPlan(selectedCountry?.value as any);
            const possibleLengths =
              selectedCountry?.value === "IN"
                ? [8, 9, 10]
                : metadata?.numberingPlan?.possibleLengths() || [10];
            setCaretPosition(e.target.selectionStart || 0);
            // Handle the raw input by removing formatting characters
            const cleanedInput = input.replace(/[\s()-+/-]/g, "").trim();

            if (selectedCountry?.value === "IN") {
              // if (cleanedInput.startsWith(selectedCountry?.dialCode)) {
              //   cleanedInput = cleanedInput.slice(
              //     selectedCountry?.dialCode.length
              //   );
              // } else if (
              //   cleanedInput.startsWith(
              //     RPNInput.getCountryCallingCode(selectedCountry.value)
              //   )
              // ) {
              //   cleanedInput = cleanedInput.slice(
              //     RPNInput.getCountryCallingCode(selectedCountry.value).length
              //   );
              // }
            }

            const isValidLength = possibleLengths.some(
              (length) => input?.length <= length
            );

            if (isValidLength) {
              setCleanedInputValue(input);
              onChange(
                selectedCountry?.dialCode + input,
                selectedCountry,
                input
              );
            } else if (input.length <= (cleanedInputValue.length || 0)) {
              setCleanedInputValue(input);
              onChange(
                selectedCountry?.dialCode + input,
                selectedCountry,
                input
              );
            }
          }
        },
        [selectedCountry, cleanedInputValue, onChange]
      );
      const calculateNewCaretPosition = (
        oldPosition: number,
        originalValue: string,
        formattedValue: string
      ) => {
        const newPosition = oldPosition;
        let addedChars = 0;

        for (let i = 0; i < newPosition; i++) {
          if (formattedValue[i] !== originalValue[i - addedChars]) {
            if (!/[0-9]/.test(originalValue[i - addedChars])) {
              addedChars--;
            } else if (!/[0-9]/.test(formattedValue[i])) {
              addedChars++;
            }
          }
        }
        return newPosition + addedChars;
      };
      // React.useEffect(() => {
      //   const debounce = setTimeout(() => {
      //     formatInputValue();
      //   }, 500);
      //   return () => clearTimeout(debounce);
      // }, [selectedCountry, cleanedInputValue]);

      React.useEffect(() => {
        if (props?.value && cleanedInputValue === "") {
          const parsedNumber = parsePhoneNumber(props.value);
          const country = phoneSelectOptions.find(
            (x) => x.value === parsedNumber?.country
          );
          if (country?.value) {
            setSelectedCountry({
              label: country?.label || "",
              value: country.value as RPNInput.Country,
              dialCode: `+${parsedNumber?.countryCallingCode || ""}`,
            });
            setCleanedInputValue(parsedNumber?.nationalNumber || "");
          }
        }
      }, [props.value]);

      return (
        <div
          className={cn(
            "flex w-full rounded-md h-10 focus-within-visible:outline-none ring-1 ring-input focus-within:!ring-2 focus-within:!ring-primary hover:ring-1 hover:ring-ring",
            props.disabled && "cursor-not-allowed pointer-events-none opacity-50",
            className
          )}
        >
          <CountrySelect
            setSelectedCountry={setSelectedCountry}
            value={selectedCountry?.value}
            options={phoneSelectOptions as any}
            userLocationCountryCode={userLocationCountryCode}
            setUserLocationCountryCode={setUserLocationCountryCode}
          />
          <InputComponent
            className="ps-2"
            ref={inputRef}
            type="tel"
            // {...props}
            onChange={handleInputChange}
            placeholder={props.placeholder}
            value={cleanedInputValue}
            // onBlur={formatInputValue}
          />
        </div>
      );
    }
  );

PhoneInput.displayName = "PhoneInput";
interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        "rounded-e-lg peer border-0 h-10 w-full focus-visible:outline-none rounded-s-none ",
        className
      )}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";

type CountryCodeItemProps = {
  item: { label: string; value: RPNInput.Country };
  value?: RPNInput.Country;
  handleSelect: (item: { label: string; value: RPNInput.Country }) => void;
};

const CountryCodeItem: React.FC<CountryCodeItemProps> = ({
  item,
  value,
  handleSelect,
}) => {
  return (
    <div
      className={cn(
        item.value === value && "bg-[#D8E9F4]",
        "gap-2 cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#D8E9F4] hover:text-accent-foreground"
      )}
      key={item.value}
      onClick={() => handleSelect(item)}
    >
      <FlagComponent country={item.value} countryName={item.label} />
      <span className="flex-1 text-sm">{item.label}</span>
      {item.value && (
        <span className="text-foreground/50 text-sm">
          {`+${RPNInput.getCountryCallingCode(item.value)}`}
        </span>
      )}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          item.value === value ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

type CountrySelectProps = {
  disabled?: boolean;
  setSelectedCountry: React.Dispatch<
    React.SetStateAction<{
      label: string;
      value: RPNInput.Country;
      dialCode: string;
    } | null>
  >;
  value?: RPNInput.Country;
  onChange?: (value: string) => void;
  options: { label: string; value: RPNInput.Country }[];
  userLocationCountryCode?: { label: string; value: RPNInput.Country };
  setUserLocationCountryCode: React.Dispatch<
    React.SetStateAction<{ label: string; value: RPNInput.Country } | undefined>
  >;
};

const CountrySelect: React.FC<CountrySelectProps> = ({
  disabled,
  setSelectedCountry,
  value,
  onChange,
  options,
  userLocationCountryCode,
  setUserLocationCountryCode,
}) => {
  const [search, setSearch] = React.useState<string>("");
  const [filterOptions, setFilterOptions] = React.useState(options);
  const countryCodeGroup = React.useRef<HTMLDivElement | null>(null);

  const handleSelect = React.useCallback(
    (country: { label: string; value: RPNInput.Country }) => {
      setSelectedCountry({
        label: country.label,
        value: country.value,
        dialCode: country.value
          ? `+${RPNInput.getCountryCallingCode(country.value)}`
          : "",
      });
    },
    [setSelectedCountry]
  );

  React.useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userCountryCode = options.find(
      (x) =>
        x.value ===
        timezoneToCountry[userTimezone as keyof typeof timezoneToCountry]
    );
    if (userCountryCode) {
      handleSelect(userCountryCode);
      setUserLocationCountryCode(userCountryCode);
    }
  }, [options, setUserLocationCountryCode]);

  React.useEffect(() => {
    if (search) {
      countryCodeGroup.current?.scrollIntoView(true);
    }
    setFilterOptions(
      options.filter((x) =>
        search ? x.label.toLowerCase().startsWith(search.toLowerCase()) : true
      )
    );
  }, [search, options]);

  React.useEffect(() => {
    const country = options.find((x) => x.value === value);

    if (country?.value) {
      setSelectedCountry({
        label: country.label,
        value: country.value,
        dialCode: `+${RPNInput.getCountryCallingCode(country.value)}`,
      });
    }
  }, [value, options, setSelectedCountry]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex gap-1 h-full items-center bg-white  rounded-e-none rounded-s-lg px-3 pe-2 border-e-2",
          )}
          disabled={disabled}
        >
          {value ? (
            <>
              <FlagComponent country={value} countryName={value} />
              <div className="h-full flex flex-col justify-center">
                +{RPNInput.getCountryCallingCode(value || "")}
              </div>
            </>
          ) : (
            "🌐"
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-[350px] !p-0 z-[1250]">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground">
          <div className="max-h-[350px] overflow-y-auto overflow-x-hidden">
            <div className="p-3 pb-3">
              <div className="font-semibold text-sm pb-1">
                Select Country Code
              </div>
              <div className="flex items-center rounded-lg sticky border focus-within-visible:outline-none ring-1 ring-input focus-within:ring-2 focus-within:ring-primary">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className={cn(
                    "flex h-10 w-full rounded-md bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 "
                  )}
                />
                <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
              </div>
            </div>
            <ScrollArea className="h-60 px-2">
              {userLocationCountryCode && (
                <div className="pb-3">
                  <div className="font-semibold text-xs pb-2 px-1">
                    Based on your location
                  </div>
                  <CountryCodeItem
                    value={value}
                    item={userLocationCountryCode}
                    handleSelect={handleSelect}
                  />
                </div>
              )}
              <div
                ref={countryCodeGroup}
                className="font-semibold text-xs px-1"
              >
                Alphabetical
              </div>
              {filterOptions.length > 0 ? (
                <div className="overflow-hidden p-1 text-[#536179]">
                  {filterOptions.map((option) => (
                    <React.Fragment key={option.value}>
                      <CountryCodeItem
                        key={option.value}
                        value={value}
                        item={option}
                        handleSelect={handleSelect}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm">No results found</div>
              )}
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export default PhoneInput;
