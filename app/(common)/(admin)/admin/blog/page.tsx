import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Eye,
  FileEdit,
} from 'lucide-react';
import { getBlogPosts, getBlogStats } from '@/lib/actions/blog';
import { BlogsTable } from '@/components/admin/blog/BlogsTable';
import { BlogDialog } from '@/components/admin/blog/BlogDialog';

export default async function AdminBlogPage() {
  // Fetch data in parallel
  const [postsResult, statsResult] = await Promise.all([
    getBlogPosts(),
    getBlogStats(),
  ]);

  const posts = postsResult.success && postsResult.data ? postsResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage blog articles
          </p>
        </div>
        <BlogDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.publishedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <FileEdit className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{stats.draftPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardContent className="p-6">
          <BlogsTable initialPosts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
