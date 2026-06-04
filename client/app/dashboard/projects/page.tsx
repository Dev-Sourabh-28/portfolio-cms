"use client";

import { useCallback, useEffect, useState } from "react";
import API from "@/app/lib/axios";
import MultiImageUpload from "@/app/components/MultiImageUpload";

interface Portfolio {
  id: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  imageUrl?: string;
  imageUrls?: string[];
  titleStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  descriptionStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  portfolioId?: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string;
  portfolioId: string;
  imageUrls?: string[];
  titleStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  descriptionStyle?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    techStack: "",
    portfolioId: "",
    imageUrls: [],
    titleStyle: {
      fontFamily: "font-serif",
      fontSize: "text-xl",
      fontWeight: "font-bold",
      color: "#1a1814",
    },
    descriptionStyle: {
      fontFamily: "font-sans",
      fontSize: "text-sm",
      fontWeight: "font-light",
      color: "#1a1814",
    },
  });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await API.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get<Project[]>("/projects");
        setProjects(res.data);
      } catch (error) {
        console.log(error);
      }
      try {
        const res2 = await API.get<Portfolio[]>("/portfolios");
        setPortfolios(res2.data);
      } catch (error) {
        console.log(error);
      }
    };
    void load();
  }, []);

  const createProject = async () => {
    try {
      await API.post("/projects", {
        ...formData,
        techStack: formData.techStack.split(",").map((item) => item.trim()),
      });
      setFormData({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        techStack: "",
        portfolioId: "",
        imageUrls: [],
        titleStyle: {
          fontFamily: "font-serif",
          fontSize: "text-xl",
          fontWeight: "font-bold",
          color: "#1a1814",
        },
        descriptionStyle: {
          fontFamily: "font-sans",
          fontSize: "text-sm",
          fontWeight: "font-light",
          color: "#1a1814",
        },
      });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async () => {
    if (!editingId) return;
    try {
      await API.patch(`/projects/${editingId}`, {
        ...formData,
        techStack: formData.techStack.split(",").map((item) => item.trim()),
      });
      setFormData({
        title: "",
        description: "",
        githubUrl: "",
        liveUrl: "",
        techStack: "",
        portfolioId: "",
        imageUrls: [],
        titleStyle: {
          fontFamily: "font-serif",
          fontSize: "text-xl",
          fontWeight: "font-bold",
          color: "#1a1814",
        },
        descriptionStyle: {
          fontFamily: "font-sans",
          fontSize: "text-sm",
          fontWeight: "font-light",
          color: "#1a1814",
        },
      });
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const editProject = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      techStack: project.techStack?.join(", ") || "",
      portfolioId: project.portfolioId || "",
      imageUrls: project.imageUrls?.length ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [],
      titleStyle: {
        fontFamily: project.titleStyle?.fontFamily || "font-serif",
        fontSize: project.titleStyle?.fontSize || "text-xl",
        fontWeight: project.titleStyle?.fontWeight || "font-bold",
        color: project.titleStyle?.color || "#1a1814",
      },
      descriptionStyle: {
        fontFamily: project.descriptionStyle?.fontFamily || "font-sans",
        fontSize: project.descriptionStyle?.fontSize || "text-sm",
        fontWeight: project.descriptionStyle?.fontWeight || "font-light",
        color: project.descriptionStyle?.color || "#1a1814",
      },
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const deleteProject = async (id: string) => {
    setDeletingId(id);
    try {
      await API.delete(`/projects/${id}`);
      void fetchProjects();
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full h-11 px-4 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors placeholder:text-[#1a1814]/30";
  const labelClass =
    "block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5";

  return (
    <div className="p-10 bg-[#f5f0e8] min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl font-normal text-[#1a1814]">
            Manage <em className="italic text-[#b8925e]">Projects</em>
          </h1>
          <p className="text-sm text-[#1a1814]/40 font-light mt-1 tracking-wide">
            Add and organise your portfolio projects
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
              <span>New Project</span>
            </>
          )}
        </button>
      </div>

      {/* Create/Edit Project Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d0] p-8 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#d6b98c]" />
            <h2 className="text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/50">
              {editingId ? "Edit Project" : "New Project"}
            </h2>
          </div>

          <div className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <label className={labelClass}>Project Title</label>
              <input
                type="text"
                placeholder="My Awesome App"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                placeholder="What does this project do?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-28 px-4 py-3 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 text-sm font-light text-[#1a1814] outline-none focus:border-[#d6b98c] focus:bg-white transition-colors resize-none placeholder:text-[#1a1814]/30"
              />
            </div>

            {/* Project Screenshot */}
            <MultiImageUpload
              onImagesChange={(urls) => setFormData({ ...formData, imageUrls: urls })}
              currentImages={formData.imageUrls || []}
              label="Project Images"
              maxImages={10}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="border border-[#e8e0d0] rounded-2xl p-5 bg-white">
                <h3 className="text-sm font-medium uppercase tracking-widest text-[#1a1814]/50 mb-4">
                  Project Title Styling
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Font Family</label>
                    <select
                      value={formData.titleStyle?.fontFamily || "font-serif"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleStyle: {
                            ...formData.titleStyle,
                            fontFamily: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="font-serif">Serif</option>
                      <option value="font-sans">Sans Serif</option>
                      <option value="font-mono">Monospace</option>
                      <option value="cursive">Cursive</option>
                      <option value="fantasy">Fantasy</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Font Size</label>
                    <select
                      value={formData.titleStyle?.fontSize || "text-xl"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleStyle: {
                            ...formData.titleStyle,
                            fontSize: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="text-lg">Small</option>
                      <option value="text-xl">Medium</option>
                      <option value="text-2xl">Large</option>
                      <option value="text-3xl">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Font Weight</label>
                    <select
                      value={formData.titleStyle?.fontWeight || "font-bold"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleStyle: {
                            ...formData.titleStyle,
                            fontWeight: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="font-light">Light</option>
                      <option value="font-normal">Normal</option>
                      <option value="font-medium">Medium</option>
                      <option value="font-bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Color</label>
                    <input
                      type="color"
                      value={formData.titleStyle?.color || "#1a1814"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleStyle: {
                            ...formData.titleStyle,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-full h-11 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#e8e0d0] rounded-2xl p-5 bg-white">
                <h3 className="text-sm font-medium uppercase tracking-widest text-[#1a1814]/50 mb-4">
                  Project Description Styling
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Font Family</label>
                    <select
                      value={formData.descriptionStyle?.fontFamily || "font-sans"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionStyle: {
                            ...formData.descriptionStyle,
                            fontFamily: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="font-serif">Serif</option>
                      <option value="font-sans">Sans Serif</option>
                      <option value="font-mono">Monospace</option>
                      <option value="cursive">Cursive</option>
                      <option value="fantasy">Fantasy</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Font Size</label>
                    <select
                      value={formData.descriptionStyle?.fontSize || "text-sm"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionStyle: {
                            ...formData.descriptionStyle,
                            fontSize: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="text-sm">Small</option>
                      <option value="text-base">Medium</option>
                      <option value="text-lg">Large</option>
                      <option value="text-xl">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Font Weight</label>
                    <select
                      value={formData.descriptionStyle?.fontWeight || "font-light"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionStyle: {
                            ...formData.descriptionStyle,
                            fontWeight: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    >
                      <option value="font-light">Light</option>
                      <option value="font-normal">Normal</option>
                      <option value="font-medium">Medium</option>
                      <option value="font-bold">Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Color</label>
                    <input
                      type="color"
                      value={formData.descriptionStyle?.color || "#1a1814"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionStyle: {
                            ...formData.descriptionStyle,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-full h-11 border border-[#e8e0d0] rounded-lg bg-[#f5f0e8]/50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub + Live URL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>GitHub URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Live URL</label>
                <input
                  type="text"
                  placeholder="https://myproject.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <label className={labelClass}>Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind..."
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className={labelClass}>Portfolio</label>
              <select
                value={formData.portfolioId}
                onChange={(e) => setFormData({ ...formData, portfolioId: e.target.value })}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select a portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 h-11 border border-[#e8e0d0] text-[#1a1814]/60 text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#f5f0e8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? updateProject : createProject}
                className="flex-1 h-11 bg-[#1a1814] text-[#f5f0e8] text-xs font-medium tracking-widest uppercase rounded-lg hover:bg-[#2e2a25] transition-colors"
              >
                {editingId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-[#e8e0d0] flex items-center justify-center mb-4">
            <span className="text-2xl text-[#b8925e]">✦</span>
          </div>
          <p className="text-[#1a1814]/40 text-sm font-light tracking-wide">
            No projects yet. Create your first one above.
          </p>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-5">

          {/* Count label */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d6b98c]" />
            <span className="text-[10px] tracking-widest uppercase text-[#1a1814]/40 font-medium">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
            </span>
          </div>

          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-[#e8e0d0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {(project.imageUrls?.length || project.imageUrl) && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {(project.imageUrls?.length ? project.imageUrls : [project.imageUrl]).map((image, index) => (
                    image ? (
                      <a
                        key={`${project.id}-${index}`}
                        href={image}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-lg"
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </a>
                    ) : null
                  ))}
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2
                    className={`${project.titleStyle?.fontFamily || "font-serif"} ${project.titleStyle?.fontSize || "text-2xl"} ${project.titleStyle?.fontWeight || "font-bold"} truncate`}
                    style={{
                      color: project.titleStyle?.color || "#1a1814",
                    }}
                  >
                    {project.title}
                  </h2>
                  <p
                    className={`${project.descriptionStyle?.fontFamily || "font-sans"} ${project.descriptionStyle?.fontSize || "text-sm"} mt-2 leading-relaxed line-clamp-3 ${project.descriptionStyle?.fontWeight || "font-light"}`}
                    style={{
                      color: project.descriptionStyle?.color || "#1a1814",
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Action buttons — top right */}
                <div className="flex gap-2">
                  <button
                    onClick={() => editProject(project)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e0d0] text-[#1a1814]/60 hover:bg-[#f5f0e8] hover:text-[#1a1814] transition-colors"
                    title="Edit project"
                  >
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    disabled={deletingId === project.id}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete project"
                  >
                    {deletingId === project.id ? (
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

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border border-[#d6b98c]/40 text-[#b8925e] bg-[#d6b98c]/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div className="flex gap-3 mt-6 pt-5 border-t border-[#f5f0e8]">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-5 border border-[#1a1814]/20 text-[#1a1814] text-[11px] font-medium tracking-widest uppercase rounded-lg flex items-center gap-2 hover:bg-[#f5f0e8] transition-colors"
                    >
                      {/* GitHub icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
                      className="h-9 px-5 border border-[#1a1814]/20 text-[#1a1814] text-[11px] font-medium tracking-widest uppercase rounded-lg flex items-center gap-2 hover:bg-[#f5f0e8] transition-colors"
                    >
                      {/* External link icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}