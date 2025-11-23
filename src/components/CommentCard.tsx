import { Comment } from "@/lib/types";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";

type CommentCardProps = {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onComment?: (commentId: string) => void;
  onShare?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
};

export default function CommentCard({
  comment,
  onLike,
  onComment,
  onShare,
  onReply,
}: CommentCardProps) {
  return (
    <div
      id={comment.id}
      className="bg-primary shadow duration-500 px-5 py-4 rounded-3xl flex flex-col gap-y-2 group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
    >
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
          onClick={() => onLike?.(comment.id)}
          className="cursor-pointer duration-500 hover:scale-110 active:scale-[0.99]"
        >
          <div className="relative w-6 h-6">
            <Image
              src="/icons/like.svg"
              alt="Like"
              width={24}
              height={24}
              loading="lazy"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{comment.numLikes}</p>

        {/* Comment button */}
        <button
          onClick={() => onComment?.(comment.id)}
          className="cursor-pointer duration-500 hover:scale-100 active:scale-[0.85] scale-90"
        >
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
          onClick={() => onShare?.(comment.id)}
          className="cursor-pointer duration-500 hover:scale-110 active:scale-[0.99]"
        >
          <div className="relative w-6 h-6">
            <Image
              src="/icons/share.svg"
              alt="Share"
              width={24}
              height={24}
              loading="lazy"
            />
          </div>
        </button>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Reply button */}
        <button
          onClick={() => onReply?.(comment.id)}
          className="text-sm cursor-pointer duration-500 hover:text-accent text-gray"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
