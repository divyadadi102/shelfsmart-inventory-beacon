
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Package, Download, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  remaining: number;
  status: 'critical' | 'low' | 'safe';
  lastUpdated: string;
}

const Alerts = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'critical' | 'low' | 'safe'>('all');

  const products: Product[] = [
    { id: '1', name: 'Milk', category: 'Dairy', remaining: 8, status: 'critical', lastUpdated: '2 hours ago' },
    { id: '2', name: 'Bread', category: 'Bakery', remaining: 12, status: 'critical', lastUpdated: '1 hour ago' },
    { id: '3', name: 'Eggs', category: 'Dairy', remaining: 15, status: 'low', lastUpdated: '30 minutes ago' },
    { id: '4', name: 'Yogurt', category: 'Dairy', remaining: 18, status: 'low', lastUpdated: '1 hour ago' },
    { id: '5', name: 'Bananas', category: 'Fruits', remaining: 22, status: 'low', lastUpdated: '45 minutes ago' },
    { id: '6', name: 'Chips', category: 'Snacks', remaining: 25, status: 'low', lastUpdated: '2 hours ago' },
    { id: '7', name: 'Cheese', category: 'Dairy', remaining: 45, status: 'safe', lastUpdated: '3 hours ago' },
    { id: '8', name: 'Apples', category: 'Fruits', remaining: 52, status: 'safe', lastUpdated: '1 hour ago' },
    { id: '9', name: 'Rice', category: 'Grains', remaining: 78, status: 'safe', lastUpdated: '4 hours ago' },
    { id: '10', name: 'Pasta', category: 'Grains', remaining: 95, status: 'safe', lastUpdated: '2 hours ago' },
  ];

  const categories = ["all", "dairy", "fruits", "vegetables", "beverages", "snacks", "bakery", "grains"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🔴';
      case 'low': return '🟠';
      case 'safe': return '🟢';
      default: return '⚪';
    }
  };

  // Sort products by status priority (critical first, then low, then safe)
  const sortedProducts = [...products].sort((a, b) => {
    const statusOrder = { critical: 0, low: 1, safe: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Filter products by category and status
  const filteredProducts = sortedProducts.filter(product => {
    const categoryMatch = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const statusMatch = selectedStatus === 'all' || product.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const criticalCount = products.filter(p => p.status === 'critical').length;
  const lowCount = products.filter(p => p.status === 'low').length;
  const safeCount = products.filter(p => p.status === 'safe').length;

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your alerts report is being generated and will download shortly.",
    });
  };

  const handleStatusFilter = (status: 'all' | 'critical' | 'low' | 'safe') => {
    setSelectedStatus(status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Alerts</h1>
          <p className="text-gray-600">Monitor your inventory levels and get proactive alerts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`shadow-lg cursor-pointer transition-all hover:shadow-xl ${
              selectedStatus === 'critical' ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => handleStatusFilter('critical')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Critical Items</span>
                <span className="text-2xl">🔴</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-sm text-gray-600">Immediate attention required</p>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-lg cursor-pointer transition-all hover:shadow-xl ${
              selectedStatus === 'low' ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => handleStatusFilter('low')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Low Stock</span>
                <span className="text-2xl">🟠</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{lowCount}</p>
              <p className="text-sm text-gray-600">Reorder recommended</p>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-lg cursor-pointer transition-all hover:shadow-xl ${
              selectedStatus === 'safe' ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => handleStatusFilter('safe')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Safe Stock</span>
                <span className="text-2xl">🟢</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{safeCount}</p>
              <p className="text-sm text-gray-600">Adequate levels</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-white">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {selectedStatus !== 'all' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusFilter('all')}
                className="text-gray-600"
              >
                Clear Status Filter
              </Button>
            )}
          </div>

          <Button 
            onClick={handleExport}
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Alerts</span>
          </Button>
        </div>

        {/* Product Alert Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Product Alert Status</span>
            </CardTitle>
            <CardDescription>
              {selectedCategory === "all" && selectedStatus === 'all'
                ? `Showing all ${filteredProducts.length} products` 
                : `Showing ${filteredProducts.length} products ${
                    selectedCategory !== "all" ? `in ${selectedCategory} category` : ''
                  } ${
                    selectedStatus !== 'all' ? `with ${selectedStatus} status` : ''
                  }`.trim()
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getStatusIcon(product.status)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{product.remaining} units</p>
                      <p className="text-sm text-gray-500">Updated {product.lastUpdated}</p>
                    </div>
                    
                    <Badge 
                      className={`${getStatusColor(product.status)} font-medium capitalize`}
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found with the selected filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
