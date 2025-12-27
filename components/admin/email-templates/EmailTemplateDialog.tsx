"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import InputText from "@/components/InputComponents/InputText";
import InputTextarea from "@/components/InputComponents/InputTextarea";
import { createEmailTemplate, updateEmailTemplate } from "@/lib/actions/email-templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface EmailTemplateDialogProps {
  template?: EmailTemplate;
  onTemplateSaved?: () => void;
}

const templateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  htmlContent: z.string().min(10, "HTML content must be at least 10 characters"),
  textContent: z.string().min(10, "Text content must be at least 10 characters"),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export function EmailTemplateDialog({
  template,
  onTemplateSaved,
}: EmailTemplateDialogProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!template;

  const hookForm = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      subject: "",
      htmlContent: "",
      textContent: "",
    },
  });

  // Reset form when template changes or dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (template) {
        hookForm.reset({
          name: template.name,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
        });
      } else {
        hookForm.reset({
          name: "",
          subject: "",
          htmlContent: "",
          textContent: "",
        });
      }
    }
  }, [isDialogOpen, template, hookForm]);

  const onSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name.toUpperCase(),
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
      };

      let result;
      if (isEditMode && template) {
        result = await updateEmailTemplate({
          id: template.id,
          ...payload,
        });
      } else {
        result = await createEmailTemplate(payload);
      }

      if (result.success) {
        toaster.success(
          result.message ||
          `Email template ${isEditMode ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        router.refresh();
        if (onTemplateSaved) {
          onTemplateSaved();
        }
      } else {
        toaster.error(result.error || "Failed to save email template");
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
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Email Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Email Template" : "Create Email Template"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the email template details below."
              : "Create a new email template. Use {{variableName}} for dynamic placeholders."}
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Available Placeholders:</strong> Use double curly braces like {"{{"} and {"}}"}  to add dynamic variables.
            <br />
            Common examples: {"{{"}<strong>fullName</strong>{"}}"},  {"{{"}<strong>email</strong>{"}}"},  {"{{"}<strong>resetLink</strong>{"}}"},  {"{{"}<strong>bookingId</strong>{"}}"}, etc.
          </AlertDescription>
        </Alert>

        <form onSubmit={hookForm.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <InputText
            hookForm={hookForm}
            field="name"
            label="Template Name"
            labelMandatory
            placeholder="e.g., WELCOME_EMAIL, RESET_PASSWORD"
            textTransformMode="uppercase"
            infoText="Use uppercase with underscores (e.g., WELCOME_EMAIL)"
            disabled={isSubmitting}
          />

          <InputText
            hookForm={hookForm}
            field="subject"
            label="Email Subject"
            labelMandatory
            placeholder="e.g., Welcome to NCA LMS!"
            disabled={isSubmitting}
          />

          <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html">HTML Content</TabsTrigger>
              <TabsTrigger value="text">Text Content</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-2">
              <InputTextarea
                hookForm={hookForm}
                field="htmlContent"
                label="HTML Content"
                labelMandatory
                placeholder="<h1>Welcome {{fullName}}!</h1><p>Thank you for joining...</p>"
                className="min-h-[300px] font-mono text-sm"
                infoText="Write the HTML version of your email with full formatting"
                disabled={isSubmitting}
              />
            </TabsContent>

            <TabsContent value="text" className="space-y-2">
              <InputTextarea
                hookForm={hookForm}
                field="textContent"
                label="Text Content"
                labelMandatory
                placeholder="Welcome {{fullName}}!&#10;&#10;Thank you for joining..."
                className="min-h-[300px] font-mono text-sm"
                infoText="Write the plain text version for email clients that don't support HTML"
                disabled={isSubmitting}
              />
            </TabsContent>
          </Tabs>

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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
