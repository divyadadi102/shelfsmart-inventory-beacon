import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  ShoppingCart,
  AlertCircle,
  Calendar,
  Target
} from "lucide-react";

interface DailySummary {
  totalItemsSold: number;
  totalRevenue: number;
  totalProfit: number;
  categorySales: { category: string; count: number; revenue: number }[];
}

interface OrderRecommendation {
  productName: string;
  currentStock: number;
  recommendedOrder: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

const Summary = () => {
  const [dailySummary, setDailySummary] = useState<DailySummary>({
    totalItemsSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    categorySales: []
  });

  const [orderRecommendations, setOrderRecommendations] = useState<OrderRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodaySummary();
    fetchOrderRecommendations();
  }, []);

  const fetchTodaySummary = async () => {
    try {
      // Mock data for today's summary - replace with actual API call
      const mockSummary: DailySummary = {
        totalItemsSold: 147,
        totalRevenue: 3420.50,
        totalProfit: 1254.80,
        categorySales: [
          { category: "Electronics", count: 45, revenue: 1250.00 },
          { category: "Clothing", count: 32, revenue: 890.30 },
          { category: "Food & Beverages", count: 28, revenue: 560.40 },
          { category: "Books", count: 24, revenue: 380.20 },
          { category: "Home & Garden", count: 18, revenue: 339.60 }
        ]
      };
      setDailySummary(mockSummary);
    } catch (error) {
      console.error("Failed to fetch daily summary:", error);
    }
  };

  const fetchOrderRecommendations = async () => {
    try {
      // Mock data for order recommendations - replace with actual API call
      const mockRecommendations: OrderRecommendation[] = [
        { productName: "iPhone Cases", currentStock: 12, recommendedOrder: 50, category: "Electronics", priority: 'high' },
        { productName: "Coffee Beans", currentStock: 8, recommendedOrder: 100, category: "Food & Beverages", priority: 'high' },
        { productName: "Winter Jackets", currentStock: 15, recommendedOrder: 30, category: "Clothing", priority: 'medium' },
        { productName: "Notebooks", currentStock: 25, recommendedOrder: 75, category: "Books", priority: 'medium' },
        { productName: "Garden Tools", currentStock: 6, recommendedOrder: 20, category: "Home & Garden", priority: 'high' },
        { productName: "Wireless Headphones", currentStock: 18, recommendedOrder: 40, category: "Electronics", priority: 'low' }
      ];
      setOrderRecommendations(mockRecommendations);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch order recommendations:", error);
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Summary</h1>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{today}</span>
          </div>
        </div>

        {/* Today's Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Items Sold Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dailySummary.totalItemsSold}</div>
              <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Today</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${dailySummary.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profit Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${dailySummary.totalProfit.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+15% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dailySummary.categorySales.length}</div>
              <p className="text-xs text-gray-600 mt-1">Active categories</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sales by Category */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Sales by Category Today
              </CardTitle>
              <CardDescription>
                Breakdown of today's sales performance by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailySummary.categorySales.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.count} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${(category.revenue / dailySummary.totalRevenue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          ${category.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Order Recommendations */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                Products to Order This Week
              </CardTitle>
              <CardDescription>
                AI-recommended products and quantities based on current stock and demand forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderRecommendations.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="font-medium ml-2">{item.currentStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Recommended:</span>
                        <span className="font-medium ml-2 text-blue-600">{item.recommendedOrder}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium ml-2">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Generate Purchase Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;