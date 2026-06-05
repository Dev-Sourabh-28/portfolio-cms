"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import API from "@/app/lib/axios";
import ImageUpload from "@/app/components/ImageUpload";
import CustomFieldEditor from "@/app/components/CustomFieldEditor";
import MinimalTheme from "@/app/components/themes/MinimalTheme";
import AuroraTheme from "@/app/components/themes/AuroraTheme";
import CyberpunkTheme from "@/app/components/themes/CyberpunkTheme";
import BrutalistTheme from "@/app/components/themes/BrutalistTheme";
import TerminalTheme from "@/app/components/themes/TerminalTheme";
import PastelTheme from "@/app/components/themes/PastelTheme";
import GlassTheme from "@/app/components/themes/GlassTheme";
import NexusTheme from "@/app/components/themes/NexusTheme";

interface Project {
    id: string;
    title: string;
    description: string;
    techStack?: string[];
}

interface CustomField {
    id: string;
    type: "paragraph" | "orderedList" | "unorderedList" | "heading" | "subheading";
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
}

interface Portfolio {
    id: string;
    title: string;
    subtitle?: string;
    bio: string;
    slug: string;
    theme: string;

    yearsExperience: number;
    clientsHandled: number;
    techStack: string[];
    profilePhotoUrl?: string;
    resumeImageUrl?: string;
    resumeUrl?: string;
    bestProjectUrl?: string;

    titleStyle?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
        fontStyle?: string;
    };
    subtitleStyle?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
        fontStyle?: string;
    };
    bioStyle?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
        fontStyle?: string;
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
    customFields?: CustomField[];
}

export default function PortfolioEditor() {
    const params = useParams();
    const portfolioId = params?.portfolioId as string;
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!portfolioId) return;

        const loadPortfolio = async () => {
            try {
                setIsLoading(true);
                const res = await API.get<Portfolio>(`/portfolios/user/${portfolioId}`);
                setPortfolio(res.data);
                setCustomFields(res.data.customFields || []);
            } catch (error) {
                console.log(error);
                setPortfolio(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadPortfolio();
    }, [portfolioId]);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setShowPreview(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const savePortfolio = async () => {
        if (!portfolio) return;

        try {
            await API.patch(`/portfolios/${portfolioId}`, {
                title: portfolio.title,
                subtitle: portfolio.subtitle,
                bio: portfolio.bio,
                slug: portfolio.slug,
                theme: portfolio.theme,

                yearsExperience: portfolio.yearsExperience,
                clientsHandled: portfolio.clientsHandled,
                techStack: portfolio.techStack,
                profilePhotoUrl: portfolio.profilePhotoUrl,
                resumeImageUrl: portfolio.resumeImageUrl,
                bestProjectUrl: portfolio.bestProjectUrl,

                titleStyle: portfolio.titleStyle,
                subtitleStyle: portfolio.subtitleStyle,
                bioStyle: portfolio.bioStyle,
                profileImageStyle: portfolio.profileImageStyle,
                projectImageStyle: portfolio.projectImageStyle,
            });
            alert("Portfolio updated!");
        } catch (error) { console.log(error); }
    };

    const handleAddCustomField = async (field: Omit<CustomField, "id">) => {
        try {
            const res = await API.post(`/portfolios/${portfolioId}/custom-fields`, field);
            setCustomFields([...customFields, res.data]);
        } catch (error) {
            console.log(error);
            alert("Failed to add custom field");
        }
    };

    const handleUpdateCustomField = useCallback((id: string, updates: Partial<CustomField>) => {
        // Update local state immediately for responsiveness
        setCustomFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
        
        // Clear existing timeout
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }
        
        // Set new timeout for API call
        updateTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await API.patch(`/portfolios/${portfolioId}/custom-fields/${id}`, updates);
                setCustomFields(prev => prev.map(f => f.id === id ? res.data : f));
            } catch (error) {
                console.log(error);
                alert("Failed to update custom field");
            }
        }, 1000);
    }, [portfolioId]);

    const handleDeleteCustomField = async (id: string) => {
        try {
            await API.delete(`/portfolios/${portfolioId}/custom-fields/${id}`);
            setCustomFields(customFields.filter(f => f.id !== id));
        } catch (error) {
            console.log(error);
            alert("Failed to delete custom field");
        }
    };

    const handleReorderCustomFields = async (fields: CustomField[]) => {
        try {
            const fieldOrders = fields.map(f => ({ id: f.id, order: f.order }));
            await API.patch(`/portfolios/${portfolioId}/reorder-fields`, { fieldOrders });
            setCustomFields(fields);
        } catch (error) {
            console.log(error);
            alert("Failed to reorder custom fields");
        }
    };

    if (!portfolio) {
        return (
            <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#d6b98c] animate-pulse" />
                    <span className="text-sm text-[#1a1814]/40 font-light tracking-widest uppercase">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    const projects = portfolio.projects ?? [];

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

    const themeComponents: Record<string, React.ComponentType<{ portfolio: Portfolio; isPreview?: boolean }>> = {
        minimal: MinimalTheme,
        aurora: AuroraTheme,
        cyberpunk: CyberpunkTheme,
        brutal: BrutalistTheme,
        terminal: TerminalTheme,
        pastel: PastelTheme,
        glass: GlassTheme,
        nexus: NexusTheme
    };

    const ThemeComponent = themeComponents[portfolio.theme] || MinimalTheme;
    const previewPortfolio = { ...portfolio, customFields };

     return (
        <div className={`min-h-screen ${isMobile ? 'flex flex-col' : 'grid grid-cols-2'}`}>
 
            {/* LEFT — Editor */}
            <div className={`${isMobile ? 'flex-1' : ''} bg-[#1a1814] ${isMobile ? 'p-6' : 'p-10'} flex flex-col overflow-y-auto max-h-screen`}>
 
                {/* Brand */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d6b98c]" />
                    <span className="text-[#d6b98c] text-xs tracking-widest uppercase font-light">
                        Portfolio Editor
                    </span>
                </div>
 
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-serif font-normal text-[#f5f0e8] mb-2`}>
                    Edit your{" "}
                    <em className="italic text-[#d6b98c]">portfolio</em>
                </h1>
                <p className="text-[#f5f0e8]/30 text-sm font-light mb-10">
                    Changes are reflected live in the preview
                </p>

                {/* Mobile Preview Toggle */}
                {isMobile && (
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="mb-6 h-10 w-full bg-[#d6b98c]/20 text-[#d6b98c] text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#d6b98c]/30 transition-colors flex items-center justify-center gap-2"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                )}
 
                <div className="flex flex-col gap-5 flex-1">
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Portfolio Title
                        </label>
                        <input
                            type="text"
                            value={portfolio.title}
                            onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c] focus:bg-white/10 transition-colors placeholder:text-white/20"
                            placeholder="Portfolio Title"
                        />
                    </div>
 
                    {/* Title Styling */}
                    <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c] mb-3">
                            Title Styling
                        </label>
                        <div className={`${isMobile ? 'grid grid-cols-2' : 'grid grid-cols-4'} gap-3`}>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Family</label>
                                <select
                                    value={portfolio.titleStyle?.fontFamily || 'font-serif'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        titleStyle: { ...portfolio.titleStyle, fontFamily: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-serif" className="text-black">Serif</option>
                                    <option value="font-sans" className="text-black">Sans Serif</option>
                                    <option value="font-mono" className="text-black">Monospace</option>
                                    <option value="cursive" className="text-black">Cursive</option>
                                    <option value="fantasy" className="text-black">Fantasy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Size</label>
                                <select
                                    value={portfolio.titleStyle?.fontSize || 'text-6xl'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        titleStyle: { ...portfolio.titleStyle, fontSize: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="text-4xl" className="text-black">Small</option>
                                    <option value="text-5xl" className="text-black">Medium</option>
                                    <option value="text-6xl" className="text-black">Large</option>
                                    <option value="text-7xl" className="text-black">Extra Large</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Weight</label>
                                <select
                                    value={portfolio.titleStyle?.fontWeight || 'font-normal'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        titleStyle: { ...portfolio.titleStyle, fontWeight: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-light" className="text-black">Light</option>
                                    <option value="font-normal" className="text-black">Normal</option>
                                    <option value="font-medium" className="text-black">Medium</option>
                                    <option value="font-bold" className="text-black">Bold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Style</label>
                                <select
                                    value={portfolio.titleStyle?.fontStyle || 'normal'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        titleStyle: { ...portfolio.titleStyle, fontStyle: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="normal" className="text-black">Normal</option>
                                    <option value="italic" className="text-black">Italic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Color</label>
                                <input
                                    type="color"
                                    value={portfolio.titleStyle?.color || '#1a1814'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        titleStyle: { ...portfolio.titleStyle, color: e.target.value }
                                    })}
                                    className="w-full h-9 border border-white/10 rounded bg-white/5 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={portfolio.subtitle || ""}
                            onChange={(e) => setPortfolio({ ...portfolio, subtitle: e.target.value })}
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c] focus:bg-white/10 transition-colors placeholder:text-white/20"
                            placeholder="e.g. Full Stack Developer"
                        />
                    </div>
 
                    {/* Subtitle Styling */}
                    <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c] mb-3">
                            Subtitle Styling
                        </label>
                        <div className={`${isMobile ? 'grid grid-cols-2' : 'grid grid-cols-4'} gap-3`}>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Family</label>
                                <select
                                    value={portfolio.subtitleStyle?.fontFamily || 'font-sans'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        subtitleStyle: { ...portfolio.subtitleStyle, fontFamily: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-serif" className="text-black">Serif</option>
                                    <option value="font-sans" className="text-black">Sans Serif</option>
                                    <option value="font-mono" className="text-black">Monospace</option>
                                    <option value="cursive" className="text-black">Cursive</option>
                                    <option value="fantasy" className="text-black">Fantasy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Size</label>
                                <select
                                    value={portfolio.subtitleStyle?.fontSize || 'text-2xl'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        subtitleStyle: { ...portfolio.subtitleStyle, fontSize: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="text-lg" className="text-black">Small</option>
                                    <option value="text-xl" className="text-black">Medium</option>
                                    <option value="text-2xl" className="text-black">Large</option>
                                    <option value="text-3xl" className="text-black">Extra Large</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Weight</label>
                                <select
                                    value={portfolio.subtitleStyle?.fontWeight || 'font-light'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        subtitleStyle: { ...portfolio.subtitleStyle, fontWeight: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-light" className="text-black">Light</option>
                                    <option value="font-normal" className="text-black">Normal</option>
                                    <option value="font-medium" className="text-black">Medium</option>
                                    <option value="font-bold" className="text-black">Bold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Style</label>
                                <select
                                    value={portfolio.subtitleStyle?.fontStyle || 'normal'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        subtitleStyle: { ...portfolio.subtitleStyle, fontStyle: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="normal" className="text-black">Normal</option>
                                    <option value="italic" className="text-black">Italic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Color</label>
                                <input
                                    type="color"
                                    value={portfolio.subtitleStyle?.color || '#1a1814'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        subtitleStyle: { ...portfolio.subtitleStyle, color: e.target.value }
                                    })}
                                    className="w-full h-9 border border-white/10 rounded bg-white/5 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
 
                    <ImageUpload
                        onImageUpload={(url) => setPortfolio({ ...portfolio, profilePhotoUrl: url })}
                        currentImage={portfolio.profilePhotoUrl}
                        label="Profile Photo"
                    />
 
                    {/* Profile Image Styling */}
                    <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c] mb-3">
                            Profile Image Styling
                        </label>
                        <div className={`${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2'} gap-3`}>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Size</label>
                                <select
                                    value={portfolio.profileImageStyle?.size || 'medium'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        profileImageStyle: { ...portfolio.profileImageStyle, size: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="small" className="text-black">Small (200px)</option>
                                    <option value="medium" className="text-black">Medium (320px)</option>
                                    <option value="large" className="text-black">Large (420px)</option>
                                    <option value="xlarge" className="text-black">Extra Large (520px)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Shape</label>
                                <select
                                    value={portfolio.profileImageStyle?.shape || 'rounded'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        profileImageStyle: { ...portfolio.profileImageStyle, shape: e.target.value as 'circular' | 'square' | 'rounded' | 'hexagon' | 'pentagon' | 'octagon' }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="circular" className="text-black">Circular</option>
                                    <option value="square" className="text-black">Square</option>
                                    <option value="rounded" className="text-black">Rounded</option>
                                    <option value="hexagon" className="text-black">Hexagon</option>
                                    <option value="pentagon" className="text-black">Pentagon</option>
                                    <option value="octagon" className="text-black">Octagon</option>
                                </select>
                            </div>
                        </div>
                    </div>
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Bio
                        </label>
                        <textarea
                            value={portfolio.bio || ""}
                            onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                            className="w-full h-40 px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c] focus:bg-white/10 transition-colors resize-none placeholder:text-white/20"
                            placeholder="Tell the world about your work..."
                        />
                    </div>
 
                    {/* Bio Styling */}
                    <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c] mb-3">
                            Bio Styling
                        </label>
                        <div className={`${isMobile ? 'grid grid-cols-2' : 'grid grid-cols-4'} gap-3`}>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Family</label>
                                <select
                                    value={portfolio.bioStyle?.fontFamily || 'font-sans'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        bioStyle: { ...portfolio.bioStyle, fontFamily: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-serif" className="text-black">Serif</option>
                                    <option value="font-sans" className="text-black">Sans Serif</option>
                                    <option value="font-mono" className="text-black">Monospace</option>
                                    <option value="cursive" className="text-black">Cursive</option>
                                    <option value="fantasy" className="text-black">Fantasy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Size</label>
                                <select
                                    value={portfolio.bioStyle?.fontSize || 'text-lg'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        bioStyle: { ...portfolio.bioStyle, fontSize: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="text-sm" className="text-black">Small</option>
                                    <option value="text-base" className="text-black">Medium</option>
                                    <option value="text-lg" className="text-black">Large</option>
                                    <option value="text-xl" className="text-black">Extra Large</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Weight</label>
                                <select
                                    value={portfolio.bioStyle?.fontWeight || 'font-light'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        bioStyle: { ...portfolio.bioStyle, fontWeight: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="font-light" className="text-black">Light</option>
                                    <option value="font-normal" className="text-black">Normal</option>
                                    <option value="font-medium" className="text-black">Medium</option>
                                    <option value="font-bold" className="text-black">Bold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Font Style</label>
                                <select
                                    value={portfolio.bioStyle?.fontStyle || 'normal'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        bioStyle: { ...portfolio.bioStyle, fontStyle: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="italic">Italic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Color</label>
                                <input
                                    type="color"
                                    value={portfolio.bioStyle?.color || '#1a1814'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        bioStyle: { ...portfolio.bioStyle, color: e.target.value }
                                    })}
                                    className="w-full h-9 border border-white/10 rounded bg-white/5 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Years of Experience
                        </label>
 
                        <input
                            type="number"
                            value={portfolio.yearsExperience || 0}
                            onChange={(e) =>
                                setPortfolio({
                                    ...portfolio,
                                    yearsExperience: Number(e.target.value),
                                })
                            }
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c]"
                        />
                    </div>
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Clients Handled
                        </label>
 
                        <input
                            type="number"
                            value={portfolio.clientsHandled || 0}
                            onChange={(e) =>
                                setPortfolio({
                                    ...portfolio,
                                    clientsHandled: Number(e.target.value),
                                })
                            }
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c]"
                        />
                    </div>
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Tech Stack
                        </label>
 
                        <input
                            type="text"
                            value={portfolio.techStack?.join(", ") || ""}
                            onChange={(e) =>
                                setPortfolio({
                                    ...portfolio,
                                    techStack: e.target.value
                                        .split(",")
                                        .map((tech) => tech.trim()),
                                })
                            }
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c]"
                            placeholder="React, Next.js, Node.js"
                        />
                    </div>
 
                    <select
                        value={portfolio.theme || "minimal"}
                        onChange={(e) =>
                            setPortfolio({
                                ...portfolio,
                                theme: e.target.value,
                            })
                        }
                        className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-[#f5f0e8] outline-none focus:border-[#d6b98c]"
                    >
                        <option value="minimal" className="text-black">
                            Minimal
                        </option>
 
                        <option value="cyberpunk" className="text-black">
                            Cyberpunk
                        </option>
 
                        <option value="aurora" className="text-black">
                            Aurora
                        </option>

                        <option value="brutal" className="text-black">
                            Brutal
                        </option>

                        <option value="terminal" className="text-black">
                            Terminal
                        </option>

                        <option value="pastel" className="text-black">
                            Pastel
                        </option>

                        <option value="nexus" className="text-black">
                            Nexus
                        </option>

                        <option value="glass" className="text-black">
                            Glass
                        </option>
                    </select>
 
                    <ImageUpload
                        onImageUpload={(url) => setPortfolio({ ...portfolio, resumeImageUrl: url })}
                        currentImage={portfolio.resumeImageUrl}
                        label="Resume Image"
                    />
 
                    <div>
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#f5f0e8]/30 mb-1.5">
                            Best Project URL
                        </label>
                        <input
                            type="text"
                            value={portfolio.bestProjectUrl || ""}
                            onChange={(e) => setPortfolio({ ...portfolio, bestProjectUrl: e.target.value })}
                            className="w-full h-11 px-4 border border-white/10 rounded-lg bg-white/5 text-sm font-light text-[#f5f0e8] outline-none focus:border-[#d6b98c] focus:bg-white/10 transition-colors placeholder:text-white/20"
                            placeholder="https://your-best-project.com"
                        />
                    </div>
 
                    {/* Project Image Styling */}
                    <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c] mb-3">
                            Project Image Styling
                        </label>
                        <div className={`${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2'} gap-3`}>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Size</label>
                                <select
                                    value={portfolio.projectImageStyle?.size || 'medium'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        projectImageStyle: { ...portfolio.projectImageStyle, size: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="small" className="text-black">Small (150px)</option>
                                    <option value="medium" className="text-black">Medium (200px)</option>
                                    <option value="large" className="text-black">Large (250px)</option>
                                    <option value="xlarge" className="text-black">Extra Large (300px)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">Shape</label>
                                <select
                                    value={portfolio.projectImageStyle?.shape || 'rounded'}
                                    onChange={(e) => setPortfolio({
                                        ...portfolio,
                                        projectImageStyle: { ...portfolio.projectImageStyle, shape: e.target.value as 'circular' | 'square' | 'rounded' | 'hexagon' | 'pentagon' | 'octagon' }
                                    })}
                                    className="w-full h-9 px-3 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
                                >
                                    <option value="circular" className="text-black">Circular</option>
                                    <option value="square" className="text-black">Square</option>
                                    <option value="rounded" className="text-black">Rounded</option>
                                    <option value="hexagon" className="text-black">Hexagon</option>
                                    <option value="pentagon" className="text-black">Pentagon</option>
                                    <option value="octagon" className="text-black">Octagon</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <CustomFieldEditor
                        customFields={customFields}
                        onChange={handleReorderCustomFields}
                        onAddField={handleAddCustomField}
                        onUpdateField={handleUpdateCustomField}
                        onDeleteField={handleDeleteCustomField}
                    />

                    <button
                        onClick={savePortfolio}
                        className="h-11 bg-[#d6b98c] text-[#1a1814] text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#c9a87a] transition-colors mt-auto"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
 
            {/* RIGHT — Live Preview */}
            {(!isMobile || showPreview) && (
                <div className={`${isMobile ? 'w-full' : ''} bg-[#f5f0e8] overflow-y-auto max-h-screen`}>
                    <div className="flex items-center gap-2 p-4 border-b border-[#1a1814]/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d6b98c]" />
                        <span className="text-[10px] tracking-widest uppercase text-[#1a1814]/30 font-medium">
                            Live Preview
                        </span>
                    </div>
                    <div className="relative overflow-hidden" style={{ minHeight: isMobile ? '50vh' : '100vh' }}>
                        <ThemeComponent portfolio={previewPortfolio} isPreview={true} />
                    </div>
                </div>
            )}
        </div>
    );
}