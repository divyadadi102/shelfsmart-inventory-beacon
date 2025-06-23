
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Star } from "lucide-react";
import { useState } from "react";
import StockAlertsCard from "./StockAlertsCard";
import WeatherCard from "./WeatherCard";

type PredictionPeriod = 'today' | 'tomorrow' | 'nextWeek';

const ForecastSection = () => {
  const [predictionPeriod, setPredictionPeriod] = useState<PredictionPeriod>('today');

  // Mock data for different prediction periods
  const predictionData = {
    today: {
      hourlySales: [
        { time: '9 AM', sales: 120, forecast: 130 },
        { time: '10 AM', sales: 180, forecast: 190 },
        { time: '11 AM', sales: 250, forecast: 260 },
        { time: '12 PM', sales: 320, forecast: 340 },
        { time: '1 PM', sales: 290, forecast: 310 },
        { time: '2 PM', sales: 200, forecast: 210 },
        { time: '3 PM', sales: 150, forecast: 160 },
        { time: '4 PM', sales: 220, forecast: 240 },
        { time: '5 PM', sales: 380, forecast: 420 },
        { time: '6 PM', sales: 450, forecast: 480 },
        { time: '7 PM', sales: 320, forecast: 350 },
        { time: '8 PM', sales: 180, forecast: 190 },
        { time: '9 PM', sales: 100, forecast: 110 },
      ],
      bestSellers: [
        { name: "Milk", expected: 45, color: "#3b82f6" },
        { name: "Bread", expected: 38, color: "#8b5cf6" },
        { name: "Eggs", expected: 32, color: "#10b981" },
        { name: "Chips", expected: 28, color: "#f59e0b" },
        { name: "Bananas", expected: 25, color: "#ef4444" },
        { name: "Rice", expected: 22, color: "#06b6d4" },
      ],
      expectedTraffic: 284,
      expectedRevenue: 3450
    },
    tomorrow: {
      hourlySales: [
        { time: '9 AM', sales: 0, forecast: 140 },
        { time: '10 AM', sales: 0, forecast: 200 },
        { time: '11 AM', sales: 0, forecast: 280 },
        { time: '12 PM', sales: 0, forecast: 360 },
        { time: '1 PM', sales: 0, forecast: 330 },
        { time: '2 PM', sales: 0, forecast: 220 },
        { time: '3 PM', sales: 0, forecast: 170 },
        { time: '4 PM', sales: 0, forecast: 260 },
        { time: '5 PM', sales: 0, forecast: 400 },
        { time: '6 PM', sales: 0, forecast: 500 },
        { time: '7 PM', sales: 0, forecast: 370 },
        { time: '8 PM', sales: 0, forecast: 200 },
        { time: '9 PM', sales: 0, forecast: 120 },
      ],
      bestSellers: [
        { name: "Milk", expected: 48, color: "#3b82f6" },
        { name: "Bread", expected: 42, color: "#8b5cf6" },
        { name: "Eggs", expected: 35, color: "#10b981" },
        { name: "Rice", expected: 30, color: "#06b6d4" },
        { name: "Chips", expected: 28, color: "#f59e0b" },
        { name: "Bananas", expected: 26, color: "#ef4444" },
      ],
      expectedTraffic: 315,
      expectedRevenue: 3820
    },
    nextWeek: {
      hourlySales: [
        { time: 'Mon', sales: 0, forecast: 2800 },
        { time: 'Tue', sales: 0, forecast: 3200 },
        { time: 'Wed', sales: 0, forecast: 2900 },
        { time: 'Thu', sales: 0, forecast: 3500 },
        { time: 'Fri', sales: 0, forecast: 4200 },
        { time: 'Sat', sales: 0, forecast: 5100 },
        { time: 'Sun', sales: 0, forecast: 3800 },
      ],
      bestSellers: [
        { name: "Milk", expected: 320, color: "#3b82f6" },
        { name: "Bread", expected: 285, color: "#8b5cf6" },
        { name: "Rice", expected: 245, color: "#06b6d4" },
        { name: "Eggs", expected: 230, color: "#10b981" },
        { name: "Chips", expected: 195, color: "#f59e0b" },
        { name: "Bananas", expected: 180, color: "#ef4444" },
      ],
      expectedTraffic: 2150,
      expectedRevenue: 25500
    }
  };

  const currentPrediction = predictionData[predictionPeriod];

  const getPredictionTitle = () => {
    switch (predictionPeriod) {
      case 'today': return "Today's Forecasts";
      case 'tomorrow': return "Tomorrow's Forecasts";
      case 'nextWeek': return "Next Week's Forecasts";
      default: return "Forecasts";
    }
  };

  const getHourlyChartTitle = () => {
    switch (predictionPeriod) {
      case 'today': return "Hourly Sales Forecast";
      case 'tomorrow': return "Tomorrow's Hourly Forecast";
      case 'nextWeek': return "Daily Sales Forecast";
      default: return "Sales Forecast";
    }
  };

  return (
    <div className="mb-12">
      {/* Prediction Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button
            variant={predictionPeriod === 'today' ? 'default' : 'outline'}
            onClick={() => setPredictionPeriod('today')}
            className="flex items-center space-x-2"
          >
            <span>Today's Forecast</span>
          </Button>
          <Button
            variant={predictionPeriod === 'tomorrow' ? 'default' : 'outline'}
            onClick={() => setPredictionPeriod('tomorrow')}
            className="flex items-center space-x-2"
          >
            <span>Tomorrow's Forecast</span>
          </Button>
          <Button
            variant={predictionPeriod === 'nextWeek' ? 'default' : 'outline'}
            onClick={() => setPredictionPeriod('nextWeek')}
            className="flex items-center space-x-2"
          >
            <span>Next Week's Forecast</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">{getPredictionTitle()}</h2>
      </div>

      {/* Holiday/Weekend Effect Banner */}
      {predictionPeriod === 'today' && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Weekend Effect Active</h3>
                <p className="text-sm text-orange-700">Expected 25% increase in foot traffic due to weekend shopping patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {predictionPeriod === 'nextWeek' && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Weekly Planning Mode</h3>
                <p className="text-sm text-green-700">Plan your inventory orders in advance based on next week's demand forecast</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* First Row: Sales Graph and Best Sellers Forecast */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>{getHourlyChartTitle()}</span>
            </CardTitle>
            <CardDescription>
              {predictionPeriod === 'nextWeek' ? 'Daily forecast for the upcoming week' : 'Predicted sales throughout the day'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentPrediction.hourlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Forecast"
                />
                {predictionPeriod === 'today' && (
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Actual"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Top Products Forecast</span>
            </CardTitle>
            <CardDescription>
              {predictionPeriod === 'nextWeek' ? 'Expected best sellers for next week' : `Expected best sellers for ${predictionPeriod}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentPrediction.bestSellers}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="expected"
                  label={({ name, expected }) => `${name}: ${expected}`}
                >
                  {currentPrediction.bestSellers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Stock Alerts, Weather, Traffic, and Revenue */}
      <div className="grid lg:grid-cols-4 gap-6">
        <StockAlertsCard />
        <WeatherCard />

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Expected Traffic</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 mb-1">{currentPrediction.expectedTraffic}</p>
              <p className="text-xs text-gray-600">
                {predictionPeriod === 'nextWeek' ? 'customers expected' : 'customers expected'}
              </p>
              <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                {predictionPeriod === 'nextWeek' ? '+20% vs this week' : '+12% vs yesterday'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span>Revenue Forecast</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">${currentPrediction.expectedRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-600">
                {predictionPeriod === 'nextWeek' ? 'expected next week' : `expected ${predictionPeriod}`}
              </p>
              <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                {predictionPeriod === 'nextWeek' ? '+22% vs this week' : '+18% vs avg'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForecastSection;
