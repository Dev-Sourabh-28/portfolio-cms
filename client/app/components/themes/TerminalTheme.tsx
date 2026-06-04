"use client";

import { useState } from "react";
import ShareButton from "../ShareButton";
import ImageGalleryModal from "@/app/components/ImageGalleryModal";

type Project = {
    id: string;
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
        color: style.color || '#00ff00',
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

export default function TerminalTheme({ portfolio }: ThemeProps) {
    const portfolioUrl = typeof window !== "undefined" ? window.location.href : "";
    const [showResumeDropdown, setShowResumeDropdown] = useState(false);
    const [openProject, setOpenProject] = useState<string | null>(null);
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

    const prompt = "visitor@portfolio:~$";

    return (
        <div
            className="min-h-screen bg-[#0c0c0c] text-[#39ff14] font-mono"
            style={{ textShadow: "0 0 6px rgba(57,255,20,0.4)" }}
        >
            {/* Scanline overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
                style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
                }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">

                {/* Window chrome */}
                <div className="border border-[#39ff14]/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.1)]">
                    {/* Title bar */}
                    <div className="bg-[#39ff14]/10 border-b border-[#39ff14]/20 px-4 py-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        <span className="text-xs ml-4 text-[#39ff14]/50">terminal — {portfolio.title.toLowerCase().replace(/\s/g, "_")}</span>
                        <div className="ml-auto">
                            <ShareButton url={portfolioUrl} title={portfolio.title} />
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">

                        {/* Boot sequence */}
                        <div className="space-y-1 text-[#39ff14]/50 text-sm">
                            <p>Portfolio OS v2.0.1 — Booting...</p>
                            <p>Loading profile data... <span className="text-[#39ff14]">[OK]</span></p>
                            <p>Mounting projects... <span className="text-[#39ff14]">[OK]</span></p>
                        </div>

                        <div className="border-t border-[#39ff14]/20 pt-4" />

                        {/* whoami */}
                        <div>
                            <p className="text-sm"><span className="text-[#39ff14]/50">{prompt}</span> whoami</p>
                            <div className="mt-3 pl-4 border-l-2 border-[#39ff14]/20">
                                <p
                                    style={{
                                        fontFamily: getFontFamily(
                                            portfolio.titleStyle?.fontFamily
                                        ),
                                        fontStyle: getFontStyle(
                                            portfolio.titleStyle?.fontStyle
                                        ),
                                        fontSize: getFontSize(
                                            portfolio.titleStyle?.fontSize,
                                            "2rem"
                                        ),
                                        fontWeight:
                                            portfolio.titleStyle?.fontWeight?.replace(
                                                "font-",
                                                ""
                                            ) || 700,
                                        color:
                                            portfolio.titleStyle?.color || "#39ff14",
                                    }}
                                >
                                    {portfolio.title}
                                </p>
                                {portfolio.subtitle && <p
                                    className="mt-1"
                                    style={{
                                        fontFamily: getFontFamily(
                                            portfolio.subtitleStyle?.fontFamily
                                        ),
                                        fontStyle: getFontStyle(
                                            portfolio.subtitleStyle?.fontStyle
                                        ),
                                        fontSize: getFontSize(
                                            portfolio.subtitleStyle?.fontSize,
                                            "1rem"
                                        ),
                                        fontWeight:
                                            portfolio.subtitleStyle?.fontWeight?.replace(
                                                "font-",
                                                ""
                                            ) || 400,
                                        color:
                                            portfolio.subtitleStyle?.color ||
                                            "rgba(57,255,20,.6)",
                                    }}
                                >
                                    {portfolio.subtitle}
                                </p>}
                                <p
                                    className="mt-3 leading-relaxed max-w-2xl"
                                    style={{
                                        fontFamily: getFontFamily(
                                            portfolio.bioStyle?.fontFamily
                                        ),
                                        fontStyle: getFontStyle(
                                            portfolio.bioStyle?.fontStyle
                                        ),
                                        fontSize: getFontSize(
                                            portfolio.bioStyle?.fontSize,
                                            "0.875rem"
                                        ),
                                        fontWeight:
                                            portfolio.bioStyle?.fontWeight?.replace(
                                                "font-",
                                                ""
                                            ) || 400,
                                        color:
                                            portfolio.bioStyle?.color ||
                                            "rgba(57,255,20,.7)",
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
                            </div>
                        </div>

                        {/* stats */}
                        <div>
                            <p className="text-sm"><span className="text-[#39ff14]/50">{prompt}</span> cat stats.json</p>
                            <div className="mt-3 pl-4 border-l-2 border-[#39ff14]/20 text-sm">
                                <p className="text-[#39ff14]/50">{"{"}</p>
                                <p className="pl-4"><span className="text-[#67e8f9]">&quot;years_experience&quot;</span>: <span className="text-[#fbbf24]">{portfolio.yearsExperience || 0}</span>,</p>
                                <p className="pl-4"><span className="text-[#67e8f9]">&quot;clients_handled&quot;</span>: <span className="text-[#fbbf24]">{portfolio.clientsHandled || 0}</span>,</p>
                                <p className="pl-4"><span className="text-[#67e8f9]">&quot;total_projects&quot;</span>: <span className="text-[#fbbf24]">{portfolio.projects?.length || 0}</span></p>
                                <p className="text-[#39ff14]/50">{"}"}</p>
                            </div>
                        </div>

                        {/* tech stack */}
                        {portfolio.techStack && portfolio.techStack.length > 0 && (
                            <div>
                                <p className="text-sm"><span className="text-[#39ff14]/50">{prompt}</span> ls ./skills</p>
                                <div className="mt-3 pl-4 border-l-2 border-[#39ff14]/20 flex flex-wrap gap-3">
                                    {portfolio.techStack.map((tech) => (
                                        <span key={tech} className="text-sm text-[#39ff14] before:content-['./'] before:text-[#39ff14]/40">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* resume/best project */}
                        <div>
                            <p className="text-sm"><span className="text-[#39ff14]/50">{prompt}</span> ls ./links</p>
                            <div className="mt-3 pl-4 border-l-2 border-[#39ff14]/20 flex flex-wrap gap-4">
                                {portfolio.resumeImageUrl && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                                            className="text-sm text-[#67e8f9] underline decoration-dotted hover:text-[#39ff14] transition-colors"
                                        >
                                            ./resume ▾
                                        </button>
                                        {showResumeDropdown && (
                                            <div className="absolute top-full left-0 mt-1 bg-[#0c0c0c] border border-[#39ff14]/30 z-10 text-sm">
                                                <a href={portfolio.resumeImageUrl} target="_blank" rel="noopener noreferrer"
                                                    className="block px-4 py-2 hover:bg-[#39ff14]/10 transition-colors"
                                                    onClick={() => setShowResumeDropdown(false)}>view</a>
                                                <a href={portfolio.resumeImageUrl} download
                                                    className="block px-4 py-2 hover:bg-[#39ff14]/10 transition-colors border-t border-[#39ff14]/20"
                                                    onClick={() => setShowResumeDropdown(false)}>download</a>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {portfolio.bestProjectUrl && (
                                    <a href={portfolio.bestProjectUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-sm text-[#67e8f9] underline decoration-dotted hover:text-[#39ff14] transition-colors">
                                        ./best_project →
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* projects */}
                        {portfolio.projects && portfolio.projects.length > 0 && (
                            <div>
                                <p className="text-sm"><span className="text-[#39ff14]/50">{prompt}</span> ls ./projects</p>
                                <div className="mt-3 space-y-2 pl-4 border-l-2 border-[#39ff14]/20">
                                    {portfolio.projects.map((project, i) => (
                                        <div key={project.id}>
                                            <button
                                                className="flex items-center gap-3 w-full text-left hover:text-[#39ff14] text-sm group"
                                                onClick={() => setOpenProject(openProject === project.id ? null : project.id)}
                                            >
                                                <span className="text-[#39ff14]/40">{String(i + 1).padStart(2, "0")}.</span>
                                                <span className="text-[#67e8f9] group-hover:text-[#39ff14] transition-colors">{project.title}/</span>
                                                <span className="ml-auto text-[#39ff14]/30 text-xs">{openProject === project.id ? "[-]" : "[+]"}</span>
                                            </button>

                                            {openProject === project.id && (
                                                <div className="mt-2 ml-6 border border-[#39ff14]/20 p-4 bg-[#39ff14]/5 text-sm">
                                                    {(() => {
                                                        const imgs = project.imageUrls?.length
                                                            ? project.imageUrls
                                                            : project.imageUrl
                                                                ? [project.imageUrl]
                                                                : [];

                                                        if (!imgs.length) return null;

                                                        const extra = imgs.length - 1;

                                                        return (
                                                            <div className="relative mb-3">
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
                                                                        className="w-full object-cover opacity-80 grayscale"
                                                                    />
                                                                </button>

                                                                {extra > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openImageModal(imgs, 0)}
                                                                        className="absolute right-2 bottom-2 bg-black text-white px-2 py-1 rounded-full text-xs"
                                                                    >
                                                                        +{extra}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    <p className="text-[#39ff14]/70 leading-relaxed">{project.description}</p>
                                                    {project.techStack?.length ? (
                                                        <p className="mt-3 text-[#39ff14]/50">
                                                            stack: {project.techStack.join(" · ")}
                                                        </p>
                                                    ) : null}
                                                    <div className="flex gap-4 mt-3">
                                                        {project.githubUrl && (
                                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                                className="text-[#67e8f9] underline decoration-dotted hover:text-[#39ff14]">github →</a>
                                                        )}
                                                        {project.liveUrl && (
                                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                                                className="text-[#67e8f9] underline decoration-dotted hover:text-[#39ff14]">live →</a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* cursor */}
                        <div className="pt-2">
                            <span className="text-sm text-[#39ff14]/50">{prompt}</span>
                            <span className="ml-2 inline-block w-2 h-4 bg-[#39ff14] animate-pulse align-middle" />
                        </div>
                    </div>
                </div>
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