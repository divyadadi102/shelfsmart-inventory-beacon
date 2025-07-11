import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  lastUpdated: string;
  dailyConsumption: number;
}

const Alerts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getStatus = (quantity: number): 'critical' | 'low' | 'safe' => {
    if (quantity <= 20) return 'critical';
    if (quantity <= 50) return 'low';
    return 'safe';
  };

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

  const getTimeRemainingColor = (remaining: number, dailyConsumption: number) => {
    const daysRemaining = remaining / dailyConsumption;
    if (daysRemaining < 1) return 'text-red-600 font-semibold';
    if (daysRemaining < 2) return 'text-orange-600 font-medium';
    return 'text-gray-600';
  };

  const calculateTimeRemaining = (remaining: number, dailyConsumption: number) => {
    if (dailyConsumption === 0) return "Unknown";

    const daysRemaining = remaining / dailyConsumption;

    if (daysRemaining < 1) {
      const hoursRemaining = Math.round(daysRemaining * 24);
      return hoursRemaining <= 1 ? `${hoursRemaining} hour left` : `${hoursRemaining} hours left`;
    } else if (daysRemaining < 7) {
      return `${daysRemaining.toFixed(1)} days left`;
    } else {
      const weeksRemaining = Math.round(daysRemaining / 7);
      return `${weeksRemaining} week${weeksRemaining > 1 ? 's' : ''} left`;
    }
  };

  const fetchProducts = async () => {
    try {
      const [stockRes, catRes] = await Promise.all([
        fetch("http://localhost:8000/api/stock"),
        fetch("http://localhost:8000/api/categories")
      ]);

      const stock = await stockRes.json();
      const categories = await catRes.json();

      const enriched = stock.map((p: any) => {
        const category = categories.find((c: any) => c.id === p.category_id);
        return {
          id: p.id.toString(),
          name: p.name,
          categoryId: p.category_id.toString(),
          categoryName: category?.name || "",
          quantity: p.quantity,
          lastUpdated: new Date(p.last_updated).toLocaleString(),
          dailyConsumption: p.daily_consumption || 10, // fallback if not provided
        };
      });

      setProducts(enriched);
    } catch (error) {
      console.error("Failed to fetch alerts data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const status = getStatus(product.quantity);
    const categoryMatch = !selectedCategory || product.categoryName === selectedCategory;
    const statusMatch = !selectedStatus || status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const statusOrder = { critical: 0, low: 1, safe: 2 };
    return statusOrder[getStatus(a.quantity)] - statusOrder[getStatus(b.quantity)];
  });

  const categories = [...new Set(products.map(p => p.categoryName))];

  const criticalCount = products.filter(p => getStatus(p.quantity) === 'critical').length;
  const lowCount = products.filter(p => getStatus(p.quantity) === 'low').length;
  const safeCount = products.filter(p => getStatus(p.quantity) === 'safe').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Alerts</h1>
          <p className="text-gray-600">Monitor your inventory levels and get proactive alerts</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Filter by Category:</h3>
            <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>All Categories</Button>
            {categories.map((category) => (
              <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>{category}</Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Filter by Status:</h3>
            <Button variant={selectedStatus === null ? "default" : "outline"} size="sm" onClick={() => setSelectedStatus(null)}>All Status</Button>
            <Button variant={selectedStatus === 'critical' ? "default" : "outline"} size="sm" className="text-red-600" onClick={() => setSelectedStatus('critical')}>🔴 Critical</Button>
            <Button variant={selectedStatus === 'low' ? "default" : "outline"} size="sm" className="text-orange-600" onClick={() => setSelectedStatus('low')}>🟠 Low</Button>
            <Button variant={selectedStatus === 'safe' ? "default" : "outline"} size="sm" className="text-green-600" onClick={() => setSelectedStatus('safe')}>🟢 Safe</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Critical Items</span><span className="text-2xl">🔴</span>
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
                <span className="text-lg">Low Stock</span><span className="text-2xl">🟠</span>
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
                <span className="text-lg">Safe Stock</span><span className="text-2xl">🟢</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{safeCount}</p>
              <p className="text-sm text-gray-600">Well stocked</p>
            </CardContent>
          </Card>
        </div>

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
              {sortedProducts.map((product) => {
                const status = getStatus(product.quantity);
                return (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(status)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.categoryName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className={`text-xs ${getTimeRemainingColor(product.quantity, product.dailyConsumption)}`}>
                              {calculateTimeRemaining(product.quantity, product.dailyConsumption)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{product.quantity} units</p>
                        <p className="text-sm text-gray-500">Daily use: {product.dailyConsumption}</p>
                        <p className="text-sm text-gray-500">Updated {product.lastUpdated}</p>
                      </div>
                      <Badge className={`${getStatusColor(status)} font-medium capitalize`}>{status}</Badge>
                    </div>
                  </div>
                );
              })}

              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No products found with current filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
