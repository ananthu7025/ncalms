"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Video, Loader2, Calendar, ArrowRight, CreditCard } from "lucide-react";
import toaster from "@/lib/toaster";
import { getActiveSessionTypes, createBooking, getMyBookings } from '@/lib/actions/sessions';
import { createSessionCheckout } from '@/lib/actions/checkout';
import { useSession } from 'next-auth/react';
import type { SessionType, SessionBooking } from '@/lib/db/schema';
import { BookSessionSkeleton } from '@/components/skeletons/book-session-skeleton';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/EmptyState';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputText from '@/components/InputComponents/InputText';

interface BookingWithSessionType {
  booking: SessionBooking;
  sessionType: SessionType | null;
}

// Form validation schema
const bookingFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  gmail: z.union([z.string().email("Invalid email address"), z.literal('')]).optional(),
  whatsapp: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookSessionPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [myBookings, setMyBookings] = useState<BookingWithSessionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      gmail: '',
      whatsapp: '',
      province: '',
      country: '',
    },
  });

  useEffect(() => {
    loadData();

    // Check if cancelled from Stripe checkout
    if (searchParams?.get('cancelled') === 'true') {
      toaster.error("Booking payment was cancelled");
    }
  }, [searchParams]);

  useEffect(() => {
    // Pre-fill form with user data
    if (session?.user) {
      form.setValue('fullName', session.user.name || '');
      form.setValue('email', session.user.email || '');
    }
  }, [session, form]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [typesResult, bookingsResult] = await Promise.all([
        getActiveSessionTypes(),
        getMyBookings()
      ]);

      if (typesResult.success && typesResult.data) {
        setSessionTypes(typesResult.data);
        // Auto-select first session type if available
        if (typesResult.data.length > 0 && !selectedSessionType) {
          setSelectedSessionType(typesResult.data[0]);
        }
      }

      if (bookingsResult.success && bookingsResult.data) {
        setMyBookings(bookingsResult.data);
      }
    } catch (error) {
      toaster.error("Failed to load session types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: BookingFormData) => {
    if (!selectedSessionType) {
      toaster.error("Please select a session type");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking
      const bookingResult = await createBooking({
        sessionTypeId: selectedSessionType.id,
        fullName: data.fullName,
        email: data.email,
        gmail: data.gmail || '',
        whatsapp: data.whatsapp || '',
        province: data.province || '',
        country: data.country || '',
      });

      if (!bookingResult.success || !bookingResult.data) {
        toaster.error(bookingResult.error || "Failed to create booking");
        setIsSubmitting(false);
        return;
      }

      // Create Stripe checkout session
      const checkoutResult = await createSessionCheckout(bookingResult.data.id);

      if (!checkoutResult.success || !checkoutResult.checkoutUrl) {
        toaster.error(checkoutResult.error || "Failed to create checkout session");
        setIsSubmitting(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = checkoutResult.checkoutUrl;
    } catch (error) {
      toaster.error("An error occurred while booking");
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'outline',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  if (isLoading) {
    return <BookSessionSkeleton />;
  }

  if (sessionTypes.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Book a Personal Session"
          description="Choose your preferred session type and schedule a personalized one-on-one consultation"
        />
        <EmptyState
          icon={Video}
          title="No Sessions Available"
          description="There are currently no session types available for booking. Please check back later or contact support for assistance."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Book a Personal Session"
        description="Choose your preferred session type and schedule a personalized one-on-one consultation"
      />

      {/* Two Column Layout: Session Types & Form */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Session Selection - Left Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            {sessionTypes.map((sessionType) => (
              <Card
                key={sessionType.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedSessionType?.id === sessionType.id
                    ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                    : 'hover:border-primary/50 hover:scale-[1.01]'
                }`}
                onClick={() => setSelectedSessionType(sessionType)}
              >
                <CardContent className="p-5 space-y-3">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg leading-tight flex-1">
                        {sessionType.title}
                      </h3>
                      {selectedSessionType?.id === sessionType.id && (
                        <div className="flex-shrink-0">
                          <div className="p-1 bg-primary rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    {sessionType.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {sessionType.description}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t"></div>

                  {/* Footer with Duration and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{sessionType.duration} mins</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">${sessionType.price}</span>
                      <span className="text-xs text-muted-foreground font-medium">CAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Form - Right Column */}
        <Card className="border-2 h-fit sticky top-4">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl">Contact Information</CardTitle>
          <CardDescription>
            Please provide your details so we can get in touch with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <InputText
                hookForm={form}
                field="fullName"
                label="Full Name"
                labelMandatory
                placeholder="Enter your full name"
                className="h-11"
              />

              {/* Email */}
              <InputText
                hookForm={form}
                field="email"
                label="Email Address"
                labelMandatory
                type="email"
                placeholder="your.email@example.com"
                className="h-11"
              />

              {/* Gmail */}
              <InputText
                hookForm={form}
                field="gmail"
                label="Gmail"
                type="email"
                placeholder="your.name@gmail.com"
                className="h-11"
              />

              {/* WhatsApp */}
              <InputText
                hookForm={form}
                field="whatsapp"
                label="WhatsApp Number"
                placeholder="+1 (234) 567-8900"
                className="h-11"
              />

              {/* Province */}
              <InputText
                hookForm={form}
                field="province"
                label="Province/State"
                placeholder="e.g., Ontario"
                className="h-11"
              />

              {/* Country */}
              <InputText
                hookForm={form}
                field="country"
                label="Country"
                placeholder="e.g., Canada"
                className="h-11"
              />
            </div>

            {/* Selected Session Summary */}
            {selectedSessionType && (
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Selected Session</p>
                    <p className="font-semibold">{selectedSessionType.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedSessionType.duration} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">${selectedSessionType.price}</p>
                    <p className="text-xs text-muted-foreground">CAD</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold"
                type="submit"
                disabled={isSubmitting || !selectedSessionType}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Secure Payment
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure Payment</span>
                </div>
                <span>•</span>
                <span>Powered by Stripe</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Booking History
            </CardTitle>
            <CardDescription>
              View and manage your session bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myBookings.map((item) => (
                <div
                  key={item.booking.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border rounded-xl hover:shadow-md transition-all bg-card"
                >
                  {/* Booking Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Video className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base">
                          {item.sessionType?.title || 'Unknown Session'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(item.booking.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          {item.booking.amountPaid && (
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3.5 w-3.5" />
                              <span className="font-medium">${item.booking.amountPaid} CAD</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    {getStatusBadge(item.booking.status)}
                    {item.booking.status === 'pending' && !item.booking.stripeSessionId && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={async () => {
                          setIsSubmitting(true);
                          const result = await createSessionCheckout(item.booking.id);
                          if (result.success && result.checkoutUrl) {
                            window.location.href = result.checkoutUrl;
                          } else {
                            toaster.error(result.error || "Failed to create checkout");
                            setIsSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <CreditCard className="h-4 w-4" />
                        Complete Payment
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
