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
      name: "Outside the Store",
      description: `You stand on a cracked pavement, facing a storefront cluttered with retro tech — cathode ray tubes, cassette players, and devices whose purposes have been lost to time. Above the entrance, a faded sign reads "METAPHORA" in letters that flicker between certainty and doubt. Neon tubes cast an amber glow across the street, buzzing with the kind of persistence that suggests they've forgotten how to stop.

The air tastes of petrichor and static. A storm's coming, though the sky can't quite decide when.

You can head INSIDE the store, cross the STREET to a house, walk toward the TRAIN station, or follow the path to the COAST.`,
      exits: {
        in: "store",
        inside: "store",
        street: "home",
        train: "train_station",
        coast: "coast_line",
      },
      objects: ["quarter", "neon_signs", "retro_devices", "metaphora_sign"],
      npcs: ["friendly_stranger"],
      flags: {
        visited: false,
        stormWarningGiven: false,
      },
    },

    store: {
      id: "store",
      name: "Metaphora — The Tech Shop",
      description: `A cramped shop stuffed with shelves of obsolete technology. Dust motes drift in the weak light filtering through the grimy window. The shopkeeper's chair sits empty, as if they've just stepped out and might return any moment. Or never.

Rows of CRT monitors stare blankly at you. One flickers to life occasionally, displaying static patterns that almost resemble faces. Almost.

The exit leads back OUT to the street.`,
      exits: {
        out: "outside",
        outside: "outside",
      },
      objects: ["crt_monitors", "dusty_shelf", "empty_chair"],
      flags: {
        visited: false,
      },
    },

    home: {
      id: "home",
      name: "The House Across the Street",
      description: `You stand before a modest house with peeling paint and a garden that's given up on formality. The windows are dark, but you sense someone inside, watching the storm clouds gather.

A mailbox leans at an angle, stuffed with unopened letters and what might be yesterday's dreams. The front door is closed but unlocked — the kind of place that trusts in the good nature of strangers.

The STREET leads back to the storefront.`,
      exits: {
        street: "outside",
        out: "outside",
        outside: "outside",
      },
      objects: ["mailbox", "garden", "dark_windows"],
      flags: {
        visited: false,
        doorUnlocked: true,
      },
    },

    train_station: {
      id: "train_station",
      name: "The Train Station",
      description: `An empty platform stretches before you, flanked by rusted rails that disappear into the fog. A timetable board displays departure times for trains that might never come. The last entry reads: "DELAYED INDEFINITELY."

Benches line the platform, their wood warped by weather and time. A single light flickers overhead, casting long shadows that move even when you don't.

The exit leads back toward the STOREFRONT.`,
      exits: {
        storefront: "outside",
        back: "outside",
        out: "outside",
      },
      objects: ["timetable_board", "platform_bench", "rusted_rails"],
      flags: {
        visited: false,
        trainExpected: false,
      },
    },

    coast_line: {
      id: "coast_line",
      name: "The Coast",
      description: `The ocean spreads before you, grey and restless. Waves crash against rocks with the patience of something that's been doing this long before you arrived and will continue long after you leave.

Seagulls wheel overhead, their cries almost like laughter. The wind carries salt and the faint scent of something burning far away. The horizon blurs where sea meets sky, both refusing to commit to a definite boundary.

The path BACK leads to the storefront.`,
      exits: {
        back: "outside",
        storefront: "outside",
        out: "outside",
      },
      objects: ["ocean_waves", "rocks", "seagulls"],
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
        'A quarter from 1984, tarnished and worn smooth at the edges. Someone\'s initials are scratched on one side: "D.N." It\'s warm to the touch, as if it\'s been in someone\'s pocket recently. Or perhaps it\'s just picking up heat from your hand.',
      location: "room:outside",
      portable: true,
      onUse:
        "You flip the quarter. It spins in the air, catching the neon light, and lands in your palm. Heads. Or tails. Does it matter? The universe remains indifferent to your small gambles.",
    },
    neon_signs: {
      id: "neon_signs",
      name: "neon signs",
      aliases: ["signs", "neon", "lights"],
      description:
        'Flickering neon tubes spelling out words like "REPAIR," "CIRCUITS," and something that might be "REALITY" but the R and A have given up entirely. The buzz is almost hypnotic, a rhythm that suggests it\'s trying to communicate in morse code. So far you\'ve deciphered: "HELP... HELP... HELP..." Probably just interference.',
      location: "room:outside",
      portable: false,
    },
    retro_devices: {
      id: "retro_devices",
      name: "retro devices",
      aliases: ["devices", "tech", "equipment"],
      description:
        "An array of obsolete technology displayed in the window: a Walkman with a broken hinge, a pager that's still somehow receiving messages, a Game Boy with a screen that displays only question marks. Each one tells a story of someone who once thought these were the future.",
      location: "room:outside",
      portable: false,
    },
    metaphora_sign: {
      id: "metaphora_sign",
      name: "Metaphora sign",
      aliases: ["sign", "metaphora", "store sign", "shop sign"],
      description:
        'The shop sign reads "METAPHORA" in faded letters that flicker uncertainly. Some letters glow brighter than others, as if the sign itself can\'t quite commit to what it wants to say. Below, in smaller text that\'s barely visible: "Est. 1984 — Where Memory Meets Tomorrow."',
      location: "room:outside",
      portable: false,
    },

    // Store objects
    crt_monitors: {
      id: "crt_monitors",
      name: "CRT monitors",
      aliases: ["monitors", "screens", "crts", "displays"],
      description:
        'Stacks of cathode ray tube monitors, their convex screens covered in a film of dust. One flickers to life as you watch, displaying green text on black: "YOU ARE BEING WATCHED." Then it goes dark. Probably just residual charge. Probably.',
      location: "room:store",
      portable: false,
      onUse:
        "You tap the screen of one monitor. It crackles to life, displays a cursor blinking expectantly, then fades back to black. Whatever it wanted to tell you, it's changed its mind.",
    },
    dusty_shelf: {
      id: "dusty_shelf",
      name: "dusty shelf",
      aliases: ["shelf", "shelves"],
      description:
        'Shelves crammed with ancient computer components: ISA cards, parallel cables, floppy disks in both 5.25" and 3.5" varieties. A box labelled "SPARE PARTS" contains items you\'re quite certain were never parts of anything recognisable.',
      location: "room:store",
      portable: false,
    },
    empty_chair: {
      id: "empty_chair",
      name: "shopkeeper's chair",
      aliases: ["chair", "seat"],
      description:
        "A worn office chair, its padding compressed by years of patient sitting. A cup of coffee sits on the armrest, still steaming. The shopkeeper must have just stepped out. Any moment now they'll return. Any moment.",
      location: "room:store",
      portable: false,
    },

    // Home objects
    mailbox: {
      id: "mailbox",
      name: "leaning mailbox",
      aliases: ["mailbox", "mail", "letterbox"],
      description:
        'A metal mailbox tilted at an angle that defies stability. Inside: bills, flyers for events that have already passed, and a postcard from somewhere that might not exist. The postcard shows a beach at sunset with text reading: "Wish you were here (but we\'re glad you\'re there)."',
      location: "room:home",
      portable: false,
      onUse:
        'You check the mail. More of the same: past-due notices and advertisements for products no one needs. At the bottom, a letter addressed to "The Dreamer." You pocket it for later.',
    },
    garden: {
      id: "garden",
      name: "overgrown garden",
      aliases: ["garden", "plants"],
      description:
        "What was once a carefully tended garden has become a wild tangle of growth. Flowers bloom in defiance of season. A tomato plant produces fruit that seems too perfect to be real. Everything grows with the determination of things that refuse to be forgotten.",
      location: "room:home",
      portable: false,
    },
    dark_windows: {
      id: "dark_windows",
      name: "dark windows",
      aliases: ["windows", "window"],
      description:
        "The windows are dark, but not empty. Shadows move behind the glass — or perhaps it's just the reflection of clouds racing across the sky. You're almost certain you saw a face looking back at you. Almost.",
      location: "room:home",
      portable: false,
    },

    // Train Station objects
    timetable_board: {
      id: "timetable_board",
      name: "timetable board",
      aliases: ["board", "timetable", "schedule"],
      description:
        'A mechanical split-flap display that once showed arrival and departure times. Now it cycles through destinations that sound wrong: "MEMORY LANE," "POINT OF NO RETURN," "YESTERDAY," "TOMORROW (CANCELLED)." The clicking of the flaps is almost musical.',
      location: "room:train_station",
      portable: false,
      onUse:
        'You press the button to cycle through departures. The board whirrs, flaps spinning, and settles on: "NEXT TRAIN: WHEN YOU\'RE READY." Helpful.',
    },
    platform_bench: {
      id: "platform_bench",
      name: "weathered bench",
      aliases: ["bench", "seat"],
      description:
        'A wooden bench worn smooth by countless patient waiters. Someone\'s carved their initials into the armrest: "D.N. + IDEAS = ∞". The equals sign looks more recent than the rest.',
      location: "room:train_station",
      portable: false,
    },
    rusted_rails: {
      id: "rusted_rails",
      name: "rusted rails",
      aliases: ["rails", "tracks", "railway"],
      description:
        "Iron rails oxidising gracefully, their surface a tapestry of browns and oranges. They disappear into fog in both directions. You place your hand on one — it's vibrating, ever so slightly. Something's coming. Or perhaps something just left.",
      location: "room:train_station",
      portable: false,
    },

    // Coast objects
    ocean_waves: {
      id: "ocean_waves",
      name: "ocean waves",
      aliases: ["ocean", "waves", "water", "sea"],
      description:
        "The waves roll in with hypnotic regularity, each one slightly different from the last. They foam white against the rocks, retreat, and return, as if they're trying to remember something important but keep forgetting halfway through.",
      location: "room:coast_line",
      portable: false,
    },
    rocks: {
      id: "rocks",
      name: "coastal rocks",
      aliases: ["rocks", "stone", "stones"],
      description:
        "Dark volcanic rocks worn smooth by the ocean's endless critique. Tidal pools form in their crevices, tiny worlds complete with their own ecosystems, unaware of the larger world around them. You feel a strange kinship.",
      location: "room:coast_line",
      portable: false,
    },
    seagulls: {
      id: "seagulls",
      name: "wheeling seagulls",
      aliases: ["seagulls", "gulls", "birds"],
      description:
        "Seagulls circle overhead, riding the air currents with practiced ease. Their cries sound almost like words if you listen closely enough. Or perhaps you're just pattern-matching where no patterns exist. Either way, they seem to find it amusing.",
      location: "room:coast_line",
      portable: false,
    },
  },

  npcs: {
    friendly_stranger: {
      id: "friendly_stranger",
      name: "friendly stranger",
      aliases: ["stranger", "person", "npc", "man"],
      location: "room:outside",
      description:
        "A person of indeterminate age wearing a weatherproof jacket and an expression of perpetual enthusiasm. They lean against the storefront, watching the sky with the air of someone who's seen this before and knows what's coming. Their eyes are kind but knowing.",
      dialogue: [
        '"Lovely evening, isn\'t it? Well, it would be if not for the storm brewing. Strange things happening in this town lately."',
        '"You look like someone who builds things. Am I right? Got that look about you. Creative chaos and all that."',
        '"Storm\'s coming. Best get somewhere safe. Or somewhere interesting. Sometimes they\'re the same thing."',
        '"Been standing here for... how long has it been? Time gets funny around here. You\'ll see."',
        '"That quarter on the ground? Someone must\'ve dropped it. Finders keepers, I always say."',
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
    "Interact with them and they'll open in new tabs. It's a small world,",
    "but it's got layers.",
  ];
}

/**
 * Handle ABOUT command
 */
function handleAbout() {
  return [
    "ABOUT THIS PLACE",
    "",
    "This is a personal website wearing a text adventure costume. Or perhaps",
    "it's a text adventure that happens to contain a personal website. The",
    "distinction blurs.",
    "",
    "I'm Diogo. I build things — games, systems, experiments. This place is",
    "a playful way to explore that. Some actions will open real content:",
    "blog posts, documentation, videos. Think of it as navigation through",
    "the medium of curiosity.",
    "",
    "The engine is entirely client-side JavaScript. No servers were harmed",
    "in the making of this adventure. The code is probably on GitHub,",
    "because where else would it be?",
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
    "You consider leaving, but where would you go? The real world",
    "awaits, certainly, with its meetings and deadlines. But you're always",
    "welcome back here. The terminal will remember you.",
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
