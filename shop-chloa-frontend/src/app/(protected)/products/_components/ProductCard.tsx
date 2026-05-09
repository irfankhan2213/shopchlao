import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import {
  getExpiryStatus,
  getStockLevel,
  formatCurrency,
  formatDate,
} from "@/lib/productUtils";
import { AlertTriangle, Package, Calendar, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Popup from "@/components/custom/Popup";
import AddLot from "./AddLot";
import { useState } from "react";

interface ProductCardRowProps {
  product: Product;
}

export const ProductCardRow = ({ product }: ProductCardRowProps) => {
  //   const currentLot = product.lots[0]; // Assuming the first lot is the current lot
  //   if (!currentLot) return null;
  const [addLotOpen, setAddLotOpen] = useState(false);
  const expiryStatus = getExpiryStatus(product.expiry);
  const stockLevel = getStockLevel(product.stock);

  const getExpiryBadgeColor = () => {
    switch (expiryStatus) {
      case "expired":
        return "bg-danger text-danger-foreground";
      case "near-expiry":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-success text-success-foreground";
    }
  };

  const getStockBadgeColor = () => {
    switch (stockLevel) {
      case "low":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getExpiryMessage = () => {
    if (expiryStatus === "expired") {
      return "EXPIRED";
    }
    const today = new Date();
    const expiry = new Date(product.expiry);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `Expires in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (diffDays <= 30) {
      return `Expires in ${diffDays} days`;
    }
    return "Good until expiry";
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover bg-card border border-border">
      <Popup
        isOpen={addLotOpen}
        onOpenChange={setAddLotOpen}
        title="Add New Lot"
      >
        <AddLot productId={product.id} />
      </Popup>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4">
        {/* Image Section */}
        <div className="relative w-full md:w-48 min-h-24 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {expiryStatus !== "normal" && product.expiry && (
            <div className="absolute top-2 right-2">
              <Badge
                className={`${getExpiryBadgeColor()} flex items-center gap-1 text-xs`}
              >
                <AlertTriangle className="w-3 h-3" />
                {expiryStatus === "expired" ? "EXPIRED" : "NEAR EXPIRY"}
              </Badge>
            </div>
          )}
          {product.priceChange && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-info text-info-foreground flex items-center gap-1 text-xs">
                <TrendingDown className="w-3 h-3" />
                NEW LOT
              </Badge>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full space-y-3">
          <div className="flex flex-col space-y-3 md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-card-foreground leading-tight">
                  {product.name}
                </h3>
                <Badge variant="secondary" className="ml-2 text-white">
                  {product.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
            <div className="flex gap-2 md:gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium text-card-foreground">
                  {product?.expiry ? formatDate(product.expiry) : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stock:</span>
                <Badge className={`${getStockBadgeColor()} text-xs`}>
                  {product.stock || 0} units
                </Badge>
                {product?.lots?.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    ({product.lots.length} lots)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-4">
              <p className="text-muted-foreground">MRP</p>
              <p className="font-medium text-card-foreground">
                {formatCurrency(product.prices?.[0]?.mrp)}
              </p>
            </div>
            <div className="flex gap-4">
              <p className="text-muted-foreground">Sale Price</p>
              <div className="flex flex-col gap-1">
                {product.prices?.[0] ? (
                  <>
                    <span className="font-medium ">
                      {formatCurrency(product.prices[0]?.sellPrice)}
                    </span>
                    {product?.prices?.[1] && (
                      <span className="text-xs text-muted-foreground">
                        Previous: {formatCurrency(product.prices[1].sellPrice)}
                      </span>
                    )}
                  </>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-muted-foreground">Purchase Price</p>
              <p className="font-medium text-card-foreground">
                {product.prices[0]?.purchasePrice
                  ? formatCurrency(product.prices[0].purchasePrice)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {product.priceChange && (
              <Badge className="bg-info text-info-foreground text-xs">
                {product.priceChange.discountPercentage > 0 ? "-" : "+"}
                {Math.abs(product.priceChange.discountPercentage)}% from
                previous
              </Badge>
            )}
          </div>

          {expiryStatus !== "normal" && product?.expiry && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {getExpiryMessage()}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-row gap-4">
            <Button
              variant={"outline"}
              className="w-full  max-w-[150px]"
              // onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              className="w-full max-w-[150px]"
              onClick={() => setAddLotOpen(true)}
            >
              Add New Stock Lot
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
