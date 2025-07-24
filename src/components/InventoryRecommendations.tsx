
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, TrendingDown, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  dailyConsumption: number;
  daysRemaining: number;
  priority: 'urgent' | 'medium' | 'low';
  suggestedOrderQuantity: number;
}

const InventoryRecommendations = () => {
  const { toast } = useToast();

  // Mock data - in real app this would come from API based on sales trends
  const recommendations: Product[] = [
    {
      id: "1",
      name: "Milk",
      category: "Dairy",
      currentStock: 8,
      dailyConsumption: 15,
      daysRemaining: 0.5,
      priority: 'urgent',
      suggestedOrderQuantity: 100
    },
    {
      id: "2", 
      name: "Bread",
      category: "Bakery",
      currentStock: 15,
      dailyConsumption: 12,
      daysRemaining: 1.2,
      priority: 'urgent',
      suggestedOrderQuantity: 80
    },
    {
      id: "3",
      name: "Eggs",
      category: "Dairy", 
      currentStock: 12,
      dailyConsumption: 8,
      daysRemaining: 1.5,
      priority: 'urgent',
      suggestedOrderQuantity: 60
    },
    {
      id: "4",
      name: "Rice",
      category: "Grains",
      currentStock: 25,
      dailyConsumption: 8,
      daysRemaining: 3.1,
      priority: 'medium',
      suggestedOrderQuantity: 50
    },
    {
      id: "5",
      name: "Chips",
      category: "Snacks",
      currentStock: 18,
      dailyConsumption: 5,
      daysRemaining: 3.6,
      priority: 'medium',
      suggestedOrderQuantity: 40
    }
  ];

  const urgentProducts = recommendations.filter(p => p.priority === 'urgent');
  const mediumProducts = recommendations.filter(p => p.priority === 'medium');

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to order list",
      description: `${product.name} (${product.suggestedOrderQuantity} units) added to your order list.`,
    });
  };

  const handleOrderAll = () => {
    toast({
      title: "Order created",
      description: `Created order for ${urgentProducts.length} urgent products.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span>Inventory Recommendations</span>
          </div>
          {/* {urgentProducts.length > 0 && (
            <Button onClick={handleOrderAll} size="sm" className="bg-red-600 hover:bg-red-700">
              Order All Urgent ({urgentProducts.length})
            </Button>
          )} */}
        </CardTitle>
        <CardDescription>
          Products that need to be reordered based on consumption patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {urgentProducts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-red-700">Urgent - Order Today!</h3>
            </div>
            <div className="space-y-3">
              {urgentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-red-900">{product.name}</span>
                      <Badge variant={getPriorityColor(product.priority) as any}>
                        {product.daysRemaining < 1 ? 
                          `${Math.round(product.daysRemaining * 24)}h left` : 
                          `${product.daysRemaining.toFixed(1)} days left`
                        }
                      </Badge>
                    </div>
                    <div className="text-sm text-red-700">
                      Current: {product.currentStock} units • Daily use: {product.dailyConsumption} units
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-900">Suggested: {product.suggestedOrderQuantity}</div>
                      <div className="text-xs text-red-600">{product.category}</div>
                    </div>
                    {/* <Button size="sm" onClick={() => handleAddToCart(product)} variant="outline">
                      Add to Order
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediumProducts.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold text-yellow-700">Medium Priority - Order This Week</h3>
            </div>
            <div className="space-y-2">
              {mediumProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-yellow-900">{product.name}</span>
                      <Badge variant={getPriorityColor(product.priority) as any}>
                        {product.daysRemaining.toFixed(1)} days left
                      </Badge>
                    </div>
                    <div className="text-sm text-yellow-700">
                      Current: {product.currentStock} units • Daily use: {product.dailyConsumption} units
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-900">Suggested: {product.suggestedOrderQuantity}</div>
                      <div className="text-xs text-yellow-600">{product.category}</div>
                    </div>
                    {/* <Button size="sm" onClick={() => handleAddToCart(product)} variant="outline">
                      Add to Order
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>All products have sufficient stock!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryRecommendations;
