"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/lib/auth";
import { useState, useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isEditorPage = pathname?.startsWith("/dashboard/editor/");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const links = [
        { name: "Portfolios", href: "/dashboard", icon: <BriefcaseIcon /> },
        { name: "Projects", href: "/dashboard/projects", icon: <FolderIcon /> },
    ];

    const shouldCollapse = isEditorPage || isMobile;

    return (
        <div className="min-h-screen flex bg-[#f5f0e8]">

            {/* Sidebar */}
            <aside className={`${shouldCollapse ? 'w-16' : 'w-64'} bg-[#1a1814] flex flex-col p-4 fixed h-full transition-all duration-300 z-50`}>

                {/* Brand */}
                <div className={`flex items-center gap-2 mb-8 ${shouldCollapse ? 'justify-center' : ''}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d6b98c]" />
                    {!shouldCollapse && (
                        <span className="text-[#d6b98c] text-xs tracking-widest uppercase font-light">
                            Portfolio CMS
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`h-10 px-3 rounded-lg text-xs tracking-widest uppercase font-medium flex items-center transition-colors ${
                                pathname === link.href
                                    ? "bg-[#d6b98c]/20 text-[#d6b98c]"
                                    : "text-[#f5f0e8]/40 hover:text-[#f5f0e8]/70 hover:bg-white/5"
                            } ${shouldCollapse ? 'justify-center' : 'gap-3'}`}
                            title={link.name}
                        >
                            <span className="flex-shrink-0">{link.icon}</span>
                            {!shouldCollapse && <span>{link.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Footer hint */}
                <div className="mt-auto">

                    <button
                            onClick={handleLogout}
                            className={`w-full h-10 rounded-lg text-xs tracking-widest uppercase font-medium flex items-center transition-colors text-[#f5f0e8]/40 hover:text-[#d6b98c] hover:bg-white/5 ${shouldCollapse ? 'justify-center' : 'justify-center gap-3'}`}
                            title="Logout"
                        >
                            <span className="flex-shrink-0"><LogoutIcon /></span>
                            {!shouldCollapse && <span>Logout</span>}
                        </button>
                    {!shouldCollapse && (
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-[#f5f0e8]/20 text-[10px] font-light leading-relaxed tracking-wide">
                                Manage your portfolios and showcase your best work.
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content — offset by sidebar width */}
            <main className={`flex-1 transition-all duration-300 ${shouldCollapse ? 'ml-16' : 'ml-64'}`}>
                {children}
            </main>
        </div>
    );
}

// SVG Icons
function BriefcaseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
    );
}

function FolderIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
    );
}