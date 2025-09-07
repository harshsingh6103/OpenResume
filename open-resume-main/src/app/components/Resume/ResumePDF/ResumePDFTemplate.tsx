import { Page, View, Document } from "@react-pdf/renderer";
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
};
