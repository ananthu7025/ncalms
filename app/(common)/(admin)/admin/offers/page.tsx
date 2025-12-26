import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Percent, 
  Tag, 
  Gift,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminOffersUIOnly() {

  const mockOffers = [
    {
      id: '1',
      name: 'New Year Sale',
      code: 'NEWYEAR25',
      discount: '25%',
      course: 'All Courses',
      bundle: 'All Bundles',
      validity: '25 Dec 2024 ➝ 05 Jan 2025',
      usage: '34 / 100',
      isActive: true,
    },
    {
      id: '2',
      name: 'Video Bundle Special',
      code: 'VIDEO20OFF',
      discount: '$20',
      course: 'Python Masterclass',
      bundle: 'Video Bundle',
      validity: '20 Dec 2024 ➝ 31 Dec 2024',
      usage: '12 / 50',
      isActive: true,
    }
  ];

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
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </Button>
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
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">46</p>
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
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-2xl font-bold">22%</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOffers.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{o.code}</Badge>
                  </TableCell>
                  <TableCell>{o.discount}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{o.course}</p>
                      <p className="text-muted-foreground text-xs">
                        {o.bundle}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{o.validity}</TableCell>
                  <TableCell>{o.usage}</TableCell>
                  <TableCell>
                    <Switch checked={o.isActive} disabled />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      Edit | Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
