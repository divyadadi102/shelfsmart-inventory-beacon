
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Sun, CloudRain } from "lucide-react";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  // Mock data for hourly sales
  const hourlySalesData = [
    { time: '9 AM', sales: 120 },
    { time: '10 AM', sales: 180 },
    { time: '11 AM', sales: 250 },
    { time: '12 PM', sales: 320 },
    { time: '1 PM', sales: 290 },
    { time: '2 PM', sales: 200 },
    { time: '3 PM', sales: 150 },
    { time: '4 PM', sales: 220 },
    { time: '5 PM', sales: 380 },
    { time: '6 PM', sales: 450 },
    { time: '7 PM', sales: 320 },
    { time: '8 PM', sales: 180 },
    { time: '9 PM', sales: 100 },
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section A: Today's Forecasts */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Forecasts</h2>
            </div>

            {/* Hourly Sales Graph */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Hourly Sales Forecast</span>
                </CardTitle>
                <CardDescription>Predicted sales throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="url(#colorGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Today's Best Sellers */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <span>Today's Best Sellers</span>
                </CardTitle>
                <CardDescription>Top 5 predicted products for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayBestSellers.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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

            {/* Weather Widget */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <span>Weather Impact</span>
                </CardTitle>
                <CardDescription>Today's weather affecting foot traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sun className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">72°F</p>
                      <p className="text-sm text-gray-600">Sunny</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Expected Traffic</p>
                    <p className="text-xl font-bold text-green-600">+15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expected Traffic */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Expected Traffic</span>
                </CardTitle>
                <CardDescription>Predicted customer visits today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600 mb-2">284</p>
                  <p className="text-gray-600">customers expected</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">+12% vs yesterday</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section B: Past Performance Overview */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Past Performance</h2>
            </div>

            {/* Time Range Toggle */}
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Past Week</TabsTrigger>
                <TabsTrigger value="month">Past Month</TabsTrigger>
                <TabsTrigger value="year">Past Year</TabsTrigger>
              </TabsList>
              
              <TabsContent value="week" className="space-y-6">
                {/* Revenue Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Week Revenue</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">$32,849</p>
                      <p className="text-sm text-gray-600">+8.2% vs last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Customers</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">1,685</p>
                      <p className="text-sm text-gray-600">+5.1% vs last week</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Comparison Graph */}
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
                        <Bar yAxisId="left" dataKey="revenue" fill="url(#colorGradient)" />
                        <Bar yAxisId="right" dataKey="customers" fill="#8b5cf6" opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="month" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Month Revenue</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">$102,400</p>
                      <p className="text-sm text-gray-600">+12.5% vs last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Customers</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">6,350</p>
                      <p className="text-sm text-gray-600">+7.8% vs last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Revenue and customer count by week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="revenue" fill="url(#colorGradient)" />
                        <Bar yAxisId="right" dataKey="customers" fill="#8b5cf6" opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="year" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Year Revenue</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">$1.2M</p>
                      <p className="text-sm text-gray-600">+18.3% vs last year</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Customers</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">78,200</p>
                      <p className="text-sm text-gray-600">+15.2% vs last year</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Past Best Sellers */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Past Best Sellers</span>
                </CardTitle>
                <CardDescription>Most sold products this week</CardDescription>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
