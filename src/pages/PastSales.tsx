
import Navigation from "@/components/Navigation";
import PastPerformanceSection from "@/components/PastPerformanceSection";

const PastSales = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Past Sales Performance</h1>
          <p className="text-gray-600">Analyze your historical sales data and performance metrics.</p>
        </div>

        <PastPerformanceSection />
      </div>
    </div>
  );
};

export default PastSales;
