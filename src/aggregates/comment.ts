import { Comment } from "@/lib/types";

const DEFAULT_PROFILE = {
  firstName: "Nadzeri",
  personality: "INTJ",
  horoscope: "Gemini",
  anneagram: "1w2",
  picture: "/nadzeri.jpg",
};

export const createComment = (
  text?: string,
  image?: File,
  gif?: string
): Comment => {
  return {
    id: crypto.randomUUID(),
    text: text || null,
    image: image ? URL.createObjectURL(image) : null,
    gif: gif || null,
    numComments: 0,
    numLikes: 0,
    parent: null,
    profile: DEFAULT_PROFILE,
    comments: [],
    createdAt: new Date().toISOString(),
  };
};
