
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  remaining: number;
  status: 'critical' | 'low' | 'safe';
  lastUpdated: string;
}

const Alerts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const products: Product[] = [
    { id: '1', name: 'Milk', category: 'Dairy', remaining: 8, status: 'critical', lastUpdated: '2 hours ago' },
    { id: '2', name: 'Bread', category: 'Bakery', remaining: 12, status: 'critical', lastUpdated: '1 hour ago' },
    { id: '3', name: 'Eggs', category: 'Dairy', remaining: 15, status: 'low', lastUpdated: '30 minutes ago' },
    { id: '4', name: 'Yogurt', category: 'Dairy', remaining: 18, status: 'low', lastUpdated: '1 hour ago' },
    { id: '5', name: 'Bananas', category: 'Fruits', remaining: 22, status: 'low', lastUpdated: '45 minutes ago' },
    { id: '6', name: 'Chips', category: 'Snacks', remaining: 25, status: 'low', lastUpdated: '2 hours ago' },
    { id: '7', name: 'Cheese', category: 'Dairy', remaining: 45, status: 'safe', lastUpdated: '3 hours ago' },
    { id: '8', name: 'Apples', category: 'Fruits', remaining: 52, status: 'safe', lastUpdated: '1 hour ago' },
    { id: '9', name: 'Cookies', category: 'Snacks', remaining: 38, status: 'safe', lastUpdated: '2 hours ago' },
    { id: '10', name: 'Pastries', category: 'Bakery', remaining: 30, status: 'safe', lastUpdated: '4 hours ago' },
  ];

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

  // Filter products based on selected category and status
  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const statusMatch = !selectedStatus || product.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Sort products by status priority (critical first, then low, then safe)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const statusOrder = { critical: 0, low: 1, safe: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const criticalCount = products.filter(p => p.status === 'critical').length;
  const lowCount = products.filter(p => p.status === 'low').length;
  const safeCount = products.filter(p => p.status === 'safe').length;

  const categories = [...new Set(products.map(p => p.category))];

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Alerts</h1>
          <p className="text-gray-600">Monitor your inventory levels and get proactive alerts</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Filter by Category:</h3>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={clearFilters}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Filter by Status:</h3>
            <Button
              variant={selectedStatus === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(null)}
            >
              All Status
            </Button>
            <Button
              variant={selectedStatus === 'critical' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus('critical')}
              className="text-red-600"
            >
              🔴 Critical
            </Button>
            <Button
              variant={selectedStatus === 'low' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus('low')}
              className="text-orange-600"
            >
              🟠 Low
            </Button>
            <Button
              variant={selectedStatus === 'safe' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus('safe')}
              className="text-green-600"
            >
              🟢 Safe
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
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

          <Card className="shadow-lg">
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

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Safe Stock</span>
                <span className="text-2xl">🟢</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{safeCount}</p>
              <p className="text-sm text-gray-600">Well stocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Alert Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Product Alert Status</span>
            </CardTitle>
            <CardDescription>
              Showing {sortedProducts.length} products
              {selectedCategory && ` in ${selectedCategory}`}
              {selectedStatus && ` with ${selectedStatus} status`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedProducts.map((product) => (
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

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found with current filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
