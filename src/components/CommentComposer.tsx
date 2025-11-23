"use client";

import { useState, useRef, useId, useEffect } from "react";
import Image from "next/image";
import { useCommentFocus } from "@/context/CommentFocusContext";

type CommentComposerProps = {
  onSubmit?: (comment: { text: string; image?: File; gif?: string }) => void;
  placeholder?: string;
  maxLength?: number;
};

export default function CommentComposer({
  onSubmit,
  placeholder = "Comment",
  maxLength = 10000,
}: CommentComposerProps) {
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uniqueId = useId();
  const { registerFocus } = useCommentFocus();

  // Register focus function with context
  useEffect(() => {
    const focusFn = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };
    registerFocus(focusFn);

    // Check if we should focus on mount (e.g., from URL hash)
    if (typeof window !== "undefined" && window.location.hash === "#comment") {
      setTimeout(() => {
        focusFn();
        // Remove hash from URL without scrolling
        window.history.replaceState(null, "", window.location.pathname);
      }, 100);
    }
  }, [registerFocus]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        288
      )}px`; // max-h-72 = 288px
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGifClick = () => {
    // TODO: Implement GIF picker
    console.log("GIF picker not implemented yet");
  };

  const handleSend = () => {
    if (!comment.trim() && !selectedImage) {
      return;
    }

    onSubmit?.({
      text: comment,
      image: selectedImage || undefined,
    });

    // Reset form
    setComment("");
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px"; // h-5 = 20px
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`shadow p-5 rounded-3xl flex flex-col gap-y-1 duration-500 bg-primary w-full ${
        isFocused ? "shadow-accent" : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={comment}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="text-sm max-h-72 h-5 bg-transparent text-primary-dark placeholder:text-gray-400 resize-none outline-none overflow-hidden"
        maxLength={maxLength}
        autoComplete="off"
        rows={1}
      />
      <p
        className={`text-sm text-red-500 duration-500 whitespace-pre ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error}
      </p>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-x-2.5">
          {/* Image attachment button */}
          <label
            htmlFor={`postImageInput-${uniqueId}`}
            className="cursor-pointer duration-500 hover:scale-110 active:scale-95"
          >
            <div className="relative w-[27px] h-[27px]">
              <Image
                src="/icons/image.svg"
                alt="Attach image"
                width={27}
                height={27}
              />
            </div>
          </label>
          <input
            id={`postImageInput-${uniqueId}`}
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept=".jpg, .jpeg, .png, .mp4, .webm, .avi, .flv, .mkv, .mpg, .wmv, .mov"
            onChange={handleImageSelect}
          />

          {/* GIF attachment button */}
          <button
            onClick={handleGifClick}
            className="cursor-pointer duration-500 hover:scale-110 active:scale-95"
          >
            <div className="relative w-[27px] h-[27px]">
              <Image
                src="/icons/gif.svg"
                alt="Attach GIF"
                width={27}
                height={27}
              />
            </div>
          </button>
        </div>

        {/* Send button */}
        <div>
          <button
            onClick={handleSend}
            className="cursor-pointer duration-500 hover:scale-110 active:scale-95"
            disabled={!comment.trim() && !selectedImage}
          >
            <div className="relative w-[27px] h-[27px]">
              <Image
                src="/icons/send.svg"
                alt="Send comment"
                width={27}
                height={27}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
