import React from "react";

const PdfViewer: React.FC = () => {
  const pdfUrl = "/pdf/pm_portfolio.pdf#toolbar=0&zoom=page-fit";

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <iframe
        src={pdfUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="PM Portfolio PDF"
      />
    </div>
  );
};

export default PdfViewer;