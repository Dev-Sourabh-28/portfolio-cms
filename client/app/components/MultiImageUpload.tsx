"use client";

import { useEffect, useState } from "react";
import API from "@/app/lib/axios";

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  currentImages?: string[];
  label?: string;
  maxImages?: number;
}

export default function MultiImageUpload({
  onImagesChange,
  currentImages = [],
  label,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImages(currentImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImages]);

  const uploadFiles = async (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, maxImages - images.length);
    if (selectedFiles.length === 0) {
      alert(`You can upload up to ${maxImages} images.`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          alert("Please select only image files.");
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("Each image must be less than 5MB.");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await API.post<{ url: string }>(
          "/upload/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedUrls.push(response.data.url);
      }

      const nextImages = [...images, ...uploadedUrls].slice(0, maxImages);
      setImages(nextImages);
      onImagesChange(nextImages);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    onImagesChange(nextImages);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#1a1814]/40">
          {label}
        </label>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative group overflow-hidden rounded-lg border border-[#e8e0d0] bg-white/80">
              <a href={image} target="_blank" rel="noreferrer">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
              </a>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#1a1814]/75 text-white text-xs font-bold flex items-center justify-center hover:bg-[#c9a87a] transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className={`flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${images.length >= maxImages ? "border-red-300 bg-red-50 text-red-500" : "border-[#e8e0d0] bg-[#f5f0e8]/30 hover:border-[#d6b98c]"}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d6b98c] animate-pulse" />
              <span className="text-sm text-[#1a1814]/40 font-light">Uploading...</span>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 mb-3 text-[#d6b98c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-[#1a1814]/40 font-light">
                <span className="font-medium">Click to upload</span> or select up to {maxImages} images
              </p>
              <p className="text-xs text-[#1a1814]/30 font-light mt-1">
                PNG, JPG, GIF up to 5MB each
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading || images.length >= maxImages}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
