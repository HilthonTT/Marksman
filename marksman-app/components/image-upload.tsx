"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

interface ImageUploadProps {
  onChange: (url?: string) => void;
  value?: string;
}

export const ImageUpload = ({ onChange, value }: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint="image"
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
