// src/app/components/Resume/index.tsx
"use client";
import { useState, useMemo } from "react";
import { ResumePDFTemplateA } from "components/Resume/ResumePDF/ResumePDFTemplateA";
import { ResumePDFTemplateB } from "components/Resume/ResumePDF/ResumePDFTemplateB";
import { ResumePDFTemplateC } from "components/Resume/ResumePDF/ResumePDFTemplate";
import { ResumePDFTemplateD } from "components/Resume/ResumePDF/ResumePDFTemplateD";
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
  const TemplateComponent = useMemo(() => {
    switch (selectedTemplate) {
      case "B":
        return ResumePDFTemplateB;
      case "C":
        return ResumePDFTemplateC;
      case "D":
        return ResumePDFTemplateD;
      default:
        return ResumePDFTemplateA;
    }
  }, [selectedTemplate]);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={scale}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <TemplateComponent resume={resume} settings={settings} />
            </ResumeIframeCSR>
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={<TemplateComponent resume={resume} settings={settings} isPDF={true} />}
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};