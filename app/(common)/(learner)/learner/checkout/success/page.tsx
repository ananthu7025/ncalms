import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { verifyAndProcessCheckout } from "@/lib/actions/checkout";

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; type?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const checkoutType = params.type;
  const isSessionBooking = checkoutType === 'session';

  let processingResult = null;

  // If we have a session ID and it's not a session booking, verify and process the checkout
  // Session bookings are processed via webhook only
  if (sessionId && !isSessionBooking) {
    processingResult = await verifyAndProcessCheckout(sessionId);
  }

  const showError = !sessionId || (processingResult && !processingResult.success && !isSessionBooking);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className={showError ? "border-yellow-200 shadow-lg" : "border-green-200 shadow-lg"}>
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 ${showError ? "bg-yellow-100" : "bg-green-100"} rounded-full flex items-center justify-center mb-4`}>
              {showError ? (
                <AlertCircle className="w-10 h-10 text-yellow-600" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
            </div>
            <CardTitle className={`text-3xl font-bold ${showError ? "text-yellow-600" : "text-green-600"}`}>
              {showError ? "Payment Received" : isSessionBooking ? "Session Booked!" : "Payment Successful!"}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {showError ? "Processing your purchase..." : isSessionBooking ? "Your session booking is confirmed" : "Thank you for your purchase"}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {showError ? (
              <>
                <p className="text-gray-700">
                  Your payment was received, but we're still processing your order.
                  Please refresh this page in a few moments or contact support if the issue persists.
                </p>
                {processingResult?.message && (
                  <Alert className="text-left">
                    <AlertDescription>
                      <strong>Status:</strong> {processingResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : isSessionBooking ? (
              <>
                <p className="text-gray-700">
                  Your session booking has been confirmed and payment has been processed successfully.
                  We will contact you shortly via your provided contact details to schedule your session.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> Check your email for booking confirmation.
                    Our team will reach out to schedule your session at a convenient time.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700">
                  Your payment has been processed successfully. You now have access
                  to your purchased content.
                </p>
                {processingResult?.alreadyProcessed && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      Your purchase was already processed. Your cart has been cleared and access has been granted.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {sessionId && (
              <p className="text-sm text-gray-500">
                {isSessionBooking ? 'Booking' : 'Order'} ID: <span className="font-mono">{sessionId.slice(0, 20)}...</span>
              </p>
            )}

            {!isSessionBooking && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            {isSessionBooking ? (
              <>
                <Button asChild>
                  <Link href="/learner/book-session">View My Bookings</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/learner/dashboard">Go to Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/learner/library">Go to My Library</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/learner/courses">Browse More Courses</Link>
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; type?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
