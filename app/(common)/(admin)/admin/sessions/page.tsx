import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { getSessionTypes, getAllBookings } from '@/lib/actions/sessions';
import { SessionDialog, SessionTypesTable, BookingsTable } from '@/components/admin/sessions';

export const dynamic = 'force-dynamic';

export default async function AdminSessions() {
  // Fetch data in parallel on the server
  const [sessionsResult, bookingsResult] = await Promise.all([
    getSessionTypes(),
    getAllBookings(),
  ]);

  const sessionTypes = sessionsResult.success && sessionsResult.data ? sessionsResult.data : [];
  const bookings = bookingsResult.success && bookingsResult.data ? bookingsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">One-on-One Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Configure session types and manage booking requests
        </p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          <TabsTrigger value="configure">Configure Sessions</TabsTrigger>
        </TabsList>

        {/* Booking Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Requests ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BookingsTable bookings={bookings} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configure Sessions Tab */}
        <TabsContent value="configure" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Session Types</h2>
            <SessionDialog />
          </div>

          <SessionTypesTable sessionTypes={sessionTypes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
