import { Question, Comment } from "@/lib/types";
import { GetServerSideProps } from "next";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import CommentComposer from "@/components/CommentComposer";
import CommentCard from "@/components/CommentCard";
import { CommentFocusProvider } from "@/context/CommentFocusContext";

type QuestionPageProps = {
  question?: Question;
  error?: string;
};

export default function QuestionPage({ question, error }: QuestionPageProps) {
  if (error || !question) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-32 px-16">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-semibold text-frame-warning">Error</h1>
          <p className="text-lg text-text-primary/70">
            {error || "Question not found"}
          </p>
          <Link
            href="/"
            className="mt-4 text-base font-medium text-button transition-colors hover:text-button-hover"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Render nested comments recursively
  const renderComment = (comment: Comment) => (
    <div className="flex flex-col gap-y-5">
      <CommentCard
        comment={comment}
        onLike={(commentId) => {
          // TODO: Implement like functionality
          console.log("Like comment:", commentId);
        }}
        onComment={(commentId) => {
          // TODO: Implement comment functionality
          console.log("Comment on comment:", commentId);
        }}
        onShare={(commentId) => {
          // TODO: Implement share functionality
          console.log("Share comment:", commentId);
        }}
        onReply={(commentId) => {
          // TODO: Implement reply functionality
          console.log("Reply to comment:", commentId);
        }}
      />
      {/* Render nested comments (replies) */}
      {comment.comments && comment.comments.length > 0 && (
        <div className="ms-4 flex flex-col gap-y-5">
          {comment.comments.map((reply) => (
            <div key={reply.id}>{renderComment(reply)}</div>
          ))}
        </div>
      )}
    </div>
  );

  // Filter top-level comments (comments without a parent)
  const topLevelComments = question.comments.filter(
    (comment) => !comment.parent
  );

  return (
    <CommentFocusProvider>
      <div className="flex flex-col items-center justify-center p-16 gap-y-4 sm:items-start">
        <QuestionCard question={question} />
        <CommentComposer />
        {/* Render all top-level comments */}
        {question.comments.length > 0 && (
          <div className="flex flex-col gap-y-5 w-full">
            {question.comments.map((comment) => (
              <div key={comment.id}>{renderComment(comment)}</div>
            ))}
          </div>
        )}
      </div>
    </CommentFocusProvider>
  );
}

export const getServerSideProps: GetServerSideProps<QuestionPageProps> = async (
  context
) => {
  const { slug } = context.params! as { slug: string[] };
  const url: string = slug?.join("/") || "";

  try {
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/questions/${url}`);

    if (!response.ok) {
      return {
        props: {
          error: "Failed to fetch question",
        },
      };
    }

    const question: Question = await response.json();

    return {
      props: {
        question,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
