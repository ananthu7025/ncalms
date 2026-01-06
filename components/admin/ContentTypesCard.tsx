/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "react-modal";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputText from "@/components/InputComponents/InputText";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import toaster from "@/lib/toaster";
import {
  getContentTypes,
  updateContentType,
  deleteContentType,
  createContentType,
} from "@/lib/actions/content-types";
import type { ContentType } from "@/lib/db/schema";

// Form validation schema
const contentTypeSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: yup.string().optional(),
});

type ContentTypeFormValues = yup.InferType<typeof contentTypeSchema>;

// Set app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    padding: "0",
    border: "none",
    borderRadius: "8px",
  },
};

export function ContentTypesCard() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState<ContentType | null>(null);

  const hookForm = useForm<ContentTypeFormValues>({
    resolver: yupResolver(contentTypeSchema) as any,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, reset } = hookForm;

  useEffect(() => {
    loadContentTypes();
  }, []);

  const loadContentTypes = async () => {
    setIsLoading(true);
    const result = await getContentTypes();
    if (result.success && result.data) {
      setContentTypes(result.data);
    } else {
      toaster.error(result.error || "Failed to load content types");
    }
    setIsLoading(false);
  };

  const openEditModal = (contentType: ContentType) => {
    setEditingType(contentType);
    reset({
      name: contentType.name,
      description: contentType.description || "",
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingType(null);
    reset({
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    reset({ name: "", description: "" });
  };

  const onSubmit = async (data: ContentTypeFormValues) => {
    setIsSubmitting(true);

    try {
      let result;
      if (editingType) {
        // Update existing content type
        result = await updateContentType({
          id: editingType.id,
          name: data.name,
          description: data.description || null,
        });
      } else {
        // Create new content type
        result = await createContentType({
          name: data.name,
          description: data.description || null,
        });
      }

      if (result.success) {
        toaster.success(
          result.message ||
          (editingType ? "Content type updated successfully" : "Content type created successfully")
        );
        closeModal();
        loadContentTypes();
      } else {
        toaster.error(result.error || "Operation failed");
      }
    } catch (error) {
      toaster.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    const result = await deleteContentType(id);
    if (result.success) {
      toaster.success(result.message || "Content type deleted successfully");
      loadContentTypes();
    } else {
      toaster.error(result.error || "Failed to delete content type");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Types</CardTitle>
          <Button
            size="sm"
            onClick={openCreateModal}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : contentTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No content types available
            </p>
          ) : (
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{type.name}</p>
                    {type.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditModal(type)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(type.id, type.name)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel={editingType ? "Edit Content Type" : "Create Content Type"}
      >
        <div className="bg-background">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">
              {editingType ? "Edit Content Type" : "Create Content Type"}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={closeModal}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-4">
              <InputText
                hookForm={hookForm}
                field="name"
                label="Name"
                labelMandatory
                placeholder="e.g., VIDEO, PDF, MOCK"
                maxLength={50}
                textTransformMode="uppercase"
              />

              <InputTextarea
                hookForm={hookForm}
                field="description"
                label="Description"
                placeholder="Enter description (optional)"
                rows={4}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gradient-primary"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingType
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
