import type {
  GateQuestion,
  MemoryEntry,
  VHSVideo,
  AudioTrack,
  EasterEgg,
  ArchiveCardData,
  LetterContent,
  GalleryPhoto,
} from "@/types";

// ============================================
// GATE QUESTIONS — inside jokes بينكم
// TODO: بدلها بأسئلة حقيقية
// ============================================
export const GATE_QUESTIONS: GateQuestion[] = [
  {
    id: "q1",
    question: "فين أول مكان اتقابلنا فيه؟",
    acceptedAnswers: ["مدرسه", "المدرسه", "school"],
    hint: "فكر في السنة اللي اتعرفنا فيها",
  },
  {
    id: "q2",
    question: "ايه اللقب اللي بينادينك بيه بس أنا؟",
    acceptedAnswers: ["لقب"],
    hint: "الحاجة اللي بتضايقك منها بس بتحبها",
  },
  {
    id: "q3",
    question: "ايه أكتر حاجة كنا بنعملها مع بعض؟",
    acceptedAnswers: ["حاجه"],
    hint: "فكر في أكتر يوم فاضي كنا بنضيعه",
  },
];

// ============================================
// ARCHIVE DASHBOARD CARDS
// ============================================
export const ARCHIVE_CARDS: ArchiveCardData[] = [
  {
    id: "timeline",
    label: "خط الذكريات",
    description: "رحلة عبر السنين اللي عدت",
    icon: "History",
    targetStage: "timeline",
  },
  {
    id: "gallery",
    label: "المتحف",
    description: "كل الصور في مكان واحد",
    icon: "GalleryHorizontalEnd",
    targetStage: "gallery",
  },
  {
    id: "vhs",
    label: "الأرشيف المرئي",
    description: "تسجيلات قديمة من زمان",
    icon: "Video",
    targetStage: "vhs",
  },
  {
    id: "letter",
    label: "رسالة أخيرة",
    description: "كلمة من القلب",
    icon: "Mail",
    targetStage: "ending",
  },
];

// ============================================
// MEMORY TIMELINE — الذكريات
// TODO: استبدلها بالذكريات الحقيقية والصور
// (الصور دي لسه placeholders — لو عايز تحط صورك الحقيقية هنا
// قولي أنهي صورة من public/images تروح لأنهي سنة وهظبطها)
// ============================================
export const MEMORIES: MemoryEntry[] = [
  {
    id: "memory-1",
    year: "2015",
    title: "البداية",
    description: "أول لقاء، مكناش نعرف إن ده هيبقى صداقة عمر.",
    transitionVariant: "reveal-slide",
    photos: [
      { id: "p1", src: "/images/placeholder-1.jpg", alt: "ذكرى 2015" },
      { id: "p2", src: "/images/placeholder-2.jpg", alt: "ذكرى 2015" },
    ],
  },
  {
    id: "memory-2",
    year: "2018",
    title: "الرحلة",
    description: "أول سفرة مع بعض، وأول مرة نضحك لحد الصبح.",
    transitionVariant: "mask-wipe",
    photos: [
      { id: "p3", src: "/images/placeholder-3.jpg", alt: "ذكرى 2018" },
      { id: "p4", src: "/images/placeholder-4.jpg", alt: "ذكرى 2018" },
      { id: "p5", src: "/images/placeholder-5.jpg", alt: "ذكرى 2018" },
    ],
  },
  {
    id: "memory-3",
    year: "2021",
    title: "الأوقات الصعبة",
    description: "لما الدنيا كانت وحشة، كنت جنبي.",
    transitionVariant: "parallax-stack",
    photos: [{ id: "p6", src: "/images/placeholder-6.jpg", alt: "ذكرى 2021" }],
  },
  {
    id: "memory-4",
    year: "2024",
    title: "دلوقتي",
    description: "ولسه الرحلة مستمرة.",
    transitionVariant: "reveal-slide",
    photos: [
      { id: "p7", src: "/images/placeholder-7.jpg", alt: "ذكرى 2024" },
      { id: "p8", src: "/images/placeholder-8.jpg", alt: "ذكرى 2024" },
    ],
  },
  {
    id: "memory-secret-1",
    year: "؟؟؟؟",
    title: "ذكرى سرية",
    description: "ذكرى ما كنش المفروض حد يشوفها 👀",
    transitionVariant: "mask-wipe",
    isSecret: true,
    photos: [{ id: "ps1", src: "/images/placeholder-secret.jpg", alt: "سر" }],
  },
];

// ============================================
// VHS VIDEOS — تسجيلات حقيقية
// ============================================
export const VHS_VIDEOS: VHSVideo[] = [
  {
    id: "vhs-1",
    src: "/videos/IMG_7751.MP4",
    poster: "",
    title: "تسجيل رقم واحد",
    dateLabel: "REC. TAPE 01",
  },
  {
    id: "vhs-2",
    src: "/videos/IMG_7753.MP4",
    poster: "",
    title: "تسجيل رقم اتنين",
    dateLabel: "REC. TAPE 02",
  },
  {
    id: "vhs-3",
    src: "/videos/IMG_7754.MP4",
    poster: "",
    title: "تسجيل رقم تلاتة",
    dateLabel: "REC. TAPE 03",
  },
  {
    id: "vhs-4",
    src: "/videos/IMG_7755.MP4",
    poster: "",
    title: "تسجيل رقم أربعة",
    dateLabel: "REC. TAPE 04",
  },
  {
    id: "vhs-5",
    src: "/videos/IMG_1634.MOV",
    poster: "",
    title: "تسجيل رقم خمسة",
    dateLabel: "REC. TAPE 05",
  },
  {
    id: "vhs-6",
    src: "/videos/IMG_6912.MOV",
    poster: "",
    title: "تسجيل رقم ستة",
    dateLabel: "REC. TAPE 06",
  },
];

// ============================================
// AUDIO TRACKS
// ============================================
export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "ambient-1",
    src: "/audio/ambient-theme.mp3",
    title: "Ambient Theme",
  },
];

// ============================================
// EASTER EGGS
// ============================================
export const EASTER_EGGS: EasterEgg[] = [
  {
    id: "egg-konami",
    trigger: "konami",
    unlockedMemoryId: "memory-secret-1",
    title: "لقيتها! 🎉",
    content: "مبروك، لقيت الذكرى السرية. مكنتش فاكر إنك هتوصلها فعلاً.",
    isUnlocked: false,
  },
  {
    id: "egg-logo-click",
    trigger: "click-count",
    triggerConfig: { targetId: "archive-logo", requiredCount: 5 },
    title: "فضولي زيادة 👀",
    content: "طب بما إنك دوست كذا مرة... خد ذكرى تانية بونص.",
    isUnlocked: false,
  },
];

// ============================================
// GALLERY (museum-style collection) — الصور الحقيقية كلها
// ترتيبها اتعمل عشوائي عشان تحس إنه أرشيف مش قايمة مرتبة
// ============================================
const GALLERY_FILENAMES = [
  "photo_35_2026-07-20_21-42-06.jpg",
  "photo_43_2026-07-20_21-42-06.jpg",
  "photo_29_2026-07-20_21-42-06.jpg",
  "photo_2_2026-07-20_21-42-06.jpg",
  "photo_23_2026-07-20_21-42-06.jpg",
  "photo_8_2026-07-20_21-42-06.jpg",
  "photo_25_2026-07-20_21-42-06.jpg",
  "photo_2_2026-07-21_15-13-57.jpg",
  "photo_38_2026-07-20_21-42-06.jpg",
  "photo_7_2026-07-20_21-42-06.jpg",
  "photo_4_2026-07-21_15-13-57.jpg",
  "photo_5_2026-07-21_15-13-57.jpg",
  "photo_3_2026-07-20_21-42-06.jpg",
  "photo_21_2026-07-20_21-42-06.jpg",
  "photo_10_2026-07-20_21-42-06.jpg",
  "photo_9_2026-07-20_21-42-06.jpg",
  "photo_33_2026-07-20_21-42-06.jpg",
  "photo_26_2026-07-20_21-42-06.jpg",
  "photo_48_2026-07-20_21-42-06.jpg",
  "photo_36_2026-07-20_21-42-06.jpg",
  "photo_3_2026-07-21_15-13-57.jpg",
  "photo_47_2026-07-20_21-42-06.jpg",
  "photo_32_2026-07-20_21-42-06.jpg",
  "photo_11_2026-07-20_21-42-06.jpg",
  "photo_41_2026-07-20_21-42-06.jpg",
  "photo_30_2026-07-20_21-42-06.jpg",
  "photo_40_2026-07-20_21-42-06.jpg",
  "photo_1_2026-07-21_15-13-57.jpg",
  "photo_5_2026-07-20_21-42-06.jpg",
  "photo_42_2026-07-20_21-42-06.jpg",
  "photo_45_2026-07-20_21-42-06.jpg",
  "photo_19_2026-07-20_21-42-06.jpg",
  "photo_12_2026-07-20_21-42-06.jpg",
  "photo_27_2026-07-20_21-42-06.jpg",
  "photo_44_2026-07-20_21-42-06.jpg",
  "photo_6_2026-07-20_21-42-06.jpg",
  "photo_37_2026-07-20_21-42-06.jpg",
  "photo_1_2026-07-20_21-42-06.jpg",
  "photo_46_2026-07-20_21-42-06.jpg",
  "photo_17_2026-07-20_21-42-06.jpg",
  "photo_15_2026-07-20_21-42-06.jpg",
  "photo_39_2026-07-20_21-42-06.jpg",
  "photo_22_2026-07-20_21-42-06.jpg",
  "photo_34_2026-07-20_21-42-06.jpg",
  "placeholder-1.jpg",
  "placeholder-2.jpg",
  "placeholder-3.jpg",
  "placeholder-4.jpg",
  "placeholder-5.jpg",
  "placeholder-6.jpg",
  "placeholder-7.jpg",
  "placeholder-8.jpg",
  "placeholder-secret.jpg",
];

export const GALLERY_PHOTOS: GalleryPhoto[] = GALLERY_FILENAMES.map(
  (filename, i) => ({
    id: `gallery-${i + 1}`,
    src: `/images/${filename}`,
    alt: `ذكرى رقم ${i + 1}`,
  })
);

// ============================================
// ENDING LETTER
// TODO: استبدلها بالرسالة الحقيقية
// ============================================
export const LETTER_CONTENT: LetterContent = {
  greeting: "يا صاحبي،",
  paragraphs: [
    "مش عارف أبدأ الكلام إزاي بصراحة.",
    "كل سنة بتعدي وأنا بحس إن الصداقة دي حاجة نادرة، ومش كل حد بيحصله صاحب زيك.",
    "الأرشيف ده مكنش كفاية إني أحط فيه كل حاجة، بس حبيت تحس إن الذكريات دي لسه موجودة وهتفضل.",
    "كل سنة وانت طيب يا أغلى صديق.",
  ],
  signature: "صاحبك اللي مش هيتغير",
};
