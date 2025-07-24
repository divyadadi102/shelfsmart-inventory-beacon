  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Calendar } from "@/components/ui/calendar";
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
  import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
  import { TrendingUp, Users, DollarSign, Package, Calendar as CalendarIcon, AlertTriangle, Star, MapPin } from "lucide-react";
  import { format } from "date-fns";
  import Navigation from "@/components/Navigation";
  import InventoryRecommendations from "@/components/InventoryRecommendations";
  import { useEffect, useState } from "react";
  import { getPastPerformance, SalesRecord } from "@/lib/api";
  import { getDailyTotalRevenue, DailyRevenue } from "@/lib/api";
  import { getDailyTotalUnitSales, DailyUnitSales } from "@/lib/api";
  import { getTopItemsSold, TopItem } from "@/lib/api";
  import { getBottomItemsSold } from "@/lib/api";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudDrizzle,
    AlertCircle,
  } from "lucide-react";
  import { fetchProductForecast } from "../lib/api";
  import { CalendarDays } from "lucide-react"
  import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    getDay,
  } from "date-fns"

  type Holiday = {
    date: string
    localName: string
    name: string
  }
  
  type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
  };



  const Dashboard = () => {
    
    const [latestDate, setLatestDate] = useState<string | null>(null);

    const [weather, setWeather] = useState<{ temperature: number; condition: string; code: number } | null>(null);

    const getWeatherIcon = (code: number) => {
      if (code === 0) return <Sun className="w-6 h-6 text-white" />;
      if (code >= 1 && code <= 3) return <Cloud className="w-6 h-6 text-white" />;
      if (code >= 45 && code <= 48) return <CloudDrizzle className="w-6 h-6 text-white" />;
      if (code >= 51 && code <= 67) return <CloudRain className="w-6 h-6 text-white" />;
      if (code >= 71 && code <= 77) return <CloudSnow className="w-6 h-6 text-white" />;
      if (code >= 95 && code <= 99) return <CloudLightning className="w-6 h-6 text-white" />;
      return <AlertCircle className="w-6 h-6 text-white" />;
    };

    const cities = [
      { name: "Houston", lat: 29.7604, lon: -95.3698 },
      { name: "New York", lat: 40.7128, lon: -74.0060 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
      { name: "Chicago", lat: 41.8781, lon: -87.6298 },
      { name: "Phoenix", lat: 33.4484, lon: -112.0740 },
      { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
      { name: "San Antonio", lat: 29.4241, lon: -98.4936 },
      { name: "San Diego", lat: 32.7157, lon: -117.1611 },
      { name: "Dallas", lat: 32.7767, lon: -96.7970 },
      { name: "San Jose", lat: 37.3382, lon: -121.8863 },
    ];
    
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [topItemsLoading, setTopItemsLoading] = useState(false);
    const [topItemsError, setTopItemsError] = useState<string | null>(null);
    const [performanceTab, setPerformanceTab] = useState<'week' | 'month' | 'year' | 'custom'>('week');

    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [dailyRevenueLoading, setDailyRevenueLoading] = useState(false);
    const [dailyRevenueError, setDailyRevenueError] = useState<string | null>(null);

    const [pastPerformance, setPastPerformance] = useState<SalesRecord[]>([]);
    const [performanceLoading, setPerformanceLoading] = useState(false);
    const [performanceError, setPerformanceError] = useState<string | null>(null);

    const [dateRange, setDateRange] = useState<DateRange>({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date()
    });

    const [dailyUnitSales, setDailyUnitSales] = useState<DailyUnitSales[]>([]);
    const [dailyUnitSalesLoading, setDailyUnitSalesLoading] = useState(false);
    const [dailyUnitSalesError, setDailyUnitSalesError] = useState<string | null>(null);

    const [predictionPeriod, setPredictionPeriod] = useState<'today' | 'tomorrow' | 'nextWeek'>('today');

    const [products, setProducts] = useState<{ name: string, expected: number }[]>([]);

    const [loading, setLoading] = useState(false);

    const [revenue, setRevenue] = useState<number | null>(null);
    const [revenueLoading, setRevenueLoading] = useState(false);

    const [categorySales, setCategorySales] = useState<{category: string, total_sales: number}[]>([]);
    const [categorySalesLoading, setCategorySalesLoading] = useState(false);

    const COLORS = [
      "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4","#eab308", "#f43f5e", "#4f46e5", "#84cc16"
    ];

    const [holidays, setHolidays] = useState<Holiday[]>([])

    const today = new Date()

    const monthDays = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    })

    const getPredictionTitle = () => {
      switch (predictionPeriod) {
        case 'today': return "Today's Forecasts";
        case 'tomorrow': return "Tomorrow's Forecasts";
        case 'nextWeek': return "Next Week's Forecasts";
        default: return "Forecasts";
      }
    };

    const [bottomItems, setBottomItems] = useState<TopItem[]>([]);
    const [bottomItemsLoading, setBottomItemsLoading] = useState(false);
    const [bottomItemsError, setBottomItemsError] = useState<string | null>(null);


    useEffect(() => {
      setPerformanceLoading(true);
      getPastPerformance({ limit: 7 })
        .then(setPastPerformance)
        .catch(err => setPerformanceError(err.message || "Failed to fetch data"))
        .finally(() => setPerformanceLoading(false));
    }, []);

    useEffect(() => {
      let params: { start_date?: string; end_date?: string; limit?: number } = {};
      if (performanceTab === "week") {
        params.limit = 14;  // 14 days
      } else if (performanceTab === "month") {
        params.limit = 30;
      } else if (performanceTab === "year") {
        params.limit = 365;
      } else if (performanceTab === "custom") {
        if (dateRange.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");
      }
      setDailyRevenueLoading(true);
      getDailyTotalRevenue(params)
        .then(setDailyRevenue)
        .catch(e => setDailyRevenueError(e.message || "Failed to fetch revenue"))
        .finally(() => setDailyRevenueLoading(false));
    }, [performanceTab, dateRange]);
    
    useEffect(() => {
      let params: { start_date?: string; end_date?: string; limit?: number } = {};
      if (performanceTab === "week") {
        params.limit = 14;
      } else if (performanceTab === "month") {
        params.limit = 30;
      } else if (performanceTab === "year") {
        params.limit = 365;
      } else if (performanceTab === "custom") {
        if (dateRange.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");
      }
      setDailyUnitSalesLoading(true);
      getDailyTotalUnitSales(params)
        .then(setDailyUnitSales)
        .catch(e => setDailyUnitSalesError(e.message || "Failed to fetch unit sales"))
        .finally(() => setDailyUnitSalesLoading(false));
    }, [performanceTab, dateRange]);

    useEffect(() => {
      // only fetch top items if latestDate is available
      if (performanceTab === "week" && !latestDate) return;
    
      let params: { start_date?: string; end_date?: string; limit?: number } = {};
    
      if (performanceTab === "week" && latestDate) {
        params.limit = 5;
        params.end_date = latestDate;
        // use latestDate from database to calculate the start date
        const end = new Date(latestDate);
        const start = new Date(end);
        start.setDate(end.getDate() - 5);
        params.start_date = format(start, "yyyy-MM-dd");
      } else if (performanceTab === "custom") {
        if (dateRange.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");
      }
      setTopItemsLoading(true);
      getTopItemsSold(params)
        .then(setTopItems)
        .catch(e => setTopItemsError(e.message || "Failed to fetch top items"))
        .finally(() => setTopItemsLoading(false));
    }, [performanceTab, dateRange, latestDate]);
    
    

    useEffect(() => {
      async function fetchWeather() {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const data = await res.json();
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;
        const condition = code === 0 ? "Sunny" : code < 50 ? "Cloudy" : "Rainy";
        setWeather({ temperature: temp, condition, code });
      }
      fetchWeather();
    }, [selectedCity]);

    useEffect(() => {
      fetch("/api/sales/latest_date")
        .then(res => res.json())
        .then(data => setLatestDate(data.latest_date));
    }, []);

    useEffect(() => {
      setLoading(true);
      fetchProductForecast(predictionPeriod)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [predictionPeriod]);
    
    function getRevenuePeriodParams(predictionPeriod: string, latestDate: string | null) {
      const today = latestDate ? new Date(latestDate) : new Date();
      if (predictionPeriod === "today") {
        return { prediction_date: today.toISOString().slice(0, 10) };
      }
      if (predictionPeriod === "tomorrow") {
        const d = new Date(today); d.setDate(today.getDate() + 1);
        return { prediction_date: d.toISOString().slice(0, 10) };
      }
      if (predictionPeriod === "nextWeek") {
        const start = new Date(today); start.setDate(today.getDate() + 1);
        const end = new Date(today); end.setDate(today.getDate() + 7);
        return {
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10)
        };
      }
      return {};
    }

    useEffect(() => {
      if (!latestDate) return;
      setRevenueLoading(true);
    
      const params = getRevenuePeriodParams(predictionPeriod, latestDate);
      const query = new URLSearchParams(params as any).toString();
    
      fetch(`/api/forecast/revenue_summary?${query}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch revenue");
          return res.json();
        })
        .then(data => {
          setRevenue(typeof data.expectedRevenue === 'number' ? data.expectedRevenue : 0);
        })
        .catch(() => setRevenue(null))
        .finally(() => setRevenueLoading(false));
    }, [predictionPeriod, latestDate]);
    
    useEffect(() => {
      setCategorySalesLoading(true);
      fetch(`/api/forecast/category_distribution?period=${predictionPeriod}`)
        .then(res => res.json())
        .then(setCategorySales)
        .catch(() => setCategorySales([]))
        .finally(() => setCategorySalesLoading(false));
    }, [predictionPeriod]);

    useEffect(() => {
      fetch("https://date.nager.at/api/v3/PublicHolidays/2025/US")
        .then(res => res.json())
        .then(data => setHolidays(data))
        .catch(err => console.error("Holiday fetch failed", err))
    }, [])
    
    useEffect(() => {
      // logic similar to topItems
      if (performanceTab === "week" && !latestDate) return;
    
      let params: { start_date?: string; end_date?: string; limit?: number } = {};
    
      if (performanceTab === "week" && latestDate) {
        params.limit = 5;
        params.end_date = latestDate;
        const end = new Date(latestDate);
        const start = new Date(end);
        start.setDate(end.getDate() - 5);
        params.start_date = format(start, "yyyy-MM-dd");
      } else if (performanceTab === "custom") {
        if (dateRange.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");
      }
      setBottomItemsLoading(true);
      getBottomItemsSold(params)
        .then(setBottomItems)
        .catch(e => setBottomItemsError(e.message || "Failed to fetch bottom items"))
        .finally(() => setBottomItemsLoading(false));
    }, [performanceTab, dateRange, latestDate]);





    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
          </div>

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

          {/* Today's Forecasts Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">{getPredictionTitle()}</h2>
            </div>

            {/* {predictionPeriod === 'nextWeek' && (
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
            )} */}

            {/* First Row: Sales Bar Chart & Category Pie Chart */}
            <div className="mb-6 flex flex-col md:flex-row gap-6">
              {/* Bar Chart - left */}
              <div className="w-full md:w-1/2">
                <Card className="shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <span>Complete Product Sales Forecast</span>
                    </CardTitle>
                    <CardDescription>
                      {predictionPeriod === 'nextWeek'
                        ? 'Expected sales for all products next week'
                        : `Expected sales for all products ${predictionPeriod}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div>Loading...</div>
                    ) : products.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">No forecast data available.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={products}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-30}
                            textAnchor="end"
                            height={80}
                            tickFormatter={name => name.length > 12 ? name.slice(0, 12) + '…' : name}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="expected" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Pie Chart - right */}
              <div className="w-full md:w-1/2">
                <Card className="shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      <span>Category Sales Distribution</span>
                    </CardTitle>
                    <CardDescription>
                      {predictionPeriod === 'nextWeek'
                        ? 'Next week category sales ratio'
                        : `Category sales for ${predictionPeriod}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categorySalesLoading ? (
                      <div>Loading...</div>
                    ) : categorySales.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">No category data available.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={categorySales}
                            dataKey="total_sales"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label={({ category, percent }) =>
                              `${category} (${(percent * 100).toFixed(1)}%)`
                            }
                          >
                            {categorySales.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={value => value.toLocaleString()} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Second Row: Stock Alerts, Weather, Traffic, and Revenue */}
            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Revenue Forecast</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 mb-1">
                      {revenueLoading ? 'Loading...' :
                        revenue !== null ? `$${revenue.toLocaleString()}` : '--'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {predictionPeriod === 'nextWeek' ? 'expected next week' : `expected ${predictionPeriod}`}
                    </p>
                    <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                      +18% vs avg
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xs text-gray-900">
                    <CalendarDays className="w-4 h-4 text-red-600" />
                    <span>{format(today, "MMMM yyyy")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 text-center text-sm text-gray-700">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                      <div key={d} className="font-medium">{d}</div>
                    ))}
                    {Array(getDay(startOfMonth(today))).fill(null).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {monthDays.map(date => {
                const isToday = isSameDay(date, new Date())

                return (
                  <div
                    key={date.toISOString()}
                    className={`rounded-md text-sm text-center ${
                      isToday ? "bg-blue-600 text-white font-bold" : "text-gray-800"
                    }`}
                    title={isToday ? "Today" : undefined}
                  >
                    {format(date, "d")}
                  </div>
                )
              })}
                  </div>
                </CardContent>
              </Card>

              {/* Store Location */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm text-gray-900">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Store Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mt-4">
                    <p className="text-2xl font-bold text-red-600 mb-1">{selectedCity.name}</p> 
                    <p className="text-xs text-gray-600 mb-4">Primary Store Location</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center space-x-2 text-sm">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span>Weather Impact</span>
                    </CardTitle>
                    <Select
                      value={selectedCity.name}
                      onValueChange={(name) => {
                        const found = cities.find((c) => c.name === name);
                        if (found) setSelectedCity(found);
                      }}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    {weather ? getWeatherIcon(weather.code) : <Sun className="w-6 h-6 text-white" />}
                  </div>
                    <p className="text-lg font-bold">
                      {weather ? `${weather.temperature}°F` : "Loading..."}
                    </p>
                    <p className="text-xs text-gray-600">{weather ? weather.condition : "Fetching..."}</p>
                    {/* <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+15% traffic</Badge> */}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Top sellers this week*/}
          <div className="mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Top Selling Products</span>
                </CardTitle>
                <CardDescription>
                  Most sold products last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* LineChart */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={topItems}
                      margin={{ left: 48, right: 48, top: 24, bottom: 56 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="item_name"
                        interval={0} // force all ticks to show
                        tick={({ x, y, payload }) => {
                          const name = payload.value || "";
                          const show = name.length > 10 ? name.slice(0, 10) + "..." : name;
                          return (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="end"
                              fontSize={14}
                              fill="#666"
                              transform={`rotate(-35,${x},${y + 10})`}
                              style={{ pointerEvents: "none" }}
                            >
                              {show}
                            </text>
                          );
                        }}
                      />
                      <YAxis tick={{ fontSize: 14 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total_sold"
                        stroke="#22c3aa"
                        strokeWidth={4}
                        dot={{
                          r: 8,
                          fill: "#22c3aa",
                          stroke: "#22c3aa",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 10,
                          fill: "#22c3aa",
                          stroke: "#22c3aa",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Performers List  */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold text-green-700">Top Performers - Last Week</h3>
                  </div>
                  {topItems.map((item, index) => (
                    <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-green-900">{item.item_name || item.item_nbr}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-900">
                          {item.total_sold} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom sellers this week */}
          <div className="mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Low Selling Products</span>
                </CardTitle>
                <CardDescription>
                  Lowest sold products last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Graph: Least Selling Products Trend */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={bottomItems}
                      margin={{ top: 24, right: 24, left: 24, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="item_name"
                        interval={0}
                        tick={({ x, y, payload }) => {
                          const name = payload.value || "";
                          const show = name.length > 10 ? name.slice(0, 10) + "..." : name;
                          return (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="end"
                              fontSize={12}
                              fill="#666"
                              transform={`rotate(-35,${x},${y + 10})`}
                              style={{ pointerEvents: "none" }}
                            >
                              {show}
                            </text>
                          );
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="total_sold"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                </div>

                {/* Lowest Performers List */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold text-red-700">Lowest Performers - Last Week</h3>
                  </div>
                  {bottomItems.map((item, index) => (
                    <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-red-900">{item.item_name || item.item_nbr}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-900">
                          {item.total_sold} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    );
  };

  export default Dashboard;