import React, { useState, useEffect } from "react";

const PdfViewer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMethod, setViewMethod] = useState<'iframe' | 'object' | 'embed'>('iframe');
  const pdfUrl = "/pdf/pm_portfolio.pdf";

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // 모바일에서는 object 태그 사용을 우선 시도
      if (isMobileDevice) {
        setViewMethod('object');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 다양한 PDF 파라미터 조합 시도
  const getMobilePdfUrl = () => {
    const params = [
      'toolbar=0',
      'navpanes=0', 
      'scrollbar=0',
      'zoom=75',  // 고정 줌 레벨
      'view=Fit', // 페이지 맞춤
      'page=1'    // 첫 페이지
    ].join('&');
    
    return `${pdfUrl}#${params}`;
  };

  const getDesktopPdfUrl = () => {
    return `${pdfUrl}#toolbar=1&navpanes=1&zoom=page-fit`;
  };

  // 모바일에서 직접 다운로드 링크 제공
  const handleMobileDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'pm_portfolio.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Method 1: Object 태그 사용 (모바일에서 더 나은 성능)
  const renderObjectViewer = () => (
    <object
      data={isMobile ? getMobilePdfUrl() : getDesktopPdfUrl()}
      type="application/pdf"
      style={{
        width: "100%",
        height: "100%",
        border: "none"
      }}
    >
      <p>PDF를 표시할 수 없습니다. 
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          여기를 클릭하여 PDF를 다운로드하세요.
        </a>
      </p>
    </object>
  );

  // Method 2: Embed 태그 사용
  const renderEmbedViewer = () => (
    <embed
      src={isMobile ? getMobilePdfUrl() : getDesktopPdfUrl()}
      type="application/pdf"
      style={{
        width: "100%", 
        height: "100%",
        border: "none"
      }}
    />
  );

  // Method 3: 기존 iframe 방식 (CSS transform 추가)
  const renderIframeViewer = () => (
    <iframe
      src={isMobile ? getMobilePdfUrl() : getDesktopPdfUrl()}
      style={{
        width: isMobile ? "100%" : "100%",
        height: isMobile ? "100%" : "100%",
        border: "none",
        // 모바일에서 강제 스케일링
        ...(isMobile && {
          transform: "scale(0.75)",
          transformOrigin: "0 0",
          width: "133%", // scale 보정
          height: "133%" // scale 보정
        })
      }}
      title="PM Portfolio PDF"
    />
  );

  const renderViewer = () => {
    switch (viewMethod) {
      case 'object':
        return renderObjectViewer();
      case 'embed':
        return renderEmbedViewer();
      case 'iframe':
      default:
        return renderIframeViewer();
    }
  };

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0,
      overflow: "hidden",
      position: "relative"
    }}>
      
       {/* 모바일에서 뷰어 선택 및 다운로드 옵션 */}
       {isMobile && (
         <div style={{
           position: "absolute",
           top: "16px",
           right: "16px",
           zIndex: 1000,
           background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
           borderRadius: "16px",
           padding: "12px 16px",
           boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
           backdropFilter: "blur(10px)",
           border: "1px solid rgba(255,255,255,0.2)",
           display: "flex",
           flexDirection: "column",
           gap: "8px",
           minWidth: "200px"
         }}>
           <div style={{
             fontSize: "14px",
             fontWeight: "600",
             color: "#1f2937",
             marginBottom: "4px"
           }}>
             📱 PDF 뷰어
           </div>
           
           <select 
             value={viewMethod} 
             onChange={(e) => setViewMethod(e.target.value as 'iframe' | 'object' | 'embed')}
             style={{
               padding: "8px 12px",
               fontSize: "13px",
               border: "1px solid #e5e7eb",
               borderRadius: "12px",
               background: "white",
               color: "#374151",
               outline: "none",
               cursor: "pointer",
               transition: "all 0.2s ease",
               boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
             }}
             onFocus={(e) => {
               e.target.style.borderColor = "#3b82f6";
               e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
             }}
             onBlur={(e) => {
               e.target.style.borderColor = "#e5e7eb";
               e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
             }}
           >
             <option value="object">📄 Object 뷰어</option>
             <option value="iframe">🖼️ Iframe 뷰어</option>
             <option value="embed">📋 Embed 뷰어</option>
           </select>
           
           <button
             onClick={handleMobileDownload}
             style={{
               background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
               color: "white",
               border: "none",
               padding: "10px 16px",
               borderRadius: "12px",
               fontSize: "13px",
               fontWeight: "600",
               cursor: "pointer",
               transition: "all 0.2s ease",
               boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               gap: "6px"
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.transform = "translateY(-1px)";
               e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.transform = "translateY(0)";
               e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
             }}
           >
             <span>📥</span>
             <span>PDF 다운로드</span>
           </button>
         </div>
       )}

      {/* PDF 뷰어 렌더링 */}
      {renderViewer()}

       {/* 로딩/오류 시 대체 메시지 */}
       {isMobile && (
         <div style={{
           position: "absolute",
           bottom: "16px",
           left: "16px",
           right: "16px",
           textAlign: "center",
           fontSize: "12px",
           color: "#6b7280",
           background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
           padding: "12px 16px",
           borderRadius: "12px",
           boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
           backdropFilter: "blur(10px)",
           border: "1px solid rgba(255,255,255,0.2)"
         }}>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
             <span>💡</span>
             <span>PDF가 잘 안 보이시나요? 위 버튼으로 다운로드하거나 다른 뷰어를 선택해보세요.</span>
           </div>
         </div>
       )}
    </div>
  );
};

export default PdfViewer;