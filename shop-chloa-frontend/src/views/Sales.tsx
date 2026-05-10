"use client";
import { useState, useMemo } from "react";
import { 
  ShoppingCart, 
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/services/ApiServices/products";
import { getCustomers } from "@/services/ApiServices/customers";
import { createSale } from "@/services/ApiServices/sales";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/app";

export default function Sales() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<number | "">("");

  // Mutations
  const saleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      toast({
        title: "Sale Successful",
        description: "Transaction saved and ledger updated.",
      });
      // Reset flow
      setCart([]);
      setSelectedCustomerId("");
      setPaidAmount("");
      // Refresh relevant data
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["stock-inventory"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process sale.",
      });
    }
  });

  // Derived state
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return (products as any[]).filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.qty), 0);
  const currentPaid = paidAmount === "" ? 0 : paidAmount;
  const udhaarAmount = Math.max(0, cartTotal - currentPaid);

  // Cart Handlers
  const addToCart = (product: any) => {
    // Determine selling price (from first lot or default)
    const sellPrice = product.lots && product.lots.length > 0 ? product.lots[0].sellPrice : 0;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        return prev.map(item => 
          item.productId === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { 
        productId: product._id, 
        name: product.name, 
        sellPrice: sellPrice, 
        qty: 1 
      }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ title: "Cart empty", variant: "destructive" });
      return;
    }

    const payload = {
      customerId: selectedCustomerId || undefined,
      customerName: selectedCustomerId 
        ? (customers as any[]).find(c => c._id === selectedCustomerId)?.name 
        : "Walk-in Customer",
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.sellPrice
      })),
      total: cartTotal,
      paidAmount: currentPaid,
      udhaarAmount: udhaarAmount,
      paymentMethod: currentPaid > 0 ? "Cash" : "Credit",
    };

    saleMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-fade-in">
      
      {/* LEFT PANEL: Products Selection */}
      <div className="flex-1 flex flex-col bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products to add..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
          {isLoadingProducts ? (
            <div className="text-center text-muted-foreground py-10">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {(filteredProducts as any[]).map(product => {
                const sellPrice = product.lots?.[0]?.sellPrice || 0;
                const totalStock = product.lots?.reduce((sum: number, lot: any) => sum + lot.quantity, 0) || 0;
                
                return (
                  <Card 
                    key={product._id} 
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden"
                    onClick={() => addToCart(product)}
                  >
                    <div className="aspect-square bg-accent/20 flex items-center justify-center border-b">
                      <Package className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-foreground">₹{sellPrice}</span>
                        <Badge variant={totalStock > 0 ? "secondary" : "destructive"} className="text-[10px]">
                          {totalStock} in stock
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Cart & Checkout */}
      <div className="w-full lg:w-[400px] flex flex-col bg-background rounded-xl border border-border shadow-sm overflow-hidden shrink-0">
        <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg text-primary">Current Cart</h2>
          <Badge className="ml-auto">{cart.length} items</Badge>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
              <ShoppingCart className="h-12 w-12" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex flex-col gap-2 p-3 bg-accent/30 border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{item.name}</span>
                  <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="font-bold text-sm">₹{item.sellPrice}</div>
                  <div className="flex items-center gap-2 bg-background border rounded-md">
                    <button onClick={() => updateQty(item.productId, -1)} className="p-1 hover:bg-accent rounded-l-md">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, 1)} className="p-1 hover:bg-accent rounded-r-md">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Controls */}
        <div className="p-4 border-t border-border bg-accent/10 space-y-4">
          
          {/* Customer Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Select Customer (for Udhaar)
            </Label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Walk-in Customer (No Udhaar)</option>
              {(customers as any[]).map(c => (
                <option key={c._id} value={c._id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-end border-b pb-2">
            <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
            <span className="text-xl font-bold">₹{cartTotal}</span>
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs font-semibold text-success flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> Amount Paid Today
              </Label>
              <Input 
                type="number" 
                placeholder="₹0"
                className="h-10 text-lg font-bold border-success/30 focus-visible:ring-success"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs font-semibold text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Added to Udhaar
              </Label>
              <div className="h-10 bg-destructive/10 text-destructive border border-destructive/20 rounded-md flex items-center px-3 text-lg font-bold">
                ₹{udhaarAmount}
              </div>
            </div>
          </div>

          {udhaarAmount > 0 && !selectedCustomerId && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Must select a customer to save Udhaar!
            </p>
          )}

          <Button 
            className="w-full h-14 text-lg shadow-glow hover:opacity-90"
            disabled={cart.length === 0 || (udhaarAmount > 0 && !selectedCustomerId) || saleMutation.isPending}
            onClick={handleCheckout}
          >
            {saleMutation.isPending ? "Processing..." : "Complete Sale"}
          </Button>

        </div>
      </div>
    </div>
  );
}