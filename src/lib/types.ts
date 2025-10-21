export type Chapter = {
  id: string;
  name: string;
  number: number;
  lang: string;
  releaseDate: string;
  pages: string[]; // data URLs
};

export type Series = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  cover?: string; // data URL
  description?: string;
  chapters: Chapter[];
  views?: number;
  hot?: boolean;
};
