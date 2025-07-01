
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Upload, FolderPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import AddCategoryDialog from "@/components/AddCategoryDialog";
import ProductAddDialog from "@/components/ProductAddDialog";
import ProductEditDialog from "@/components/ProductEditDialog";
import CSVUploadDialog from "@/components/CSVUploadDialog";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  categoryId: string;
}

const Products = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Electronics", description: "Electronic items and gadgets" },
    { id: "2", name: "Clothing", description: "Apparel and accessories" },
  ]);
  
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Laptop", quantity: 15, minStock: 5, categoryId: "1" },
    { id: "2", name: "T-Shirt", quantity: 8, minStock: 10, categoryId: "2" },
    { id: "3", name: "Phone", quantity: 25, minStock: 8, categoryId: "1" },
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddCategory = (name: string, description?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category Added",
      description: `${name} has been added successfully.`,
    });
  };

  const handleAddProduct = (name: string, categoryId: string, quantity: number, minStock: number) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      quantity,
      minStock,
      categoryId,
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product Added",
      description: `${name} has been added to inventory.`,
    });
  };

  const handleEditProduct = (id: string, quantity: number, minStock: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity, minStock } : product
    ));
    toast({
      title: "Product Updated",
      description: "Product quantities have been updated.",
    });
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed from inventory.`,
    });
  };

  const handleCSVUpload = (file: File) => {
    // Simulate CSV processing
    toast({
      title: "CSV Upload",
      description: `${file.name} has been processed and inventory updated.`,
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || "Unknown";
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { status: "Out of Stock", color: "destructive" as const };
    if (quantity <= minStock) return { status: "Low Stock", color: "secondary" as const };
    return { status: "In Stock", color: "default" as const };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddCategory(true)} variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
            <Button onClick={() => setShowAddProduct(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button onClick={() => setShowCSVUpload(true)} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
          </div>
        </div>

        {categories.map(category => {
          const categoryProducts = products.filter(p => p.categoryId === category.id);
          
          return (
            <Card key={category.id} className="mb-6">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {categoryProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products in this category</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProducts.map(product => {
                      const stockStatus = getStockStatus(product.quantity, product.minStock);
                      
                      return (
                        <Card key={product.id} className="relative">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <Badge variant={stockStatus.color}>
                                {stockStatus.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                Quantity: <span className="font-medium">{product.quantity}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Min Stock: <span className="font-medium">{product.minStock}</span>
                              </p>
                              <div className="flex justify-end space-x-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowEditProduct(true);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <AddCategoryDialog
          open={showAddCategory}
          onOpenChange={setShowAddCategory}
          onAdd={handleAddCategory}
        />

        <ProductAddDialog
          open={showAddProduct}
          onOpenChange={setShowAddProduct}
          categories={categories}
          onAdd={handleAddProduct}
        />

        <ProductEditDialog
          open={showEditProduct}
          onOpenChange={setShowEditProduct}
          product={editingProduct}
          onEdit={handleEditProduct}
        />

        <CSVUploadDialog
          open={showCSVUpload}
          onOpenChange={setShowCSVUpload}
          onUpload={handleCSVUpload}
        />
      </div>
    </div>
  );
};

export default Products;
