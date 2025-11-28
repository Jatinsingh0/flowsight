"use client";

import { useState } from "react";
import { LucideIcon, Download, Upload, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImportCardProps {
  type: "users" | "orders" | "subscriptions";
  title: string;
  description: string;
  icon: LucideIcon;
  workspaceId: string;
}

type ImportStatus = "idle" | "validating" | "uploading" | "success" | "error";

interface ImportState {
  status: ImportStatus;
  message: string;
  imported?: number;
  skipped?: number;
  errors?: string[];
  lastImported?: string;
}

export function ImportCard({ type, title, description, icon: Icon, workspaceId }: ImportCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importState, setImportState] = useState<ImportState>({
    status: "idle",
    message: "",
  });

  const downloadTemplate = () => {
    window.open(`/api/data-import/template?type=${type}`, "_blank");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportState({ status: "idle", message: "" });
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setImportState({ status: "validating", message: "Validating CSV file..." });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/data-import/validate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setImportState({
          status: "error",
          message: data.error || "Validation failed",
          errors: data.details || data.validation?.errors || [],
        });
        return;
      }

      const { validation, totalRows } = data;
      const errorCount = validation.errors.length;
      const warningCount = validation.warnings.length;

      if (errorCount > 0) {
        setImportState({
          status: "error",
          message: `Validation failed: ${errorCount} error(s) found`,
          errors: validation.errors.map((e: any) => `Row ${e.row}: ${e.message}`),
        });
      } else {
        setImportState({
          status: "idle",
          message: `✅ ${totalRows} rows valid. ${warningCount > 0 ? `${warningCount} warning(s). ` : ""}Ready to import.`,
        });
      }
    } catch (error: any) {
      setImportState({
        status: "error",
        message: error.message || "Validation failed",
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImportState({ status: "uploading", message: "Importing data..." });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/data-import/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setImportState({
          status: "error",
          message: data.error || "Import failed",
          errors: data.details || data.validation?.errors || [],
        });
        return;
      }

      const { result } = data;
      setImportState({
        status: "success",
        message: `Successfully imported ${result.imported} ${type}`,
        imported: result.imported,
        skipped: result.skipped,
        errors: result.errors.length > 0 ? result.errors : undefined,
        lastImported: new Date().toLocaleString(),
      });

      // Clear file input
      setFile(null);
      const fileInput = document.getElementById(`file-${type}`) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh page after 2 seconds to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setImportState({
        status: "error",
        message: error.message || "Import failed",
      });
    }
  };

  return (
    <div className="rounded-xl border border-borderSubtle bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-textBase">{title}</h3>
          <p className="text-sm text-textMuted leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center gap-3">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            size="sm"
            className="border-borderSubtle bg-card/50 hover:bg-card"
          >
            <Download className="mr-2 h-4 w-4" />
            Download {type}.csv template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label
            htmlFor={`file-${type}`}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-borderSubtle bg-card/30 p-6 transition-colors hover:border-accent/50 hover:bg-card/50"
          >
            <Upload className="mb-2 h-8 w-8 text-textMuted" />
            <span className="text-sm font-medium text-textBase">
              {file ? file.name : "Choose CSV file"}
            </span>
            <span className="mt-1 text-xs text-textMuted">
              {file ? "Click to change file" : "or drag and drop"}
            </span>
          </label>
          <input
            id={`file-${type}`}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Actions */}
        {file && (
          <div className="flex gap-2">
            <Button
              onClick={handleValidate}
              variant="outline"
              size="sm"
              disabled={importState.status === "validating" || importState.status === "uploading"}
            >
              {importState.status === "validating" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Validate"
              )}
            </Button>
            <Button
              onClick={handleImport}
              size="sm"
              disabled={
                importState.status === "validating" ||
                importState.status === "uploading" ||
                importState.status === "error"
              }
              className="bg-accent hover:bg-accent-soft"
            >
              {importState.status === "uploading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Process
                </>
              )}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {importState.message && (
          <div
            className={`rounded-lg border p-4 ${
              importState.status === "success"
                ? "border-emerald-500/20 bg-emerald-500/10"
                : importState.status === "error"
                ? "border-red-500/20 bg-red-500/10"
                : "border-amber-500/20 bg-amber-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              {importState.status === "success" ? (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              ) : importState.status === "error" ? (
                <XCircle className="h-5 w-5 text-red-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    importState.status === "success"
                      ? "text-emerald-300"
                      : importState.status === "error"
                      ? "text-red-300"
                      : "text-amber-300"
                  }`}
                >
                  {importState.message}
                </p>
                {importState.imported !== undefined && (
                  <p className="mt-1 text-xs text-textMuted">
                    Imported: {importState.imported} | Skipped: {importState.skipped || 0}
                  </p>
                )}
                {importState.lastImported && (
                  <p className="mt-1 text-xs text-textMuted">
                    Last imported: {importState.lastImported}
                  </p>
                )}
                {importState.errors && importState.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    <p className="text-xs font-medium text-red-300">Errors:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-red-200">
                      {importState.errors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                      {importState.errors.length > 5 && (
                        <li className="text-red-300">
                          ...and {importState.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Helper Note */}
        <p className="text-xs text-textMuted">
          {type === "users" && "We'll create or update users based on email."}
          {type === "orders" && "Users will be created automatically if they don't exist."}
          {type === "subscriptions" && "Users must exist before importing subscriptions. Import users first."}
        </p>
      </div>
    </div>
  );
}

