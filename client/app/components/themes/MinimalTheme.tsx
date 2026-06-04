"use client";

import { useState } from "react";
import ShareButton from "../ShareButton";
import ImageGalleryModal from "@/app/components/ImageGalleryModal";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
}

interface Portfolio {
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
    content: any;
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
}

const getShapeStyles = (shape?: string) => {
  switch (shape) {
    case 'circular':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-2xl';
    case 'hexagon':
      return 'rounded-[30px] clip-hexagon';
    case 'pentagon':
      return 'rounded-[20px] clip-pentagon';
    case 'octagon':
      return 'rounded-[10px] clip-octagon';
    default:
      return 'rounded-[40px]';
  }
};

const getImageSize = (size?: string) => {
  switch (size) {
    case 'small':
      return 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56';
    case 'medium':
      return 'w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80';
    case 'large':
      return 'w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[420px] xl:h-[420px]';
    case 'xlarge':
      return 'w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[520px] xl:h-[520px]';
    default:
      return 'w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[420px] xl:h-[420px]';
  }
};

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
      return 'serif';
  }
};

const getFontStyle = (fontStyle?: string) => {
  return fontStyle === 'italic' ? 'italic' : 'normal';
};

const getProjectImageSize = (size?: string) => {
  switch (size) {
    case 'small':
      return 'h-32 sm:h-36 md:h-40';
    case 'medium':
      return 'h-40 sm:h-48 md:h-52';
    case 'large':
      return 'h-48 sm:h-56 md:h-60';
    case 'xlarge':
      return 'h-56 sm:h-64 md:h-72';
    default:
      return 'h-40 sm:h-48 md:h-52';
  }
};

const renderCustomField = (field: any) => {
  if (!field.isVisible) return null;

  const content = typeof field.content === 'string' ? field.content : '';
  const style = field.style || {};

  const baseStyle = {
    fontFamily: getFontFamily(style.fontFamily),
    fontSize: style.fontSize || 'text-base',
    fontWeight: style.fontWeight || 'font-normal',
    fontStyle: getFontStyle(style.fontStyle),
    color: style.color || '#1a1814',
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

export default function MinimalTheme({
  portfolio,
}: {
  portfolio: Portfolio;
}) {
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
    <div className="min-h-screen bg-[#f8f6f1] text-[#1a1814]">

     {/* HERO */}
<section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20">

  <div className="flex flex-col md:flex-row items-center justify-between gap-16">

    {/* LEFT CONTENT */}
    <div className="flex-1">
      <h1 className={`${portfolio.titleStyle?.fontSize || 'text-4xl sm:text-5xl md:text-6xl'} ${portfolio.titleStyle?.fontWeight || 'font-normal'}`} style={{ fontFamily: getFontFamily(portfolio.titleStyle?.fontFamily), fontStyle: getFontStyle(portfolio.titleStyle?.fontStyle), color: portfolio.titleStyle?.color || '#1a1814' }}>
        {portfolio.title}
      </h1>

      {portfolio.subtitle && (
        <p className={`${portfolio.subtitleStyle?.fontSize || 'text-xl sm:text-2xl'} ${portfolio.subtitleStyle?.fontWeight || 'font-light'} mt-2`} style={{ fontFamily: getFontFamily(portfolio.subtitleStyle?.fontFamily), fontStyle: getFontStyle(portfolio.subtitleStyle?.fontStyle), color: portfolio.subtitleStyle?.color || '#1a1814' }}>
          {portfolio.subtitle}
        </p>
      )}

      <p className={`${portfolio.bioStyle?.fontSize || 'text-base sm:text-lg'} ${portfolio.bioStyle?.fontWeight || 'font-light'} text-[#1a1814]/60 mt-6 max-w-2xl leading-relaxed`} style={{ fontFamily: getFontFamily(portfolio.bioStyle?.fontFamily), fontStyle: getFontStyle(portfolio.bioStyle?.fontStyle), color: portfolio.bioStyle?.color || '#1a1814' }}>
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
      <div className="flex gap-4 mt-6">
        {portfolio.resumeImageUrl && (
          <div className="relative">
            <button
              onClick={() => setShowResumeDropdown(!showResumeDropdown)}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a1814] text-white rounded-full text-sm hover:bg-[#2e2a25] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Resume
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showResumeDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#e8e0d0] rounded-lg shadow-lg overflow-hidden z-10">
                <a
                  href={portfolio.resumeImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[#1a1814] hover:bg-[#f5f0e8] transition-colors"
                  onClick={() => setShowResumeDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  View Resume
                </a>
                <a
                  href={portfolio.resumeImageUrl}
                  download
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[#1a1814] hover:bg-[#f5f0e8] transition-colors border-t border-[#e8e0d0]"
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
            className="flex items-center gap-2 px-5 py-2 border-2 border-[#1a1814] text-[#1a1814] rounded-full text-sm hover:bg-[#1a1814] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Best Project
          </a>
        )}
      </div>

      {/* STATS */}
      <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-10 mt-10 sm:mt-12 md:mt-14">

        <div>
          <p className="text-3xl sm:text-4xl font-serif">
            {portfolio.yearsExperience || 0}+
          </p>

          <p className="text-sm uppercase tracking-widest text-[#1a1814]/40 mt-1">
            Years Experience
          </p>
        </div>

        <div>
          <p className="text-3xl sm:text-4xl font-serif">
            {portfolio.clientsHandled || 0}+
          </p>

          <p className="text-sm uppercase tracking-widest text-[#1a1814]/40 mt-1">
            Clients
          </p>
        </div>

        <div>
          <p className="text-3xl sm:text-4xl font-serif">
            {portfolio.projects?.length || 0}+
          </p>

          <p className="text-sm uppercase tracking-widest text-[#1a1814]/40 mt-1">
            Projects
          </p>
        </div>

      </div>

      {/* TECH STACK */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-10 sm:mt-12 md:mt-14">

        {portfolio.techStack?.map((tech) => (
          <span
            key={tech}
            className="px-4 py-2 rounded-full border border-[#d6b98c] text-sm"
          >
            {tech}
          </span>
        ))}

      </div>
    </div>

    {/* RIGHT IMAGE */}
    {portfolio.profilePhotoUrl && (
      <div className="relative">
        <img
          src={portfolio.profilePhotoUrl}
          alt="Profile"
          className={`${getImageSize(portfolio.profileImageStyle?.size)} object-cover ${getShapeStyles(portfolio.profileImageStyle?.shape)} border-4 border-[#d6b98c] shadow-xl`}
        />

        <div className="absolute top-4 right-4">
          <ShareButton url={portfolioUrl} title={portfolio.title} />
        </div>
      </div>
    )}

  </div>

</section>

      {/* PROJECTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24">

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">

          {portfolio.projects && portfolio.projects.length > 0 && (
  <div className="mt-16 sm:mt-20 md:mt-24">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1a1814] mb-8 sm:mb-10 md:mb-12">
      Featured Projects
    </h2>

    <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
      {portfolio.projects.map((project) => (
        <div
          key={project.id}
          className="border border-[#d6b98c]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white"
        >
          {(() => {
            const imgs = project.imageUrls?.length ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
            const first = imgs[0];
            const extra = imgs.length - 1;
            if (!first) return null;
            return (
              <div className="relative mb-6">
                <button
                  type="button"
                  onClick={() => openImageModal(imgs, 0)}
                  className="w-full text-left"
                >
                  <img
                    src={first}
                    alt={project.title}
                    className={`w-full ${getProjectImageSize(portfolio.projectImageStyle?.size)} object-cover ${getShapeStyles(portfolio.projectImageStyle?.shape)}`}
                  />
                </button>
                {extra > 0 && (
                  <button
                    type="button"
                    onClick={() => openImageModal(imgs, 0)}
                    className="absolute right-4 bottom-4 bg-black/70 text-white px-4 py-2 rounded-full font-semibold"
                  >
                    +{extra}
                  </button>
                )}
              </div>
            );
          })()}
          <h3 className="text-xl sm:text-2xl font-serif text-[#1a1814]">
            {project.title}
          </h3>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#1a1814]/60 leading-relaxed">
            {project.description}
          </p>

          {project.techStack?.length ? (
            <div className="flex flex-wrap gap-2 mt-5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 border border-[#d6b98c]/40 rounded-full text-sm text-[#b8925e]"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex gap-3 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1814] text-[#1a1814] rounded-full text-sm hover:bg-[#1a1814] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1814] text-white rounded-full text-sm hover:bg-[#2e2a25] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Preview
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        </div>

      </section>
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