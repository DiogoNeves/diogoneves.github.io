# Game Engine Design

## Overview

A state machine-based text adventure engine that runs entirely client-side. The engine uses a single global `gameState` object to track all game state, with text-based input/output.

---

## High Level Engine Loop

### 1. Initialisation

Initialise a global `gameState` object containing:

- Player state
- Room definitions
- Object definitions
- Global flags and turn counter

### 2. On Page Load

- Set initial `gameState`
- Render the current room description and visible objects

### 3. On Each User Command

- Read text from input, parse it into `[verb, object, maybe second object]`
- Update `gameState` based on the command
- Print the result text and, if movement happened, the new room description
- Increment the turn counter
- Optionally save `gameState` to localStorage

### 4. Repeat

Repeat until the user quits or reloads

---

## Core Data Structure

Use a single `gameState` object that holds everything about the current playthrough.

### Example Structure (shape, not exact code)

```javascript
const gameState = {
  player: {
    roomId: "west_of_house",
    inventory: ["lamp", "leaflet"],
    flags: {
      hasLight: false,
    },
  },

  rooms: {
    west_of_house: {
      id: "west_of_house",
      name: "West of House",
      description: "You are standing in an open field west of a white house...",
      exits: {
        north: "north_of_house",
        south: "south_of_house",
        east: "front_of_house",
      },
      objects: ["mailbox"],
      flags: {
        visited: false,
        dark: false,
      },
    },
    // more rooms...
  },

  objects: {
    lamp: {
      id: "lamp",
      name: "brass lamp",
      description: "A slightly tarnished brass lamp.",
      location: "player", // "player", "room:west_of_house", or "inside:mailbox"
      portable: true,
      state: {
        isOn: false,
      },
    },

    mailbox: {
      id: "mailbox",
      name: "small mailbox",
      description: "A small mailbox here.",
      location: "room:west_of_house",
      portable: false,
      container: {
        isContainer: true,
        isOpen: false,
        locked: false,
        contents: ["leaflet"],
      },
    },

    leaflet: {
      id: "leaflet",
      name: "leaflet",
      description: "A leaflet with some writing on it.",
      location: "inside:mailbox",
      portable: true,
    },
    // more objects...
  },

  globals: {
    turn: 0,
    puzzleFlags: {
      cellarUnlocked: false,
      secretDoorOpen: false,
    },
  },
};
```

---

## Conventions

### Player State

- `player.roomId` must always be a valid key from `rooms`

### Object Location

Object `location` can be:

- `"player"` for inventory
- `"room:<roomId>"` for objects lying in a room
- `"inside:<objectId>"` for items inside a container object

### Room Structure

Each room has:

- `name` and `description` (string)
- `exits` mapping directions to other room IDs
  - Directions: `"north"`, `"south"`, `"east"`, `"west"`, `"up"`, `"down"`, `"in"`, `"out"`
- `objects` array listing object IDs that start in that room

### Flags

- Flags are simple booleans in `flags` and `puzzleFlags` for tracking puzzle state
- Room-specific flags go in `rooms[roomId].flags`
- Object-specific state goes in `objects[objectId].state`
- Global puzzle flags go in `globals.puzzleFlags`

---

## Core Commands

Keep the parser very simple. Aim for `verb + optional noun`.

### Movement

- `"north"`, `"south"`, `"east"`, `"west"` (and shortcuts `"n"`, `"s"`, `"e"`, `"w"`)
- `"up"`, `"down"`, `"in"`, `"out"`
- **Behaviour**:
  - When a movement is valid, update `player.roomId` and print the new room description
  - When invalid, print a simple message like `"You cannot go that way."`

### Basic Interaction

- `"look"` (or `"l"`):
  - Reprint the room name, description, visible objects, and obvious exits
- `"inventory"` (or `"i"`):
  - List items in `player.inventory`

### Object Interaction

- `"take <object>"` or `"get <object>"`:
  - Check if object is in the current room or inside an open container in the current room
  - If portable, move it to `player.inventory`
- `"drop <object>"`:
  - Move item from `player.inventory` to the current room
- `"open <object>"`:
  - If it is a container or door and not locked, set `isOpen` to true
- `"close <object>"`:
  - Similarly, set `isOpen` to false
- `"examine <object>"` or `"x <object>"`:
  - Print the object description, plus anything special (for containers, list contents if open)

---

## Parser Design

A lightweight, forgiving text parser similar to classic interactive fiction. The parser is designed to be extensible for future enhancements.

### Command Grammar

Accept commands as:

- **Single word**: `"LOOK"`, `"NORTH"`, `"HELP"`
- **Verb plus object**: `"EXAMINE SIGN"`, `"READ NOTE"`
- **Verb plus object plus preposition plus object**: `"USE KEY ON DOOR"`

### Parsing Rules

- **Case-insensitive**: All commands are processed regardless of case
- **Ignore filler words**: Strip out common filler words where appropriate:
  - Articles: `"the"`, `"a"`, `"an"`
  - Prepositions (when not part of command structure): `"at"`, `"to"`, `"on"`
- **Support abbreviations and synonyms**: Defined in `world.json.synonyms` (or equivalent configuration)

### Core Verbs

Implement at least the following verbs (with aliases handled via synonyms):

#### Navigation

- **GO <direction>**: Move in a direction
  - Cardinal: `N`, `S`, `E`, `W` (and full words `NORTH`, `SOUTH`, `EAST`, `WEST`)
  - Intercardinal: `NE`, `NW`, `SE`, `SW` (if supported)
  - Vertical: `UP`, `DOWN`
  - Other: `IN`, `OUT`
- **GO <place>** or **ENTER <place>**: Move to a named location where exits or named exits permit

#### Observation

- **LOOK** (aliases: `L`): Describe current room (full description)
- **LOOK <direction>** (optional): Directional glance to see what's in that direction without moving
- **EXAMINE <object>** (aliases: `INSPECT`, `CHECK`, `LOOK AT`): Get detailed description of an object

#### Inventory

- **INVENTORY** (aliases: `I`): List carried items
- **TAKE <object>** (aliases: `GET`, `PICK UP`): Pick up portable objects
- **DROP <object>**: Drop an item in the current room

#### Interaction

- **READ <object>**: Read notes, signs, documents, posts
- **USE <object> [ON <object>]**: Generic interaction; behaviour defined by `onUse` handler
- **TALK TO <character>** (aliases: `TALK`, `SPEAK`, `CHAT`): Interact with characters

#### Meta

- **HELP**: Show help text
- **ABOUT**: Show meta information about the game or site
- **QUIT** or **EXIT**: Print a friendly message (no need to truly exit)

### Resolution Rules

Parse input into:

- **Canonical verb**: Normalised verb after synonym resolution
- **Primary object token** (if present): First object mentioned in command
- **Secondary object token** (if present): Second object mentioned in command (e.g., "USE KEY ON DOOR")

When resolving an object:

- Match against:
  - Objects in current room
  - Items in inventory
- Use aliases defined in object definitions
- Handle multi-word object names (e.g., "brass lamp" should match even if user types "lamp")

When multiple matches exist:

- Ask the player to clarify, or
- Pick the most reasonable match and mention it in the response

Respect contextual rules from `world.json` (or equivalent):

- Exits defined in the current room
- `isPortable` for TAKE and DROP commands
- Locked or flagged behaviour defined by object flags and scripted actions

### Parser Error Handling

Error messages should match the narrative style (see narrative style section for tone):

- **Unknown verb**: Produce an "unknown command" style message
- **Unknown or absent object**: Produce a message like `"You cannot see that here."`
- **Syntactically valid but unsupported action in context**: Produce a gentle refusal message

### Optional Features

- **LOOK <direction>**: Support directional glance if useful (e.g., "LOOK NORTH" to see what's in that direction without moving)

### Parser Implementation Notes

- Parse input into structured format: `{ verb, object, preposition, secondObject }`
- Normalise verbs using synonym mapping before processing
- Match objects using fuzzy matching or exact matching against object names/aliases
- Handle multi-word object names (e.g., "brass lamp" should match even if user types "lamp")
- Future extensibility: Parser structure should allow for:
  - Additional verb categories
  - Custom command handlers
  - Context-sensitive commands
  - Command history and undo functionality

---

## Error Handling

- **Unrecognised verb**: `"I do not understand that."`
- **Object not visible**: `"You do not see that here."`
- **No death or health system**: Instead of killing the player, either:
  - Block the action: `"That seems too dangerous right now."`
  - Or move them back: `"You stumble and find yourself back where you started."`

---

## User Interface Behaviour

- **Text only**
- **At each step**:
  - Show the result of the last command
  - If the player moved or typed `"look"`, show room name, description (optionally shorter on revisits), visible objects, exits
  - Then show a simple prompt like `"> "` and wait for input
- Keep the experience snappy and readable

---

## State Keeping and Persistence

### Mutable Data

- All mutable data lives in the global `gameState` object
- The engine never modifies the room and object definitions directly to store base data
- Instead:
  - Use `gameState.rooms[roomId].flags` for room-specific changes over time
  - Use `gameState.objects[objectId].state` for object-specific changes over time

### Optional Save/Load

- On each command, serialise `gameState` to JSON and store it in `localStorage["my_text_adventure_state"]`
- On page load, try to read and parse that key
- If present and valid, use it as the current state
- Otherwise, initialise a new `gameState`

---

## Constraints

### Code Organisation

- Keep everything in one JS file:
  - `gameState` definition
  - Functions to handle parsing, movement, object interaction, and rendering
  - Event handlers for the text input

### Design Philosophy

- Keep the design simple and readable
- Fewer features are better than a complex system
- No combat, no hit points, no death
- The challenge should feel like exploring a maze and solving simple item puzzles

---

## Implementation Notes

### Parser Implementation

- Parse commands into structured format (verb, object, preposition, secondObject)
- Normalise verbs using synonym mapping
- Match objects using fuzzy/exact matching against names and aliases
- Handle multi-word object names
- See "Parser Design" section above for detailed specifications

### State Updates

- Always validate before updating state
- Check object visibility before allowing interaction
- Check room exits before allowing movement
- Update turn counter after successful commands

### Rendering

- Format text output for readability
- Show room descriptions clearly
- List visible objects and exits
- Keep prompt consistent
