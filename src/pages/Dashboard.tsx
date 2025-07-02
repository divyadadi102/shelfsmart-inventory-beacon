
import Navigation from "@/components/Navigation";
import ForecastSection from "@/components/ForecastSection";
import LowSalesProductsSection from "@/components/LowSalesProductsSection";
import TopSellingProductsSection from "@/components/TopSellingProductsSection";
import LowPurchaseProductsSection from "@/components/LowPurchaseProductsSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
        </div>

        {/* Forecasts Section */}
        <ForecastSection />

        {/* Top Selling Products Section */}
        <div className="mb-8">
          <TopSellingProductsSection />
        </div>

        {/* Low Purchase Products Section */}
        <div className="mb-8">
          <LowPurchaseProductsSection />
        </div>

        {/* Low Sales Products Section */}
        <div className="mb-12">
          <LowSalesProductsSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
