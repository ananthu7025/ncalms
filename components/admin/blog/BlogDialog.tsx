/* eslint-disable @next/next/no-img-element */
"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import InputText from "@/components/InputComponents/InputText";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import InputSwitch from "@/components/InputComponents/InputSwitch";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { uploadBlogImage } from "@/lib/actions/local-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  content: string;
  excerpt: string | null;
  isPublished: boolean;
}

interface BlogDialogProps {
  existingPost?: BlogPost;
  onPostSaved?: () => void;
}

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  image: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  isPublished: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export function BlogDialog({
  existingPost,
  onPostSaved,
}: BlogDialogProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingPost?.image || null
  );
  const isEditMode = !!existingPost;

  const hookForm = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      content: "",
      excerpt: "",
      isPublished: false,
    },
  });

  // Reset form when post changes or dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (existingPost) {
        hookForm.reset({
          title: existingPost.title,
          slug: existingPost.slug,
          image: existingPost.image || "",
          content: existingPost.content,
          excerpt: existingPost.excerpt || "",
          isPublished: existingPost.isPublished,
        });
        setPreviewUrl(existingPost.image);
        setImageFile(null);
      } else {
        hookForm.reset({
          title: "",
          slug: "",
          image: "",
          content: "",
          excerpt: "",
          isPublished: false,
        });
        setPreviewUrl(null);
        setImageFile(null);
      }
    }
  }, [isDialogOpen, existingPost, hookForm]);

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = data.image;

      // Handle Image Upload
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResult = await uploadBlogImage(uploadFormData);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          hookForm.setValue("image", imageUrl);
        } else {
          toaster.error(uploadResult.error || "Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        title: data.title,
        slug: data.slug,
        image: imageUrl || null,
        content: data.content,
        excerpt: data.excerpt || null,
        isPublished: data.isPublished,
      };

      let result;
      if (isEditMode && existingPost) {
        result = await updateBlogPost({
          id: existingPost.id,
          ...payload,
        });
      } else {
        result = await createBlogPost(payload);
      }

      if (result.success) {
        toaster.success(result.message || `Blog post ${isEditMode ? "updated" : "created"} successfully`);
        setIsDialogOpen(false);
        hookForm.reset();
        setImageFile(null);
        setPreviewUrl(null);
        if (onPostSaved) {
          onPostSaved();
        } else {
          router.refresh();
        }
      } else {
        toaster.error(result.error || `Failed to ${isEditMode ? "update" : "create"} blog post`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toaster.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Blog Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit" : "Create"} Blog Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <InputText
              hookForm={hookForm}
              field="title"
              label=""
              placeholder="Enter blog post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <InputText
              hookForm={hookForm}
              field="slug"
              label=""
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the title (lowercase, hyphens only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <div className="flex flex-col gap-3">
              {!previewUrl ? (
                <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 hover:bg-accent/50 transition-colors">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-primary">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-background">
                  <img
                    src={previewUrl}
                    alt="Featured image preview"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 z-20"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageFile(null);
                      setPreviewUrl(null);
                      hookForm.setValue("image", "");
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              )}
              <input type="hidden" {...hookForm.register("image")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <InputTextarea
              hookForm={hookForm}
              field="excerpt"
              label=""
              placeholder="Short summary of the blog post (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <InputTextarea
              hookForm={hookForm}
              field="content"
              label=""
              placeholder="Write your blog post content here... (Supports HTML/Markdown)"
              rows={15}
            />
          </div>

          <InputSwitch
            hookForm={hookForm}
            field="isPublished"
            label="Published"
            description="Make this blog post visible to the public"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Create"} Post</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
