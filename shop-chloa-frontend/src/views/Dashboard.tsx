"use client";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  PlusCircle,
  CreditCard
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
import { getDashboardStats } from "@/services/ApiServices/reports";
import { getCustomers } from "@/services/ApiServices/customers";
import { getStockSummary } from "@/services/ApiServices/stock";
import Link from "next/link";
import { Customer } from "@/types/app";

const Dashboard = () => {
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: summary } = useQuery({
    queryKey: ["stock-summary"],
    queryFn: getStockSummary,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const pendingUdhaarCustomers = customers
    .filter((c: any) => c.totalUdhaar > 0)
    .sort((a: any, b: any) => b.totalUdhaar - a.totalUdhaar)
    .slice(0, 5);

  const statsCards = [
    {
      title: "Pending Udhaar",
      value: `₹${dashboardStats?.totalPendingUdhaar || 0}`,
      subtitle: "Total outstanding",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Today's Sales",
      value: `₹${dashboardStats?.todaysSales || 0}`,
      subtitle: `₹${dashboardStats?.todaysPaid || 0} received today`,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Active Udhaar Accounts",
      value: String(dashboardStats?.activeCustomers || 0),
      subtitle: "Customers with balance",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Low Stock Items",
      value: String(summary?.low ?? 0),
      subtitle: "Need reordering",
      icon: Package,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Udhaar & Sales
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Overview of your daily shop workflow
          </p>
        </div>
      </div>

      {/* Main Quick Actions (Super Prominent) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Link href="/sales" className="col-span-2 md:col-span-1">
          <Button
            className="w-full h-16 md:h-24 flex flex-col gap-1 md:gap-2 text-sm md:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow touch-manipulation"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="font-semibold">New Sale</span>
          </Button>
        </Link>
        <Link href="/customers" className="col-span-2 md:col-span-1">
          <Button
            variant="outline"
            className="w-full h-16 md:h-24 flex flex-col gap-1 md:gap-2 text-sm md:text-base border-success text-success hover:bg-success/10 touch-manipulation"
          >
            <CreditCard className="h-6 w-6" />
            <span className="font-semibold">Receive Payment</span>
          </Button>
        </Link>
        <Link href="/customers" className="col-span-1">
          <Button
            variant="outline"
            className="w-full h-16 md:h-24 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
          >
            <PlusCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span>Add Customer</span>
          </Button>
        </Link>
        <Link href="/products" className="col-span-1">
          <Button
            variant="outline"
            className="w-full h-16 md:h-24 flex flex-col gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
          >
            <Package className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-slide-up shadow-elegant hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground line-clamp-1">
                  {stat.title}
                </h3>
                <div className="text-xl md:text-2xl font-bold text-foreground">
                  {isLoadingStats && index < 3 ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {stat.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Pending Udhaar Customers */}
        <Card className="animate-slide-up shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-destructive" />
                Pending Udhaar
              </CardTitle>
              <CardDescription>Customers with highest unpaid balance</CardDescription>
            </div>
            <Link href="/customers">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingCustomers && (
                <div className="text-sm text-muted-foreground">
                  Loading customers...
                </div>
              )}
              {!isLoadingCustomers && (
                <>
                  {pendingUdhaarCustomers.length > 0 ? (
                    pendingUdhaarCustomers.map((customer: any, index: number) => (
                      <div
                        key={customer._id}
                        className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.phone || "No phone"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-destructive text-sm">
                            ₹{customer.totalUdhaar}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pending
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground min-h-[150px] text-center items-center flex justify-center bg-accent/30 rounded-lg border border-dashed border-border">
                      No pending udhaar! All clear.
                    </div>
                  )}
                </>
              )}
            </div>
            <Link href="/customers">
              <Button variant="outline" className="w-full mt-4 sm:hidden">
                View All Customers
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Help / Next Steps */}
        <Card className="animate-slide-up shadow-elegant bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Eye className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>How to use your new Udhaar system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="mt-0.5 bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">1</div>
              <p>Click <strong>New Sale</strong> to select products and choose a customer. You can split the bill into Paid and Udhaar instantly.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5 bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">2</div>
              <p>When a customer pays their Udhaar, click <strong>Receive Payment</strong> to log the transaction and update their balance.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5 bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center font-bold shrink-0">3</div>
              <p>Check the <strong>Customers</strong> tab to see chronological ledger books for every person.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
