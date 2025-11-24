(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const line = document.getElementById("glitch-line");
    if (!line) return;

    // Update the rotating terminal sentences here to change the vibe/messages.
    const MESSAGES = [
      "Analysing YouTube experiments...",
      "Building tools I actually use...",
      "Logging every video. Iterating forever...",
      "Decrypting growth patterns...",
      "Simulating the next 100 uploads..."
    ];

    const GLITCH_DURATION = 480; // milliseconds spent glitching
    const DISPLAY_DURATION = 2600; // milliseconds each clean message stays visible
    const NOISE = "!@#$%^&*()_+-=[]{}|;:,.<>/?abcdefghijklmnopqrstuvwxyz0123456789";

    let index = 0;

    const getMessage = () => MESSAGES[index % MESSAGES.length];

    const randomNoise = (length) => {
      let output = "";
      for (let i = 0; i < length; i += 1) {
        output += NOISE[Math.floor(Math.random() * NOISE.length)];
      }
      return output;
    };

    const glitchTransition = (message) => {
      const start = performance.now();

      const frame = (now) => {
        const elapsed = now - start;
        if (elapsed < GLITCH_DURATION) {
          line.textContent = randomNoise(Math.max(message.length, 12));
          requestAnimationFrame(frame);
        } else {
          line.textContent = message;
        }
      };

      requestAnimationFrame(frame);
    };

    const cycleMessages = () => {
      glitchTransition(getMessage());
      index += 1;
      setTimeout(cycleMessages, GLITCH_DURATION + DISPLAY_DURATION);
    };

    cycleMessages();
  });
})();
