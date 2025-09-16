import React, { useState, useEffect } from "react";

const PdfViewer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pdfUrl = "/pdf/pm_portfolio.pdf";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getPdfUrl = () => {
    if (isMobile) {
      // 모바일: 전체 문서 보기 + 스크롤 가능
      return `${pdfUrl}#toolbar=0&navpanes=0&zoom=page-width&scrollbar=1&view=FitV`;
    } else {
      // 데스크톱: 기본 설정
      return `${pdfUrl}#toolbar=0&zoom=page-fit`;
    }
  };

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0,
      overflow: isMobile ? "auto" : "hidden"
    }}>
      <iframe
        src={getPdfUrl()}
        style={{
          width: "100%",
          height: isMobile ? "auto" : "100%",
          minHeight: isMobile ? "100vh" : "100%",
          border: "none",
          display: "block"
        }}
        title="PM Portfolio PDF"
      />
    </div>
  );
};

export default PdfViewer;