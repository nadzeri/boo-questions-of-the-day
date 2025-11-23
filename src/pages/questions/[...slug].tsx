import { Question, Comment } from "@/lib/types";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import CommentComposer from "@/components/CommentComposer";
import CommentCard from "@/components/CommentCard";
import { CommentFocusProvider } from "@/context/CommentFocusContext";
import { createComment } from "@/aggregates/comment";

type QuestionPageProps = {
  question?: Question;
  error?: string;
};

export default function QuestionPage({
  question: initialQuestion,
  error,
}: QuestionPageProps) {
  const [question, setQuestion] = useState<Question | undefined>(
    initialQuestion
  );

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

  const handleCommentSubmit = (comment: {
    text: string;
    image?: File;
    gif?: string;
  }) => {
    const newComment: Comment = createComment(
      comment.text,
      comment.image,
      comment.gif
    );

    // Add the new comment to the question's comments array
    setQuestion((prevQuestion) => {
      if (!prevQuestion) return prevQuestion;
      return {
        ...prevQuestion,
        comments: [newComment, ...prevQuestion.comments],
        numComments: prevQuestion.numComments + 1,
      };
    });
  };

  return (
    <CommentFocusProvider>
      <div className="flex flex-col items-center justify-center p-16 gap-y-4 sm:items-start">
        <QuestionCard question={question} />
        <CommentComposer onSubmit={handleCommentSubmit} />
        {/* Render all top-level comments */}
        {question.comments.length > 0 && (
          <div className="flex flex-col gap-y-5 w-full">
            {question.comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex flex-col gap-y-5">
                  <CommentCard comment={comment} />
                </div>
              </div>
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
