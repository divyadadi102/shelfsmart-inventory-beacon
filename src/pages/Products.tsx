

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Upload, Edit, Trash2, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import AddProductDialog from "@/components/AddProductDialog";
import EditProductDialog from "@/components/EditProductDialog";
import CSVUploadDialog from "@/components/CSVUploadDialog";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  status: 'critical' | 'low' | 'safe';
  lastUpdated: string;
}

const Products = () => {
  const { toast } = useToast();
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const determineStatus = (quantity: number): 'critical' | 'low' | 'safe' => {
    if (quantity <= 20) return 'critical';
    if (quantity <= 50) return 'low';
    return 'safe';
  };

  const handleAddCategory = async (name: string, description?: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) throw new Error("Failed to add category");

    const newCategory = await response.json();
    setCategories(prev => [...prev, newCategory]);

    toast({
      title: "Category added",
      description: `${name} category has been created successfully.`,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add category.",
      variant: "destructive",
    });
    console.error(error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("http://localhost:8000/api/categories"),
          fetch("http://localhost:8000/api/stock"),
        ]);
        const categories = await catRes.json();
        const stock = await prodRes.json();

        const enrichedStock = stock.map((p: any) => {
          const category = categories.find((c: any) => c.id === p.category_id);
          return {
            id: p.id.toString(),
            name: p.name,
            categoryId: p.category_id.toString(),
            categoryName: category?.name || '',
            quantity: p.quantity,
            costPrice: p.cost_price,
            sellingPrice: p.selling_price,
            status: determineStatus(p.quantity),
            lastUpdated: new Date(p.last_updated).toLocaleString(),
          };
        });

        setCategories(categories);
        setProducts(enrichedStock);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your inventory products and categories</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setAddCategoryOpen(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" /> <span>Add Category</span>
          </Button>
          <Button onClick={() => setAddProductOpen(true)} className="flex items-center space-x-2">
            <Package className="w-4 h-4" /> <span>Add Product</span>
          </Button>
          <Button onClick={() => setCsvUploadOpen(true)} variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" /> <span>Upload CSV</span>
          </Button>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" /> <span>Categories</span>
            </CardTitle>
            <CardDescription>Filter products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)} className="h-12 px-4">
                <span className="font-medium">All ({products.length})</span>
              </Button>
              {categories.map((category: Category) => {
                  const categoryProducts = products.filter(p => String(p.categoryId) === String(category.id));
                  return (
                    <div key={category.id} className="relative group">
                      <Button
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className="h-12 px-4 pr-8"
                      >
                        <span className="font-medium">{category.name} ({categoryProducts.length})</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {}}
                        className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" /> <span>Products Inventory</span>
            </CardTitle>
            <CardDescription>
              {selectedCategory ? `${products.filter(p => String(p.categoryId) === String(selectedCategory)).length} products in ${categories.find(c => c.id === selectedCategory)?.name}` : `All products in your inventory (${products.length} total)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.filter(p => !selectedCategory || String(p.categoryId) === String(selectedCategory)).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.categoryName}</p>
                      <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                        <span>Cost: ${product.costPrice.toFixed(2)}</span>
                        <span>Price: ${product.sellingPrice.toFixed(2)}</span>
                        {/*<span>Margin: {(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1)}%</span>*/}
                        <span>Margin: {product.costPrice && product.sellingPrice? `${(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1)}%`: "N/A"} </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{product.quantity} units</p>
                      <p className="text-sm text-gray-500">Updated {product.lastUpdated}</p>
                    </div>
                    <Badge className={`${getStatusColor(product.status)} font-medium capitalize`}>
                      {product.status}
                    </Badge>
                    <div className="flex space-x-2">
                      {/*<Button variant="outline" size="sm" onClick={() => {}} className="flex items-center space-x-1">
                        <Edit className="w-3 h-3" /> <span>Edit</span>
                      </Button>*/}
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditProductOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" /> <span>Edit</span>
                        </Button>
                      {/*<Button variant="outline" size="sm" onClick={() => {}} className="flex items-center space-x-1 text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>*/}
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this product?")) {
                              try {
                                await fetch(`http://localhost:8000/api/stock/${product.id}`, { method: "DELETE" });
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                              } catch (err) {
                                console.error("Failed to delete product", err);
                              }
                            }
                          }}
                        >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/*<AddCategoryDialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen} onAdd={() => {}} />*/}
      <AddCategoryDialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen} onAdd={handleAddCategory} />
      <AddProductDialog
      open={addProductOpen}
      onOpenChange={setAddProductOpen}
      categories={categories}
      onAdd={async (productData) => {
        try {
          const response = await fetch("http://localhost:8000/api/stock", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: productData.name,
              category_id: parseInt(productData.categoryId),
              quantity: productData.quantity,
              cost_price: productData.costPrice,
              selling_price: productData.sellingPrice,
            }),
          });

          if (!response.ok) throw new Error("Failed to add product");

          const savedProduct = await response.json();

          setProducts((prev) => {
  const exists = prev.find(
    (p) => p.name === savedProduct.name && p.categoryId === savedProduct.category_id.toString()
  );

  if (exists) {
    return prev.map((p) => {
      if (p.name === savedProduct.name && p.categoryId === savedProduct.category_id.toString()) {
        const newQuantity = p.quantity + savedProduct.quantity;
        return {
          ...p,
          quantity: newQuantity,
          lastUpdated: new Date(savedProduct.last_updated).toLocaleString(),
          status: determineStatus(newQuantity),
        };
      }
      return p;
    });
  } else {
    const newProduct = {
      ...savedProduct,
      id: savedProduct.id.toString(),
      categoryId: savedProduct.category_id.toString(),
      categoryName:
        categories.find((c) => c.id.toString() === savedProduct.category_id.toString())?.name || "",
      status: determineStatus(savedProduct.quantity),
      lastUpdated: new Date(savedProduct.last_updated).toLocaleString(),
    };
    return [...prev, newProduct];
  }
});
        } catch (error) {
          console.error("Error adding product:", error);
        }
      }}
    />
    <EditProductDialog
    product={selectedProduct}
    open={editProductOpen}
    onOpenChange={setEditProductOpen}
    onSave={async (productId, newQuantity) => {
      try {
        // Get the existing product
        const existingProduct = products.find((p) => p.id === productId);
        if (!existingProduct) return;

        // Compute updated quantity
        const updatedQuantity = existingProduct.quantity + newQuantity;

        // Make API call to update in backend
        const response = await fetch(`http://localhost:8000/api/stock/${productId}`, {
          method: "PUT", // Or PATCH if that's how you defined it in FastAPI
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedQuantity,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update product quantity");
        }

        // Update frontend state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  quantity: updatedQuantity,
                  lastUpdated: new Date().toLocaleString(),
                  status: determineStatus(updatedQuantity),
                }
              : p
          )
        );
      } catch (error) {
        console.error("Error updating product quantity:", error);
      }
    }
  }
  />


      <CSVUploadDialog open={csvUploadOpen} onOpenChange={setCsvUploadOpen} onUpload={() => {}} />
    </div>
  );
};

export default Products;
