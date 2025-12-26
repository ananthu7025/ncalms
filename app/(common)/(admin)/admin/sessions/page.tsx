"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock, DollarSign, Edit2, Plus, Trash2, Calendar, User, Mail, Phone, MapPin } from 'lucide-react';
import toaster from "@/lib/toaster";

interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  isActive: boolean;
}

interface BookingRequest {
  id: string;
  sessionType: string;
  fullName: string;
  email: string;
  gmailId: string;
  province: string;
  country: string;
  whatsapp: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const initialSessionTypes: SessionType[] = [
  {
    id: '1',
    name: 'NCA Assessment Process Guidance',
    description: 'Get expert guidance on the NCA assessment process',
    duration: '30 mins',
    price: 10,
    currency: 'CAD',
    isActive: true
  },
  {
    id: '2',
    name: 'NCA Exam Preparation Guidance',
    description: 'Personalized exam preparation strategies',
    duration: '30 mins',
    price: 10,
    currency: 'CAD',
    isActive: true
  },
  {
    id: '3',
    name: 'Teaching / Answer Writing',
    description: 'One-on-one teaching session on any topic or answer writing guidance',
    duration: '1 hour',
    price: 50,
    currency: 'CAD',
    isActive: true
  }
];

const mockBookingRequests: BookingRequest[] = [
  {
    id: '1',
    sessionType: 'NCA Assessment Process Guidance',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    gmailId: 'john.smith@gmail.com',
    province: 'Ontario',
    country: 'Canada',
    whatsapp: '+1 416 555 0123',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    sessionType: 'Teaching / Answer Writing',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    gmailId: 'sarah.johnson@gmail.com',
    province: 'British Columbia',
    country: 'Canada',
    whatsapp: '+1 604 555 0456',
    status: 'confirmed',
    createdAt: '2024-01-14T14:15:00Z'
  },
  {
    id: '3',
    sessionType: 'NCA Exam Preparation Guidance',
    fullName: 'Michael Chen',
    email: 'm.chen@email.com',
    gmailId: 'michael.chen@gmail.com',
    province: 'Alberta',
    country: 'Canada',
    whatsapp: '+1 403 555 0789',
    status: 'completed',
    createdAt: '2024-01-13T09:00:00Z'
  },
  {
    id: '4',
    sessionType: 'NCA Assessment Process Guidance',
    fullName: 'Emily Davis',
    email: 'emily.d@email.com',
    gmailId: 'emily.davis@gmail.com',
    province: 'Quebec',
    country: 'Canada',
    whatsapp: '+1 514 555 0321',
    status: 'pending',
    createdAt: '2024-01-15T16:45:00Z'
  }
];

export default function AdminSessions() {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>(initialSessionTypes);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const [editingSession, setEditingSession] = useState<SessionType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState<Partial<SessionType>>({
    name: '',
    description: '',
    duration: '',
    price: 0,
    currency: 'CAD',
    isActive: true
  });

  const handleSaveSession = () => {
    if (editingSession) {
      setSessionTypes(prev =>
        prev.map(s => s.id === editingSession.id ? editingSession : s)
      );
      toaster.success("Session type updated successfully");
      setEditingSession(null);
    }
  };

  const handleAddSession = () => {
    if (!newSession.name || !newSession.duration || !newSession.price) {
      toaster.error("Please fill all required fields");
      return;
    }

    const session: SessionType = {
      id: Date.now().toString(),
      name: newSession.name || '',
      description: newSession.description || '',
      duration: newSession.duration || '',
      price: newSession.price || 0,
      currency: newSession.currency || 'CAD',
      isActive: true
    };

    setSessionTypes(prev => [...prev, session]);
    setNewSession({
      name: '',
      description: '',
      duration: '',
      price: 0,
      currency: 'CAD',
      isActive: true
    });
    setIsAddDialogOpen(false);
    toaster.success("Session type added successfully");
  };

  const handleDeleteSession = (id: string) => {
    setSessionTypes(prev => prev.filter(s => s.id !== id));
    toaster.success("Session type deleted");
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingRequest['status']) => {
    setBookingRequests(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
    toaster.success(`Booking status updated to ${newStatus}`);
  };

  const getStatusBadge = (status: BookingRequest['status']) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      completed: 'outline',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">One-on-One Sessions</h1>
        <p className="text-muted-foreground mt-1">Configure session types and manage booking requests</p>
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
                Booking Requests ({bookingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Details</TableHead>
                    <TableHead>Session Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingRequests.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {booking.fullName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {booking.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{booking.sessionType}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {booking.whatsapp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {booking.province}, {booking.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as BookingRequest['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configure Sessions Tab */}
        <TabsContent value="configure" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Session Types</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Session Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Session Name *</Label>
                    <Input
                      value={newSession.name}
                      onChange={(e) => setNewSession(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Career Counseling"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this session covers"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration *</Label>
                      <Input
                        value={newSession.duration}
                        onChange={(e) => setNewSession(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 30 mins"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (CAD) *</Label>
                      <Input
                        type="number"
                        value={newSession.price}
                        onChange={(e) => setNewSession(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddSession} className="w-full">
                    Add Session Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {sessionTypes.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  {editingSession?.id === session.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Session Name</Label>
                        <Input
                          value={editingSession.name}
                          onChange={(e) => setEditingSession(prev => prev ? { ...prev, name: e.target.value } : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={editingSession.description}
                          onChange={(e) => setEditingSession(prev => prev ? { ...prev, description: e.target.value } : null)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={editingSession.duration}
                            onChange={(e) => setEditingSession(prev => prev ? { ...prev, duration: e.target.value } : null)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (CAD)</Label>
                          <Input
                            type="number"
                            value={editingSession.price}
                            onChange={(e) => setEditingSession(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveSession}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditingSession(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">{session.name}</h3>
                          <Badge variant={session.isActive ? 'default' : 'secondary'}>
                            {session.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{session.description}</p>
                        <div className="flex items-center gap-6 mt-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{session.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="h-4 w-4" />
                            <span>{session.price} {session.currency}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingSession(session)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
