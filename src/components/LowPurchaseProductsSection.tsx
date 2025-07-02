
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, AlertCircle } from "lucide-react";
import { useState } from "react";

type TimePeriod = 'lastWeek' | 'lastMonth' | 'customRange';

const LowPurchaseProductsSection = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('lastWeek');

  const lowPurchaseData = {
    lastWeek: [
      { name: "Pasta", sales: 8, target: 35, category: "Grains", deficit: "-77%" },
      { name: "Crackers", sales: 12, target: 30, category: "Snacks", deficit: "-60%" },
      { name: "Yogurt", sales: 15, target: 40, category: "Dairy", deficit: "-63%" },
      { name: "Juice", sales: 18, target: 45, category: "Beverages", deficit: "-60%" },
      { name: "Cheese", sales: 22, target: 50, category: "Dairy", deficit: "-56%" },
    ],
    lastMonth: [
      { name: "Pasta", sales: 32, target: 140, category: "Grains", deficit: "-77%" },
      { name: "Crackers", sales: 48, target: 120, category: "Snacks", deficit: "-60%" },
      { name: "Yogurt", sales: 58, target: 160, category: "Dairy", deficit: "-64%" },
      { name: "Juice", sales: 72, target: 180, category: "Beverages", deficit: "-60%" },
      { name: "Cheese", sales: 85, target: 200, category: "Dairy", deficit: "-58%" },
    ],
    customRange: [
      { name: "Pasta", sales: 95, target: 420, category: "Grains", deficit: "-77%" },
      { name: "Crackers", sales: 142, target: 360, category: "Snacks", deficit: "-61%" },
      { name: "Yogurt", sales: 168, target: 480, category: "Dairy", deficit: "-65%" },
      { name: "Juice", sales: 215, target: 540, category: "Beverages", deficit: "-60%" },
      { name: "Cheese", sales: 248, target: 600, category: "Dairy", deficit: "-59%" },
    ]
  };

  const currentData = lowPurchaseData[timePeriod];

  const getPeriodTitle = () => {
    switch (timePeriod) {
      case 'lastWeek': return "Last Week";
      case 'lastMonth': return "Last Month";
      case 'customRange': return "Custom Range (Last 3 Months)";
      default: return "Last Week";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <span>Low Purchase Products</span>
        </CardTitle>
        <CardDescription>
          Products with significantly lower sales than expected targets
        </CardDescription>
        
        {/* Time Period Selector */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant={timePeriod === 'lastWeek' ? 'default' : 'outline'}
            onClick={() => setTimePeriod('lastWeek')}
            size="sm"
          >
            Last Week
          </Button>
          <Button
            variant={timePeriod === 'lastMonth' ? 'default' : 'outline'}
            onClick={() => setTimePeriod('lastMonth')}
            size="sm"
          >
            Last Month
          </Button>
          <Button
            variant={timePeriod === 'customRange' ? 'default' : 'outline'}
            onClick={() => setTimePeriod('customRange')}
            size="sm"
          >
            Custom Range
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-red-700">Underperforming Products - {getPeriodTitle()}</h3>
          </div>
          {currentData.map((product) => (
            <div key={product.name} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-red-900">{product.name}</span>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    {product.category}
                  </Badge>
                </div>
                <div className="text-sm text-red-700">
                  Actual: {product.sales} units • Target: {product.target} units
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-red-900">
                  {product.deficit}
                </div>
                <div className="text-xs text-red-600">below target</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowPurchaseProductsSection;
