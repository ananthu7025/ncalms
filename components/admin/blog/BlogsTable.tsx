"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteBlogPost, toggleBlogPostStatus } from "@/lib/actions/blog";
import { BlogDialog } from "./BlogDialog";
import toaster from "@/lib/toaster";
import { useRouter } from "next/navigation";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  content: string;
  excerpt: string | null;
  authorId: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PostWithAuthor {
  post: BlogPost;
  author: Author | null;
}

interface BlogsTableProps {
  initialPosts: PostWithAuthor[];
}

export function BlogsTable({ initialPosts }: BlogsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteBlogPost(id);
      if (result.success) {
        toaster.success(result.message || "Blog post deleted successfully");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to delete blog post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      const result = await toggleBlogPostStatus(id);
      if (result.success) {
        toaster.success(result.message || "Blog post status updated");
        router.refresh();
      } else {
        toaster.error(result.error || "Failed to update blog post status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No blog posts found. Create your first post to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialPosts.map(({ post, author }) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{truncateText(post.title, 50)}</span>
                  <span className="text-xs text-muted-foreground">{post.slug}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{author?.name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">{author?.email || ""}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={post.isPublished}
                    onCheckedChange={() => handleToggleStatus(post.id)}
                    disabled={togglingId === post.id}
                  />
                  {post.isPublished ? (
                    <Badge variant="default" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(post.publishedAt)}</TableCell>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <BlogDialog
                    existingPost={post}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(post.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this blog post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
