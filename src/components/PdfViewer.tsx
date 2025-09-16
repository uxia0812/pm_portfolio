import React, { useState, useEffect } from "react";

const PdfViewer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMethod, setViewMethod] = useState<'iframe' | 'object' | 'embed'>('iframe');
  const [showTip, setShowTip] = useState(true);
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
      position: "relative",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* 모바일 헤더 */}
      {isMobile && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          zIndex: 1000,
          minHeight: "60px"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>📱</span>
            <span>PM Portfolio</span>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
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
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minWidth: "120px"
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
              <option value="object">📄 Object</option>
              <option value="iframe">🖼️ Iframe</option>
              <option value="embed">📋 Embed</option>
            </select>
            
            <button
              onClick={handleMobileDownload}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
              }}
            >
              <span>📥</span>
              <span>다운로드</span>
            </button>
          </div>
        </div>
      )}

      {/* PDF 뷰어 컨테이너 */}
      <div style={{
        flex: 1,
        position: "relative",
        height: isMobile ? "calc(100vh - 60px)" : "100vh"
      }}>
        {renderViewer()}
      </div>

       {/* 로딩/오류 시 대체 메시지 */}
       {isMobile && showTip && (
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
           <button
             onClick={() => setShowTip(false)}
             style={{
               position: "absolute",
               top: "8px",
               right: "8px",
               background: "rgba(0,0,0,0.1)",
               border: "none",
               borderRadius: "50%",
               width: "24px",
               height: "24px",
               minWidth: "24px",
               minHeight: "24px",
               maxWidth: "24px",
               maxHeight: "24px",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               cursor: "pointer",
               fontSize: "14px",
               color: "#6b7280",
               transition: "all 0.2s ease",
               flexShrink: 0,
               padding: 0,
               margin: 0
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.background = "rgba(0,0,0,0.2)";
               e.currentTarget.style.color = "#374151";
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.background = "rgba(0,0,0,0.1)";
               e.currentTarget.style.color = "#6b7280";
             }}
           >
             ✕
           </button>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
             <span>💡</span>
             <span>
               PDF가 잘 안 보이시나요? <br />
               다운로드하거나 다른 뷰어를 선택해보세요.
             </span>
           </div>
         </div>
       )}
    </div>
  );
};

export default PdfViewer;