
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  remaining: number;
  status: 'critical' | 'low' | 'safe';
  lastUpdated: string;
}

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productId: string, newCount: number) => void;
}

const ProductEditDialog = ({ product, open, onOpenChange, onSave }: ProductEditDialogProps) => {
  const [addQuantity, setAddQuantity] = useState(0);
  const { toast } = useToast();

  const handleSave = () => {
    if (!product) return;
    
    if (addQuantity < 0) {
      toast({
        title: "Invalid quantity",
        description: "Added quantity cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    const newTotalCount = product.remaining + addQuantity;
    onSave(product.id, newTotalCount);
    onOpenChange(false);
    setAddQuantity(0); // Reset the add quantity field
    toast({
      title: "Inventory updated",
      description: `${product.name} inventory updated. Added ${addQuantity} units. New total: ${newTotalCount} units.`,
    });
  };

  // Reset addQuantity when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAddQuantity(0);
    }
    onOpenChange(newOpen);
  };

  if (!product) return null;

  const newTotal = product.remaining + addQuantity;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
          <DialogDescription>
            Add more stock to {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-name" className="text-right">
              Product
            </Label>
            <Input
              id="product-name"
              value={product.name}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={product.category}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-count" className="text-right">
              Current Stock
            </Label>
            <Input
              id="current-count"
              value={product.remaining}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-quantity" className="text-right">
              Add Quantity
            </Label>
            <Input
              id="add-quantity"
              type="number"
              value={addQuantity}
              onChange={(e) => setAddQuantity(Number(e.target.value))}
              className="col-span-3"
              min="0"
              placeholder="Enter quantity to add"
            />
          </div>
          {addQuantity > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-green-600 font-medium">
                New Total
              </Label>
              <div className="col-span-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-medium">
                {newTotal} units
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Stock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
