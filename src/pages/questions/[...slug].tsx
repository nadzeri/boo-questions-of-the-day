import { Question } from "@/lib/types";
import { GetServerSideProps } from "next";
import Link from "next/link";

type QuestionPageProps = {
  question?: Question;
  error?: string;
};

export default function QuestionPage({ question, error }: QuestionPageProps) {
  if (error || !question) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-32 px-16">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Error
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {error || "Question not found"}
          </p>
          <Link
            href="/"
            className="mt-4 text-base font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-32 px-16 sm:items-start">
      <Link
        href="/"
        className="text-base font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to home
      </Link>

      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {JSON.stringify(question)}
            </span>
          </div>
        </div>
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
