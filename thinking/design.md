# Text Adventure Game Design

## Overview
A Zork-style text adventure game rendered inside a virtual CRT monitor interface, integrated into a personal website hosted on GitHub Pages. The game engine, parser, and UI are entirely client-side and work in a static hosting environment.

## Goal
Render the game inside a virtual CRT monitor that frames the adventure and feels like an old monochrome terminal, while remaining usable and accessible.

---

## MANDATORY Requirements

### Layout

- **CRT Monitor Container**
  - Render the game inside a centred "CRT monitor" container
  - Outside the monitor: dark background (near-black) with a faint bedroom wall effect
  - Inside the monitor: black screen with green monochrome text
  - Show visible bezel/edges of the monitor so it feels like a physical device

- **Monitor Components**
  - A scrollable text viewport for output
  - A persistent input line at the bottom for commands
  - An optional small status bar (for example current room name) within the monitor

### CRT Effects

- Apply subtle CRT effects:
  - Slight curvature of the content area
  - Gentle scanlines
  - Soft glow

### Responsiveness & Accessibility

- **Scaling**
  - Ensure the monitor scales sensibly on different screen sizes
  - Stretch as wide or tall as possible while keeping the ratio

- **Typography**
  - Use a monospace font
  - Readable sizes with good line spacing
  - Ensure high contrast for text

- **Keyboard Accessibility**
  - All controls (banner link, CRT toggle, links from posts) must be keyboard accessible
  - Focusable and activatable with Enter or Space

---

## Title / Front Screen

### Initial Load Display

On initial load, display a title screen within the CRT:

- **Banner**
  - A large ASCII-style banner block reading "DIOGO IS BUILDING ON YOUTUBE"
  - The word "YOUTUBE" must clearly act as a clickable link to Diogo's YouTube channel
  - URL: `https://youtube.com/@diogoneves`
  - On hover or keyboard focus: change style subtly (for example intensity or outline) to indicate interactivity

- **Content Below Banner**
  - Pretend system info for a fictional retro brain/organic based hardware
  - A short introductory paragraph (placeholder text, editable later)
  - Instructions such as:
    - "Type HELP for instructions."
    - "Type LOOK to begin."

### Starting the Game

- Pressing Enter or typing a valid command from the title screen must initialise game state and display the starting room
- Automatically focus the input line after load and after each command

---

## Technical Considerations

### Game Engine Architecture
- **Parser**: Client-side command parser (likely regex-based or simple tokenizer)
- **Game State**: JavaScript object/class managing rooms, inventory, flags
- **UI Layer**: DOM manipulation for rendering text output and handling input
- **Persistence**: Consider localStorage for save states (optional)

### Implementation Notes
- All game content (rooms, items, commands) must be embedded in JavaScript or loaded as JSON
- No external API calls required
- Must work offline after initial page load
- Consider modular structure for easy expansion

### File Structure (Proposed)
```
/assets/
  /js/
    game-engine.js      # Core game logic
    parser.js           # Command parser
    rooms.js            # Room definitions
    items.js            # Item definitions
  /css/
    crt-monitor.css     # CRT monitor styling
    game-ui.css         # Game UI styling
  /fonts/
    monospace-font.woff # Monospace font for terminal feel
```

