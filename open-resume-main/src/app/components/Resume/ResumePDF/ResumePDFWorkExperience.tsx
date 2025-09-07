import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View 
            key={idx} 
            style={{
              marginTop: idx !== 0 ? spacing[4] : 0,
              paddingBottom: spacing[3],
              borderBottom: idx !== workExperiences.length - 1 ? "0.5pt solid #e5e7eb" : "none"
            }}
          >
            {!hideCompanyName && (
              <ResumePDFText 
                style={{ 
                  fontSize: "12pt",
                  color: themeColor,
                  marginBottom: spacing[1]
                }}
              >
                {company}
              </ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginBottom: spacing[2],
              }}
            >
              <ResumePDFText style={{ fontWeight: "bold" }}>{jobTitle}</ResumePDFText>
              <ResumePDFText style={{ color: "#4b5563" }}>{date}</ResumePDFText>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
