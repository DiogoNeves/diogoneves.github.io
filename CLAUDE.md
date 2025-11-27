# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website (diogoneves.github.io) that presents itself as a text-based adventure game. Built with Jekyll and hosted on GitHub Pages, it uses a custom JavaScript game engine to create an interactive terminal experience where users can explore content through commands like LOOK, EXAMINE, and directional navigation.

The project blends a traditional personal website with an interactive fiction interface - blog posts, videos, and documentation are discovered through gameplay rather than traditional navigation.

## Development Commands

### Jekyll Site
```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build site
bundle exec jekyll build

# Serve with drafts
bundle exec jekyll serve --drafts
```

The site will be available at `http://localhost:4000`.

## Architecture

### Content Compilation System

The project uses a unique compilation workflow to convert natural language game content into structured JavaScript:

1. **Source Content** (`content/` directory):
   - `game.txt` - Room definitions, NPCs, objects, and navigation in natural language
   - `help.txt`, `about.txt`, `quit.txt` - System command responses

2. **Game Engine** (`assets/js/game-engine.js`):
   - Self-contained client-side text adventure engine
   - Contains game state, parser, command handlers, and all game logic

3. **Compilation Process** (`compiler/instructions.md`):
   - Defines how to compile `content/` files into `game-engine.js`
   - Creates intermediate JSON representation (`content/intermediate.json`)
   - Converts natural language descriptions into structured game data

### Game Engine Structure

The game engine (`assets/js/game-engine.js`) has these key sections:

- **Game State**: Initial state with rooms, objects, player state, flags
- **Parser**: Command parsing with verb synonyms and natural language handling
- **Command Handlers**: Functions for LOOK, TAKE, USE, EXAMINE, etc.
- **Object Resolution**: Finding objects by name/alias in current context
- **UI Functions**: Terminal rendering, input handling, status bar

### Layouts

- `_layouts/game.html` - CRT monitor terminal interface with retro aesthetic
- `_layouts/default.html` - Standard Jekyll layout (not currently used)
- `_layouts/page.html` - Page wrapper layout
- `_layouts/tag_index.html` - Tag navigation

### Configuration

- `_config.yml` - Jekyll configuration, plugins (jemoji, jekyll-sitemap), site metadata
- `Gemfile` - Ruby dependencies for Jekyll and GitHub Pages

## Narrative Style Guidelines

All game text must follow the guidelines in `thinking/narrative-style.md`:

- **Second person perspective** ("You stand...", "You see...")
- **Slightly British voice**: Dry, witty, self-aware humour
- **Progressive tone shift**: Friendly → mysterious → unhinged as player explores deeper
- **British English spelling** throughout
- **Concise, punchy text** - avoid exposition dumps
- **Gentle teasing** - never mean-spirited

Example: "That's ambitious. The parser, alas, is not."

### Tone Progression
- **Early areas**: Friendly, clear, gently humorous
- **Mid-game**: More mysterious, darker humour, narrator notices oddities
- **Late/hidden areas**: Increasingly unhinged, surreal, existential

Inspirations: The Matrix (Neo's room), Mr Robot (psychotic scenes), Mr. Nobody (existentialism), Control (aesthetic).

## Working with Content

### When Modifying the Game

1. **Understand the current game-engine.js structure** before making changes
2. Edit content files in `content/` directory
3. Follow the compilation instructions in `compiler/instructions.md`
4. Generate intermediate JSON representation if creating new content
5. Copy compiled content into `game-engine.js` (state section only)
6. **Never modify game logic** - only change state, descriptions, NPCs, objects

### Content Files

- `content/game.txt` - Natural language room definitions, connections, objects
- `content/help.txt` - Help command text
- `content/about.txt` - About command text
- `content/quit.txt` - Quit command text
- `content/intermediate.json` - Intermediate compilation output (when compiling)

### Testing the Game

After changes, test by:
1. Running `bundle exec jekyll serve`
2. Opening `http://localhost:4000`
3. Verifying all rooms are accessible via navigation
4. Checking object interactions work correctly
5. Ensuring tone matches the narrative style for that depth level

## Current Branch

Working branch: `text-based-adventure`
Main branch: `master`

## Key Patterns

### Game State Structure
```javascript
{
  player: { roomId, inventory, flags },
  rooms: { id: { name, description, exits, objects, flags } },
  objects: { id: { name, aliases, description, location, portable, onUse } },
  globals: { turn, gameStarted, puzzleFlags }
}
```

### Adding New Rooms
1. Define in `content/game.txt` with natural language
2. Follow narrative style based on depth (surface = friendly, deep = unhinged)
3. Specify exits connecting to other rooms
4. Define visible objects and any NPCs
5. Compile to intermediate JSON
6. Add to game-engine.js state structure

### Adding Objects
Objects can be portable or fixed, and may have:
- `name` - Display name
- `aliases` - Alternative names for parser
- `description` - EXAMINE text
- `location` - "room:roomId" or "player"
- `portable` - Boolean
- `onUse` - Custom response when USE command is invoked
