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
      hasLight: true,
      talkedToNPC: false,
      foundQuarter: false,
    },
  },

  rooms: {
    outside: {
      id: "outside",
      name: "Outside the Storefront",
      description: `You stand on cracked pavement facing a narrow tech shop, its window crammed with retro hardware stacked like a memory puzzle. Neon tubes sputter in an amber halo, their letters warped by drizzle; you'll need to step closer if you want to read them. The air smells of petrichor and warm circuitry, and somewhere distant thunder practises its lines.

Something small glints near the doorway, half-hidden between tiles. You can duck IN to the shop, cross the STREET to the house, wander toward the TRAIN station, or follow the path to the COAST.`,
      exits: {
        in: "store",
        inside: "store",
        street: "home",
        train: "train_station",
        coast: "coast_line",
      },
      objects: ["quarter", "neon_signs", "metaphora_sign", "retro_devices"],
      npcs: ["friendly_stranger"],
      flags: {
        visited: false,
        stormWarningGiven: false,
      },
    },

    store: {
      id: "store",
      name: "Metaphora — Tech Shop",
      description: `You slip inside and the door sighs behind you. Towers of CRTs and boxes of cables form aisles of controlled chaos, each stack humming like a contented cat. A workbench at the back hosts prototypes mid-thought: circuit boards, scribbled flowcharts, and a mug of coffee that has lost the heat but not the hope.

The room smells of solder and optimism. The only way OUT is the door you came through.`,
      exits: {
        out: "outside",
        outside: "outside",
        back: "outside",
      },
      objects: ["crt_stack", "workbench_notes", "prototype_console"],
      flags: {
        visited: false,
      },
    },

    home: {
      id: "home",
      name: "House Across the Street",
      description: `The small house feels lived-in rather than staged. Shoes gather by the door, evidence of a family that leaves and returns in looping patterns. A hallway disappears inward, lined with photos that capture laughter mid-bloom. Somewhere deeper, a kettle cools after being forgotten in the excitement of an idea.

It's peaceful, full of unfinished sentences. The STREET is the way back.`,
      exits: {
        street: "outside",
        out: "outside",
        outside: "outside",
        back: "outside",
      },
      objects: ["family_portrait", "toy_robot", "open_journal"],
      flags: {
        visited: false,
        doorUnlocked: true,
      },
    },

    train_station: {
      id: "train_station",
      name: "The Train Station",
      description: `The platform stretches farther than physics ought to allow. Fog curls around rusted rails that vanish into nothing, and a split-flap board clatters through destinations that cannot possibly exist. The wind tastes of static; announcements never quite make it to sound.

Time feels elastic here. BACK to the storefront is the only option unless you fancy waiting forever.`,
      exits: {
        storefront: "outside",
        back: "outside",
        out: "outside",
      },
      objects: ["splitflap_board", "waiting_bench", "ghost_ticket"],
      flags: {
        visited: false,
        trainExpected: false,
      },
    },

    coast_line: {
      id: "coast_line",
      name: "The Coast",
      description: `The path opens onto a slate coast. Waves hammer the rocks with patient fury, each retreat leaving salt and ozone on your tongue. The horizon flickers between storm clouds and sunlit memories, as if the weather can't pick a mood.

Gulls wheel overhead, sounding suspiciously like laughter at your expense. The only clear path is BACK toward the storefront, unless you plan to walk into the sea and see what answers it has.`,
      exits: {
        back: "outside",
        storefront: "outside",
        out: "outside",
      },
      objects: ["tidal_pool", "storm_clouds", "driftwood_sign"],
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
        "You flip the quarter. The neon catches it mid-spin, casting fleeting constellations across your palm. It lands with a soft clink and the storm somewhere overhead gives a polite rumble of approval.",
    },
    neon_signs: {
      id: "neon_signs",
      name: "neon signs",
      aliases: ["signs", "neon", "lights"],
      description:
        'Neon tubing frames the window. Up close you can make out letters stuttering between "METAPHORA" and simply "METAPHOR". The buzz is half warning, half welcome, like a thought you refuse to misplace.',
      location: "room:outside",
      portable: false,
    },
    metaphora_sign: {
      id: "metaphora_sign",
      name: "Metaphora plaque",
      aliases: ["sign", "plaque", "metaphora", "store sign", "shop sign"],
      description:
        'A brass plaque beside the door reads "METAPHORA" in patient lettering. Beneath it, engraved in smaller type: "Where memory meets tomorrow." Tilt your head and the words seem to rearrange into "Metaphor? Ah." The plaque pretends not to notice.',
      location: "room:outside",
      portable: false,
    },
    retro_devices: {
      id: "retro_devices",
      name: "retro devices",
      aliases: ["devices", "tech", "equipment", "hardware"],
      description:
        "Walkmen, pagers, and consoles crowd the window display, each frozen mid-fashionable moment. One Game Boy shows only a blank green stare until you blink, when for a heartbeat it displays a level layout you don't recognise.",
      location: "room:outside",
      portable: false,
    },

    // Store objects
    crt_stack: {
      id: "crt_stack",
      name: "tower of CRTs",
      aliases: ["crts", "monitors", "screens", "stack"],
      description:
        "A precarious stack of CRT monitors loops footage of projects at various stages: a glitchy devlog, a half-rendered game scene, a keyboard bathed in midnight light. Occasionally the feeds sync and you catch your own reflection looking back.",
      location: "room:store",
      portable: false,
      onUse:
        'You tap the top monitor. The stack shivers, resolves into a single line of green text: "PROGRESS: IN PROGRESS." Then the screens return to their static gossip.',
    },
    workbench_notes: {
      id: "workbench_notes",
      name: "workbench notes",
      aliases: ["notes", "stickies", "post-its", "list"],
      description:
        'Sticky notes fan across the bench: "edit next dev video", "ship the build before the storm", "call mum", "remember to sleep". The handwriting grows wobblier toward the edge, like the writer ran out of daylight.',
      location: "room:store",
      portable: false,
    },
    prototype_console: {
      id: "prototype_console",
      name: "prototype console",
      aliases: ["console", "prototype", "device", "handheld"],
      description:
        "A half-built handheld wired to a breadboard. Its tiny screen shows a blinking cursor waiting for instruction, as if it expects you to type something profound or at least entertaining.",
      location: "room:store",
      portable: false,
      onUse:
        'You press the lone button. The cursor blinks faster, then prints "READY WHEN YOU ARE" before fading back to anticipation.',
    },

    // Home objects
    family_portrait: {
      id: "family_portrait",
      name: "family portrait",
      aliases: ["portrait", "photo", "picture"],
      description:
        "A framed photograph catches a family mid-laugh. Someone's eyes are squeezed shut, someone's hair is in motion, and the joy is wonderfully imperfect. A faint reflection shows storm clouds gathering beyond the window outside the frame.",
      location: "room:home",
      portable: false,
    },
    toy_robot: {
      id: "toy_robot",
      name: "toy robot",
      aliases: ["robot", "toy", "figure"],
      description:
        'A small 3D-printed robot sits on the shoe rack, one arm missing, LEDs blinking a stubborn heartbeat. Someone has scrawled "beta" on its back in permanent marker.',
      location: "room:home",
      portable: false,
    },
    open_journal: {
      id: "open_journal",
      name: "open journal",
      aliases: ["journal", "notebook", "diary", "notes"],
      description:
        "A notebook lies open on the hall table. One page holds a gratitude list; the next, a sketched level layout full of arrows and question marks. A tea ring smudges the ink like a quiet apology.",
      location: "room:home",
      portable: false,
    },

    // Train Station objects
    splitflap_board: {
      id: "splitflap_board",
      name: "split-flap board",
      aliases: ["board", "timetable", "schedule", "display"],
      description:
        "The split-flap board rattles through impossible destinations: MEMORY LANE, NEXT BUILD, SOMEDAY, SOONISH. Every so often it pauses on a blank space, as if contemplating silence.",
      location: "room:train_station",
      portable: false,
      onUse:
        'You press the service button. The flaps whir, then settle on: "NEXT TRAIN: WHEN YOU STOP HESITATING." It immediately pretends it never said that.',
    },
    waiting_bench: {
      id: "waiting_bench",
      name: "waiting bench",
      aliases: ["bench", "seat"],
      description:
        'A wooden bench worn smooth by patient dreamers. Someone carved "CATCH YOUR BREATH" into the armrest and underlined it three times for emphasis.',
      location: "room:train_station",
      portable: false,
    },
    ghost_ticket: {
      id: "ghost_ticket",
      name: "ghost ticket",
      aliases: ["ticket", "stub", "pass"],
      description:
        'A ticket stub with no date and no price, just "ADMIT ONE: D.N. + GUEST" stamped in faded ink. It smells faintly of rain and printer toner.',
      location: "room:train_station",
      portable: true,
      onUse:
        'You hold the ticket up to the flickering light. Letters rearrange to spell "YOU\'RE ALREADY ON BOARD" before dissolving back into smudges.',
    },

    // Coast objects
    tidal_pool: {
      id: "tidal_pool",
      name: "tidal pool",
      aliases: ["pool", "water", "puddle"],
      description:
        "A shallow tidal pool mirrors the sky in miniature. Tiny crabs scuttle between pebbles, and a fragment of circuitry lies half-buried like an alien shell. The water tastes of salt and possibility.",
      location: "room:coast_line",
      portable: false,
    },
    storm_clouds: {
      id: "storm_clouds",
      name: "storm clouds",
      aliases: ["clouds", "storm", "sky"],
      description:
        "A bruise-coloured front gathers on the horizon. Lightning scribbles idle notes across the underside, as if sketching ideas before committing to a full performance.",
      location: "room:coast_line",
      portable: false,
    },
    driftwood_sign: {
      id: "driftwood_sign",
      name: "driftwood sign",
      aliases: ["sign", "driftwood", "post"],
      description:
        'A piece of driftwood is wedged upright between rocks. Someone carved "BUILD LOUDLY" into it, then crossed out LOUDLY and wrote "TRUTHFULLY" beneath. The wood creaks like it might offer more advice if you listen.',
      location: "room:coast_line",
      portable: false,
    },
  },

  npcs: {
    friendly_stranger: {
      id: "friendly_stranger",
      name: "friendly stranger",
      aliases: ["stranger", "person", "npc", "traveller"],
      location: "room:outside",
      description:
        "A person of indeterminate age leans against the storefront, jacket weatherproof and grin weathered. They watch the sky the way sailors watch the tide, amused and a little wary.",
      dialogue: [
        '"Lovely evening, isn\'t it? Well, it would be if the sky wasn\'t rehearsing something dramatic. Keep an eye on it, yeah?"',
        '"You look like someone who builds things. Creative chaos in the eyes. Respect."',
        '"Storm\'s coming. Best pick where you want to be when it hits: safe, daring, or both."',
        '"Time gets funny round here. Blink and you\'ll be waiting for a train that never was."',
        '"That little glint near the door? If you fancy luck, don\'t leave it to the pigeons."',
      ],
    },
  },

  globals: {
    turn: 0,
    gameStarted: false,
    puzzleFlags: {
      stormWarningReceived: false,
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
