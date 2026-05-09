"use client";
import { useState } from "react";
import { 
  Plus, 
  Receipt, 
  DollarSign, 
  ShoppingCart, 
  Search,
  Calendar,
  Printer,
  Download
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const mockSales = [
  {
    id: 1,
    receiptNo: "RCP-001",
    date: "2024-01-20",
    customerName: "John Doe",
    items: [
      { name: "Paracetamol 500mg", qty: 2, price: 24.00 },
      { name: "Vitamin C", qty: 1, price: 45.00 }
    ],
    total: 93.00,
    paymentMethod: "Cash"
  },
  {
    id: 2,
    receiptNo: "RCP-002",
    date: "2024-01-20",
    customerName: "Walk-in Customer",
    items: [
      { name: "Digital Thermometer", qty: 1, price: 320.00 }
    ],
    total: 320.00,
    paymentMethod: "UPI"
  }
];

const mockProducts = [
  { id: 1, name: "Paracetamol 500mg", price: 24.00, stock: 150 },
  { id: 2, name: "Vitamin C", price: 45.00, stock: 80 },
  { id: 3, name: "Digital Thermometer", price: 320.00, stock: 5 }
];

const Sales = () => {
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  const addItemToSale = (product: any) => {
    const existingItem = saleItems.find(item => item.id === product.id);
    if (existingItem) {
      setSaleItems(saleItems.map(item => 
        item.id === product.id 
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setSaleItems([...saleItems, { ...product, qty: 1 }]);
    }
  };

  const removeItemFromSale = (productId: number) => {
    setSaleItems(saleItems.filter(item => item.id !== productId));
  };

  const updateItemQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeItemFromSale(productId);
      return;
    }
    setSaleItems(saleItems.map(item => 
      item.id === productId ? { ...item, qty } : item
    ));
  };

  const getTotalAmount = () => {
    return saleItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const handleCompleteSale = () => {
    toast({
      title: "Sale Completed",
      description: `Sale of ₹${getTotalAmount().toFixed(2)} completed successfully!`,
    });
    setSaleItems([]);
    setCustomerName("");
    setIsNewSaleOpen(false);
  };

  const handlePrintReceipt = (saleId: number) => {
    toast({
      title: "Printing Receipt",
      description: "Receipt is being prepared for printing...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Record</h1>
          <p className="text-muted-foreground">Manage your sales transactions and receipts</p>
        </div>
        
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>New Sale Transaction</DialogTitle>
              <DialogDescription>
                Add products to create a new sale transaction
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Product Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold">Select Products</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mockProducts.map(product => (
                    <Card key={product.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{product.price} • Stock: {product.stock}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addItemToSale(product)}
                          disabled={product.stock === 0}
                        >
                          Add
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sale Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Sale Items</h3>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name (Optional)</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {saleItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromSale(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {saleItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No items added yet
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCompleteSale}
                    disabled={saleItems.length === 0}
                    className="flex-1"
                  >
                    Complete Sale
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s Sales</p>
                <p className="text-2xl font-bold">₹8,432</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">₹54</p>
              </div>
              <Receipt className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Latest sales transactions and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <p className="font-medium">{sale.receiptNo}</p>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {sale.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.name} x{item.qty}
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold">₹{sale.total.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sale.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePrintReceipt(sale.id)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;