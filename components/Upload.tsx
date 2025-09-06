"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface DragDropUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function DragDropUpload({
  value,
  onChange,
}: DragDropUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // local preview while uploading
    setPreview(URL.createObjectURL(file));

    // convert to base64 for upload
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64File = reader.result;

      try {
        setUploading(true);
        const res = await fetch("/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64File,
            fileName: file.name,
          }),
        });

        const data = await res.json();
        setUploading(false);

        if (res.ok) {
          onChange(data.url);
          setPreview(null);
        } else {
          alert(data.error || "Upload failed");
        }
      } catch (err: any) {
        console.error(err);
        setUploading(false);
      }
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-56 md:w-80 lg:w-96 h-60 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer overflow-hidden relative ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <p className="text-blue-600 font-medium animate-pulse">Uploading...</p>
      ) : value ? (
        <img
          src={value}
          alt="uploaded"
          className="object-cover w-full h-full"
        />
      ) : preview ? (
        <img
          src={preview}
          alt="preview"
          className="object-cover w-full h-full"
        />
      ) : (
        <p className="text-gray-500 text-center px-2">
          {isDragActive
            ? "Drop your image here..."
            : "Drag & drop an image, or click to select"}
        </p>
      )}
    </div>
  );
}
