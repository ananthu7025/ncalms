"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Users, BookOpen, MessageSquare, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { dashboardStats, topSellingCourses, bundleSales, transactions, monthlyRevenue } from '@/data/mockData';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Revenue', value: `$${dashboardStats.totalRevenue.toLocaleString()}`, change: dashboardStats.revenueChange, icon: DollarSign, color: 'text-success' },
    { title: 'Active Users', value: dashboardStats.activeUsers.toLocaleString(), change: dashboardStats.usersChange, icon: Users, color: 'text-primary' },
    { title: 'Total Courses', value: dashboardStats.totalCourses, change: dashboardStats.coursesChange, icon: BookOpen, color: 'text-info' },
    { title: 'Pending Support', value: dashboardStats.pendingSupport, change: dashboardStats.supportChange, icon: MessageSquare, color: 'text-warning' },
  ];

  const bundleData = [
    { name: 'PDF', value: bundleSales.pdf, color: 'hsl(var(--info))' },
    { name: 'Video', value: bundleSales.video, color: 'hsl(var(--primary))' },
    { name: 'Q&A', value: bundleSales.questionBank, color: 'hsl(var(--success))' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your platform performance</p>
        </div>
        <Select defaultValue="month">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs mt-1 ${stat.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-accent flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Courses Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingCourses} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bundle Sales Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Bundle Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bundleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {bundleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {bundleData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm">View All <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{tx.userName}</p>
                    <p className="text-xs text-muted-foreground">{tx.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${tx.amount}</p>
                    <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'refunded' ? 'destructive' : 'secondary'} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
