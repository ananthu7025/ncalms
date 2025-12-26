"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Loader2 } from 'lucide-react';
import { addToCart } from '@/lib/actions/cart';
import { toast } from 'sonner';

interface CourseActionsProps {
  subjectId: string;
  bundlePrice: string;
}

export function CourseActions({ subjectId, bundlePrice }: CourseActionsProps) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const price = parseFloat(bundlePrice);
      const result = await addToCart(subjectId, null, true, price);

      if (result.success) {
        toast.success(result.message || 'Added to cart successfully!');
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('An error occurred while adding to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      const price = parseFloat(bundlePrice);
      const result = await addToCart(subjectId, null, true, price);

      if (result.success) {
        router.push('/learner/cart');
      } else {
        toast.error(result.message || 'Failed to proceed to checkout');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-sm"
      >
        {isAddingToCart ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
      <Button
        onClick={handleBuyNow}
        disabled={isBuyingNow}
        variant="outline"
        className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold py-6 rounded-xl transition-colors text-sm"
      >
        {isBuyingNow ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </>
        )}
      </Button>
    </div>
  );
}
