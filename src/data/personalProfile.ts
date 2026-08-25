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
  fromYear: number;
  toYear: number | "current";
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
    | "walking"
    | "stimulants";
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
    scope: "From Makkah to Kuala Lumpur to Amman",
    description:
      "A personal, non-professional 3D website centered on hobbies, places, media, and everyday interests.",
  },

  nineChoices: {
    title: "9",
    label: "Three life paths. Three chapters in each.",
    summary:
      "The number 9 maps my story across three life paths—study, work, and place—with three defining chapters in each.",
    groups: [
      {
        id: "study",
        label: "Study",
        summary:
          "My academic route moved from an interest in politics, through engineering, and finally to computer science.",
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
            detail: "I spent three semesters in engineering before switching.",
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
          "My professional path moved through administration and finance, visual design, and then web development.",
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
            detail: "I currently work in web development.",
            outcome: "2018-current",
          },
        ],
      },
      {
        id: "stays",
        label: "Stays",
        summary:
          "My story of place is anchored by three homes: Makkah, Kuala Lumpur, and Amman.",
        choices: [
          {
            id: "makkah",
            label: "Makkah",
            detail: "Makkah is one of the three places that shaped me.",
          },
          {
            id: "kuala-lumpur",
            label: "Kuala Lumpur",
            detail: "Kuala Lumpur is one of the three places that shaped me.",
          },
          {
            id: "amman",
            label: "Amman",
            detail: "Amman is one of the three places that shaped me.",
          },
        ],
      },
    ] satisfies NineChoiceGroup[],
  },

  professionalBackground: {
    note: "I include my work history only as life context; this website focuses on my personal story.",
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
      note: "I originally planned to study political science before changing direction.",
    },
    {
      id: "engineering",
      label: "Engineering",
      field: "Engineering",
      status: "switched",
      duration: "3 semesters",
      note: "I changed direction after spending three semesters in engineering.",
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
      id: "travelling",
      label: "Travelling",
      category: "travel",
      sceneObjectId: "floating-globe",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
      visualHint: "Passport, map, and travel camera",
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
          "https://ak-asset.jarir.com/akeneo-prod/asset/f/8/9/7/f897adfede49dfa3310474e62bc5a917d02dd7bc_623123.jpg",
      },
      {
        id: "",
        title: "الدين والعلمانية في سياق تاريخي",
        author: "عزمي بشارة",
        posterImage:
          "https://www.neelwafurat.com/images/lb/abookstore/covers/carton/240/240786.jpg",
      },
      {
        id: "",
        title: "Modernity and the Holocaust",
        author: "Zygmunt Bauman",
        posterImage:
          "https://images.pangobooks.com/images/5a7db3d3-ce18-46f9-a4ed-f803332fdbbe?crop=1%3A1&quality=85&width=800",
      },
      {
        id: "",
        title: "How to attract people like a magnet",
        author: "Leil Lowndes",
        posterImage:
          "https://images.blinkist.io/images/books/65112768195d9600088b22d4/1_1/470.jpg",
      },
      {
        id: "",
        title: "الديمقراطية وحقوق الإنسان في الإسلام",
        author: "راشد الغنوشي",
        posterImage:
          "https://www.neelwafurat.com/images/lb/abookstore/covers/normal/211/211675.jpg",
      },
    ] satisfies CulturalItem[],
    documentaries: [
      {
        id: "",
        title: "الحروب الصليبية",
        link: "https://www.youtube.com/watch?v=m3mjPiwd5tU&list=PLmrET10kAE97RuC47XUMWxQ9BlXB_9QDB",
        posterImage: "https://img.youtube.com/vi/m3mjPiwd5tU/hqdefault.jpg",
      },
      {
        id: "",
        title: "Trump’s Power",
        link: "https://www.youtube.com/watch?v=28sQyweAPRs",
        posterImage: "https://img.youtube.com/vi/28sQyweAPRs/hqdefault.jpg",
      },
      {
        id: "",
        title: "طعامنا والمزاج",
        link: "https://www.youtube.com/watch?v=IyEh5mvHicM",
        posterImage: "https://img.youtube.com/vi/IyEh5mvHicM/hqdefault.jpg",
      },
      {
        id: "",
        title: "مملكة الحجاز",
        link: "https://www.youtube.com/watch?v=1gWVCoYAcVs",
        posterImage: "https://img.youtube.com/vi/1gWVCoYAcVs/hqdefault.jpg",
      },
      {
        id: "",
        title: "Building By Recycling",
        link: "https://www.youtube.com/watch?v=pWpH9R-yY4c",
        posterImage: "https://img.youtube.com/vi/pWpH9R-yY4c/hqdefault.jpg",
      },
      {
        id: "",
        title: "هياكل عملاقة - ناشونال جيوجرافيك أبو ظبي",
        link: "https://www.youtube.com/watch?v=Kqo95SLWCkw",
        posterImage: "https://img.youtube.com/vi/Kqo95SLWCkw/hqdefault.jpg",
      },
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
      // {
      //   id: "",
      //   title: "Game Change",
      //   note: "2012",
      //   posterImage:
      //     "https://en.wikipedia.org/wiki/Special:Redirect/file/Game_Change_2012_poster.jpg",
      // },
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
      // {
      //   id: "",
      //   title: "The Fault In Our Stars",
      //   note: "2014",
      //   posterImage:
      //     "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Fault_in_Our_Stars_(Official_Film_Poster).png",
      // },
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
      // {
      //   id: "",
      //   title: "The Social Network",
      //   note: "2010",
      //   posterImage:
      //     "https://en.wikipedia.org/wiki/Special:Redirect/file/The_Social_Network_film_poster.png",
      // },
      // {
      //   id: "",
      //   title: "Oppenheimer",
      //   note: "2023",
      //   posterImage:
      //     "https://en.wikipedia.org/wiki/Special:Redirect/file/Oppenheimer_(film).jpg",
      // },
      // {
      //   id: "",
      //   title: "Pain Hustlers",
      //   note: "2023",
      //   posterImage:
      //     "https://en.wikipedia.org/wiki/Special:Redirect/file/Pain_hustlers_film_poster.jpg",
      // },
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
    games: [
      {
        id: "chess",
        title: "Chess",
        note: "Strategy game",
        posterImage:
          "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "exploding-kittens",
        title: "Exploding Kittens",
        note: "Card game",
        posterImage:
          "https://bizweb.dktcdn.net/100/316/286/articles/exploding-kittens-board-game-box.jpeg?v=1671445100673",
      },
      {
        id: "counter-strike-2",
        title: "Counter-Strike 2",
        note: "Tactical shooter",
        posterImage:
          "https://images.launchbox-app.com/d6b28509-ab50-4795-a2bb-a96bfb2a12b0.jpg",
      },
      {
        id: "cities-skylines",
        title: "Cities: Skylines",
        note: "City-building game",
        posterImage:
          "https://image.jeuxvideo.com/medias-sm/142790/1427902224-6843-jaquette-avant.jpg",
      },
      {
        id: "red-alert-3",
        title: "Command & Conquer: Red Alert 3",
        note: "Real-time strategy game",
        posterImage:
          "https://cdn.wikimg.net/en/strategywiki/images/f/f9/Command_%26_Conquer_Red_Alert_3_box.jpg",
      },
      {
        id: "secret-hitler",
        title: "Secret Hitler",
        note: "Social deduction board game",
        posterImage:
          "https://www.boardgamebandit.ca/cdn/shop/products/secret-hitler-board-game_1024x1024.jpg?v=1610330614",
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
        title: "هندسة الهوية - علي السند",
        link: "https://www.youtube.com/watch?v=t78c4PZ0mZw",
        posterImage: "https://img.youtube.com/vi/t78c4PZ0mZw/hqdefault.jpg",
      },
      {
        id: "",
        title: "بودكاست سكن",
        link: "https://www.youtube.com/watch?v=oNiNk_D8buE",
        posterImage: "https://img.youtube.com/vi/oNiNk_D8buE/hqdefault.jpg",
      },
      {
        id: "",
        title: "Financial Literacy",
        link: "https://www.youtube.com/watch?v=V360AygOv7A",
        posterImage: "https://img.youtube.com/vi/V360AygOv7A/hqdefault.jpg",
      },
      {
        id: "",
        title: "صفقة القرن - عزمي بشارة",
        link: "https://www.youtube.com/watch?v=dwYofUwTXlQ",
        posterImage: "https://img.youtube.com/vi/dwYofUwTXlQ/hqdefault.jpg",
      },
      {
        id: "",
        title: "تجربتي - المنصف المرزوقي",
        link: "https://www.youtube.com/watch?v=iRUfPb1HgUk",
        posterImage: "https://img.youtube.com/vi/iRUfPb1HgUk/hqdefault.jpg",
      },
    ] satisfies CulturalItem[],
    programs: [
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
    ] satisfies CulturalItem[],
    note: "I keep this as a factual, curated record of what I have read and watched.",
  },

  socialMedia: {
    generalNote:
      "I have Facebook, Instagram, and SoundCloud accounts, but I have not actively engaged with social media for years.",
    accounts: [
      {
        id: "facebook",
        platform: "Facebook",
        engagement: "inactive",
        link: "https://www.facebook.com/makkahwi",
        note: "I have not actively used or engaged with this account for years.",
      },
      {
        id: "instagram",
        platform: "Instagram",
        engagement: "inactive",
        link: "https://www.instagram.com/makkahwi",
        note: "I have not actively used or engaged with this account for years.",
      },
      {
        id: "soundcloud",
        platform: "SoundCloud",
        engagement: "inactive",
        link: "https://soundcloud.com/makkahwi",
        note: "I update this account occasionally.",
      },
    ] satisfies SocialAccount[],
  },

  healthyLifestyle: {
    summary:
      "I care for my health through long-term habits around fasting, sleep, nutrition, weight, and movement.",
    items: [
      {
        id: "monday-thursday-fasting",
        label: "Mon and Thu fasting",
        fromYear: 2012,
        toYear: "current",
        note: "I have been fasting on Mondays and Thursdays since 2012.",
        visualHint: "fasting",
      },
      {
        id: "early-sleep",
        label: "Early sleep routine",
        note: "I sleep and wake up early as part of my daily routine.",
        visualHint: "sleep",
      },
      {
        id: "reduced-sugar",
        label: "Reduced sugar consumption",
        fromYear: 2015,
        toYear: "current",
        note: "I have reduced my sugar consumption since 2015.",
        visualHint: "sugar",
      },
      {
        id: "adjusted-vegan-diet",
        label: "Adjusted vegan diet",
        fromYear: 2019,
        toYear: 2023,
        note: "I followed an adjusted vegan diet from 2019 to 2023.",
        visualHint: "vegan",
      },
      {
        id: "weekly-nutritionist",
        label: "Weekly nutritionist visits",
        fromYear: 2024,
        toYear: "current",
        note: "I have been visiting a nutritionist weekly since 2024.",
        visualHint: "nutritionist",
      },
      {
        id: "almost-30kg-lost",
        label: "Almost 30 kg lost",
        fromYear: 2024,
        toYear: "current",
        note: "I have lost almost 30 kg through consistent health and nutrition care.",
        visualHint: "weight-loss",
      },
      {
        id: "alternate-day-walking",
        label: "Walking exercise",
        cadence: "Alternate days",
        note: "I walk for exercise on alternate days.",
        visualHint: "walking",
      },
      {
        id: "reduced-Stimulants",
        label: "Reduced stimulants",
        cadence: "No more than 1 cup of green tea per day",
        note: "I have reduced my stimulant consumption.",
        visualHint: "stimulants",
      },
    ] satisfies HealthyLifestyleItem[],
  },

  stays: [
    {
      id: "makkah",
      label: "Makkah →",
      fromYear: 1993,
      toYear: 2011,
      destination: "Makkah",
    },
    {
      id: "kuala-lumpur",
      label: "Kuala Lumpur →",
      fromYear: 2011,
      toYear: 2021,
      destination: "Kuala Lumpur",
    },
    {
      id: "amman",
      label: "Amman →",
      fromYear: 2021,
      toYear: "current",
      destination: "Amman",
    },
  ] satisfies Stays[],
} as const;

export type PersonalProfile = typeof personalProfile;
