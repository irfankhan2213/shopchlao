"use client";
import { useState, useRef } from "react";
import { 
  Plus, Search, User, Phone, Mail, Calendar, ShoppingBag, Eye, Camera, Loader2, Image as ImageIcon
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
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, uploadCustomerImage } from "@/services/ApiServices/customers";
import { Customer } from "@/types/app";
import { format } from "date-fns";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const addMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer Added", description: "New customer has been added successfully!" });
      setIsAddDialogOpen(false);
      setNewCustomer({ name: "", phone: "", email: "", address: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add customer", variant: "destructive" });
    }
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => uploadCustomerImage(id, file),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Upload Success", description: "Image attached to customer successfully!" });
      setUploadingFor(null);
      if (selectedCustomer?._id === updatedCustomer._id) {
        setSelectedCustomer(updatedCustomer);
      }
    },
    onError: () => {
      toast({ title: "Upload Failed", description: "Failed to upload image", variant: "destructive" });
      setUploadingFor(null);
    }
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      toast({ title: "Validation Error", description: "Name is required", variant: "destructive" });
      return;
    }
    addMutation.mutate(newCustomer);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, customerId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadingFor(customerId);
      uploadMutation.mutate({ id: customerId, file });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = (customerId: string) => {
    setUploadingFor(customerId); // Temp set to allow input trigger to know who is being uploaded
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Book</h1>
          <p className="text-muted-foreground">Manage your customer relationships and udhar records</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile to track their purchases and details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input id="customerName" placeholder="Enter full name" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input id="customerPhone" placeholder="+91 9876543210" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email (Optional)</Label>
                <Input id="customerEmail" type="email" placeholder="customer@example.com" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer} disabled={addMutation.isPending}>
                  {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Attachments</p>
                <p className="text-2xl font-bold">
                  {customers.filter((c: Customer) => c.attachments && c.attachments.length > 0).length}
                </p>
              </div>
              <ImageIcon className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Records/Images</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.phone ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" /> {customer.phone}</span>
                          {customer.email && <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No contact</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        {customer.attachments?.length || 0} Attachments
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => triggerFileUpload(customer._id)}
                          disabled={uploadingFor === customer._id}
                        >
                          {uploadingFor === customer._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 mr-1" />}
                          <span className="hidden sm:inline">Attach</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input for capturing/uploading images */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment" 
        onChange={(e) => uploadingFor && handleFileChange(e, uploadingFor)} 
      />

      {/* View Customer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedCustomer.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" /> 
                  Attachments & Udhar Receipts ({selectedCustomer.attachments?.length || 0})
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => triggerFileUpload(selectedCustomer._id)}
                  disabled={uploadingFor === selectedCustomer._id}
                >
                  {uploadingFor === selectedCustomer._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                  Add New Receipt
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCustomer.attachments?.map((attachment, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square relative bg-accent/20 flex items-center justify-center">
                      <img 
                        src={attachment.url.startsWith('http') ? attachment.url : `${process.env.NEXT_PUBLIC_APP_API_BASE_URL || 'http://localhost:5000'}${attachment.url}`} 
                        alt="Receipt" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        {format(new Date(attachment.date), 'PPpp')}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {attachment.description || 'Receipt'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {(!selectedCustomer.attachments || selectedCustomer.attachments.length === 0) && (
                  <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Camera className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No attachments found</p>
                    <p className="text-sm">Click &quot;Add New Receipt&quot; to capture an image</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
