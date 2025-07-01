
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertTriangle } from "lucide-react";

const LowSalesProductsSection = () => {
  // Mock data for products with low sales
  const lowSalesProducts = [
    { name: "Cookies", sales: 12, target: 45, category: "Snacks" },
    { name: "Juice", sales: 18, target: 50, category: "Beverages" },
    { name: "Yogurt", sales: 22, target: 60, category: "Dairy" },
    { name: "Crackers", sales: 15, target: 40, category: "Snacks" },
    { name: "Cheese", sales: 28, target: 70, category: "Dairy" },
    { name: "Pasta", sales: 8, target: 35, category: "Grains" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <span>Low Performance Products</span>
        </CardTitle>
        <CardDescription>
          Products with sales below expected targets - consider promotions or inventory adjustments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lowSalesProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#ef4444" name="Actual Sales" />
              <Bar dataKey="target" fill="#94a3b8" opacity={0.5} name="Target Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-red-700">Action Required</h3>
          </div>
          {lowSalesProducts.map((product) => {
            const performance = Math.round((product.sales / product.target) * 100);
            return (
              <div key={product.name} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-red-900">{product.name}</span>
                    <Badge variant="destructive">
                      {performance}% of target
                    </Badge>
                  </div>
                  <div className="text-sm text-red-700">
                    Sales: {product.sales} units • Target: {product.target} units • {product.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-900">
                    -{product.target - product.sales} units behind
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowSalesProductsSection;
