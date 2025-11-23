import type { NextApiRequest, NextApiResponse } from "next";
import questions from "@/data/questions.json";
import { Question } from "@/lib/types";

type ErrorData = {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Question | ErrorData>
) {
  const { slug }: { slug: string[] } = req.query as { slug: string[] };
  const url: string = `/questions/${slug?.join("/")}`;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid slug parameter" });
  }

  const question: Question | undefined = questions.find(
    (question) => question.url === url
  );

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.status(200).json(question);
}
