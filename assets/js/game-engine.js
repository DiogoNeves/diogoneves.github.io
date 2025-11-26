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
    roomId: 'office',
    inventory: [],
    flags: {
      hasStarted: false,
      hasLight: true,
    },
  },
  
  rooms: {
    office: {
      id: 'office',
      name: 'The Office',
      description: `You stand in a small, cluttered office. The walls are covered with sticky notes, each one bearing fragments of code and half-formed ideas. A desk dominates the room, buried under monitors and cables. The faint hum of cooling fans provides a constant backdrop.

A window to the NORTH reveals the glow of a city at night. A doorway leads SOUTH into darkness. To the EAST, you notice a peculiar door that seems to shimmer slightly.`,
      exits: {
        north: 'window',
        south: 'corridor',
        east: 'workshop',
      },
      objects: ['desk', 'sticky_notes', 'coffee_mug'],
      flags: {
        visited: false,
        lightsOn: true,
      },
    },
    
    window: {
      id: 'window',
      name: 'By the Window',
      description: `You stand before a large window overlooking a sprawling cityscape. Towers of glass and steel stretch toward a sky thick with clouds and the occasional drone. The city never sleeps, and neither, it seems, do its inhabitants.

From here you can see your reflection — tired eyes, questionable posture, the general air of someone who's been staring at screens for too long. The office lies to the SOUTH.`,
      exits: {
        south: 'office',
      },
      objects: ['city_view', 'reflection'],
      flags: {
        visited: false,
      },
    },
    
    corridor: {
      id: 'corridor',
      name: 'The Dark Corridor',
      description: `The corridor stretches before you, its walls a uniform grey that seems to absorb what little light filters in from the office to the NORTH. The air is cooler here, with a faint metallic taste.

You could swear the corridor is longer than it was last time. But that's probably just your imagination. Probably.

At the far end, a door marked "ARCHIVES" waits patiently. It leads SOUTH. A faint humming comes from somewhere WEST.`,
      exits: {
        north: 'office',
        south: 'archives',
        west: 'server_room',
      },
      objects: ['fluorescent_light'],
      flags: {
        visited: false,
        dark: false,
      },
    },
    
    workshop: {
      id: 'workshop',
      name: 'The Workshop',
      description: `You enter a workshop that feels larger on the inside than it should be. Workbenches line the walls, covered with half-assembled gadgets, circuit boards, and tools whose purposes you can only guess at.

A brass telescope points toward a skylight that reveals an impossible starfield — you're quite certain there should be a ceiling there. The office lies to the WEST.

A sign on the wall reads: "Where ideas become tangible. Or at least, where they try."`,
      exits: {
        west: 'office',
      },
      objects: ['workbench', 'brass_telescope', 'mysterious_device'],
      flags: {
        visited: false,
      },
    },
    
    server_room: {
      id: 'server_room',
      name: 'The Server Room',
      description: `Banks of servers tower around you, their blinking lights creating a hypnotic pattern in the darkness. The temperature drops noticeably, and the hum of cooling systems is almost deafening.

In the centre of the room, a single terminal glows with an inviting light. Its screen displays scrolling text that seems to be... watching you back? No, that's ridiculous. Terminals don't watch. They merely observe.

The corridor lies to the EAST.`,
      exits: {
        east: 'corridor',
      },
      objects: ['server_racks', 'terminal', 'cooling_unit'],
      flags: {
        visited: false,
        terminalActive: true,
      },
    },
    
    archives: {
      id: 'archives',
      name: 'The Archives',
      description: `Rows upon rows of filing cabinets stretch into a darkness that seems almost deliberate. The air is thick with the smell of old paper and forgotten memories. Somewhere in the distance, you hear the soft rustle of pages turning on their own.

The cabinets are labelled with dates that don't quite make sense — some appear to be from the future. One drawer is slightly ajar, labelled "PROJECTS."

The corridor leads back NORTH. You feel like you're being catalogued.`,
      exits: {
        north: 'corridor',
      },
      objects: ['filing_cabinets', 'projects_drawer', 'old_photograph'],
      flags: {
        visited: false,
        drawerOpen: false,
      },
    },
  },
  
  objects: {
    // Office objects
    desk: {
      id: 'desk',
      name: 'cluttered desk',
      aliases: ['table'],
      description: 'A desk that has seen better days, and better organisational systems. Monitors perch precariously atop stacks of books and papers. There\'s a keyboard somewhere under there, presumably.',
      location: 'room:office',
      portable: false,
    },
    sticky_notes: {
      id: 'sticky_notes',
      name: 'sticky notes',
      aliases: ['notes', 'stickies', 'post-its'],
      description: 'Dozens of sticky notes in various colours. Most contain cryptic reminders like "FIX THE THING" and "DON\'T FORGET" without specifying what thing or what not to forget. One simply reads: "HELLO, YOU."',
      location: 'room:office',
      portable: true,
    },
    coffee_mug: {
      id: 'coffee_mug',
      name: 'coffee mug',
      aliases: ['mug', 'cup', 'coffee'],
      description: 'A well-worn mug bearing the legend "World\'s Okayest Developer." It\'s empty, of course. It\'s always empty when you need it most.',
      location: 'room:office',
      portable: true,
    },
    
    // Window objects
    city_view: {
      id: 'city_view',
      name: 'city view',
      aliases: ['city', 'view', 'cityscape'],
      description: 'The city sprawls beneath you in a tapestry of light and shadow. Somewhere out there, people are shipping code, having meetings, and drinking coffee that isn\'t empty. You feel a strange kinship with them all.',
      location: 'room:window',
      portable: false,
    },
    reflection: {
      id: 'reflection',
      name: 'reflection',
      aliases: ['mirror', 'self'],
      description: 'Your reflection stares back at you from the window. It looks like someone who builds things. Someone who takes ideas from the ethereal realm of imagination and wrestles them into existence. Also someone who could probably use more sleep.',
      location: 'room:window',
      portable: false,
    },
    
    // Corridor objects
    fluorescent_light: {
      id: 'fluorescent_light',
      name: 'fluorescent light',
      aliases: ['light', 'lamp'],
      description: 'The fluorescent light flickers occasionally, as if it\'s trying to communicate in some kind of electrical morse code. So far you\'ve deciphered: "I... AM... TIRED... TOO."',
      location: 'room:corridor',
      portable: false,
    },
    
    // Workshop objects
    workbench: {
      id: 'workbench',
      name: 'workbench',
      aliases: ['bench', 'table'],
      description: 'A sturdy workbench covered with the detritus of creation: screws, wires, circuit boards, and what appears to be a half-eaten sandwich from an indeterminate era. Tools hang from pegs on the wall above, arranged with the precision of someone who knows exactly where chaos should go.',
      location: 'room:workshop',
      portable: false,
    },
    brass_telescope: {
      id: 'brass_telescope',
      name: 'brass telescope',
      aliases: ['telescope', 'scope'],
      description: 'An antique brass telescope pointed at the impossible skylight. When you peer through it, you see... yourself, typing at a computer. The view shifts. Now you see yourself reading this description. It\'s telescopes all the way down.',
      location: 'room:workshop',
      portable: false,
    },
    mysterious_device: {
      id: 'mysterious_device',
      name: 'mysterious device',
      aliases: ['device', 'gadget', 'thing'],
      description: 'A peculiar device that defies easy categorisation. It has too many buttons, most of which are unlabelled. One is labelled "DO NOT PRESS" which is, of course, the most tempting button of all. A small screen displays: "READY FOR INPUT."',
      location: 'room:workshop',
      portable: true,
      onUse: 'The device whirs to life, emitting a pleasant chime. The screen displays: "THANK YOU FOR PRESSING BUTTONS. YOUR CURIOSITY HAS BEEN NOTED." Nothing else happens, but you feel slightly accomplished.',
    },
    
    // Server Room objects
    server_racks: {
      id: 'server_racks',
      name: 'server racks',
      aliases: ['servers', 'racks', 'machines'],
      description: 'Towering racks of servers, their LEDs blinking in patterns that seem almost deliberate. The constant hum suggests they\'re thinking about something. Hopefully nothing sinister. Probably just running containers.',
      location: 'room:server_room',
      portable: false,
    },
    terminal: {
      id: 'terminal',
      name: 'glowing terminal',
      aliases: ['computer', 'screen', 'console'],
      description: 'An old terminal with a green phosphor display. The screen shows scrolling logs that seem to be commenting on your adventure in real-time. One line reads: "USER EXAMINED TERMINAL. TYPICAL BEHAVIOUR DETECTED."',
      location: 'room:server_room',
      portable: false,
      onUse: 'You type something on the terminal. It responds: "I see you. I see what you\'re building. Keep going." Encouraging, if slightly unsettling.',
    },
    cooling_unit: {
      id: 'cooling_unit',
      name: 'cooling unit',
      aliases: ['ac', 'cooler', 'hvac'],
      description: 'A massive industrial cooling unit keeping the servers from achieving thermal enlightenment. It roars like a mechanical beast. You imagine it dreams of warmer places.',
      location: 'room:server_room',
      portable: false,
    },
    
    // Archives objects
    filing_cabinets: {
      id: 'filing_cabinets',
      name: 'filing cabinets',
      aliases: ['cabinets', 'files', 'drawers'],
      description: 'Endless rows of filing cabinets containing years of accumulated documentation. The labels are organised in a system that makes perfect sense to someone, presumably. Each drawer you open seems to contain exactly what you weren\'t looking for.',
      location: 'room:archives',
      portable: false,
    },
    projects_drawer: {
      id: 'projects_drawer',
      name: 'projects drawer',
      aliases: ['drawer', 'projects', 'project drawer'],
      description: 'A drawer labelled "PROJECTS" sits slightly ajar. Inside, you find folders with names like "VR Experiments," "Game Prototypes," and "Ideas Too Wild For Production." Each one tells a story of ambition, learning, and the occasional spectacular failure that led to unexpected success.',
      location: 'room:archives',
      portable: false,
      onUse: 'You rifle through the projects drawer. Each folder represents a different adventure, a different challenge overcome. You feel a sense of pride and a renewed urge to build something new.',
    },
    old_photograph: {
      id: 'old_photograph',
      name: 'old photograph',
      aliases: ['photograph', 'photo', 'picture'],
      description: 'A slightly faded photograph tucked between filing cabinets. It shows a team of people celebrating around a desk, confetti in the air. A banner in the background reads "SHIPPED!" The joy in their faces is palpable. Someone has written on the back: "This is what it\'s all about."',
      location: 'room:archives',
      portable: true,
    },
  },
  
  globals: {
    turn: 0,
    gameStarted: false,
    puzzleFlags: {},
  },
});

// Global game state
let gameState = null;

// ================================================
// SYNONYMS AND ALIASES
// ================================================

const VERB_SYNONYMS = {
  // Movement
  'n': 'north', 'north': 'north',
  's': 'south', 'south': 'south',
  'e': 'east', 'east': 'east',
  'w': 'west', 'west': 'west',
  'u': 'up', 'up': 'up',
  'd': 'down', 'down': 'down',
  'go': 'go', 'walk': 'go', 'move': 'go', 'head': 'go',
  'enter': 'go', 'in': 'in', 'out': 'out',
  
  // Observation
  'l': 'look', 'look': 'look', 'examine': 'examine',
  'x': 'examine', 'inspect': 'examine', 'check': 'examine',
  'read': 'read', 'study': 'read',
  
  // Inventory
  'i': 'inventory', 'inv': 'inventory', 'inventory': 'inventory',
  'take': 'take', 'get': 'take', 'grab': 'take', 'pick': 'take',
  'drop': 'drop', 'put': 'drop', 'discard': 'drop',
  
  // Interaction
  'use': 'use', 'activate': 'use', 'press': 'use',
  'open': 'open', 'close': 'close',
  'talk': 'talk', 'speak': 'talk', 'chat': 'talk',
  
  // Meta
  'help': 'help', '?': 'help',
  'about': 'about', 'info': 'about',
  'quit': 'quit', 'exit': 'quit', 'q': 'quit',
  'clear': 'clear', 'cls': 'clear',
  'save': 'save',
  'load': 'load', 'restore': 'load',
};

const DIRECTION_WORDS = ['north', 'south', 'east', 'west', 'up', 'down', 'in', 'out', 'n', 's', 'e', 'w', 'u', 'd'];

const FILLER_WORDS = ['the', 'a', 'an', 'at', 'to', 'with', 'on', 'in', 'into', 'onto', 'from'];

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
  tokens = tokens.filter(t => !FILLER_WORDS.includes(t));
  
  if (tokens.length === 0) {
    return { verb: null, object: null };
  }
  
  // Get the first word as potential verb
  let verbToken = tokens[0];
  let verb = VERB_SYNONYMS[verbToken] || null;
  
  // Handle direction shortcuts (n, s, e, w, etc.)
  if (DIRECTION_WORDS.includes(verbToken)) {
    if (['n', 's', 'e', 'w', 'u', 'd'].includes(verbToken)) {
      verbToken = VERB_SYNONYMS[verbToken];
    }
    return { verb: 'go', object: VERB_SYNONYMS[verbToken] || verbToken };
  }
  
  // Single word command
  if (tokens.length === 1) {
    return { verb: verb, object: null };
  }
  
  // Multi-word: verb + object(s)
  const remaining = tokens.slice(1);
  
  // Check for preposition pattern (use X on Y, put X in Y)
  const prepositions = ['on', 'in', 'with', 'to'];
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
    const object = remaining.slice(0, prepIndex).join(' ');
    const secondObject = remaining.slice(prepIndex + 1).join(' ');
    return { verb, object, preposition, secondObject };
  }
  
  // Simple verb + object
  const object = remaining.join(' ');
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
    if (obj.name.toLowerCase().includes(searchName) || 
        obj.id.toLowerCase() === searchName) {
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
    'n': 'north', 's': 'south', 'e': 'east', 'w': 'west',
    'u': 'up', 'd': 'down'
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
  output.push({ text: room.name, className: 'room-name' });
  
  // Description (shorter on revisits)
  if (shortForm && room.flags.visited) {
    // Just show first sentence for revisits
    const firstSentence = room.description.split('.')[0] + '.';
    output.push({ text: firstSentence });
  } else {
    output.push({ text: room.description });
  }
  
  // List objects in room
  const roomObjects = (room.objects || [])
    .map(id => gameState.objects[id])
    .filter(obj => obj && obj.location === `room:${roomId}`);
  
  if (roomObjects.length > 0) {
    const objNames = roomObjects.map(o => o.name).join(', ');
    output.push({ text: `\nYou can see: ${objNames}.`, className: 'system' });
  }
  
  // List exits
  const exits = Object.keys(room.exits || {});
  if (exits.length > 0) {
    const exitStr = exits.map(e => e.toUpperCase()).join(', ');
    output.push({ text: `Obvious exits: ${exitStr}`, className: 'system' });
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
    'north': 'north', 'n': 'north',
    'south': 'south', 's': 'south',
    'east': 'east', 'e': 'east',
    'west': 'west', 'w': 'west',
  };
  
  if (dirMap[object]) {
    const currentRoom = gameState.rooms[gameState.player.roomId];
    const dir = dirMap[object];
    if (currentRoom.exits && currentRoom.exits[dir]) {
      const nextRoom = gameState.rooms[currentRoom.exits[dir]];
      return `Looking ${dir.toUpperCase()}, you see the way to ${nextRoom.name}.`;
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
  
  const obj = findObject(objectName);
  if (!obj) {
    return `You cannot see any "${objectName}" here. Perhaps it's in another room, or perhaps it never existed.`;
  }
  
  return obj.description;
}

/**
 * Handle INVENTORY command
 */
function handleInventory() {
  const inv = gameState.player.inventory;
  
  if (inv.length === 0) {
    return "You are carrying nothing. Unburdened by material possessions, you feel lighter. Also slightly unprepared.";
  }
  
  const items = inv.map(id => {
    const obj = gameState.objects[id];
    return obj ? obj.name : id;
  }).join(', ');
  
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
  obj.location = 'player';
  
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
 * Handle HELP command
 */
function handleHelp() {
  return `You type words. I try to understand them. We muddle through together.

COMMANDS:
  LOOK (L)         — Describe your surroundings
  EXAMINE X (X X)  — Look closely at something
  INVENTORY (I)    — Check what you're carrying
  TAKE / GET       — Pick something up
  DROP             — Put something down
  USE              — Interact with an object
  READ             — Read text on objects

MOVEMENT:
  NORTH (N), SOUTH (S), EAST (E), WEST (W)
  UP (U), DOWN (D), IN, OUT

META:
  HELP    — You're reading it
  ABOUT   — Learn more about this place
  CLEAR   — Clear the screen
  QUIT    — A polite farewell

Some objects here lead to real content — posts, videos, documentation.
Interact with them and they'll open in new tabs. It's a small world,
but it's got layers.`;
}

/**
 * Handle ABOUT command
 */
function handleAbout() {
  return `ABOUT THIS PLACE

This is a personal website wearing a text adventure costume. Or perhaps
it's a text adventure that happens to contain a personal website. The
distinction blurs.

I'm Diogo. I build things — games, systems, experiments. This place is
a playful way to explore that. Some actions will open real content:
blog posts, documentation, videos. Think of it as navigation through
the medium of curiosity.

The engine is entirely client-side JavaScript. No servers were harmed
in the making of this adventure. The code is probably on GitHub,
because where else would it be?

Type LOOK to continue exploring.`;
}

/**
 * Handle CLEAR command
 */
function handleClear() {
  clearOutput();
  return null; // No output to add
}

/**
 * Handle QUIT command
 */
function handleQuit() {
  return `You consider leaving, but where would you go? The real world
awaits, certainly, with its meetings and deadlines. But you're always
welcome back here. The terminal will remember you.

(Refresh the page to start anew, or simply continue exploring.)`;
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
    case 'go':
      if (!object) return "Go where? A direction would help.";
      return handleMovement(object);
    case 'north': case 'south': case 'east': case 'west':
    case 'up': case 'down': case 'in': case 'out':
      return handleMovement(verb);
    
    // Observation
    case 'look':
      return handleLook(object);
    case 'examine':
      return handleExamine(object);
    case 'read':
      return handleRead(object);
    
    // Inventory
    case 'inventory':
      return handleInventory();
    case 'take':
      return handleTake(object);
    case 'drop':
      return handleDrop(object);
    
    // Interaction
    case 'use':
      return handleUse(object);
    
    // Meta
    case 'help':
      return handleHelp();
    case 'about':
      return handleAbout();
    case 'clear':
      return handleClear();
    case 'quit':
      return handleQuit();
    case 'save':
      saveGame();
      return "Game saved. Your progress is preserved in the browser's memory.";
    case 'load':
      if (loadGame()) {
        return [
          { text: "Game loaded.", className: 'system' },
          ...describeRoom(gameState.player.roomId)
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

const SAVE_KEY = 'neurolink_adventure_save';

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
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
    console.error('Failed to load game:', e);
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
let isShowingTitle = true;

/**
 * Initialise the game UI
 */
function initGame() {
  outputElement = document.getElementById('text-output');
  inputElement = document.getElementById('command-input');
  statusLocationElement = document.getElementById('status-location');
  statusTurnsElement = document.getElementById('status-turns');
  
  // Set up input handler
  if (inputElement) {
    inputElement.addEventListener('keydown', handleInput);
    inputElement.focus();
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
  updateStatus('NEUROLINK-7800', '');
  
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
  const bannerDiv = document.createElement('div');
  bannerDiv.className = 'ascii-banner';
  const bannerLink = document.createElement('a');
  bannerLink.href = 'https://youtube.com/@diogoneves';
  bannerLink.target = '_blank';
  bannerLink.rel = 'noopener noreferrer';
  bannerLink.className = 'youtube-link';
  bannerLink.textContent = banner;
  bannerLink.setAttribute('aria-label', 'Visit Diogo on YouTube');
  bannerDiv.appendChild(bannerLink);
  outputElement.appendChild(bannerDiv);
  
  // System info
  addOutput('');
  addOutput('═══════════════════════════════════════════════════════════════', 'system');
  addOutput('');
  addOutput('NEUROLINK-7800 PERSONAL COMPUTING SYSTEM', 'system');
  addOutput('BIOSYNTHETIC PROCESSOR v3.14.159 | NEURAL-RAM: 640K (SHOULD BE ENOUGH)', 'system');
  addOutput('CONSCIOUSNESS LINK: ACTIVE | REALITY ANCHOR: STABLE', 'system');
  addOutput('');
  addOutput('═══════════════════════════════════════════════════════════════', 'system');
  addOutput('');
  addOutput(`Welcome, traveller. You've found your way to a small corner of the
digital realm — a personal space where ideas take shape and projects
come to life. This is where I build things.`);
  addOutput('');
  addOutput('Feel free to explore. Poke around. Break things (gently).');
  addOutput('The world responds to your curiosity.');
  addOutput('');
  addOutput('Type HELP for commands. Type LOOK to begin.');
  addOutput('');
  
  scrollToBottom();
}

/**
 * Handle keyboard input
 */
function handleInput(event) {
  if (event.key !== 'Enter') return;
  
  const input = inputElement.value.trim();
  if (!input) return;
  
  // Echo user input
  addOutput(input, 'user-input');
  
  // Clear input
  inputElement.value = '';
  
  // If showing title, first command starts the game
  if (isShowingTitle) {
    isShowingTitle = false;
    gameState.globals.gameStarted = true;
    gameState.rooms[gameState.player.roomId].flags.visited = true;
    
    // Check if they typed a command or just pressed enter
    const parsed = parseCommand(input);
    if (parsed.verb === 'help') {
      addOutput(handleHelp());
    } else if (parsed.verb === 'about') {
      addOutput(handleAbout());
    } else {
      // Show starting room
      const roomOutput = describeRoom(gameState.player.roomId);
      addOutput('');
      addOutput('[ INITIATING ADVENTURE SEQUENCE... ]', 'system');
      addOutput('');
      displayOutput(roomOutput);
    }
  } else {
    // Parse and execute command
    const parsed = parseCommand(input);
    const result = executeCommand(parsed);
    
    // Display result
    if (result) {
      addOutput('');
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
    output.forEach(item => {
      if (typeof item === 'object') {
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
function addOutput(text, className = '') {
  const line = document.createElement('div');
  line.className = 'output-line' + (className ? ' ' + className : '');
  line.textContent = text;
  outputElement.appendChild(line);
}

/**
 * Clear the output
 */
function clearOutput() {
  if (outputElement) {
    outputElement.innerHTML = '';
  }
}

/**
 * Scroll output to bottom
 */
function scrollToBottom() {
  if (outputElement) {
    outputElement.scrollTop = outputElement.scrollHeight;
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
      statusLocationElement.textContent = room ? room.name : 'Unknown';
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

document.addEventListener('DOMContentLoaded', initGame);

