/**
 * Hangman word bank.
 * Each entry: { word, category, hint }
 * Words are uppercase; hint gives a gentle nudge without giving it away.
 */
export const HANGMAN_WORDS = [
  // ── Science & Nature ────────────────────────────────────────────
  { word: "PHOTOSYNTHESIS", category: "Science", hint: "How plants make food from sunlight" },
  { word: "MITOCHONDRIA",   category: "Science", hint: "The powerhouse of the cell" },
  { word: "TELESCOPE",      category: "Science", hint: "Used to observe distant stars" },
  { word: "CHROMOSOME",     category: "Science", hint: "Carries genetic information" },
  { word: "EVAPORATION",    category: "Science", hint: "Liquid turning into vapour" },
  { word: "GRAVITY",        category: "Science", hint: "Force that keeps you on the ground" },
  { word: "NEUTRON",        category: "Science", hint: "Neutral particle in an atom's nucleus" },
  { word: "ECOSYSTEM",      category: "Science", hint: "Community of living things and their environment" },
  { word: "HYPOTHESIS",     category: "Science", hint: "A testable scientific prediction" },
  { word: "METAMORPHOSIS",  category: "Science", hint: "A caterpillar's transformation process" },

  // ── Geography ───────────────────────────────────────────────────
  { word: "ARCHIPELAGO",    category: "Geography", hint: "A chain or cluster of islands" },
  { word: "PENINSULA",      category: "Geography", hint: "Land almost entirely surrounded by water" },
  { word: "EQUATOR",        category: "Geography", hint: "Imaginary line around Earth's middle" },
  { word: "HIMALAYAS",      category: "Geography", hint: "Mountain range home to Everest" },
  { word: "MEDITERRANEAN",  category: "Geography", hint: "Sea bordered by Europe, Africa, and Asia" },
  { word: "SAVANNA",        category: "Geography", hint: "Tropical grassland with scattered trees" },
  { word: "FJORD",          category: "Geography", hint: "Narrow sea inlet between cliffs, common in Norway" },
  { word: "TUNDRA",         category: "Geography", hint: "Vast, flat, treeless Arctic landscape" },
  { word: "VOLCANO",        category: "Geography", hint: "Mountain that can erupt with lava" },
  { word: "TRIBUTARY",      category: "Geography", hint: "A river that flows into a larger river" },

  // ── History ─────────────────────────────────────────────────────
  { word: "RENAISSANCE",    category: "History", hint: "European cultural rebirth of the 14th–17th centuries" },
  { word: "REVOLUTION",     category: "History", hint: "A fundamental political or social upheaval" },
  { word: "PHARAOH",        category: "History", hint: "Ruler of ancient Egypt" },
  { word: "GLADIATOR",      category: "History", hint: "Roman arena fighter" },
  { word: "DEMOCRACY",      category: "History", hint: "Government by the people, pioneered in Athens" },
  { word: "CRUSADES",       category: "History", hint: "Medieval religious military campaigns" },
  { word: "COLONIALISM",    category: "History", hint: "Policy of acquiring and controlling foreign territories" },
  { word: "FEUDALISM",      category: "History", hint: "Medieval social system of lords and serfs" },
  { word: "PROPAGANDA",     category: "History", hint: "Biased information used to influence opinion" },
  { word: "ARMISTICE",      category: "History", hint: "Agreement to stop fighting; ended WWI" },

  // ── Pop Culture ─────────────────────────────────────────────────
  { word: "LIGHTSABER",     category: "Pop Culture", hint: "Iconic weapon from Star Wars" },
  { word: "KRYPTONITE",     category: "Pop Culture", hint: "Superman's weakness" },
  { word: "QUIDDITCH",      category: "Pop Culture", hint: "Broomstick sport in Harry Potter" },
  { word: "VIBRANIUM",      category: "Pop Culture", hint: "Fictional metal in Black Panther" },
  { word: "HORCRUX",        category: "Pop Culture", hint: "Object containing a piece of Voldemort's soul" },
  { word: "TARDIS",         category: "Pop Culture", hint: "Doctor Who's time-travelling police box" },
  { word: "PATRONUS",       category: "Pop Culture", hint: "Protective charm in Harry Potter" },
  { word: "HOLOGRAM",       category: "Pop Culture", hint: "3-D image projected by light" },
  { word: "FRANCHISE",      category: "Pop Culture", hint: "A series of films or games sharing a universe" },
  { word: "STREAMING",      category: "Pop Culture", hint: "Watching content online without downloading" },

  // ── Food & Drink ─────────────────────────────────────────────────
  { word: "GUACAMOLE",      category: "Food & Drink", hint: "Avocado-based Mexican dip" },
  { word: "CROISSANT",      category: "Food & Drink", hint: "Flaky, crescent-shaped French pastry" },
  { word: "CAPPUCCINO",     category: "Food & Drink", hint: "Espresso topped with steamed milk foam" },
  { word: "MARMALADE",      category: "Food & Drink", hint: "Citrus fruit preserve, often orange" },
  { word: "BRUSCHETTA",     category: "Food & Drink", hint: "Italian toasted bread with toppings" },
  { word: "QUESADILLA",     category: "Food & Drink", hint: "Cheese-filled grilled tortilla" },
  { word: "TIRAMISU",       category: "Food & Drink", hint: "Italian coffee-flavoured dessert" },
  { word: "PROSCIUTTO",     category: "Food & Drink", hint: "Italian dry-cured ham" },
  { word: "SOURDOUGH",      category: "Food & Drink", hint: "Bread leavened with a fermented starter" },
  { word: "CHARCUTERIE",    category: "Food & Drink", hint: "Assorted cured meats and accompaniments" },

  // ── Sports ──────────────────────────────────────────────────────
  { word: "MARATHON",       category: "Sports", hint: "26.2-mile running race" },
  { word: "DECATHLON",      category: "Sports", hint: "Athletics competition with ten events" },
  { word: "QUARTERBACK",    category: "Sports", hint: "Key offensive position in American football" },
  { word: "BADMINTON",      category: "Sports", hint: "Racket sport played with a shuttlecock" },
  { word: "GYMNASTICS",     category: "Sports", hint: "Sport involving acrobatic feats and balance" },
  { word: "TOURNAMENT",     category: "Sports", hint: "A series of contests to determine a champion" },
  { word: "OFFSIDE",        category: "Sports", hint: "Common infringement rule in football and hockey" },
  { word: "VELODROME",      category: "Sports", hint: "Banked oval track for cycling" },
  { word: "SLALOM",         category: "Sports", hint: "Zigzag ski or canoe race through gates" },
  { word: "PENTATHLON",     category: "Sports", hint: "Olympic competition with five disciplines" },

  // ── Technology ──────────────────────────────────────────────────
  { word: "ALGORITHM",      category: "Technology", hint: "Step-by-step instructions for solving a problem" },
  { word: "ENCRYPTION",     category: "Technology", hint: "Converting data into a coded form" },
  { word: "BANDWIDTH",      category: "Technology", hint: "Maximum data transfer rate of a network" },
  { word: "BLOCKCHAIN",     category: "Technology", hint: "Distributed ledger technology behind crypto" },
  { word: "JAVASCRIPT",     category: "Technology", hint: "Popular programming language of the web" },
  { word: "PROCESSOR",      category: "Technology", hint: "The 'brain' of a computer" },
  { word: "FIREWALL",       category: "Technology", hint: "Security system that monitors network traffic" },
  { word: "DEBUGGING",      category: "Technology", hint: "Finding and fixing errors in code" },
  { word: "REPOSITORY",     category: "Technology", hint: "Storage location for version-controlled code" },
  { word: "INTERFACE",      category: "Technology", hint: "Point of interaction between user and system" },

  // ── Animals ─────────────────────────────────────────────────────
  { word: "CHAMELEON",      category: "Animals", hint: "Lizard famous for changing colour" },
  { word: "PLATYPUS",       category: "Animals", hint: "Egg-laying mammal with a duck bill" },
  { word: "CHIMPANZEE",     category: "Animals", hint: "Our closest living primate relative" },
  { word: "NARWHAL",        category: "Animals", hint: "Arctic whale with a long spiral tusk" },
  { word: "PANGOLIN",       category: "Animals", hint: "Scaly anteater-like mammal" },
  { word: "ALBATROSS",      category: "Animals", hint: "Large seabird with the widest wingspan" },
  { word: "AXOLOTL",        category: "Animals", hint: "Mexican salamander that stays in larval form" },
  { word: "KOMODO",         category: "Animals", hint: "___ dragon — world's largest lizard" },
  { word: "FLAMINGO",       category: "Animals", hint: "Pink wading bird that stands on one leg" },
  { word: "WOLVERINE",      category: "Animals", hint: "Fierce mustelid of northern forests" },

  // ── Music ────────────────────────────────────────────────────────
  { word: "SYMPHONY",       category: "Music", hint: "Large-scale orchestral composition" },
  { word: "SAXOPHONE",      category: "Music", hint: "Woodwind instrument invented by Adolphe Sax" },
  { word: "ARPEGGIO",       category: "Music", hint: "Notes of a chord played in sequence" },
  { word: "CRESCENDO",      category: "Music", hint: "Gradual increase in loudness" },
  { word: "HARMONICA",      category: "Music", hint: "Small wind instrument played by mouth" },
  { word: "STACCATO",       category: "Music", hint: "Musical direction meaning short and detached" },
  { word: "CONDUCTOR",      category: "Music", hint: "Person who directs an orchestra" },
  { word: "VIBRATO",        category: "Music", hint: "Rapid slight variation in pitch for expression" },
  { word: "TREBLE",         category: "Music", hint: "High-pitched range; ___ clef" },
  { word: "OVERTURE",       category: "Music", hint: "Orchestral introduction to an opera or musical" },
];

/**
 * Pick a random word from the bank.
 */
export function pickWord() {
  return HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
}
