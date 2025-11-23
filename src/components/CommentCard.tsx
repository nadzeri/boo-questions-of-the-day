import { useState } from "react";
import { Comment } from "@/lib/types";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";
import Toast from "./Toast";

type CommentCardProps = {
  comment: Comment;
};

export default function CommentCard({ comment }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(comment.numLikes);
  const [isShareActive, setIsShareActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setNumLikes((prev) => (newLikedState ? prev + 1 : prev - 1));
  };

  const handleShareClick = async () => {
    try {
      // Construct full URL with comment ID as hash anchor
      const fullUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}#${comment.id}`
          : `#${comment.id}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl);

      // Show toast and change color
      setShowToast(true);
      setIsShareActive(true);

      // Reset share button color after 2 seconds
      setTimeout(() => {
        setIsShareActive(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };
  return (
    <div
      id={comment.id}
      className="relative bg-primary shadow duration-500 px-5 py-4 rounded-3xl flex flex-col gap-y-2 group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
    >
      {showToast && (
        <Toast message="Copied Link!" onHide={() => setShowToast(false)} />
      )}
      {/* Profile section */}
      <div className="flex flex-row items-center group/profile">
        <div className="h-12 w-12 relative me-3 duration-500 cursor-pointer group-hover/profile:scale-[1.03] active:scale-[0.99]">
          {comment.profile.picture ? (
            <Image
              alt={comment.profile.firstName}
              src={comment.profile.picture}
              fill
              className="rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center text-primary-dark">
              {comment.profile.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-0.5 flex-grow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center cursor-pointer duration-500 group-hover/profile:scale-[1.03] active:scale-[0.99]">
              <div className="flex items-center">
                <p>{comment.profile.firstName}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-gray">
                {formatRelativeTime(comment.createdAt)}
              </p>
              <div className="relative inline-block">
                <button
                  className="flex items-center w-4 h-4 cursor-pointer duration-500 hover:scale-125 active:scale-[0.99]"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    className="fill-primary-dark hover:fill-accent duration-500"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Personality badges */}
          <div className="flex flex-row flex-wrap w-fit gap-x-2">
            {comment.profile.personality && (
              <div className="duration-500 group-hover/profile:scale-[1.03] active:scale-[0.99] cursor-pointer bg-potential shadow-potential/25 shadow-sm rounded-3xl px-2.5 py-1 w-fit">
                <p className="text-xs text-black">
                  {comment.profile.personality}
                </p>
              </div>
            )}
            {comment.profile.horoscope && (
              <div className="duration-500 group-hover/profile:scale-[1.03] active:scale-[0.99] cursor-pointer shadow-sm shadow-gray/25 rounded-3xl px-2.5 py-1 bg-horoscope">
                <p className="text-xs text-white">
                  {comment.profile.horoscope}
                </p>
              </div>
            )}
            {comment.profile.anneagram && (
              <div className="duration-500 group-hover/profile:scale-[1.03] active:scale-[0.99] cursor-pointer bg-enneagram shadow-sm shadow-[#13A6A23F] rounded-3xl px-2.5 py-1 text-xs text-white flex items-center">
                {comment.profile.anneagram.charAt(0)}
                <div className="w-2.5 h-2.5 relative">
                  <Image
                    src="/icons/enneagram.svg"
                    alt="Enneagram"
                    width={10}
                    height={10}
                    className="w-full h-full"
                  />
                </div>
                {comment.profile.anneagram.charAt(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment text */}
      {comment.text && (
        <h2
          className="text-primary-dark text-sm whitespace-pre-line text-start"
          dir="auto"
        >
          {comment.text}
        </h2>
      )}

      {/* Image or GIF */}
      {(comment.image || comment.gif) && (
        <div
          className="w-full h-full relative"
          style={{ aspectRatio: "1.80328 / 1" }}
        >
          <Image
            alt={comment.text || "Comment image"}
            src={comment.gif || comment.image || ""}
            fill
            className="w-full h-full rounded-2xl shadow object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction buttons */}
      <div className="flex flex-row items-center gap-x-2">
        {/* Like button */}
        <button
          onClick={handleLike}
          className="cursor-pointer duration-500 hover:scale-110 active:scale-[0.99]"
        >
          <div className="relative w-6 h-6">
            <Image
              src={isLiked ? "/icons/blue-like.svg" : "/icons/like.svg"}
              alt="Like"
              width={24}
              height={24}
              loading="lazy"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{numLikes}</p>

        {/* Comment button */}
        <button className="cursor-pointer duration-500 hover:scale-100 active:scale-[0.85] scale-90">
          <div className="relative w-6 h-6">
            <Image
              src="/icons/comment.svg"
              alt="Comment"
              width={24}
              height={24}
              loading="lazy"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{comment.numComments}</p>

        {/* Share button */}
        <button
          onClick={handleShareClick}
          className="cursor-pointer duration-500 hover:scale-110 active:scale-[0.99]"
        >
          <div className="relative w-6 h-6">
            <Image
              src="/icons/share.svg"
              alt="Share"
              width={24}
              height={24}
              loading="lazy"
              className="transition-all duration-500"
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
        <div className="flex-grow"></div>

        {/* Reply button */}
        <button className="text-sm cursor-pointer duration-500 hover:text-accent text-gray">
          Reply
        </button>
      </div>
    </div>
  );
}
