export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("access_token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    if (!response.ok) {
      throw new Error("API request failed");
    }
  
    return response.json();
  };
  
export type SalesRecord = {
  id: number;
  date: string; // ISO字符串，如"2014-05-01"
  store_nbr: number;
  item_nbr: number;
  unit_sales: number;
  onpromotion?: boolean;
  category?: string;
  holiday?: number;
  item_class?: number;
  perishable?: number;
  price?: number;
};

export async function getPastPerformance(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/past_performance?${urlParams}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch sales data");
  }
  const data = await response.json();
  return data as SalesRecord[];
}

export type DailyRevenue = {
  date: string;
  revenue: number;
};

export type DailyCategoryRevenue = {
  date: string;
  category: string;
  revenue: number;
};

export async function getDailyTotalRevenue(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/daily_total_revenue?${urlParams}`);
  if (!response.ok) throw new Error("Failed to fetch total revenue");
  return await response.json() as DailyRevenue[];
}

export async function getDailyCategoryRevenue(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/daily_category_revenue?${urlParams}`);
  if (!response.ok) throw new Error("Failed to fetch category revenue");
  return await response.json() as DailyCategoryRevenue[];
}

export type DailyUnitSales = {
  date: string;
  unit_sales: number;
};

export async function getDailyTotalUnitSales(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/daily_total_unit_sales?${urlParams}`);
  if (!response.ok) throw new Error("Failed to fetch unit sales");
  return await response.json() as DailyUnitSales[];
}

export type TopItem = {
  item_nbr: number;
  item_name: string;     // 新增
  category?: string;
  total_sold: number;
};


export async function getTopItemsSold(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/top_items_sold?${urlParams}`);
  if (!response.ok) throw new Error("Failed to fetch top items");
  return await response.json() as TopItem[];
}

export type DailyProfit = {
  date: string;
  profit: number;
};

export async function getDailyTotalProfit(params: { start_date?: string; end_date?: string; limit?: number } = {}) {
  const urlParams = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/sales/daily_total_profit?${urlParams}`);
  if (!response.ok) throw new Error("Failed to fetch profit");
  return await response.json() as DailyProfit[];
}

