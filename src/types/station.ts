export type Category = "places" | "mind" | "craft";

export type Station = {
  id: string;
  category: Category;
  title: string;
  years: string;
  summary: string;
  lessons: string[];
  images: string[];
  position: [number, number, number];
};
