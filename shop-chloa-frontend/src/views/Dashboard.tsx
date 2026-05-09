"use client";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  getExpiringLots,
  getStockInventory,
  getStockSummary,
} from "@/services/ApiServices/stock";

const Dashboard = () => {
  const { data: summary } = useQuery({
    queryKey: ["stock-summary"],
    queryFn: getStockSummary,
  });
  const { data: expiringItems = [], isLoading: isLoadingExpiring } = useQuery({
    queryKey: ["expiring-lots", 7],
    queryFn: () => getExpiringLots(7),
  });
  const { data: stockItems = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["stock-inventory"],
    queryFn: getStockInventory,
  });
  const statsCards = [
    {
      title: "Total Products",
      value: String(summary?.total ?? 0),
      change: "",
      trend: "up",
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Low Stock Items",
      value: String(summary?.low ?? 0),
      change: "",
      trend: "up",
      icon: AlertTriangle,
      color: "text-warning",
    },
    {
      title: "Good Stock",
      value: String(summary?.good ?? 0),
      change: "",
      trend: "up",
      icon: DollarSign,
      color: "text-success",
    },
    {
      title: "Out of Stock",
      value: String(summary?.out ?? 0),
      change: "",
      trend: "down",
      icon: ShoppingCart,
      color: "text-secondary",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here&apos;s your store overview.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <Eye className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-slide-up shadow-elegant hover:shadow-glow transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Expiring Items */}
        <Card className="animate-slide-up shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Items expiring in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingExpiring && (
                <div className="text-sm text-muted-foreground">
                  Loading expiring items...
                </div>
              )}
              {!isLoadingExpiring && (
                <>
                  {expiringItems.length > 0 ? (
                    (expiringItems as any[]).map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.stock} units
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              (item.daysLeft ?? 0) <= 3
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {item.daysLeft} days left
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {String(item.expiryDate).slice(0, 10)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground min-h-[150px] text-center items-center flex justify-center">
                      No expiring items
                    </div>
                  )}
                </>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 ">
              View All Expiring Items
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className="animate-slide-up shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingInventory && (
                <div className="text-sm text-muted-foreground">
                  Loading low stock...
                </div>
              )}
              {!isLoadingInventory && (
                <>
                  {stockItems.length > 0 ? (
                    (stockItems as any[])
                      .filter(
                        (i: any) => i.status === "low" || i.status === "out"
                      )
                      .slice(0, 5)
                      .map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {item.currentStock}/{item.minStock}
                            </Badge>
                            <p className="text-xs text-warning mt-1">
                              Reorder needed
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-sm text-muted-foreground min-h-[150px] text-center items-center flex justify-center">
                      No low stock items
                    </div>
                  )}
                </>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Low Stock
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up shadow-elegant">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for faster workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Button
              variant="outline"
              className="h-16 md:h-20 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
            >
              <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span>Add Product</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              <span>New Sale</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
            >
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-warning" />
              <span>Stock Update</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
            >
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-success" />
              <span>Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
