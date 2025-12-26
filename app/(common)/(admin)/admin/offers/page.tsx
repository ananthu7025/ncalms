import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Gift,
  Tag,
  Clock,
  Percent
} from 'lucide-react';
import { getOffers, getOfferStats } from '@/lib/actions/offers';
import { getActiveSubjects } from '@/lib/actions/subjects';
import { getContentTypes } from '@/lib/actions/content-types';
import { OffersTable } from '@/components/admin/offers/OffersTable';
import { OfferDialog } from '@/components/admin/offers/OfferDialog';

export default async function AdminOffersPage() {
  // Fetch data in parallel
  const [offersResult, statsResult, subjectsResult, contentTypesResult] = await Promise.all([
    getOffers(),
    getOfferStats(),
    getActiveSubjects(),
    getContentTypes(),
  ]);

  const offers = offersResult.success && offersResult.data ? offersResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    activeOffers: 0,
    totalRedemptions: 0,
    expiringSoon: 0,
    avgDiscount: 0,
  };
  const subjects = subjectsResult.success && subjectsResult.data ? subjectsResult.data.map(s => s.subject) : [];
  const contentTypes = contentTypesResult.success && contentTypesResult.data ? contentTypesResult.data : [];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Offers</h1>
          <p className="text-muted-foreground mt-1">
            Manage discounts and promotional offers
          </p>
        </div>
        <OfferDialog
          subjects={subjects}
          contentTypes={contentTypes}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Offers</p>
                <p className="text-2xl font-bold">{stats.activeOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Tag className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Redemptions</p>
                <p className="text-2xl font-bold">{stats.totalRedemptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Percent className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Discount</p>
                <p className="text-2xl font-bold">{stats.avgDiscount}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <OffersTable
            offers={offers}
            subjects={subjects}
            contentTypes={contentTypes}
          />
        </CardContent>
      </Card>

    </div>
  );
}
