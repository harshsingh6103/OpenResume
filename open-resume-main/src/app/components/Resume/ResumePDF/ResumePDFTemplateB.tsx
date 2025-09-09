// Template B - Professional Two Column Layout
import { Page, View, Document, Font, pdf } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import type { Settings } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
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

export const ResumePDFTemplateB = ({
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
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || "#2563eb";
  const [isDownloading, setIsDownloading] = useState(false);

  // PDF Document Component
  const PDFDocument = () => (
    <Document title={`${name} Resume`} author={name} producer="OpenResume">
      <Page
        size={documentSize === "A4" ? "A4" : "LETTER"}
        style={{
          ...styles.flexCol,
          backgroundColor: "#fff",
          color: "#1a1a1a",
          fontFamily: "Source Sans Pro",
          fontSize: fontSize + "pt",
          padding: spacing[8],
        }}
      >
        {/* Modern Header with Profile */}
        <View style={{
          backgroundColor: `${themeColor}08`,
          borderRadius: spacing[2],
          padding: spacing[8],
          marginBottom: spacing[8],
          borderLeft: `4pt solid ${themeColor}`,
        }}>
          <ResumePDFProfile profile={profile} themeColor={themeColor} isPDF={true} />
        </View>

        {/* Main Content Area with Two Columns */}
        <View style={{
          flexDirection: "row",
          gap: spacing[8],
        }}>
          {/* Left Column - Experience & Education */}
          <View style={{
            width: "65%",
            gap: spacing[6],
          }}>
            {formToShow["workExperiences"] && (
              <View style={{
                backgroundColor: "#ffffff",
                padding: spacing[6],
                borderRadius: spacing[2],
                borderBottom: `2pt solid ${themeColor}20`,
              }}>
                <ResumePDFWorkExperience
                  heading={formToHeading["workExperiences"]}
                  workExperiences={workExperiences}
                  themeColor={themeColor}
                />
              </View>
            )}
            {formToShow["educations"] && (
              <View style={{
                backgroundColor: "#ffffff",
                padding: spacing[6],
                borderRadius: spacing[2],
                borderBottom: `2pt solid ${themeColor}20`,
              }}>
                <ResumePDFEducation
                  heading={formToHeading["educations"]}
                  educations={educations}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["educations"]}
                />
              </View>
            )}
            {formToShow["projects"] && (
              <View style={{
                backgroundColor: "#ffffff",
                padding: spacing[6],
                borderRadius: spacing[2],
                borderBottom: `2pt solid ${themeColor}20`,
              }}>
                <ResumePDFProject
                  heading={formToHeading["projects"]}
                  projects={projects}
                  themeColor={themeColor}
                />
              </View>
            )}
          </View>

          {/* Right Column - Skills & Custom */}
          <View style={{
            width: "35%",
            gap: spacing[6],
            borderLeft: `2pt solid ${themeColor}20`,
            paddingLeft: spacing[6],
          }}>
            {formToShow["skills"] && (
              <View style={{
                backgroundColor: `${themeColor}08`,
                padding: spacing[6],
                borderRadius: spacing[2],
              }}>
                <ResumePDFSkills
                  heading={formToHeading["skills"]}
                  skills={skills}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["skills"]}
                />
              </View>
            )}
            {formToShow["custom"] && (
              <View style={{
                backgroundColor: `${themeColor}08`,
                padding: spacing[6],
                borderRadius: spacing[2],
              }}>
                <ResumePDFCustom
                  heading={formToHeading["custom"]}
                  custom={custom}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["custom"]}
                />
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );

  // Download function with retry logic
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
          link.download = `${name?.trim() ? name.replace(/[^a-zA-Z0-9]/g, '_') : 'resume'}-template-B.pdf`;
          
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
            backgroundColor: isDownloading ? '#9ca3af' : (themeColor || '#2563eb'),
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