import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload, AlertTriangle, Package, LogOut, TrendingUp, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchCurrentUser } from "@/hooks/useAuth"; // <- import your fetch function

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setBusinessName(user.business_name || "");
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/summary", label: "Summary", icon: FileText },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/alerts", label: "Alerts", icon: AlertTriangle },
    { path: "/products", label: "Products", icon: Package },
    { path: "/past-sales", label: "Past Sales", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShelfSmart
              </span>
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center space-x-2 ${
                        isActive 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {businessName && (
              <span className="text-sm font-medium text-gray-700">
                {businessName}
              </span>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
