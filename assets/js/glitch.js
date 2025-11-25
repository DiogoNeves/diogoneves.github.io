(function () {
  const target = document.getElementById('glitch-text');
  if (!target) return;

  // Edit the phrases below to change the animated hacker-style log line.
  const MESSAGES = [
    'Analysing YouTube experiments...',
    'Building tools I actually use...',
    'Logging every video. Iterating forever...',
    'Decrypting growth patterns...',
    'Simulating the next 100 uploads...'
  ];

  if (!MESSAGES.length) return;

  const DISPLAY_DURATION = 3400;
  const GLITCH_FRAMES = 10;
  const FRAME_DURATION = 48;
  const NOISE_CHARS = '!<>-_/\\[]{}=+*^?#%';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timerId;

  const randomChar = () => NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)] || '#';
  const noiseString = (length) => Array.from({ length }, randomChar).join('');

  const setMessage = (value) => {
    target.textContent = value;
  };

  const glitchTransition = (nextText) => {
    if (prefersReducedMotion) {
      setMessage(nextText);
      return;
    }

    let frames = 0;
    const maxNoiseLength = Math.max(10, Math.min(28, nextText.length + 6));

    const intervalId = window.setInterval(() => {
      frames += 1;
      setMessage(noiseString(maxNoiseLength));

      if (frames >= GLITCH_FRAMES) {
        window.clearInterval(intervalId);
        setMessage(nextText);
      }
    }, FRAME_DURATION);
  };

  const cycleMessages = () => {
    index = (index + 1) % MESSAGES.length;
    glitchTransition(MESSAGES[index]);
    timerId = window.setTimeout(cycleMessages, DISPLAY_DURATION);
  };

  setMessage(MESSAGES[0]);
  timerId = window.setTimeout(cycleMessages, DISPLAY_DURATION);

  window.addEventListener('pagehide', () => {
    window.clearTimeout(timerId);
  });
})();
