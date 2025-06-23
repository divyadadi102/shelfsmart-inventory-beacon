
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun } from "lucide-react";

const WeatherCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Sun className="w-4 h-4 text-yellow-500" />
          <span>Weather Impact</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold">72°F</p>
          <p className="text-xs text-gray-600">Sunny</p>
          <Badge className="mt-1 bg-green-100 text-green-800 text-xs">+15% traffic</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
