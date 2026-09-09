-- Seed puzzles from src/data/puzzles.js
-- Each puzzle has a title (derived from id) and categories as JSONB

INSERT INTO puzzles (title, categories) VALUES
  ('Puzzle 1', '[
    {"id": "yellow", "color": "yellow", "title": "Things you plug in", "words": ["LAMP", "TOASTER", "FAN", "ROUTER"]},
    {"id": "green", "color": "green", "title": "In the bathroom", "words": ["MIRROR", "TOWEL", "FAUCET", "DRAIN"]},
    {"id": "blue", "color": "blue", "title": "___ door", "words": ["TRAP", "SCREEN", "SLIDING", "REVOLVING"]},
    {"id": "purple", "color": "purple", "title": "Types of flooring", "words": ["TILE", "HARDWOOD", "CARPET", "VINYL"]},
    {"id": "pink", "color": "pink", "title": "Things with rings", "words": ["SATURN", "CIRCUS", "BOXING", "STOVE"]}
  ]'::jsonb),
  
  ('Puzzle 2', '[
    {"id": "yellow", "color": "yellow", "title": "Breakfast foods", "words": ["WAFFLE", "BAGEL", "GRANOLA", "CREPE"]},
    {"id": "green", "color": "green", "title": "Things in a backpack", "words": ["NOTEBOOK", "PENCIL", "THERMOS", "KEYCHAIN"]},
    {"id": "blue", "color": "blue", "title": "___ stone", "words": ["LIME", "COBBLE", "SAND", "MOON"]},
    {"id": "purple", "color": "purple", "title": "Jazz musicians", "words": ["COLTRANE", "MONK", "DAVIS", "PARKER"]},
    {"id": "pink", "color": "pink", "title": "Things that have hands", "words": ["CLOCK", "PUPPET", "SAILOR", "DECK"]}
  ]'::jsonb),
  
  ('Puzzle 3', '[
    {"id": "yellow", "color": "yellow", "title": "Citrus fruits", "words": ["LEMON", "LIME", "YUZU", "KUMQUAT"]},
    {"id": "green", "color": "green", "title": "Types of bridge", "words": ["ARCH", "CABLE", "DRAWBRIDGE", "PONTOON"]},
    {"id": "blue", "color": "blue", "title": "Things in a courtroom", "words": ["GAVEL", "WITNESS", "BAILIFF", "VERDICT"]},
    {"id": "purple", "color": "purple", "title": "Olympic sports", "words": ["BIATHLON", "LUGE", "POMMEL", "EPEE"]},
    {"id": "pink", "color": "pink", "title": "___ can (homophone hint)", "words": ["TRASH", "WATERING", "TIN", "TOUCAN"]}
  ]'::jsonb),
  
  ('Puzzle 4', '[
    {"id": "yellow", "color": "yellow", "title": "Things at a carnival", "words": ["FERRIS", "FUNNEL", "CLOWN", "TICKET"]},
    {"id": "green", "color": "green", "title": "Freshwater fish", "words": ["PERCH", "BASS", "TROUT", "WALLEYE"]},
    {"id": "blue", "color": "blue", "title": "Words after ''fire''", "words": ["WORKS", "PLACE", "TRUCK", "FLY"]},
    {"id": "purple", "color": "purple", "title": "Ballet terms", "words": ["PLIE", "ARABESQUE", "TENDU", "PIROUETTE"]},
    {"id": "pink", "color": "pink", "title": "Things that can be flat", "words": ["TIRE", "EARTH", "SODA", "NOTE"]}
  ]'::jsonb),
  
  ('Puzzle 5', '[
    {"id": "yellow", "color": "yellow", "title": "Camping essentials", "words": ["TENT", "COMPASS", "KINDLING", "CANTEEN"]},
    {"id": "green", "color": "green", "title": "Shades of blue", "words": ["COBALT", "CERULEAN", "TEAL", "INDIGO"]},
    {"id": "blue", "color": "blue", "title": "Words before ''house''", "words": ["TREE", "WARE", "COURT", "POWER"]},
    {"id": "purple", "color": "purple", "title": "Greek letters", "words": ["SIGMA", "DELTA", "OMEGA", "KAPPA"]},
    {"id": "pink", "color": "pink", "title": "Things with a crown", "words": ["KING", "MOLAR", "STATUE", "PINEAPPLE"]}
  ]'::jsonb),
  
  ('Puzzle 6', '[
    {"id": "yellow", "color": "yellow", "title": "Fast food chains", "words": ["WENDYS", "ARBYS", "SONIC", "JACKS"]},
    {"id": "green", "color": "green", "title": "Words for tired", "words": ["WEARY", "SPENT", "DRAINED", "DROWSY"]},
    {"id": "blue", "color": "blue", "title": "African animals", "words": ["OKAPI", "MAMBA", "SERVAL", "PANGOLIN"]},
    {"id": "purple", "color": "purple", "title": "Parts of a ship", "words": ["HELM", "KEEL", "BOW", "STERN"]},
    {"id": "pink", "color": "pink", "title": "Things that are sealed", "words": ["ENVELOPE", "DEAL", "HARBOR", "MAMMAL"]}
  ]'::jsonb),
  
  ('Puzzle 7', '[
    {"id": "yellow", "color": "yellow", "title": "Things on a desk", "words": ["STAPLER", "MONITOR", "MUG", "CALENDAR"]},
    {"id": "green", "color": "green", "title": "Types of cheese", "words": ["BRIE", "GOUDA", "MANCHEGO", "GRUYERE"]},
    {"id": "blue", "color": "blue", "title": "___ field", "words": ["CORN", "MINE", "SPRING", "STAR"]},
    {"id": "purple", "color": "purple", "title": "Famous composers", "words": ["BACH", "HANDEL", "VIVALDI", "SCHUBERT"]},
    {"id": "pink", "color": "pink", "title": "Things that run but stay", "words": ["FAUCET", "CLOCK", "STOCKING", "ENGINE"]}
  ]'::jsonb),
  
  ('Puzzle 8', '[
    {"id": "yellow", "color": "yellow", "title": "Parts of a flower", "words": ["PETAL", "STAMEN", "PISTIL", "SEPAL"]},
    {"id": "green", "color": "green", "title": "Card games", "words": ["RUMMY", "SPADES", "CANASTA", "CRIBBAGE"]},
    {"id": "blue", "color": "blue", "title": "Words after ''sun''", "words": ["BURN", "FLOWER", "SET", "GLASSES"]},
    {"id": "purple", "color": "purple", "title": "Ancient wonders", "words": ["COLOSSUS", "LIGHTHOUSE", "MAUSOLEUM", "ZEUS"]},
    {"id": "pink", "color": "pink", "title": "Things with bars", "words": ["PRISON", "CHOCOLATE", "SIGNAL", "MONKEY"]}
  ]'::jsonb),
  
  ('Puzzle 9', '[
    {"id": "yellow", "color": "yellow", "title": "Winter clothing", "words": ["PARKA", "MITTEN", "BEANIE", "SCARF"]},
    {"id": "green", "color": "green", "title": "Insects", "words": ["APHID", "MANTIS", "CICADA", "WEEVIL"]},
    {"id": "blue", "color": "blue", "title": "___ box", "words": ["SAND", "MUSIC", "BREAD", "BLACK"]},
    {"id": "purple", "color": "purple", "title": "Roller coaster types", "words": ["WOODEN", "INVERTED", "LAUNCHED", "DIVE"]},
    {"id": "pink", "color": "pink", "title": "Things with a pitch", "words": ["TENT", "SALES", "BASEBALL", "CONCERT"]}
  ]'::jsonb),
  
  ('Puzzle 10', '[
    {"id": "yellow", "color": "yellow", "title": "Coffee drinks", "words": ["LATTE", "CORTADO", "MACCHIATO", "LUNGO"]},
    {"id": "green", "color": "green", "title": "Mountain ranges", "words": ["ANDES", "ROCKIES", "ALPS", "URALS"]},
    {"id": "blue", "color": "blue", "title": "Words before ''work''", "words": ["NET", "TEAM", "FRAME", "GUESS"]},
    {"id": "purple", "color": "purple", "title": "British monarchs", "words": ["GEORGE", "EDWARD", "ANNE", "JAMES"]},
    {"id": "pink", "color": "pink", "title": "Things with a trunk", "words": ["ELEPHANT", "TREE", "SWIMMER", "CAR"]}
  ]'::jsonb),
  
  ('Puzzle 11', '[
    {"id": "yellow", "color": "yellow", "title": "Types of hat", "words": ["FEDORA", "BERET", "STETSON", "CLOCHE"]},
    {"id": "green", "color": "green", "title": "Cooking methods", "words": ["BRAISE", "POACH", "SEAR", "BLANCH"]},
    {"id": "blue", "color": "blue", "title": "___ light", "words": ["SPOT", "MOON", "FLASH", "CANDLE"]},
    {"id": "purple", "color": "purple", "title": "Dances", "words": ["FOXTROT", "QUICKSTEP", "SAMBA", "JIVE"]},
    {"id": "pink", "color": "pink", "title": "Things that are drawn", "words": ["GUN", "CURTAIN", "BATH", "PORTRAIT"]}
  ]'::jsonb),
  
  ('Puzzle 12', '[
    {"id": "yellow", "color": "yellow", "title": "Gem stones", "words": ["ONYX", "TOPAZ", "GARNET", "JASPER"]},
    {"id": "green", "color": "green", "title": "Parts of a sentence", "words": ["SUBJECT", "CLAUSE", "PREDICATE", "MODIFIER"]},
    {"id": "blue", "color": "blue", "title": "Words after ''book''", "words": ["SHELF", "MARK", "WORM", "CASE"]},
    {"id": "purple", "color": "purple", "title": "Ancient civilizations", "words": ["SUMERIAN", "MINOAN", "OLMEC", "NUBIAN"]},
    {"id": "pink", "color": "pink", "title": "Things with a jacket", "words": ["BOOK", "POTATO", "LIFE", "STRAITJACKET"]}
  ]'::jsonb),
  
  ('Puzzle 13', '[
    {"id": "yellow", "color": "yellow", "title": "Tropical fruits", "words": ["PAPAYA", "GUAVA", "JACKFRUIT", "LYCHEE"]},
    {"id": "green", "color": "green", "title": "Weather phenomena", "words": ["HAIL", "SLEET", "SQUALL", "DERECHO"]},
    {"id": "blue", "color": "blue", "title": "___ room", "words": ["BALL", "SHOW", "COURT", "BOILER"]},
    {"id": "purple", "color": "purple", "title": "Philosophers", "words": ["LOCKE", "HUME", "SPINOZA", "LEIBNIZ"]},
    {"id": "pink", "color": "pink", "title": "Things with a bank", "words": ["RIVER", "MEMORY", "BLOOD", "PIGGY"]}
  ]'::jsonb),
  
  ('Puzzle 14', '[
    {"id": "yellow", "color": "yellow", "title": "Sewing supplies", "words": ["BOBBIN", "THIMBLE", "SEAM", "INTERFACING"]},
    {"id": "green", "color": "green", "title": "Words for angry", "words": ["IRATE", "LIVID", "FUMING", "SEETHING"]},
    {"id": "blue", "color": "blue", "title": "___ point", "words": ["GUN", "BALL", "VIEW", "FOCAL"]},
    {"id": "purple", "color": "purple", "title": "Types of fabric", "words": ["MUSLIN", "VELVET", "CHIFFON", "TWEED"]},
    {"id": "pink", "color": "pink", "title": "Things that can be raw", "words": ["DEAL", "NERVE", "TALENT", "MEAT"]}
  ]'::jsonb),
  
  ('Puzzle 15', '[
    {"id": "yellow", "color": "yellow", "title": "Playground equipment", "words": ["SWING", "SEESAW", "MONKEY BARS", "SLIDE"]},
    {"id": "green", "color": "green", "title": "Constellations", "words": ["ORION", "LYRA", "CYGNUS", "DRACO"]},
    {"id": "blue", "color": "blue", "title": "Words before ''line''", "words": ["BASE", "HAIR", "DEAD", "BORDER"]},
    {"id": "purple", "color": "purple", "title": "Types of clocks", "words": ["CUCKOO", "SUNDIAL", "HOURGLASS", "ATOMIC"]},
    {"id": "pink", "color": "pink", "title": "Things that can be spare", "words": ["TIRE", "ROOM", "RIB", "TIME"]}
  ]'::jsonb),
  
  ('Puzzle 16', '[
    {"id": "yellow", "color": "yellow", "title": "Sports played on ice", "words": ["CURLING", "HOCKEY", "SKATING", "BANDY"]},
    {"id": "green", "color": "green", "title": "Words meaning small", "words": ["PETITE", "MINUTE", "BANTAM", "WEE"]},
    {"id": "blue", "color": "blue", "title": "___ fall", "words": ["WATER", "FREE", "DOWN", "NIGHT"]},
    {"id": "purple", "color": "purple", "title": "Literary devices", "words": ["SIMILE", "SYNECDOCHE", "CHIASMUS", "ASSONANCE"]},
    {"id": "pink", "color": "pink", "title": "Things that need a key", "words": ["LOCK", "CAR", "PIANO", "MAP"]}
  ]'::jsonb),
  
  ('Puzzle 17', '[
    {"id": "yellow", "color": "yellow", "title": "Things in a wallet", "words": ["RECEIPT", "LOYALTY CARD", "CASH", "PHOTO"]},
    {"id": "green", "color": "green", "title": "Herbs", "words": ["TARRAGON", "CHERVIL", "SAVORY", "LOVAGE"]},
    {"id": "blue", "color": "blue", "title": "___ glass", "words": ["LOOKING", "STAINED", "HOUR", "MAGNIFYING"]},
    {"id": "purple", "color": "purple", "title": "Roman gods", "words": ["JANUS", "VULCAN", "PLUTO", "MINERVA"]},
    {"id": "pink", "color": "pink", "title": "Things with a needle", "words": ["COMPASS", "SYRINGE", "RECORD", "PINE"]}
  ]'::jsonb),
  
  ('Puzzle 18', '[
    {"id": "yellow", "color": "yellow", "title": "Baked goods", "words": ["BRIOCHE", "SCONE", "DANISH", "STRUDEL"]},
    {"id": "green", "color": "green", "title": "Shades of green", "words": ["SAGE", "CHARTREUSE", "VIRIDIAN", "FERN"]},
    {"id": "blue", "color": "blue", "title": "Words before ''pool''", "words": ["CAR", "DEAD", "SWIMMING", "GENE"]},
    {"id": "purple", "color": "purple", "title": "Opera singers (voice)", "words": ["SOPRANO", "TENOR", "BARITONE", "MEZZO"]},
    {"id": "pink", "color": "pink", "title": "Things with a bow", "words": ["SHIP", "VIOLIN", "GIFT", "RAINBOW"]}
  ]'::jsonb),
  
  ('Puzzle 19', '[
    {"id": "yellow", "color": "yellow", "title": "Things on a map", "words": ["LEGEND", "SCALE", "CONTOUR", "GRID"]},
    {"id": "green", "color": "green", "title": "Punctuation marks", "words": ["ELLIPSIS", "TILDE", "CARET", "PILCROW"]},
    {"id": "blue", "color": "blue", "title": "___ board", "words": ["SKATE", "CARD", "DART", "SURF"]},
    {"id": "purple", "color": "purple", "title": "Martial arts", "words": ["KENDO", "CAPOEIRA", "HAPKIDO", "SILAT"]},
    {"id": "pink", "color": "pink", "title": "Things with a bridge", "words": ["GUITAR", "NOSE", "CHESS", "SHIP"]}
  ]'::jsonb),
  
  ('Puzzle 20', '[
    {"id": "yellow", "color": "yellow", "title": "Things you can knit", "words": ["BEANIE", "BLANKET", "SOCK", "COWL"]},
    {"id": "green", "color": "green", "title": "Famous scientists", "words": ["CURIE", "DARWIN", "FARADAY", "TURING"]},
    {"id": "blue", "color": "blue", "title": "___ watch", "words": ["STOP", "NIGHT", "SMART", "POCKET"]},
    {"id": "purple", "color": "purple", "title": "Types of economy", "words": ["MIXED", "COMMAND", "BARTER", "MARKET"]},
    {"id": "pink", "color": "pink", "title": "Things that can be fixed", "words": ["GAME", "GAZE", "PRICE", "BAYONET"]}
  ]'::jsonb);
