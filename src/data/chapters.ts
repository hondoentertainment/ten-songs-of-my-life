import type { CategoryId } from "@/data/categories";

export type PinHeight = "tall" | "medium" | "short";

export type TrackPin = {
  title: string;
  artist: string;
  year?: number;
  spotifyId?: string;
  appleId?: string;
  isrc?: string;
  imageUrl?: string;
  previewUrl?: string;
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
  categories: CategoryId[];
  spotifyPlaylistUrl?: string;
  appleMusicPlaylistUrl?: string;
  coverHint?: string;
  accent: string;
  /** Highlighted as this week's mood drop */
  weeklyDrop?: boolean;
};

const heights: PinHeight[] = ["tall", "medium", "short", "medium", "tall"];

function placeholderArt(_seed: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="45%" stop-color="#2a241f"/>
        <stop offset="100%" stop-color="#0a0908"/>
      </linearGradient>
      <radialGradient id="v" cx="50%" cy="42%" r="55%">
        <stop offset="0%" stop-color="#f7f2ea" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="800" fill="url(#g)"/>
    <rect width="800" height="800" fill="url(#v)"/>
    <circle cx="400" cy="400" r="168" fill="none" stroke="#f7f2ea" stroke-opacity="0.16" stroke-width="2"/>
    <circle cx="400" cy="400" r="52" fill="#0a0908" fill-opacity="0.55"/>
    <circle cx="400" cy="400" r="10" fill="#f7f2ea" fill-opacity="0.35"/>
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
    categories: ["timeline", "rituals"],
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
    categories: ["timeline", "energy"],
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
    categories: ["timeline", "places", "energy"],
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
    categories: ["timeline", "heart"],
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
    categories: ["timeline", "heart"],
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
    categories: ["timeline", "energy"],
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
    seed: pin("Home", "Edward Sharpe & The Magnetic Zeros", "#ca8a04", 0, {
      year: 2009,
    }),
    pins: [
      pin("Ho Hey", "The Lumineers", "#ca8a04", 1),
      pin("Stubborn Love", "The Lumineers", "#ca8a04", 2),
      pin("Ophelia", "The Lumineers", "#ca8a04", 3),
      pin("Shut Up and Dance", "Walk the Moon", "#ca8a04", 4),
      pin("Best Day of My Life", "American Authors", "#ca8a04", 5),
    ],
    moodTags: ["folk", "friends", "celebration"],
    categories: ["timeline", "heart"],
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
    categories: ["timeline", "rituals"],
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
    categories: ["timeline", "energy"],
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
    categories: ["heart"],
    coverHint: "sunrise over rooftops",
    accent: "#eab308",
  },
  {
    id: "late-night-spiral",
    number: 11,
    stage: "Late night",
    mood: "3 a.m. spiral",
    title: "When the city finally shuts up",
    story:
      "Too awake to sleep, too tired to pretend. These pins are blue light, half-thoughts, and songs that understand the hour.",
    seed: pin("Redbone", "Childish Gambino", "#57534e", 0, { year: 2016 }),
    pins: [
      pin("Nightcall", "Kavinsky", "#57534e", 1),
      pin("Sweater Weather", "The Neighbourhood", "#57534e", 2),
      pin("Do I Wanna Know?", "Arctic Monkeys", "#57534e", 3),
      pin("The Night We Met", "Lord Huron", "#57534e", 4),
      pin("Space Song", "Beach House", "#57534e", 5),
    ],
    moodTags: ["night", "moody", "alt"],
    categories: ["energy", "rituals"],
    coverHint: "apartment window at 3am",
    accent: "#57534e",
  },
  {
    id: "gym-fire",
    number: 12,
    stage: "Training",
    mood: "Iron voltage",
    title: "Reps with a chorus",
    story:
      "Headphones on, world off. This board is sweat, tempo, and the clean violence of trying harder than yesterday.",
    seed: pin("Till I Collapse", "Eminem", "#ea580c", 0, { year: 2002 }),
    pins: [
      pin("POWER", "Kanye West", "#ea580c", 1),
      pin("Can't Hold Us", "Macklemore & Ryan Lewis", "#ea580c", 2),
      pin("Remember the Name", "Fort Minor", "#ea580c", 3),
      pin("Eye of the Tiger", "Survivor", "#ea580c", 4),
      pin("Thunderstruck", "AC/DC", "#ea580c", 5),
    ],
    moodTags: ["workout", "hip hop", "rock"],
    categories: ["energy"],
    coverHint: "gym lights and chalk dust",
    accent: "#ea580c",
  },
  {
    id: "nostalgia-reel",
    number: 13,
    stage: "Nostalgia",
    mood: "Memory reel",
    title: "Songs that still know the old address",
    story:
      "Not living in the past—just visiting. One chorus and you’re fifteen again, or twenty-two, or the summer everything changed.",
    seed: pin("1979", "The Smashing Pumpkins", "#a8a29e", 0, { year: 1995 }),
    pins: [
      pin("Wonderwall", "Oasis", "#a8a29e", 1),
      pin("Semi-Charmed Life", "Third Eye Blind", "#a8a29e", 2),
      pin("Closing Time", "Semisonic", "#a8a29e", 3),
      pin("Iris", "Goo Goo Dolls", "#a8a29e", 4),
      pin("Hey There Delilah", "Plain White T's", "#a8a29e", 5),
    ],
    moodTags: ["90s", "00s", "throwback"],
    categories: ["heart"],
    coverHint: "dusty photo stack",
    accent: "#a8a29e",
  },
  {
    id: "first-apartment",
    number: 14,
    stage: "First apartment",
    mood: "Empty-room echo",
    title: "Key in a door that was yours",
    story:
      "Mattress on the floor, dishes in the sink, freedom humming under everything. This is the soundtrack of learning how to live alone on purpose.",
    seed: pin("Vienna", "Billy Joel", "#b45309", 0, { year: 1977 }),
    pins: [
      pin("Fast Car", "Tracy Chapman", "#b45309", 1),
      pin("Landslide", "Fleetwood Mac", "#b45309", 2),
      pin("Such Great Heights", "The Postal Service", "#b45309", 3),
      pin("First Day of My Life", "Bright Eyes", "#b45309", 4),
      pin("everything i wanted", "Billie Eilish", "#b45309", 5),
    ],
    moodTags: ["coming of age", "soft rock", "indie"],
    categories: ["places"],
    coverHint: "sun on bare hardwood floor",
    accent: "#b45309",
  },
  {
    id: "road-trip-west",
    number: 15,
    stage: "Road trip",
    mood: "Open-map hunger",
    title: "Miles with the windows down",
    story:
      "Gas station coffee, bad jokes, landscapes changing faster than you can name them. The playlist is the trip’s second engine.",
    seed: pin("Ride", "Lana Del Rey", "#92400e", 0, { year: 2012 }),
    pins: [
      pin("Midnight City", "M83", "#92400e", 1),
      pin("Home", "Edward Sharpe & The Magnetic Zeros", "#92400e", 2),
      pin("Dog Days Are Over", "Florence + The Machine", "#92400e", 3),
      pin("Take Me Home, Country Roads", "John Denver", "#92400e", 4),
      pin("America", "Simon & Garfunkel", "#92400e", 5),
    ],
    moodTags: ["road", "americana", "cinematic"],
    categories: ["places", "energy"],
    coverHint: "desert highway heat shimmer",
    accent: "#92400e",
  },
  {
    id: "sunday-morning",
    number: 16,
    stage: "Sunday morning",
    mood: "Slow light",
    title: "No agenda, just coffee",
    story:
      "The softest hours of the week. These pins are newspapers, leftover brunch, and the permission to move at half speed.",
    seed: pin("Sunday Morning", "Maroon 5", "#ca8a04", 0, { year: 2002 }),
    pins: [
      pin("Banana Pancakes", "Jack Johnson", "#ca8a04", 1),
      pin("Put Your Records On", "Corinne Bailey Rae", "#ca8a04", 2),
      pin("Better Together", "Jack Johnson", "#ca8a04", 3),
      pin("I'm Yours", "Jason Mraz", "#ca8a04", 4),
      pin("Lovely Day", "Bill Withers", "#ca8a04", 5),
    ],
    moodTags: ["acoustic", "easy", "morning"],
    categories: ["rituals", "heart"],
    coverHint: "steam over a kitchen table",
    accent: "#ca8a04",
  },
  {
    id: "catharsis",
    number: 17,
    stage: "Catharsis",
    mood: "Clean burn",
    title: "Scream it until it softens",
    story:
      "Anger is information. These songs let you spend it out loud—then leave you emptier, clearer, almost new.",
    seed: pin("Breathe Me", "Sia", "#7c2d12", 0, { year: 2004 }),
    pins: [
      pin("Everybody Wants to Rule the World", "Tears for Fears", "#7c2d12", 1),
      pin("Radioactive", "Imagine Dragons", "#7c2d12", 2),
      pin("Demons", "Imagine Dragons", "#7c2d12", 3),
      pin("Control", "Halsey", "#7c2d12", 4),
      pin("Somebody That I Used to Know", "Gotye", "#7c2d12", 5),
    ],
    moodTags: ["intense", "release", "alt pop"],
    categories: ["energy", "heart"],
    coverHint: "storm breaking over hills",
    accent: "#7c2d12",
  },
  {
    id: "celebration-floor",
    number: 18,
    stage: "Celebration",
    mood: "Dance-floor gold",
    title: "The night you stay for one more song",
    story:
      "Birthdays, promotions, reunions—the nights that ask for volume. This board is glitter on the floor and everyone singing the wrong words together.",
    seed: pin("September", "Earth, Wind & Fire", "#f59e0b", 0, { year: 1978 }),
    pins: [
      pin("Don't Stop Me Now", "Queen", "#f59e0b", 1),
      pin("Uptown Funk", "Mark Ronson", "#f59e0b", 2),
      pin("I Gotta Feeling", "Black Eyed Peas", "#f59e0b", 3),
      pin("Shut Up and Dance", "Walk the Moon", "#f59e0b", 4),
      pin("Dancing Queen", "ABBA", "#f59e0b", 5),
    ],
    moodTags: ["party", "disco", "funk"],
    categories: ["heart", "energy"],
    coverHint: "string lights over a packed room",
    accent: "#f59e0b",
  },
  {
    id: "rainy-day-in",
    number: 19,
    stage: "Rain day",
    mood: "Window weather",
    title: "Permission to cancel the world",
    story:
      "Gray sky, warm mug, nowhere to be. These pins stretch time on purpose—soft drums, softer light.",
    seed: pin("Riders on the Storm", "The Doors", "#78716c", 0, { year: 1971 }),
    pins: [
      pin("Rain King", "Counting Crows", "#78716c", 1),
      pin("Purple Rain", "Prince", "#78716c", 2),
      pin("Umbrella", "Rihanna", "#78716c", 3),
      pin("Set Fire to the Rain", "Adele", "#78716c", 4),
      pin("Fade Into You", "Mazzy Star", "#78716c", 5),
    ],
    moodTags: ["rain", "cozy", "slow"],
    categories: ["rituals", "places"],
    coverHint: "rain on glass, soft lamp",
    accent: "#78716c",
    weeklyDrop: true,
  },
  {
    id: "deep-focus",
    number: 20,
    stage: "Deep focus",
    mood: "Tunnel vision",
    title: "Music that gets out of the way",
    story:
      "When the work finally clicks. Minimal words, steady pulse, a board that holds the room while your brain does the heavy lifting.",
    seed: pin("Experience", "Ludovico Einaudi", "#a8a29e", 0, { year: 2013 }),
    pins: [
      pin("Intro", "The xx", "#a8a29e", 1),
      pin("Weightless", "Marconi Union", "#a8a29e", 2),
      pin("Nuvole Bianche", "Ludovico Einaudi", "#a8a29e", 3),
      pin("Avril 14th", "Aphex Twin", "#a8a29e", 4),
      pin("Holocene", "Bon Iver", "#a8a29e", 5),
    ],
    moodTags: ["instrumental", "focus", "ambient"],
    categories: ["rituals", "energy"],
    coverHint: "desk lamp over open notebook",
    accent: "#a8a29e",
  },
];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAllChapterIds(): string[] {
  return chapters.map((c) => c.id);
}

export function getChapterIndex(id: string): number {
  return chapters.findIndex((c) => c.id === id);
}
