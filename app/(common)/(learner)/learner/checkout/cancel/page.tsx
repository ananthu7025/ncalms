import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-orange-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-600">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Your payment was not completed
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <p className="text-gray-700">
              You have cancelled the payment process. No charges have been made to your account.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                Your cart items have been saved. You can complete your purchase anytime.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/learner/cart">Return to Cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/learner/courses">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
