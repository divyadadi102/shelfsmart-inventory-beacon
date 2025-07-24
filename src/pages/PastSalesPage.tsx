import Navigation from "@/components/Navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { getPastPerformance, getDailyTotalRevenue, getDailyTotalUnitSales, getTopItemsSold } from "@/lib/api";
import { SalesRecord, DailyRevenue, DailyUnitSales, TopItem } from "@/lib/api";
import { useNavigation } from "react-day-picker";
import { CaptionProps } from "react-day-picker";
import { useMemo } from "react";  
import { getDailyTotalProfit } from "../lib/api";

const CustomCaption = (props: CaptionProps) => {
  const { goToMonth } = useNavigation();
  const { displayMonth } = props;

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 30 }, (_, i) => currentYear - 15 + i),
    [currentYear]
  );

  const months = useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    []
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    goToMonth(new Date(displayMonth.getFullYear(), newMonth));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    goToMonth(new Date(newYear, displayMonth.getMonth()));
  };

  return (
    <div className="flex justify-center space-x-2 px-4 py-2">
      <select
        className="border rounded px-2 py-1 text-sm"
        value={displayMonth.getMonth()}
        onChange={handleMonthChange}
      >
        {months.map((month, i) => (
          <option key={month} value={i}>{month}</option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={displayMonth.getFullYear()}
        onChange={handleYearChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};



type DateRange = { from: Date | undefined; to: Date | undefined };


const PastSalesPage = () => {
  const [dailyProfit, setDailyProfit] = useState<{ date: string; profit: number }[]>([]);
  const [dailyProfitLoading, setDailyProfitLoading] = useState(false);
  const [dailyProfitError, setDailyProfitError] = useState<string | null>(null);

  // 动态控制周期长度
  function getPeriodLength(tab: string) {
    if (tab === "week") return 7;
    if (tab === "month") return 30;
    if (tab === "year") return 365;
    return 7;
  }

  const [latestDate, setLatestDate] = useState<string | null>(null);
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

  // 保证为14天，且最新日期在前
  const revenueData = dailyRevenue.slice(0, 14); // 降序
  const unitSalesData = dailyUnitSales.slice(0, 14);

  // 拆分两周数据
  const thisWeekRevenue = revenueData.slice(0, 7).reduce((sum, row) => sum + row.revenue, 0);
  const prevWeekRevenue = revenueData.slice(7, 14).reduce((sum, row) => sum + row.revenue, 0);

  const thisWeekUnitSales = unitSalesData.slice(0, 7).reduce((sum, row) => sum + row.unit_sales, 0);
  const prevWeekUnitSales = unitSalesData.slice(7, 14).reduce((sum, row) => sum + row.unit_sales, 0);

  // 环比百分比
  const weekRevenueRatio =
    prevWeekRevenue === 0 ? 0 : ((thisWeekRevenue - prevWeekRevenue) / prevWeekRevenue * 100);
  const weekRevenueRatioDisplay =
    (weekRevenueRatio > 0 ? '+' : '') + weekRevenueRatio.toFixed(1) + '%';

  const weekItemsSoldRatio =
    prevWeekUnitSales === 0 ? 0 : ((thisWeekUnitSales - prevWeekUnitSales) / prevWeekUnitSales * 100);
  const weekItemsSoldRatioDisplay =
    (weekItemsSoldRatio > 0 ? '+' : '') + weekItemsSoldRatio.toFixed(1) + '%';

  const weekTotalRevenueDisplay = `$${thisWeekRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const weekTotalItemsSoldDisplay = thisWeekUnitSales.toLocaleString();

  const monthRevenueData = dailyRevenue.slice(0, 60); // 取60天数据
  const thisMonthRevenue = monthRevenueData.slice(0, 30).reduce((sum, row) => sum + row.revenue, 0);
  const prevMonthRevenue = monthRevenueData.slice(30, 60).reduce((sum, row) => sum + row.revenue, 0);
  const monthRevenueRatio =
    prevMonthRevenue === 0 ? 0 : ((thisMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100);
  const monthRevenueRatioDisplay =
    (monthRevenueRatio > 0 ? '+' : '') + monthRevenueRatio.toFixed(1) + '% vs last month';
  const monthTotalRevenueDisplay = `$${thisMonthRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const monthUnitSalesData = dailyUnitSales.slice(0, 60);
  const thisMonthUnitSales = monthUnitSalesData.slice(0, 30).reduce((sum, row) => sum + row.unit_sales, 0);
  const prevMonthUnitSales = monthUnitSalesData.slice(30, 60).reduce((sum, row) => sum + row.unit_sales, 0);
  const monthItemsSoldRatio =
    prevMonthUnitSales === 0 ? 0 : ((thisMonthUnitSales - prevMonthUnitSales) / prevMonthUnitSales * 100);
  const monthItemsSoldRatioDisplay =
    (monthItemsSoldRatio > 0 ? '+' : '') + monthItemsSoldRatio.toFixed(1) + '% vs last month';
  const monthTotalItemsSoldDisplay = thisMonthUnitSales.toLocaleString();



  useEffect(() => {
    setPerformanceLoading(true);
    getPastPerformance({ limit: 7 }) // Can be replaced with the time range parameters you need.
      .then(setPastPerformance)
      .catch(err => setPerformanceError(err.message || "Failed to fetch data"))
      .finally(() => setPerformanceLoading(false));
  }, []);

  useEffect(() => {
    let params: { start_date?: string; end_date?: string; limit?: number } = {};
    if (performanceTab === "week") {
      params.limit = 14;
    } else if (performanceTab === "month") {
      params.limit = 60;
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
      params.limit = 60;
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
    // 1. Only send requests when latestDate is valid.
    if (performanceTab === "week" && !latestDate) return;
  
    let params: { start_date?: string; end_date?: string; limit?: number } = {};
  
    if (performanceTab === "week" && latestDate) {
      params.limit = 5;
      params.end_date = latestDate;
      // Use the database's latestDate to go back 5 days.
      const end = new Date(latestDate);
      const start = new Date(end);
      start.setDate(end.getDate() - 5); // 7 days in total
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
    fetch("/api/sales/latest_date")
      .then(res => res.json())
      .then(data => setLatestDate(data.latest_date));
  }, []);

  // Profit data
  useEffect(() => {
    let params: { start_date?: string; end_date?: string; limit?: number } = {};
    const periodLength = getPeriodLength(performanceTab);

    if (performanceTab === "week" || performanceTab === "month" || performanceTab === "year") {
      params.limit = periodLength * 2; // Current period + previous period, consistent with the revenue logic.
    } else if (performanceTab === "custom") {
      if (dateRange.from) params.start_date = format(dateRange.from, "yyyy-MM-dd");
      if (dateRange.to) params.end_date = format(dateRange.to, "yyyy-MM-dd");
    }
    setDailyProfitLoading(true);
    getDailyTotalProfit(params)
      .then(setDailyProfit)
      .catch(e => setDailyProfitError(e.message || "Failed to fetch profit"))
      .finally(() => setDailyProfitLoading(false));
  }, [performanceTab, dateRange]);


  const periodLength = getPeriodLength(performanceTab);
  // profitData displayed in descending order by time (most recent first)
  const profitData = dailyProfit.slice(0, performanceTab === "custom" ? dailyProfit.length : periodLength * 2);

  let thisPeriodProfit = 0;
  let prevPeriodProfit = 0;
  if (performanceTab === "custom") {
    thisPeriodProfit = profitData.reduce((sum, row) => sum + (row.profit ?? 0), 0);
  } else {
    thisPeriodProfit = profitData.slice(0, periodLength).reduce((sum, row) => sum + (row.profit ?? 0), 0);
    prevPeriodProfit = profitData.slice(periodLength, periodLength * 2).reduce((sum, row) => sum + (row.profit ?? 0), 0);
  }
  const profitRatio = prevPeriodProfit === 0 ? 0 : ((thisPeriodProfit - prevPeriodProfit) / prevPeriodProfit * 100);

  const periodName = performanceTab === "week"
    ? "Week"
    : performanceTab === "month"
    ? "Month"
    : performanceTab === "year"
    ? "Year"
    : "Custom";
  const totalProfitDisplay = `$${thisPeriodProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const profitRatioDisplay =
    performanceTab === "custom"
      ? ""
      : (profitRatio > 0 ? "+" : "") + profitRatio.toFixed(1) + "% vs last " + periodName.toLowerCase();
  
    // No need to use prevPeriodProfit and profitRatio
    const yearProfitDisplay = `$${thisPeriodProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      

  










  
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
      setPerformanceTab('custom');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Past Performance Section - moved to bottom */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Past Performance</h2>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime() ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  components={{ Caption: CustomCaption }}

                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Range Tabs */}
          <Tabs 
            // defaultValue="week"
            value={performanceTab}
            onValueChange={v => setPerformanceTab(v as typeof performanceTab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="week">Past Week</TabsTrigger>
              <TabsTrigger value="month">Past Month</TabsTrigger>
              <TabsTrigger value="year">Past Year</TabsTrigger>
              <TabsTrigger value="custom">Custom Range</TabsTrigger>
            </TabsList>
            
            <TabsContent value="week" className="space-y-6">
              {/* Revenue and Customer Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Week Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">{weekTotalRevenueDisplay}</p>
                    <p className="text-sm text-gray-600">{weekRevenueRatioDisplay} vs last week</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{periodName} Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {dailyProfitLoading ? "—" : totalProfitDisplay}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dailyProfitLoading || performanceTab === "custom"
                        ? ""
                        : profitRatioDisplay}
                    </p>
                    {dailyProfitError && <p className="text-sm text-red-500">{dailyProfitError}</p>}
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">2,690</p>
                    <p className="text-sm text-gray-600">+1.1% vs last week</p>
                  </CardContent>
                </Card>

                {/* <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg. Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">$19.48</p>
                    <p className="text-sm text-gray-600">+2.8% vs last week</p>
                  </CardContent>
                </Card> */}

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Items Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">{weekTotalItemsSoldDisplay}</p>
                    <p className="text-sm text-gray-600">{weekItemsSoldRatioDisplay} vs last week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Graph and Best Sellers */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Daily Performance</CardTitle>
                    <CardDescription>Revenue this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dailyRevenueLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : dailyRevenueError ? (
                      <div className="text-red-500">{dailyRevenueError}</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[...dailyRevenue].slice(0, 7).reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />

                          <YAxis />
                          <Tooltip formatter={value => `$${Number(value).toFixed(2)}`} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                            name="Revenue"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span>Top Sellers This Week</span>
                    </CardTitle>
                    <CardDescription>Most sold products in selected range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(!latestDate && performanceTab === "week") || topItemsLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : topItemsError ? (
                      <div className="text-red-500">{topItemsError}</div>
                    ) : (
                      <div className="space-y-3">
                        {topItems.map((item, index) => (
                          <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium">
                                {item.item_name || item.item_nbr}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{item.total_sold} units</span>
                              {/* 可选：category、趋势等 */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* {Past Month Performance} */}
            <TabsContent value="month" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Month Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {monthTotalRevenueDisplay}
                  </p>
                  <p className="text-sm text-gray-600">{monthRevenueRatioDisplay}</p>
                </CardContent>
              </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Month Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {dailyProfitLoading ? "—" : totalProfitDisplay}
                    </p>
                    <p className="text-sm text-gray-600">
                      {dailyProfitLoading ? "" : profitRatioDisplay}
                    </p>
                    {dailyProfitError && <p className="text-sm text-red-500">{dailyProfitError}</p>}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">13,253</p>
                    <p className="text-sm text-gray-600">+0.7% vs last month</p>
                  </CardContent>
                </Card>

                {/* <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg. Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">$21.36</p>
                    <p className="text-sm text-gray-600">+1.4% vs last month</p>
                  </CardContent>
                </Card> */}

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Items Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {monthTotalItemsSoldDisplay}
                    </p>
                    <p className="text-sm text-gray-600">{monthItemsSoldRatioDisplay}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                    <CardDescription>Total revenue over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dailyRevenueLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : dailyRevenueError ? (
                      <div className="text-red-500">{dailyRevenueError}</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[...dailyRevenue].reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            interval={3} // 每4天一个刻度
                            angle={-15}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip formatter={value => `$${Number(value).toFixed(2)}`} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={false}
                            name="Revenue"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span>Top Sellers This Month</span>
                    </CardTitle>
                    <CardDescription>Most sold products in the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topItemsLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : topItemsError ? (
                      <div className="text-red-500">{topItemsError}</div>
                    ) : (
                      <div className="space-y-3">
                        {topItems.map((item, index) => (
                          <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium">
                                {item.item_name || item.item_nbr}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{item.total_sold} units</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            {/* Past year Performance */}
            <TabsContent value="year" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Year Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      ${dailyRevenue.reduce((sum, row) => sum + row.revenue, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">Total revenue this year</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Year Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {dailyProfitLoading ? "—" : yearProfitDisplay}
                    </p>
                    <p className="text-sm text-gray-600">Total profit this year</p>
                    {dailyProfitError && <p className="text-sm text-red-500">{dailyProfitError}</p>}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">64,709</p>
                    <p className="text-sm text-gray-600">Total customers this year</p>
                  </CardContent>
                </Card>

                {/* <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg. Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">$22.74</p>
                    <p className="text-sm text-gray-600">+1.3% vs last year</p>
                  </CardContent>
                </Card> */}

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Items Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {dailyUnitSales.reduce((sum, row) => sum + row.unit_sales, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total items sold this year</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Yearly Revenue Trend</CardTitle>
                    <CardDescription>Total revenue over the past 12 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dailyRevenueLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : dailyRevenueError ? (
                      <div className="text-red-500">{dailyRevenueError}</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[...dailyRevenue].reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            interval={29} // roughly 1 tick per month
                            angle={-15}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip formatter={value => `$${Number(value).toFixed(2)}`} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={false}
                            name="Revenue"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span>Top Sellers This Year</span>
                    </CardTitle>
                    <CardDescription>Most sold products in the past 12 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topItemsLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : topItemsError ? (
                      <div className="text-red-500">{topItemsError}</div>
                    ) : (
                      <div className="space-y-3">
                        {topItems.map((item, index) => (
                          <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium">
                                {item.item_name || item.item_nbr}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{item.total_sold} units</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


            <TabsContent value="custom" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Range Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      ${dailyRevenue.reduce((sum, row) => sum + row.revenue, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">Total in selected range</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Range Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {dailyProfitLoading ? "—" : `$${thisPeriodProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    </p>
                    <p className="text-sm text-gray-600">Total in selected range</p>
                    {dailyProfitError && <p className="text-sm text-red-500">{dailyProfitError}</p>}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Range Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">N/A</p>
                    <p className="text-sm text-gray-600">Total in selected range</p>
                  </CardContent>
                </Card>

                {/* <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg. Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">N/A</p>
                    <p className="text-sm text-gray-600">Add calculation logic if needed</p>
                  </CardContent>
                </Card> */}

                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Range Items Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {dailyUnitSales.reduce((sum, row) => sum + row.unit_sales, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total in selected range</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Trend (Custom Range)</CardTitle>
                    <CardDescription>Total revenue between selected dates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dailyRevenueLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : dailyRevenueError ? (
                      <div className="text-red-500">{dailyRevenueError}</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[...dailyRevenue].reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            interval={Math.ceil(dailyRevenue.length / 8)}
                            angle={-15}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <Tooltip formatter={value => `$${Number(value).toFixed(2)}`} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={false}
                            name="Revenue"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span>Top Sellers (Custom Range)</span>
                    </CardTitle>
                    <CardDescription>Most sold items in selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topItemsLoading ? (
                      <div className="text-gray-500">Loading...</div>
                    ) : topItemsError ? (
                      <div className="text-red-500">{topItemsError}</div>
                    ) : (
                      <div className="space-y-3">
                        {topItems.map((item, index) => (
                          <div key={item.item_nbr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium">
                                {item.item_name || item.item_nbr}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{item.total_sold} units</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PastSalesPage;
