// src/app/components/Resume/ResumeControlBar.tsx - Debug Version
"use client";

import { useEffect, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemplate,
  setTemplate,
} from "lib/redux/settingsSlice";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const dispatch = useDispatch();
  const selectedTemplate = useSelector(selectTemplate);
  const [downloadAttempts, setDownloadAttempts] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Initialize PDF generation
  const [instance, updateInstance] = usePDF({ document });

  // Debug effect to monitor PDF generation
  useEffect(() => {
    const status = `Loading: ${instance.loading}, Error: ${!!instance.error}, URL: ${!!instance.url}`;
    setDebugInfo(status);
    console.log("PDF Generation Status:", {
      loading: instance.loading,
      error: instance.error,
      url: instance.url,
      blob: instance.blob
    });

    if (instance.error) {
      console.error("PDF Error Details:", instance.error);
    }
  }, [instance.loading, instance.error, instance.url, instance.blob]);

  // Update PDF when document changes
  useEffect(() => {
    console.log("Document changed, updating PDF...");
    const timer = setTimeout(() => {
      updateInstance();
    }, 100); // Small delay to ensure document is ready
    
    return () => clearTimeout(timer);
  }, [document, updateInstance]);

  // Force regenerate PDF
  const forceRegenerate = () => {
    console.log("Force regenerating PDF...");
    setDownloadAttempts(prev => prev + 1);
    updateInstance(document);
  };

  // Enhanced download handler
  const handleDownload = async () => {
    console.log("=== DOWNLOAD ATTEMPT ===");
    console.log("Template:", selectedTemplate);
    console.log("Instance state:", {
      loading: instance.loading,
      error: instance.error,
      url: instance.url,
      blob: instance.blob
    });

    // Handle LaTeX template
    if (selectedTemplate === "LaTeX") {
      console.log("LaTeX template - triggering custom download");
      const event = new CustomEvent('downloadLatex', { 
        detail: { fileName } 
      });
      window.dispatchEvent(event);
      return;
    }

    // Check if PDF is still loading
    if (instance.loading) {
      console.log("PDF still generating - please wait");
      alert("PDF is still generating. Please wait a moment and try again.");
      return;
    }

    // Check for errors
    if (instance.error) {
      console.error("PDF generation error:", instance.error);
      const shouldRetry = confirm("PDF generation failed. Would you like to try again?");
      if (shouldRetry) {
        forceRegenerate();
      }
      return;
    }

    // Check if URL exists
    if (!instance.url && !instance.blob) {
      console.log("No PDF URL or blob available - regenerating");
      forceRegenerate();
      return;
    }

    try {
      let downloadUrl = instance.url;
      let shouldRevoke = false;

      // If we have a blob but no URL, create one
      if (!instance.url && instance.blob) {
        console.log("Creating URL from blob...");
        downloadUrl = window.URL.createObjectURL(instance.blob);
        shouldRevoke = true;
      }

      console.log("Attempting download with URL:", downloadUrl);

      // Try different download methods
      if (downloadUrl) {
        // Method 1: Direct blob download
        if (instance.blob) {
          const link = window.document.createElement('a');
          const url = window.URL.createObjectURL(instance.blob);
          link.href = url;
          link.download = `${fileName}.pdf`;
          link.style.display = 'none';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log("✅ Download successful via blob");
          return;
        }

        // Method 2: Fetch and download
        try {
          console.log("Trying fetch method...");
          const response = await fetch(downloadUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = `${fileName}.pdf`;
          link.style.display = 'none';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log("✅ Download successful via fetch");
          return;
        } catch (fetchError) {
          console.log("Fetch failed:", fetchError);
        }

        // Method 3: Direct link
        try {
          console.log("Trying direct link method...");
          const link = window.document.createElement('a');
          link.href = downloadUrl;
          link.download = `${fileName}.pdf`;
          link.target = '_blank';
          link.style.display = 'none';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          console.log("✅ Download successful via direct link");
          return;
        } catch (directError) {
          console.log("Direct link failed:", directError);
        }

        // Method 4: Open in new tab
        console.log("Opening in new tab as fallback...");
        window.open(downloadUrl, '_blank');
        
        if (shouldRevoke) {
          setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
        }
      } else {
        throw new Error("No download URL available");
      }
    } catch (error) {
      console.error("All download methods failed:", error);
      alert("Download failed. Please try again or check your browser settings.");
    }
  };

  const getDownloadButtonText = () => {
    if (selectedTemplate === "LaTeX") return "Download LaTeX";
    if (instance.loading) return "Generating PDF...";
    if (instance.error) return `Error - Retry (${downloadAttempts})`;
    if (!instance.url && !instance.blob) return "Preparing...";
    return "Download Resume";
  };

  const isDownloadDisabled = selectedTemplate !== "LaTeX" && 
    (instance.loading || (!instance.url && !instance.blob && !instance.error));

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>

      {/* Template Selection + Download */}
      <div className="flex items-center gap-4">
        {/* Template Dropdown */}
        <select
          value={selectedTemplate}
          onChange={(e) => dispatch(setTemplate(e.target.value as any))}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          <option value="A">Template A - Classic</option>
          <option value="B">Template B - Two Column</option>
          <option value="C">Template C - Single Page</option>
          <option value="LaTeX">Template LaTeX - Professional</option>
        </select>

        {/* Force Regenerate Button (Debug) */}
        <button
          onClick={forceRegenerate}
          className="text-xs px-2 py-1 bg-gray-200 rounded"
          title="Force regenerate PDF"
        >
          🔄
        </button>

        {/* Download Button */}
        <button
          className={`ml-1 flex items-center gap-1 rounded-md border px-3 py-0.5 transition-colors ${
            isDownloadDisabled
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={handleDownload}
          disabled={isDownloadDisabled}
          type="button"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {getDownloadButtonText()}
          </span>
        </button>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 max-w-xs truncate" title={debugInfo}>
          {debugInfo}
        </div>
      </div>
    </div>
  );
};

export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);