// src/app/components/Resume/ResumeControlBar.tsx
"use client";

import { useEffect } from "react";
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

  const [instance, update] = usePDF({ document });

  // Redux: template selection
  const dispatch = useDispatch();
  const selectedTemplate = useSelector(selectTemplate);

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document);
  }, [update, document]);

  // Fixed download handler
  const handleDownload = async () => {
    if (instance.url) {
      try {
        const response = await fetch(instance.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to direct download
        const link = document.createElement('a');
        link.href = instance.url;
        link.download = fileName + '.pdf';
        link.click();
      }
    }
  };

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
        {/* Template Dropdown - Updated to include Template D */}
        <select
          value={selectedTemplate}
          onChange={(e) => dispatch(setTemplate(e.target.value as "A" | "B" | "C" | "D"))}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          <option value="A">Template A - Classic</option>
          <option value="B">Template B - Two Column</option>
          <option value="C">Template C - Modern</option>
          <option value="D">Template D - Single Page</option>
        </select>

        {/* Fixed Download Button with better state management */}
        <button
          className={`ml-1 flex items-center gap-1 rounded-md border px-3 py-0.5 transition-colors ${
            !instance.url || instance.loading
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={handleDownload}
          disabled={!instance.url || instance.loading}
          type="button"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {instance.loading ? "Generating PDF..." : 
             instance.error ? "Error - Retry" :
             !instance.url ? "Preparing..." : 
             "Download Resume"}
          </span>
        </button>
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);