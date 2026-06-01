export type Category = "places" | "mind" | "craft";

export type Station = {
  id: string;
  category: Category;
  title: string;
  years: string;
  summary: string;
  lessons: string[];
  position: [number, number, number];
};

export const stations: Station[] = [
  {
    id: "A1",
    category: "places",
    title: "Makkah",
    years: "1993–2011",
    summary:
      "Born and raised in Makkah, where I spent my full school years through high school and built my early foundation.",
    lessons: ["roots", "discipline", "identity"],
    position: [-9, 0.6, -6],
  },
  {
    id: "A2",
    category: "places",
    title: "Malaysia",
    years: "2011–2021",
    summary:
      "Relocated to Malaysia for university, built independence, and kick-started my professional career.",
    lessons: ["independence", "adaptability", "self-reliance"],
    position: [-9, 0.6, 0],
  },
  {
    id: "A3",
    category: "places",
    title: "Jordan",
    years: "2021–Present",
    summary:
      "Relocated to Jordan after COVID-related instability in Malaysia and continued rebuilding career and life systems.",
    lessons: ["resilience", "continuity", "stability"],
    position: [-9, 0.6, 6],
  },
  {
    id: "B1",
    category: "mind",
    title: "Public Affairs",
    years: "2007/2008–2021",
    summary:
      "My first major intellectual interest. I considered taking a degree in it and kept reading deeply across politics, economics, religion, and sociology, building a 250+ book library.",
    lessons: ["intellectual curiosity", "broad perspective", "long-term learning"],
    position: [0, 0.6, -6],
  },
  {
    id: "B2",
    category: "mind",
    title: "Engineering",
    years: "~2 University Years",
    summary:
      "I started my university path in engineering and spent two years in the engineering faculty before switching direction.",
    lessons: ["structured thinking", "technical rigor", "foundation building"],
    position: [0, 0.6, 0],
  },
  {
    id: "B3",
    category: "mind",
    title: "Computer Science",
    years: "Degree Completion",
    summary:
      "I switched to Computer Science, graduated in CS, and specialized in AI and Data Science.",
    lessons: ["problem solving", "abstraction", "system design"],
    position: [0, 0.6, 6],
  },
  {
    id: "C1",
    category: "craft",
    title: "Secretary & Financial Management",
    years: "2008–2013",
    summary:
      "My first professional roles were in secretariat and financial management positions across Makkah and Malaysia.",
    lessons: ["organization", "precision", "accountability"],
    position: [9, 0.6, -6],
  },
  {
    id: "C2",
    category: "craft",
    title: "Graphic Design",
    years: "2013+",
    summary:
      "While working in administration and finance, I learned design and became a professional graphic designer with paid client work from 2013 onward.",
    lessons: ["visual communication", "craft discipline", "client-focused execution"],
    position: [9, 0.6, 0],
  },
  {
    id: "C3",
    category: "craft",
    title: "Web Development",
    years: "2015 learning · 2018 full-time",
    summary:
      "From 2015 to 2018 I learned web development through freelance and side jobs, then switched into full-time web development in 2018.",
    lessons: ["reinvention", "product thinking", "builder mindset"],
    position: [9, 0.6, 6],
  },
];
