
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, AlertTriangle, Upload, TrendingUp, Target, Bell, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* <img src="/favicon.ico" alt="Logo" className="w-8 h-8 rounded-lg" /> */}
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />

          {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div> */}
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ShelfSmart
          </span>
        </div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="outline" className="hover:bg-blue-50">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Smart Inventory Forecasting
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Predict demand, optimize stock levels, and boost profits with AI-powered analytics. 
          Never run out of bestsellers or overstock slow movers again.
        </p>
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-bold text-blue-600">90 days free trial</span> • Then just $25/month
          </p>
          <p className="text-sm text-gray-500">No setup fees • Cancel anytime</p>
        </div>
        <Link to="/register">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
            Start Your 90-Day Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Everything You Need to Stay Ahead
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Smart Forecasting</CardTitle>
              <CardDescription>
                AI-powered predictions based on historical data, weather, and market trends
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Intelligent Alerts</CardTitle>
              <CardDescription>
                Get notified before you run out of stock or accumulate excess inventory
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Easy Integration</CardTitle>
              <CardDescription>
                Upload CSV files or connect directly to your POS system
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* User Journey Section */}
      <div className="container mx-auto px-4 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Get started in minutes and transform your inventory management with our simple 4-step process
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload CSV</h3>
            <p className="text-gray-600 text-sm">
              Simply upload your sales data or connect your POS system to get started
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Forecast</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes patterns and generates accurate demand forecasts for your products
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Smart Alerts</h3>
            <p className="text-gray-600 text-sm">
              Receive real-time notifications about stock levels and reorder recommendations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Make Decisions</h3>
            <p className="text-gray-600 text-sm">
              Act on insights to optimize inventory, reduce costs, and maximize profits
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of retailers who trust ShelfSmart for their forecasting needs
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Your 90-Day Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />

            {/* <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-md flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div> */}
            <span className="text-xl font-bold">ShelfSmart</span>
          </div>
          <p className="text-gray-400">© 2025 ShelfSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
