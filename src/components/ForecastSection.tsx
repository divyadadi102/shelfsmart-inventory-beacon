import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Package, Star, CloudRain } from "lucide-react";
import { useState } from "react";
import WeatherCard from "./WeatherCard";
import TexasMap from "./TexasMap";
import { useEffect, } from "react";

type PredictionPeriod = 'today' | 'tomorrow' | 'nextWeek';
type ForecastData = {
    allProducts: { name: string; expected: number; color?: string }[];
    expectedTraffic: number;
    expectedRevenue: number;
    inventoryTurnover: number;
    profitMargin: number;
    weatherImpact: string;
  };

const ForecastSection = () => {
  const [predictionPeriod, setPredictionPeriod] = useState<PredictionPeriod>('today');
  const [predictionData, setPredictionData] = useState<Record<PredictionPeriod, ForecastData> | null>(null);
  const [loading, setLoading] = useState(true);


  // Mock data for different prediction periods - ALL PRODUCTS
  /*const predictionData = {
    today: {
      allProducts: [
        { name: "Milk", expected: 45, color: "#3b82f6" },
        { name: "Bread", expected: 38, color: "#8b5cf6" },
        { name: "Eggs", expected: 32, color: "#10b981" },
        { name: "Chips", expected: 28, color: "#f59e0b" },
        { name: "Bananas", expected: 25, color: "#ef4444" },
        { name: "Rice", expected: 22, color: "#06b6d4" },
        { name: "Cookies", expected: 18, color: "#84cc16" },
        { name: "Juice", expected: 15, color: "#f97316" },
        { name: "Yogurt", expected: 12, color: "#ec4899" },
        { name: "Cheese", expected: 10, color: "#6366f1" },
        { name: "Pasta", expected: 8, color: "#14b8a6" },
        { name: "Crackers", expected: 6, color: "#f59e0b" },
      ],
      expectedTraffic: 284,
      expectedRevenue: 3450,
      inventoryTurnover: 2.3,
      profitMargin: 18.5,
      weatherImpact: '+12%'
    },
    tomorrow: {
      allProducts: [
        { name: "Milk", expected: 48, color: "#3b82f6" },
        { name: "Bread", expected: 42, color: "#8b5cf6" },
        { name: "Eggs", expected: 35, color: "#10b981" },
        { name: "Rice", expected: 30, color: "#06b6d4" },
        { name: "Chips", expected: 28, color: "#f59e0b" },
        { name: "Bananas", expected: 26, color: "#ef4444" },
        { name: "Cookies", expected: 20, color: "#84cc16" },
        { name: "Juice", expected: 17, color: "#f97316" },
        { name: "Yogurt", expected: 14, color: "#ec4899" },
        { name: "Cheese", expected: 12, color: "#6366f1" },
        { name: "Pasta", expected: 10, color: "#14b8a6" },
        { name: "Crackers", expected: 8, color: "#f59e0b" },
      ],
      expectedTraffic: 315,
      expectedRevenue: 3820,
      inventoryTurnover: 2.5,
      profitMargin: 19.2,
      weatherImpact: '+8%'
    },
    nextWeek: {
      allProducts: [
        { name: "Milk", expected: 320, color: "#3b82f6" },
        { name: "Bread", expected: 285, color: "#8b5cf6" },
        { name: "Rice", expected: 245, color: "#06b6d4" },
        { name: "Eggs", expected: 230, color: "#10b981" },
        { name: "Chips", expected: 195, color: "#f59e0b" },
        { name: "Bananas", expected: 180, color: "#ef4444" },
        { name: "Cookies", expected: 140, color: "#84cc16" },
        { name: "Juice", expected: 125, color: "#f97316" },
        { name: "Yogurt", expected: 98, color: "#ec4899" },
        { name: "Cheese", expected: 85, color: "#6366f1" },
        { name: "Pasta", expected: 72, color: "#14b8a6" },
        { name: "Crackers", expected: 58, color: "#f59e0b" },
      ],
      expectedTraffic: 2150,
      expectedRevenue: 25500,
      inventoryTurnover: 2.8,
      profitMargin: 20.1,
      weatherImpact: '+15%'
    }
  };

  const currentPrediction = predictionData[predictionPeriod];*/
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/forecast", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch forecast data");
        const data = await res.json();
        setPredictionData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  fetchData();
}, []);

  const getPredictionTitle = () => {
    switch (predictionPeriod) {
      case 'today': return "Today's Forecasts";
      case 'tomorrow': return "Tomorrow's Forecasts";
      case 'nextWeek': return "Next Week's Forecasts";
      default: return "Forecasts";
    }
  };
  if (loading) {
  return <p className="text-center text-gray-500">Loading forecasts...</p>;
  }

  if (!predictionData) {
    return <p className="text-center text-red-500">No forecast data available.</p>;
  }
  const currentPrediction = predictionData[predictionPeriod];

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

      {/* All Products Forecast - Bar Chart */}
      <div className="mb-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Complete Product Sales Forecast</span>
            </CardTitle>
            <CardDescription>
              {predictionPeriod === 'nextWeek' ? 'Expected sales for all products next week' : `Expected sales for all products ${predictionPeriod}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={currentPrediction.allProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expected" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Cards Grid - Horizontal Layout */}
      <div className="grid grid-cols-4 gap-6 mb-6">
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

        <TexasMap />
      </div>
    </div>
  );
};

export default ForecastSection;
