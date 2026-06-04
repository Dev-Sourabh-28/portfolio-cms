"use client";

import { useEffect, useState } from "react";
import API from "../lib/axios";
import Link from "next/link";

interface Portfolio {
  id: string;
  title: string;
  bio: string;
  slug: string;
  yearsExperience: number;
  clientsHandled: number;
  techStack: string[];
}

interface PortfolioFormData {
  title: string;
  slug: string;
  bio: string;
  yearsExperience: number;
  clientsHandled: number;
  techStack: string[];
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    slug: "",
    bio: "",
    yearsExperience: 0,
    clientsHandled: 0,
    techStack: [],
  });

  const fetchPortfolios = async () => {
    try {
      const res = await API.get<Portfolio[]>("/portfolios");
      setPortfolios(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPortfolio = async () => {
    try {
      await API.post("/portfolios", formData);

      setFormData({
        title: "",
        slug: "",
        bio: "",
        yearsExperience: 0,
        clientsHandled: 0,
        techStack: [],
      });

      setShowForm(false);
      fetchPortfolios();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePortfolio = async (id: string) => {
    setDeletingId(id);
    try {
      await API.delete(`/portfolios/${id}`);
      void fetchPortfolios();
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-10 bg-[#f5f0e8] min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-normal text-[#1a1814]">
            My <em className="italic text-[#b8925e]">Portfolios</em>
          </h1>

          <p className="text-sm text-[#1a1814]/40 font-light mt-1 tracking-wide">
            Create and manage your portfolio collections
          </p>
        </div>

        {/* Toggle Form Button */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 h-11 px-6 bg-[#1a1814] text-[#f5f0e8] text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#2e2a25] transition-colors"
        >
          {showForm ? (
            <>
              <span className="text-lg leading-none">×</span>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <span className="text-lg leading-none">+</span>
              <span>New Portfolio</span>
            </>
          )}
        </button>
      </div>

      {/* Create Portfolio Form — shown only when toggled */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d0] p-8 mb-10">

          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#d6b98c]" />
            <h2 className="text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/50">
              New Portfolio
            </h2>
          </div>

          <div className="flex flex-col gap-4">

            {/* Title */}
            <div>
              <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                Portfolio Title
              </label>
              <input
                type="text"
                placeholder="My Creative Work"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors placeholder:text-[#1a1814]/30"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                Slug
              </label>
              <input
                type="text"
                placeholder="my-creative-work"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors placeholder:text-[#1a1814]/30"
              />
            </div>

            {/* Years Experience + Clients — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  placeholder="5"
                  value={formData.yearsExperience || ""}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                  className="w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                  Clients Handled
                </label>
                <input
                  type="number"
                  placeholder="20"
                  value={formData.clientsHandled || ""}
                  onChange={(e) => setFormData({ ...formData, clientsHandled: Number(e.target.value) })}
                  className="w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                Tech Stack
              </label>
              <input
                type="text"
                placeholder="React, Next.js, Node.js"
                value={formData.techStack.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    techStack: e.target.value.split(",").map((tech) => tech.trim()),
                  })
                }
                className="w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
                Bio
              </label>
              <textarea
                placeholder="A short description of your work..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full h-28 px-4 py-3 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors resize-none placeholder:text-[#1a1814]/30"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 h-11 border border-[#e8e0d0] text-[#1a1814]/60 text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#f5f0e8] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={createPortfolio}
                className="flex-1 h-11 bg-[#1a1814] text-[#f5f0e8] text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#2e2a25] transition-colors"
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {portfolios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-[#e8e0d0] flex items-center justify-center mb-4">
            <span className="text-2xl text-[#b8925e]">✦</span>
          </div>
          <p className="text-[#1a1814]/40 text-sm font-light tracking-wide">
            No portfolios yet. Create your first one above.
          </p>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="bg-white border border-[#e8e0d0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d6b98c]" />
              <span className="text-[10px] tracking-widest uppercase text-[#1a1814]/40 font-medium">
                {portfolio.slug}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-normal text-[#1a1814]">
              {portfolio.title}
            </h2>

            <p className="text-[#1a1814]/60 mt-3 text-sm font-light leading-relaxed line-clamp-3">
              {portfolio.bio}
            </p>

            {/* Stats — fixed text color */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#f5f0e8] rounded-xl p-4">
                <p className="text-[10px] text-[#1a1814]/50 uppercase tracking-widest font-medium">
                  Experience
                </p>
                <h3 className="text-2xl font-semibold text-[#1a1814] mt-1">
                  {portfolio.yearsExperience}
                  <span className="text-[#b8925e]">+</span>
                </h3>
                <p className="text-[10px] text-[#1a1814]/40 mt-0.5">years</p>
              </div>

              <div className="bg-[#f5f0e8] rounded-xl p-4">
                <p className="text-[10px] text-[#1a1814]/50 uppercase tracking-widest font-medium">
                  Clients
                </p>
                <h3 className="text-2xl font-semibold text-[#1a1814] mt-1">
                  {portfolio.clientsHandled}
                  <span className="text-[#b8925e]">+</span>
                </h3>
                <p className="text-[10px] text-[#1a1814]/40 mt-0.5">handled</p>
              </div>
            </div>

            {/* Tech Stack */}
            {portfolio.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {portfolio.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#f5f0e8] rounded-full text-xs text-[#1a1814]/70 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-[#f5f0e8]">
              <Link
                href={`/dashboard/editor/${portfolio.id}`}
                className="flex-1 h-9 bg-[#1a1814] text-[#f5f0e8] text-[11px] font-medium tracking-widest uppercase rounded-lg flex items-center justify-center hover:bg-[#2e2a25] transition-colors"
              >
                Edit
              </Link>

              <Link
                href={`/${portfolio.slug}`}
                className="flex-1 h-9 border border-[#1a1814]/20 text-[#1a1814] text-[11px] font-medium tracking-widest uppercase rounded-lg flex items-center justify-center hover:bg-[#f5f0e8] transition-colors"
              >
                View
              </Link>

              <button
                onClick={() => deletePortfolio(portfolio.id)}
                disabled={deletingId === portfolio.id}
                className="h-9 px-4 border border-red-200 text-red-400 text-[11px] font-medium tracking-widest uppercase rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                title="Delete portfolio"
              >
                {deletingId === portfolio.id ? (
                  <span className="text-xs">…</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}