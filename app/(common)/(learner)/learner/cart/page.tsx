import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { getCartItems, getCartTotal } from "@/lib/actions/cart";
import { CartItemCard } from "@/components/learner/cart-item-card";
import { EmptyState } from "@/components/EmptyState";
import { CartSummary } from "@/components/learner/cart-summary";
import { AutoEnrollHandler } from "@/components/learner/AutoEnrollHandler";
import { Suspense } from "react";

export default async function CartPage() {
  const cartItems = await getCartItems();
  const total = await getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Auto Enroll Handler */}
        <Suspense fallback={null}>
          <AutoEnrollHandler />
        </Suspense>

        <EmptyState
          icon={<Package className="w-10 h-10 text-primary" />}
          title="Your cart is empty"
          description="Start adding courses to your cart to begin learning"
          action={
            <Link href="/learner/courses">
              <Button className="gradient-primary">
                Browse Courses
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Auto Enroll Handler */}
      <Suspense fallback={null}>
        <AutoEnrollHandler />
      </Suspense>
      {/* Back Link */}
      <Link
        href="/learner/courses"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continue Shopping
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <Badge variant="secondary" className="ml-2">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary initialSubtotal={total} />
        </div>
      </div>
    </div>
  );
}
