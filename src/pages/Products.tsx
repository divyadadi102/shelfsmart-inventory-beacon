
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Upload, Edit, Trash2 } from "lucide-react";
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

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Dairy', description: 'Milk, cheese, yogurt products' },
    { id: '2', name: 'Fruits', description: 'Fresh fruits and vegetables' },
    { id: '3', name: 'Bakery', description: 'Bread, pastries, baked goods' },
    { id: '4', name: 'Snacks', description: 'Chips, crackers, snack foods' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Milk', categoryId: '1', categoryName: 'Dairy', quantity: 8, status: 'critical', lastUpdated: '2 hours ago' },
    { id: '2', name: 'Bread', categoryId: '3', categoryName: 'Bakery', quantity: 12, status: 'critical', lastUpdated: '1 hour ago' },
    { id: '3', name: 'Eggs', categoryId: '1', categoryName: 'Dairy', quantity: 15, status: 'low', lastUpdated: '30 minutes ago' },
    { id: '4', name: 'Bananas', categoryId: '2', categoryName: 'Fruits', quantity: 22, status: 'low', lastUpdated: '45 minutes ago' },
    { id: '5', name: 'Cheese', categoryId: '1', categoryName: 'Dairy', quantity: 45, status: 'safe', lastUpdated: '3 hours ago' },
    { id: '6', name: 'Apples', categoryId: '2', categoryName: 'Fruits', quantity: 52, status: 'safe', lastUpdated: '1 hour ago' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const determineStatus = (quantity: number): 'critical' | 'low' | 'safe' => {
    if (quantity <= 10) return 'critical';
    if (quantity <= 25) return 'low';
    return 'safe';
  };

  const handleAddCategory = (name: string, description?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      description,
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `${name} category has been created successfully.`,
    });
  };

  const handleAddProduct = (name: string, categoryId: string, quantity: number) => {
    const category = categories.find(c => c.id === categoryId);
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      categoryId,
      categoryName: category?.name || '',
      quantity,
      status: determineStatus(quantity),
      lastUpdated: 'just now',
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product added",
      description: `${name} has been added to inventory.`,
    });
  };

  const handleEditProduct = (productId: string, newQuantity: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              quantity: newQuantity, 
              status: determineStatus(newQuantity),
              lastUpdated: 'just now'
            }
          : product
      )
    );
    toast({
      title: "Product updated",
      description: "Product quantity has been updated successfully.",
    });
  };

  const handleCSVUpload = (file: File) => {
    // In a real app, you would parse the CSV file here
    toast({
      title: "CSV uploaded",
      description: "Product quantities have been updated from CSV file.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "Product has been removed from inventory.",
    });
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditProductOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your inventory products and categories</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setAddCategoryOpen(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
          <Button onClick={() => setAddProductOpen(true)} className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Add Product</span>
          </Button>
          <Button onClick={() => setCsvUploadOpen(true)} variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </Button>
        </div>

        {/* Categories Overview */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription>
              Manage product categories ({categories.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.categoryId === category.id);
                return (
                  <div key={category.id} className="p-4 bg-white border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <p className="text-sm font-medium text-blue-600">{categoryProducts.length} products</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Products Inventory</span>
            </CardTitle>
            <CardDescription>
              All products in your inventory ({products.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
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
                    
                    <Badge className={`${getStatusColor(product.status)} font-medium capitalize`}>
                      {product.status}
                    </Badge>

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

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found. Add your first product to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddCategoryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        onAdd={handleAddCategory}
      />

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        categories={categories}
        onAdd={handleAddProduct}
      />

      <EditProductDialog
        product={selectedProduct}
        open={editProductOpen}
        onOpenChange={setEditProductOpen}
        onSave={handleEditProduct}
      />

      <CSVUploadDialog
        open={csvUploadOpen}
        onOpenChange={setCsvUploadOpen}
        onUpload={handleCSVUpload}
      />
    </div>
  );
};

export default Products;
