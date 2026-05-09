import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { createBrand } from "@/services/ApiServices/brands";
import { Label } from "@/components/ui/label";
import { Package, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const formSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
});

interface CreateBrandProps {
  refetchBrands: () => void;
  setBrand: (brand: any) => void;
  children: React.ReactNode;
}

const CreateBrand: React.FC<CreateBrandProps> = ({
  refetchBrands,
  setBrand,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await createBrand({ name: data.name });
      sonnerToast.success("Brand created successfully");
      setBrand({ label: response.name, value: response.id });
      refetchBrands();
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create brand. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const FormContent = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {" "}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <Input placeholder="Enter brand name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Description</Label>
                  <Input placeholder="Enter brand description" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh]">
        <DialogHeader className="text-left ">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Brand
          </DialogTitle>
          <DialogDescription>
            Create a new brand by providing the necessary details.
          </DialogDescription>
        </DialogHeader>
        
          <FormContent />
        
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrand;
