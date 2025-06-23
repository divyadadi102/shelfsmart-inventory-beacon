
import Navigation from "@/components/Navigation";
import InventoryRecommendations from "@/components/InventoryRecommendations";
import ForecastSection from "@/components/ForecastSection";
import PastPerformanceSection from "@/components/PastPerformanceSection";

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

        {/* Inventory Recommendations Section */}
        <div className="mb-12">
          <InventoryRecommendations />
        </div>

        {/* Past Performance Section */}
        <PastPerformanceSection />
      </div>
    </div>
  );
};

export default Dashboard;
