// src/app/components/Resume/index.tsx
"use client";
import { useState, useMemo } from "react";
import { ResumePDFTemplateA } from "components/Resume/ResumePDF/ResumePDFTemplateA";
import { ResumePDFTemplateB } from "components/Resume/ResumePDF/ResumePDFTemplateB";
import { ResumePDFTemplateC } from "components/Resume/ResumePDF/ResumePDFTemplateExtra";
import { ResumeLaTeXTemplate, ResumePDFLatexTemplate } from "components/Resume/ResumePDF/ResumeLaTeXTemplate";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings, selectTemplate } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const selectedTemplate = useAppSelector(selectTemplate);

  // Dynamically select the template component
  const { TemplateComponent, isLaTeXTemplate } = useMemo(() => {
    switch (selectedTemplate) {
      case "B":
        return { TemplateComponent: ResumePDFTemplateB, isLaTeXTemplate: false };
      case "C":
        return { TemplateComponent: ResumePDFTemplateC, isLaTeXTemplate: false };
      case "LaTeX":
        return { TemplateComponent: ResumeLaTeXTemplate, isLaTeXTemplate: true };
      default:
        return { TemplateComponent: ResumePDFTemplateA, isLaTeXTemplate: false };
    }
  }, [selectedTemplate]);

  // For PDF generation, use the PDF-specific LaTeX component
  const PDFTemplateComponent = selectedTemplate === "LaTeX" ? ResumePDFLatexTemplate : TemplateComponent;

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            {isLaTeXTemplate ? (
              // For LaTeX template, render directly without iframe
              <div className="h-full w-full overflow-auto bg-white shadow-lg">
                <TemplateComponent resume={resume} settings={settings} />
              </div>
            ) : (
              // For other templates, use the iframe approach
              <ResumeIframeCSR
                documentSize={settings.documentSize}
                scale={scale}
                enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
              >
                <TemplateComponent resume={resume} settings={settings} />
              </ResumeIframeCSR>
            )}
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={<PDFTemplateComponent resume={resume} settings={settings} isPDF={true} />}
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};