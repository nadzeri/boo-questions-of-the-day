export type Question = {
  id: string;
  url: string;
  text: string;
  numComments: number;
  numLikes: number;
  comments: Comment[];
  createdAt: string;
};

export type Comment = {
  id: string;
  text: string | null;
  image: string | null;
  gif: string | null;
  numComments: number;
  numLikes: number;
  parent: string | null;
  profile: Profile;
  comments: Comment[];
  createdAt: string;
};

export type Profile = {
  firstName: string;
  personality: string | null;
  horoscope: string | null;
  anneagram: string | null;
  picture: string | null;
};
