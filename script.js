const images = [
  "imgs/6f77e247-de89-45a6-84d7-e338380e570e.jpg",
  "imgs/5019061f-3c78-4d84-a6ac-54f740553f72.jpg",
  "imgs/a4ac4857-48c8-45db-91b9-72a0f4932541.jpg",
  "imgs/272f6e62-0f2c-49f3-a3fc-556930b40ce6.jpg",
  "imgs/352faaab-83a4-4188-85ae-42932c265193.jpg",
  "imgs/605ac24b-59d0-49e6-a3ff-0b943e970f21.jpg",
  "imgs/a94e8745-bf19-491a-94e3-4ce9eac31260.jpg",
  "imgs/b4d65230-5754-4667-a10a-8d60c0b7f1d2.jpg",
  "imgs/b9678bae-f2a8-4b05-857f-595f319af84a.jpg",
  "imgs/728bfbf7-1bfb-4c9d-84a6-b370621cb243.jpg"
];
const VOICE_URL = "";      
const CLICK_SOUND = "Recording (23).m4a";     
const CLICKS_TO_UNLOCK = 10;    


const game = document.getElementById("game");
const btnWrap = document.getElementById("btnWrap");
const btn = document.getElementById("btn");
const missed = document.getElementById("missed");
const aura = document.getElementById("aura");
const pic = document.getElementById("pic");
const picImg = document.getElementById("picImg");
const counter = document.getElementById("counter");
const prize = document.getElementById("prize");
const letter = document.getElementById("letter");
const voice = document.getElementById("voice");
let clicks = 0, btnX = 0, btnY = 0;


function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
const rand = (a, b) => Math.random() * (b - a) + a;


const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='#ffc531'/><text x='50' y='68' font-size='56' text-anchor='middle'>🙈</text></svg>");
picImg.onerror = () => { picImg.onerror = null; picImg.src = FALLBACK; };


["🎈", "⭐", "💛", "🎀", "✨", "🍬"].forEach((e, i) => {
  const s = document.createElement("span");
  s.className = "blob"; s.textContent = e;
  s.style.left = (8 + i * 16) + "%"; s.style.top = (12 + (i * 37) % 75) + "%";
  s.style.animationDelay = (-i) + "s";
  document.getElementById("bg").appendChild(s);
});


const stage = document.getElementById("stage");
function overlaps(x, y, w, h, r, gap) {
  return x < r.right + gap && x + w > r.left - gap && y < r.bottom + gap && y + h > r.top - gap;
}
function moveButton(animate = true) {
  const w = btnWrap.offsetWidth, h = btnWrap.offsetHeight, pad = 14, tag = 110;
  const card = stage.getBoundingClientRect();
  const minY = Math.max(190, innerHeight * 0.28);        
  let spot = null;
  for (let i = 0; i < 120 && !spot; i++) {                
    const x = rand(pad, Math.max(pad, innerWidth - w - pad));
    const y = rand(minY, Math.max(minY, innerHeight - h - pad));
    const onLeft = x > innerWidth / 2;                     
    const boxX = onLeft ? x - tag : x, boxW = w + tag;
    if (boxX < 0 || boxX + boxW > innerWidth) continue;
    if (!overlaps(boxX, y, boxW, h, card, 18)) spot = { x, y };
  }
  if (!spot) spot = { x: Math.max(pad, (innerWidth - w) / 2), y: Math.min(card.bottom + 24, innerHeight - h - pad) };
  if (!animate) btnWrap.style.transition = "none";
  btnX = spot.x; btnY = spot.y;
  btnWrap.style.transform = `translate(${btnX}px, ${btnY}px)`;
  if (!animate) { void btnWrap.offsetWidth; btnWrap.style.transition = ""; }
  missed.classList.toggle("left", btnX > innerWidth / 2);
}

function burst(x, y) {
  const colors = ["#ff4d3d", "#ffc531", "#7fd8b5", "#ff8fb1"];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "fx spark"; p.style.background = colors[i % 4];
    p.style.transform = `translate(${x}px,${y}px)`; document.body.appendChild(p);
    const a = (i / 12) * Math.PI * 2, d = rand(40, 90);
    p.animate([{ transform: `translate(${x}px,${y}px) scale(1)`, opacity: 1 },
    { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.2)`, opacity: 0 }],
      { duration: 550, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => p.remove();
  }
  const puff = document.createElement("div");
  puff.className = "fx puff"; puff.style.transform = `translate(${x - 28}px,${y - 28}px)`;
  document.body.appendChild(puff); setTimeout(() => puff.remove(), 500);
}

function floatUp(emojis, count) {
  for (let i = 0; i < count; i++) {
    const f = document.createElement("div");
    f.className = "fx rise"; f.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    f.style.left = rand(0, innerWidth - 40) + "px"; f.style.top = (innerHeight - 20) + "px";
    f.style.setProperty("--dx", rand(-40, 40) + "px");
    f.style.setProperty("--t", rand(2.8, 4.2) + "s");
    f.style.animationDelay = rand(0, .4) + "s";
    document.body.appendChild(f); setTimeout(() => f.remove(), 5000);
  }
}


const unusedImages = [...images];
const shownOrder = [];
let loopIndex = 0;
function showRandomPicture() {
  if (unusedImages.length > 0) {
    const i = Math.floor(Math.random() * unusedImages.length);
    const next = unusedImages.splice(i, 1)[0];        
    shownOrder.push(next);
    picImg.src = next;
  } else {
    picImg.src = shownOrder[loopIndex % shownOrder.length]; 
    loopIndex++;
  }
  pic.style.left = rand(10, Math.max(10, innerWidth - pic.offsetWidth - 10)) + "px";
  replay(pic, "show");
}


function playClickSound(){
  if (!CLICK_SOUND) return;
  const sound = new Audio(CLICK_SOUND);
  sound.volume = 0.35;
  const START = 0.85;    
  const LENGTH = 1.2;   
  sound.currentTime = START;         
  sound.play().catch(() => {});
}

btn.addEventListener("click", () => {
  const cx = btnX + btnWrap.offsetWidth / 2, cy = btnY + btnWrap.offsetHeight / 2;
  playClickSound();
  burst(cx, cy);           
  replay(btn, "squash");
  replay(game, "shake");
  replay(missed, "show");   
  replay(aura, "show");                
  showRandomPicture();
  floatUp(["🎈", "💖", "🎈", "❤️"], 10);
  if (navigator.vibrate) navigator.vibrate(30);

  clicks++;
  if (clicks <= CLICKS_TO_UNLOCK) counter.textContent = Math.min(clicks, CLICKS_TO_UNLOCK) + "/" + CLICKS_TO_UNLOCK;
  if (clicks === CLICKS_TO_UNLOCK) {
    document.getElementById("hint").innerHTML = "Mwehehehehe HAPPY BIRTHDAY KUYA JAMEL!i🥳🎂 (MAX VOLUME)";
    prize.classList.add("pop");
    floatUp(["🎈", "💖", "🎉", "🎂"], 17);
  }
  setTimeout(moveButton, 120);      
});


document.getElementById("envelope").addEventListener("click", () => {
  letter.classList.add("open");
  if (VOICE_URL) { voice.src = VOICE_URL; voice.play().catch(() => { }); }
  else voice.style.display = "none";
  startSong();
  floatUp(["🎈", "💖", "🎉"], 14);
});
document.getElementById("closeBtn").onclick = () => { letter.classList.remove("open"); voice.pause(); stopSong(); };
document.getElementById("songBtn").onclick = () => songOn ? stopSong() : startSong();


let ctx, songOn = false, songTimer;
const NOTES = [ // [frequency, beats]
  [261.6, .75], [261.6, .25], [293.7, 1], [261.6, 1], [349.2, 1], [329.6, 2],
  [261.6, .75], [261.6, .25], [293.7, 1], [261.6, 1], [392, 1], [349.2, 2],
  [261.6, .75], [261.6, .25], [523.3, 1], [440, 1], [349.2, 1], [329.6, 1], [293.7, 2],
  [466.2, .75], [466.2, .25], [440, 1], [349.2, 1], [392, 1], [349.2, 2]];
function startSong() {
  if (songOn) return;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume(); songOn = true;
  const beat = 0.5; let t = ctx.currentTime + .1;
  NOTES.forEach(([f, b]) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .02);
    g.gain.exponentialRampToValueAtTime(.001, t + b * beat);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + b * beat);
    t += b * beat;
  });
  songTimer = setTimeout(() => { songOn = false; startSong(); }, (t - ctx.currentTime + 1.2) * 1000);   
}
function stopSong() { songOn = false; clearTimeout(songTimer); if (ctx) ctx.close().then(() => ctx = null); }


function init() { moveButton(false); }
init();
addEventListener("resize", () => moveButton(false));
