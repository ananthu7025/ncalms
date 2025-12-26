"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { removeFromCart } from "@/lib/actions/cart";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import type { CartItem } from "@/lib/actions/cart";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const result = await removeFromCart(item.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to remove item from cart");
    } finally {
      setIsRemoving(false);
    }
  };

  const itemName = item.isBundle
    ? "Complete Bundle"
    : item.contentTypeName || "Content";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.subjectThumbnail ? (
            <div className="relative w-32 h-20 flex-shrink-0">
              <Image
                src={item.subjectThumbnail}
                alt={item.subjectTitle}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {item.subjectTitle}
            </h3>
            <Badge variant="outline" className="mt-1">
              {itemName}
            </Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-foreground">
              ${parseFloat(item.price).toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive mt-2"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
