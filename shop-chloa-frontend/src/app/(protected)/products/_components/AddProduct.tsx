import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  // DrawerContent,
  // DrawerHeader,
  // DrawerTitle,
  // DrawerTrigger,
} from "@mui/material";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { LoaderIcon, Package, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CreateBrand from "./CreateBrand";
import CreateCategory from "./CreateCategory";
import { getBrands } from "@/services/ApiServices/brands";
import { getCategories } from "@/services/ApiServices/categories";
import AddLot from "./AddLot";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "@/services/ApiServices/products";
import { useState, useEffect, useRef } from "react";
import { DrawerTitle } from "@/components/ui/drawer";
import Autocomplete from "@/components/mui/Autocomplete";
import { AppSupportingFileTypes } from "@/lib/config";
import { ProductUploadDrawer } from "./AiAddProduct";
// import CreateBranch from "./CreateBranch";

const productSchema = z.object({
  file: z.string(),
  name: z.string().min(1, "Product name is required"),
  brand: z.object({
    label: z.string(),
    value: z.string().min(1, "Brand is required"),
  }),
  category: z.object({
    label: z.string(),
    value: z.string().min(1, "Category is required"),
  }),
  barcode: z.string().optional(),
  description: z.string().optional(),
});

const AddProductForm = ({
  setOpen,
  setStep,
  onCreated,
}: {
  setOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  onCreated: (id: string) => void;
}) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });
  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [document, setDocument] = useState<DocumentType>();
  const [docUploading, setDocUploading] = useState<{
    status: "not-uploaded" | "uploading" | "uploaded";
    progress: number;
  }>({
    status: "not-uploaded",
    progress: 0,
  });
  const [error, setError] = useState<{
    name: string;
    errorType: "size" | "ext" | "no-data-entries" | "wrong-template";
  }>();
  const fileInputRef = useRef<HTMLInputElement>(null); // Add ref for the input element
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const filesizes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
  };
  const OnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error?.name) {
      setError(undefined);
    }

    const file = e.target.files?.[0];
    if (
      !file?.name?.match(
        new RegExp(
          `\.(${AppSupportingFileTypes.map((type) =>
            type.replace(".", "")
          ).join("|")})$`,
          "i"
        )
      )
    ) {
      setError({
        name: "Invalid file type",
        errorType: "ext",
      });

      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input value
    } else if (file.size > maxSize) {
      setError({
        name: "File size exceeds the maximum limit of 5MB.",
        errorType: "size",
      });
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input value
    } else {
      setSelectedFile(file);
      form.setValue("file", file.name, {
        shouldValidate: true,
        shouldDirty: true,
      }); // Set the file name in the form
    }
  };

  const refetchBrands = async () => {
    const response = await getBrands();
    setBrands(
      response.map((brand) => ({ label: brand.name, value: brand.id }))
    );
  };

  const refetchCategories = async () => {
    const response = await getCategories();
    setCategories(
      response.map((category) => ({ label: category.name, value: category.id }))
    );
  };

  useEffect(() => {
    refetchBrands();
    refetchCategories();
  }, []);

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    console.log("Product Data:", data);
    setIsLoading(true);
    createProduct({
      name: data.name,
      brand: data.brand.value,
      category: data.category.value,
      barcode: data.barcode,
      description: data.description,
    })
      .then((product) => {
        console.log("Product created successfully:", product);
        const newId = (product as any)._id ?? (product as any).id;
        onCreated(String(newId));
        setStep(2);
      })
      .catch((error) => {
        console.error("Error creating product:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="file"
            rules={{ required: "File is required" }}
            render={({ field }) => (
              <FormItem>
                <Label>Product Label Image</Label>
                <FormControl>
                  <div className="row flex  justify-center  w-full ">
                    {selectedFile?.name ? (
                      <div className=" w-full items-start p-4 gap-2 border-2 border-input rounded-lg">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt={"file icon"}
                          className="w-auto mx-auto max-h-[300px]"
                        />
                        <div className="flex flex-col gap-2 w-full ">
                          <div className="flex gap-2   w-full  justify-between">
                            {/* <h6 className="w-full text-sm md:text-base overflow-clip text-gray-neutral-700 font-medium">
                                {selectedFile.name}
                              </h6>
                              <p className="text-gray-400 text-sm min-w-max">
                                {filesizes(selectedFile.size)}
                              </p> */}
                          </div>
                          {docUploading.status === "not-uploaded" ? (
                            <div className="flex items-center justify-end">
                              <Button
                                variant="ghost"
                                className="text-primary p-0 hover:text-primary/90"
                                onClick={() => {
                                  if (fileInputRef.current)
                                    fileInputRef.current.click();
                                  setDocUploading({
                                    status: "not-uploaded",
                                    progress: 0,
                                  });
                                  setSelectedFile(null);
                                  form.resetField("file"); // Clear the file input
                                }}
                              >
                                Select Again
                              </Button>
                            </div>
                          ) : docUploading.status === "uploading" ? (
                            <div className="file-loader"></div>
                          ) : docUploading.status === "uploaded" ? (
                            <div className="flex items-center justify-between">
                              <Button
                                variant="ghost"
                                className="text-primary h-5 font-semibold hover:text-primary/90 p-0"
                                onClick={() => {
                                  if (fileInputRef.current)
                                    fileInputRef.current.click();
                                  setDocUploading({
                                    status: "not-uploaded",
                                    progress: 0,
                                  });
                                  setSelectedFile(null);
                                  form.resetField("file"); // Clear the file input
                                }}
                              >
                                Reupload
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="imageUpload"
                        className="w-full h-full  border-input border-dashed  rounded-lg  border-2 "
                      >
                        <div className="cursor-pointer w-full h-full relative flex flex-col p-8 items-center space-y-2 px-4 justify-center mx-auto">
                          <input
                            type="file"
                            id="imageUpload"
                            ref={fileInputRef} // Attach ref to the input element
                            className="h-full w-full absolute top-0 left-0 opacity-0"
                            onChange={OnUpload}
                            multiple={true}
                            accept={AppSupportingFileTypes.join(",")}
                          />
                          <div className="bg-[#F5F5F5] rounded-full p-3 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M9.00043 17.7505C8.59043 17.7505 8.25043 17.4105 8.25043 17.0005V12.8105L7.53043 13.5305C7.24043 13.8205 6.76043 13.8205 6.47043 13.5305C6.18043 13.2405 6.18043 12.7605 6.47043 12.4705L8.47043 10.4705C8.68043 10.2605 9.01043 10.1905 9.29043 10.3105C9.57043 10.4205 9.75043 10.7005 9.75043 11.0005V17.0005C9.75043 17.4105 9.41043 17.7505 9.00043 17.7505Z"
                                fill="#0D74BA"
                              />
                              <path
                                d="M11.0004 13.7504C10.8104 13.7504 10.6204 13.6804 10.4704 13.5304L8.47043 11.5304C8.18043 11.2404 8.18043 10.7604 8.47043 10.4704C8.76043 10.1804 9.24043 10.1804 9.53043 10.4704L11.5304 12.4704C11.8204 12.7604 11.8204 13.2404 11.5304 13.5304C11.3804 13.6804 11.1904 13.7504 11.0004 13.7504Z"
                                fill="#0D74BA"
                              />
                              <path
                                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H14C14.41 1.25 14.75 1.59 14.75 2C14.75 2.41 14.41 2.75 14 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V10C21.25 9.59 21.59 9.25 22 9.25C22.41 9.25 22.75 9.59 22.75 10V15C22.75 20.43 20.43 22.75 15 22.75Z"
                                fill="#0D74BA"
                              />
                              <path
                                d="M22 10.7505H18C14.58 10.7505 13.25 9.42048 13.25 6.00048V2.00048C13.25 1.70048 13.43 1.42048 13.71 1.31048C13.99 1.19048 14.31 1.26048 14.53 1.47048L22.53 9.47048C22.74 9.68048 22.81 10.0105 22.69 10.2905C22.57 10.5705 22.3 10.7505 22 10.7505ZM14.75 3.81048V6.00048C14.75 8.58048 15.42 9.25048 18 9.25048H20.19L14.75 3.81048Z"
                                fill="#0D74BA"
                              />
                            </svg>
                          </div>
                          {isDesktop ? (
                            <div>
                              <span className="font-semibold text-primary">
                                Drag & Drop
                              </span>{" "}
                              or Click to Upload
                            </div>
                          ) : (
                            <div className="font-semibold text-primary">
                              Tap to Upload
                            </div>
                          )}
                          <p className="text-gray-neutral-600 text-center mt-2 text-sm">
                            Maximum allowed file size: 10MB <br /> Supported
                            file types:{" "}
                            {AppSupportingFileTypes.join(", ").replaceAll(
                              ".",
                              ""
                            )}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a product label image to automatically extract the
                  product name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>
                    Brand <span className="text-red-600">*</span>
                  </FormLabel>{" "}
                  <CreateBrand
                    setBrand={field.onChange}
                    refetchBrands={refetchBrands}
                  >Add Brand</CreateBrand>
                </div>

                <FormControl>
                  <Autocomplete
                    placeholder={"Select Brand"}
                    {...field}
                    options={brands || []}
                    getOptionLabel={(option) => option.label || ""}
                    onChange={(event, value) => {
                      field.onChange(value);
                    }}
                    value={(field.value as any) || null}
                    isOptionEqualToValue={(option: any, value: any) => {
                      return option.value == value.value;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>
                    Category <span className="text-red-600">*</span>
                  </FormLabel>{" "}
                  <CreateCategory
                    setCategory={field.onChange}
                    refetchCategories={refetchCategories}
                  />
                </div>

                <FormControl>
                  <Autocomplete
                    placeholder={"Select Category"}
                    {...field}
                    options={categories || []}
                    getOptionLabel={(option) => option.label || ""}
                    onChange={(event, value) => {
                      field.onChange(value);
                    }}
                    value={(field.value as any) || null}
                    isOptionEqualToValue={(option: any, value: any) => {
                      return option.value == value.value;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" placeholder="Product barcode" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Product description, notes, etc."
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              "Add Product"
            )}
          </Button>
          {/* <Button
            type="button"
            variant="outline"
            className="ml-2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button> */}
        </div>
      </form>
    </Form>
  );
};
interface AddProductProps {
  refetchProducts: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ refetchProducts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Button>
      <Drawer
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setStep(1);
          setCreatedProductId(null);
        }}
        anchor={isDesktop ? "right" : "bottom"}
      >
        <div className={cn("min-h-[300px] md:min-w-[500px] py-4 px-6")}>
          <div>
            <h2 className="text-xl font-semibold">
              {step === 1 ? (
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add New Product
                </div>
              ) : (
                "Add Lot"
              )}
            </h2>
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          {step === 1 ? (
            <p className="text-muted-foreground text-sm  max-w-[450px] pb-2">
              Upload a product image and extract product details using AI. You
              can also scan a barcode for automatic entry. Review and edit the
              extracted fields before adding the product.
            </p>
          ) : (
            ""
          )}

          {step === 1 ? (
            <ProductUploadDrawer
              setOpen={setIsOpen}
              setStep={setStep}
              onCreated={(id: string) => {
                setCreatedProductId(id);
                refetchProducts();
              }}
            />
          ) : step === 2 ? (
            <div>
              <p>You can add a lot for the product here or skip this step.</p>
              {createdProductId && (
                <div className="mt-4">
                  <AddLot
                    productId={createdProductId}
                    onLotAdded={() => {
                      refetchProducts();
                      setIsOpen(false);
                    }}
                  />
                </div>
              )}
              <div className="mt-2 pb-8 flex justify-end">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    refetchProducts();
                  }}
                  variant="outline"
                  className=" w-full"
                >
                  Skip
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Drawer>
    </div>
  );
};

export default AddProduct;
