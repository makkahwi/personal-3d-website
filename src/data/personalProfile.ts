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
  | "social"
  | "health";

export type CountryMemory = {
  id: string;
  name: string;
  flag: string;
  landmarkModelId: string;
  coordinates: readonly [number, number];
  yearVisited?: number;
  category: Extract<LifeAspectCategory, "travel">;
};

export type Hobby = {
  id: string;
  label: string;
  category: LifeAspectCategory;
  sceneObjectId: string;
  image?: string;
  visualHint?: string;
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

export type HealthyLifestyleItem = {
  id: string;
  label: string;
  fromYear?: number;
  toYear?: number | "current";
  cadence?: string;
  note: string;
  visualHint:
    | "fasting"
    | "sleep"
    | "sugar"
    | "vegan"
    | "nutritionist"
    | "weight-loss"
    | "walking";
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
            detail:
              "Early professional phase covering secretariat and financial management roles.",
            outcome: "2008-2013",
          },
          {
            id: "graphic-design",
            label: "Graphic design",
            detail:
              "A visual and creative phase before moving into web development.",
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
      coordinates: [101.6869, 3.139],
      yearVisited: 2021,
      category: "travel",
    },
    {
      id: "th",
      name: "Thailand",
      flag: "🇹🇭",
      landmarkModelId: "temple-chedi",
      coordinates: [100.5018, 13.7563],
      yearVisited: 2019,
      category: "travel",
    },
    {
      id: "lk",
      name: "Sri Lanka",
      flag: "🇱🇰",
      landmarkModelId: "stupa",
      coordinates: [79.8612, 6.9271],
      yearVisited: 2018,
      category: "travel",
    },
    {
      id: "in",
      name: "India",
      flag: "🇮🇳",
      landmarkModelId: "taj-dome",
      coordinates: [77.209, 28.6139],
      yearVisited: 2020,
      category: "travel",
    },
    {
      id: "qa",
      name: "Qatar",
      flag: "🇶🇦",
      landmarkModelId: "doha-cubes",
      coordinates: [51.531, 25.2854],
      yearVisited: 2010,
      category: "travel",
    },
    {
      id: "sa",
      name: "Saudi Arabia",
      flag: "🇸🇦",
      landmarkModelId: "palm-and-tower",
      coordinates: [39.8579, 21.3891],
      yearVisited: 2024,
      category: "travel",
    },
    {
      id: "jo",
      name: "Jordan",
      flag: "🇯🇴",
      landmarkModelId: "petra-facade",
      coordinates: [35.9106, 31.9539],
      category: "travel",
    },
    {
      id: "sy",
      name: "Syria",
      flag: "🇸🇾",
      landmarkModelId: "citadel-arch",
      coordinates: [36.2765, 33.5138],
      yearVisited: 2026,
      category: "travel",
    },
    {
      id: "lb",
      name: "Lebanon",
      flag: "🇱🇧",
      landmarkModelId: "raouche-rocks",
      coordinates: [35.5018, 33.8938],
      yearVisited: 2008,
      category: "travel",
    },
    {
      id: "tr",
      name: "Turkey",
      flag: "🇹🇷",
      landmarkModelId: "hagia-sophia",
      coordinates: [28.9784, 41.0082],
      yearVisited: 2025,
      category: "travel",
    },
    {
      id: "eg",
      name: "Egypt",
      flag: "🇪🇬",
      landmarkModelId: "pyramid-and-obelisk",
      coordinates: [31.2357, 30.0444],
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
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
      visualHint: "Kitchen worktop",
    },
    {
      id: "chess",
      label: "Chess",
      category: "games",
      sceneObjectId: "chess-module",
      image:
        "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=900&q=80",
      visualHint: "Chessboard",
    },
    {
      id: "pc",
      label: "PC",
      category: "technology",
      sceneObjectId: "pc-module",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      visualHint: "Desktop setup",
    },
    {
      id: "motorcycle",
      label: "Motorcycle",
      category: "mobility",
      sceneObjectId: "motorcycle",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
      visualHint: "Road ride",
    },
    {
      id: "swimming",
      label: "Swimming",
      category: "fitness",
      sceneObjectId: "swimming-pool",
      image:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80",
      visualHint: "Pool water",
    },
    {
      id: "walking",
      label: "Walking",
      category: "fitness",
      sceneObjectId: "walking-track",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      visualHint: "Walking path",
    },
    {
      id: "volleyball",
      label: "Volleyball",
      category: "sports",
      sceneObjectId: "volleyball-court",
      image:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80",
      visualHint: "Volleyball court",
    },
    {
      id: "movies",
      label: "Movies",
      category: "media",
      sceneObjectId: "wall-projector",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
      visualHint: "Cinema seats",
      note: "Represented by the projector video wall.",
    },
  ] satisfies Hobby[],

  culturalLibrary: {
    books: [
      {
        id: "",
        title: "الدولة المستحيلة",
        author: "وائل حلاق",
        posterImage:
          "https://covers.openlibrary.org/b/title/%D8%A7%D9%84%D8%AF%D9%88%D9%84%D8%A9%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%AD%D9%8A%D9%84%D8%A9-L.jpg",
      },
      {
        id: "",
        title: "The 7 Habits of Highly Effective People",
        author: "Stephen R. Covey",
        posterImage:
          "https://covers.openlibrary.org/b/title/The%207%20Habits%20of%20Highly%20Effective%20People-L.jpg",
      },
      {
        id: "",
        title: "الدين والعلمانية في سياق تاريخي",
        author: "عزمي بشارة",
        posterImage:
          "https://covers.openlibrary.org/b/title/%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D9%88%D8%A7%D9%84%D8%B9%D9%84%D9%85%D8%A7%D9%86%D9%8A%D8%A9%20%D9%81%D9%8A%20%D8%B3%D9%8A%D8%A7%D9%82%20%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE%D9%8A-L.jpg",
      },
      {
        id: "",
        title: "الديمقراطية وحقوق الإنسان في الإسلام",
        author: "راشد الغنوشي",
        posterImage:
          "https://covers.openlibrary.org/b/title/%D8%A7%D9%84%D8%AF%D9%8A%D9%85%D9%82%D8%B1%D8%A7%D8%B7%D9%8A%D8%A9%20%D9%88%D8%AD%D9%82%D9%88%D9%82%20%D8%A7%D9%84%D8%A5%D9%86%D8%B3%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-L.jpg",
      },
    ] satisfies CulturalItem[],
    documentaries: [
      {
        id: "",
        title: "الحروب الصليبية",
        link: "https://www.youtube.com/watch?v=m3mjPiwd5tU&list=PLmrET10kAE97RuC47XUMWxQ9BlXB_9QDB",
        posterImage: "https://img.youtube.com/vi/m3mjPiwd5tU/hqdefault.jpg",
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
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Knives_Out_poster.jpeg",
      },
      {
        id: "",
        title: "Darkest Hour",
        note: "2017",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Darkest_Hour_poster.png",
      },
      {
        id: "",
        title: "Detained",
        note: "2024",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Detained_film_poster.jpg",
      },
      {
        id: "",
        title: "Game Change",
        note: "2012",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Game_Change_2012_poster.jpg",
      },
      {
        id: "",
        title: "Jumanji",
        note: "2017",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Jumanji_Welcome_to_the_Jungle.png",
      },
      {
        id: "",
        title: "Now You See Me",
        note: "2013",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Now_You_See_Me_Poster.jpg",
      },
      {
        id: "",
        title: "Home Alone",
        note: "1990",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Home_alone_poster.jpg",
      },
      {
        id: "",
        title: "Split",
        note: "2016",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Split_(2017_film).jpg",
      },
      {
        id: "",
        title: "The Fault In Our Stars",
        note: "2014",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Fault_in_Our_Stars_(Official_Film_Poster).png",
      },
      {
        id: "",
        title: "The Hitman's Bodyguard",
        note: "2017",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/HitmansBodyguard.jpg",
      },
      {
        id: "",
        title: "The Irishman",
        note: "2019",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Irishman_poster.jpg",
      },
      {
        id: "",
        title: "The Shawshank Redemption",
        note: "1994",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/ShawshankRedemptionMoviePoster.jpg",
      },
      {
        id: "",
        title: "The Social Network",
        note: "2010",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Social_Network_film_poster.png",
      },
      {
        id: "",
        title: "Oppenheimer",
        note: "2023",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Oppenheimer_(film).jpg",
      },
      {
        id: "",
        title: "Pain Hustlers",
        note: "2023",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Pain_hustlers_film_poster.jpg",
      },
      {
        id: "",
        title: "True Memoirs Of an International Assassin",
        note: "2016",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/True_Memoirs_of_an_International_Assassin.jpg",
      },
      {
        id: "",
        title: "Yes Day",
        note: "2021",
        posterImage:
          "https://en.wikipedia.org/wiki/Special:Redirect/file/Yes_Day_film_poster.png",
      },
    ] satisfies CulturalItem[],
    podcasts: [
      {
        id: "",
        title: "القرآن والحياة - نايف بن نهار",
        link: "https://www.youtube.com/watch?v=Pfj4niPP0DY",
        posterImage: "https://img.youtube.com/vi/Pfj4niPP0DY/hqdefault.jpg",
      },
      {
        id: "",
        title: "Financial Literacy",
        link: "https://www.youtube.com/watch?v=V360AygOv7A",
        posterImage: "https://img.youtube.com/vi/V360AygOv7A/hqdefault.jpg",
      },
      {
        id: "",
        title: "Barack Obama - Hasan Minhaj",
        link: "https://www.youtube.com/watch?v=jAYVKZSWXhY",
        posterImage: "https://img.youtube.com/vi/jAYVKZSWXhY/hqdefault.jpg",
      },
    ] satisfies CulturalItem[],
    programs: [
      {
        id: "",
        title: "Jimmy Fallon",
        link: "https://www.youtube.com/@fallontonight",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/22/57388.jpg",
      },
      {
        id: "",
        title: "المخبر الاقتصادي",
        link: "https://www.youtube.com/@MokhbirEqtisadi",
        posterImage: "https://unavatar.io/youtube/MokhbirEqtisadi",
      },
      {
        id: "",
        title: "Zeteo - Mehdi Hasan",
        link: "https://www.youtube.com/@zeteo",
        posterImage: "https://unavatar.io/youtube/zeteo",
      },
      {
        id: "",
        title: "بدون ورق",
        link: "https://www.youtube.com/@BidonWaraq",
        posterImage: "https://unavatar.io/youtube/BidonWaraq",
      },
    ] satisfies CulturalItem[],
    series: [
      {
        id: "",
        title: "House Of Cards",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/169/424482.jpg",
      },
      {
        id: "",
        title: "The Mentalist",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/0/1239.jpg",
      },
      {
        id: "",
        title: "ضيعة ضايعة",
        posterImage:
          "https://upload.wikimedia.org/wikipedia/ar/b/b5/%D9%84%D9%82%D8%B7%D8%A9_%D8%B4%D8%A7%D8%B1%D8%A9_%D9%85%D8%B3%D9%84%D8%B3%D9%84_%D8%B6%D9%8A%D8%B9%D8%A9_%D8%B6%D8%A7%D9%8A%D8%B9%D8%A9.jpeg?utm_source=ar.wikipedia.org&utm_campaign=imageinfo&utm_content=original",
      },
      {
        id: "",
        title: "الخربة",
        posterImage: "https://i.ibb.co/MkWs0C6/image.jpg",
      },
      {
        id: "",
        title: "الكبير أوي",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/506/1267310.jpg",
      },
      {
        id: "",
        title: "البلاتوه - أحمد أمين",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/297/742636.jpg",
      },
      {
        id: "",
        title: "الصفارة - أحمد أمين",
        posterImage:
          "https://static.tvmaze.com/uploads/images/original_untouched/453/1134036.jpg",
      },
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

  healthyLifestyle: {
    summary:
      "Long-term personal care around fasting, sleep, diet, nutrition, weight, and movement.",
    items: [
      {
        id: "monday-thursday-fasting",
        label: "Mon and Thu fasting",
        fromYear: 2012,
        toYear: "current",
        cadence: "Mon and Thu",
        note: "Has been fasting Mon and Thu since 2012.",
        visualHint: "fasting",
      },
      {
        id: "early-sleep",
        label: "Early sleep routine",
        note: "Sleeps and gets up early as part of daily lifestyle care.",
        visualHint: "sleep",
      },
      {
        id: "reduced-sugar",
        label: "Reduced sugar consumption",
        fromYear: 2015,
        toYear: "current",
        note: "Reduced sugar consumption from 2015.",
        visualHint: "sugar",
      },
      {
        id: "adjusted-vegan-diet",
        label: "Adjusted vegan diet",
        fromYear: 2019,
        toYear: 2023,
        note: "Followed an adjusted vegan diet from 2019 to 2023.",
        visualHint: "vegan",
      },
      {
        id: "weekly-nutritionist",
        label: "Weekly nutritionist visits",
        fromYear: 2024,
        toYear: "current",
        cadence: "Weekly",
        note: "Has been visiting a nutritionist weekly since 2024.",
        visualHint: "nutritionist",
      },
      {
        id: "almost-30kg-lost",
        label: "Almost 30 kg lost",
        fromYear: 2024,
        toYear: "current",
        note: "Lost almost 30 kg through health and nutrition care.",
        visualHint: "weight-loss",
      },
      {
        id: "alternate-day-walking",
        label: "Walking exercise",
        cadence: "Alternate days",
        note: "Does walking exercise on alternate days.",
        visualHint: "walking",
      },
    ] satisfies HealthyLifestyleItem[],
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
