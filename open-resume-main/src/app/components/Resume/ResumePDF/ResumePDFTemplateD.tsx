// Template C with Direct Download Functionality and Font Registration
import { Page, View, Document, Font } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

// Register fonts
Font.register({
  family: 'Source Sans Pro',
  src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Regular.ttf',
  fontWeight: 'normal'
});

Font.register({
  family: 'Source Sans Pro',
  src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Bold.ttf',
  fontWeight: 'bold'
});

export const ResumePDFTemplateC = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } = resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;
  const [isDownloading, setIsDownloading] = useState(false);

  // Ensure font family is registered or use fallback
  const safeFontFamily = 'Source Sans Pro';

  // Filter and order forms to show
  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [form: string]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
  };

  // PDF Document Component
  const PDFDocument = () => (
    <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
      <Page
        size={documentSize === "A4" ? "A4" : "LETTER"}
        style={{
          ...styles.flexCol,
          color: DEFAULT_FONT_COLOR,
          fontFamily: safeFontFamily,
          fontSize: fontSize + "pt",
          padding: `${spacing[4]} ${spacing[12]}`,
        }}
      >
        {/* Colored header bar */}
        {Boolean(settings.themeColor) && (
          <View
            style={{
              width: spacing["full"],
              height: spacing[2],
              backgroundColor: themeColor,
            }}
          />
        )}
        
        {/* Main content */}
        <View
          style={{
            ...styles.flexCol,
            padding: `${spacing[0]} ${spacing[8]}`,
            gap: spacing[2],
          }}
        >
          <ResumePDFProfile
            profile={profile}
            themeColor={themeColor}
            isPDF={true}
          />
          {showFormsOrder.map((form) => {
            const Component = formTypeToComponent[form];
            return (
              <View key={form} style={{ marginTop: spacing[2] }}>
                <Component />
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );

  // Download function with better error handling
  const downloadPDF = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      console.log("Starting PDF generation...");

      // Create new PDF instance
      const doc = pdf();
      
      // Update container with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          doc.updateContainer(<PDFDocument />);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait for fonts
          
          const blob = await doc.toBlob();
          if (!blob) throw new Error('No blob generated');
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = `${name?.trim() ? name.replace(/[^a-zA-Z0-9]/g, '_') : 'resume'}-template-C.pdf`;
          
          // Trigger download
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          
          // Cleanup
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          console.log("PDF generated and downloaded successfully");
          return;
        } catch (error) {
          console.log(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        }
      }
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('PDF generation failed. Please check your internet connection and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // If this is being rendered in PDF mode, return the document
  if (isPDF) {
    return (
      <>
        <PDFDocument />
        <SuppressResumePDFErrorMessage />
      </>
    );
  }

  // For preview mode, show with download button
  return (
    <>
      {/* Fixed Download Button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          style={{
            backgroundColor: isDownloading ? '#9ca3af' : (themeColor || '#1f2937'),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      {/* PDF Preview */}
      <div style={{ marginTop: '60px' }}>
        <PDFDocument />
      </div>
      <SuppressResumePDFErrorMessage />
    </>
  );
};