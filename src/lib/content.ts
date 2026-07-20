import type {
  GateQuestion,
  MemoryEntry,
  VHSVideo,
  AudioTrack,
  EasterEgg,
  ArchiveCardData,
  LetterContent,
} from "@/types";

// ============================================
// GATE QUESTIONS — inside jokes بينكم
// TODO: بدلها بأسئلة حقيقية
// ============================================
export const GATE_QUESTIONS: GateQuestion[] = [
  {
    id: "q1",
    question: "فين أول مكان اتقابلنا فيه؟ ",
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
    id: "photos",
    label: "الصور",
    description: "لحظات اتحفظت للأبد",
    icon: "Image",
    targetSectionId: "photos-section",
  },
  {
    id: "vhs",
    label: "الأرشيف المرئي",
    description: "تسجيلات قديمة من زمان",
    icon: "Video",
    targetSectionId: "vhs-section",
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
// VHS VIDEOS
// TODO: استبدلها بفيديوهات حقيقية
// ============================================
export const VHS_VIDEOS: VHSVideo[] = [
  {
    id: "vhs-1",
    src: "/videos/placeholder-1.mp4",
    poster: "/images/vhs-poster-1.jpg",
    title: "الرحلة الأولى",
    dateLabel: "REC. SUMMER '18",
  },
  {
    id: "vhs-2",
    src: "/videos/placeholder-2.mp4",
    poster: "/images/vhs-poster-2.jpg",
    title: "عيد ميلاد سنة ما",
    dateLabel: "REC. WINTER '20",
  },
];

// ============================================
// AUDIO TRACKS
// TODO: استبدلها بترانك حقيقي
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
