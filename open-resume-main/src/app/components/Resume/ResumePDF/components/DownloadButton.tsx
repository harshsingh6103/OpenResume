import React from 'react';
import { pdf } from "@react-pdf/renderer";

interface DownloadButtonProps {
  PDFDocument: React.FC;
  fileName: string;
  themeColor: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  PDFDocument, 
  fileName, 
  themeColor 
}) => {
  const downloadPDF = async () => {
    try {
      const pdfDoc = pdf();
      pdfDoc.updateContainer(<PDFDocument />);
      const blob = await pdfDoc.toBlob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again or check console for errors.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={downloadPDF}
        style={{
          backgroundColor: themeColor,
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};
