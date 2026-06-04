"use client";

import { useState } from "react";
import API from "@/app/lib/axios";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onImageUpload, currentImage, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post<{ url: string }>("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onImageUpload(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-[#e8e0d0]"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <label className="cursor-pointer">
                <span className="text-white text-xs font-medium tracking-widest uppercase bg-[#1a1814] px-4 py-2 rounded-lg">
                  Change Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#e8e0d0] rounded-lg cursor-pointer hover:border-[#d6b98c] transition-colors bg-[#f5f0e8]/30">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d6b98c] animate-pulse" />
                  <span className="text-sm text-[#1a1814]/40 font-light">Uploading...</span>
                </div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-3 text-[#d6b98c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-[#1a1814]/40 font-light">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#1a1814]/30 font-light mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
