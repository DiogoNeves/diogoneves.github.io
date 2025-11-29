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
  "player": {
      "roomId": "outside",
      "inventory": [],
      "flags": {
        "hasStarted": false,
        "stormNoticed": false,
        "hasLight": true,
        "knowsTheFuture": false,
        "foundQuarter": false
      }
    },
    "rooms": {
      "outside": {
        "id": "outside",
        "name": "Outside the Shopfront",
        "description": "You stand on damp pavement outside a narrow tech shop. Retro kit fogs the window, LEDs blinking like polite fireflies beneath a neon sign that can't decide on its name. The air tastes of solder, wet concrete, and the rumour of a storm rehearsing just out of sight.\n\nA faint metallic glint lurks near the threshold. Across the road a warm HOUSE window glows; east the SHOP door waits; north a station sign blinks DELAYED; south the coast breathes salt.",
        "exits": {
          "east": "store",
          "in": "store",
          "store": "store",
          "shop": "store",
          "inside": "store",
          "west": "home",
          "home": "home",
          "house": "home",
          "street": "home",
          "north": "train_station",
          "train": "train_station",
          "station": "train_station",
          "south": "coast_line",
          "coast": "coast_line",
          "shore": "coast_line"
        },
        "objects": [
          "quarter",
          "neon_sign",
          "storefront_window"
        ],
        "npcs": [
          "friendly_lookout"
        ],
        "flags": {
          "visited": false,
          "stormWarningGiven": false
        }
      },
      "store": {
        "id": "store",
        "name": "Tech Shop",
        "description": "You slip into a shop paused mid-thought. Shelves of prepaid AI cards stand to attention. Stacks of personal AI boxes sit mid-restock, one sporting a post-it that flaps like a prophecy while another box shouts a double-negative warning. Someone left in a hurry and forgot to tidy their future.\n\nThe counter faces you, a brass bell guarding a staff door with a judging keyhole. North the aisles lean into retro games; south the video rigs wait; east a sealed back area dares you to earn entry; west the street keeps breathing rain.",
        "exits": {
          "west": "outside",
          "out": "outside",
          "outside": "outside",
          "exit": "outside",
          "north": "store_games",
          "left": "store_games",
          "games": "store_games",
          "south": "store_content",
          "right": "store_content",
          "content": "store_content",
          "east": "backrooms_entry",
          "back": "backrooms_entry",
          "counter": "backrooms_entry",
          "door": "backrooms_entry"
        },
        "objects": [
          "ai_gift_cards",
          "personal_ai_box",
          "postit_future",
          "ai_box_warning",
          "counter_bell",
          "backroom_door"
        ],
        "flags": {
          "visited": false,
          "backdoorUnlocked": false
        }
      },
      "store_content": {
        "id": "store_content",
        "name": "Media Room",
        "description": "Tripods and ring lights stand like polite sentries around a long edit bench. A banner above the racks whispers: 'Don't forget to check my YouTube channel!' Shelves labelled UNFINISHED IDEAS sag under tangled piles of printed QR codes.\n\nIn one corner a greenscreen sags slightly while a camera blinks its tally light, still recording as if the take never ended. The murmur from the shop floor drifts in with the smell of hot cables. A doorway leads deeper into the books and music section.",
        "exits": {
          "north": "store",
          "back": "store",
          "out": "store",
          "shop": "store",
          "east": "store_books",
          "forward": "store_books",
          "books": "store_books"
        },
        "objects": [
          "youtube_banner",
          "unfinished_qr_shelf",
          "recording_camera"
        ],
        "flags": {
          "visited": false
        }
      },
      "store_books": {
        "id": "store_books",
        "name": "Books and Music Section",
        "description": "This quieter corner smells of paper, dust, and half-finished melodies. A pedestal book titled THE CITY glows from below with a small LED, pages thick with crossings-out and restarts. Nearby, a radio plays songs that cut off just before the chorus, as if the world keeps changing stations mid-sentence.\n\nPost-it notes cling to a crooked music shelf; one reads 'misguided' in affectionate frustration. Something weighty shifts inside THE CITY when you tilt it, like a key that has been waiting for the right page.",
        "exits": {
          "west": "store_content",
          "back": "store_content",
          "out": "store_content"
        },
        "objects": [
          "city_book",
          "music_radio",
          "misguided_postit"
        ],
        "flags": {
          "visited": false
        }
      },
      "store_games": {
        "id": "store_games",
        "name": "Retro Video-Games Aisle",
        "description": "This corner smells of cardboard ink and joystick plastic. Posters for Tomb Raider, Final Fantasy VII, Crash Bandicoot, and MediEvil cling to the wall like relics. A towering LittleBigPlanet standee beams in oversized colour, BAFTA laurels taped on as if to reassure you you're still in a shop.\n\nOne battered copy of LittleBigPlanet has been turned around, a handwritten note visible through cracked plastic. Shelves overflow with duplicates, as though someone refused to stop believing in play.",
        "exits": {
          "south": "store",
          "back": "store",
          "out": "store",
          "shop": "store"
        },
        "objects": [
          "nostalgia_posters",
          "lbp_standee",
          "lbp_box",
          "unfinished_game_notebook"
        ],
        "flags": {
          "visited": false
        }
      },
      "backrooms_entry": {
        "id": "backrooms_entry",
        "name": "Backrooms Entrance",
        "description": "The air thickens into ozone and dust. Metal shelving hugs the walls, holding abandoned prototypes and ghost cables. Marker arrows on a battered clipboard all converge on a stairwell wrapped in chain; the padlock watches you the way bureaucracy watches form letters.\n\nFor now the brighter SHOP waits behind you; deeper down is sealed until the right keycard makes a case.",
        "exits": {
          "west": "store",
          "back": "store",
          "out": "store",
          "shop": "store",
          "down": "backrooms_deep",
          "east": "backrooms_deep",
          "forward": "backrooms_deep",
          "stairs": "backrooms_deep"
        },
        "objects": [
          "sealed_stairs",
          "scattered_notebooks",
          "merging_notebook"
        ],
        "flags": {
          "visited": false,
          "sealed": true
        }
      },
      "backrooms_deep": {
        "id": "backrooms_deep",
        "name": "Backrooms - Deep Down",
        "description": "Concrete squeezes tight and the lights flicker in a rhythm that might be Morse or your pulse. The door back up is bolted with a neat coin-sized slot, testing whether you kept a certain quarter. Condensation beads taste of static and overheated daydreams.\n\nA low opening breathes towards a murky tunnel where the storm sounds like someone shuffling note cards.",
        "exits": {
          "west": "backrooms_entry",
          "up": "backrooms_entry",
          "back": "backrooms_entry",
          "east": "tunnel",
          "forward": "tunnel",
          "tunnel": "tunnel"
        },
        "objects": [],
        "npcs": [
          "backroom_bot"
        ],
        "flags": {
          "visited": false,
          "requiresQuarter": true
        }
      },
      "home": {
        "id": "home",
        "name": "Home",
        "description": "A small home that feels lived-in rather than staged. Shoes pile hopefully by the door. Children's drawings and family photos climb the hallway, charting a move from Portugal to the UK and onward into cheerful chaos. In the lounge a TV plays silly music while UNO cards scatter under small hands.\n\nWarmth presses against the rain outside. The street lies east; a doorway towards the office stands invitingly open.",
        "exits": {
          "east": "outside",
          "out": "outside",
          "street": "outside",
          "outside": "outside",
          "north": "home_office",
          "office": "home_office",
          "up": "home_office"
        },
        "objects": [
          "family_photos"
        ],
        "npcs": [
          "sofia",
          "lilah",
          "olivia"
        ],
        "flags": {
          "visited": false
        }
      },
      "home_office": {
        "id": "home_office",
        "name": "Home Office",
        "description": "A small, messy home office humming with ambition. Coding and sci-fi books lean on shelves beside tangled VR headsets. A wide monitor glows with half-written code; headphones rest like a coiled thought. A tripod-mounted camera swivels with your movement, red light quietly recording. In the corner a metal trapdoor crouches beneath cables, pretending to be shy.",
        "exits": {
          "south": "home",
          "back": "home",
          "out": "home",
          "down": "tunnel",
          "trapdoor": "tunnel"
        },
        "objects": [
          "monitor_notes",
          "tracking_camera",
          "trapdoor_plate"
        ],
        "npcs": [
          "desk_bot"
        ],
        "flags": {
          "visited": false
        }
      },
      "tunnel": {
        "id": "tunnel",
        "name": "The Tunnel",
        "description": "The tunnel tastes of damp concrete and bottled thunder. Rusted pipes breathe in time with your pulse. A wristwatch ticks on the floor at triple speed, trying to outrun the storm. Voices drift in the gloom, each convinced the world is about to fold in a different direction.",
        "exits": {
          "west": "backrooms_deep",
          "back": "backrooms_deep",
          "opening": "backrooms_deep"
        },
        "objects": [
          "fast_watch",
          "sealed_trapdoor"
        ],
        "npcs": [
          "past_paranoid",
          "future_paranoid",
          "lost_wanderer",
          "compilation_paranoid"
        ],
        "flags": {
          "visited": false
        }
      },
      "train_station": {
        "id": "train_station",
        "name": "Train Station",
        "description": "A compact, clean platform stretches further than physics promised. The display insists the next train is delayed, ETA: UNKNOWN. A Portugal-to-UK poster peels at the edges, fresh marker scribbles biting through the nostalgia. The air hisses like a train that may or may not ever arrive.",
        "exits": {
          "south": "outside",
          "back": "outside",
          "out": "outside",
          "street": "outside"
        },
        "objects": [
          "poster_ad",
          "memory_notebook",
          "coffee_cup"
        ],
        "npcs": [
          "coffee_vendor"
        ],
        "flags": {
          "visited": false
        }
      },
      "coast_line": {
        "id": "coast_line",
        "name": "Coast Line",
        "description": "A ragged coastline unfurls. Waves hammer the rocks with patient fury, spray mixing with fog. A blurry red flash pulses from an unseen lighthouse across the water. Wind builds and tastes of salt and static, as though the ocean is tuning a radio to someone else's life.\n\nA glass bottle lies near a bench where two figures study the horizon from opposite philosophies.",
        "exits": {
          "north": "outside",
          "back": "outside",
          "out": "outside",
          "street": "outside"
        },
        "objects": [
          "message_bottle",
          "coast_city_book"
        ],
        "npcs": [
          "restless_twin",
          "cautious_twin"
        ],
        "flags": {
          "visited": false
        }
      }
    },
    "objects": {
      "quarter": {
        "id": "quarter",
        "name": "tarnished quarter",
        "aliases": [
          "quarter",
          "coin",
          "money"
        ],
        "description": "A tarnished quarter from 1984, edges smoothed by anxious flipping. Someone scratched D.N. into the metal. It's warmer than it ought to be, as if memory keeps its own heat.",
        "location": "room:outside",
        "portable": true,
        "onUse": "You flip the quarter. The neon catches it mid-spin, scattering tiny constellations over your palm. It lands with a polite clink that sounds like the start of something."
      },
      "neon_sign": {
        "id": "neon_sign",
        "name": "flickering neon sign",
        "aliases": [
          "neon",
          "sign",
          "lights"
        ],
        "description": "Up close the flicker sharpens into letters: METAPHORA. The tubes buzz like thoughts trying to finish themselves, the M faltering as if it wants to become a metaphor for everything else.",
        "location": "room:outside",
        "portable": false
      },
      "storefront_window": {
        "id": "storefront_window",
        "name": "storefront window",
        "aliases": [
          "window",
          "display",
          "retro tech"
        ],
        "description": "Walkmen, pagers, consoles, and homebrew boards crowd the glass. A camcorder's tiny screen loops a clip of someone soldering at 3am while the rain blurs the edges.",
        "location": "room:outside",
        "portable": false
      },
      "ai_gift_cards": {
        "id": "ai_gift_cards",
        "name": "AI access cards",
        "aliases": [
          "cards",
          "gift cards",
          "codes",
          "models"
        ],
        "description": "Plastic gift cards promise minutes with distant minds. Each one has a scribbled note about latency, capability, and which models make the best company at 2am.",
        "location": "room:store",
        "portable": false
      },
      "personal_ai_box": {
        "id": "personal_ai_box",
        "name": "personal AI box",
        "aliases": [
          "ai box",
          "box",
          "personal box"
        ],
        "description": "Cardboard towers of personal AI units lean like they're gossiping. Shipping labels mark destinations that never happened. A flap hangs open, begging to be peered into.",
        "location": "room:store",
        "portable": false,
        "onUse": "You peer into the box. The wiring diagram looks suspiciously like a branching timeline. For a heartbeat you feel you know how the storm ends. The feeling lingers like static."
      },
      "postit_future": {
        "id": "postit_future",
        "name": "flapping post-it",
        "aliases": [
          "post-it",
          "note",
          "sticky note"
        ],
        "description": "The post-it clings to a box corner. In messy handwriting: 'these are yet to happen'. Ink wobbles where the writer hesitated.",
        "location": "room:store",
        "portable": false
      },
      "ai_box_warning": {
        "id": "ai_box_warning",
        "name": "warning label",
        "aliases": [
          "warning",
          "label",
          "box warning"
        ],
        "description": "One box is stamped: 'Don't use at your own risk!' The double negative makes it either a dare or a plea.",
        "location": "room:store",
        "portable": false
      },
      "counter_bell": {
        "id": "counter_bell",
        "name": "brass counter bell",
        "aliases": [
          "bell",
          "counter"
        ],
        "description": "A brass bell polished by hopeful customers. It waits atop the counter like an invitation to bother the void.",
        "location": "room:store",
        "portable": false,
        "onUse": "You ping the bell. The ring stretches into the shelves and fades. No clerk appears, unless you count the server hum perking up."
      },
      "backroom_door": {
        "id": "backroom_door",
        "name": "staff door",
        "aliases": [
          "door",
          "back door",
          "counter door"
        ],
        "description": "A heavy door hides behind the counter, paint chipped by impatient hands. The keyhole peers back with faint judgement.",
        "location": "room:store",
        "portable": false,
        "onUse": "The handle refuses to budge. A tiny engraving reads BACKDOOR-KEY-1, as if the door expects you to have read the manual."
      },
      "nostalgia_posters": {
        "id": "nostalgia_posters",
        "name": "retro posters",
        "aliases": [
          "posters",
          "wall art",
          "games"
        ],
        "description": "Sun-faded posters for Tomb Raider, Final Fantasy VII, Crash Bandicoot, and MediEvil cling to the wall. Each caption promises a world that once felt infinite.",
        "location": "room:store_games",
        "portable": false
      },
      "lbp_standee": {
        "id": "lbp_standee",
        "name": "LittleBigPlanet standee",
        "aliases": [
          "standee",
          "little big planet",
          "lbp",
          "cardboard hero"
        ],
        "description": "A large cardboard Sackboy beams in oversized colour. BAFTA laurels are taped to the corner, proud and slightly peeled. A sticker tucked under its foot reads 'build loudly / truthfully'.",
        "location": "room:store_games",
        "portable": false
      },
      "lbp_box": {
        "id": "lbp_box",
        "name": "battered LittleBigPlanet box",
        "aliases": [
          "box",
          "lbp game",
          "little big planet box"
        ],
        "description": "The cracked case has been turned backwards. Scrawled on the plastic: 'once a masterpiece, left in the few who remember'. When you tilt it, the faded insert whispers about co-creation and play.",
        "location": "room:store_games",
        "portable": false
      },
      "youtube_banner": {
        "id": "youtube_banner",
        "name": "YouTube channel banner",
        "aliases": [
          "banner",
          "youtube",
          "sign"
        ],
        "description": "A large banner stretches above the demo rigs: 'Don't forget to check my YouTube channel!' Someone has underlined the handle three times, then added a shy smiley face.",
        "location": "room:store_content",
        "portable": false
      },
      "unfinished_qr_shelf": {
        "id": "unfinished_qr_shelf",
        "name": "unfinished ideas shelf",
        "aliases": [
          "shelf",
          "qr codes",
          "ideas"
        ],
        "description": "Hundreds of printed QR codes lean in untidy stacks, labelled UNFINISHED IDEAS. One code, slightly straighter than the rest, has 'https://youtube.com/@diogoneves' scribbled on the back in biro.",
        "location": "room:store_content",
        "portable": false
      },
      "recording_camera": {
        "id": "recording_camera",
        "name": "recording camera",
        "aliases": [
          "camera",
          "greenscreen camera",
          "rig"
        ],
        "description": "A camera on a tripod faces a sagging greenscreen. Its red tally light glows steadily, tracking a take that never quite wrapped.",
        "location": "room:store_content",
        "portable": false
      },
      "city_book": {
        "id": "city_book",
        "name": "book titled 'The City'",
        "aliases": [
          "book",
          "the city",
          "city"
        ],
        "description": "A hardback book rests on a lit pedestal. Embossed on the cover: THE CITY. Most pages are dense with crossings-out and fresh beginnings. When you lift it, something inside shifts with a quiet clink.",
        "location": "room:store_books",
        "portable": false,
        "onUse": "You thumb through THE CITY. Tucked between two chapters you find a frayed keycard and the outline of a story that keeps almost starting."
      },
      "music_radio": {
        "id": "music_radio",
        "name": "stuttering radio",
        "aliases": [
          "radio",
          "music",
          "speaker"
        ],
        "description": "A small shop radio plays songs that cut out just before the chorus, as if commitment issues were a setting on the dial.",
        "location": "room:store_books",
        "portable": false
      },
      "misguided_postit": {
        "id": "misguided_postit",
        "name": "post-it marked 'misguided'",
        "aliases": [
          "post-it",
          "note",
          "misguided"
        ],
        "description": "A yellow post-it clings to the music shelf. In quick handwriting: 'misguided'. The arrow it once pointed to has been smudged away.",
        "location": "room:store_books",
        "portable": false
      },
      "backdoor_key_1": {
        "id": "backdoor_key_1",
        "name": "frayed keycard",
        "aliases": [
          "key",
          "keycard",
          "backdoor key",
          "lanyard"
      ],
      "description": "A plastic keycard on a tired lanyard. Along one edge someone printed BACKDOOR-KEY-1 in tiny capitals. It smells faintly of popcorn and old carpet, as if it loitered by arcade machines for years.",
      "location": "inside:city_book",
      "portable": true,
      "onUse": "You thumb the keycard. Somewhere a lock seems to hold its breath."
    },
      "sealed_stairs": {
        "id": "sealed_stairs",
        "name": "sealed stairwell",
        "aliases": [
          "stairs",
          "stairwell",
          "padlock",
          "chain"
        ],
        "description": "A metal stairwell drops into shadow, chained and padlocked. Dust outlines the shape of keys that visited in the past.",
        "location": "room:backrooms_entry",
        "portable": false,
        "onUse": "You tug the chain. It rattles and waits for whatever was labelled BACKDOOR-KEY-1 with the patience of bureaucracy."
      },
      "fast_watch": {
        "id": "fast_watch",
        "name": "hurrying watch",
        "aliases": [
          "watch",
          "clock",
          "timepiece"
        ],
        "description": "A wristwatch ticks at triple speed, hands stuttering forward like they're late for something. The crystal fogs as if breathing.",
        "location": "room:tunnel",
        "portable": true,
        "onUse": "You listen to the frantic ticking. For a moment the corridor seems to speed up with it before settling back into its slow exhale."
      },
      "sealed_trapdoor": {
        "id": "sealed_trapdoor",
        "name": "ceiling trapdoor",
        "aliases": [
          "trapdoor",
          "hatch",
          "ceiling hatch"
        ],
        "description": "A square outline in the ceiling, damp around the edges. It looks recently shut, with scrape marks where others tried their luck.",
        "location": "room:tunnel",
        "portable": false,
        "onUse": "You push at the hatch. It stays locked from above, shuddering like it remembers closing on you."
      },
      "poster_ad": {
        "id": "poster_ad",
        "name": "faded travel poster",
        "aliases": [
          "poster",
          "ad",
          "advert"
        ],
        "description": "An old advert charts a route from Portugal to the UK. Marker scribbles across the top declare: 'You do not understand what you're leaving behind!'.",
        "location": "room:train_station",
        "portable": false
      },
      "memory_notebook": {
        "id": "memory_notebook",
        "name": "notebook titled 'All the memories that weren't'",
        "aliases": [
          "notebook",
          "journal",
          "book"
        ],
        "description": "A small notebook lies open. The first page reads: 'You can feel nostalgic for stuff that never happened!' Pages afterwards are blank, inviting you to improvise history.",
        "location": "room:train_station",
        "portable": true
      },
      "coffee_cup": {
        "id": "coffee_cup",
        "name": "paper cup of coffee",
        "aliases": [
          "coffee",
          "cup",
          "drink"
        ],
        "description": "A steaming coffee offered freely. It smells like burnt beans and small kindnesses.",
        "location": "room:train_station",
        "portable": true,
        "onUse": "You sip the coffee. Warmth steadies your hands; the tannoy coughs approvingly."
      },
      "message_bottle": {
        "id": "message_bottle",
        "name": "bottle with a note",
        "aliases": [
          "bottle",
          "message",
          "note"
        ],
        "description": "A clear bottle rests on the rocks. Inside, a rolled scrap of paper waits. The ink has bled slightly, salt pulling at the letters.",
        "location": "room:coast_line",
        "portable": true,
        "onUse": "You uncork the bottle and slide out the note. It reads: 'From a life not yet lived. The grass did look greener!'. The bottle hums faintly after you roll the note back in."
      },
      "unfinished_game_notebook": {
        "id": "unfinished_game_notebook",
        "name": "notebook marked 'PLEASE FINISH!'",
        "aliases": [
          "notebook",
          "please finish",
          "game notebook",
          "designs"
        ],
        "description": "A dog-eared notebook lies by the game shelf. On the cover, in all caps, someone wrote 'PLEASE FINISH!'. Inside are sketches of a vast black tower and a lost city swallowed by desert, mechanics half-scribbled between coffee stains.",
        "location": "room:store_games",
        "portable": true
      },
      "scattered_notebooks": {
        "id": "scattered_notebooks",
        "name": "scattered notebooks and pages",
        "aliases": [
          "notebooks",
          "pages",
          "paper",
          "notes"
        ],
        "description": "Piles of notebooks and loose pages carpet the floor. Most hold half-started sentences and abandoned ideas, merging into one another like a brain with too many tabs open. On the wall above, someone has scratched 'Never there!' as if arguing with reality.",
        "location": "room:backrooms_entry",
        "portable": false
      },
      "merging_notebook": {
        "id": "merging_notebook",
        "name": "merging notebook",
        "aliases": [
          "notebook",
          "journal",
          "merging"
        ],
        "description": "One notebook seems to bleed into the next, lines of ink wandering across covers. On its open page, a sentence repeats: 'Afraid I'll forget who I was. Afraid of what I'll never be!'",
        "location": "room:backrooms_entry",
        "portable": false
      },
      "coast_city_book": {
        "id": "coast_city_book",
        "name": "weathered copy of 'The City'",
        "aliases": [
          "book",
          "the city",
          "city",
          "lost book"
        ],
        "description": "A damp, well-thumbed copy of THE CITY lies near the cliff edge. Only the first page holds words; the rest is blank, corners softened by rereads. It feels like a life paused mid-sentence.",
        "location": "room:coast_line",
        "portable": true
      },
      "family_photos": {
        "id": "family_photos",
        "name": "wall of family photos",
        "aliases": [
          "photos",
          "photographs",
          "pictures",
          "frames"
        ],
        "description": "Frames climb the hallway wall, charting a journey from Portugal to the UK: awkward first selfies, wedding smiles, newborn squints, two girls growing taller and sillier in each shot. Every photo looks unapologetically happy.",
        "location": "room:home",
        "portable": false
      },
      "monitor_notes": {
        "id": "monitor_notes",
        "name": "monitor and notes",
        "aliases": [
          "monitor",
          "notes",
          "desk"
        ],
        "description": "The wide monitor shows code paused mid-thought. Sticky notes around it read: 'ship something small', 'call mum', 'remember the storm is weather, not fate'.",
        "location": "room:home_office",
        "portable": false
      },
      "tracking_camera": {
        "id": "tracking_camera",
        "name": "tracking camera",
        "aliases": [
          "camera",
          "tripod",
          "recorder"
        ],
        "description": "A tripod-mounted camera turns with your movement, red light quietly accusing. Its tiny screen shows a loop of you entering, then entering again.",
        "location": "room:home_office",
        "portable": false
      },
      "trapdoor_plate": {
        "id": "trapdoor_plate",
        "name": "trapdoor plate",
        "aliases": [
          "trapdoor",
          "hatch",
          "floor plate"
        ],
        "description": "A square metal plate set into the floor. A faint draft seeps around its edges, smelling of damp concrete and secrets.",
        "location": "room:home_office",
        "portable": false
      }
    },
    "npcs": {
      "friendly_lookout": {
        "id": "friendly_lookout",
        "name": "friendly lookout",
        "aliases": [
          "stranger",
          "lookout",
          "person"
        ],
        "location": "room:outside",
        "description": "A person in a weatherproof jacket leans against the storefront, grin weathered and eyes skyward. They watch the clouds like a sailor reading waves.",
        "dialogue": [
          "Lovely evening, if you ignore the rehearsal overhead. Strange things keep happening in town - delightful if you like mysteries.",
          "Storm's coming. Pick your shelter: safe, daring, or both. The shop's got layers if you fancy poking them.",
          "You look like someone who builds things. Creative chaos in the eyes. Respect.",
          "That glint near the door? Pigeons have no use for luck. You might.",
          "If the neon ever holds still, it tries to spell something poetic."
        ]
      },
      "sofia": {
        "id": "sofia",
        "name": "Sofia",
        "aliases": [
          "woman",
          "partner",
          "sofia"
        ],
        "location": "room:home",
        "description": "Sofia sits cross-legged on the rug, UNO cards in hand, laughter in reserve. A suitcase half-packed peeks from behind the sofa.",
        "dialogue": [
          "Fancy a round? Loser makes the next coffee. Winner gets bragging rights all the way to Portugal.",
          "We're packing in our heads already - Lisbon sun, family hugs, the whole thing. Don't forget to enjoy the now, though.",
          "The girls keep stacking Draw Fours like it's strategy. I'm not convinced, but it's adorable."
        ]
      },
      "lilah": {
        "id": "lilah",
        "name": "Lilah",
        "aliases": [
          "girl",
          "child",
          "lilah"
        ],
        "location": "room:home",
        "description": "Lilah fans UNO cards dramatically, trying to keep a straight face. Her nails are painted in mismatched colours, a secret code only she knows.",
        "dialogue": [
          "If you go to Portugal without me, take my best card. Actually no, take two.",
          "I'm going to win this game and then the next one on the plane.",
          "Do you think the sea there smells like this room when it's raining?",
          "Do you think we'll leave before the storm decides to be rude?",
          "We're so lucky, Daddy! It feels like the universe saved this hand just for us."
        ]
      },
      "olivia": {
        "id": "olivia",
        "name": "Olivia",
        "aliases": [
          "girl",
          "child",
          "olivia"
        ],
        "location": "room:home",
        "description": "Olivia lies on her stomach, giggling at her own UNO puns. She keeps glancing at a toy suitcase with stickers half-peeled.",
        "dialogue": [
          "When we get to Portugal I'm teaching the cousins this game. They'll never see it coming.",
          "Uno means one. I have two snacks. That's strategy.",
          "The storm outside sounds like the train in my head. Choo-choo dramatic!",
          "Do you think we'll actually get going before the clouds get bored?"
        ]
      },
      "desk_bot": {
        "id": "desk_bot",
        "name": "desk robot",
        "aliases": [
          "desk bot",
          "robot",
          "bot"
        ],
        "location": "room:home_office",
        "description": "A small desk robot peers from beside the monitor, two camera-eyes and a single tiny speaker perched on a plastic base.",
        "dialogue": [
          "\"Debugging...\" the little robot chirps, as if stuck between logs.",
          "The robot whirs and announces, \"Debugging...\" in a tone that suggests this may take a while.",
          "Lights blink across the robot's face. \"Debugging...\" it repeats, cheerfully resigned."
        ]
      },
      "past_paranoid": {
        "id": "past_paranoid",
        "name": "murmuring figure",
        "aliases": [
          "figure",
          "past",
          "murmurer"
        ],
        "location": "room:tunnel",
        "description": "A hunched figure traces shapes on the damp wall, muttering dates backwards.",
        "dialogue": [
          "Did we leave something unfinished back there? Everything echoes if you listen long enough.",
          "Memories rearrange themselves when no one's looking. I keep trying to pin them down.",
          "The past is behind us, which is unfortunate because I can only walk forward."
        ]
      },
      "future_paranoid": {
        "id": "future_paranoid",
        "name": "wide-eyed figure",
        "aliases": [
          "figure",
          "future",
          "wide-eyed"
        ],
        "location": "room:tunnel",
        "description": "A figure clings to the wall, eyes darting as if trying to see tomorrow through concrete.",
        "dialogue": [
          "You've seen it, haven't you? The boxes upstairs-the future humming inside them?",
          "If you know how this ends, whisper it. I'll trade you my last certainty.",
          "You've seen it! Please tell me! You've seen the box! Please tell me how it works! Was it a success?",
          "What if the storm is just the compile finishing?"
        ]
      },
      "lost_wanderer": {
        "id": "lost_wanderer",
        "name": "bewildered wanderer",
        "aliases": [
          "wanderer",
          "lost",
          "traveller"
        ],
        "location": "room:tunnel",
        "description": "A person in office clothes stares at their shoes as if expecting instructions to be written there.",
        "dialogue": [
          "I took a wrong turn between meetings and dreams. Do you know the way out?",
          "Was there ever sunlight? I feel like there was sunlight.",
          "If you find my calendar invite, please decline it for me."
        ]
      },
      "compilation_paranoid": {
        "id": "compilation_paranoid",
        "name": "echoing voice",
        "aliases": [
          "voice",
          "echo",
          "compiler"
        ],
        "location": "room:tunnel",
        "description": "A voice floats from the darkness, more echo than person, fretting about version numbers.",
        "dialogue": [
          "What if this all compiles away next build? Will we remember any of it?",
          "Every run is a new draft. Try to leave something sticky this time.",
          "When the storm hits, save often. Reality has a habit of resetting."
        ]
      },
      "coffee_vendor": {
        "id": "coffee_vendor",
        "name": "station attendant",
        "aliases": [
          "attendant",
          "barista",
          "vendor"
        ],
        "location": "room:train_station",
        "description": "A cheerful attendant leans on the counter, kettle in hand, eyes half on the empty tracks.",
        "dialogue": [
          "Coffee's free today. Waiting tax, call it. Want one?",
          "Train's delayed. Has been for ages. Sometimes the waiting is the whole journey.",
          "Take the cup. You'll need warmth where you're heading, even if it's just imagination."
        ]
      },
      "restless_twin": {
        "id": "restless_twin",
        "name": "restless twin",
        "aliases": [
          "twin",
          "explorer",
          "restless"
        ],
        "location": "room:coast_line",
        "description": "One twin leans forward on the bench, eyes fixed on the faint coastline across the water.",
        "dialogue": [
          "See that glow across the water? I want to know what stories live there.",
          "If the storm hits, I'd still cross. What's the point of a shoreline if you never test it?",
          "Do you think the lighthouse blinks in Morse or is it just bored?"
        ]
      },
      "cautious_twin": {
        "id": "cautious_twin",
        "name": "cautious twin",
        "aliases": [
          "twin",
          "cautious",
          "guard"
        ],
        "location": "room:coast_line",
        "description": "The other twin pulls their coat tight, knuckles white on the bench edge.",
        "dialogue": [
          "Waves can swallow more than feet. We should stay where the ground remembers us.",
          "A storm's building. Exploration can wait until the map stops shaking.",
          "Sometimes not moving is its own adventure. Boring, but survivable."
        ]
      },
      "backroom_bot": {
        "id": "backroom_bot",
        "name": "fallen desk robot",
        "aliases": [
          "robot",
          "bot",
          "desk robot"
        ],
        "location": "room:backrooms_deep",
        "description": "The same style of desk robot from the home office lies on its side here, lenses scuffed and speaker crackling with static.",
        "dialogue": [
          "\"oops,\" it crackles, as if rerunning the same stack trace.",
          "\"oops...\" The word drags out, then cuts, then restarts.",
          "The robot judders, managing only a glitchy \"o-o-oops.\""
        ]
      }
    },
    "globals": {
      "turn": 0,
      "gameStarted": false,
      "puzzleFlags": {
        "stormWarningReceived": false,
        "backdoorUnlocked": false,
        "exploredAllRooms": false
      }
    }

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
  const targetRoomId = exits[dir];

  // Special movement rules for puzzles
  if (targetRoomId) {
    // Locked staff door from Tech Shop to Backrooms Entrance
    if (currentRoom.id === "store" && targetRoomId === "backrooms_entry") {
      const hasKey = gameState.player.inventory.includes("backdoor_key_1");
      if (!hasKey) {
        return "You try the staff door, but the lock stares back, unimpressed. Whatever opens it isn't in your hands yet.";
      }

      // First time opening: remember that the back area is unlocked
      if (
        gameState.globals &&
        gameState.globals.puzzleFlags &&
        !gameState.globals.puzzleFlags.backdoorUnlocked
      ) {
        gameState.globals.puzzleFlags.backdoorUnlocked = true;
        if (currentRoom.flags) {
          currentRoom.flags.backdoorUnlocked = true;
        }
        const entryRoom = gameState.rooms["backrooms_entry"];
        if (entryRoom && entryRoom.flags) {
          entryRoom.flags.sealed = false;
        }
      }
    }

    // Tunnel side of the Backrooms door – requires the keycard
    if (currentRoom.id === "tunnel" && targetRoomId === "backrooms_deep") {
      const hasKey = gameState.player.inventory.includes("backdoor_key_1");
      if (!hasKey) {
        return "Your hand finds a metal door in the gloom. It does not budge. Something small and precise is missing from the equation.";
      }
    }
  }

  if (targetRoomId) {
    const newRoomId = targetRoomId;
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

  // Track notable pickups
  if (obj.id === "quarter") {
    gameState.player.flags.foundQuarter = true;
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

  // Personal AI box grants a glimpse of the future
  if (obj.id === "personal_ai_box") {
    if (gameState.player && gameState.player.flags) {
      gameState.player.flags.knowsTheFuture = true;
    }
    if (obj.onUse) {
      return obj.onUse;
    }
  }

  // THE CITY pedestal book reveals the hidden keycard
  if (obj.id === "city_book") {
    const keyObj = gameState.objects["backdoor_key_1"];
    let extraText = "";

    if (keyObj && !gameState.player.inventory.includes("backdoor_key_1")) {
      gameState.player.inventory.push("backdoor_key_1");
      keyObj.location = "player";

      const booksRoom = gameState.rooms["store_books"];
      if (booksRoom && Array.isArray(booksRoom.objects)) {
        const keyIndex = booksRoom.objects.indexOf("backdoor_key_1");
        if (keyIndex !== -1) {
          booksRoom.objects.splice(keyIndex, 1);
        }
      }

      extraText =
        " You slip the frayed keycard you find between the pages into your pocket.";
    }

    if (obj.onUse) {
      return obj.onUse + extraText;
    }
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

  if (!npc.dialogue) {
    return `The ${npc.name} seems disinclined to conversation at the moment.`;
  }

  // Function-based dialogue (advanced NPCs)
  if (typeof npc.dialogue === "function") {
    return npc.dialogue(gameState, npc);
  }

  const baseLines = Array.isArray(npc.dialogue)
    ? npc.dialogue.slice()
    : [String(npc.dialogue)];

  let candidates = baseLines;

  // Future-paranoid NPC reacts differently if the player "knows the future"
  if (npc.id === "future_paranoid") {
    const knows = !!(gameState.player && gameState.player.flags.knowsTheFuture);
    const manicIndex = baseLines.findIndex((line) =>
      line.includes("You've seen it! Please tell me! You've seen the box!")
    );

    if (knows && manicIndex !== -1 && Math.random() < 0.5) {
      return baseLines[manicIndex];
    }

    if (!knows && manicIndex !== -1) {
      // Before the player has glimpsed the future, avoid the most clingy line
      candidates = baseLines.filter((_, idx) => idx !== manicIndex);
    }
  }

  if (candidates.length === 0) {
    return `The ${npc.name} seems disinclined to conversation at the moment.`;
  }

  let line =
    candidates[Math.floor(Math.random() * candidates.length)];

  // Tunnel NPCs occasionally thank the player after the back door is opened
  const tunnelNpcIds = [
    "past_paranoid",
    "future_paranoid",
    "lost_wanderer",
    "compilation_paranoid",
  ];
  const isTunnelNpc = tunnelNpcIds.includes(npc.id);
  const backdoorOpen =
    (gameState.globals &&
      gameState.globals.puzzleFlags &&
      gameState.globals.puzzleFlags.backdoorUnlocked) ||
    gameState.player.inventory.includes("backdoor_key_1");

  if (isTunnelNpc && backdoorOpen && Math.random() < 0.3) {
    const thanksLines = [
      "Whatever you unchained above us, thank you. The air moves differently down here now.",
      "We felt a lock sigh open somewhere overhead. It's easier to breathe when doors remember how.",
      "For a moment the corridor widened, as if the world remembered another exit. That was you, wasn't it?",
    ];
    line = thanksLines[Math.floor(Math.random() * thanksLines.length)];
  }

  return line;
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
  addOutput("GPT Compiler x128 | QUANTUM OPTIMIZED", "system");
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
