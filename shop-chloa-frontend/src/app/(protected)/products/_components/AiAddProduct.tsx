"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  Camera,
  Sparkles,
  X,
  Plus,
  Loader2,
  Package,
  QrCode,
  Scan,
  RotateCcw,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getBrands } from "@/services/ApiServices/brands";
import { getCategories } from "@/services/ApiServices/categories"; // Assuming these API functions exist
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@/components/mui/Autocomplete";
import CreateBrand from "./CreateBrand";
import CreateCategory from "./CreateCategory";
import { createProduct } from "@/services/ApiServices/products";

const aiProductSchema = z.object({
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

interface ExtractedData {
  name: string;
  brand: string;
  category: string;
  barcode: string;
  description: string;
  confidence: number;
}

interface ProductUploadDrawerProps {
  children?: React.ReactNode;
  setOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  onCreated: (id: string) => void;
}

export function ProductUploadDrawer({
  children,
  setOpen,
  setStep,
  onCreated,
}: ProductUploadDrawerProps) {
  // const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedBarcodeImage, setUploadedBarcodeImage] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBarcodeProcessing, setIsBarcodeProcessing] = useState(false);
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [isDragActive, setIsDragActive] = useState(false);
  const [isBarcodeDragActive, setIsBarcodeDragActive] = useState(false);
  const [brandOptions, setBrandOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<z.infer<typeof aiProductSchema>>({
    resolver: zodResolver(aiProductSchema),
    defaultValues: {
      name: "",
      brand: { label: "", value: "" },
      category: { label: "", value: "" },
      barcode: "",
      description: "",
    },
  });

  const handleFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBarcodeFileChange = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedBarcodeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleBarcodeDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsBarcodeDragActive(true);
  }, []);

  const handleBarcodeDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsBarcodeDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange]
  );

  const handleBarcodeDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsBarcodeDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];
      if (file) {
        handleBarcodeFileChange(file);
      }
    },
    [handleBarcodeFileChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange]
  );

  const handleBarcodeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleBarcodeFileChange(file);
      }
    },
    [handleBarcodeFileChange]
  );

  const processImage = async (file: File) => {
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockData: ExtractedData = {
        name: "Organic Whole Milk",
        brand: "Farm Fresh",
        category: "Dairy Products",
        barcode: "1234567890123",
        description: "Premium organic whole milk from grass-fed cows",
        confidence: 0.92,
      };

      // Find matching brand and category from options
      const matchingBrand = brandOptions.find(
        (brand) => brand.label === mockData.brand
      );
      const matchingCategory = categoryOptions.find(
        (category) => category.label === mockData.category
      );

      form.setValue("name", mockData.name);
      if (matchingBrand) {
        form.setValue("brand", matchingBrand);
      }
      if (matchingCategory) {
        form.setValue("category", matchingCategory);
      }
      form.setValue("description", mockData.description);

      setAiFilledFields(new Set(["name", "brand", "category", "description"]));
      setIsProcessing(false);
    }, 2000);
  };

  const processBarcodeImage = async (file: File) => {
    setIsBarcodeProcessing(true);

    // Simulate AI barcode processing
    setTimeout(() => {
      const mockBarcode = "1234567890123";
      form.setValue("barcode", mockBarcode);
      setAiFilledFields((prev) => new Set([...prev, "barcode"]));
      setIsBarcodeProcessing(false);
    }, 1500);
  };

  const handleReExtract = (type: "product" | "barcode") => {
    if (type === "product" && uploadedImage) {
      // Clear AI-filled product fields
      setAiFilledFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete("name");
        newSet.delete("brand");
        newSet.delete("category");
        newSet.delete("description");
        return newSet;
      });
      handleExtractDetails();
    } else if (type === "barcode" && uploadedBarcodeImage) {
      // Clear AI-filled barcode field
      setAiFilledFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete("barcode");
        return newSet;
      });
      handleExtractBarcode();
    }
  };

  const handleDiscardField = (fieldName: string) => {
    form.setValue(
      fieldName as keyof z.infer<typeof aiProductSchema>,
      fieldName === "brand" || fieldName === "category"
        ? { label: "", value: "" }
        : ""
    );
    setAiFilledFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const handleExtractDetails = () => {
    if (uploadedImage) {
      fetch(uploadedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "uploaded-image.jpg", {
            type: blob.type,
          });
          processImage(file);
        });
    }
  };

  const handleExtractBarcode = () => {
    if (uploadedBarcodeImage) {
      fetch(uploadedBarcodeImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "uploaded-barcode.jpg", {
            type: blob.type,
          });
          processBarcodeImage(file);
        });
    }
  };
  const onSubmit = (data: z.infer<typeof aiProductSchema>) => {
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
        setUploadedImage(null);
        setUploadedBarcodeImage(null);
        setStep(2);
      })
      .catch((error) => {
        console.error("Error creating product:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // const onSubmit = (data: z.infer<typeof aiProductSchema>) => {
  //   console.log("Submitting product:", data);
  //   setOpen(false);
  //   setUploadedImage(null);
  //   setUploadedBarcodeImage(null);
  //   setAiFilledFields(new Set());
  //   form.reset();
  // };

  const refetchBrands = async () => {
    const response = await getBrands();
    setBrandOptions(
      response.map((brand) => ({ label: brand.name, value: brand.id }))
    );
  };

  const refetchCategories = async () => {
    const response = await getCategories();
    setCategoryOptions(
      response.map((category) => ({ label: category.name, value: category.id }))
    );
  };

  useEffect(() => {
    refetchBrands();
    refetchCategories();
  }, []);

  // const FormContent = () => (
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 scale-[1.02]"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />

                {uploadedImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded product"
                      className="mx-auto max-h-32 rounded-lg object-contain shadow-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExtractDetails();
                        }}
                        disabled={isProcessing}
                        className="flex-1 bg-primary hover:bg-primary/80"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Extract Details
                          </>
                        )}
                      </Button>
                      {(aiFilledFields.has("name") ||
                        aiFilledFields.has("brand") ||
                        aiFilledFields.has("category") ||
                        aiFilledFields.has("description")) &&
                        !isProcessing && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReExtract("product");
                            }}
                            className="bg-transparent"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                          setAiFilledFields((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete("name");
                            newSet.delete("brand");
                            newSet.delete("category");
                            newSet.delete("description");
                            return newSet;
                          });
                          setIsProcessing(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isDragActive
                          ? "Drop image here"
                          : "Upload product image"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Max 10MB • JPG, PNG, WebP
                      </p>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm font-medium text-gray-700">
                        AI Processing...
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Product Label & Name
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload product image and extract details with AI
                </p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      Product Name *
                      {aiFilledFields.has("name") && (
                        <>
                          <Badge variant="default" className="text-xs">
                            AI Extracted
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDiscardField("name")}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
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
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        Brand *
                        {aiFilledFields.has("brand") && (
                          <>
                            <Badge variant="default" className="text-xs">
                              AI Extracted
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDiscardField("brand")}
                              className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </FormLabel>
                    </div>
                    <div className="flex gap-1">
                      <FormControl className="flex-1">
                        <Autocomplete
                          placeholder="Select brand"
                          {...field}
                          options={brandOptions || []}
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
                      <CreateBrand
                        setBrand={field.onChange}
                        refetchBrands={refetchBrands}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 bg-transparent"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </CreateBrand>
                    </div>
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
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        Category *
                        {aiFilledFields.has("category") && (
                          <>
                            <Badge variant="default" className="text-xs">
                              AI Extracted
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDiscardField("category")}
                              className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </FormLabel>
                    </div>
                    <div className="flex gap-1">
                      <FormControl className="flex-1">
                        <Autocomplete
                          placeholder="Select category"
                          {...field}
                          options={categoryOptions || []}
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
                      <CreateCategory
                        setCategory={field.onChange}
                        refetchCategories={refetchCategories}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 bg-transparent"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </CreateCategory>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      Description
                      {aiFilledFields.has("description") && (
                        <>
                          <Badge variant="default" className="text-xs">
                            AI Extracted
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDiscardField("description")}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description..."
                        rows={3}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <QrCode className="h-5 w-5 text-green-600" />
                Barcode & Code
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload barcode image for automatic scanning
              </p>
            </div>

            <div className="grid gap-4">
              <div
                onDragOver={handleBarcodeDragOver}
                onDragLeave={handleBarcodeDragLeave}
                onDrop={handleBarcodeDrop}
                onClick={() =>
                  document.getElementById("barcode-file-input")?.click()
                }
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                  isBarcodeDragActive
                    ? "border-green-500 bg-green-50 scale-[1.02]"
                    : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
                }`}
              >
                <input
                  id="barcode-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleBarcodeInputChange}
                  className="hidden"
                />

                {uploadedBarcodeImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedBarcodeImage || "/placeholder.svg"}
                      alt="Uploaded barcode"
                      className="mx-auto max-h-20 rounded object-contain shadow-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExtractBarcode();
                        }}
                        disabled={isBarcodeProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isBarcodeProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Scan className="h-4 w-4 mr-2" />
                            Scan Barcode
                          </>
                        )}
                      </Button>
                      {aiFilledFields.has("barcode") &&
                        !isBarcodeProcessing && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReExtract("barcode");
                            }}
                            className="bg-transparent"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedBarcodeImage(null);
                          setAiFilledFields((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete("barcode");
                            return newSet;
                          });
                          setIsBarcodeProcessing(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isBarcodeDragActive
                          ? "Drop barcode here"
                          : "Upload barcode"}
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG, WebP</p>
                    </div>
                  </div>
                )}

                {isBarcodeProcessing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Scanning barcode...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      Barcode
                      {aiFilledFields.has("barcode") && (
                        <>
                          <Badge variant="default" className="text-xs">
                            AI Scanned
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDiscardField("barcode")}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product barcode"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3 pb-4">
          <Button type="submit" className="flex-1 ">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Package className="h-4 w-4 mr-2" />
            )}
            Add Product
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );

  // if (isDesktop) {
  //   return (
  //     <Sheet open={open} onOpenChange={setOpen}>
  //       <SheetTrigger asChild>{children}</SheetTrigger>
  //       <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
  //         <SheetHeader className="text-left pb-4">
  //           <SheetTitle className="flex items-center gap-2">
  //             <Package className="h-5 w-5" />
  //             Add New Product
  //           </SheetTitle>
  //           <SheetDescription>
  //             Upload a product image and extract product details using AI. You
  //             can also scan a barcode for automatic entry. Review and edit the
  //             extracted fields before adding the product.
  //           </SheetDescription>
  //         </SheetHeader>
  //         <FormContent />
  //       </SheetContent>
  //     </Sheet>
  //   );
  // }

  // return (
  //   <Drawer open={open} onOpenChange={setOpen}>
  //     <DrawerTrigger asChild>{children}</DrawerTrigger>
  //     <DrawerContent className="max-h-[85vh]">
  //       <DrawerHeader className="text-left pb-4">
  //         <DrawerTitle className="flex items-center gap-2">
  //           <Package className="h-5 w-5" />
  //           Add New Product
  //         </DrawerTitle>
  //         <DrawerDescription>
  //           Upload a product image and manually extract details with AI
  //         </DrawerDescription>
  //       </DrawerHeader>
  //       <div className="overflow-y-auto px-4">
  //         <FormContent />
  //       </div>
  //     </DrawerContent>
  //   </Drawer>
  // );
}
