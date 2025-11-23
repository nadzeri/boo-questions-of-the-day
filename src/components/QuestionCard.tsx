import { Question } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

type QuestionCardProps = {
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-primary shadow duration-500 px-5 py-4 rounded-3xl flex flex-col gap-y-2 group">
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
        <button className="cursor-pointer duration-500 hover:scale-110 active:scale-95">
          <div className="relative w-6 h-6 text-gray">
            <Image
              src="/icons/like.svg"
              alt="Like"
              width={24}
              height={24}
              className="text-gray"
            />
          </div>
        </button>
        <p className="text-sm -ms-1.5 text-gray">{question.numLikes}</p>

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
        <button className="cursor-pointer duration-500 hover:scale-110 active:scale-95">
          <div className="relative w-6 h-6 text-gray">
            <Image
              src="/icons/share.svg"
              alt="Share"
              width={24}
              height={24}
              className="text-gray"
            />
          </div>
        </button>

        {/* Spacer */}
        <div className="grow"></div>

        {/* Comment link */}
        <Link
          href={question.url}
          className="text-sm cursor-pointer duration-500 hover:text-accent text-gray"
        >
          Comment
        </Link>
      </div>
    </div>
  );
}
