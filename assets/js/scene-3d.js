/**
 * NEUROLINK-7800 scene
 *
 * A dark desk with a modelled CRT and keyboard (three.js). The game itself stays
 * ordinary HTML: on desktop it is mapped onto the CRT's screen with CSS3DRenderer
 * so you can drag the camera around it; on phones the camera is fixed front-on and
 * the screen is simply laid over the exact rectangle where the tube sits.
 *
 * At rest the screen plane faces the camera at a distance where 1 unit = 1 CSS
 * pixel, so the text is drawn 1:1 and stays crisp.
 *
 * If WebGL or the module fails, nothing here runs and the flat layout remains.
 */
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const FOV = 32;
const MOBILE_QUERY = "(max-width: 768px), (pointer: coarse)";
// Drag limits around the monitor (radians)
const MAX_YAW = 0.6;
const MIN_PITCH = -0.12;
const MAX_PITCH = 0.3;
const DRAG_SPEED = 0.005; // radians per pixel dragged
const EASE = 0.18;

const root = document.documentElement;
const mobileQuery = window.matchMedia(MOBILE_QUERY);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let renderer = null;
let cssRenderer = null;
let scene = null;
let camera = null;
let rig = null;
let host = null;
let screenEl = null;
let screenObj = null;
let layout = null;
let mobile = false;
let raf = 0;
let pending = 0;

const cam = { yaw: 0, pitch: 0, tyaw: 0, tpitch: 0 };

// ------------------------------------------------
// Materials and textures (made once)
// ------------------------------------------------

const PLASTIC = 0x2f3331;

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const ventTexture = canvasTexture(256, 256, (g, w, h) => {
  g.fillStyle = "#262928";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#070808";
  for (let x = 14; x < w - 10; x += 16) g.fillRect(x, 40, 6, h - 80);
});

const labelTexture = canvasTexture(512, 64, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.fillStyle = "#5d6461";
  g.font = "600 30px 'IBM Plex Mono', monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("N E U R O L I N K - 7 8 0 0", w / 2, h / 2);
});

const materials = {
  plastic: new THREE.MeshStandardMaterial({ color: PLASTIC, roughness: 0.62, metalness: 0.04 }),
  plasticDark: new THREE.MeshStandardMaterial({ color: 0x151716, roughness: 0.7, metalness: 0.02 }),
  vents: new THREE.MeshStandardMaterial({ map: ventTexture, roughness: 0.75 }),
  recess: new THREE.MeshBasicMaterial({ color: 0x020302 }),
  label: new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, depthWrite: false }),
  led: new THREE.MeshBasicMaterial({ color: 0x5dff7a }),
  keycap: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.05 }),
  backlight: new THREE.MeshBasicMaterial({ color: 0x0f4a1d }),
  desk: new THREE.MeshStandardMaterial({ color: 0x0d0f0e, roughness: 0.38, metalness: 0.25 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x0a0c0b, roughness: 0.95 }),
  cable: new THREE.MeshStandardMaterial({ color: 0x0c0d0d, roughness: 0.5 }),
};

// ------------------------------------------------
// Layout: how big the screen is, and where it sits
// ------------------------------------------------

function viewportSize() {
  const vv = window.visualViewport;
  return {
    w: Math.round(vv ? vv.width : window.innerWidth),
    h: Math.round(vv ? vv.height : window.innerHeight),
    top: Math.round(vv ? vv.offsetTop : 0),
  };
}

function safeArea() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;visibility:hidden;pointer-events:none;" +
    "padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const area = {
    t: parseFloat(cs.paddingTop) || 0,
    r: parseFloat(cs.paddingRight) || 0,
    b: parseFloat(cs.paddingBottom) || 0,
    l: parseFloat(cs.paddingLeft) || 0,
  };
  probe.remove();
  return area;
}

function computeLayout(w, h) {
  if (!mobile) {
    // Desktop: a 4:3 tube, centred a little high so the keyboard fits below
    let Hs = Math.min(h * 0.5, 640);
    let Ws = Math.min((Hs * 4) / 3, w * 0.62);
    Ws = Math.round(Ws);
    Hs = Math.round(Ws * 0.75);
    const b = Math.round(Ws * 0.065);
    return {
      w, h, Ws, Hs,
      b, bt: b, bc: Math.round(Ws * 0.13),
      centerY: Math.round(h * 0.13),
      tilt: 0.26,
      // Look down on the machine a little, so the top of the tube is visible
      view: 0.3,
      depth: Ws * 0.8,
      keyboard: true,
      standH: 18,
    };
  }

  // Phones: fixed front view, the tube as big as the screen allows
  const sa = safeArea();
  const b = 11;
  const bt = Math.max(12, Math.round(sa.t + 6));
  const bc = 28;
  const side = Math.max(5, Math.round(Math.max(sa.l, sa.r) + 3));
  const kb = h > 560 ? Math.round(h * 0.085) : 0;
  const top = 3;
  const Ws = Math.round(w - 2 * b - 2 * side);
  const Hs = Math.round(h - top - bt - bc - kb - Math.max(4, sa.b) - 6);
  const screenTop = top + bt;
  return {
    w, h, Ws, Hs,
    b, bt, bc,
    centerY: Math.round(h / 2 - (screenTop + Hs / 2)),
    tilt: 0.42,
    view: 0,
    depth: Ws * 0.6,
    keyboard: kb > 0,
    standH: 6,
  };
}

// ------------------------------------------------
// Models
// ------------------------------------------------

function roundedRectPath(path, x, y, w, h, r) {
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

/**
 * Box whose front and back faces can differ in size: the tapering tube housing
 */
function frustumGeometry(frontW, frontH, backW, backH, zFront, zBack, cyFront, cyBack) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const front = pos.getZ(i) > 0;
    pos.setXYZ(
      i,
      pos.getX(i) * (front ? frontW : backW),
      pos.getY(i) * (front ? frontH : backH) + (front ? cyFront : cyBack),
      front ? zFront : zBack
    );
  }
  g.computeVertexNormals();
  return g;
}

function buildMonitor(L) {
  const mon = new THREE.Group();
  const { Ws, Hs, b, bt, bc } = L;
  const W = Ws + 2 * b;
  const H = Hs + bt + bc;
  const cy = (bt - bc) / 2; // centre of the bezel relative to the screen centre
  const bezelDepth = mobile ? 16 : Math.round(Ws * 0.06);
  const bevel = Math.max(3, Math.min(b * 0.3, 9));
  const frontZ = mobile ? 10 : Math.round(Ws * 0.03); // screen sits recessed behind the bezel front

  // Bezel: rounded frame with the screen opening cut out, bevelled edges
  const outer = roundedRectPath(new THREE.Shape(), -W / 2 + bevel, -Hs / 2 - bc + bevel, W - 2 * bevel, H - 2 * bevel, Math.max(8, b * 0.9));
  const hole = roundedRectPath(new THREE.Path(), -Ws / 2 - bevel, -Hs / 2 - bevel, Ws + 2 * bevel, Hs + 2 * bevel, 14 + bevel);
  outer.holes.push(hole);
  const bezelGeo = new THREE.ExtrudeGeometry(outer, {
    depth: bezelDepth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 10,
  });
  const bezel = new THREE.Mesh(bezelGeo, materials.plastic);
  bezel.position.z = frontZ - bezelDepth - bevel;
  mon.add(bezel);

  // Dark tube face behind the HTML screen, so the opening never shows the inside
  const recess = new THREE.Mesh(new THREE.PlaneGeometry(Ws + 4 * bevel, Hs + 4 * bevel), materials.recess);
  recess.position.z = -2;
  mon.add(recess);

  // Housing: a straight-sided front section, then the tube tapering to the back
  // (mostly from the bottom and sides; the top stays nearly flat, like the real thing)
  const zFront = frontZ - bezelDepth - bevel;
  const zMid = zFront - L.depth * 0.45;
  const zBack = zFront - L.depth;
  // Flush with the bezel, so the box reads as one solid object
  const fw = W * 0.995;
  const fh = H * 0.995;
  const shell = [materials.plastic, materials.plastic, materials.plastic, materials.plasticDark, materials.plastic, materials.plasticDark];
  mon.add(new THREE.Mesh(frustumGeometry(fw, fh, fw, fh, zFront, zMid, cy, cy), shell));

  const bw = W * 0.56;
  const bh = H * 0.62;
  const backTop = cy + fh / 2 - H * 0.07;
  const funnel = new THREE.Mesh(
    frustumGeometry(fw, fh, bw, bh, zMid, zBack, cy, backTop - bh / 2),
    [materials.plastic, materials.plastic, materials.vents, materials.plasticDark, materials.plastic, materials.plasticDark]
  );
  mon.add(funnel);

  const neck = new THREE.Mesh(new RoundedBoxGeometry(W * 0.3, H * 0.32, L.depth * 0.2, 3, 10), materials.plasticDark);
  neck.position.set(0, backTop - bh / 2, zBack - L.depth * 0.07);
  mon.add(neck);

  // Chin details: model name, power LED, two knobs
  const chinY = -Hs / 2 - bc / 2;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(W * 0.34, 260), Math.min(bc * 0.4, 30)), materials.label);
  label.position.set(0, chinY, frontZ + 0.6);
  mon.add(label);

  const led = new THREE.Mesh(new THREE.SphereGeometry(Math.max(2.5, bc * 0.06), 16, 12), materials.led);
  led.position.set(W / 2 - b - Math.max(10, bc * 0.35), chinY, frontZ + 1);
  mon.add(led);

  if (!mobile) {
    for (let i = 0; i < 2; i++) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(bc * 0.13, bc * 0.15, bc * 0.12, 24), materials.plasticDark);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(-W / 2 + b + bc * (0.45 + i * 0.5), chinY, frontZ + bc * 0.06);
      mon.add(knob);
    }
  }

  // Tilted back on its swivel so that, after the rig's downward view, it faces the camera
  mon.rotation.x = -(L.tilt - L.view);
  return { mon, W, H, frontZ };
}

/**
 * Wedge-shaped keyboard with real keycaps and a green glow between them
 */
function buildKeyboard(Kw) {
  const kb = new THREE.Group();
  const u = Kw / 15.6;
  const Kd = u * 5.5;
  const hBack = u * 0.62;
  const hFront = u * 0.3;

  // Case: a box whose top slopes down towards you
  const caseGeo = new THREE.BoxGeometry(Kw, 1, Kd);
  const pos = caseGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const top = pos.getY(i) > 0;
    const back = pos.getZ(i) < 0;
    pos.setY(i, top ? (back ? hBack : hFront) : 0);
  }
  caseGeo.computeVertexNormals();
  kb.add(new THREE.Mesh(caseGeo, materials.plastic));

  // Deck follows the slope of the top
  const slope = Math.atan2(hBack - hFront, Kd);
  const deck = new THREE.Group();
  deck.position.y = (hBack + hFront) / 2;
  deck.rotation.x = slope;
  kb.add(deck);

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(Kw - u * 0.4, Kd - u * 0.4), materials.backlight);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.5;
  deck.add(glow);

  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
    [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
    [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
  ];
  const keys = [];
  rows.forEach((row, r) => {
    let x = -7.5;
    row.forEach((size, k) => {
      keys.push({ x: x + size / 2, z: (r - 2) * 1.0, size, accent: (r === 2 && k === row.length - 1) || (r === 0 && k === 0) });
      x += size;
    });
  });

  const capH = u * 0.42;
  const caps = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.14), materials.keycap, keys.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const colour = new THREE.Color();
  keys.forEach((k, i) => {
    m.compose(
      new THREE.Vector3(k.x * u, capH / 2 + u * 0.06, k.z * u),
      q,
      new THREE.Vector3(k.size * u - u * 0.14, capH, u * 0.86)
    );
    caps.setMatrixAt(i, m);
    caps.setColorAt(i, colour.set(k.accent ? 0x1f6a34 : 0x1c1f1e));
  });
  deck.add(caps);

  return { kb, Kd, hBack };
}

/**
 * Take the HTML screen out of the old model without three.js removing it from
 * the page (which would blur the input and reset the scroll position)
 */
function detachScreen() {
  if (!screenObj || !screenObj.parent) return;
  const siblings = screenObj.parent.children;
  siblings.splice(siblings.indexOf(screenObj), 1);
  screenObj.parent = null;
}

function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
  });
}

function buildWorld() {
  if (rig) {
    detachScreen();
    disposeTree(rig);
    scene.remove(rig);
  }

  const L = layout;
  rig = new THREE.Group();
  rig.rotation.order = "YXZ";
  rig.position.set(0, L.centerY, 0);
  scene.add(rig);

  const { mon, W, frontZ } = buildMonitor(L);
  rig.add(mon);

  // Where the desk is: just under the lowest point of the tilted monitor
  rig.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mon);
  const rigInverse = new THREE.Matrix4().copy(rig.matrixWorld).invert();
  box.applyMatrix4(rigInverse);
  const deskY = box.min.y - L.standH;
  const monBackZ = box.min.z;

  // Swivel base
  const base = new THREE.Mesh(new RoundedBoxGeometry(W * 0.5, L.standH + 6, L.depth * 0.55, 3, 6), materials.plasticDark);
  base.position.set(0, deskY + (L.standH + 6) / 2 - 3, (box.min.z + box.max.z) / 2 + L.depth * 0.05);
  rig.add(base);

  // Desk and back wall
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), materials.desk);
  desk.rotation.x = -Math.PI / 2;
  desk.position.y = deskY;
  rig.add(desk);

  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12000, 6000), materials.wall);
  wall.position.set(0, deskY + 3000, monBackZ - L.Ws * 0.9);
  rig.add(wall);

  // Keyboard in front, with a cable running back to the monitor
  if (L.keyboard) {
    const Kw = mobile ? L.Ws * 0.96 : L.Ws * 0.92;
    const { kb, Kd, hBack } = buildKeyboard(Kw);
    const kz = frontZ + Kd / 2 + (mobile ? L.Ws * 0.06 : L.Ws * 0.1);
    kb.position.set(0, deskY, kz);
    rig.add(kb);

    const start = new THREE.Vector3(Kw * 0.18, deskY + hBack * 0.5, kz - Kd / 2);
    const curve = new THREE.CatmullRomCurve3([
      start,
      new THREE.Vector3(Kw * 0.3, deskY + 3, kz - Kd / 2 - L.Ws * 0.08),
      new THREE.Vector3(W * 0.36, deskY + 3, (box.min.z + box.max.z) / 2),
      new THREE.Vector3(W * 0.22, deskY + 3, box.min.z + L.depth * 0.1),
    ]);
    rig.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, Math.max(2, L.Ws * 0.005), 8, false), materials.cable));
  }

  // Light: the screen is the light source; a faint cold rim keeps the silhouette readable
  const screenLight = new THREE.PointLight(0x47ff74, 2.6, L.Ws * 2.6, 0);
  screenLight.position.set(0, -L.Hs * 0.05, frontZ + L.Ws * 0.32);
  mon.add(screenLight);

  const spill = new THREE.PointLight(0x2cff5c, 1.1, L.Ws * 1.6, 0);
  spill.position.set(0, deskY + L.Hs * 0.25, frontZ + L.Ws * 0.5);
  rig.add(spill);

  // The HTML screen
  if (!mobile) {
    screenObj = screenObj || new CSS3DObject(screenEl);
    screenObj.position.set(0, 0, 0);
    mon.add(screenObj);
  }

  applyCamera();
}

function buildScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x010201);
  scene.add(new THREE.AmbientLight(0x2a3a30, 0.9));
  const rim = new THREE.DirectionalLight(0x9fc2b0, 0.9);
  rim.position.set(-1.2, 1.6, -1);
  scene.add(rim);
  // A dim lamp somewhere overhead, enough to catch the top of the tube
  const overhead = new THREE.DirectionalLight(0x7d9488, 1.1);
  overhead.position.set(0.4, 1, -0.3);
  scene.add(overhead);
  const key = new THREE.DirectionalLight(0x3a4a40, 0.5);
  key.position.set(0.6, 1.2, 1.4);
  scene.add(key);
}

// ------------------------------------------------
// Camera, sizing, rendering
// ------------------------------------------------

function applyCamera() {
  if (!rig) return;
  rig.rotation.y = cam.yaw;
  rig.rotation.x = layout.tilt + cam.pitch;
}

function relayout() {
  pending = 0;
  const vp = viewportSize();
  const nowMobile = mobileQuery.matches;
  const modeChanged = nowMobile !== mobile;
  mobile = nowMobile;
  layout = computeLayout(vp.w, vp.h);

  host.style.height = `${vp.h}px`;
  host.style.transform = `translateY(${vp.top}px)`;

  renderer.setSize(vp.w, vp.h);
  cssRenderer.setSize(vp.w, vp.h);
  camera.aspect = vp.w / vp.h;
  camera.fov = FOV;
  camera.position.set(0, 0, vp.h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
  camera.near = 1;
  camera.far = camera.position.z + 20000;
  camera.updateProjectionMatrix();
  scene.fog = new THREE.Fog(0x010201, camera.position.z * 0.95, camera.position.z + layout.Ws * 2.4);

  // Size the HTML screen to the tube
  screenEl.style.width = `${layout.Ws}px`;
  screenEl.style.height = `${layout.Hs}px`;
  root.classList.toggle("crt-scene-mobile", mobile);

  if (mobile) {
    if (modeChanged) detachScreen();
    // Fixed front view: no 3D transform on the text at all
    cam.yaw = cam.pitch = cam.tyaw = cam.tpitch = 0;
    if (screenEl.parentNode !== host) host.appendChild(screenEl);
    screenEl.style.transform = "";
    screenEl.style.left = `${Math.round(vp.w / 2 - layout.Ws / 2)}px`;
    screenEl.style.top = `${Math.round(vp.h / 2 - layout.centerY - layout.Hs / 2)}px`;
  } else {
    screenEl.style.left = "";
    screenEl.style.top = "";
  }

  buildWorld();
  render();

  // Let the game re-fit things that depend on the screen size
  if (typeof window.fitBanner === "function") window.fitBanner();
  if (typeof window.updateScrollIndicators === "function") window.updateScrollIndicators();
}

function scheduleRelayout() {
  if (!pending) pending = requestAnimationFrame(relayout);
}

function render() {
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

function frame() {
  cam.yaw += (cam.tyaw - cam.yaw) * EASE;
  cam.pitch += (cam.tpitch - cam.pitch) * EASE;

  const settled =
    Math.abs(cam.tyaw - cam.yaw) < 0.0002 && Math.abs(cam.tpitch - cam.pitch) < 0.0002;
  if (settled) {
    cam.yaw = cam.tyaw;
    cam.pitch = cam.tpitch;
  }

  applyCamera();
  render();
  raf = settled ? 0 : requestAnimationFrame(frame);
}

function nudge() {
  if (!raf) raf = requestAnimationFrame(frame);
}

// Click and drag on the room (not the screen) to orbit the monitor; it stays
// where you leave it. Double-click the room to look straight at it again.
let drag = null;

function onPointerDown(event) {
  if (mobile || event.button !== 0) return;
  drag = { x: event.clientX, y: event.clientY, yaw: cam.tyaw, pitch: cam.tpitch, id: event.pointerId };
  renderer.domElement.setPointerCapture(event.pointerId);
  root.classList.add("scene-dragging");
  event.preventDefault();
}

function onPointerMove(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  // Drag right to swing round to the right side, drag down to look from above
  cam.tyaw = THREE.MathUtils.clamp(drag.yaw - dx * DRAG_SPEED, -MAX_YAW, MAX_YAW);
  cam.tpitch = THREE.MathUtils.clamp(drag.pitch + dy * DRAG_SPEED, MIN_PITCH, MAX_PITCH);
  if (reduceMotion.matches) {
    cam.yaw = cam.tyaw;
    cam.pitch = cam.tpitch;
  }
  nudge();
}

function onPointerUp(event) {
  if (!drag || event.pointerId !== drag.id) return;
  drag = null;
  root.classList.remove("scene-dragging");
  // Give the prompt its focus back, as clicking the room would on a real desk
  const input = document.getElementById("command-input");
  if (input && !mobile) input.focus({ preventScroll: true });
}

function onDoubleClick() {
  if (mobile) return;
  cam.tyaw = 0;
  cam.tpitch = 0;
  nudge();
}

// ------------------------------------------------
// Start
// ------------------------------------------------

function init() {
  screenEl = document.querySelector(".screen-container");
  if (!screenEl) return;

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    return; // no WebGL: keep the flat layout
  }
  if (!renderer.getContext()) return;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  host = document.createElement("div");
  host.id = "scene";
  host.setAttribute("aria-hidden", "false");
  renderer.domElement.className = "scene-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const vignette = document.createElement("div");
  vignette.className = "scene-vignette";
  vignette.setAttribute("aria-hidden", "true");
  host.appendChild(vignette);

  cssRenderer = new CSS3DRenderer();
  cssRenderer.domElement.className = "scene-css";
  host.appendChild(cssRenderer.domElement);

  document.body.appendChild(host);

  camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);
  buildScene();

  root.classList.add("crt-scene");
  mobile = mobileQuery.matches;
  relayout();

  window.addEventListener("resize", scheduleRelayout);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleRelayout);
    window.visualViewport.addEventListener("scroll", scheduleRelayout);
  }
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("dblclick", onDoubleClick);

  // Fonts change the label texture and the text metrics
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleRelayout);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
