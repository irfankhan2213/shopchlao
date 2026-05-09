import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCategory } from "@/services/ApiServices/categories";
import { LoaderIcon, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
});

interface CreateCategoryProps {
  refetchCategories: () => void;
  setCategory: (category: any) => void;
  children?: any;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  refetchCategories,
  setCategory,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await createCategory({ name: data.name });
      toast.success("Category created successfully");
      setCategory({ label: response.name, value: response.id });
      refetchCategories();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="z-[1500]" overLayClassName="z-[1250]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category to organize your inventory.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Name</Label>
                      <Input placeholder="Enter category name" {...field} />
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
                      <Input
                        placeholder="Enter category description"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isLoading ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      "Add Category"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCategory;
