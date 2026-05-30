export interface Dog {
  slug: string;
  nickname: string;
  fullName: string;
  fullNameEn: string;
  breed: string;
  breedCode: string;
  born: string;
  rkfNumber: string;
  brand: string;
  chip: string;
  bookNumber: string;
  tags: string[];
  bio: string;
  photos: string[];
}

export const dogs: Dog[] = [
  {
    slug: "ten",
    nickname: "Тень",
    fullName: "Афина Мудрая",
    fullNameEn: "Afina Mudraya",
    breed: "Веймаранер",
    breedCode: "FCI №99",
    born: "25.05.2024",
    rkfNumber: "RKF 7028588",
    brand: "VXE 588",
    chip: "—",
    bookNumber: "51432",
    tags: ["Шоу"],
    bio: "Молодая, умная, наблюдательная. Несёт имя богини мудрости — и оправдывает его каждый день.",
    photos: ["/images/dogs/ten-1.jpg"],
  },
  {
    slug: "tayga",
    nickname: "Тайга",
    fullName: "Эмуль Дэ Гепард Гелила Аль Равда",
    fullNameEn: "Emul De Gepard Gelila Al Rawda",
    breed: "Салюки",
    breedCode: "FCI №269",
    born: "17.07.2024",
    rkfNumber: "RKF 7132438",
    brand: "EDG 20",
    chip: "900215007512420",
    bookNumber: "51460",
    tags: ["Курсинг", "Шоу"],
    bio: "Стремительная и своенравная. В поле — чистая скорость, дома — нежность и характер.",
    photos: ["/images/dogs/tayga-1.jpg"],
  },
  {
    slug: "tundra",
    nickname: "Тундра",
    fullName: "Бэль Этуаль Каяла",
    fullNameEn: "Bel Etual Kayla",
    breed: "Салюки",
    breedCode: "FCI №269",
    born: "19.02.2025",
    rkfNumber: "RKF 7257850",
    brand: "TNE 1383",
    chip: "643031265199290",
    bookNumber: "51434",
    tags: ["Курсинг", "Шоу"],
    bio: "Самая младшая. Звезда с первых дней — имя обязывает.",
    photos: ["/images/dogs/tundra-1.jpg"],
  },
];