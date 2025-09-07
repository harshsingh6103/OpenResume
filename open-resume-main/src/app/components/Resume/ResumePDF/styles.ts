// src/app/components/Resume/ResumePDF/styles.ts - Updated for better single page layout
import { StyleSheet } from "@react-pdf/renderer";

// More compact spacing system optimized for single page
export const spacing = {
  0: "0",
  0.5: "1pt",
  1: "2pt",      // Reduced from 3pt
  1.5: "3pt",    // Reduced from 4.5pt
  2: "4pt",      // Reduced from 6pt
  2.5: "5pt",    // Reduced from 7.5pt
  3: "6pt",      // Reduced from 9pt
  3.5: "7pt",    // Reduced from 10.5pt
  4: "8pt",      // Reduced from 12pt
  5: "10pt",     // Reduced from 15pt
  6: "12pt",     // Reduced from 18pt
  7: "14pt",     // Reduced from 21pt
  8: "16pt",     // Reduced from 24pt
  9: "18pt",     // Reduced from 27pt
  10: "20pt",    // Reduced from 30pt
  11: "22pt",    // Reduced from 33pt
  12: "24pt",    // Reduced from 36pt
  14: "28pt",    // Reduced from 42pt
  16: "32pt",    // Reduced from 48pt
  20: "40pt",    // Reduced from 60pt
  24: "48pt",    // Reduced from 72pt
  28: "56pt",    // Reduced from 84pt
  32: "64pt",    // Reduced from 96pt
  36: "72pt",    // Reduced from 108pt
  40: "80pt",    // Reduced from 120pt
  44: "88pt",    // Reduced from 132pt
  48: "96pt",    // Reduced from 144pt
  52: "104pt",   // Reduced from 156pt
  56: "112pt",   // Reduced from 168pt
  60: "120pt",   // Reduced from 180pt
  64: "128pt",   // Reduced from 192pt
  72: "144pt",   // Reduced from 216pt
  80: "160pt",   // Reduced from 240pt
  96: "192pt",   // Reduced from 288pt
  full: "100%",
} as const;

export const styles = StyleSheet.create({
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexRowBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
    gap: spacing["1.5"], // Reduced gap for more compact layout
  },
  pageTitle: {
    fontSize: "18pt", // Reduced from 24pt
    fontWeight: "bold",
    marginBottom: spacing[2], // Reduced margin
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: "11pt", // Reduced from 14pt
    fontWeight: "bold",
    marginBottom: spacing[2], // Reduced margin
    color: "#2563eb", 
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: spacing[1], // Reduced padding
  },
  icon: {
    width: "10pt", // Reduced from 12pt
    height: "10pt", // Reduced from 12pt
    fill: "#4b5563",
  },
});