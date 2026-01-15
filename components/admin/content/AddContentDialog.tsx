"use client";

import * as z from "zod";
import { useState } from "react";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUploadUrl } from "@/lib/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, Loader2, Trash2, PlusCircle } from "lucide-react";
import InputText from "@/components/InputComponents/InputText";
import InputSelect from "@/components/InputComponents/InputSelect";
import InputSwitch from "@/components/InputComponents/InputSwitch";
import { createSubjectContent } from "@/lib/actions/subject-contents";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContentType {
  id: string;
  name: string;
}

interface AddContentDialogProps {
  contentTypes: ContentType[];
  selectedSubjectId: string;
  activeContentTypeId: string;
  buttonText: string;
  onContentCreated: () => void;
}

const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  contentTypeId: z.string().min(1, "Content type is required"),
  fileUrl: z.union([z.string(), z.array(z.string())]).optional(),
  duration: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
});

type ContentFormData = z.infer<typeof contentSchema>;

export function AddContentDialog({
  contentTypes,
  selectedSubjectId,
  activeContentTypeId,
  buttonText,
  onContentCreated,
}: AddContentDialogProps) {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [videoUrls, setVideoUrls] = useState<string[]>([""]);

  const hookForm = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      contentTypeId: "",
      fileUrl: "",
      duration: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);

      // Auto-upload files immediately
      await handleUploadFiles(files);
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    const selectedContentTypeId = hookForm.getValues("contentTypeId");

    if (!selectedSubjectId || !selectedContentTypeId) {
      toaster.error("Please select content type first");
      return;
    }

    setUploadingFiles(true);

    try {
      const uploadedFileUrls: string[] = [];

      for (const file of files) {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const fileType = file.type;

        const uploadUrlResult = await getUploadUrl({
          fileName: file.name,
          fileType: fileType,
          contentType: "pdf",
          subjectId: selectedSubjectId,
        });

        if (!uploadUrlResult.success || !uploadUrlResult.data) {
          toaster.error(`Failed to generate upload URL for ${file.name}`);
          continue;
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));

        const uploadResponse = await fetch(uploadUrlResult.data.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": fileType,
          },
        });

        if (!uploadResponse.ok) {
          toaster.error(`Failed to upload ${file.name} to S3`);
          continue;
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        uploadedFileUrls.push(uploadUrlResult.data.publicUrl);
      }

      setUploadedUrls(uploadedFileUrls);
      hookForm.setValue("fileUrl", uploadedFileUrls);
      toaster.success(`${uploadedFileUrls.length} file(s) uploaded successfully!`);
    } catch (error) {
      toaster.error("An error occurred during upload");
      console.error(error);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handle video URL changes
  const handleVideoUrlChange = (index: number, value: string) => {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
    hookForm.setValue("fileUrl", newUrls.filter(url => url.trim() !== ""));
  };

  // Add new video URL input
  const handleAddVideoUrl = () => {
    setVideoUrls([...videoUrls, ""]);
  };

  // Remove video URL input
  const handleRemoveVideoUrl = (index: number) => {
    const newUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(newUrls.length > 0 ? newUrls : [""]);
    hookForm.setValue("fileUrl", newUrls.filter(url => url.trim() !== ""));
  };

  const onSubmit = async (data: ContentFormData) => {
    if (!selectedSubjectId) return;

    try {
      // Convert fileUrl array to JSON string for storage
      const fileUrlData = Array.isArray(data.fileUrl)
        ? JSON.stringify(data.fileUrl)
        : data.fileUrl;

      const result = await createSubjectContent({
        subjectId: selectedSubjectId,
        ...data,
        fileUrl: fileUrlData,
        duration: data.duration ? parseInt(data.duration) : null,
      });

      if (result.success) {
        toaster.success("Content created successfully");
        setIsDialogOpen(false);
        hookForm.reset();
        setSelectedFiles([]);
        setUploadedUrls([]);
        setUploadProgress({});
        setVideoUrls([""]);
        onContentCreated();
      } else {
        toaster.error(result.error || "Failed to create content");
      }
    } catch {
      toaster.error("An unexpected error occurred");
    }
  };

  const handleOpenDialog = () => {
    hookForm.setValue("contentTypeId", activeContentTypeId);
    setVideoUrls([""]);
    setIsDialogOpen(true);
  };

  const contentTypeOptions = contentTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  const selectedContentTypeId = hookForm.watch("contentTypeId");

  // Determine if selected content type is video or PDF
  const selectedContentType = contentTypes.find(
    (ct) => ct.id === selectedContentTypeId
  );
  const isVideoContent = selectedContentType?.name
    ?.toLowerCase()
    .includes("video");
const isPdfContent =
  ["pdf","notes", "question bank", "questionbank", "qb"].some(keyword =>
    selectedContentType?.name?.toLowerCase().includes(keyword)
  );


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary" onClick={handleOpenDialog}>
          <Plus className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={hookForm.handleSubmit(onSubmit)}
          className="space-y-4 pt-4"
        >
          <InputText
            hookForm={hookForm}
            field="title"
            label="Content Title"
            labelMandatory
            placeholder="Enter content title"
          />

          <InputTextarea
            hookForm={hookForm}
            field="description"
            label="Description"
            placeholder="Enter description"
            rows={3}
          />

          <InputSelect
            hookForm={hookForm}
            field="contentTypeId"
            label="Content Type"
            labelMandatory
            options={contentTypeOptions}
            placeholder="Select type"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputText
              hookForm={hookForm}
              field="duration"
              label="Duration (minutes - optional)"
              placeholder="30"
              type="number"
            />
          </div>

          {/* Conditional rendering based on content type */}
          {isVideoContent ? (
            <div className="space-y-2">
              <Label>
                YouTube Video URLs
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="space-y-3">
                {videoUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {videoUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveVideoUrl(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVideoUrl}
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Another Video URL
                </Button>
              </div>
              {videoUrls.filter(url => url.trim() !== "").length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {videoUrls.filter(url => url.trim() !== "").length} video URL(s) added
                </p>
              )}
            </div>
          ) : isPdfContent ? (
            <div className="space-y-2">
              <Label>
                Upload PDF File(s)
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload PDF file(s) - Files will be uploaded automatically
                </p>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  multiple
                  className="mb-2"
                  disabled={uploadingFiles}
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Selected Files:
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-muted p-2 rounded">
                        <span className="truncate flex-1">{file.name}</span>
                        {uploadProgress[file.name] !== undefined && (
                          <span className="ml-2 text-green-600">
                            {uploadProgress[file.name]}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {uploadingFiles && (
                  <div className="mt-4 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="text-sm">Uploading files...</span>
                  </div>
                )}
              </div>
              {uploadedUrls.length > 0 && (
                <p className="text-xs text-green-600">
                  {uploadedUrls.length} file(s) uploaded successfully!
                </p>
              )}
            </div>
          ) : (
            <InputText
              hookForm={hookForm}
              field="fileUrl"
              label="Content URL"
              placeholder="Enter content URL"
              infoText="Enter the URL for this content"
              showInfoIcon
            />
          )}

          <div className="pt-4 border-t">
            <InputSwitch
              hookForm={hookForm}
              field="isActive"
              label="Active"
              description="Make content visible"
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary"
            disabled={hookForm.formState.isSubmitting}
          >
            {hookForm.formState.isSubmitting ? "Creating..." : "Create Content"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
