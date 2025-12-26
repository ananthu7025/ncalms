/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import toaster from "@/lib/toaster";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import { getExamTypesByStream } from "@/lib/actions/exam-types";
import InputText from "@/components/InputComponents/InputText";
import { uploadSubjectImage } from "@/lib/actions/local-upload";
import InputSelect from "@/components/InputComponents/InputSelect";
import InputSwitch from "@/components/InputComponents/InputSwitch";
import { createSubject, updateSubject } from "@/lib/actions/subjects";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import { courseSchema, CourseFormValues } from "@/lib/validations/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddCourseFormProps {
  initialData?: any;
  streams: any[];
  courseId?: string;
}

export function AddCourseClient({
  initialData,
  streams,
  courseId,
}: AddCourseFormProps) {
  const router = useRouter();
  const isEditing = !!courseId;

  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.thumbnail || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const hookForm = useForm<CourseFormValues>({
    resolver: yupResolver(courseSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      streamId: initialData?.streamId || "",
      examTypeId: initialData?.examTypeId || "",
      demoVideoUrl: initialData?.demoVideoUrl || "",
      bundlePrice: initialData?.bundlePrice || "",
      isBundleEnabled: initialData?.isBundleEnabled || false,
      isActive: initialData?.isActive || true,
      thumbnail: initialData?.thumbnail || "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = hookForm;
  const streamId = watch("streamId");
  const isBundleEnabled = watch("isBundleEnabled");
  const isActive = watch("isActive");

  // Fetch exam types when stream changes
  useEffect(() => {
    async function fetchExamTypes() {
      if (!streamId) {
        setExamTypes([]);
        return;
      }

      setLoadingExamTypes(true);
      const result = await getExamTypesByStream(streamId);
      if (result.success && result.data) {
        setExamTypes(result.data);
      } else {
        setExamTypes([]);
        // Reset exam type if current one is not in new list
        setValue("examTypeId", "");
      }
      setLoadingExamTypes(false);
    }
    fetchExamTypes();
  }, [streamId, setValue]);

  const onSubmit = async (data: CourseFormValues, publish: boolean) => {
    setIsLoading(true);
    try {
      let thumbnailUrl = data.thumbnail;

      // Handle Image Upload
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);

        const uploadResult = await uploadSubjectImage(uploadFormData);
        if (uploadResult.success && uploadResult.url) {
          thumbnailUrl = uploadResult.url;
          setValue("thumbnail", thumbnailUrl);
        } else {
          toaster.error(uploadResult.error || "Failed to upload thumbnail");
          setIsLoading(false);
          return;
        }
      }

      let result;
      // Overwrite isActive based on the button clicked
      const finalData = {
        ...data,
        thumbnail: thumbnailUrl,
        isActive: publish,
        examTypeId: data.examTypeId === "" ? null : data.examTypeId,
      };

      if (isEditing && courseId) {
        result = await updateSubject({
          id: courseId,
          ...finalData,
        } as any);
      } else {
        result = await createSubject({
          ...finalData,
        } as any);
      }

      if (result && result.success) {
        toaster.success(
          isEditing
            ? "Course updated successfully"
            : publish
            ? "Course is now live"
            : "Course saved as draft"
        );
        router.push("/admin/courses");
        router.refresh();
      } else {
        toaster.error(
          result?.error || `Failed to ${isEditing ? "update" : "create"} course`
        );
      }
    } catch (error) {
      toaster.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? "Update course details and content"
              : "Create and configure a new course"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSubmit((data) => onSubmit(data, false))}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit((data) => onSubmit(data, true))}
            disabled={isLoading}
            className="gradient-primary"
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <InputText
                  hookForm={hookForm}
                  field="title"
                  label="Course Title"
                  labelMandatory
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <InputTextarea
                  hookForm={hookForm}
                  field="description"
                  label="Description"
                  placeholder="Enter course description"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <InputSelect
                    hookForm={hookForm}
                    field="streamId"
                    label="Learning Stream"
                    labelMandatory
                    options={streams.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    placeholder="Select learning stream"
                  />
                </div>
                <div className="space-y-2">
                  <InputSelect
                    hookForm={hookForm}
                    field="examTypeId"
                    label="Exam Type (Optional)"
                    options={examTypes.map((t) => ({
                      value: t.id,
                      label: t.name,
                    }))}
                    placeholder={
                      loadingExamTypes ? "Loading..." : "Select exam type"
                    }
                    disabled={!streamId || loadingExamTypes}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex flex-col gap-3">
                  {!previewUrl ? (
                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 hover:bg-accent/50 transition-colors">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            // Create preview URL
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
                        alt="Thumbnail preview"
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
                          setValue("thumbnail", "");
                          // Reset file input if valid DOM element could be reached, but react state is enough here
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  )}
                  {/* Hidden input to register thumbnail field for validation if needed, though we handle it manually via state/effect or just assume logic */}
                  <input type="hidden" {...hookForm.register("thumbnail")} />
                </div>
              </div>

              <div className="space-y-2">
                <InputText
                  hookForm={hookForm}
                  field="demoVideoUrl"
                  label="Demo Video URL (Optional)"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputSwitch
                hookForm={hookForm}
                field="isBundleEnabled"
                label="Enable Bundle"
                description="Allow bundle purchase"
              />

              {isBundleEnabled && (
                <div className="space-y-2 pt-4 border-t">
                  <InputText
                    hookForm={hookForm}
                    field="bundlePrice"
                    label="Bundle Price ($)"
                    placeholder="199.99"
                  />
                  <p className="text-xs text-muted-foreground">
                    Price for purchasing all content types together
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputSwitch
                hookForm={hookForm}
                field="isActive"
                label="Published"
                description="Make course visible"
              />

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Current Status</p>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                After creating the course, manage content from the Content
                Management page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
