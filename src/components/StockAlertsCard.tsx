
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const StockAlertsCard = () => {
  const stockAlerts = [
    { name: "Milk", stock: 8, status: "critical" },
    { name: "Bread", stock: 15, status: "low" },
    { name: "Eggs", stock: 12, status: "low" },
    { name: "Bananas", stock: 45, status: "safe" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Stock Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stockAlerts.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'secondary' : 'default'}>
                {item.stock} left
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlertsCard;
