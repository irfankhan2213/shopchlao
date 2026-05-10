"use client";
import { useState, useRef } from "react";
import { 
  Plus, Search, User, Phone, Mail, Camera, Loader2, Image as ImageIcon,
  CreditCard, BookOpen, Wallet, Clock
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, uploadCustomerImage } from "@/services/ApiServices/customers";
import { getCustomerLedger } from "@/services/ApiServices/ledger";
import { createPayment } from "@/services/ApiServices/payments";
import { Customer } from "@/types/app";
import { format } from "date-fns";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  
  // Payment State
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: ledger = [], isLoading: isLoadingLedger } = useQuery({
    queryKey: ["ledger", selectedCustomer?._id],
    queryFn: () => getCustomerLedger(selectedCustomer._id),
    enabled: !!selectedCustomer?._id && isViewDialogOpen,
  });

  const addMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer Added", description: "New customer has been added successfully!" });
      setIsAddDialogOpen(false);
      setNewCustomer({ name: "", phone: "", email: "", address: "" });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["ledger", selectedCustomer?._id] });
      toast({ title: "Payment Recorded", description: "Ledger updated successfully." });
      setIsPaymentDialogOpen(false);
      setPaymentAmount("");
      
      // Update selected customer locally to reflect new balance immediately
      if (selectedCustomer && typeof paymentAmount === 'number') {
        setSelectedCustomer({
          ...selectedCustomer,
          totalUdhaar: Math.max(0, (selectedCustomer.totalUdhaar || 0) - paymentAmount),
          totalPaid: (selectedCustomer.totalPaid || 0) + paymentAmount
        });
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => uploadCustomerImage(id, file),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Upload Success", description: "Image attached successfully!" });
      setUploadingFor(null);
      if (selectedCustomer?._id === updatedCustomer._id) {
        setSelectedCustomer(updatedCustomer);
      }
    },
  });

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    addMutation.mutate(newCustomer);
  };

  const handlePayment = () => {
    if (!paymentAmount || !selectedCustomer) return;
    paymentMutation.mutate({
      customerId: selectedCustomer._id,
      amount: Number(paymentAmount),
      paymentMethod
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, customerId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingFor(customerId);
      uploadMutation.mutate({ id: customerId, file: e.target.files[0] });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = (customerId: string) => {
    setUploadingFor(customerId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customers & Udhaar</h1>
          <p className="text-muted-foreground text-sm">Manage relationships and clear balances</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Add Customer</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Input placeholder="Full name" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+91 9876543210" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              <Button onClick={handleAddCustomer} className="w-full" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Adding..." : "Save Customer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="col-span-2 md:col-span-4 bg-background">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer: any) => (
                  <TableRow 
                    key={customer._id} 
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.phone || 'No phone'}</div>
                    </TableCell>
                    <TableCell>
                      {customer.totalUdhaar > 0 ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 text-xs">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 hover:bg-success/20 text-xs">
                          Clear
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-bold ${customer.totalUdhaar > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        ₹{customer.totalUdhaar || 0}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => uploadingFor && handleFileChange(e, uploadingFor)} />

      {/* View Customer Ledger Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selectedCustomer && (
            <div className="flex flex-col h-full">
              {/* Header Profile */}
              <div className="bg-primary/5 p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <DialogTitle className="text-2xl">{selectedCustomer.name}</DialogTitle>
                  <p className="text-muted-foreground text-sm flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {selectedCustomer.phone || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> Last active: {selectedCustomer.lastPurchaseDate ? format(new Date(selectedCustomer.lastPurchaseDate), 'PP') : 'Never'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto bg-success hover:bg-success/90 text-white">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Receive Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Receive Payment from {selectedCustomer.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex justify-between items-center">
                          <span className="text-sm font-medium">Pending Udhaar</span>
                          <span className="text-xl font-bold">₹{selectedCustomer.totalUdhaar || 0}</span>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount Received</Label>
                          <Input type="number" placeholder="₹0" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value ? Number(e.target.value) : "")} />
                        </div>
                        <Button className="w-full" onClick={handlePayment} disabled={paymentMutation.isPending || !paymentAmount}>
                          {paymentMutation.isPending ? "Processing..." : "Save Payment"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Ledger & Details Tabs */}
              <div className="p-6">
                <Tabs defaultValue="ledger" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                    <TabsTrigger value="ledger" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary pb-3 rounded-none bg-transparent shadow-none">
                      <BookOpen className="h-4 w-4 mr-2" /> Notebook / Ledger
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary pb-3 bg-transparent shadow-none">
                      <ImageIcon className="h-4 w-4 mr-2" /> Receipts
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ledger" className="mt-0">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-destructive uppercase">Pending Udhaar</p>
                        <p className="text-2xl font-bold text-destructive">₹{selectedCustomer.totalUdhaar || 0}</p>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-primary uppercase">Total Spent Lifetime</p>
                        <p className="text-2xl font-bold text-primary">₹{selectedCustomer.totalSpent || 0}</p>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-3">Chronological History</h3>
                    <div className="border rounded-lg overflow-hidden">
                      {isLoadingLedger ? (
                        <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>
                      ) : ledger.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground bg-accent/20">No history found for this customer.</div>
                      ) : (
                        <Table>
                          <TableHeader className="bg-accent/50">
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead className="text-right text-destructive">Sale/Given (-)</TableHead>
                              <TableHead className="text-right text-success">Paid/Received (+)</TableHead>
                              <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ledger.map((entry: any) => (
                              <TableRow key={entry._id}>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                  {format(new Date(entry.date), 'dd MMM yy')}
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                  <span className="font-medium text-sm">{entry.type === 'SALE' ? 'Purchased Items' : 'Payment Received'}</span>
                                  <p className="text-xs text-muted-foreground truncate">{entry.notes}</p>
                                </TableCell>
                                <TableCell className="text-right text-destructive font-medium">
                                  {entry.type === 'SALE' ? `₹${entry.amount}` : '-'}
                                </TableCell>
                                <TableCell className="text-right text-success font-medium">
                                  {entry.type === 'PAYMENT' ? `₹${entry.amount}` : '-'}
                                </TableCell>
                                <TableCell className="text-right font-bold bg-accent/20">
                                  ₹{entry.balanceAfter}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="attachments" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Captured Receipts & Images</h3>
                      <Button size="sm" onClick={() => triggerFileUpload(selectedCustomer._id)} disabled={uploadingFor === selectedCustomer._id}>
                        {uploadingFor === selectedCustomer._id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                        Upload Image
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedCustomer.attachments?.map((att: any, idx: number) => (
                        <Card key={idx} className="overflow-hidden group">
                          <div className="aspect-square bg-accent/20">
                            <img 
                              src={att.url.startsWith('http') ? att.url : `${process.env.NEXT_PUBLIC_APP_API_BASE_URL || 'http://localhost:5000'}${att.url}`} 
                              className="w-full h-full object-cover" 
                              alt="Receipt"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Not+Found' }}
                            />
                          </div>
                          <div className="p-2 bg-background border-t text-xs text-muted-foreground">
                            {format(new Date(att.date), 'dd MMM yyyy')}
                          </div>
                        </Card>
                      ))}
                      {(!selectedCustomer.attachments || selectedCustomer.attachments.length === 0) && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-accent/10">
                          <Camera className="h-8 w-8 mx-auto mb-2 opacity-20" />
                          <p>No images saved.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
