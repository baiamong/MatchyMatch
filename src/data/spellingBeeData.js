/**
 * Spelling Bee puzzle bank.
 *
 * Rules:
 *  - Each puzzle has 7 unique letters.
 *  - `center` is the required letter — every valid word must contain it.
 *  - `outer` are the 6 surrounding letters.
 *  - `words` is the complete list of valid answers (all uppercase).
 *  - Every word is at least 4 letters long.
 *  - A word using all 7 letters is a "Pangram" (bonus points).
 *
 * Scoring:
 *  - 4-letter word  → 1 point
 *  - 5+ letter word → 1 point per letter
 *  - Pangram        → word-length points + 7 bonus points
 */

export const SPELLING_BEE_PUZZLES = [
  {
    id: 1,
    center: "A",
    outer: ["P", "L", "N", "T", "E", "R"],
    words: [
      "PLAN", "PLANE", "PLANET", "PLANT", "PLANER", "PLANER",
      "PANEL", "PALER", "PALE", "PANE", "PARE", "PART", "PANT", "PATER",
      "PEARL", "PETAL", "PENAL", "RENTAL", "RENAL", "RANT", "RALE",
      "LANE", "LANER", "LANT", "LATE", "LATER", "LATERAL",
      "ANTE", "ANTRE", "ALERT", "ALTER", "ALTAR",
      "TALE", "TALER", "TARE", "TARN", "TAPE", "TAPER", "TANGLE",
      "EARN", "EARL", "EARLY", "ELAN", "ENTRAP",
      "NATAL", "NAPAL", "NAPE", "NEAR", "NEAT", "NEAP",
      "TERN", "TERN", "TEAL", "TEAR", "TARN",
      "PANT", "PATER", "PATEN", "PATENT", "PARENT",
      "PLEAT", "PLANER", "PLANET", "PLANER", "PLANT",
      "RENTAL", "REPLAN", "REPLANT",
      "ANTLER", "PLANTER", "REPLANT", "PARENTAL",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 2,
    center: "O",
    outer: ["C", "K", "I", "N", "G", "S"],
    words: [
      "COIN", "COINS", "COKING", "CONING", "CONKING",
      "COOK", "COOKS", "COOKING", "COKING",
      "ICON", "ICONS", "IKON", "IKONS",
      "KING", "KINGS", "KINO", "KINOS",
      "KNOCKING", "KNOCK", "KNOCKS",
      "NOCK", "NOCKS", "NOCKING",
      "SOCK", "SOCKING", "SONIC", "SONG", "SONGS",
      "GOON", "GOONS", "GOING", "GOINGS",
      "OINK", "OINKS", "OINKING",
      "SNOOK", "SNOOKING",
      "COIGN", "COIGNS",
      "GONK", "GONKS",
      "GINS", "GINK", "GINKS",
      "SINK", "SNOG", "SNIG",
      "COGS", "CONG", "CONGS",
      "INKS", "INGO",
      "NOGS", "NOCK",
      "SOCK", "SOCKING", "STOCKING",
      "COOKING", "STOCKING", "CONKING", "KNOCKING",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 3,
    center: "E",
    outer: ["R", "S", "T", "A", "L", "C"],
    words: [
      "RACE", "RACES", "RACER", "RACERS",
      "LACE", "LACES", "LACER",
      "TRACE", "TRACES", "TRACER", "TRACERS",
      "CREST", "CRESTS",
      "CRATE", "CRATES", "CRATER", "CRATERS",
      "STARE", "STARES", "STALER",
      "STALE", "STALES",
      "SCALE", "SCALES", "SCALER",
      "SCARE", "SCARES", "SCARER",
      "CARES", "CARE", "CARER",
      "TARES", "TARE",
      "TALES", "TALE",
      "TEARS", "TEAR",
      "LARES", "LASER",
      "EARLS", "EARL",
      "LEAST", "LEASE",
      "RECAST", "CASTLE", "CASTLER",
      "CLEARS", "CLEAR",
      "ECLAT", "ECLATS",
      "CASTE", "CASTES",
      "CATER", "CATERS",
      "EATER", "EATERS",
      "RATEL", "RATELS",
      "TACES", "TACE",
      "ARLES", "ARLE",
      "LASTER", "LATERS",
      "ALTERS", "ALTER",
      "ALERTS", "ALERT",
      "STEALER", "RELATES", "TREACLE", "TREACLES",
      "CARTELS", "CARTEL", "CLARETS", "CLARET",
      "SCARLET", "SCARLETS",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 4,
    center: "I",
    outer: ["M", "P", "R", "E", "S", "N"],
    words: [
      "MINE", "MINES", "MINER", "MINERS",
      "PINE", "PINES", "PINER",
      "RIPE", "RIPES", "RIPEN", "RIPENS",
      "RISE", "RISEN",
      "RINSE", "RINSES",
      "SPINE", "SPINES", "SPIRE", "SPIRES",
      "SNIPE", "SNIPES", "SNIPER", "SNIPERS",
      "PRISE", "PRISM", "PRISMS",
      "PRIME", "PRIMES", "PRIMER", "PRIMERS",
      "MIRES", "MIRE",
      "SIREN", "SIRENS",
      "RESIN", "RESINS",
      "INFER", "INFERS",
      "NICER",
      "MISER", "MISERS",
      "PINES", "PENIS",
      "PIERS", "PIER",
      "EMIR", "EMIRS",
      "SEMI", "SEMIS",
      "REIN", "REINS",
      "NIPS", "SNIP", "SNIPS",
      "RIMS", "RIPE",
      "IMPRESS", "INSPIRE", "INSPIRES",
      "PREMISE", "PREMISES",
      "PERMIS", "PERMITS",
      "MISPEN", "MISPENS",
      "PERNIES", "PENRIS",
      "REPINS", "REPIN",
      "SPINES", "SPINIER",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 5,
    center: "U",
    outer: ["B", "L", "T", "E", "R", "S"],
    words: [
      "BLUR", "BLURS", "BLURT", "BLURTS",
      "BLUE", "BLUES", "BLUER",
      "BUST", "BUSTS", "BUSTER", "BUSTERS",
      "BUTTER", "BUTTERS",
      "BUTLER", "BUTLERS",
      "LURE", "LURES",
      "LUST", "LUSTS", "LUSTER", "LUSTERS",
      "LUSTRE", "LUSTRES",
      "RULE", "RULES", "RULER", "RULERS",
      "RUSE", "RUSES",
      "RUST", "RUSTS", "RUSTLE", "RUSTLES",
      "SURE", "SURER",
      "SLUR", "SLURS",
      "SLUT", "SLUTS",
      "STUB", "STUBS",
      "STRUT", "STRUTS",
      "SUBTLE", "SUBTLER",
      "BURST", "BURSTS",
      "BURL", "BURLS",
      "BURSE", "BURSES",
      "BRUTE", "BRUTES",
      "BLUSTER", "BLUSTERS",
      "BUSTER", "BUSTERS",
      "LUSTIER",
      "SUBLET", "SUBLETS",
      "TURBLE", "TURTLE", "TURTLES",
      "RESULT", "RESULTS",
      "BUTLER", "BUTLERS",
      "SUBTLE", "SUBTLER",
      "BLUSTER", "BUSTERS", "LUSTRES",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 6,
    center: "N",
    outer: ["A", "G", "R", "D", "E", "I"],
    words: [
      "GAIN", "GAINS",
      "RAIN", "RAINS",
      "DINE", "DINES", "DINER", "DINERS",
      "GRIN", "GRINS",
      "GRID", "GRIND", "GRINDS",
      "GRAIN", "GRAINS",
      "GRAND", "GRANDE",
      "RANGE", "RANGES", "RANGER", "RANGERS",
      "REIGN", "REIGNS",
      "RIND", "RINDS",
      "RING", "RINGS",
      "DANG", "DANGER", "DANGERS",
      "DARN", "DARNS",
      "DEAN", "DEANS",
      "DEAR", "DEARS",
      "EARN", "EARNS",
      "GANDER", "GANDERS",
      "GARDEN", "GARDENS",
      "GENDER", "GENDERS",
      "GENIE", "GENIES",
      "GENRE", "GENRES",
      "GIRDER", "GIRDERS",
      "GRANDER",
      "INANE",
      "INNER",
      "NERD", "NERDS",
      "REND", "RENDS",
      "REIN", "REINS",
      "REIGN",
      "NADIR", "NADIRS",
      "DINER", "DINERS",
      "DANGER", "DANGERS",
      "READING", "NEARING",
      "DRAINING", "GRAINING",
      "GARDENING",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 7,
    center: "T",
    outer: ["H", "O", "U", "G", "S", "E"],
    words: [
      "THOSE", "THESE",
      "GHOST", "GHOSTS",
      "GUEST", "GUESTS",
      "GUST", "GUSTO",
      "GOTH", "GOTHS",
      "HOSE", "HOSES",
      "HOST", "HOSTS",
      "HOUSE", "HOUSES",
      "HUGE",
      "OUST", "OUSTS",
      "SHOUT", "SHOUTS",
      "SHOT", "SHOTS",
      "SHOE", "SHOES",
      "SHOT",
      "SOUTH", "SOUTHS",
      "STOKE", "STOKES",
      "STORE", "STORES",
      "STOUT", "STOUTS",
      "TOES", "TOGS",
      "TOSH",
      "TOUGH", "TOUGHS",
      "TOUSE", "TOUSES",
      "ETHOS",
      "SHOTE", "SHOTES",
      "THOSE",
      "HOUSE", "HOUSES",
      "GROUSE",
      "OUTHOUSE", "OUTHOUSES",
      "HOTHOUSE", "HOTHOUSES",
      "TUGBOAT",
      "THOUGHT", "THOUGHTS",
      "TOUGHEST",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
  {
    id: 8,
    center: "S",
    outer: ["W", "O", "R", "D", "A", "Y"],
    words: [
      "DAYS", "DRAW", "DRAWS",
      "DRAY", "DRAYS",
      "ROAD", "ROADS",
      "ROSY",
      "ROWS", "RODS",
      "SODA", "SODAS",
      "SOAR", "SOARS",
      "SWAY", "SWAYS",
      "SWORD", "SWORDS",
      "WORD", "WORDS",
      "WARD", "WARDS",
      "WARY",
      "WAYS", "WARS",
      "YARD", "YARDS",
      "YORE",
      "DORY", "DORYS",
      "DAWS", "DRAY",
      "RODS", "ROWS",
      "SARD", "SARDS",
      "SWAY", "SWAYS",
      "WORDS", "SWORD",
      "YARDS", "ROADS",
      "SWORDS", "AWARDS",
      "TOWARDS",
      "WAYWARD", "WAYWARDS",
      "PASSWORDS",
    ].map(w => w.toUpperCase()).filter((w, i, a) => a.indexOf(w) === i),
  },
];

/**
 * Pick a random puzzle from the bank.
 */
export function pickPuzzle() {
  return SPELLING_BEE_PUZZLES[
    Math.floor(Math.random() * SPELLING_BEE_PUZZLES.length)
  ];
}

/**
 * Validate a word against a puzzle.
 * Returns: 'valid' | 'too_short' | 'missing_center' | 'bad_letters' | 'not_a_word'
 */
export function validateWord(word, puzzle) {
  const w = word.toUpperCase();
  if (w.length < 4) return "too_short";
  if (!w.includes(puzzle.center)) return "missing_center";
  const allowed = new Set([puzzle.center, ...puzzle.outer]);
  for (const ch of w) {
    if (!allowed.has(ch)) return "bad_letters";
  }
  if (!puzzle.words.includes(w)) return "not_a_word";
  return "valid";
}

/**
 * Calculate score for a single word.
 */
export function wordScore(word, puzzle) {
  const w = word.toUpperCase();
  const allLetters = new Set([puzzle.center, ...puzzle.outer]);
  const isPangram = [...allLetters].every((l) => w.includes(l));
  const base = w.length === 4 ? 1 : w.length;
  return isPangram ? base + 7 : base;
}

/**
 * Check if a word is a pangram (uses all 7 letters).
 */
export function isPangram(word, puzzle) {
  const w = word.toUpperCase();
  const allLetters = new Set([puzzle.center, ...puzzle.outer]);
  return [...allLetters].every((l) => w.includes(l));
}

/**
 * Calculate the maximum possible score for a puzzle.
 */
export function maxScore(puzzle) {
  return puzzle.words.reduce((sum, w) => sum + wordScore(w, puzzle), 0);
}

/**
 * Get rank label based on score percentage.
 */
export function getRank(score, max) {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 1.0)  return { label: "Queen Bee 👑", color: "#ff9f0a" };
  if (pct >= 0.7)  return { label: "Genius 🧠",   color: "#30d158" };
  if (pct >= 0.5)  return { label: "Amazing ⭐",  color: "#0a84ff" };
  if (pct >= 0.35) return { label: "Great 🎉",    color: "#5e5ce6" };
  if (pct >= 0.2)  return { label: "Nice 😊",     color: "#64d2ff" };
  if (pct >= 0.1)  return { label: "Solid 👍",    color: "#ff6961" };
  return             { label: "Beginner 🐣",       color: "#8e8e93" };
}
