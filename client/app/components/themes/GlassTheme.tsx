"use client";

import { useState } from "react";
import ShareButton from "../ShareButton";
import ImageGalleryModal from "@/app/components/ImageGalleryModal";

type Project = {
  title: string;
  description: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
};

type ThemeProps = {
  portfolio: {
    title: string;
    subtitle?: string;
    bio: string;

    yearsExperience?: number;
    clientsHandled?: number;
    techStack?: string[];
    profilePhotoUrl?: string;
    resumeImageUrl?: string;
    resumeUrl?: string;
    bestProjectUrl?: string;

    titleStyle?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      fontStyle?: string;
      color?: string;
    };

    subtitleStyle?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      fontStyle?: string;
      color?: string;
    };

    bioStyle?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      fontStyle?: string;
      color?: string;
    };

    profileImageStyle?: {
      size?: string;
      shape?: 'circular' | 'square' | 'rounded' | 'hexagon' | 'pentagon' | 'octagon';
    };

    projectImageStyle?: {
      size?: string;
      shape?: 'circular' | 'square' | 'rounded' | 'hexagon' | 'pentagon' | 'octagon';
    };

    projects?: Project[];
    customFields?: Array<{
      id: string;
      type: 'paragraph' | 'orderedList' | 'unorderedList' | 'heading';
      content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      order: number;
      style?: {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: string;
        fontStyle?: string;
        color?: string;
      };
      isVisible?: boolean;
    }>;
  };
};

const getShapeStyles = (shape?: string) => {
  switch (shape) {
    case 'circular':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-2xl';
    case 'hexagon':
      return 'rounded-[30px]';
    case 'pentagon':
      return 'rounded-[20px]';
    case 'octagon':
      return 'rounded-[10px]';
    default:
      return 'rounded-full';
  }
}

const getShapeBorderRadius = (shape?: string) => {
  switch (shape) {
    case 'circular':
      return '50%';
    case 'square':
      return '0';
    case 'rounded':
      return '18px';
    default:
      return '0';
  }
};

const getShapeClip = (shape?: string) => {
  switch (shape) {
    case 'hexagon':
      return 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)';
    case 'pentagon':
      return 'polygon(50% 0%, 95% 35%, 77% 100%, 23% 100%, 5% 35%)';
    case 'octagon':
      return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)';
    default:
      return 'none';
  }
};

const getImageSize = (size?: string) => {
  switch (size) {
    case 'small':
      return 'clamp(80px, 15vw, 120px)';
    case 'medium':
      return 'clamp(100px, 18vw, 150px)';
    case 'large':
      return 'clamp(120px, 20vw, 180px)';
    case 'xlarge':
      return 'clamp(140px, 22vw, 210px)';
    default:
      return 'clamp(100px, 18vw, 150px)';
  }
}

const getProjectImageSize = (size?: string) => {
  switch (size) {
    case 'small':
      return 'clamp(120px, 20vw, 150px)';
    case 'medium':
      return 'clamp(150px, 25vw, 200px)';
    case 'large':
      return 'clamp(180px, 30vw, 250px)';
    case 'xlarge':
      return 'clamp(200px, 35vw, 300px)';
    default:
      return 'clamp(150px, 25vw, 200px)';
  }
}

const getFontFamily = (fontFamily?: string) => {
  switch (fontFamily) {
    case 'font-serif':
      return 'serif';
    case 'font-sans':
      return 'sans-serif';
    case 'font-mono':
      return 'monospace';
    case 'cursive':
      return 'cursive';
    case 'fantasy':
      return 'fantasy';
    default:
      return 'sans-serif';
  }
}

const getFontStyle = (fontStyle?: string) => {
  return fontStyle === 'italic' ? 'italic' : 'normal';
};

const renderCustomField = (field: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!field.isVisible) return null;

  const content = typeof field.content === 'string' ? field.content : '';
  const style = field.style || {};

  const baseStyle = {
    fontFamily: getFontFamily(style.fontFamily),
    fontSize: style.fontSize || 'text-base',
    fontWeight: style.fontWeight || 'font-normal',
    fontStyle: getFontStyle(style.fontStyle),
    color: style.color || '#ffffff',
  };

  switch (field.type) {
    case 'heading':
      return (
        <h2
          key={field.id}
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} mt-8 mb-4`}
          style={{
            fontFamily: baseStyle.fontFamily,
            fontStyle: baseStyle.fontStyle,
            color: baseStyle.color,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case 'paragraph':
      return (
        <p
          key={field.id}
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} leading-relaxed`}
          style={{
            fontFamily: baseStyle.fontFamily,
            fontStyle: baseStyle.fontStyle,
            color: baseStyle.color,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case 'orderedList':
      return (
        <ol
          key={field.id}
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} list-decimal list-inside`}
          style={{
            fontFamily: baseStyle.fontFamily,
            fontStyle: baseStyle.fontStyle,
            color: baseStyle.color,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    case 'unorderedList':
      return (
        <ul
          key={field.id}
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} list-disc list-inside`}
          style={{
            fontFamily: baseStyle.fontFamily,
            fontStyle: baseStyle.fontStyle,
            color: baseStyle.color,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    default:
      return null;
  }
};

const getFontSize = (fontSize?: string, fallback: string = '18px') => {
  switch (fontSize) {
    case 'text-sm':
      return 'clamp(0.75rem, 2vw, 0.875rem)';
    case 'text-base':
      return 'clamp(0.875rem, 2.5vw, 1rem)';
    case 'text-lg':
      return 'clamp(1rem, 3vw, 1.125rem)';
    case 'text-xl':
      return 'clamp(1.125rem, 3.5vw, 1.25rem)';
    case 'text-2xl':
      return 'clamp(1.25rem, 4vw, 1.5rem)';
    case 'text-3xl':
      return 'clamp(1.5rem, 5vw, 1.875rem)';
    case 'text-4xl':
      return 'clamp(1.875rem, 6vw, 2.25rem)';
    case 'text-5xl':
      return 'clamp(2.25rem, 8vw, 3rem)';
    case 'text-6xl':
      return 'clamp(3rem, 10vw, 3.75rem)';
    case 'text-7xl':
      return 'clamp(3.75rem, 12vw, 4.5rem)';
    default:
      return fallback;
  }
};

export default function GlassTheme({
  portfolio,
}: ThemeProps) {
  const portfolioUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = (images: string[], index = 0) => {
    setModalImages(images);
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)",
        padding: "clamp(20px, 5vw, 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "30px",
          padding: "clamp(20px, 5vw, 50px)",
          color: "#fff",
        }}
      >
        {/* HERO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: getFontFamily(portfolio.titleStyle?.fontFamily),
                fontStyle: getFontStyle(portfolio.titleStyle?.fontStyle),
                fontSize: getFontSize(portfolio.titleStyle?.fontSize, "64px"),
                fontWeight: portfolio.titleStyle?.fontWeight?.replace('font-', '') || 700,
                color: portfolio.titleStyle?.color || "#fff",
              }}
            >
              {portfolio.title}
            </h1>
 
            {portfolio.subtitle && (
              <p
                style={{
                  fontFamily: getFontFamily(portfolio.subtitleStyle?.fontFamily),
                  fontStyle: getFontStyle(portfolio.subtitleStyle?.fontStyle),
                  fontSize: getFontSize(portfolio.subtitleStyle?.fontSize, "24px"),
                  fontWeight: portfolio.subtitleStyle?.fontWeight?.replace('font-', '') || 400,
                  marginTop: "8px",
                  opacity: 0.8,
                  color: portfolio.subtitleStyle?.color || "#fff",
                }}
              >
                {portfolio.subtitle}
              </p>
            )}
 
            <p
              style={{
                fontFamily: getFontFamily(portfolio.bioStyle?.fontFamily),
                fontStyle: getFontStyle(portfolio.bioStyle?.fontStyle),
                marginTop: "24px",
                fontSize: getFontSize(portfolio.bioStyle?.fontSize, "18px"),
                fontWeight: portfolio.bioStyle?.fontWeight?.replace('font-', '') || 400,
                lineHeight: 1.8,
                opacity: 0.85,
                maxWidth: "700px",
                color: portfolio.bioStyle?.color || "#fff",
              }}
            >
              {portfolio.bio}
            </p>

            {/* Custom Fields */}
            {portfolio.customFields && portfolio.customFields.length > 0 && (
              <div className="mt-6">
                {portfolio.customFields
                  .sort((a, b) => a.order - b.order)
                  .map(renderCustomField)}
              </div>
            )}

            {/* Resume and Best Project Links */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              {portfolio.resumeImageUrl && (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      background: "rgba(255,255,255,0.25)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      borderRadius: "12px",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Resume
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {showResumeDropdown && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "8px",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      overflow: "hidden",
                      zIndex: 10,
                      minWidth: "180px",
                    }}>
                      <a
                        href={portfolio.resumeImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 16px",
                          color: "#1a1814",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => setShowResumeDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        View Resume
                      </a>
                      <a
                        href={portfolio.resumeImageUrl}
                        download
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 16px",
                          color: "#1a1814",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: "pointer",
                          borderTop: "1px solid rgba(0,0,0,0.1)",
                        }}
                        onClick={() => setShowResumeDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              )}
              {portfolio.bestProjectUrl && (
                <a
                  href={portfolio.bestProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    border: "1px solid rgba(255,255,255,0.5)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderRadius: "12px",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Best Project
                </a>
              )}
            </div>
          </div>
 
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            {portfolio.profilePhotoUrl && (
              <img
                src={portfolio.profilePhotoUrl}
                alt="Profile"
                style={{
                  width: getImageSize(portfolio.profileImageStyle?.size),
                  height: getImageSize(portfolio.profileImageStyle?.size),
                  borderRadius: getShapeBorderRadius(portfolio.profileImageStyle?.shape),
                  clipPath: getShapeClip(portfolio.profileImageStyle?.shape),
                  objectFit: "cover",
                  border: "4px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              />
            )}
            <ShareButton url={portfolioUrl} title={portfolio.title} />
          </div>
        </div>
 
        {/* STATS */}
        <div
          style={{
            display: "flex",
            gap: "clamp(20px, 5vw, 40px)",
            marginTop: "clamp(30px, 5vw, 50px)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.625rem)", fontWeight: 700 }}>
              {portfolio.yearsExperience || 0}+
            </div>

            <div style={{ opacity: 0.7 }}>
              Years Experience
            </div>
          </div>
 
          <div>
            <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.625rem)", fontWeight: 700 }}>
              {portfolio.clientsHandled || 0}+
            </div>

            <div style={{ opacity: 0.7 }}>
              Clients Handled
            </div>
          </div>

          <div>
            <div style={{ fontSize: "clamp(1.5rem, 5vw, 2.625rem)", fontWeight: 700 }}>
              {portfolio.projects?.length || 0}+
            </div>

            <div style={{ opacity: 0.7 }}>
              Projects
            </div>
          </div>
        </div>
 
        {/* TECH STACK */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "clamp(30px, 5vw, 40px)",
          }}
        >
          {portfolio.techStack?.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: "13px",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
 
        {/* PROJECTS */}
        <div
          style={{
            marginTop: "clamp(40px, 8vw, 70px)",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          {portfolio.projects?.map((project) => (
            <div
              key={project.title}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "24px",
              }}
            >
              {(() => {
                const imgs = project.imageUrls?.length ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
                if (imgs.length === 0) return null;
                const first = imgs[0];
                const extra = imgs.length - 1;
                return (
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => openImageModal(imgs, 0)}
                      style={{ display: 'block', width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}
                    >
                      <img
                        src={first}
                        alt={project.title}
                        style={{
                          width: '100%',
                          height: getProjectImageSize(portfolio.projectImageStyle?.size),
                          objectFit: 'cover',
                          marginBottom: '16px',
                          borderRadius: getShapeBorderRadius(portfolio.projectImageStyle?.shape),
                          clipPath: getShapeClip(portfolio.projectImageStyle?.shape),
                        }}
                      />
                    </button>
                    {extra > 0 && (
                      <button
                        type="button"
                        onClick={() => openImageModal(imgs, 0)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          bottom: 12,
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        +{extra}
                      </button>
                    )}
                  </div>
                );
              })()}
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {project.title}
              </h3>
 
              <p
                style={{
                  marginTop: "10px",
                  opacity: 0.8,
                  lineHeight: 1.7,
                }}
              >
                {project.description}
              </p>
 
              {/* TECH */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      background:
                        "rgba(255,255,255,0.15)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
 
              {/* LIVE BUTTON */}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      background: "#fff",
                      color: "#111",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    View Live Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <ImageGalleryModal
          images={modalImages}
          currentIndex={modalIndex}
          onClose={closeImageModal}
          onPrev={() => setModalIndex((current) => (current - 1 + modalImages.length) % modalImages.length)}
          onNext={() => setModalIndex((current) => (current + 1) % modalImages.length)}
        />
      )}
    </div>
  );
}