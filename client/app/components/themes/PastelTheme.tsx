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

const PASTEL_COLORS = [
  { bg: "bg-[#ffd6e7]", border: "border-[#ffb3ce]", text: "text-[#c9477a]" },
  { bg: "bg-[#d6f0ff]", border: "border-[#a3d9ff]", text: "text-[#2d7dbd]" },
  { bg: "bg-[#d6ffd6]", border: "border-[#a3e6a3]", text: "text-[#2d7d3a]" },
  { bg: "bg-[#fff0d6]", border: "border-[#ffd6a3]", text: "text-[#b06a1a]" },
  { bg: "bg-[#ead6ff]", border: "border-[#d0a3ff]", text: "text-[#7a3abf]" },
  { bg: "bg-[#ffecd6]", border: "border-[#ffd1a3]", text: "text-[#c05a1a]" },
];

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

const getProjectImageSize = (size?: string) => {
  switch (size) {
    case 'small':
      return '150px';
    case 'medium':
      return '200px';
    case 'large':
      return '250px';
    case 'xlarge':
      return '300px';
    default:
      return '200px';
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
      return 'sans-serif';
  }
};

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
    color: style.color || '#333333',
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

export default function PastelTheme({ portfolio }: ThemeProps) {
  const portfolioUrl = typeof window !== "undefined" ? window.location.href : "";
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
const [modalIndex, setModalIndex] = useState(0);
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
    <div className="min-h-screen bg-[#fffdf9] text-[#2d2416]">

      {/* Decorative top strip */}
      <div className="h-2 w-full flex">
        {PASTEL_COLORS.map((c, i) => (
          <div key={i} className={`flex-1 ${c.bg}`} />
        ))}
      </div>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Profile photo */}
          {portfolio.profilePhotoUrl && (
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#ffd6e7] scale-110 blur-2xl opacity-60" />
              <img
                src={portfolio.profilePhotoUrl}
                alt="Profile"
                className="relative w-56 h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                <ShareButton url={portfolioUrl} title={portfolio.title} />
              </div>
            </div>
          )}

          {/* Right: Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-[#ffd6e7] text-[#c9477a] px-4 py-1 rounded-full text-sm font-medium mb-4">
              ✦ Portfolio
            </div>
            <h1 className="text-5xl font-bold leading-tight text-[#2d2416]">
              {portfolio.title}
            </h1>
            {portfolio.subtitle && (
              <p className="text-lg text-[#2d2416]/60 mt-2">{portfolio.subtitle}</p>
            )}
            <p className="text-base text-[#2d2416]/60 mt-5 leading-relaxed max-w-xl">
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

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-7 justify-center md:justify-start">
              {portfolio.resumeImageUrl && (
                <div className="relative">
                  <button
                    onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2d2416] text-white text-sm font-medium hover:bg-[#3d3020] transition-colors shadow-md"
                  >
                    📄 Resume ▾
                  </button>
                  {showResumeDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-[#e8e0d8] rounded-2xl shadow-xl overflow-hidden z-10 min-w-[150px]">
                      <a href={portfolio.resumeImageUrl} target="_blank" rel="noopener noreferrer"
                        className="block px-4 py-3 text-sm hover:bg-[#ffd6e7]/30 transition-colors"
                        onClick={() => setShowResumeDropdown(false)}>View Resume</a>
                      <a href={portfolio.resumeImageUrl} download
                        className="block px-4 py-3 text-sm hover:bg-[#ffd6e7]/30 transition-colors border-t border-[#e8e0d8]"
                        onClick={() => setShowResumeDropdown(false)}>Download</a>
                    </div>
                  )}
                </div>
              )}
              {portfolio.bestProjectUrl && (
                <a href={portfolio.bestProjectUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#d6f0ff] text-[#2d7dbd] text-sm font-medium hover:bg-[#bee5ff] transition-colors shadow-md">
                  ★ Best Project
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mt-14">
          {[
            { value: `${portfolio.yearsExperience || 0}+`, label: "Years Experience", color: PASTEL_COLORS[0] },
            { value: `${portfolio.clientsHandled || 0}+`, label: "Happy Clients", color: PASTEL_COLORS[1] },
            { value: `${portfolio.projects?.length || 0}+`, label: "Projects Done", color: PASTEL_COLORS[4] },
          ].map((s) => (
            <div key={s.label} className={`${s.color.bg} border-2 ${s.color.border} rounded-3xl p-6 text-center`}>
              <p className={`text-4xl font-bold ${s.color.text}`}>{s.value}</p>
              <p className="text-sm text-[#2d2416]/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        {portfolio.techStack && portfolio.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 justify-center md:justify-start">
            {portfolio.techStack.map((tech, i) => {
              const c = PASTEL_COLORS[i % PASTEL_COLORS.length];
              return (
                <span key={tech} className={`px-4 py-2 rounded-full ${c.bg} border-2 ${c.border} ${c.text} text-sm font-medium`}>
                  {tech}
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* PROJECTS */}
      {portfolio.projects && portfolio.projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 pb-24">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#d6f0ff] text-[#2d7dbd] px-4 py-1 rounded-full text-sm font-medium mb-3">
              ✦ Work
            </div>
            <h2 className="text-4xl font-bold text-[#2d2416]">Featured Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.projects.map((project, i) => {
              const c = PASTEL_COLORS[i % PASTEL_COLORS.length];
              return (
                <div key={project.id} className={`${c.bg} border-2 ${c.border} rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-200 shadow-md`}>
                  {(() => {
  const imgs = project.imageUrls?.length
    ? project.imageUrls
    : project.imageUrl
    ? [project.imageUrl]
    : [];

  if (!imgs.length) return null;

  const extra = imgs.length - 1;

  return (
    <div className="relative overflow-hidden">
      <button
        type="button"
        onClick={() => openImageModal(imgs, 0)}
        className="w-full"
      >
        <img
          src={imgs[0]}
          alt={project.title}
          style={{
            height: getProjectImageSize(portfolio.projectImageStyle?.size),
            borderRadius: getShapeBorderRadius(portfolio.projectImageStyle?.shape),
            clipPath: getShapeClip(portfolio.projectImageStyle?.shape),
          }}
          className="w-full object-cover"
        />
      </button>

      {extra > 0 && (
        <button
          type="button"
          onClick={() => openImageModal(imgs, 0)}
          className="absolute right-3 bottom-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold"
        >
          +{extra}
        </button>
      )}
    </div>
  );
})()}
                  <div className="p-5">
                    <h3 className={`text-lg font-bold ${c.text}`}>{project.title}</h3>
                    <p className="mt-2 text-sm text-[#2d2416]/60 leading-relaxed line-clamp-3">{project.description}</p>
                    {project.techStack?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="px-2.5 py-0.5 rounded-full bg-white/60 text-xs font-medium text-[#2d2416]/70">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex gap-2 mt-4">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 text-center py-2 rounded-2xl bg-white/60 text-xs font-medium text-[#2d2416]/70 hover:bg-white transition-colors">
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className={`flex-1 text-center py-2 rounded-2xl bg-white text-xs font-bold ${c.text} hover:opacity-80 transition-opacity shadow-sm`}>
                          Live ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom strip */}
      <div className="h-2 w-full flex">
        {[...PASTEL_COLORS].reverse().map((c, i) => (
          <div key={i} className={`flex-1 ${c.bg}`} />
        ))}
      </div>

      {isModalOpen && (
  <ImageGalleryModal
    images={modalImages}
    currentIndex={modalIndex}
    onClose={closeImageModal}
    onPrev={() =>
      setModalIndex(
        (current) =>
          (current - 1 + modalImages.length) %
          modalImages.length
      )
    }
    onNext={() =>
      setModalIndex(
        (current) =>
          (current + 1) % modalImages.length
      )
    }
  />
)}

    </div>
  );
}