import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { createPortal } from "react-dom";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

import {
  ZoomIn,
  ZoomOut,
  Play,
  ChevronLeft,
  ChevronRight,
  Copy,
  Minus,
} from "lucide-react";

const DocumentWidget = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [pdfPages, setPdfPages] = useState([]);

  const flipBookRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocuments();
  }, []);

  /* =========================
     LOAD PDF -> TÁCH PAGE
  ========================= */

  const loadPdf = async (url) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const pages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        pages.push(canvas.toDataURL());
      }

      setPdfPages(pages);
    } catch (err) {
      console.error("PDF load error:", err);
    }
  };

  useEffect(() => {
    if (selectedDoc?.file_path) {
      loadPdf(selectedDoc.file_path);
    }
  }, [selectedDoc]);

  /* =========================
     ZOOM
  ========================= */

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  /* =========================
     AUTOPLAY
  ========================= */

  useEffect(() => {
    let interval;

    if (isAutoPlay) {
      interval = setInterval(() => {
        if (flipBookRef.current) {
          const pageFlip = flipBookRef.current.pageFlip();

          if (pageFlip.getCurrentPageIndex() < pageFlip.getPageCount() - 1) {
            pageFlip.flipNext();
          } else {
            setIsAutoPlay(false);
          }
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     OPEN MODAL
  ========================= */

  const handleViewDetail = (e, doc) => {
    e.preventDefault();

    setPdfPages([]); // reset pages
    setSelectedDoc(doc);
  };

  const closeModal = () => {
    setSelectedDoc(null);
    setPdfPages([]);
  };

  /* =========================
     FLIPBOOK NAV
  ========================= */

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const portalNode =
    typeof document !== "undefined"
      ? document.getElementById("portal-root")
      : null;

  return (
    <div className="sidebar-widget docs-widget">
      <h3 className="widget-title">Văn bản chỉ đạo</h3>

      <div className="marquee-vertical">
        <div className="marquee-vertical-content">
          {documents.map((doc) => (
            <div key={doc.id ?? doc.number} className="doc-item hover-lift">
              <span className="doc-number">{doc.number}</span>

              <p className="doc-excerpt">{doc.excerpt}</p>

              <div className="doc-meta">
                <span>{doc.date}</span>

                <a
                  href="#"
                  className="read-more"
                  onClick={(e) => handleViewDetail(e, doc)}
                >
                  Xem chi tiết &gt;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mounted &&
        selectedDoc &&
        portalNode &&
        createPortal(
          <div className="flipbook-modal-overlay" onClick={closeModal}>
            <div
              className="flipbook-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* TOOLBAR */}

              <div className="flipbook-toolbar">
                <div className="toolbar-group">
                  <button onClick={handleZoomOut}>
                    <ZoomOut size={18} />
                  </button>

                  <button onClick={handleZoomIn}>
                    <ZoomIn size={18} />
                  </button>
                </div>

                <div className="toolbar-group">
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    style={{ color: isAutoPlay ? "#007bff" : "inherit" }}
                  >
                    <Play size={18} />
                  </button>
                </div>

                <div className="toolbar-group">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Đã sao chép liên kết!");
                    }}
                  >
                    <Copy size={18} />
                  </button>

                  <button onClick={closeModal}>
                    <Minus size={18} />
                  </button>
                </div>
              </div>

              {/* VIEWPORT */}

              <div className="flipbook-viewport">
                <button className="nav-btn prev" onClick={prevPage}>
                  <ChevronLeft size={48} />
                </button>

                <div
                  className="book-wrapper"
                  style={{ transform: `scale(${zoom})` }}
                >
                  {/* PDF MODE */}

                  {selectedDoc?.file_path ? (
                    pdfPages.length === 0 ? (
                      <div
                        style={{
                          width: 400,
                          height: 550,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fff",
                        }}
                      >
                        Đang tải PDF...
                      </div>
                    ) : (
                      <HTMLFlipBook
                        key={selectedDoc.file_path}
                        width={400}
                        height={550}
                        ref={flipBookRef}
                        showCover={true}
                      >
                        {pdfPages.map((img, index) => (
                          <div className="page" key={index}>
                            <img
                              src={img}
                              alt={"page-" + index}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        ))}
                      </HTMLFlipBook>
                    )
                  ) : (
                    /* TEXT MODE */

                    <HTMLFlipBook
                      width={400}
                      height={550}
                      ref={flipBookRef}
                      showCover={true}
                    >
                      <div className="page page-cover">
                        <div className="page-inner">
                          <h3>{selectedDoc.number}</h3>

                          <hr />

                          <p>Ngày ban hành: {selectedDoc.date}</p>

                          <div className="stamp">VĂN BẢN QUẢN LÝ</div>
                        </div>
                      </div>

                      <div className="page">
                        <div className="page-inner">
                          <h4>Nội dung trích yếu</h4>

                          <p className="excerpt-text">
                            {selectedDoc.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="page page-cover">
                        <div className="page-inner">
                          <p>Hết nội dung văn bản.</p>

                          <div className="footer-logo">
                            Bản đồ số Tuyên Quang
                          </div>
                        </div>
                      </div>
                    </HTMLFlipBook>
                  )}
                </div>

                <button className="nav-btn next" onClick={nextPage}>
                  <ChevronRight size={48} />
                </button>
              </div>

              <div className="modal-footer-hint">
                Sử dụng nút bấm hoặc kéo góc trang để lật
              </div>
            </div>
          </div>,
          portalNode
        )}
    </div>
  );
};

export default DocumentWidget;