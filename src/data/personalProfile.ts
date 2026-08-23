export type LifeAspectCategory =
  | "travel"
  | "sports"
  | "fitness"
  | "food"
  | "games"
  | "technology"
  | "media"
  | "mobility"
  | "career"
  | "education"
  | "social";

export type CountryMemory = {
  id: string;
  name: string;
  flag: string;
  landmarkModelId: string;
  yearVisited?: number;
  category: Extract<LifeAspectCategory, "travel">;
};

export type Hobby = {
  id: string;
  label: string;
  category: LifeAspectCategory;
  sceneObjectId: string;
  note?: string;
};

export type Stays = {
  id: string;
  label: string;
  destination: string;
};

export type ProfessionalPhase = {
  id: string;
  label: string;
  fromYear: number;
  toYear: number | "current";
  roles: string[];
  note?: string;
};

export type EducationStep = {
  id: string;
  label: string;
  field: string;
  status: "planned" | "started" | "switched" | "graduated";
  duration?: string;
  note?: string;
};

export type CulturalItemType = "book" | "documentary" | "movie";

export type CulturalItem = {
  id: string;
  title: string;
  author?: string;
  note?: string;
  link?: string;
  posterImage?: string;
  posterColor?: string;
};

export type SocialAccount = {
  id: string;
  platform: "Facebook" | "Instagram" | "SoundCloud";
  handle?: string;
  link?: string;
  engagement: "inactive" | "low" | "active";
  note: string;
};

export type NineChoiceGroupId = "study" | "career" | "stays";

export type NineChoice = {
  id: string;
  label: string;
  detail: string;
  outcome?: string;
};

export type NineChoiceGroup = {
  id: NineChoiceGroupId;
  label: string;
  summary: string;
  choices: [NineChoice, NineChoice, NineChoice];
};

export const personalProfile = {
  site: {
    title: "Personal 3D Website",
    scope: "Non-professional life aspects",
    description:
      "A personal, non-professional 3D website centered on hobbies, places, media, and everyday interests.",
  },

  nineChoices: {
    title: "9",
    label: "Three aspects. Three choices each.",
    summary:
      "A personal identity system built around study, work, and place: three major life areas, each shaped by three different choices.",
    groups: [
      {
        id: "study",
        label: "Study",
        summary:
          "The academic route moved from a political interest, through engineering, then settled in computer science.",
        choices: [
          {
            id: "political-sciences-plan",
            label: "Political sciences",
            detail: "Original degree plan before switching academic direction.",
            outcome: "Planned",
          },
          {
            id: "engineering",
            label: "Engineering",
            detail: "Spent three semesters in engineering before switching.",
            outcome: "3 semesters",
          },
          {
            id: "computer-science",
            label: "Computer science",
            detail: "Final degree path and graduation field.",
            outcome: "Graduated",
          },
        ],
      },
      {
        id: "career",
        label: "Career",
        summary:
          "The professional path moved through administration and finance, visual design, then web development.",
        choices: [
          {
            id: "secretariat-financial-management",
            label: "Secretariat and financial management",
            detail: "Early professional phase covering secretariat and financial management roles.",
            outcome: "2008-2013",
          },
          {
            id: "graphic-design",
            label: "Graphic design",
            detail: "A visual and creative phase before moving into web development.",
            outcome: "2013-2018",
          },
          {
            id: "web-development",
            label: "Web development",
            detail: "Current professional field.",
            outcome: "2018-current",
          },
        ],
      },
      {
        id: "stays",
        label: "Stays",
        summary:
          "The place story is anchored by three homes or meaningful stays: Makkah, Kuala Lumpur, and Amman.",
        choices: [
          {
            id: "makkah",
            label: "Makkah",
            detail: "One of the three core places in the personal map.",
          },
          {
            id: "kuala-lumpur",
            label: "Kuala Lumpur",
            detail: "One of the three core places in the personal map.",
          },
          {
            id: "amman",
            label: "Amman",
            detail: "One of the three core places in the personal map.",
          },
        ],
      },
    ] satisfies NineChoiceGroup[],
  },

  professionalBackground: {
    note: "Included as life context only; this website is personal and non-professional in focus.",
    phases: [
      {
        id: "secretariat-financial-management",
        label: "Secretariat and financial management",
        fromYear: 2008,
        toYear: 2013,
        roles: ["Secretariat", "Financial management"],
      },
      {
        id: "graphic-design",
        label: "Graphic design",
        fromYear: 2013,
        toYear: 2018,
        roles: ["Graphic design"],
      },
      {
        id: "web-development",
        label: "Web development",
        fromYear: 2018,
        toYear: "current",
        roles: ["Web development"],
      },
    ] satisfies ProfessionalPhase[],
  },

  educationPath: [
    {
      id: "political-sciences-plan",
      label: "Original degree plan",
      field: "Political sciences",
      status: "planned",
      note: "Originally planned before switching academic direction.",
    },
    {
      id: "engineering",
      label: "Engineering",
      field: "Engineering",
      status: "switched",
      duration: "3 semesters",
      note: "Switched after spending three semesters in engineering.",
    },
    {
      id: "computer-science",
      label: "Computer science",
      field: "Computer science",
      status: "graduated",
      note: "Final degree path and graduation field.",
    },
  ] satisfies EducationStep[],

  countries: [
    {
      id: "my",
      name: "Malaysia",
      flag: "🇲🇾",
      landmarkModelId: "twin-towers",
      yearVisited: 2021,
      category: "travel",
    },
    {
      id: "th",
      name: "Thailand",
      flag: "🇹🇭",
      landmarkModelId: "temple-chedi",
      yearVisited: 2019,
      category: "travel",
    },
    {
      id: "lk",
      name: "Sri Lanka",
      flag: "🇱🇰",
      landmarkModelId: "stupa",
      yearVisited: 2018,
      category: "travel",
    },
    {
      id: "in",
      name: "India",
      flag: "🇮🇳",
      landmarkModelId: "taj-dome",
      yearVisited: 2020,
      category: "travel",
    },
    {
      id: "qa",
      name: "Qatar",
      flag: "🇶🇦",
      landmarkModelId: "doha-cubes",
      yearVisited: 2010,
      category: "travel",
    },
    {
      id: "sa",
      name: "Saudi Arabia",
      flag: "🇸🇦",
      landmarkModelId: "palm-and-tower",
      yearVisited: 2024,
      category: "travel",
    },
    {
      id: "jo",
      name: "Jordan",
      flag: "🇯🇴",
      landmarkModelId: "petra-facade",
      category: "travel",
    },
    {
      id: "sy",
      name: "Syria",
      flag: "🇸🇾",
      landmarkModelId: "citadel-arch",
      yearVisited: 2026,
      category: "travel",
    },
    {
      id: "lb",
      name: "Lebanon",
      flag: "🇱🇧",
      landmarkModelId: "raouche-rocks",
      yearVisited: 2008,
      category: "travel",
    },
    {
      id: "tr",
      name: "Turkey",
      flag: "🇹🇷",
      landmarkModelId: "hagia-sophia",
      yearVisited: 2025,
      category: "travel",
    },
    {
      id: "eg",
      name: "Egypt",
      flag: "🇪🇬",
      landmarkModelId: "pyramid-and-obelisk",
      yearVisited: 2023,
      category: "travel",
    },
  ] satisfies CountryMemory[],

  hobbies: [
    {
      id: "cooking",
      label: "Cooking",
      category: "food",
      sceneObjectId: "cooking-module",
    },
    {
      id: "chess",
      label: "Chess",
      category: "games",
      sceneObjectId: "chess-module",
    },
    {
      id: "pc",
      label: "PC",
      category: "technology",
      sceneObjectId: "pc-module",
    },
    {
      id: "motorcycle",
      label: "Motorcycle",
      category: "mobility",
      sceneObjectId: "motorcycle",
    },
    {
      id: "swimming",
      label: "Swimming",
      category: "fitness",
      sceneObjectId: "swimming-pool",
    },
    {
      id: "walking",
      label: "Walking",
      category: "fitness",
      sceneObjectId: "walking-track",
    },
    {
      id: "volleyball",
      label: "Volleyball",
      category: "sports",
      sceneObjectId: "volleyball-court",
    },
    {
      id: "movies",
      label: "Movies",
      category: "media",
      sceneObjectId: "wall-projector",
      note: "Represented by the projector video wall.",
    },
  ] satisfies Hobby[],

  culturalLibrary: {
    books: [
      { id: "", title: "الدولة المستحيلة", author: "وائل حلاق" },
      {
        id: "",
        title: "الدين والعلمانية في سياق تاريخي",
        author: "عزمي بشارة",
      },
      {
        id: "",
        title: "الديمقراطية وحقوق الإنسان في الإسلام",
        author: "راشد الغنوشي",
      },
      { id: "", title: "معضلة المالاي", author: "مهاتير محمد" },
    ] satisfies CulturalItem[],
    documentaries: [
      {
        id: "",
        title: "الحروب الصليبية",
        link: "https://www.youtube.com/watch?v=m3mjPiwd5tU&list=PLmrET10kAE97RuC47XUMWxQ9BlXB_9QDB",
      },
      { id: "", title: "", link: "" },
      { id: "", title: "", link: "" },
    ] satisfies CulturalItem[],
    movies: [
      {
        id: "",
        title: "Knives Out",
        link: "https://www.youtube.com/watch?v=qGqiHJTsRkQ",
        note: "2019",
      },
      { id: "", title: "Darkest Hour", note: "2017" },
      { id: "", title: "Detained", note: "2024" },
      { id: "", title: "Game Change", note: "2012" },
      { id: "", title: "Jumanji", note: "2017" },
      { id: "", title: "Now You See Me", note: "2013" },
      { id: "", title: "Home Alone", note: "1990" },
      { id: "", title: "Split", note: "2016" },
      { id: "", title: "The Fault In Our Stars", note: "2014" },
      { id: "", title: "The Hitman's Bodyguard", note: "2017" },
      { id: "", title: "The Irishman", note: "2019" },
      { id: "", title: "The Shawshank Redemption", note: "1994" },
      { id: "", title: "The Social Network", note: "2010" },
      { id: "", title: "Oppenheimer", note: "2023" },
      { id: "", title: "Pain Hustlers", note: "2023" },
      {
        id: "",
        title: "True Memoirs Of an International Assassin",
        note: "2016",
      },
      { id: "", title: "Yes Day", note: "2021" },
    ] satisfies CulturalItem[],
    podcasts: [
      {
        id: "",
        title: "القرآن والحياة - نايف بن نهار",
        link: "https://www.youtube.com/watch?v=Pfj4niPP0DY",
      },
      {
        id: "",
        title: "Financial Literacy",
        link: "https://www.youtube.com/watch?v=V360AygOv7A",
      },
      {
        id: "",
        title: "Barack Obama - Hasan Minhaj",
        link: "https://www.youtube.com/watch?v=jAYVKZSWXhY",
      },
    ] satisfies CulturalItem[],
    programs: [
      {
        id: "",
        title: "Jimmy Fallon",
        link: "https://www.youtube.com/@fallontonight",
      },
      {
        id: "",
        title: "المخبر الاقتصادي",
        link: "https://www.youtube.com/@MokhbirEqtisadi",
      },
      {
        id: "",
        title: "Zeteo - Mehdi Hasan",
        link: "https://www.youtube.com/@zeteo",
      },
      {
        id: "",
        title: "بدون ورق",
        link: "https://www.youtube.com/@BidonWaraq",
      },
    ] satisfies CulturalItem[],
    series: [
      {
        id: "",
        title: "House Of Cards",
      },
      {
        id: "",
        title: "The Mentalist",
      },
      {
        id: "",
        title: "ضيعة ضايعة",
      },
      { id: "", title: "الخربة" },
      { id: "", title: "الكبير أوي" },
      { id: "", title: "البلاتوه - أحمد أمين" },
      { id: "", title: "الصفارة - أحمد أمين" },
    ] satisfies CulturalItem[],
    note: "Titles to be filled from the owner's actual read/watch history; keep this list factual and curated.",
  },

  socialMedia: {
    generalNote:
      "Has Facebook, Instagram, and SoundCloud accounts, but has not really followed or engaged with social media for years.",
    accounts: [
      {
        id: "facebook",
        platform: "Facebook",
        engagement: "inactive",
        link: "https://www.facebook.com/makkahwi",
        note: "Account exists; not really followed or engaged with for years.",
      },
      {
        id: "instagram",
        platform: "Instagram",
        engagement: "inactive",
        link: "https://www.instagram.com/makkahwi",
        note: "Account exists; not really followed or engaged with for years.",
      },
      {
        id: "soundcloud",
        platform: "SoundCloud",
        engagement: "inactive",
        link: "https://soundcloud.com/makkahwi",
        note: "Account exists & updated occasionally.",
      },
    ] satisfies SocialAccount[],
  },

  stays: [
    {
      id: "makkah",
      label: "Makkah →",
      destination: "Makkah",
    },
    {
      id: "kuala-lumpur",
      label: "Kuala Lumpur →",
      destination: "Kuala Lumpur",
    },
    {
      id: "amman",
      label: "Amman →",
      destination: "Amman",
    },
  ] satisfies Stays[],
} as const;

export type PersonalProfile = typeof personalProfile;
