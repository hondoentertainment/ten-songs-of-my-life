export type PinHeight = "tall" | "medium" | "short";

export type TrackPin = {
  title: string;
  artist: string;
  year?: number;
  spotifyId?: string;
  appleId?: string;
  isrc?: string;
  imageUrl?: string;
  pinHeight?: PinHeight;
  spotifyUrl?: string;
  appleMusicUrl?: string;
};

export type Chapter = {
  id: string;
  number: number;
  stage: string;
  mood: string;
  title: string;
  story: string;
  seed: TrackPin;
  pins: TrackPin[];
  moodTags: string[];
  spotifyPlaylistUrl?: string;
  appleMusicPlaylistUrl?: string;
  coverHint?: string;
  accent: string;
};

const heights: PinHeight[] = ["tall", "medium", "short", "medium", "tall"];

function placeholderArt(seed: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="55%" stop-color="#1c1917"/>
        <stop offset="100%" stop-color="#0c0a09"/>
      </linearGradient>
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.75  0 0 0 0.08 0"/>
      </filter>
    </defs>
    <rect width="640" height="800" fill="url(#g)"/>
    <rect width="640" height="800" filter="url(#n)" opacity="0.55"/>
    <circle cx="320" cy="360" r="140" fill="none" stroke="#f5efe6" stroke-opacity="0.18" stroke-width="2"/>
    <circle cx="320" cy="360" r="48" fill="#0c0a09" fill-opacity="0.55"/>
    <text x="48" y="720" fill="#f5efe6" fill-opacity="0.55" font-family="Georgia, serif" font-size="28">${seed}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function pin(
  title: string,
  artist: string,
  accent: string,
  index: number,
  extras: Partial<TrackPin> = {},
): TrackPin {
  return {
    title,
    artist,
    pinHeight: heights[index % heights.length],
    imageUrl: placeholderArt(`${title}`, accent),
    ...extras,
  };
}

export const chapters: Chapter[] = [
  {
    id: "childhood-spark",
    number: 1,
    stage: "Childhood",
    mood: "Wide-eyed spark",
    title: "The first volume up",
    story:
      "Before playlists had names, there was the car stereo and the feeling that a song could invent a whole Saturday. This board is that first rush—bright, simple, impossible to forget.",
    seed: pin("Here Comes the Sun", "The Beatles", "#c2410c", 0, { year: 1969 }),
    pins: [
      pin("Three Little Birds", "Bob Marley & The Wailers", "#c2410c", 1),
      pin("You Are the Sunshine of My Life", "Stevie Wonder", "#c2410c", 2),
      pin("Yellow Submarine", "The Beatles", "#c2410c", 3),
      pin("Don't Worry Be Happy", "Bobby McFerrin", "#c2410c", 4),
      pin("What a Wonderful World", "Louis Armstrong", "#c2410c", 5),
    ],
    moodTags: ["feel good", "classic", "sunny"],
    coverHint: "sunflare through car window",
    accent: "#c2410c",
  },
  {
    id: "teen-voltage",
    number: 2,
    stage: "Teens",
    mood: "Electric voltage",
    title: "Headphones as armor",
    story:
      "The world got louder and so did the music. Walking home felt like a music video—every chorus a private manifesto.",
    seed: pin("Mr. Brightside", "The Killers", "#b45309", 0, { year: 2003 }),
    pins: [
      pin("Seven Nation Army", "The White Stripes", "#b45309", 1),
      pin("Float On", "Modest Mouse", "#b45309", 2),
      pin("Take Me Out", "Franz Ferdinand", "#b45309", 3),
      pin("Somebody Told Me", "The Killers", "#b45309", 4),
      pin("I Bet You Look Good on the Dancefloor", "Arctic Monkeys", "#b45309", 5),
    ],
    moodTags: ["indie rock", "garage", "night walk"],
    coverHint: "neon sidewalk rain",
    accent: "#b45309",
  },
  {
    id: "early-twenties-drive",
    number: 3,
    stage: "Early twenties",
    mood: "Restless drive",
    title: "Highway at 1 a.m.",
    story:
      "Everything was possible and nothing was settled. These songs sound like open roads, cheap coffee, and the nerve to keep going.",
    seed: pin("Midnight City", "M83", "#92400e", 0, { year: 2011 }),
    pins: [
      pin("Intro", "The xx", "#92400e", 1),
      pin("Holocene", "Bon Iver", "#92400e", 2),
      pin("Little Dark Age", "MGMT", "#92400e", 3),
      pin("The Less I Know The Better", "Tame Impala", "#92400e", 4),
      pin("Electric Feel", "MGMT", "#92400e", 5),
    ],
    moodTags: ["synth", "night drive", "dreamy"],
    coverHint: "dashboard lights on empty freeway",
    accent: "#92400e",
  },
  {
    id: "first-love",
    number: 4,
    stage: "First love",
    mood: "Soft ignition",
    title: "Songs that learned your name",
    story:
      "Not every love lasts, but the soundtrack does. Slow burns, shared earbuds, and the ache of almost.",
    seed: pin("Pink + White", "Frank Ocean", "#a16207", 0, { year: 2016 }),
    pins: [
      pin("Ivy", "Frank Ocean", "#a16207", 1),
      pin("Motion Picture Soundtrack", "Radiohead", "#a16207", 2),
      pin("Fade Into You", "Mazzy Star", "#a16207", 3),
      pin("Lover, You Should've Come Over", "Jeff Buckley", "#a16207", 4),
      pin("Cherry Wine", "Hozier", "#a16207", 5),
    ],
    moodTags: ["romantic", "r&b", "tender"],
    coverHint: "golden hour kitchen light",
    accent: "#a16207",
  },
  {
    id: "heartbreak-weather",
    number: 5,
    stage: "Heartbreak",
    mood: "Storm weather",
    title: "When the sky broke",
    story:
      "Some seasons ask to be survived, not explained. These pins are rain on glass—beautiful, heavy, necessary.",
    seed: pin("Liability", "Lorde", "#78716c", 0, { year: 2017 }),
    pins: [
      pin("Motion Sickness", "Phoebe Bridgers", "#78716c", 1),
      pin("Somebody Else", "The 1975", "#78716c", 2),
      pin("Skinny Love", "Bon Iver", "#78716c", 3),
      pin("All I Want", "Kodaline", "#78716c", 4),
      pin("The Night We Met", "Lord Huron", "#78716c", 5),
    ],
    moodTags: ["sad", "indie", "rain"],
    coverHint: "wet window reflections",
    accent: "#78716c",
  },
  {
    id: "ambition-fire",
    number: 6,
    stage: "Building years",
    mood: "Ambition fire",
    title: "Work like a chorus",
    story:
      "Late nights, early alarms, the belief that effort could bend the future. Music as caffeine and courage.",
    seed: pin("Stronger", "Kanye West", "#d97706", 0, { year: 2007 }),
    pins: [
      pin("Lose Yourself", "Eminem", "#d97706", 1),
      pin("Can't Hold Us", "Macklemore & Ryan Lewis", "#d97706", 2),
      pin("Power", "Kanye West", "#d97706", 3),
      pin("HUMBLE.", "Kendrick Lamar", "#d97706", 4),
      pin("Believer", "Imagine Dragons", "#d97706", 5),
    ],
    moodTags: ["hip hop", "anthem", "focus"],
    coverHint: "city skyline before dawn",
    accent: "#d97706",
  },
  {
    id: "found-family",
    number: 7,
    stage: "Found family",
    mood: "Kitchen light joy",
    title: "People who feel like home",
    story:
      "Chosen friends, shared tables, laughter that resets the week. This board is warm rooms and better company.",
    seed: pin("Home", "Edward Sharpe & The Magnetic Zeros", "#ca8a04", 0, { year: 2009 }),
    pins: [
      pin("Ho Hey", "The Lumineers", "#ca8a04", 1),
      pin("Stubborn Love", "The Lumineers", "#ca8a04", 2),
      pin("Ophelia", "The Lumineers", "#ca8a04", 3),
      pin("Shut Up and Dance", "Walk the Moon", "#ca8a04", 4),
      pin("Best Day of My Life", "American Authors", "#ca8a04", 5),
    ],
    moodTags: ["folk", "friends", "celebration"],
    coverHint: "string lights over a long table",
    accent: "#ca8a04",
  },
  {
    id: "solo-clarity",
    number: 8,
    stage: "Solo chapter",
    mood: "Quiet clarity",
    title: "Learning your own tempo",
    story:
      "Alone without lonely. Morning walks, notebooks, songs that make space instead of noise.",
    seed: pin("Holocene", "Bon Iver", "#a8a29e", 0, { year: 2011 }),
    pins: [
      pin("Myth", "Beach House", "#a8a29e", 1),
      pin("Silver Soul", "Beach House", "#a8a29e", 2),
      pin("Slow Burn", "Kacey Musgraves", "#a8a29e", 3),
      pin("Bloom", "The Paper Kites", "#a8a29e", 4),
      pin("To Build a Home", "The Cinematic Orchestra", "#a8a29e", 5),
    ],
    moodTags: ["ambient", "reflective", "soft"],
    coverHint: "fog over empty beach",
    accent: "#a8a29e",
  },
  {
    id: "reinvention",
    number: 9,
    stage: "Reinvention",
    mood: "Fresh voltage",
    title: "Start the record over",
    story:
      "A new city, a new job, a new version of yourself. The bassline says you can still surprise your own life.",
    seed: pin("Levitating", "Dua Lipa", "#f59e0b", 0, { year: 2020 }),
    pins: [
      pin("Blinding Lights", "The Weeknd", "#f59e0b", 1),
      pin("Good as Hell", "Lizzo", "#f59e0b", 2),
      pin("About Damn Time", "Lizzo", "#f59e0b", 3),
      pin("As It Was", "Harry Styles", "#f59e0b", 4),
      pin("Heat Waves", "Glass Animals", "#f59e0b", 5),
    ],
    moodTags: ["pop", "dance", "fresh start"],
    coverHint: "mirror disco light",
    accent: "#f59e0b",
  },
  {
    id: "now-horizon",
    number: 10,
    stage: "Right now",
    mood: "Open horizon",
    title: "Still becoming",
    story:
      "Not a finale—just the latest chapter. These songs hold gratitude for the past and appetite for whatever comes next.",
    seed: pin("Saturn", "SZA", "#eab308", 0, { year: 2022 }),
    pins: [
      pin("Kill Bill", "SZA", "#eab308", 1),
      pin("Snooze", "SZA", "#eab308", 2),
      pin("Die With A Smile", "Lady Gaga & Bruno Mars", "#eab308", 3),
      pin("Espresso", "Sabrina Carpenter", "#eab308", 4),
      pin("Good Luck, Babe!", "Chappell Roan", "#eab308", 5),
    ],
    moodTags: ["current", "r&b pop", "hopeful"],
    coverHint: "sunrise over rooftops",
    accent: "#eab308",
  },
];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAllChapterIds(): string[] {
  return chapters.map((c) => c.id);
}
