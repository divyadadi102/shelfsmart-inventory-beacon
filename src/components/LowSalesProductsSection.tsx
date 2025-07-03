import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";

type TimePeriod = 'lastWeek' | 'lastMonth' | 'customRange';

const LowSalesProductsSection = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('lastWeek');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const lowSalesData = {
    lastWeek: [
      { name: "Cookies", sales: 12, remaining: 100, category: "Snacks" },
      { name: "Juice", sales: 18, remaining: 82, category: "Beverages" },
      { name: "Yogurt", sales: 22, remaining: 78, category: "Dairy" },
      { name: "Crackers", sales: 15, remaining: 85, category: "Snacks" },
      { name: "Cheese", sales: 28, remaining: 72, category: "Dairy" },
      { name: "Pasta", sales: 8, remaining: 92, category: "Grains" },
    ],
    lastMonth: [
      { name: "Cookies", sales: 45, remaining: 380, category: "Snacks" },
      { name: "Juice", sales: 68, remaining: 312, category: "Beverages" },
      { name: "Yogurt", sales: 85, remaining: 295, category: "Dairy" },
      { name: "Crackers", sales: 58, remaining: 322, category: "Snacks" },
      { name: "Cheese", sales: 105, remaining: 275, category: "Dairy" },
      { name: "Pasta", sales: 32, remaining: 348, category: "Grains" },
    ],
    customRange: [
      { name: "Cookies", sales: 135, remaining: 1140, category: "Snacks" },
      { name: "Juice", sales: 204, remaining: 936, category: "Beverages" },
      { name: "Yogurt", sales: 255, remaining: 885, category: "Dairy" },
      { name: "Crackers", sales: 174, remaining: 966, category: "Snacks" },
      { name: "Cheese", sales: 315, remaining: 825, category: "Dairy" },
      { name: "Pasta", sales: 96, remaining: 1044, category: "Grains" },
    ]
  };

  const currentData = lowSalesData[timePeriod];

  const getPeriodTitle = () => {
    switch (timePeriod) {
      case 'lastWeek': return "Last Week";
      case 'lastMonth': return "Last Month";
      case 'customRange': return dateRange?.from && dateRange?.to 
        ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
        : "Custom Range (Last 3 Months)";
      default: return "Last Week";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <span>Low Performance Products</span>
        </CardTitle>
        <CardDescription>
          Products with low sales performance - consider promotions or inventory adjustments
        </CardDescription>
        
        {/* Time Period Selector */}
        <div className="flex flex-col space-y-3 mt-4">
          <div className="flex space-x-2">
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
          
          {/* Date Range Picker for Custom Range */}
          {timePeriod === 'customRange' && (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="mt-2"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Graph */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-semibold text-red-700">Action Required - {getPeriodTitle()}</h3>
          </div>
          {currentData.map((product) => {
            const unitsLeft = product.remaining - product.sales;
            return (
              <div key={product.name} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-red-900">{product.name}</span>
                    <Badge variant="destructive">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-red-700">
                    Sales: {product.sales} units • Remaining: {product.remaining} units
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-900">
                    -{unitsLeft} units behind
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
