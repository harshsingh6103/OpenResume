import { Page, View, Document, Font, pdf } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { useState } from "react";

// Register fonts with fallbacks
const registerFonts = async () => {
  try {
    await Font.register({
      family: 'Source Sans Pro',
      src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Regular.ttf',
      fontWeight: 'normal'
    });

    await Font.register({
      family: 'Source Sans Pro',
      src: 'https://cdn.jsdelivr.net/npm/source-sans-pro@3.6.0/TTF/SourceSansPro-Bold.ttf',
      fontWeight: 'bold'
    });
  } catch (error) {
    console.warn('Font loading failed:', error);
    // Fallback to system fonts
    Font.register({
      family: 'Source Sans Pro',
      fonts: [
        { src: 'fonts/Arial.ttf', fontWeight: 'normal' },
        { src: 'fonts/Arial-Bold.ttf', fontWeight: 'bold' }
      ]
    });
  }
};
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
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || "#0f766e"; // Modern teal theme
  const [isDownloading, setIsDownloading] = useState(false);

  // PDF Document Component
  const PDFDocument = () => (
    <>
      <Document title={`${name} Resume`} author={name}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            flexDirection: "column",
            backgroundColor: "#fff",
            color: "#1a1a1a",
            fontFamily: "Source Sans Pro",
            fontSize: fontSize + "pt",
            padding: spacing[6],
          }}
        >
          {/* ===== Top Profile Section with Modern Layout ===== */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderLeft: `4pt solid ${themeColor}`,
              paddingLeft: spacing[4],
              marginBottom: spacing[6],
              borderBottom: `2pt solid ${themeColor}`,
            }}
          >
            <ResumePDFProfile profile={profile} themeColor={themeColor} isPDF={isPDF} />
          </View>

          {/* ===== Two Column Layout ===== */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing[8],
              border: `2pt solid ${themeColor}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* ---- Main Content (Left, 70%) ---- */}
            <View style={{ width: "70%", paddingRight: spacing[6] }}>
              <ResumePDFWorkExperience
                heading={formToHeading["workExperiences"]}
                workExperiences={workExperiences}
                themeColor={themeColor}
              />
              <ResumePDFEducation
                heading={formToHeading["educations"]}
                educations={educations}
                themeColor={themeColor}
                showBulletPoints={showBulletPoints["educations"]}
              />
              <ResumePDFProject
                heading={formToHeading["projects"]}
                projects={projects}
                themeColor={themeColor}
              />
            </View>

            {/* ---- Sidebar (Right, 30%) ---- */}
            <View style={{ width: "30%", paddingLeft: spacing[6], backgroundColor: "#f8fafc", minHeight: 400, borderLeft: `2pt solid ${themeColor}` }}>
              <ResumePDFSkills
                heading={formToHeading["skills"]}
                skills={skills}
                themeColor={themeColor}
                showBulletPoints={showBulletPoints["skills"]}
              />
              <ResumePDFCustom
                heading={formToHeading["custom"]}
                custom={custom}
                themeColor={themeColor}
                showBulletPoints={showBulletPoints["custom"]}
              />
            </View>
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );

  // Download function with enhanced error handling
  const downloadPDF = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await registerFonts();
      await new Promise(resolve => setTimeout(resolve, 1000));

      const doc = pdf();
      let pdfGenerated = false;
      
      // Set timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF generation timed out')), 15000);
      });
      
      const generatePDF = async () => {
        let retryCount = 0;
        const maxRetries = 3;
        const delays = [1000, 2000, 3000];
        
        while (retryCount < maxRetries) {
          try {
            console.log(`PDF generation attempt ${retryCount + 1}/${maxRetries}`);
            doc.updateContainer(<PDFDocument />);
            await new Promise(resolve => setTimeout(resolve, delays[retryCount]));
            
            const blob = await doc.toBlob();
            if (!blob) throw new Error('PDF blob generation failed');
            
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement('a');
            link.href = url;
            link.download = `${name?.trim() ? name.replace(/[^a-zA-Z0-9]/g, '_') : 'resume'}-template-C.pdf`;
            
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            pdfGenerated = true;
            return;
          } catch (error) {
            console.warn(`Attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            if (retryCount === maxRetries) throw error;
          }
        }
      };

      await Promise.race([generatePDF(), timeoutPromise]);
      
      if (!pdfGenerated) {
        throw new Error('PDF generation failed after all attempts');
      }
    } catch (error) {
      console.error('PDF Generation error:', error);
      let errorMessage = 'PDF generation failed. ';
      
      const errorStr = String(error);
      if (errorStr.includes('timeout')) {
        errorMessage += 'The process took too long. Please try again.';
      } else if (errorStr.includes('blob')) {
        errorMessage += 'Failed to create PDF file. Please try again.';
      } else if (errorStr.includes('network')) {
        errorMessage += 'Please check your internet connection.';
      } else {
        errorMessage += 'An unexpected error occurred. Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isPDF) {
    return (
      <>
        <PDFDocument />
        <SuppressResumePDFErrorMessage />
      </>
    );
  }

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
            backgroundColor: isDownloading ? '#9ca3af' : (themeColor || '#0f766e'),
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
