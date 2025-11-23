import { Question } from "@/lib/types";
import { GetServerSideProps } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type QuestionPageProps = {
  question?: Question;
  error?: string;
};

export default function QuestionPage({ question, error }: QuestionPageProps) {
  if (error || !question) {
    return (
      <div
        className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
      >
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
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
        </main>
      </div>
    );
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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
      </main>
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
