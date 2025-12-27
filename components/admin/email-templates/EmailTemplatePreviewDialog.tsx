"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface EmailTemplatePreviewDialogProps {
  template: EmailTemplate;
  open: boolean;
  onClose: () => void;
}

export function EmailTemplatePreviewDialog({
  template,
  open,
  onClose,
}: EmailTemplatePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Email Template Preview
            <Badge variant="outline" className="font-mono">
              {template.name}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Subject: <span className="font-semibold text-foreground">{template.subject}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="html" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML Preview</TabsTrigger>
            <TabsTrigger value="html-code">HTML Code</TabsTrigger>
            <TabsTrigger value="text">Text Version</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-2">
            <div className="rounded-lg border bg-white p-6 min-h-[400px]">
              <div
                dangerouslySetInnerHTML={{ __html: template.htmlContent }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="html-code" className="space-y-2">
            <div className="rounded-lg border bg-muted p-4 min-h-[400px] overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                {template.htmlContent}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-2">
            <div className="rounded-lg border bg-muted p-6 min-h-[400px]">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {template.textContent}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
