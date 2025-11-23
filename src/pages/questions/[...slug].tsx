import { Question } from "@/lib/types";
import { GetServerSideProps } from "next";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";

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

  return (
    <div className="flex flex-col items-center justify-center p-16 sm:items-start">
      <div className="w-full max-w-2xl">
        <QuestionCard question={question} />
      </div>
    </div>
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
