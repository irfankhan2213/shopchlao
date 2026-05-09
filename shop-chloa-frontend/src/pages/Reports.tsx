"use client";
import { 
  Download, 
  FileText, 
  Calendar, 
  BarChart3,
  PieChart,
  TrendingUp,
  Package,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report is being prepared for download...`,
    });
  };

  const reportTypes = [
    {
      title: "Inventory Report",
      description: "Complete list of all products with stock levels",
      icon: Package,
      format: ["PDF", "CSV", "Excel"],
      color: "text-primary"
    },
    {
      title: "Sales Summary",
      description: "Daily, weekly, and monthly sales performance",
      icon: DollarSign,
      format: ["PDF", "CSV"],
      color: "text-success"
    },
    {
      title: "Expiry Report",
      description: "Products expiring in the next 30 days",
      icon: Calendar,
      format: ["PDF", "CSV"],
      color: "text-warning"
    },
    {
      title: "Low Stock Report",
      description: "Items below minimum stock levels",
      icon: TrendingUp,
      format: ["PDF", "CSV"],
      color: "text-destructive"
    }
  ];

  const quickStats = [
    {
      label: "Total Products",
      value: "1,248",
      change: "+12%",
      period: "this month"
    },
    {
      label: "Sales Revenue",
      value: "₹2,45,600",
      change: "+18%",
      period: "this month"
    },
    {
      label: "Low Stock Items",
      value: "23",
      change: "+5",
      period: "alerts"
    },
    {
      label: "Expiring Soon",
      value: "8",
      change: "-2",
      period: "next 7 days"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download detailed business reports</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <BarChart3 className="h-4 w-4 mr-2" />
          Dashboard Analytics
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-success">{stat.change}</span>
                  <span className="text-muted-foreground">{stat.period}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {report.format.map((format) => (
                        <Badge key={format} variant="outline">
                          {format}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {report.format.map((format) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(`${report.title} (${format})`)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Report Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>
                Create customized reports with specific date ranges and filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-accent/20">
                  <div className="text-center space-y-2">
                    <Calendar className="h-8 w-8 mx-auto text-primary" />
                    <h4 className="font-medium">Date Range Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate reports for specific time periods
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 bg-accent/20">
                  <div className="text-center space-y-2">
                    <PieChart className="h-8 w-8 mx-auto text-secondary" />
                    <h4 className="font-medium">Category Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyze performance by product categories
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 bg-accent/20">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-8 w-8 mx-auto text-success" />
                    <h4 className="font-medium">Performance Metrics</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed KPIs and business metrics
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automate your reporting with scheduled generation (requires backend integration)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">Scheduled Reports Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Set up automatic report generation and delivery via email when backend integration is available.
                </p>
                <Button variant="outline" disabled>
                  Setup Scheduling
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;