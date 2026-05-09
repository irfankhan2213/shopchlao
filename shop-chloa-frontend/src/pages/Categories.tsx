"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Tag, Building } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CreateCategory from "@/app/(protected)/products/_components/CreateCategory";
import CreateBrand from "@/app/(protected)/products/_components/CreateBrand";
import {
  getCategories,
  deleteCategory,
  updateCategory,
  type Category as CategoryType,
} from "@/services/ApiServices/categories";
import {
  getBrands,
  deleteBrand,
  updateBrand,
  type Brand as BrandType,
} from "@/services/ApiServices/brands";
import { Badge } from "@/components/ui/badge";

const Categories = () => {
  const { toast } = useToast();

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
    error: categoriesError,
  } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: brands = [],
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
    refetch: refetchBrands,
    error: brandsError,
  } = useQuery<BrandType[]>({ queryKey: ["brands"], queryFn: getBrands });

  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [editingBrand, setEditingBrand] = useState<BrandType | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [brandForm, setBrandForm] = useState({ name: "", description: "" });

  const onEditCategory = (category: CategoryType) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
  };
  const onEditBrand = (brand: BrandType) => {
    setEditingBrand(brand);
    setBrandForm({ name: brand.name, description: brand.description || "" });
  };

  const onSaveCategory = async () => {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, categoryForm);
    toast({ title: "Category updated" });
    setEditingCategory(null);
    refetchCategories();
  };
  const onSaveBrand = async () => {
    if (!editingBrand) return;
    await updateBrand(editingBrand.id, brandForm);
    toast({ title: "Brand updated" });
    setEditingBrand(null);
    refetchBrands();
  };

  const onDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    toast({ title: "Category deleted" });
    refetchCategories();
  };
  const onDeleteBrand = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    await deleteBrand(id);
    toast({ title: "Brand deleted" });
    refetchBrands();
  };

  if (isLoadingCategories || isLoadingBrands) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (isErrorCategories || isErrorBrands) {
    return (
      <div className="p-8 text-center text-destructive">
        {categoriesError
          ? `Error loading categories: ${String(categoriesError)}`
          : null}
        {brandsError ? `\nError loading brands: ${String(brandsError)}` : null}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Categories & Brands
          </h1>
          <p className="text-muted-foreground">
            Organize your products by categories and brands
          </p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Categories</h2>
            <CreateCategory
              refetchCategories={refetchCategories}
              setCategory={() => {}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {category.productCount} products
                    </Badge>

                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => onDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Brands</h2>
            <CreateBrand refetchBrands={refetchBrands} setBrand={() => {}} >
              <Button variant="outline">Add Brand</Button>
            </CreateBrand>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-secondary" />
                    {brand.name}
                  </CardTitle>
                  <CardDescription>{brand.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditBrand(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDeleteBrand(brand.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Name</Label>
              <Input
                id="editCategoryName"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Input
                id="editCategoryDescription"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((s) => ({
                    ...s,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </Button>
              <Button onClick={onSaveCategory}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog
        open={!!editingBrand}
        onOpenChange={(open) => !open && setEditingBrand(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update the brand details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editBrandName">Name</Label>
              <Input
                id="editBrandName"
                value={brandForm.name}
                onChange={(e) =>
                  setBrandForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBrandDescription">Description</Label>
              <Input
                id="editBrandDescription"
                value={brandForm.description}
                onChange={(e) =>
                  setBrandForm((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingBrand(null)}>
                Cancel
              </Button>
              <Button onClick={onSaveBrand}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
