import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2, X } from "lucide-react";
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
  lastUpdated: string;
  status?: 'critical' | 'low' | 'safe';
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

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("/api/stock");
        const stockData = response.data;

        const formattedProducts: Product[] = stockData.map((item: any) => ({
          id: item.id.toString(),
          name: item.item_name,
          categoryId: item.item_category,
          categoryName: item.item_category,
          quantity: item.item_inventory,
          costPrice: 0,
          sellingPrice: 0,
          lastUpdated: new Date(item.date).toLocaleDateString()
        }));

        setProducts(formattedProducts);

        const uniqueCategories: Category[] = Array.from(
          new Set(formattedProducts.map(p => p.categoryId))
        ).map(cat => ({
          id: cat,
          name: cat,
          description: `${cat} products`
        }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        toast({ title: "Error", description: "Failed to load stock data." });
      }
    };

    fetchStockData();
  }, []);

  const handleAddCategory = (name: string, description?: string) => {
    const newCategory: Category = {
      id: name,
      name,
      description,
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `${name} category has been created successfully.`,
    });
  };

  const handleAddProduct = (name: string, categoryId: string, quantity: number, costPrice: number, sellingPrice: number) => {
    const category = categories.find(c => c.id === categoryId);
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      categoryId,
      categoryName: category?.name || '',
      quantity,
      costPrice,
      sellingPrice,
      lastUpdated: 'just now',
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product added",
      description: `${name} has been added to inventory.`,
    });
  };

  const handleEditProduct = async (productId: string, addedQuantity: number) => {
    try {
      const response = await axios.put(`/api/stock/update/${productId}`, null, {
        params: { added_quantity: addedQuantity }
      });

      const updated = response.data;
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
            ? {
                ...p,
                quantity: updated.item_inventory,
                lastUpdated: new Date(updated.date).toLocaleDateString(),
              }
            : p
        )
      );

      toast({
        title: "Product updated",
        description: "Inventory updated successfully.",
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast({ title: "Error", description: "Failed to update inventory." });
    }
  };

  const handleCSVUpload = (file: File) => {
    toast({
      title: "CSV uploaded",
      description: "Product quantities have been updated from CSV file.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: `${productToDelete?.name} has been removed from inventory.`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    const categoryName = categories.find(c => c.id === categoryId)?.name;

    if (categoryProducts.length > 0) {
      toast({
        title: "Cannot delete category",
        description: `${categoryName} has ${categoryProducts.length} products. Remove all products first.`,
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.filter(c => c.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }

    toast({
      title: "Category deleted",
      description: `${categoryName} category has been removed.`,
    });
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

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
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
          <Button onClick={() => setAddProductOpen(true)} className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription>Filter products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="h-12 px-4 flex items-center justify-center"
              >
                <span className="font-medium">All ({products.length})</span>
              </Button>
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.categoryId === category.id);
                return (
                  <div key={category.id} className="relative group">
                    <Button
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="h-12 px-4 flex items-center justify-center pr-8"
                    >
                      <span className="font-medium">{category.name} ({categoryProducts.length})</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
              <Package className="w-5 h-5 text-green-600" />
              <span>Products Inventory</span>
            </CardTitle>
            <CardDescription>
              {selectedCategory
                ? `${filteredProducts.length} products in ${categories.find(c => c.id === selectedCategory)?.name}`
                : `All products in your inventory (${products.length} total)`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.categoryName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{product.quantity} units</p>
                      <p className="text-sm text-gray-500">Updated {product.lastUpdated}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {selectedCategory
                    ? `No products found in ${categories.find(c => c.id === selectedCategory)?.name} category.`
                    : "No products found. Add your first product to get started."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddCategoryDialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen} onAdd={handleAddCategory} />
      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} categories={categories} onAdd={handleAddProduct} />
      <EditProductDialog product={selectedProduct} open={editProductOpen} onOpenChange={setEditProductOpen} onSave={handleEditProduct} />
      <CSVUploadDialog open={csvUploadOpen} onOpenChange={setCsvUploadOpen} onUpload={handleCSVUpload} />
    </div>
  );
};

export default Products;
