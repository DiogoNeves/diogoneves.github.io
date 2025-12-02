Your goal is to compile the information in `content/` into the `assets/game-engine.js` code, following the rules and instructions below and the `thinking/narrative-style.md` direction.
The game explores my mind. The information I want to share, but also my insecurities, what I'm proud, unfinished projects, dreams and hopes, psyche and growing old. Some rooms are metaphorical, others are more an area to store content (essays, articles, links).

SKIP THIS FILE IF YOU ARE NOT COMPILING THE CONTENT!

# From this point we will refer to:

- `assets/game-engine.js` as game-engine (case-insensitive).
- `thinking/narrative-style.md` as narrative-style.
- `content/map.txt` as map.

# RULES:

- DO NOT CHANGE THE MAIN LOGIC IN GAME-ENGINE, FOCUS ON CONTENT AND LOGIC RELATED TO THE STATE DEFINED IN THE CONTENT (e.g. in handleUse, handleMovement, and handleTalk and NPCs)!
- Do not change the Title Screen!
- When copying text, try keep the line-breaks and spaces. Each line is an `addOutput` in the game engine.
- You must follow the guide in the narrative-style.
- The user always starts in the room "outside".
- Don't touch game-engine areas that don't need changing!
- The game should play similar to old Zork game
- Don't use the object code names directly, in the narrative, use something more reader friendly!
- Avoid describing the act of entering a place, as some rooms can be entered from different locations. Prefer to describe the area instead, unless it adds value or explicitly mentioned in `game.txt`
- Show, don't tell!
- Don't disclose locations of important objects unless the user explores a bit!!
- DO NOT DISCLOSE the map, use it to understand the spatial navigation only
- NPCs must have single word names for easy access!

# INSTRUCTIONS:

- Follow these in order.
- Understand the structure and needs of the game-engine before copying!
- From the game-engine, only use the structure as inspiration, the content can (and usually will) be completely replaced!
- Warn the user of any issues with the content!
- Each of steps below should be a planned task, it may require sub-tasks too.
- I'm defining the map, navigation, style and vibe of the game, you must convert into high-quality content!
- You will have to implement some logic to map the state changes needed (e.g. in handleUse, handleMovement, and handleTalk) and implement NPC logic if necessary!

## 1. Understand the system

- Follow narrative-style direction closely
- Understand the current game-engine
- Understand the map

## 2. Copy the system commands content

Copy the following files into the respective system command functions, with only minor adjustments to follow the desired style.

- `about.txt` -> `handleAbout`
- `help.txt` -> `handleHelp`
- `quit.txt` -> `handleQuit`

## 3. Compile the main game content

- We're going to be compiling the content in `content/game.txt` file
- The content defines the rooms, some items and general goal and direction and links between rooms
- You are expected to follow the general logic in the game file, but expand on it and make it follow the style direction in the narrative-style!
- Understand the general flow of the game before compiling, so that you can create a coherent game progression
- Understand the map
- Please follow the instructions closely!

1. The user state should always start in the room "outside"
2. Understand the data structure of the state we have to generate, in game-engine
3. Create an intermediate file `content/intermediate.json`, delete the previous one!
4. Compile `content/game.txt` and follow the flow of rooms (see "Compiling files" section below)
5. Iterate through all rooms until the game is complete
6. Copy the `content/intermediate.json` intermediate file into the game-engine code (you might need to do some small tweaks), replacing the existing game-engine state

At the end, the game should be fully functional, complete and fun!
Let me know if I mentioned being able to navigate to an area/room but didn't define it.
WARN ME IF ANY CONTENT WAS SKIPPED!

### Compiling files

You are going to generate the intermediate `content/intermediate.json` file with the new state and related objects generated from compiling `content/game.txt`. Your main job is to create an interesting game and content following my guidance.

- `content/game.txt` includes the list of all rooms in the game, it also hints at important objects and NPCs
- You can create extra objects and NPCs to fill the world a bit, but stick to the defined rooms only!
- DO NOT disclose all the information in each room. Most of the information in the State sections should be hinted at (at most) but require the user to explore!
- I'm defining the map, navigation, style and vibe of the game, you must convert into high-quality content!
- Rooms can define objects which should be converted into their final structure (see game-engine format)
- Rooms must define exits, which will mention a different room
- Everything is defined in natural language with some structure, it's your job to convert into the structured data we expect!
- You must convert the brief descriptions and vibe of the room into the final text, following the narrative-style. THIS IS YOUR MAIN JOB! TO CREATE INTERESTING CONTENT FOLLOWING MY GUIDANCE!
- Commands found in game-engine should output something interesting for each room.
- Rooms can have NPCs and each NPC can have multiple lines. Some are just lists of lines that the game-engine will pick, some are conditional (see `thinking/game-engine.md` and game-engine code)

Room Structure:
Name in the title
General description - explaining the vibe of the room and some of what's visible
State section - any required state to enter the room or potential changes of state
Objects - Objects found in the room (not everything will be visible upfront)
NPCs - Any NPCs that may be in the room
Exits - Where the player can navigate from here

## 4. Polishing

Read through the game-engine result and confirm everything is consistent, interesting and logically works.

- The content in the game-engine follows (and expands upon) the original game.txt content and nothing major is missing
- The state changes defined in the game.txt are mapped into the logic of the game
- The game should be fully playable
- All rooms and objects are accessible
- Make sure the player initial state is valid and in a valid room
- Has followed the "Checklist for Writing" checklist in the narrative-style
- Unless clearly stated (e.g. "door closed"), the player can always navigate back from where they came from
- Make sure the room descriptions aren't disclosing too much upfront, and follow the instructions in `content/game.txt`

## 5. Output to User

Provide a report of:

- what you changed
- how you verified the work.
