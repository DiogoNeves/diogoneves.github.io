Your goal is to compile the information in `content/` into the `assets/game-engine.js` code, following the rules and instructions below and the `thinking/narrative-style.md` direction.

# From this point we will refer to:

- `assets/game-engine.js` as game-engine (case-insensitive).
- `thinking/narrative-style.md` as narrative-style.

# RULES:

- DO NOT CHANGE THE LOGIC IN GAME-ENGINE, ONLY THE CONTENT!
- When copying text, try keep the line-breaks and spaces. Each line is an `addOutput` in the game engine.
- You must follow the guide in the narrative-style.
- The user always starts in the room "outside".
- Don't touch game-engine areas that don't need changing!

# INSTRUCTIONS:

- Follow these in order.
- Understand the structure and needs of the game-engine before copying!
- Warn the user of any issues with the content!
- Each of steps below should be a planned task, it may require sub-tasks too.
- I'm defining the map, navigation, style and vibe of the game, you must convert into high-quality content!

## 1. Understand the system

- Follow narrative-style direction closely
- Understand the current game-engine

## 2. Copy the system commands content

Copy the following files into the respective system command functions, with only minor adjustments to follow the desired style.

- `about.txt` -> `handleAbout`
- `help.txt` -> `handleHelp`
- `quit.txt` -> `handleQuit`

## 3. Compile the main game content

- We're going to be compiling the content in `content/game/` folder
- Each file represents a room (unless stated at the top of the file)
- The content defines the rooms, some items and general goal and direction and links between rooms
- You are expected to follow the general logic in the content files, but expand on it and make it follow the style direction in the narrative-style!
- Please follow the instructions closely!

1. The user state should always start in the room "outside"
2. Understand the data structure of the state we have to generate, in game-engine
3. Create an intermediate file `content/intermediate/game.json`, replace any existing
4. Start compiling from `content/game/outside.txt` and follow any mentioned files there (see "Compiling files" section below)
5. Iterate through all content files until the game is complete
6. Copy the `content/intermediate/game.json` intermediate file into the game-engine code (you might need to do some small tweaks), replacing the existing game-engine state

At the end, the game should be fully functional, complete and fun!
WARN ME IF ANY CONTENT FILES WERE NOT COMPILED!

### Compiling files

For each file, you are going to generate the intermediate `content/intermediate/game.json` content related to that room and related objects or state. Your main job is to create interesting content following my guidance.

- I'm defining the map, navigation, style and vibe of the game, you must convert into high-quality content!
- Rooms can define objects which should be converted into their final structure (see game-engine format)
- Rooms must define exits, which will mention a different file
- Everything is defined in natural language with some structure, it's your job to convert into the structured data we expect!
- You must convert the brief descriptions and vibe of the room into the final text, following the narrative-style. THIS IS YOUR MAIN JOB! TO CREATE INTERESTING CONTENT FOLLOWING MY GUIDANCE!
- Commands found in game-engine should output something interesting for each room.
- Rooms can have NPCs and each NPC can have multiple lines. Some are just lists of lines that the game-engine will pick, some are conditional (see `thinking/game-engine.md` and game-engine code)

## 4. Polishing

Read through the game-engine result and confirm everything is consistent, interesting and logically works.

- The game should be fully playable
- All rooms and objects are accessible

## 5. Output to User

Provide a report of:

- what you changed
- how you verified the work.
