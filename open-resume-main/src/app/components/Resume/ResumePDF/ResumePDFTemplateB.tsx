import { Page, View, Document } from "@react-pdf/renderer";
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

  const themeColor = settings.themeColor || "#2563eb"; // Professional blue

  return (
    <>
      <Document title={`${name} Resume`} author={name}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            flexDirection: "column",
            backgroundColor: "#fff",
            color: "#1a1a1a",
            fontFamily,
            fontSize: fontSize + "pt",
            padding: spacing[6],
          }}
        >
          {/* ===== Header ===== */}
          <View
            style={{
              padding: spacing[10],
              paddingBottom: spacing[6],
              borderBottom: `2pt solid ${themeColor}`,
              marginBottom: spacing[8],
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
            {/* Sidebar (Left, 30%) */}
            <View
              style={{
                width: "30%",
                backgroundColor: "#f8fafc",
                padding: spacing[6],
                borderRight: `2pt solid ${themeColor}`,
                minHeight: 400,
              }}
            >
              {formToShow["skills"] && (
                <ResumePDFSkills
                  heading={formToHeading["skills"]}
                  skills={skills}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["skills"]}
                />
              )}
              {formToShow["custom"] && (
                <ResumePDFCustom
                  heading={formToHeading["custom"]}
                  custom={custom}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["custom"]}
                />
              )}
            </View>

            {/* Main Content (Right, 70%) */}
            <View style={{ width: "70%", paddingLeft: spacing[6] }}>
              {formToShow["workExperiences"] && (
                <ResumePDFWorkExperience
                  heading={formToHeading["workExperiences"]}
                  workExperiences={workExperiences}
                  themeColor={themeColor}
                />
              )}
              {formToShow["educations"] && (
                <ResumePDFEducation
                  heading={formToHeading["educations"]}
                  educations={educations}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["educations"]}
                />
              )}
              {formToShow["projects"] && (
                <ResumePDFProject
                  heading={formToHeading["projects"]}
                  projects={projects}
                  themeColor={themeColor}
                />
              )}
            </View>
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
