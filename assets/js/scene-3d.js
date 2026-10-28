/**
 * NEUROLINK-7800 desktop scene
 *
 * Turns the flat monitor into a CRT sitting in a dark room, and lets the camera
 * drift around it with the mouse. Pure decoration: phones, touch screens and
 * anything without a fine pointer never run this, and the game works without it.
 */
(function () {
  "use strict";

  var DESKTOP = "(min-width: 769px) and (hover: hover) and (pointer: fine)";
  var MAX_YAW = 14; // degrees, left/right
  var MAX_PITCH = 7; // degrees, up/down
  var EASE = 0.07;

  var root = document.documentElement;
  var desktop = window.matchMedia(DESKTOP);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var wrapper = null;
  var monitor = null;
  var scene = null;
  var observer = null;
  var raf = 0;
  var cam = { rx: 0, ry: 0, tx: 0, ty: 0 };

  function el(className, parent) {
    var node = document.createElement("div");
    node.className = className;
    parent.appendChild(node);
    return node;
  }

  /**
   * Four sides of a (possibly tapering) box running away from the viewer.
   * Near rectangle nearW x nearH at depth z, far rectangle farW x farH at z - depth.
   * Everything is positioned from the centre of the monitor.
   */
  function frustum(parent, cls, nearW, nearH, farW, farH, z, depth) {
    var dy = (nearH - farH) / 2;
    var dx = (nearW - farW) / 2;
    var along = Math.hypot(dy, depth); // slant length of top / bottom faces
    var across = Math.hypot(dx, depth); // slant length of left / right faces

    var top = el(cls + " f-top", parent);
    top.style.cssText =
      "width:" + nearW + "px;height:" + along + "px;" +
      "left:calc(50% - " + nearW / 2 + "px);top:calc(50% - " + nearH / 2 + "px);" +
      "transform-origin:50% 0;" +
      "transform:translateZ(" + z + "px) rotateX(" + Math.atan2(-depth, dy) + "rad);" +
      "clip-path:polygon(0 0,100% 0,calc(100% - " + dx + "px) 100%," + dx + "px 100%)";

    var bottom = el(cls + " f-bottom", parent);
    bottom.style.cssText =
      "width:" + nearW + "px;height:" + along + "px;" +
      "left:calc(50% - " + nearW / 2 + "px);top:calc(50% + " + nearH / 2 + "px);" +
      "transform-origin:50% 0;" +
      "transform:translateZ(" + z + "px) rotateX(" + Math.atan2(-depth, -dy) + "rad);" +
      "clip-path:polygon(0 0,100% 0,calc(100% - " + dx + "px) 100%," + dx + "px 100%)";

    var left = el(cls + " f-left", parent);
    left.style.cssText =
      "width:" + across + "px;height:" + nearH + "px;" +
      "left:calc(50% - " + nearW / 2 + "px);top:calc(50% - " + nearH / 2 + "px);" +
      "transform-origin:0 50%;" +
      "transform:translateZ(" + z + "px) rotateY(" + Math.atan2(depth, dx) + "rad);" +
      "clip-path:polygon(0 0,100% " + dy + "px,100% calc(100% - " + dy + "px),0 100%)";

    var right = el(cls + " f-right", parent);
    right.style.cssText =
      "width:" + across + "px;height:" + nearH + "px;" +
      "left:calc(50% + " + (nearW / 2 - across) + "px);top:calc(50% - " + nearH / 2 + "px);" +
      "transform-origin:100% 50%;" +
      "transform:translateZ(" + z + "px) rotateY(" + Math.atan2(-depth, dx) + "rad);" +
      "clip-path:polygon(0 " + dy + "px,100% 0,100% 100%,0 calc(100% - " + dy + "px))";
  }

  /**
   * Rebuild the geometry for the monitor's current size
   */
  function layout() {
    if (!scene || !monitor) return;

    var W = monitor.offsetWidth;
    var H = monitor.offsetHeight;
    // Deep boxy front (what the camera actually sees) tapering into the tube neck
    var bezelDepth = Math.round(W * 0.3);
    var funnelDepth = Math.round(W * 0.28);
    var s = 0.66;
    var backZ = bezelDepth + funnelDepth;

    scene.textContent = "";
    scene.style.setProperty("--mw", W + "px");
    scene.style.setProperty("--mh", H + "px");

    // Walls and desk first, then the machine
    el("scene-wall", scene).style.transform = "translateZ(" + -(backZ + 760) + "px)";
    el("scene-desk", scene);
    el("scene-keyboard", scene);

    // Housing: a box behind the bezel, then the tapering tube funnel
    frustum(scene, "shell shell-bezel", W, H, W, H, 0, bezelDepth);
    frustum(scene, "shell shell-funnel", W, H, W * s, H * s, -bezelDepth, funnelDepth);

    var back = el("shell shell-back", scene);
    back.style.cssText =
      "width:" + W * s + "px;height:" + H * s + "px;" +
      "left:calc(50% - " + (W * s) / 2 + "px);top:calc(50% - " + (H * s) / 2 + "px);" +
      "transform:translateZ(" + -backZ + "px)";

    // The swivel foot the monitor stands on
    var foot = el("shell-foot", scene);
    foot.style.cssText =
      "width:" + W * 0.46 + "px;left:calc(50% - " + W * 0.23 + "px);" +
      "top:calc(50% + " + H / 2 + "px);" +
      "transform:translateZ(" + -backZ * 0.5 + "px)";

    // Orbit around the middle of the machine rather than its front face
    wrapper.style.transformOrigin = "50% 50% " + -backZ * 0.45 + "px";
  }

  function frame() {
    cam.rx += (cam.tx - cam.rx) * EASE;
    cam.ry += (cam.ty - cam.ry) * EASE;

    var settled =
      Math.abs(cam.tx - cam.rx) < 0.002 && Math.abs(cam.ty - cam.ry) < 0.002;

    // Dead centre means no transform at all, which keeps the text crisp at rest
    if (Math.abs(cam.rx) < 0.01 && Math.abs(cam.ry) < 0.01) {
      wrapper.style.transform = "";
    } else {
      wrapper.style.transform =
        "rotateX(" + cam.rx.toFixed(3) + "deg) rotateY(" + cam.ry.toFixed(3) + "deg)";
    }

    raf = settled ? 0 : requestAnimationFrame(frame);
  }

  function nudge() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function onMove(event) {
    var nx = (event.clientX / window.innerWidth) * 2 - 1;
    var ny = (event.clientY / window.innerHeight) * 2 - 1;
    // The camera follows the pointer: move right to see the right side, up to see the top
    cam.ty = -Math.max(-1, Math.min(1, nx)) * MAX_YAW;
    cam.tx = Math.max(-1, Math.min(1, ny)) * MAX_PITCH;
    nudge();
  }

  function onLeave() {
    cam.tx = 0;
    cam.ty = 0;
    nudge();
  }

  function enable() {
    wrapper = document.querySelector(".monitor-wrapper");
    monitor = document.querySelector(".crt-monitor");
    if (!wrapper || !monitor) return;

    root.classList.add("scene-3d");

    if (!scene) {
      scene = document.createElement("div");
      scene.className = "scene3d";
      scene.setAttribute("aria-hidden", "true");
      wrapper.insertBefore(scene, wrapper.firstChild);

      if (window.ResizeObserver) {
        observer = new ResizeObserver(layout);
        observer.observe(monitor);
      } else {
        window.addEventListener("resize", layout);
      }
    }
    layout();

    if (!reduceMotion.matches) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }
  }

  function disable() {
    root.classList.remove("scene-3d");
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseleave", onLeave);
    cam.rx = cam.ry = cam.tx = cam.ty = 0;
    if (wrapper) wrapper.style.transform = "";
  }

  function sync() {
    if (desktop.matches) enable();
    else disable();
  }

  function init() {
    sync();
    if (desktop.addEventListener) desktop.addEventListener("change", sync);
    else if (desktop.addListener) desktop.addListener(sync);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
