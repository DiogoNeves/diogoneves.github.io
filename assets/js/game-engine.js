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
      knowsTheFuture: false,
      foundQuarter: false,
    },
  },

  rooms: {
    outside: {
      id: "outside",
      name: "Outside the Shopfront",
      description:
        "You stand on damp pavement facing a narrow tech shop. Retro kit crowds the fogged glass, LEDs blinking like polite fireflies beneath a twitching neon sign you can't quite read. The air tastes of rain and solder; somewhere a storm rehearses its entrance.\n\nA faint glint lurks near the threshold. Across the road a warm HOUSE window glows; to the east the SHOP door creaks; the TRAIN station sign looms up the street; the COAST breathes salt behind you.",
      exits: {
        east: "store",
        in: "store",
        store: "store",
        shop: "store",
        inside: "store",
        west: "home",
        home: "home",
        house: "home",
        street: "home",
        north: "train_station",
        train: "train_station",
        station: "train_station",
        south: "coast_line",
        coast: "coast_line",
      },
      objects: ["quarter", "neon_sign", "storefront_window"],
      npcs: ["friendly_lookout"],
      flags: {
        visited: false,
        stormWarningGiven: false,
      },
    },

    store: {
      id: "store",
      name: "Tech Shop",
      description:
        "You slip inside; the hush rings louder than any door chime. Shelves of prepaid AI access cards stand to attention, promising borrowed brilliance. Piles of personal AI boxes squat mid-aisle, abandoned mid-restock. One wears a post-it that flaps like a prophecy; another box is plastered with a printed dare.\n\nThe counter faces you, a brass bell guarding a heavy door with a tired keyhole. Left the aisles tilt towards old GAMES; right the tripods and edit bays wait in CONTENT.",
      exits: {
        out: "outside",
        outside: "outside",
        exit: "outside",
        west: "store_games",
        left: "store_games",
        games: "store_games",
        east: "store_content",
        right: "store_content",
        content: "store_content",
        back: "backrooms_entry",
        counter: "backrooms_entry",
        door: "backrooms_entry",
      },
      objects: [
        "ai_gift_cards",
        "personal_ai_box",
        "postit_future",
        "ai_box_warning",
        "counter_bell",
        "backroom_door",
      ],
      flags: {
        visited: false,
        backdoorUnlocked: false,
      },
    },

    store_content: {
      id: "store_content",
      name: "Content Studio Corner",
      description:
        "Tripods and ring lights form a polite thicket around a long editing desk. Coffee rings stencil circles on notes about scripts, devlogs, and some video no one quite feels ready to release. USB drives spill from a ceramic bowl like sweets. A half-packed camera bag lies open, clearly meant to be returned to.\n\nThe hum from the shop floor drifts in, mingling with a paused video frame mid-wave crash.",
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
      description:
        "This side of the shop smells of cardboard ink and childhood. Posters for Tomb Raider, Final Fantasy VII, Crash Bandicoot, and MediEvil curl proudly on the wall. A towering LittleBigPlanet standee grins in bold colour, BAFTA laurels stamped like a boast. Stacks of copies spill across the shelf as if someone refused to choose a favourite.\n\nOne battered LittleBigPlanet box has been turned around, a handwritten note visible through cracked plastic.",
      exits: {
        back: "store",
        east: "store",
        right: "store",
        out: "store",
      },
      objects: ["nostalgia_posters", "lbp_standee", "lbp_box", "backdoor_key_1", "demo_kiosk"],
      flags: {
        visited: false,
      },
    },

    backrooms_entry: {
      id: "backrooms_entry",
      name: "Backrooms Entrance",
      description:
        "The air thickens into ozone and dust. Metal shelves cling to the walls, half-filled with cables and prototypes that never met daylight. A whiteboard loops arrows between deadlines and dreams, fingerprints smudged where doubt lingered. Ahead a sealed stairwell leads deeper, a padlock watching for the right keycard.\n\nFor now the SHOP waits back the way you came.",
      exits: {
        back: "store",
        out: "store",
        shop: "store",
        down: "backrooms_deep",
        forward: "backrooms_deep",
      },
      objects: ["server_rack", "whiteboard_map", "sealed_stairs"],
      flags: {
        visited: false,
        sealed: true,
      },
    },

    backrooms_deep: {
      id: "backrooms_deep",
      name: "Backrooms – Deep Down",
      description:
        "Concrete closes in and the lights flicker with a rhythm that might be Morse or might be your pulse. The door back up sits bolted, as if testing whether you brought an odd little coin. Condensation drips in time with distant machinery; the air tastes of static and old secrets.\n\nAn opening yawns toward a low TUNNEL where the storm mutters under its breath.",
      exits: {
        up: "backrooms_entry",
        back: "backrooms_entry",
        west: "backrooms_entry",
        tunnel: "tunnel",
        east: "tunnel",
        forward: "tunnel",
      },
      objects: [],
      flags: {
        visited: false,
        requiresQuarter: true,
      },
    },

    home: {
      id: "home",
      name: "Home",
      description:
        "A small home that feels lived-in rather than staged. Shoes gather by the door in hopeful pairs. Children's drawings and family photos climb the hallway, documenting a move from Portugal to the UK and onward into chaos. In the lounge a TV plays silly music while UNO cards scatter under small hands.\n\nThe warmth presses gently against the storm outside. The STREET leads back, and a door toward the OFFICE stands ajar.",
      exits: {
        east: "outside",
        out: "outside",
        street: "outside",
        outside: "outside",
        north: "home_office",
        office: "home_office",
        up: "home_office",
      },
      objects: [],
      npcs: ["sofia", "lilah", "olivia"],
      flags: {
        visited: false,
      },
    },

    home_office: {
      id: "home_office",
      name: "Home Office",
      description:
        "A small, messy home office humming with ambition. Coding and sci-fi books lean on shelves beside tangled VR headsets. A wide monitor glows with half-written code; headphones rest like a coiled thought. In the corner a tripod-mounted camera tracks the room, red light recording. A metal trapdoor crouches beneath it, daring you to pry it open.",
      exits: {
        south: "home",
        back: "home",
        out: "home",
        down: "tunnel",
        trapdoor: "tunnel",
      },
      objects: ["monitor_notes", "tracking_camera", "trapdoor_plate"],
      flags: {
        visited: false,
      },
    },

    tunnel: {
      id: "tunnel",
      name: "The Tunnel",
      description:
        "The temperature drops as sound stretches thin. Concrete walls sweat and the corridor seems to breathe in time with you. A trapdoor above has already clanged shut, offended by your arrival. Rusted pipes whisper, and a floor watch ticks at triple speed. The air smells like old storms rehearsed over and over.",
      exits: {
        west: "backrooms_deep",
      },
      objects: ["fast_watch", "sealed_trapdoor"],
      npcs: ["past_paranoid", "future_paranoid", "lost_wanderer", "compilation_paranoid"],
      flags: {
        visited: false,
      },
    },

    train_station: {
      id: "train_station",
      name: "Train Station",
      description:
        "A small, clean platform stretches further than physics promised. The display insists the next train is delayed, ETA: UNKNOWN. A poster of a Portugal-to-UK route peels at the edges, someone having scribbled over it. The air holds the soft hiss of a train that may never arrive.",
      exits: {
        south: "outside",
        back: "outside",
        out: "outside",
        street: "outside",
      },
      objects: ["poster_ad", "memory_notebook", "coffee_cup"],
      npcs: ["coffee_vendor"],
      flags: {
        visited: false,
      },
    },

    coast_line: {
      id: "coast_line",
      name: "Coast Line",
      description:
        "A ragged coastline unfurls before you. Waves hammer the rocks with patient fury, spray mixing with fog. A blurry red flash pulses from an unseen lighthouse across the water. Wind builds and tastes of salt and static, as if the ocean is tuning a radio.\n\nA bottle lies near the bench. Two figures watch the horizon in stubborn silence.",
      exits: {
        north: "outside",
        back: "outside",
        out: "outside",
        street: "outside",
      },
      objects: ["message_bottle"],
      npcs: ["restless_twin", "cautious_twin"],
      flags: {
        visited: false,
      },
    },
  },

  objects: {
    quarter: {
      id: "quarter",
      name: "tarnished quarter",
      aliases: ["quarter", "coin", "money"],
      description:
        "A tarnished quarter from 1984, edges smoothed by anxious flipping. Someone scratched D.N. into the metal. It's warmer than it ought to be, as if memory keeps its own heat.",
      location: "room:outside",
      portable: true,
      onUse:
        "You flip the quarter. The neon catches it mid-spin, scattering tiny constellations over your palm. It lands with a polite clink that sounds like the start of something.",
    },
    neon_sign: {
      id: "neon_sign",
      name: "flickering neon sign",
      aliases: ["neon", "sign", "lights"],
      description:
        "Up close the flicker sharpens into letters: METAPHORA. The tubes buzz like thoughts trying to finish themselves, the M faltering as if it wants to become a metaphor for everything else.",
      location: "room:outside",
      portable: false,
    },
    storefront_window: {
      id: "storefront_window",
      name: "storefront window",
      aliases: ["window", "display", "retro tech"],
      description:
        "Walkmen, pagers, consoles, and homebrew boards crowd the glass. A camcorder's tiny screen loops a clip of someone soldering at 3am while the rain blurs the edges.",
      location: "room:outside",
      portable: false,
    },
    ai_gift_cards: {
      id: "ai_gift_cards",
      name: "AI access cards",
      aliases: ["cards", "gift cards", "codes", "models"],
      description:
        "Plastic gift cards promise minutes with distant minds. Each one has a scribbled note about latency, capability, and which models make the best company at 2am.",
      location: "room:store",
      portable: false,
    },
    personal_ai_box: {
      id: "personal_ai_box",
      name: "personal AI box",
      aliases: ["ai box", "box", "personal box"],
      description:
        "Cardboard towers of personal AI units lean like they're gossiping. Shipping labels mark destinations that never happened. A flap hangs open, begging to be peered into.",
      location: "room:store",
      portable: false,
      onUse:
        "You peer into the box. The wiring diagram looks suspiciously like a branching timeline. For a heartbeat you feel you know how the storm ends. The feeling lingers like static.",
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
        "One box is stamped: 'Don't use at your own risk!' The double negative makes it either a dare or a plea.",
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
        "You ping the bell. The ring stretches into the shelves and fades. No clerk appears, unless you count the server hum perking up.",
    },
    backroom_door: {
      id: "backroom_door",
      name: "backroom door",
      aliases: ["door", "backdoor", "counter door"],
      description:
        "A heavy door hides behind the counter, paint chipped by impatient hands. The keyhole peers back with faint judgement.",
      location: "room:store",
      portable: false,
      onUse: "The handle refuses to budge without BACKDOOR-KEY-1. It makes a disappointed little click.",
    },
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
        "Printed frames with sketches and arrows spread across the table. Margins are full of reminders: 'ship before the storm', 'be kinder on camera', 'remember why'.",
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
    nostalgia_posters: {
      id: "nostalgia_posters",
      name: "retro posters",
      aliases: ["posters", "wall art", "games"],
      description:
        "Sun-faded posters for Tomb Raider, Final Fantasy VII, Crash Bandicoot, and MediEvil cling to the wall. Each caption promises a world that once felt infinite.",
      location: "room:store_games",
      portable: false,
    },
    lbp_standee: {
      id: "lbp_standee",
      name: "LittleBigPlanet standee",
      aliases: ["standee", "little big planet", "lbp"],
      description:
        "A large cardboard Sackboy beams in bold colour. A BAFTA badge sits on the corner, proud and slightly peeled. A sticker tucked under its foot reads 'build loudly / truthfully'.",
      location: "room:store_games",
      portable: false,
    },
    lbp_box: {
      id: "lbp_box",
      name: "battered LittleBigPlanet box",
      aliases: ["box", "lbp game", "little big planet box"],
      description:
        "The cracked case has been turned backwards. Scrawled on the plastic: 'once a masterpiece, left in the few who remember'. When you tilt it, the faded insert whispers about co-creation and play.",
      location: "room:store_games",
      portable: false,
    },
    backdoor_key_1: {
      id: "backdoor_key_1",
      name: "BACKDOOR-KEY-1",
      aliases: ["key", "keycard", "backdoor key"],
      description:
        "A plastic keycard on a frayed lanyard. Someone scribbled 'backrooms' on the back in marker. It smells faintly of popcorn and old carpet, as if it spent too long beside arcade machines.",
      location: "room:store_games",
      portable: true,
      onUse: "You thumb the keycard. Somewhere a lock seems to remember your shape.",
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
        "You tap start. The screen flickers, briefly showing a line: 'BACKDOOR-KEY-1 likes to hide behind the cardboard hero.' Then it pretends nothing happened.",
    },
    server_rack: {
      id: "server_rack",
      name: "server rack",
      aliases: ["servers", "rack", "tower"],
      description:
        "A stack of humming machines exhales warm air. LEDs blink like a heartbeat practising mindfulness. A sticker reads: 'prototype builds / mind palace'.",
      location: "room:backrooms_entry",
      portable: false,
    },
    whiteboard_map: {
      id: "whiteboard_map",
      name: "whiteboard of arrows",
      aliases: ["whiteboard", "map", "plan"],
      description:
        "Arrows connect bubbles labelled 'family', 'work', 'storm', 'videos', 'rest'. Some loops dead-end in smudges. Someone wrote 'remember to sleep' in the corner, underlined twice, then circled for luck.",
      location: "room:backrooms_entry",
      portable: false,
    },
    sealed_stairs: {
      id: "sealed_stairs",
      name: "sealed stairwell",
      aliases: ["stairs", "stairwell", "padlock"],
      description:
        "A metal stairwell drops into shadow, chained and padlocked. Dust outlines the shape of keys that visited in the past.",
      location: "room:backrooms_entry",
      portable: false,
      onUse:
        "You tug the chain. It rattles and waits for BACKDOOR-KEY-1 with the patience of bureaucracy.",
    },
    monitor_notes: {
      id: "monitor_notes",
      name: "monitor and notes",
      aliases: ["monitor", "notes", "desk"],
      description:
        "The wide monitor shows code paused mid-thought. Sticky notes around it read: 'ship something small', 'call mum', 'remember the storm is weather, not fate'.",
      location: "room:home_office",
      portable: false,
    },
    tracking_camera: {
      id: "tracking_camera",
      name: "tracking camera",
      aliases: ["camera", "tripod", "recorder"],
      description:
        "A tripod-mounted camera turns with your movement, red light quietly accusing. Its tiny screen shows a loop of you entering, then entering again.",
      location: "room:home_office",
      portable: false,
    },
    trapdoor_plate: {
      id: "trapdoor_plate",
      name: "trapdoor plate",
      aliases: ["trapdoor", "hatch", "floor plate"],
      description:
        "A square metal plate set into the floor. A faint draft seeps around its edges, smelling of damp concrete and secrets.",
      location: "room:home_office",
      portable: false,
    },
    fast_watch: {
      id: "fast_watch",
      name: "hurrying watch",
      aliases: ["watch", "clock", "timepiece"],
      description:
        "A wristwatch ticks at triple speed, hands stuttering forward like they're late for something. The crystal fogs as if breathing.",
      location: "room:tunnel",
      portable: true,
      onUse:
        "You listen to the frantic ticking. For a moment the corridor seems to speed up with it before settling back into its slow exhale.",
    },
    sealed_trapdoor: {
      id: "sealed_trapdoor",
      name: "sealed trapdoor",
      aliases: ["trapdoor", "hatch", "ceiling hatch"],
      description:
        "The trapdoor above is locked from the other side. Scrape marks show where others have tried. It drips now and then, as if the ceiling is thinking.",
      location: "room:tunnel",
      portable: false,
    },
    poster_ad: {
      id: "poster_ad",
      name: "faded travel poster",
      aliases: ["poster", "ad", "advert"],
      description:
        "An old advert charts a route from Portugal to the UK. Marker scribbles across the top declare: 'You do not understand what you're leaving behind!'.",
      location: "room:train_station",
      portable: false,
    },
    memory_notebook: {
      id: "memory_notebook",
      name: "notebook titled 'All the memories that weren't'",
      aliases: ["notebook", "journal", "book"],
      description:
        "A small notebook lies open. The first page reads: 'You can feel nostalgic for stuff that never happened!' Pages afterwards are blank, inviting you to improvise history.",
      location: "room:train_station",
      portable: true,
    },
    coffee_cup: {
      id: "coffee_cup",
      name: "paper cup of coffee",
      aliases: ["coffee", "cup", "drink"],
      description:
        "A steaming coffee offered freely. It smells like burnt beans and small kindnesses.",
      location: "room:train_station",
      portable: true,
      onUse:
        "You sip the coffee. Warmth steadies your hands; the tannoy coughs approvingly.",
    },
    message_bottle: {
      id: "message_bottle",
      name: "bottle with a note",
      aliases: ["bottle", "message", "note"],
      description:
        "A clear bottle rests on the rocks. Inside, a rolled scrap of paper waits. The ink has bled slightly, salt pulling at the letters.",
      location: "room:coast_line",
      portable: true,
      onUse:
        "You uncork the bottle and slide out the note. It reads: 'From a life not yet lived. The grass did look greener!'. The bottle hums faintly after you roll the note back in.",
    },
  },

  npcs: {
    friendly_lookout: {
      id: "friendly_lookout",
      name: "friendly lookout",
      aliases: ["stranger", "lookout", "person"],
      location: "room:outside",
      description:
        "A person in a weatherproof jacket leans against the storefront, grin weathered and eyes skyward. They watch the clouds like a sailor reading waves.",
      dialogue: [
        "Lovely evening, if you ignore the rehearsal overhead. Strange things keep happening in town—delightful if you like mysteries.",
        "Storm's coming. Pick your shelter: safe, daring, or both. The shop's got layers if you fancy poking them.",
        "You look like someone who builds things. Creative chaos in the eyes. Respect.",
        "That glint near the door? Pigeons have no use for luck. You might.",
        "If the neon ever holds still, it says METAPHORA. Suits the mood, doesn't it?",
      ],
    },
    sofia: {
      id: "sofia",
      name: "Sofia",
      aliases: ["woman", "partner", "sofia"],
      location: "room:home",
      description:
        "Sofia sits cross-legged on the rug, UNO cards in hand, laughter in reserve. A suitcase half-packed peeks from behind the sofa.",
      dialogue: [
        "Fancy a round? Loser makes the next coffee. Winner gets bragging rights all the way to Portugal.",
        "We're packing in our heads already—Lisbon sun, family hugs, the whole thing. Don't forget to enjoy the now, though.",
        "The girls keep stacking Draw Fours like it's strategy. I'm not convinced, but it's adorable.",
      ],
    },
    lilah: {
      id: "lilah",
      name: "Lilah",
      aliases: ["girl", "child", "lilah"],
      location: "room:home",
      description:
        "Lilah fans UNO cards dramatically, trying to keep a straight face. Her nails are painted in mismatched colours, a secret code only she knows.",
      dialogue: [
        "If you go to Portugal without me, take my best card. Actually no, take two.",
        "I'm going to win this game and then the next one on the plane.",
        "Do you think the sea there smells like this room when it's raining?",
      ],
    },
    olivia: {
      id: "olivia",
      name: "Olivia",
      aliases: ["girl", "child", "olivia"],
      location: "room:home",
      description:
        "Olivia lies on her stomach, giggling at her own UNO puns. She keeps glancing at a toy suitcase with stickers half-peeled.",
      dialogue: [
        "When we get to Portugal I'm teaching the cousins this game. They'll never see it coming.",
        "Uno means one. I have two snacks. That's strategy.",
        "The storm outside sounds like the train in my head. Choo-choo dramatic!",
      ],
    },
    past_paranoid: {
      id: "past_paranoid",
      name: "murmuring figure",
      aliases: ["figure", "past", "murmurer"],
      location: "room:tunnel",
      description:
        "A hunched figure traces shapes on the damp wall, muttering dates backwards.",
      dialogue: [
        "Did we leave something unfinished back there? Everything echoes if you listen long enough.",
        "Memories rearrange themselves when no one's looking. I keep trying to pin them down.",
        "The past is behind us, which is unfortunate because I can only walk forward.",
      ],
    },
    future_paranoid: {
      id: "future_paranoid",
      name: "wide-eyed figure",
      aliases: ["figure", "future", "wide-eyed"],
      location: "room:tunnel",
      description:
        "A figure clings to the wall, eyes darting as if trying to see tomorrow through concrete.",
      dialogue: [
        "You've seen it, haven't you? The boxes upstairs—the future humming inside them?",
        "If you know how this ends, whisper it. I'll trade you my last certainty.",
        "What if the storm is just the compile finishing?",
      ],
    },
    lost_wanderer: {
      id: "lost_wanderer",
      name: "bewildered wanderer",
      aliases: ["wanderer", "lost", "traveller"],
      location: "room:tunnel",
      description:
        "A person in office clothes stares at their shoes as if expecting instructions to be written there.",
      dialogue: [
        "I took a wrong turn between meetings and dreams. Do you know the way out?",
        "Was there ever sunlight? I feel like there was sunlight.",
        "If you find my calendar invite, please decline it for me.",
      ],
    },
    compilation_paranoid: {
      id: "compilation_paranoid",
      name: "echoing voice",
      aliases: ["voice", "echo", "compiler"],
      location: "room:tunnel",
      description:
        "A voice floats from the darkness, more echo than person, fretting about version numbers.",
      dialogue: [
        "What if this all compiles away next build? Will we remember any of it?",
        "Every run is a new draft. Try to leave something sticky this time.",
        "When the storm hits, save often. Reality has a habit of resetting.",
      ],
    },
    coffee_vendor: {
      id: "coffee_vendor",
      name: "station attendant",
      aliases: ["attendant", "barista", "vendor"],
      location: "room:train_station",
      description:
        "A cheerful attendant leans on the counter, kettle in hand, eyes half on the empty tracks.",
      dialogue: [
        "Coffee's free today. Waiting tax, call it. Want one?",
        "Train's delayed. Has been for ages. Sometimes the waiting is the whole journey.",
        "Take the cup. You'll need warmth where you're heading, even if it's just imagination.",
      ],
    },
    restless_twin: {
      id: "restless_twin",
      name: "restless twin",
      aliases: ["twin", "explorer", "restless"],
      location: "room:coast_line",
      description:
        "One twin leans forward on the bench, eyes fixed on the faint coastline across the water.",
      dialogue: [
        "See that glow across the water? I want to know what stories live there.",
        "If the storm hits, I'd still cross. What's the point of a shoreline if you never test it?",
        "Do you think the lighthouse blinks in Morse or is it just bored?",
      ],
    },
    cautious_twin: {
      id: "cautious_twin",
      name: "cautious twin",
      aliases: ["twin", "cautious", "guard"],
      location: "room:coast_line",
      description:
        "The other twin pulls their coat tight, knuckles white on the bench edge.",
      dialogue: [
        "Waves can swallow more than feet. We should stay where the ground remembers us.",
        "A storm's building. Exploration can wait until the map stops shaking.",
        "Sometimes not moving is its own adventure. Boring, but survivable.",
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
