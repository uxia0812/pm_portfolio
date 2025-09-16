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
      // 모바일: 고정 줌 + 툴바 숨김
      return `${pdfUrl}#toolbar=0&navpanes=0&zoom=50&view=Fit`;
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
      overflow: "hidden"
    }}>
      <iframe
        src={getPdfUrl()}
        style={{
          width: isMobile ? "200%" : "100%",    // 모바일에서 iframe을 크게 만들고
          height: isMobile ? "200%" : "100%",   // 높이도 크게 만든 다음
          border: "none",
          transform: isMobile ? "scale(0.5)" : "scale(1)", // 50%로 축소
          transformOrigin: "0 0",  // 좌상단 기준
        }}
        title="PM Portfolio PDF"
      />
    </div>
  );
};

export default PdfViewer;