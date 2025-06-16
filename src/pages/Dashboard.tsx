import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Sun, CloudRain, Calendar as CalendarIcon, AlertTriangle, Star } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 0, 27)
  });

  // Mock data for hourly sales
  const hourlySalesData = [
    { time: '9 AM', sales: 120, forecast: 130 },
    { time: '10 AM', sales: 180, forecast: 190 },
    { time: '11 AM', sales: 250, forecast: 260 },
    { time: '12 PM', sales: 320, forecast: 340 },
    { time: '1 PM', sales: 290, forecast: 310 },
    { time: '2 PM', sales: 200, forecast: 210 },
    { time: '3 PM', sales: 150, forecast: 160 },
    { time: '4 PM', sales: 220, forecast: 240 },
    { time: '5 PM', sales: 380, forecast: 420 },
    { time: '6 PM', sales: 450, forecast: 480 },
    { time: '7 PM', sales: 320, forecast: 350 },
    { time: '8 PM', sales: 180, forecast: 190 },
    { time: '9 PM', sales: 100, forecast: 110 },
  ];

  // Mock data for best sellers forecast
  const bestSellersForecastData = [
    { name: "Milk", expected: 45, color: "#3b82f6" },
    { name: "Bread", expected: 38, color: "#8b5cf6" },
    { name: "Eggs", expected: 32, color: "#10b981" },
    { name: "Chips", expected: 28, color: "#f59e0b" },
    { name: "Bananas", expected: 25, color: "#ef4444" },
    { name: "Rice", expected: 22, color: "#06b6d4" },
  ];

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

  const monthlyData = [
    { period: 'Week 1', revenue: 22500, customers: 1400 },
    { period: 'Week 2', revenue: 26800, customers: 1650 },
    { period: 'Week 3', revenue: 24200, customers: 1520 },
    { period: 'Week 4', revenue: 28900, customers: 1780 },
  ];

  const stockAlerts = [
    { name: "Milk", stock: 8, status: "critical" },
    { name: "Bread", stock: 15, status: "low" },
    { name: "Eggs", stock: 12, status: "low" },
    { name: "Bananas", stock: 45, status: "safe" },
  ];

  const todayBestSellers = [
    { name: "Milk", quantity: 45, trend: "up" },
    { name: "Bread", quantity: 38, trend: "up" },
    { name: "Eggs", quantity: 32, trend: "stable" },
    { name: "Chips", quantity: 28, trend: "up" },
    { name: "Bananas", quantity: 25, trend: "down" },
  ];

  const pastBestSellers = [
    { name: "Rice", quantity: 156, trend: "up" },
    { name: "Milk", quantity: 142, trend: "up" },
    { name: "Bread", quantity: 128, trend: "stable" },
    { name: "Eggs", quantity: 118, trend: "up" },
    { name: "Biscuits", quantity: 95, trend: "down" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your inventory today.</p>
        </div>

        {/* Today's Forecasts Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Forecasts</h2>
          </div>

          {/* Holiday/Weekend Effect Banner */}
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Weekend Effect Active</h3>
                  <p className="text-sm text-orange-700">Expected 25% increase in foot traffic due to weekend shopping patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Row: Hourly Sales Graph and Best Sellers Forecast */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Hourly Sales Forecast</span>
                </CardTitle>
                <CardDescription>Predicted vs actual sales throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Forecast"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span>Top Products Forecast</span>
                </CardTitle>
                <CardDescription>Expected best sellers for today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bestSellersForecastData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="expected"
                      label={({ name, expected }) => `${name}: ${expected}`}
                    >
                      {bestSellersForecastData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Stock Alerts, Weather, Traffic, and Weekend Effect */}
          <div className="grid lg:grid-cols-4 gap-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Stock Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stockAlerts.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span>{item.name}</span>
                      <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'secondary' : 'default'}>
                        {item.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span>Weather Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold">72°F</p>
                  <p className="text-xs text-gray-600">Sunny</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+15% traffic</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Expected Traffic</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 mb-1">284</p>
                  <p className="text-xs text-gray-600">customers expected</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+12% vs yesterday</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Revenue Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-1">$3,450</p>
                  <p className="text-xs text-gray-600">expected today</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+18% vs avg</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Past Performance Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Past Performance</h2>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                      : "Select date range"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
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

            {/* Other tab contents remain similar but condensed for space */}
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
      </div>
    </div>
  );
};

export default Dashboard;
