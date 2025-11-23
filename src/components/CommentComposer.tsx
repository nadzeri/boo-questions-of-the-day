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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // Create preview URL for selected image
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImagePreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

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

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      {imagePreview && (
        <div
          className="relative cursor-pointer w-full"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img
            alt="Selected image preview"
            src={imagePreview}
            className="rounded-2xl shadow object-cover"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              inset: "0px",
              color: "transparent",
            }}
          />
          <div
            onClick={handleClearImage}
            className="absolute top-2.5 right-2.5 bg-black/40 shadow shadow-white/25 rounded-full duration-500 cursor-pointer hover:scale-105 active:scale-95 w-6 h-6 p-1 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
              className="fill-white w-4 h-4"
            >
              <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
            </svg>
          </div>
        </div>
      )}
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
                src={
                  selectedImage
                    ? "/icons/image-selected.svg"
                    : "/icons/image.svg"
                }
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
