"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportUsersAsCSV } from "@/lib/actions/users";
import { toast } from "react-toastify";

export function ExportUsersButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvContent = await exportUsersAsCSV();

      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? "Exporting..." : "Export Users"}
    </Button>
  );
}
