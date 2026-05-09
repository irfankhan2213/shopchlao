"use client";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/ApiServices/products';
import { Product } from '../types/product';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Camera,
  Upload,
  Scan
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AddProduct from "@/app/(protected)/products/_components/AddProduct";
import { ProductCardRow } from "@/app/(protected)/products/_components/ProductCard";
import { ProductUploadDrawer } from "@/app/(protected)/products/_components/AiAddProduct";

// ...existing code...

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = ["Medicine", "Equipment", "Hygiene", "Supplements"];

  // React Query: fetch products
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts
  });

  console.log(products);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "Out of Stock" || stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (status === "Low Stock") {
      return <Badge variant="secondary" className="bg-warning/10 text-warning-foreground">Low Stock</Badge>;
    }
    return <Badge variant="outline" className="bg-success/10 text-success">In Stock</Badge>;
  };

  const handleOCRScan = () => {
    toast({
      title: "OCR Feature",
      description: "Camera opened for product label scanning (Demo mode)",
    });
  };

  const handleAddProduct = () => {
    toast({
      title: "Product Added",
      description: "New product has been added successfully!",
    });
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-destructive">Error loading products: {error?.message}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your inventory products and details</p>
        </div>
        <AddProduct refetchProducts={refetch} />
        {/* <ProductUploadDrawer>
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
      
        </ProductUploadDrawer> */}
        {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the product details below. You can also use OCR to auto-fill from product labels.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
             
              <Card className="bg-accent/20">
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <Button variant="outline" onClick={handleOCRScan} className="flex-1 w-full sm:w-auto touch-manipulation">
                      <Camera className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Scan Product Label</span>
                      <span className="sm:hidden">Scan Label</span>
                    </Button>
                    <Button variant="outline" className="flex-1 w-full sm:w-auto touch-manipulation">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Upload Image</span>
                      <span className="sm:hidden">Upload</span>
                    </Button>
                    <Button variant="outline" className="flex-1 w-full sm:w-auto touch-manipulation">
                      <Scan className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Barcode Scan</span>
                      <span className="sm:hidden">Barcode</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand/Company</Label>
                  <Input id="brand" placeholder="Enter brand name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" placeholder="Product barcode" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP (₹)</Label>
                  <Input id="mrp" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹)</Label>
                  <Input id="costPrice" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input id="sellingPrice" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" placeholder="Product description, notes, etc." />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
                  Add Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {filteredProducts.map((product) => (
        <ProductCardRow
          key={product.id}
          product={product}
        />
      ))}
      {/* Products Table - Mobile Optimized */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            {filteredProducts.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Prices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.stock}</p>
                      <p className="text-sm text-muted-foreground">Min: {product.minStock}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">MRP: ₹{product.mrp}</p>
                      <p className="text-sm text-muted-foreground">Sell: ₹{product.sellingPrice}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status, product.stock)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{product.expiryDate}</p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Products;