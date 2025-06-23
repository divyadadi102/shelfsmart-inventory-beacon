import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const PastPerformanceSection = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  // Mock data for past performance
  const weeklyData = [
    { day: 'Mon', revenue: 2800, customers: 180 },
    { day: 'Tue', revenue: 3200, customers: 220 },
    { day: 'Wed', revenue: 2900, customers: 195 },
    { day: 'Thu', revenue: 3500, customers: 240 },
    { day: 'Fri', revenue: 4200, customers: 280 },
    { day: 'Sat', revenue: 5100, customers: 320 },
    { day: 'Sun', revenue: 3800, customers: 250 },
  ];

  const pastBestSellers = [
    { name: "Rice", quantity: 156, trend: "up" },
    { name: "Milk", quantity: 142, trend: "up" },
    { name: "Bread", quantity: 128, trend: "stable" },
    { name: "Eggs", quantity: 118, trend: "up" },
    { name: "Biscuits", quantity: 95, trend: "down" },
  ];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">Past Performance</h2>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime() ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Range Tabs */}
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="week">Past Week</TabsTrigger>
          <TabsTrigger value="month">Past Month</TabsTrigger>
          <TabsTrigger value="year">Past Year</TabsTrigger>
          <TabsTrigger value="custom">Custom Range</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="space-y-6">
          {/* Revenue and Customer Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Week Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">$32,849</p>
                <p className="text-sm text-gray-600">+8.2% vs last week</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">1,685</p>
                <p className="text-sm text-gray-600">+5.1% vs last week</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg. Order</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">$19.48</p>
                <p className="text-sm text-gray-600">+2.8% vs last week</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">2,847</p>
                <p className="text-sm text-gray-600">+12.1% vs last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Graph and Best Sellers */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
                <CardDescription>Revenue and customer count this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar yAxisId="right" dataKey="customers" fill="#8b5cf6" opacity={0.7} name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Top Sellers This Week</span>
                </CardTitle>
                <CardDescription>Most sold products in selected range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastBestSellers.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{product.quantity} units</span>
                        <Badge variant={product.trend === 'up' ? 'default' : product.trend === 'down' ? 'destructive' : 'secondary'}>
                          {product.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="month">
          <div className="text-center py-8">
            <p className="text-gray-600">Monthly performance data would be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="year">
          <div className="text-center py-8">
            <p className="text-gray-600">Yearly performance data would be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="text-center py-8">
            <p className="text-gray-600">Custom date range performance data would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PastPerformanceSection;
