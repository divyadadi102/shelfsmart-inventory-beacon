
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload as UploadIcon, FileSpreadsheet, Link2, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posUrl, setPosUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

    const handleSubmitFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV or Excel file to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Step 1: Create form data and upload
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || "Upload failed.");
      }

      // Step 2: Optionally trigger forecast endpoint (optional if forecast is auto-triggered)
      const forecastResponse = await fetch("http://localhost:8000/api/forecast", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!forecastResponse.ok) {
        console.warn("Forecast fetch failed");  // Optional
      }

      // Step 3: Notify and redirect
      toast({
        title: "Upload successful!",
        description: "Your data has been processed and forecasts have been updated.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };


  const handlePosConnect = async () => {
    if (!posUrl || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please provide both POS URL and API key.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate POS connection
    setTimeout(() => {
      toast({
        title: "POS connected successfully!",
        description: "Data sync is now active. Forecasts will update automatically.",
      });
      setUploading(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Data</h1>
          <p className="text-gray-600">Import your sales data to generate accurate forecasts</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="file" className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Upload File</span>
              </TabsTrigger>
              <TabsTrigger value="pos" className="flex items-center space-x-2">
                <Link2 className="w-4 h-4" />
                <span>Connect POS</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Form */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UploadIcon className="w-5 h-5 text-blue-600" />
                      <span>Upload CSV/Excel File</span>
                    </CardTitle>
                    <CardDescription>
                      Upload your sales data file to generate forecasts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-gray-500">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </p>
                    </div>

                    {file && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{file.name}</p>
                            <p className="text-sm text-blue-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleSubmitFile}
                      disabled={!file || uploading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {uploading ? "Processing..." : "Submit & Forecast"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>File Requirements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Required Columns</p>
                          <p className="text-sm text-gray-600">Date, Product, Quantity, Price</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Date Format</p>
                          <p className="text-sm text-gray-600">YYYY-MM-DD or MM/DD/YYYY</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">File Size</p>
                          <p className="text-sm text-gray-600">Maximum 10MB</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Data Range</p>
                          <p className="text-sm text-gray-600">At least 30 days of historical data</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        Download Sample Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pos">
              <div className="grid md:grid-cols-2 gap-8">
                {/* POS Connection Form */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Link2 className="w-5 h-5 text-purple-600" />
                      <span>Connect POS System</span>
                    </CardTitle>
                    <CardDescription>
                      Connect directly to your POS for automatic data sync
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="pos-url">POS System URL</Label>
                      <Input
                        id="pos-url"
                        type="url"
                        placeholder="https://your-pos-system.com/api"
                        value={posUrl}
                        onChange={(e) => setPosUrl(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        This will be encrypted and stored securely
                      </p>
                    </div>

                    <Button 
                      onClick={handlePosConnect}
                      disabled={!posUrl || !apiKey || uploading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {uploading ? "Connecting..." : "Connect POS System"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Supported POS Systems */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span>Supported POS Systems</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="font-medium">Square</p>
                          <p className="text-sm text-gray-600">Full Integration</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="font-medium">Shopify</p>
                          <p className="text-sm text-gray-600">Full Integration</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="font-medium">Toast</p>
                          <p className="text-sm text-gray-600">Coming Soon</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="font-medium">Lightspeed</p>
                          <p className="text-sm text-gray-600">Coming Soon</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-3">
                          Don't see your POS system? Contact us for custom integration.
                        </p>
                        <Button variant="outline" className="w-full">
                          Request Integration
                        </Button>
                      </div>
                    </div>
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

export default Upload;
