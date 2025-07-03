import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";

type TimePeriod = 'lastWeek' | 'lastMonth' | 'customRange';

const TopSellingProductsSection = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('lastWeek');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const topSellingData = {
    lastWeek: [
      { name: "Milk", sales: 142, revenue: 568, category: "Dairy", trend: "+15%" },
      { name: "Bread", sales: 135, revenue: 405, category: "Bakery", trend: "+12%" },
      { name: "Eggs", sales: 128, revenue: 384, category: "Dairy", trend: "+8%" },
      { name: "Rice", sales: 95, revenue: 475, category: "Grains", trend: "+22%" },
      { name: "Bananas", sales: 89, revenue: 178, category: "Fruits", trend: "+5%" },
    ],
    lastMonth: [
      { name: "Milk", sales: 580, revenue: 2320, category: "Dairy", trend: "+18%" },
      { name: "Bread", sales: 542, revenue: 1626, category: "Bakery", trend: "+14%" },
      { name: "Rice", sales: 398, revenue: 1990, category: "Grains", trend: "+25%" },
      { name: "Eggs", sales: 365, revenue: 1095, category: "Dairy", trend: "+10%" },
      { name: "Chips", sales: 342, revenue: 1368, category: "Snacks", trend: "+20%" },
    ],
    customRange: [
      { name: "Milk", sales: 1250, revenue: 5000, category: "Dairy", trend: "+16%" },
      { name: "Bread", sales: 1180, revenue: 3540, category: "Bakery", trend: "+13%" },
      { name: "Rice", sales: 890, revenue: 4450, category: "Grains", trend: "+28%" },
      { name: "Eggs", sales: 785, revenue: 2355, category: "Dairy", trend: "+11%" },
      { name: "Chips", sales: 720, revenue: 2880, category: "Snacks", trend: "+22%" },
    ]
  };

  const currentData = topSellingData[timePeriod];

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
    <div className="mb-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Top Selling Products</span>
          </CardTitle>
          <CardDescription>
            Best performing products by sales volume and revenue
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
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product List */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-green-700">Top Performers - {getPeriodTitle()}</h3>
            </div>
            {currentData.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-green-900">{product.name}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-green-700">
                      Sales: {product.sales} units • Revenue: ${product.revenue}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-900">
                    {product.trend}
                  </div>
                  <div className="text-xs text-green-600">vs previous period</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopSellingProductsSection;
