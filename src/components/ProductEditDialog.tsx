
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
  const [newCount, setNewCount] = useState(product?.remaining || 0);
  const { toast } = useToast();

  const handleSave = () => {
    if (!product) return;
    
    if (newCount < 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    onSave(product.id, newCount);
    onOpenChange(false);
    toast({
      title: "Inventory updated",
      description: `${product.name} inventory updated to ${newCount} units.`,
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
          <DialogDescription>
            Update the inventory count for {product.name}
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
              Current
            </Label>
            <Input
              id="current-count"
              value={product.remaining}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-count" className="text-right">
              New Count
            </Label>
            <Input
              id="new-count"
              type="number"
              value={newCount}
              onChange={(e) => setNewCount(Number(e.target.value))}
              className="col-span-3"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
