/**
 * NEUROLINK-7800 Text Adventure Engine
 * A client-side text adventure game engine for GitHub Pages
 *
 * @author Diogo Neves
 */

// ================================================
// GAME STATE
// ================================================

const createInitialState = () => ({
  player: {
    roomId: "outside",
    inventory: [],
    flags: {
      hasStarted: false,
      stormNoticed: false,
      hasLight: true,
      talkedToNPC: false,
      foundQuarter: false,
    },
  },

  rooms: {
    outside: {
      id: "outside",
      name: "Outside the Shopfront",
      description: `You stand on rain-speckled pavement facing a narrow tech shop. Retro consoles and motherboards huddle behind misted glass, their LEDs blinking like polite fireflies. The neon above the doorway flickers, but the letters smear in the drizzle before you can read them.

Something small glints near the threshold. The street smells of wet tarmac and warm circuitry. You could step IN to the shop, cross the STREET to the house, wander toward the TRAIN station, or follow the path to the COAST.`,
      exits: {
        in: "store",
        store: "store",
        shop: "store",
        inside: "store",
        street: "home",
        home: "home",
        train: "train_station",
        station: "train_station",
        coast: "coast_line",
      },
      objects: ["quarter", "neon_signs", "metaphora_plaque", "window_display"],
      npcs: ["friendly_stranger"],
      flags: {
        visited: false,
        stormWarningGiven: false,
      },
    },

    store: {
      id: "store",
      name: "Metaphora — Tech Shop",
      description: `You slip inside; the door hushes behind you as if reluctant to let the weather in. Shelves of prepaid codes for distant models stand to attention, each card a promise of borrowed cleverness. Piles of personal AI boxes wait mid-journey across the floor, abandoned in a rush. A post-it flaps from one like a reluctant confession.

To your left the aisles tilt toward games; to your right, cameras and edit bays. The counter faces the entrance, a brass bell patiently guarding a heavy door behind it with a keyhole etched BACKDOOR-KEY-1.`,
      exits: {
        out: "outside",
        outside: "outside",
        street: "outside",
        left: "store_games",
        west: "store_games",
        games: "store_games",
        right: "store_content",
        east: "store_content",
        content: "store_content",
        back: "backrooms",
        door: "backrooms",
        counter: "backrooms",
      },
      objects: [
        "ai_gift_cards",
        "personal_ai_boxes",
        "postit_future",
        "ai_box_warning",
        "counter_bell",
        "backdoor_door",
      ],
      flags: {
        visited: false,
        backdoorUnlocked: false,
      },
    },

    store_content: {
      id: "store_content",
      name: "Content Studio Corner",
      description: `Tripods and ring lights form a polite thicket around a long editing desk. Coffee rings stencil circles on to-do lists about scripts, devlogs, and some video no one quite feels ready to finish. USB drives spill from a ceramic bowl like sweets. A half-packed camera bag lies open, the way someone leaves when they plan to return soon.

The hum from the shop floor drifts in, mingling with the faint sound of waves from a video paused mid-frame.`,
      exits: {
        back: "store",
        west: "store",
        left: "store",
        out: "store",
      },
      objects: ["editing_rig", "storyboard_stack", "content_drives"],
      flags: {
        visited: false,
      },
    },

    store_games: {
      id: "store_games",
      name: "Retro Video-Games Aisle",
      description: `This side of the shop smells of cardboard ink and nostalgia. Posters for Tomb Raider and Final Fantasy VII curl proudly on the wall. A towering cardboard standee for LittleBigPlanet grins with that big colourful font, BAFTA laurel stamped on its sleeve. Stacks of games spill across the shelf, multiple copies of the same titles like someone could not bear to part with any variant.

One battered LittleBigPlanet box has been turned around, a handwritten note visible through cracked plastic. Someone left more than retail here.`,
      exits: {
        back: "store",
        east: "store",
        right: "store",
        out: "store",
      },
      objects: ["retro_posters", "lbp_standee", "lbp_box", "demo_kiosk", "backdoor_key_1"],
      flags: {
        visited: false,
      },
    },

    backrooms: {
      id: "backrooms",
      name: "Backrooms Entrance",
      description: `The air here tastes of dusted ozone and late-night decisions. Metal shelves climb the walls, half-filled with cables and prototypes that never met daylight. A whiteboard carries a maze of arrows linking dreams, deadlines, and doubts. Every hum from the server stack sounds like distant thunder clearing its throat.

The corridor narrows into shadow, but for now only the shop lies BACK the way you came.`,
      exits: {
        out: "store",
        back: "store",
        shop: "store",
      },
      objects: ["server_rack", "whiteboard_map", "backlog_crate"],
      flags: {
        visited: false,
      },
    },

    home: {
      id: "home",
      name: "House Across the Street",
      description: `You cross into a small house that feels lived-in rather than staged. Shoes gather by the door in hopeful pairs. Children's drawings and holiday photos frame the hallway, messy and sincere. A kettle cools on the counter beside a laptop left mid-thought, as if someone was interrupted by inspiration.

The warmth here presses gently against the storm outside. The STREET is the way back.`,
      exits: {
        street: "outside",
        out: "outside",
        outside: "outside",
      },
      objects: ["family_frame", "shoe_stack", "tiny_robot"],
      flags: {
        visited: false,
      },
    },

    train_station: {
      id: "train_station",
      name: "The Train Station",
      description: `The platform stretches longer than physics promised. Fog curls around rails that vanish into unhelpful distance. A split-flap board clicks through impossible destinations before settling on silence. The tannoy coughs occasionally, as if remembering it once had announcements to make.

It feels like a place designed for waiting and wondering. BACK to the storefront is the only direction that feels real.`,
      exits: {
        back: "outside",
        out: "outside",
        street: "outside",
        storefront: "outside",
      },
      objects: ["splitflap_board", "waiting_bench", "ghost_ticket"],
      flags: {
        visited: false,
      },
    },

    coast_line: {
      id: "coast_line",
      name: "Coast Path",
      description: `A narrow path spills out on to a slate coast. Waves batter the rocks with patient fury, spraying the air with salt and static. The horizon flickers between storm cloud and pale sunlight, unable to settle on a mood. Somewhere out there a gull laughs like it knows the punchline before you do.

There is only the path BACK toward the storefront unless you fancy asking the sea for advice.`,
      exits: {
        back: "outside",
        out: "outside",
        street: "outside",
        storefront: "outside",
      },
      objects: ["tidal_pool", "driftwood_sign", "message_shell"],
      flags: {
        visited: false,
        tidalPattern: "low",
      },
    },
  },

  objects: {
    // Outside objects
    quarter: {
      id: "quarter",
      name: "tarnished quarter",
      aliases: ["quarter", "coin", "money"],
      description:
        "A tarnished quarter from 1984, edges smoothed by anxious flipping. Someone scratched D.N. into the metal. It's warmer than it ought to be, as if memory retains its own heat.",
      location: "room:outside",
      portable: true,
      onUse:
        "You flip the quarter. For a heartbeat the neon catches it mid-spin, casting constellations across your palm. It lands with a polite clink and the storm rehearses another rumble.",
    },
    neon_signs: {
      id: "neon_signs",
      name: "neon signs",
      aliases: ["signs", "neon", "lights"],
      description:
        "Up close the flicker sharpens into letters: METAPHORA. The tubes buzz like thoughts trying to finish themselves. For a moment the M falters and you swear it nearly spells METAPHOR.",
      location: "room:outside",
      portable: false,
    },
    metaphora_plaque: {
      id: "metaphora_plaque",
      name: "brass plaque",
      aliases: ["plaque", "metaphora", "store sign", "shop sign"],
      description:
        "A brass plaque beside the door reads METAPHORA in patient lettering. Beneath, engraved smaller: 'Where memory meets tomorrow.' Tilt your head and it seems to wink back at you.",
      location: "room:outside",
      portable: false,
    },
    window_display: {
      id: "window_display",
      name: "window display",
      aliases: ["window", "display", "retro tech"],
      description:
        "Walkmen, pagers, consoles, and homebrew boards crowd the window. One Game Boy shows a level layout that rearranges when you blink. A camcorder's tiny screen loops a clip of someone soldering at 3am.",
      location: "room:outside",
      portable: false,
    },

    // Store objects
    ai_gift_cards: {
      id: "ai_gift_cards",
      name: "AI access cards",
      aliases: ["cards", "gift cards", "codes", "models"],
      description:
        "Plastic gift cards promise minutes with distant minds: GPT, Claude, bespoke tiny models. Each card has a scribbled note about latency, capability, and which ones make the best company at 2am.",
      location: "room:store",
      portable: false,
    },
    personal_ai_boxes: {
      id: "personal_ai_boxes",
      name: "stack of personal AI boxes",
      aliases: ["boxes", "ai boxes", "stack"],
      description:
        "Cardboard towers of personal AI units lean like they are gossiping. Shipping labels mark destinations that never happened. Someone started arranging them alphabetically and then stopped midsentence.",
      location: "room:store",
      portable: false,
    },
    postit_future: {
      id: "postit_future",
      name: "flapping post-it",
      aliases: ["post-it", "note", "sticky note"],
      description:
        "The post-it clings to a box corner. In messy handwriting: 'these are yet to happen'. Ink wobbles where the writer hesitated.",
      location: "room:store",
      portable: false,
    },
    ai_box_warning: {
      id: "ai_box_warning",
      name: "warning label",
      aliases: ["warning", "label", "box warning"],
      description:
        "One of the boxes has a printed label: 'Don't use at your own risk!' The double negative makes it either a dare or a plea.",
      location: "room:store",
      portable: false,
    },
    counter_bell: {
      id: "counter_bell",
      name: "brass counter bell",
      aliases: ["bell", "counter"],
      description:
        "A brass bell polished by hopeful customers. It waits atop the counter like an invitation to bother the void.",
      location: "room:store",
      portable: false,
      onUse:
        "You ping the bell. The ring stretches into the shelves and fades. No clerk appears, unless you count the distant server hum perking up.",
    },
    backdoor_door: {
      id: "backdoor_door",
      name: "backroom door",
      aliases: ["door", "backdoor", "counter door"],
      description:
        "A heavy door hides behind the counter, keyhole stamped BACKDOOR-KEY-1. The handle is cold, the paint chipped where impatient hands once tried their luck.",
      location: "room:store",
      portable: false,
      onUse:
        "The lock eyes your key choices. Without BACKDOOR-KEY-1 it stays politely shut; with it, the mechanism sighs and the corridor beyond inhales you.",
    },

    // Content objects
    editing_rig: {
      id: "editing_rig",
      name: "editing rig",
      aliases: ["rig", "desk", "edit desk"],
      description:
        "Dual monitors glow with paused timelines. Clips of family, code editors, and travel shots wait in tidy tracks. A note reads: 'voiceover later, softer this time'.",
      location: "room:store_content",
      portable: false,
    },
    storyboard_stack: {
      id: "storyboard_stack",
      name: "storyboard stack",
      aliases: ["storyboards", "boards", "scripts"],
      description:
        "Printed frames with sketches and arrows spread across the table. Margins are full of self-reminders: 'ship before the storm', 'be kinder on camera', 'remember why'.",
      location: "room:store_content",
      portable: false,
    },
    content_drives: {
      id: "content_drives",
      name: "bowl of USB drives",
      aliases: ["usb", "drives", "bowl"],
      description:
        "A ceramic bowl brims with labelled drives: prototypes, b-roll, experiments. One is tagged 'backup of backup (trust me)'.",
      location: "room:store_content",
      portable: false,
    },

    // Games objects
    retro_posters: {
      id: "retro_posters",
      name: "retro posters",
      aliases: ["posters", "wall art", "games"],
      description:
        "Sun-faded posters for Tomb Raider, Final Fantasy VII, and Crash Bandicoot cling to the wall. Each caption promises a world that once felt infinite.",
      location: "room:store_games",
      portable: false,
    },
    lbp_standee: {
      id: "lbp_standee",
      name: "LittleBigPlanet standee",
      aliases: ["standee", "little big planet", "lbp"],
      description:
        "A large cardboard Sackboy beams in bold, colourful font. A BAFTA award badge sits on the corner, proud and slightly peeled. Someone tucked a sticker under its foot reading 'build loudly / truthfully'.",
      location: "room:store_games",
      portable: false,
    },
    lbp_box: {
      id: "lbp_box",
      name: "battered LittleBigPlanet box",
      aliases: ["box", "lbp game", "little big planet box"],
      description:
        "The cracked case has been turned backwards. Scrawled on the plastic: 'once a masterpiece, left in the few who remember'. When you tilt it, a faded insert whispers about co-creation and play.",
      location: "room:store_games",
      portable: false,
    },
    demo_kiosk: {
      id: "demo_kiosk",
      name: "demo kiosk",
      aliases: ["kiosk", "console", "demo"],
      description:
        "An old demo console loops a menu, joystick worn smooth. The screen invites: 'PRESS START IF YOU STILL BELIEVE IN SIDE QUESTS'.",
      location: "room:store_games",
      portable: false,
      onUse:
        "You tap start. The screen flickers, briefly showing a line: 'BACKDOOR-KEY-1 tucked behind the standee' before returning to its looping menu. Helpful, if you trust haunted kiosks.",
    },
    backdoor_key_1: {
      id: "backdoor_key_1",
      name: "BACKDOOR-KEY-1",
      aliases: ["key", "keycard", "backdoor key"],
      description:
        "A plastic keycard on a frayed lanyard. Someone scribbled 'backrooms' on the back in marker. It smells faintly of popcorn and old carpet, as if it spent too long beside arcade machines.",
      location: "room:store_games",
      portable: true,
      onUse:
        "You slot the keycard into the backroom lock in your mind. You can almost hear the click. The door will believe you now.",
    },

    // Backroom objects
    server_rack: {
      id: "server_rack",
      name: "server rack",
      aliases: ["servers", "rack", "tower"],
      description:
        "A stack of humming machines exhale warm air. LEDs blink like a heartbeat practising mindfulness. A sticker reads: 'prototype builds / mind palace'.",
      location: "room:backrooms",
      portable: false,
    },
    whiteboard_map: {
      id: "whiteboard_map",
      name: "whiteboard of arrows",
      aliases: ["whiteboard", "map", "plan"],
      description:
        "Arrows connect bubbles labelled 'family', 'work', 'storm', 'videos', 'rest'. Some loops dead-end in smudges. Someone wrote 'remember to sleep' in the corner, underlined twice, then circled for luck.",
      location: "room:backrooms",
      portable: false,
    },
    backlog_crate: {
      id: "backlog_crate",
      name: "backlog crate",
      aliases: ["crate", "box", "backlog"],
      description:
        "A plastic crate holds notebooks and half-finished gadgets. A note taped to the lid reads: 'pick one, finish it, pretend the storm isn't louder today.'",
      location: "room:backrooms",
      portable: false,
    },

    // Home objects
    family_frame: {
      id: "family_frame",
      name: "family frame",
      aliases: ["frame", "photo", "picture"],
      description:
        "A framed photo captures laughter mid-bloom. Someone's hair is mid-chaos, someone's eyes are squeezed shut. The joy is wonderfully imperfect.",
      location: "room:home",
      portable: false,
    },
    shoe_stack: {
      id: "shoe_stack",
      name: "pile of shoes",
      aliases: ["shoes", "pile", "shoe rack"],
      description:
        "Shoes pile near the door, evidence of comings and goings. Tiny trainers rest beside running shoes, a timeline in footwear.",
      location: "room:home",
      portable: false,
    },
    tiny_robot: {
      id: "tiny_robot",
      name: "tiny robot toy",
      aliases: ["robot", "toy", "bot"],
      description:
        "A 3D-printed robot with one arm missing and LEDs blinking a stubborn heartbeat. 'beta' is scribbled on its back in marker.",
      location: "room:home",
      portable: false,
    },

    // Train Station objects
    splitflap_board: {
      id: "splitflap_board",
      name: "split-flap board",
      aliases: ["board", "timetable", "schedule"],
      description:
        "The split-flap board rattles through impossible destinations: MEMORY LANE, NEXT BUILD, SOMEDAY, SOONISH. Occasionally it pauses on a blank space, contemplating silence.",
      location: "room:train_station",
      portable: false,
      onUse:
        "You press the service button. The flaps whir, then settle on: 'NEXT TRAIN: WHEN YOU STOP HESITATING.' It immediately pretends it never said that.",
    },
    waiting_bench: {
      id: "waiting_bench",
      name: "waiting bench",
      aliases: ["bench", "seat"],
      description:
        "A wooden bench worn smooth by patient dreamers. Someone carved 'CATCH YOUR BREATH' into the armrest and underlined it three times.",
      location: "room:train_station",
      portable: false,
    },
    ghost_ticket: {
      id: "ghost_ticket",
      name: "ghost ticket",
      aliases: ["ticket", "stub", "pass"],
      description:
        "A ticket stub with no date and no price, just 'ADMIT ONE: D.N. + GUEST' stamped in fading ink. It smells faintly of rain and printer toner.",
      location: "room:train_station",
      portable: true,
      onUse:
        "You hold the ticket up to the flickering light. Letters rearrange to spell 'YOU'RE ALREADY ON BOARD' before dissolving back into smudges.",
    },

    // Coast objects
    tidal_pool: {
      id: "tidal_pool",
      name: "tidal pool",
      aliases: ["pool", "water", "puddle"],
      description:
        "A shallow tidal pool mirrors the sky in miniature. Tiny crabs scuttle between pebbles beside a fragment of circuitry, as if the sea tried building a computer and got distracted.",
      location: "room:coast_line",
      portable: false,
    },
    driftwood_sign: {
      id: "driftwood_sign",
      name: "driftwood sign",
      aliases: ["sign", "driftwood", "post"],
      description:
        "A piece of driftwood is wedged upright between rocks. Carved into it: 'BUILD LOUDLY', crossed out and replaced with 'TRUTHFULLY'. The wood creaks like it might offer more advice if you listen.",
      location: "room:coast_line",
      portable: false,
    },
    message_shell: {
      id: "message_shell",
      name: "message shell",
      aliases: ["shell", "bottle", "message"],
      description:
        "A pale shell holds a rolled scrap of paper. The note reads: 'if the storm gets loud, remember the coast is still here.' Salt has blurred the ink but not the intent.",
      location: "room:coast_line",
      portable: true,
    },
  },

  npcs: {
    friendly_stranger: {
      id: "friendly_stranger",
      name: "friendly stranger",
      aliases: ["stranger", "person", "traveller", "npc"],
      location: "room:outside",
      description:
        "A person of indeterminate age leans against the storefront, jacket weatherproof and grin weathered. They watch the sky like a sailor watches a tide, amused and a little wary.",
      dialogue: [
        "\"Lovely evening, isn't it? Well, it would be if the sky wasn't rehearsing something dramatic. Keep an eye on it, yeah?\"",
        "\"You look like someone who builds things. Creative chaos in the eyes. Respect.\"",
        "\"Storm's coming. Best pick where you want to be when it hits: safe, daring, or both.\"",
        "\"That glint near the door? If you fancy luck, don't leave it to the pigeons.\"",
        "\"The shop's got layers. Left feels like childhood, right like deadlines, and behind the counter... well, that's where the storm keeps its notes.\"",
      ],
    },
  },

  globals: {
    turn: 0,
    gameStarted: false,
    puzzleFlags: {
      stormWarningReceived: false,
      backdoorUnlocked: false,
      exploredAllRooms: false,
    },
  },
});

// Global game state
let gameState = null;

// ================================================
// SYNONYMS AND ALIASES
// ================================================

const VERB_SYNONYMS = {
  // Movement
  n: "north",
  north: "north",
  s: "south",
  south: "south",
  e: "east",
  east: "east",
  w: "west",
  west: "west",
  u: "up",
  up: "up",
  d: "down",
  down: "down",
  go: "go",
  walk: "go",
  move: "go",
  head: "go",
  enter: "go",
  in: "in",
  out: "out",

  // Observation
  l: "look",
  look: "look",
  examine: "examine",
  x: "examine",
  inspect: "examine",
  check: "examine",
  read: "read",
  study: "read",

  // Inventory
  i: "inventory",
  inv: "inventory",
  inventory: "inventory",
  take: "take",
  get: "take",
  grab: "take",
  pick: "take",
  drop: "drop",
  put: "drop",
  discard: "drop",

  // Interaction
  use: "use",
  activate: "use",
  press: "use",
  open: "open",
  close: "close",
  talk: "talk",
  speak: "talk",
  chat: "talk",

  // Meta
  help: "help",
  "?": "help",
  about: "about",
  info: "about",
  quit: "quit",
  exit: "quit",
  q: "quit",
  clear: "clear",
  cls: "clear",
  save: "save",
  load: "load",
  restore: "load",
};

const DIRECTION_WORDS = [
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
  "in",
  "out",
  "n",
  "s",
  "e",
  "w",
  "u",
  "d",
];

const FILLER_WORDS = [
  "the",
  "a",
  "an",
  "at",
  "to",
  "with",
  "on",
  "in",
  "into",
  "onto",
  "from",
];

// ================================================
// PARSER
// ================================================

/**
 * Parse user input into a command structure
 * @param {string} input - Raw user input
 * @returns {Object} Parsed command { verb, object, preposition, secondObject }
 */
function parseCommand(input) {
  // Normalise: lowercase and trim
  let tokens = input.toLowerCase().trim().split(/\s+/);

  // Remove filler words
  tokens = tokens.filter((t) => !FILLER_WORDS.includes(t));

  if (tokens.length === 0) {
    return { verb: null, object: null };
  }

  // Get the first word as potential verb
  let verbToken = tokens[0];
  let verb = VERB_SYNONYMS[verbToken] || null;

  // Handle direction shortcuts (n, s, e, w, etc.)
  if (DIRECTION_WORDS.includes(verbToken)) {
    if (["n", "s", "e", "w", "u", "d"].includes(verbToken)) {
      verbToken = VERB_SYNONYMS[verbToken];
    }
    return { verb: "go", object: VERB_SYNONYMS[verbToken] || verbToken };
  }

  // Single word command
  if (tokens.length === 1) {
    return { verb: verb, object: null };
  }

  // Multi-word: verb + object(s)
  const remaining = tokens.slice(1);

  // Check for preposition pattern (use X on Y, put X in Y)
  const prepositions = ["on", "in", "with", "to"];
  let prepIndex = -1;
  let preposition = null;

  for (const prep of prepositions) {
    const idx = remaining.indexOf(prep);
    if (idx > 0 && idx < remaining.length - 1) {
      prepIndex = idx;
      preposition = prep;
      break;
    }
  }

  if (preposition && prepIndex > 0) {
    const object = remaining.slice(0, prepIndex).join(" ");
    const secondObject = remaining.slice(prepIndex + 1).join(" ");
    return { verb, object, preposition, secondObject };
  }

  // Simple verb + object
  const object = remaining.join(" ");
  return { verb, object, preposition: null, secondObject: null };
}

// ================================================
// OBJECT RESOLUTION
// ================================================

/**
 * Find an object by name/alias in the current context
 * @param {string} name - Object name to find
 * @returns {Object|null} The object definition or null
 */
function findObject(name) {
  if (!name) return null;

  const searchName = name.toLowerCase();
  const currentRoom = gameState.rooms[gameState.player.roomId];

  // Get visible objects (in room + in inventory)
  const visibleIds = [
    ...(currentRoom.objects || []),
    ...gameState.player.inventory,
  ];

  for (const objId of visibleIds) {
    const obj = gameState.objects[objId];
    if (!obj) continue;

    // Check main name
    if (
      obj.name.toLowerCase().includes(searchName) ||
      obj.id.toLowerCase() === searchName
    ) {
      return obj;
    }

    // Check aliases
    if (obj.aliases) {
      for (const alias of obj.aliases) {
        if (alias.toLowerCase() === searchName) {
          return obj;
        }
      }
    }
  }

  return null;
}

/**
 * Find an NPC by name/alias in the current room
 * @param {string} name - NPC name to find
 * @returns {Object|null} The NPC definition or null
 */
function findNPC(name) {
  if (!name) return null;

  const searchName = name.toLowerCase();
  const currentRoom = gameState.rooms[gameState.player.roomId];

  // Get NPCs in current room
  const npcIds = currentRoom.npcs || [];

  for (const npcId of npcIds) {
    const npc = gameState.npcs[npcId];
    if (!npc) continue;

    // Check main name
    if (
      npc.name.toLowerCase().includes(searchName) ||
      npc.id.toLowerCase() === searchName
    ) {
      return npc;
    }

    // Check aliases
    if (npc.aliases) {
      for (const alias of npc.aliases) {
        if (alias.toLowerCase() === searchName) {
          return npc;
        }
      }
    }
  }

  return null;
}

// ================================================
// COMMAND HANDLERS
// ================================================

/**
 * Handle movement commands
 */
function handleMovement(direction) {
  const currentRoom = gameState.rooms[gameState.player.roomId];
  const exits = currentRoom.exits || {};

  // Normalise direction
  const dirMap = {
    n: "north",
    s: "south",
    e: "east",
    w: "west",
    u: "up",
    d: "down",
  };
  const dir = dirMap[direction] || direction;

  if (exits[dir]) {
    const newRoomId = exits[dir];
    gameState.player.roomId = newRoomId;

    const newRoom = gameState.rooms[newRoomId];
    const wasVisited = newRoom.flags.visited;
    newRoom.flags.visited = true;

    return describeRoom(newRoomId, wasVisited);
  }

  return "You cannot go that way. The world, it seems, has boundaries.";
}

/**
 * Generate room description
 */
function describeRoom(roomId, shortForm = false) {
  const room = gameState.rooms[roomId];
  if (!room) return "You are nowhere. This is concerning.";

  let output = [];

  // Room name
  output.push({ text: room.name, className: "room-name" });

  // Description (shorter on revisits)
  if (shortForm && room.flags.visited) {
    // Just show first sentence for revisits
    const firstSentence = room.description.split(".")[0] + ".";
    output.push({ text: firstSentence });
  } else {
    output.push({ text: room.description });
  }

  // List NPCs in room
  const roomNPCs = (room.npcs || [])
    .map((id) => gameState.npcs[id])
    .filter((npc) => npc && npc.location === `room:${roomId}`);

  if (roomNPCs.length > 0) {
    const npcNames = roomNPCs.map((n) => n.name).join(", ");
    output.push({
      text: `\nPresent: ${npcNames}.`,
      className: "system",
    });
  }

  // List objects in room
  const roomObjects = (room.objects || [])
    .map((id) => gameState.objects[id])
    .filter((obj) => obj && obj.location === `room:${roomId}`);

  if (roomObjects.length > 0) {
    const objNames = roomObjects.map((o) => o.name).join(", ");
    output.push({ text: `You can see: ${objNames}.`, className: "system" });
  }

  // List exits
  const exits = Object.keys(room.exits || {});
  if (exits.length > 0) {
    const exitStr = exits.map((e) => e.toUpperCase()).join(", ");
    output.push({ text: `Obvious exits: ${exitStr}`, className: "system" });
  }

  return output;
}

/**
 * Handle LOOK command
 */
function handleLook(object) {
  if (!object) {
    // Look at room
    return describeRoom(gameState.player.roomId);
  }

  // Look in a direction
  const dirMap = {
    north: "north",
    n: "north",
    south: "south",
    s: "south",
    east: "east",
    e: "east",
    west: "west",
    w: "west",
  };

  if (dirMap[object]) {
    const currentRoom = gameState.rooms[gameState.player.roomId];
    const dir = dirMap[object];
    if (currentRoom.exits && currentRoom.exits[dir]) {
      const nextRoom = gameState.rooms[currentRoom.exits[dir]];
      return `Looking ${dir.toUpperCase()}, you see the way to ${
        nextRoom.name
      }.`;
    }
    return `There's nothing particularly interesting to the ${dir}.`;
  }

  // Look at an object - delegate to examine
  return handleExamine(object);
}

/**
 * Handle EXAMINE command
 */
function handleExamine(objectName) {
  if (!objectName) {
    return "Examine what, exactly? The void stares back, unimpressed.";
  }

  // Try to find an object first
  const obj = findObject(objectName);
  if (obj) {
    return obj.description;
  }

  // Try to find an NPC
  const npc = findNPC(objectName);
  if (npc) {
    return npc.description;
  }

  return `You cannot see any "${objectName}" here. Perhaps it's in another room, or perhaps it never existed.`;
}

/**
 * Handle INVENTORY command
 */
function handleInventory() {
  const inv = gameState.player.inventory;

  if (inv.length === 0) {
    return "You are carrying nothing. Unburdened by material possessions, you feel lighter. Also slightly unprepared.";
  }

  const items = inv
    .map((id) => {
      const obj = gameState.objects[id];
      return obj ? obj.name : id;
    })
    .join(", ");

  return `You are carrying: ${items}.`;
}

/**
 * Handle TAKE command
 */
function handleTake(objectName) {
  if (!objectName) {
    return "Take what? Your options are limited to things that exist.";
  }

  const obj = findObject(objectName);
  if (!obj) {
    return `You cannot see any "${objectName}" here.`;
  }

  // Check if already in inventory
  if (gameState.player.inventory.includes(obj.id)) {
    return "You already have that. Excellent memory, that.";
  }

  // Check if portable
  if (!obj.portable) {
    return `The ${obj.name} cannot be taken. It's either too heavy, bolted down, or simply not interested in being picked up.`;
  }

  // Check if in current room
  const currentRoom = gameState.rooms[gameState.player.roomId];
  if (!currentRoom.objects.includes(obj.id)) {
    return `You cannot see that here.`;
  }

  // Take the object
  gameState.player.inventory.push(obj.id);
  obj.location = "player";

  // Remove from room's object list
  const idx = currentRoom.objects.indexOf(obj.id);
  if (idx > -1) {
    currentRoom.objects.splice(idx, 1);
  }

  return `You pick up the ${obj.name}. It's yours now, for better or worse.`;
}

/**
 * Handle DROP command
 */
function handleDrop(objectName) {
  if (!objectName) {
    return "Drop what? Being specific helps.";
  }

  const obj = findObject(objectName);
  if (!obj) {
    return `You don't have any "${objectName}".`;
  }

  // Check if in inventory
  if (!gameState.player.inventory.includes(obj.id)) {
    return `You're not carrying any ${obj.name}.`;
  }

  // Drop the object
  const idx = gameState.player.inventory.indexOf(obj.id);
  gameState.player.inventory.splice(idx, 1);

  const currentRoom = gameState.rooms[gameState.player.roomId];
  currentRoom.objects.push(obj.id);
  obj.location = `room:${gameState.player.roomId}`;

  return `You drop the ${obj.name}. It lands with the quiet dignity of an object that knows its worth.`;
}

/**
 * Handle USE command
 */
function handleUse(objectName) {
  if (!objectName) {
    return "Use what? The parser requires slightly more information.";
  }

  const obj = findObject(objectName);
  if (!obj) {
    return `You cannot see any "${objectName}" here.`;
  }

  // Check for custom onUse handler
  if (obj.onUse) {
    return obj.onUse;
  }

  return `You fiddle with the ${obj.name}, but nothing particularly interesting happens. Perhaps it has other uses, or perhaps it's just here for ambience.`;
}

/**
 * Handle READ command
 */
function handleRead(objectName) {
  if (!objectName) {
    return "Read what? The air contains no visible text.";
  }

  const obj = findObject(objectName);
  if (!obj) {
    return `You cannot see any "${objectName}" here.`;
  }

  // For now, reading is like examining
  return `You read the ${obj.name}.\n\n${obj.description}`;
}

/**
 * Handle TALK command
 */
function handleTalk(npcName) {
  if (!npcName) {
    return "Talk to whom? The silence offers no suggestions.";
  }

  const npc = findNPC(npcName);
  if (!npc) {
    return `You cannot see any "${npcName}" here to talk to.`;
  }

  if (!npc.dialogue || npc.dialogue.length === 0) {
    return `The ${npc.name} seems disinclined to conversation at the moment.`;
  }

  // Simple dialogue: pick a random line from the dialogue array
  const randomLine =
    npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
  return randomLine;
}

/**
 * Handle HELP command
 */
function handleHelp() {
  return [
    "You type words. I try to understand them. We muddle through together.",
    "",
    "COMMANDS:",
    "  LOOK (L)         — Describe your surroundings",
    "  EXAMINE X (X X)  — Look closely at something",
    "  INVENTORY (I)    — Check what you're carrying",
    "  TAKE / GET       — Pick something up",
    "  DROP             — Put something down",
    "  USE              — Interact with an object",
    "  READ             — Read text on objects",
    "",
    "MOVEMENT:",
    "  NORTH (N), SOUTH (S), EAST (E), WEST (W)",
    "  UP (U), DOWN (D), IN, OUT",
    "",
    "META:",
    "  HELP    — You're reading it",
    "  ABOUT   — Learn more about this place",
    "  CLEAR   — Clear the screen",
    "  QUIT    — A polite farewell",
    "",
    "Some objects here lead to real content — posts, videos, documentation.",
    "Interact with them and they'll open in new tabs. It's a small world, but it's got layers.",
  ];
}

/**
 * Handle ABOUT command
 */
function handleAbout() {
  return [
    "ABOUT THIS PLACE",
    "",
    "This is my website, or perhaps it's a text adventure in my mind. The distinction blurs.",
    "",
    "I'm Diogo. I build things: games, systems, experiments. Code is a form of expression for me. A shapeshifter tool I play with not quite knowing where I'm going, half of the time.",
    "",
    "Feel free to explore. Some actions will open real content: blog posts, documentation, videos; just be careful not to get lost.",
    "",
    "The engine is entirely client-side JavaScript. No servers were harmed in the making of this adventure.",
    "I built this to explore the limits of my collaboration with AI. It feels mine and not at the same time.",
    "",
    "It treats the LLM as a creative compiler, I still edit the source.",
    "",
    "Have fun!",
    "",
    "Type LOOK to continue exploring.",
  ];
}

/**
 * Handle CLEAR command
 */
function handleClear() {
  clearOutput();
  // After clearing, show the current room (like LOOK)
  return handleLook(null);
}

/**
 * Handle QUIT command
 */
function handleQuit() {
  return [
    "You consider leaving, but where would you go? The real world awaits, certainly, with its meetings and deadlines. But you're always welcome back here. The terminal will remember you.",
    "",
    "(Refresh the page to start anew, or simply continue exploring.)",
  ];
}

/**
 * Handle unknown commands
 */
function handleUnknown() {
  const responses = [
    "That's ambitious. The parser, alas, is not.",
    "I do not understand that. Perhaps try different words?",
    "The parser scratches its metaphorical head. Type HELP for suggestions.",
    "That command exists in a parallel universe where the parser is smarter.",
    "You could do that, but it wouldn't advance the plot, such as it is.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ================================================
// COMMAND DISPATCHER
// ================================================

/**
 * Process a parsed command and return the result
 */
function executeCommand(parsed) {
  const { verb, object, preposition, secondObject } = parsed;

  if (!verb) {
    return handleUnknown();
  }

  switch (verb) {
    // Movement
    case "go":
      if (!object) return "Go where? A direction would help.";
      return handleMovement(object);
    case "north":
    case "south":
    case "east":
    case "west":
    case "up":
    case "down":
    case "in":
    case "out":
      return handleMovement(verb);

    // Observation
    case "look":
      return handleLook(object);
    case "examine":
      return handleExamine(object);
    case "read":
      return handleRead(object);

    // Inventory
    case "inventory":
      return handleInventory();
    case "take":
      return handleTake(object);
    case "drop":
      return handleDrop(object);

    // Interaction
    case "use":
      return handleUse(object);
    case "talk":
      return handleTalk(object);

    // Meta
    case "help":
      return handleHelp();
    case "about":
      return handleAbout();
    case "clear":
      return handleClear();
    case "quit":
      return handleQuit();
    case "save":
      saveGame();
      return "Game saved. Your progress is preserved in the browser's memory.";
    case "load":
      if (loadGame()) {
        return [
          { text: "Game loaded.", className: "system" },
          ...describeRoom(gameState.player.roomId),
        ];
      }
      return "No saved game found. Perhaps you haven't been here before.";

    default:
      return handleUnknown();
  }
}

// ================================================
// PERSISTENCE
// ================================================

const SAVE_KEY = "neurolink_adventure_save";

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    return true;
  } catch (e) {
    console.error("Failed to save game:", e);
    return false;
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      gameState = JSON.parse(saved);
      return true;
    }
  } catch (e) {
    console.error("Failed to load game:", e);
  }
  return false;
}

// ================================================
// UI FUNCTIONS
// ================================================

let outputElement = null;
let inputElement = null;
let statusLocationElement = null;
let statusTurnsElement = null;
let scrollUpIndicator = null;
let scrollDownIndicator = null;
let isShowingTitle = true;

/**
 * Initialise the game UI
 */
function initGame() {
  outputElement = document.getElementById("text-output");
  inputElement = document.getElementById("command-input");
  statusLocationElement = document.getElementById("status-location");
  statusTurnsElement = document.getElementById("status-turns");
  scrollUpIndicator = document.getElementById("scroll-up");
  scrollDownIndicator = document.getElementById("scroll-down");

  // Set up input handler
  if (inputElement) {
    inputElement.addEventListener("keydown", handleInput);
    inputElement.focus();
  }

  // Set up scroll indicator handlers
  if (outputElement) {
    outputElement.addEventListener("scroll", updateScrollIndicators);
    // Also update on resize
    window.addEventListener("resize", updateScrollIndicators);
  }

  // Set up click handlers for scroll indicators
  if (scrollUpIndicator) {
    scrollUpIndicator.addEventListener("click", () => {
      if (outputElement) {
        outputElement.scrollBy({ top: -150, behavior: "smooth" });
      }
    });
  }

  if (scrollDownIndicator) {
    scrollDownIndicator.addEventListener("click", () => {
      if (outputElement) {
        outputElement.scrollBy({ top: 150, behavior: "smooth" });
      }
    });
  }

  // Create fresh game state
  gameState = createInitialState();

  // Show title screen
  showTitleScreen();
}

/**
 * Show the title screen
 */
function showTitleScreen() {
  isShowingTitle = true;
  updateStatus("NEUROLINK-7800", "");

  // ASCII banner - each line is a separate element for the link
  const banner = `
██████╗ ██╗ ██████╗  ██████╗  ██████╗     ██╗███████╗    ██████╗ ██╗   ██╗██╗██╗     ██████╗ ██╗███╗   ██╗ ██████╗ 
██╔══██╗██║██╔═══██╗██╔════╝ ██╔═══██╗    ██║██╔════╝    ██╔══██╗██║   ██║██║██║     ██╔══██╗██║████╗  ██║██╔════╝ 
██║  ██║██║██║   ██║██║  ███╗██║   ██║    ██║███████╗    ██████╔╝██║   ██║██║██║     ██║  ██║██║██╔██╗ ██║██║  ███╗
██║  ██║██║██║   ██║██║   ██║██║   ██║    ██║╚════██║    ██╔══██╗██║   ██║██║██║     ██║  ██║██║██║╚██╗██║██║   ██║
██████╔╝██║╚██████╔╝╚██████╔╝╚██████╔╝    ██║███████║    ██████╔╝╚██████╔╝██║███████╗██████╔╝██║██║ ╚████║╚██████╔╝
╚═════╝ ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝     ╚═╝╚══════╝    ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                                                                                   
                                     ██████╗ ███╗   ██╗    ██╗   ██╗ ██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗ ███████╗
                                    ██╔═══██╗████╗  ██║    ╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝
                                    ██║   ██║██╔██╗ ██║     ╚████╔╝ ██║   ██║██║   ██║   ██║   ██║   ██║██████╔╝█████╗  
                                    ██║   ██║██║╚██╗██║      ╚██╔╝  ██║   ██║██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝  
                                    ╚██████╔╝██║ ╚████║       ██║   ╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝██████╔╝███████╗
                                     ╚═════╝ ╚═╝  ╚═══╝       ╚═╝    ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝`;

  clearOutput();

  // Add banner with clickable YouTube link
  const bannerDiv = document.createElement("div");
  bannerDiv.className = "ascii-banner";
  const bannerLink = document.createElement("a");
  bannerLink.href = "https://youtube.com/@diogoneves";
  bannerLink.target = "_blank";
  bannerLink.rel = "noopener noreferrer";
  bannerLink.className = "youtube-link";
  bannerLink.textContent = banner;
  bannerLink.setAttribute("aria-label", "Visit Diogo on YouTube");
  bannerDiv.appendChild(bannerLink);
  outputElement.appendChild(bannerDiv);

  // System info
  addOutput("");
  addOutput(
    "═══════════════════════════════════════════════════════════════",
    "system"
  );
  addOutput("");
  addOutput("NEUROLINK-7800 PERSONAL COMPUTING SYSTEM", "system");
  addOutput(
    "BIOSYNTHETIC PROCESSOR v3.14.159 | NEURAL-RAM: 640K (SHOULD BE ENOUGH)",
    "system"
  );
  addOutput("CONSCIOUSNESS LINK: ACTIVE | REALITY ANCHOR: STABLE", "system");
  addOutput("");
  addOutput(
    "═══════════════════════════════════════════════════════════════",
    "system"
  );
  addOutput("");
  addOutput(`Welcome, traveller. You've found your way to a small corner of the
digital realm — a personal space where ideas take shape and projects
come to life. This is where I build things.`);
  addOutput("");
  addOutput("Feel free to explore. Poke around. Break things (gently).");
  addOutput("The world responds to your curiosity.");
  addOutput("");
  addOutput("Type HELP for commands. Type LOOK to begin.");
  addOutput("");

  scrollToBottom();
  // Initial check for scroll indicators
  setTimeout(updateScrollIndicators, 100);
}

/**
 * Handle keyboard input
 */
function handleInput(event) {
  if (event.key !== "Enter") return;

  const input = inputElement.value.trim();
  if (!input) return;

  // Echo user input
  addOutput(input, "user-input");

  // Clear input
  inputElement.value = "";

  // If showing title, first command starts the game
  if (isShowingTitle) {
    isShowingTitle = false;
    gameState.globals.gameStarted = true;
    gameState.rooms[gameState.player.roomId].flags.visited = true;

    // Check if they typed a command or just pressed enter
    const parsed = parseCommand(input);
    if (parsed.verb === "help") {
      displayOutput(handleHelp());
    } else if (parsed.verb === "about") {
      displayOutput(handleAbout());
    } else {
      // Show starting room
      const roomOutput = describeRoom(gameState.player.roomId);
      addOutput("");
      addOutput("[ INITIATING ADVENTURE SEQUENCE... ]", "system");
      addOutput("");
      displayOutput(roomOutput);
    }
  } else {
    // Parse and execute command
    const parsed = parseCommand(input);
    const result = executeCommand(parsed);

    // Display result
    if (result) {
      addOutput("");
      displayOutput(result);
    }

    // Increment turn counter
    gameState.globals.turn++;
    updateStatus();

    // Auto-save
    saveGame();
  }

  scrollToBottom();
}

/**
 * Display output (handles arrays and single strings)
 */
function displayOutput(output) {
  if (Array.isArray(output)) {
    output.forEach((item) => {
      if (typeof item === "object") {
        addOutput(item.text, item.className);
      } else {
        addOutput(item);
      }
    });
  } else {
    addOutput(output);
  }
}

/**
 * Add a line to the output
 */
function addOutput(text, className = "") {
  const line = document.createElement("div");
  line.className = "output-line" + (className ? " " + className : "");
  line.textContent = text;
  outputElement.appendChild(line);
}

/**
 * Clear the output
 */
function clearOutput() {
  if (outputElement) {
    outputElement.innerHTML = "";
  }
}

/**
 * Scroll output to bottom
 */
function scrollToBottom() {
  if (outputElement) {
    outputElement.scrollTop = outputElement.scrollHeight;
    // Update indicators after scroll
    setTimeout(updateScrollIndicators, 50);
  }
}

/**
 * Update scroll indicator visibility based on scroll position
 */
function updateScrollIndicators() {
  if (!outputElement) return;

  const scrollTop = outputElement.scrollTop;
  const scrollHeight = outputElement.scrollHeight;
  const clientHeight = outputElement.clientHeight;

  // Threshold for considering "at top" or "at bottom" (in pixels)
  const threshold = 20;

  // Check if content is scrollable at all
  const isScrollable = scrollHeight > clientHeight + threshold;

  // Check if at top
  const isAtTop = scrollTop <= threshold;

  // Check if at bottom
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

  // Update up indicator
  if (scrollUpIndicator) {
    if (isScrollable && !isAtTop) {
      scrollUpIndicator.classList.add("visible");
    } else {
      scrollUpIndicator.classList.remove("visible");
    }
  }

  // Update down indicator
  if (scrollDownIndicator) {
    if (isScrollable && !isAtBottom) {
      scrollDownIndicator.classList.add("visible");
    } else {
      scrollDownIndicator.classList.remove("visible");
    }
  }
}

/**
 * Update status bar
 */
function updateStatus(location, turns) {
  if (statusLocationElement) {
    if (location !== undefined) {
      statusLocationElement.textContent = location;
    } else if (gameState) {
      const room = gameState.rooms[gameState.player.roomId];
      statusLocationElement.textContent = room ? room.name : "Unknown";
    }
  }

  if (statusTurnsElement) {
    if (turns !== undefined) {
      statusTurnsElement.textContent = turns;
    } else if (gameState) {
      statusTurnsElement.textContent = `Turn: ${gameState.globals.turn}`;
    }
  }
}

// ================================================
// INITIALISE ON DOM READY
// ================================================

document.addEventListener("DOMContentLoaded", initGame);
