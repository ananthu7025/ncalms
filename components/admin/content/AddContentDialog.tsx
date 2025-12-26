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
import { Plus, Upload, Loader2 } from "lucide-react";
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
  fileUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  duration: z.string(),
  price: z.string().min(1, "Price is required"),
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
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const hookForm = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      contentTypeId: "",
      fileUrl: "",
      duration: "",
      price: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPdf = async () => {
    const contentTypeId = hookForm.getValues("contentTypeId");

    if (!selectedFile || !selectedSubjectId || !contentTypeId) {
      toaster.error("Please select a file");
      return;
    }

    setUploadingFile(true);

    try {
      const fileType = selectedFile.type;

      const uploadUrlResult = await getUploadUrl({
        fileName: selectedFile.name,
        fileType: fileType,
        contentType: "pdf",
        subjectId: selectedSubjectId,
      });

      if (!uploadUrlResult.success || !uploadUrlResult.data) {
        toaster.error(uploadUrlResult.error || "Failed to generate upload URL");
        setUploadingFile(false);
        return;
      }

      const uploadResponse = await fetch(uploadUrlResult.data.uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": fileType,
        },
      });

      if (!uploadResponse.ok) {
        toaster.error("Failed to upload file to S3");
        setUploadingFile(false);
        return;
      }

      hookForm.setValue("fileUrl", uploadUrlResult.data.publicUrl);
      toaster.success("PDF uploaded successfully. Now save the content.");
    } catch {
      toaster.error("An error occurred during upload");
    } finally {
      setUploadingFile(false);
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    if (!selectedSubjectId) return;

    try {
      const result = await createSubjectContent({
        subjectId: selectedSubjectId,
        ...data,
        duration: data.duration ? parseInt(data.duration) : null,
      });

      if (result.success) {
        toaster.success("Content created successfully");
        setIsDialogOpen(false);
        hookForm.reset();
        setSelectedFile(null);
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
    setIsDialogOpen(true);
  };

  const contentTypeOptions = contentTypes.map((ct) => ({
    value: ct.id,
    label: ct.name,
  }));

  const fileUrl = hookForm.watch("fileUrl");
  const selectedContentTypeId = hookForm.watch("contentTypeId");

  // Determine if selected content type is video
  const selectedContentType = contentTypes.find(
    (ct) => ct.id === selectedContentTypeId
  );
  const isVideoContent = selectedContentType?.name
    ?.toLowerCase()
    .includes("video");
  const isPdfContent = selectedContentType?.name?.toLowerCase().includes("pdf");

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

          <div className="grid grid-cols-2 gap-4">
            <InputSelect
              hookForm={hookForm}
              field="contentTypeId"
              label="Content Type"
              labelMandatory
              options={contentTypeOptions}
              placeholder="Select type"
            />

            <InputText
              hookForm={hookForm}
              field="price"
              label="Price ($)"
              labelMandatory
              placeholder="19.99"
              type="text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputText
              hookForm={hookForm}
              field="duration"
              label="Duration (minutes - optional)"
              placeholder="30"
              type="number"
            />

            <InputText
              hookForm={hookForm}
              field="sortOrder"
              label="Sort Order"
              placeholder="0"
              type="number"
            />
          </div>

          {/* Conditional rendering based on content type */}
          {isVideoContent ? (
            <InputText
              hookForm={hookForm}
              field="fileUrl"
              label="YouTube Video URL"
              labelMandatory
              placeholder="https://www.youtube.com/watch?v=..."
              infoText="Enter the full YouTube video URL"
              showInfoIcon
            />
          ) : isPdfContent ? (
            <div className="space-y-2">
              <Label>Upload PDF File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload PDF file
                </p>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                {selectedFile && (
                  <p className="text-sm text-foreground mb-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUploadPdf}
                  disabled={!selectedFile || uploadingFile}
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload PDF to S3"
                  )}
                </Button>
              </div>
              {fileUrl && (
                <p className="text-xs text-green-600">
                  PDF uploaded successfully!
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
