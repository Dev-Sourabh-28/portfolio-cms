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
    };
};

const getShapeStyles = (shape?: string) => {
    switch (shape) {
        case "circular":
            return "rounded-full";
        case "square":
            return "rounded-none";
        case "rounded":
            return "rounded-2xl";
        case "hexagon":
            return "rounded-[30px]";
        case "pentagon":
            return "rounded-[20px]";
        case "octagon":
            return "rounded-[10px]";
        default:
            return "rounded-full";
    }
};

const getShapeBorderRadius = (shape?: string) => {
    switch (shape) {
        case "circular":
            return "50%";
        case "square":
            return "0";
        case "rounded":
            return "18px";
        default:
            return "0";
    }
};

const getShapeClip = (shape?: string) => {
    switch (shape) {
        case "hexagon":
            return "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)";
        case "pentagon":
            return "polygon(50% 0%, 95% 35%, 77% 100%, 23% 100%, 5% 35%)";
        case "octagon":
            return "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";
        default:
            return "none";
    }
};

const getImageSize = (size?: string) => {
    switch (size) {
        case "small":
            return "clamp(80px, 15vw, 120px)";
        case "medium":
            return "clamp(100px, 18vw, 150px)";
        case "large":
            return "clamp(120px, 20vw, 180px)";
        case "xlarge":
            return "clamp(140px, 22vw, 210px)";
        default:
            return "clamp(100px, 18vw, 150px)";
    }
};

const getProjectImageSize = (size?: string) => {
    switch (size) {
        case "small":
            return "clamp(120px, 20vw, 150px)";
        case "medium":
            return "clamp(150px, 25vw, 200px)";
        case "large":
            return "clamp(180px, 30vw, 250px)";
        case "xlarge":
            return "clamp(200px, 35vw, 300px)";
        default:
            return "clamp(150px, 25vw, 200px)";
    }
};

const getFontFamily = (fontFamily?: string) => {
    switch (fontFamily) {
        case "font-serif":
            return "serif";
        case "font-sans":
            return "sans-serif";
        case "font-mono":
            return "monospace";
        case "cursive":
            return "cursive";
        case "fantasy":
            return "fantasy";
        default:
            return "sans-serif";
    }
};

const getFontStyle = (fontStyle?: string) => {
    return fontStyle === "italic" ? "italic" : "normal";
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

const getFontSize = (
    fontSize?: string,
    fallback: string = "18px"
) => {
    switch (fontSize) {
        case "text-sm":
            return "clamp(0.75rem, 2vw, 0.875rem)";
        case "text-base":
            return "clamp(0.875rem, 2.5vw, 1rem)";
        case "text-lg":
            return "clamp(1rem, 3vw, 1.125rem)";
        case "text-xl":
            return "clamp(1.125rem, 3.5vw, 1.25rem)";
        case "text-2xl":
            return "clamp(1.25rem, 4vw, 1.5rem)";
        case "text-3xl":
            return "clamp(1.5rem, 5vw, 1.875rem)";
        case "text-4xl":
            return "clamp(1.875rem, 6vw, 2.25rem)";
        case "text-5xl":
            return "clamp(2.25rem, 8vw, 3rem)";
        case "text-6xl":
            return "clamp(3rem, 10vw, 3.75rem)";
        case "text-7xl":
            return "clamp(3.75rem, 12vw, 4.5rem)";
        default:
            return fallback;
    }
};

export default function AuroraTheme({ portfolio }: ThemeProps) {
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
        <div className="min-h-screen bg-[#050b18] text-white overflow-x-hidden">
            {/* Aurora background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#7c3aed]/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#06b6d4]/15 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[120px]" />
            </div>

            {/* HERO */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20">
                <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">

                    {/* LEFT */}
                    <div className="flex-1">
                        {/* Glowing badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#a78bfa] text-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                            Available for work
                        </div>

                        <h1
                            style={{
                                fontFamily: getFontFamily(
                                    portfolio.titleStyle?.fontFamily
                                ),
                                fontStyle: getFontStyle(
                                    portfolio.titleStyle?.fontStyle
                                ),
                                fontSize: getFontSize(
                                    portfolio.titleStyle?.fontSize,
                                    "64px"
                                ),
                                fontWeight:
                                    portfolio.titleStyle?.fontWeight?.replace(
                                        "font-",
                                        ""
                                    ) || 700,
                                color:
                                    portfolio.titleStyle?.color || "transparent",
                            }}
                            className="leading-tight bg-gradient-to-r from-white via-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent"
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
                                        "24px"
                                    ),
                                    fontWeight:
                                        portfolio.subtitleStyle?.fontWeight?.replace(
                                            "font-",
                                            ""
                                        ) || 400,
                                    color:
                                        portfolio.subtitleStyle?.color ||
                                        "rgba(255,255,255,.6)",
                                }}
                                className="mt-3 tracking-wide"
                            >
                                {portfolio.subtitle}
                            </p>
                        )}

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
                                    "rgba(255,255,255,.7)",
                            }}
                            className="mt-6 max-w-xl leading-relaxed"
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

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            {portfolio.resumeImageUrl && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#7c3aed]/30"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                        </svg>
                                        Resume
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                    </button>
                                    {showResumeDropdown && (
                                        <div className="absolute top-full left-0 mt-2 bg-[#0d1526] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-10 min-w-[160px]">
                                            <a href={portfolio.resumeImageUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                onClick={() => setShowResumeDropdown(false)}>
                                                View Resume
                                            </a>
                                            <a href={portfolio.resumeImageUrl} download
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
                                                onClick={() => setShowResumeDropdown(false)}>
                                                Download Resume
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                            {portfolio.bestProjectUrl && (
                                <a href={portfolio.bestProjectUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white/70 text-sm hover:border-[#a78bfa] hover:text-[#a78bfa] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                    Best Project
                                </a>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12">
                            {[
                                { value: `${portfolio.yearsExperience || 0}+`, label: "Years Exp." },
                                { value: `${portfolio.clientsHandled || 0}+`, label: "Clients" },
                                { value: `${portfolio.projects?.length || 0}+`, label: "Projects" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#67e8f9] bg-clip-text text-transparent">{s.value}</p>
                                    <p className="text-xs uppercase tracking-widest text-white/30 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mt-8 sm:mt-10">
                            {portfolio.techStack?.map((tech) => (
                                <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:border-[#7c3aed]/50 hover:text-[#a78bfa] transition-colors">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    {portfolio.profilePhotoUrl && (
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7c3aed]/40 to-[#06b6d4]/40 blur-xl scale-105" />
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
                                    objectFit: "cover",
                                }}
                                className="relative border border-white/10"
                            />
                            <div className="absolute top-4 right-4">
                                <ShareButton url={portfolioUrl} title={portfolio.title} />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* PROJECTS */}
            {portfolio.projects && portfolio.projects.length > 0 && (
                <section className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-28">
                    <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                        Featured Projects
                    </h2>
                    <p className="text-white/40 mb-12 text-sm">Things I've built</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {portfolio.projects.map((project) => (
                            <div key={project.id}
                                className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#7c3aed]/40 transition-all duration-300 hover:-translate-y-1">
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
                                                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </button>

                                            {extra > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => openImageModal(imgs, 0)}
                                                    className="absolute right-3 bottom-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold"
                                                >
                                                    +{extra}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                    <p className="mt-2 text-white/50 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                                    {project.techStack?.length ? (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {project.techStack.map((tech) => (
                                                <span key={tech} className="px-2 py-0.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] text-xs">{tech}</span>
                                            ))}
                                        </div>
                                    ) : null}
                                    <div className="flex gap-3 mt-5">
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 text-white/60 text-xs hover:border-white/30 hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                GitHub
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs hover:opacity-90 transition-opacity">
                                                Live Preview
                                            </a>
                                        )}
                                    </div>
                                </div>
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