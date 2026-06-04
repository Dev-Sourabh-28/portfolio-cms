"use client";

import { useState } from "react";
import ShareButton from "../ShareButton";
import ImageGalleryModal from "@/app/components/ImageGalleryModal";

type Project = {
  id?: string;
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
      shape?:
        | "circular"
        | "square"
        | "rounded"
        | "hexagon"
        | "pentagon"
        | "octagon";
    };

    projectImageStyle?: {
      size?: string;
      shape?:
        | "circular"
        | "square"
        | "rounded"
        | "hexagon"
        | "pentagon"
        | "octagon";
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
    color: style.color || '#000000',
  };

  switch (field.type) {
    case 'heading':
      return (
        <h2
          key={field.id}
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} mt-8 mb-4 border-l-4 border-black pl-4`}
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
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} leading-relaxed border-l-2 border-black/20 pl-4`}
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
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} list-decimal list-inside border-l-2 border-black/20 pl-4`}
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
          className={`${baseStyle.fontSize} ${baseStyle.fontWeight} list-disc list-inside border-l-2 border-black/20 pl-4`}
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

export default function BrutalistTheme({ portfolio }: ThemeProps) {
  const portfolioUrl = typeof window !== "undefined" ? window.location.href : "";
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
const [modalIndex, setModalIndex] = useState(0);
const [isModalOpen, setIsModalOpen] = useState(false);

const openImageModal = (
  images: string[],
  index = 0
) => {
  setModalImages(images);
  setModalIndex(index);
  setIsModalOpen(true);
};

const closeImageModal = () => {
  setIsModalOpen(false);
};

  return (
    <div className="min-h-screen bg-[#f0ebe3] text-[#0a0a0a] font-mono">

      {/* TOP TICKER BAR */}
      <div className="bg-[#0a0a0a] text-[#f0ebe3] py-2 overflow-hidden">
        <div className="flex gap-12 animate-none whitespace-nowrap px-6 text-xs uppercase tracking-widest">
          {Array(6).fill(`${portfolio.title} — ${portfolio.subtitle || "Portfolio"} — Available for hire —`).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="border-b-4 border-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          {/* Big name header */}
          <div className="border-b-4 border-[#0a0a0a] px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
  <h1
    className="uppercase leading-none tracking-tighter"
    style={{
      fontFamily: getFontFamily(
        portfolio.titleStyle?.fontFamily
      ),
      fontStyle: getFontStyle(
        portfolio.titleStyle?.fontStyle
      ),
      fontSize: getFontSize(
        portfolio.titleStyle?.fontSize,
        "clamp(3rem,10vw,8rem)"
      ),
      fontWeight:
        portfolio.titleStyle?.fontWeight?.replace(
          "font-",
          ""
        ) || 900,
      color:
        portfolio.titleStyle?.color ||
        "#0a0a0a",
    }}
  >
    {portfolio.title}
  </h1>

  {portfolio.subtitle && (
    <p
      style={{
        fontFamily: getFontFamily(
          portfolio.subtitleStyle?.fontFamily
        ),
        fontStyle: getFontStyle(
          portfolio.subtitleStyle?.fontStyle
        ),
        fontSize: getFontSize(
          portfolio.subtitleStyle?.fontSize,
          "20px"
        ),
        fontWeight:
          portfolio.subtitleStyle?.fontWeight?.replace(
            "font-",
            ""
          ) || 700,
        color:
          portfolio.subtitleStyle?.color ||
          "rgba(10,10,10,.5)",
      }}
      className="uppercase tracking-widest mt-2"
    >
      {portfolio.subtitle}
    </p>
  )}
</div>

          {/* Grid split */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] min-h-[300px] md:min-h-[380px]">

            {/* Left: Bio + Stats */}
            <div className="border-r-0 md:border-r-4 border-[#0a0a0a] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <p
  style={{
    fontFamily: getFontFamily(
      portfolio.bioStyle?.fontFamily
    ),
    fontStyle: getFontStyle(
      portfolio.bioStyle?.fontStyle
    ),
    fontSize: getFontSize(
      portfolio.bioStyle?.fontSize,
      "16px"
    ),
    fontWeight:
      portfolio.bioStyle?.fontWeight?.replace(
        "font-",
        ""
      ) || 400,
    color:
      portfolio.bioStyle?.color ||
      "rgba(10,10,10,.7)",
  }}
  className="leading-relaxed max-w-lg"
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

              {/* Stats row */}
              <div className="flex gap-0 mt-6 sm:mt-8 border-t-4 border-[#0a0a0a] pt-6 sm:pt-8">
                {[
                  { value: `${portfolio.yearsExperience || 0}`, label: "YRS EXP" },
                  { value: `${portfolio.clientsHandled || 0}`, label: "CLIENTS" },
                  { value: `${portfolio.projects?.length || 0}`, label: "PROJECTS" },
                ].map((s, i) => (
                  <div key={s.label} className={`flex-1 px-2 sm:px-4 ${i > 0 ? "border-l-4 border-[#0a0a0a]" : ""}`}>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black">{s.value}</p>
                    <p className="text-[10px] sm:text-xs font-bold tracking-widest mt-1 text-[#0a0a0a]/50">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-8">
                {portfolio.resumeImageUrl && (
                  <div className="relative">
                    <button
                      onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-[#f0ebe3] text-sm font-bold uppercase tracking-widest border-2 border-[#0a0a0a] hover:bg-[#f0ebe3] hover:text-[#0a0a0a] transition-colors"
                    >
                      Resume ↓
                    </button>
                    {showResumeDropdown && (
                      <div className="absolute top-full left-0 mt-0 bg-[#f0ebe3] border-2 border-[#0a0a0a] z-10 min-w-[160px]">
                        <a href={portfolio.resumeImageUrl} target="_blank" rel="noopener noreferrer"
                          className="block px-4 py-3 text-sm font-bold uppercase hover:bg-[#0a0a0a] hover:text-[#f0ebe3] transition-colors border-b-2 border-[#0a0a0a]"
                          onClick={() => setShowResumeDropdown(false)}>View</a>
                        <a href={portfolio.resumeImageUrl} download
                          className="block px-4 py-3 text-sm font-bold uppercase hover:bg-[#0a0a0a] hover:text-[#f0ebe3] transition-colors"
                          onClick={() => setShowResumeDropdown(false)}>Download</a>
                      </div>
                    )}
                  </div>
                )}
                {portfolio.bestProjectUrl && (
                  <a href={portfolio.bestProjectUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0a0a0a] text-sm font-bold uppercase tracking-widest hover:bg-[#0a0a0a] hover:text-[#f0ebe3] transition-colors">
                    ★ Best Project
                  </a>
                )}
              </div>
            </div>

            {/* Right: Photo */}
            {portfolio.profilePhotoUrl && (
              <div className="relative overflow-hidden">
                <img
  src={portfolio.profilePhotoUrl}
  alt="Profile"
  style={{
    width: getImageSize(
      portfolio.profileImageStyle?.size
    ),
    height: getImageSize(
      portfolio.profileImageStyle?.size
    ),
    borderRadius: getShapeBorderRadius(
      portfolio.profileImageStyle?.shape
    ),
    clipPath: getShapeClip(
      portfolio.profileImageStyle?.shape
    ),
    minHeight: "300px",
  }}
  className="w-full h-full object-cover grayscale"
/>
                <div className="absolute inset-0 mix-blend-multiply bg-[#f0ebe3]/20" />
                <div className="absolute top-4 right-4">
                  <ShareButton url={portfolioUrl} title={portfolio.title} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      {portfolio.techStack && portfolio.techStack.length > 0 && (
        <section className="border-b-4 border-[#0a0a0a] max-w-6xl mx-auto">
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0a0a0a]/40 mb-4">Stack</p>
            <div className="flex flex-wrap gap-0">
              {portfolio.techStack.map((tech, i) => (
                <span key={tech} className={`px-4 py-2 text-sm font-bold uppercase border-2 border-[#0a0a0a] -ml-[2px] hover:bg-[#0a0a0a] hover:text-[#f0ebe3] transition-colors cursor-default ${i === 0 ? "ml-0" : ""}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {portfolio.projects && portfolio.projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
          <div className="flex items-baseline gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase">Projects</h2>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a0a0a]/20">({portfolio.projects.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t-4 border-l-4 border-[#0a0a0a]">
            {portfolio.projects.map((project) => (
              <div key={project.id} className="border-b-4 border-r-4 border-[#0a0a0a] p-4 sm:p-6 hover:bg-[#0a0a0a] hover:text-[#f0ebe3] group transition-colors">
                {(() => {
  const imgs = project.imageUrls?.length
    ? project.imageUrls
    : project.imageUrl
    ? [project.imageUrl]
    : [];

  if (!imgs.length) return null;

  const extra = imgs.length - 1;

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => openImageModal(imgs, 0)}
        className="block w-full"
      >
        <img
          src={imgs[0]}
          alt={project.title}
          style={{
            height: getProjectImageSize(
              portfolio.projectImageStyle?.size
            ),
            borderRadius:
              getShapeBorderRadius(
                portfolio.projectImageStyle?.shape
              ),
            clipPath: getShapeClip(
              portfolio.projectImageStyle?.shape
            ),
          }}
          className="w-full object-cover grayscale border-2 border-[#0a0a0a]"
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
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black uppercase">{project.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold uppercase underline group-hover:text-[#f0ebe3]/70 hover:no-underline">GH</a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold uppercase underline group-hover:text-[#f0ebe3]/70 hover:no-underline">→</a>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed opacity-60">{project.description}</p>
                {project.techStack?.length ? (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-xs font-bold uppercase border border-current opacity-50">{tech}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}
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