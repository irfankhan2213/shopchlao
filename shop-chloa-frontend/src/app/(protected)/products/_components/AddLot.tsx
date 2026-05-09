
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addStockLot } from "@/services/ApiServices/products";
import { useState } from "react";

const lotSchema = z.object({
  batchNumber: z.string().min(1, "Batch/Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  purchasePrice: z.coerce.number().min(0, "Purchase price is required"),
  mrp: z.coerce.number().min(0, "MRP is required"),
  sellPrice: z.coerce.number().min(0, "Sell price is required"),
  expiryDate: z.string().optional(),
});

interface AddLotProps {
  productId: number | string;
  onLotAdded?: () => void;
  setOpen?: (open: boolean) => void;
}

const AddLot: React.FC<AddLotProps> = ({ productId, onLotAdded, setOpen }) => {
  const form = useForm<z.infer<typeof lotSchema>>({
    resolver: zodResolver(lotSchema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: z.infer<typeof lotSchema>) => {
    setLoading(true);
    setError("");
    try {
      await addStockLot(productId, data);
      if (onLotAdded) onLotAdded();
      if (setOpen) setOpen(false);
      form.reset();
    } catch (err: any) {
      setError(err?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="pb-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="batchNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="batchNumber">Batch/Lot Number</Label>
                <Input id="batchNumber" placeholder="Enter lot number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input id="purchasePrice" type="number" placeholder="Enter purchase price" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="mrp">MRP</Label>
                <Input id="mrp" type="number" placeholder="Enter MRP" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="sellPrice">Sell Price</Label>
                <Input id="sellPrice" type="number" placeholder="Enter sell price" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="mt-4 flex ">
          <Button type="submit" className="bg-primary hover:bg-primary/90 w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Lot"}
          </Button>
          {setOpen && (
            <Button type="button" variant="outline" className="ml-2" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddLot;
