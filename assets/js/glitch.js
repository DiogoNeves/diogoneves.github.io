/**
 * HACKER GLITCH ANIMATION
 * -----------------------
 * Handles the cycling text effect below the main hero.
 */

// ==========================================
// EDITABLE CONFIGURATION
// ==========================================

// 1. THE MESSAGES
// Edit this array to change the sentences that cycle.
const MESSAGES = [
    "Analysing YouTube experiments...",
    "Building tools I actually use...",
    "Logging every video. Iterating forever...",
    "Decrypting growth patterns...",
    "Simulating the next 100 uploads..."
];

// 2. SETTINGS
const DISPLAY_DURATION = 3500; // How long to show each message (ms)
const GLITCH_SPEED = 40;       // How fast the characters change (ms)

// ==========================================
// LOGIC (DO NOT EDIT BELOW)
// ==========================================

const element = document.getElementById('glitch-text');
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}[]|;:,.<>?/~`";

let currentIndex = 0;
let intervalId = null;

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function animateText(newText) {
    if (!element) return;
    
    // Clear any existing animation to prevent overlap
    if (intervalId) clearInterval(intervalId);
    
    let iteration = 0;
    
    intervalId = setInterval(() => {
        element.innerText = newText
            .split("")
            .map((letter, index) => {
                // Return the actual letter if we've passed the iteration point
                if (index < iteration) {
                    return newText[index];
                }
                // Otherwise return a random character
                return randomChar();
            })
            .join("");
        
        if (iteration >= newText.length) { 
            clearInterval(intervalId);
            element.innerText = newText; // Ensure clean final state
        }
        
        iteration += 1 / 3; // Controls how many frames per character resolve. Smaller = slower resolve.
    }, GLITCH_SPEED);
}

function nextMessage() {
    currentIndex = (currentIndex + 1) % MESSAGES.length;
    animateText(MESSAGES[currentIndex]);
}

// Start the loop
document.addEventListener('DOMContentLoaded', () => {
    if (element) {
        // Set initial text
        element.innerText = MESSAGES[0];
        
        // Start cycling
        setInterval(nextMessage, DISPLAY_DURATION);
    }
});
