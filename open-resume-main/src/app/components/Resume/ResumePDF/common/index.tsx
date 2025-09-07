// src/app/components/Resume/ResumePDF/common/index.tsx - Updated for compact layout
import { Text, View, Link } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: any;
  children: React.ReactNode;
}) => {
  return (
    <View
      style={{
        ...styles.flexCol,
        gap: spacing["2"], // Reduced gap for compact layout
        marginTop: spacing["3"], // Reduced margin
        ...style,
      }}
    >
      {heading && (
        <View
          style={{
            borderBottom: `1.5pt solid ${themeColor || DEFAULT_FONT_COLOR}`, // Thinner border
            marginBottom: spacing["1.5"], // Reduced margin
            paddingBottom: spacing["1"], // Reduced padding
          }}
        >
          <Text
            style={{
              fontSize: "11pt", // Reduced from 14pt
              fontWeight: "bold",
              color: themeColor || DEFAULT_FONT_COLOR,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {heading}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: any;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        color: themeColor || "#1f2937",
        fontWeight: bold ? 700 : 400,
        fontSize: "9pt", // Reduced font size for more content
        letterSpacing: "0.2pt", // Reduced letter spacing
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow, marginBottom: spacing[1] }} key={idx}> {/* Reduced margin */}
          {showBulletPoints && (
            <ResumePDFText
              style={{
                paddingLeft: spacing[1.5], // Reduced padding
                paddingRight: spacing[1.5], // Reduced padding
                color: "#6b7280",
                fontSize: "8pt", // Smaller bullet
              }}
              bold={true}
            >
              {"•"}
            </ResumePDFText>
          )}
          <ResumePDFText
            style={{ 
              flexGrow: 1,
              flexBasis: 0,
              color: "#374151",
              fontSize: "8pt", // Reduced font size
              letterSpacing: "0.2pt",
            }}
          >
            {item}
          </ResumePDFText>
        </View>
      ))}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: any;
}) => {
  const numCircles = 5;
  const skillColor = themeColor || "#2563eb";

  return (
    <View style={{ 
      ...styles.flexRow, 
      alignItems: "center",
      backgroundColor: `${skillColor}10`,
      padding: `${spacing[0.5]} ${spacing[1.5]}`, // Reduced padding
      borderRadius: "3pt",
      marginBottom: spacing[1], // Added margin for spacing
      ...style 
    }}>
      <ResumePDFText 
        style={{ 
          marginRight: spacing[1.5], // Reduced margin
          color: skillColor,
          fontWeight: "bold",
          fontSize: "8pt", // Reduced font size
        }}
      >
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "5pt", // Reduced size
            width: "5pt", // Reduced size
            marginLeft: "1.5pt", // Reduced margin
            backgroundColor: rating >= idx ? skillColor : "#e5e7eb",
            borderRadius: "100%",
            opacity: rating >= idx ? 1 : 0.5,
          }}
        />
      ))}
    </View>
  );
};