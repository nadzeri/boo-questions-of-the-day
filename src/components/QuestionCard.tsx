"use client";

import { Question } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import Toast from "./Toast";
import { useCommentFocus } from "@/context/CommentFocusContext";

type QuestionCardProps = {
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const [numLikes, setNumLikes] = useState(question.numLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareActive, setIsShareActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { focusTextarea } = useCommentFocus();

  const handleLikeClick = () => {
    if (isLiked) {
      setNumLikes(numLikes - 1);
      setIsLiked(false);
    } else {
      setNumLikes(numLikes + 1);
      setIsLiked(true);
    }
  };

  const handleShareClick = async () => {
    try {
      // Construct full URL
      const fullUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${question.url}`
          : question.url;

      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);

      // Show toast and change color
      setShowToast(true);
      setIsShareActive(true);

      // Reset share button color after 2 seconds
      setTimeout(() => {
        setIsShareActive(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };
  return (
    <div className="relative bg-primary shadow duration-500 px-5 py-4 rounded-3xl flex flex-col gap-y-2 group">
      {showToast && (
        <Toast message="Copied Link!" onHide={() => setShowToast(false)} />
      )}
      {/* Question of the Day label */}
      <p className="text-sm text-primary-dark hover:text-accent duration-500 cursor-pointer text-start">
        Question of the Day
      </p>

      {/* Question text and date */}
      <div className="flex flex-row items-start justify-between gap-2">
        <h1
          className="text-primary-dark text-xl font-medium text-start flex-1"
          dir="auto"
        >
          {question.text}
        </h1>
        <p className="text-xs text-gray whitespace-nowrap">
          {format(new Date(question.createdAt), "MM/dd/yyyy")}
        </p>
      </div>

      {/* Engagement metrics */}
      <div className="flex flex-row items-center gap-x-2">
        {/* Like button and count */}
        <button
          className="cursor-pointer duration-500 hover:scale-110 active:scale-95"
          onClick={handleLikeClick}
        >
          <div className="relative w-6 h-6 text-gray">
            <Image
              src={isLiked ? "/icons/blue-like.svg" : "/icons/like.svg"}
              alt="Like"
              width={24}
              height={24}
              className="text-gray"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{numLikes}</p>

        {/* Comment button and count */}
        <button className="cursor-pointer duration-500 hover:scale-100 active:scale-[0.85] scale-90">
          <div className="relative w-6 h-6 text-gray">
            <Image
              src="/icons/comment.svg"
              alt="Comment"
              width={24}
              height={24}
              className="text-gray"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{question.numComments}</p>

        {/* Share button */}
        <button
          className="cursor-pointer duration-500 hover:scale-110 active:scale-95"
          onClick={handleShareClick}
        >
          <div className="relative w-6 h-6 text-gray">
            <Image
              src="/icons/share.svg"
              alt="Share"
              width={24}
              height={24}
              className="text-gray transition-all duration-500"
              style={
                isShareActive
                  ? {
                      filter:
                        "brightness(0) saturate(100%) invert(86%) sepia(100%) saturate(400%) hue-rotate(168deg) brightness(1.05) contrast(0.95)",
                    }
                  : {}
              }
            />
          </div>
        </button>

        {/* Spacer */}
        <div className="grow"></div>

        {/* Comment link */}
        <Link
          href={`${question.url}#comment`}
          className="text-sm cursor-pointer duration-500 hover:text-accent text-gray"
          onClick={(e) => {
            // If we're on the same page, prevent navigation and focus textarea
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;
              const targetPath = question.url.startsWith("/")
                ? question.url
                : new URL(question.url, window.location.origin).pathname;

              if (currentPath === targetPath) {
                e.preventDefault();
                focusTextarea();
              }
            }
          }}
        >
          Comment
        </Link>
      </div>
    </div>
  );
}
