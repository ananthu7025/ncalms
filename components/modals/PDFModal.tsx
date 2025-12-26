"use client";

import Modal from "react-modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

// Set app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

export function PDFModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
}: PDFModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-background rounded-lg shadow-2xl max-w-6xl w-full mx-auto my-8 outline-none"
      overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      closeTimeoutMS={200}
    >
      <div className="relative h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {title || "PDF Viewer"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Container */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            title={title || "PDF document"}
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </Modal>
  );
}
