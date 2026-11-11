// ───────────────────────── GAME CONTENT (loaded from game.json) ─────────────────────────
// Served via the jsDelivr CDN (free). Use @main for latest (cached ~12h) or pin a tag like @v1
const BASE_URL = "https://cdn.jsdelivr.net/gh/softchris/blackwood-manor@main/";
// raw URL of the blob link: the github.com/.../blob/... page itself is HTML, not JSON
const GAME_URL = "https://raw.githubusercontent.com/softchris/blackwood-manor/main/game.json";

// Chat endpoint of the Superintendent McGarrigle agent workflow (POST). If it is a Chat Trigger, add "/chat" to the end.
const SUPERINTENDENT_URL = "https://mystery-house.app.n8n.cloud/webhook/14c41b4d-96df-4013-bee7-1d7b2957805c";

let GAME = await this.helpers.httpRequest({ method: 'GET', url: GAME_URL, json: false });
if (Buffer.isBuffer(GAME)) GAME = GAME.toString('utf8');
if (typeof GAME === 'string') GAME = JSON.parse(GAME);

const CODENAMES = ['Inspector Fox', 'Detective Wren', 'Sleuth Magpie', 'Constable Heron', 'Agent Raven', 'Sergeant Otter', 'Miss Marple-ish', 'Inspector Badger'];

// ───────────────────────── STATE ─────────────────────────
const req = $('Parse Request').first().json;
const row = $input.first().json || {};
const q = req.query || {};
const now = Date.now();

const player = {
  pid: req.pid,
  codename: row.codename || CODENAMES[Math.floor(Math.random() * CODENAMES.length)] + ' #' + (10 + Math.floor(Math.random() * 90)),
  found: row.found || '',
  visited: row.visited || '',
  started_at: row.started_at || new Date(now).toISOString(),
  finished_at: row.finished_at || '',
  wrong: Number(row.wrong) || 0,
  score: Number(row.score) || 0,
};

const found = new Set(player.found.split(',').filter(Boolean));
const visited = new Set(player.visited.split(',').filter(Boolean));
const solved = !!player.finished_at;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const roomUnlocked = (id) => !GAME.rooms[id].requires || found.has(GAME.rooms[id].requires);
const itemsIn = (roomId) => Object.entries(GAME.items).filter(([, it]) => it.room === roomId);
const totalItems = Object.keys(GAME.items).length;
const totalRooms = Object.keys(GAME.rooms).length;

// Accusation unlocks once every clue is found and every room visited
const allDone = () => found.size >= totalItems && visited.size >= totalRooms;

// In-game navigation: links to every room (locked ones are shown but marked)
const nav = (currentId) => '<h3>Go to...</h3>' + Object.entries(GAME.rooms)
  .filter(([id]) => id !== currentId)
  .map(([id, r]) => roomUnlocked(id)
    ? `<a class="btn alt" href="?room=${id}">${esc(r.name)}</a>`
    : `<a class="btn alt locked" href="?room=${id}">🔒 ${esc(r.name)}</a>`)
  .join('');

// Build a full image URL from BASE_URL + obj.url
const assetUrl = (u) => {
  if (!u) return '';
  let full = /^https?:\/\//.test(u) ? u : BASE_URL.replace(/\/?$/, '/') + u.replace(/^\//, '');
  // github.com/.../blob/... serves an HTML page, so ask for the raw file instead
  if (/github\.com\/.+\/blob\//.test(full) && !full.includes('?')) full += '?raw=true';
  return full;
};
// Render an <img> only if the object has a url property
const img = (obj, cls = 'pic') =>
  obj && obj.url ? `<img class="${cls}" src="${esc(assetUrl(obj.url))}" alt="${esc(obj.name || '')}" loading="lazy">` : '';

// ───── ADMIN: ?admin=true marks every room visited and every item found ─────
const ADMIN_VALUE = 'true'; // change to a secret string to make it harder to guess
if (q.admin === ADMIN_VALUE) {
  Object.keys(GAME.items).forEach((id) => found.add(id));
  Object.keys(GAME.rooms).forEach((id) => visited.add(id));
}

// ───────────────────────── VIEW ─────────────────────────
const accuseBar = () => {
  if (solved || q.accuse !== undefined) return '';
  if (allDone()) return '<a class="btn red" href="?accuse">Make your accusation</a>';
  return `<a class="btn disabled" aria-disabled="true" tabindex="-1">Make your accusation</a>
    <p class="muted" style="text-align:center">Locked until you've visited every room and found every clue (${found.size}/${totalItems} clues, ${visited.size}/${totalRooms} rooms).</p>`;
};

// ───── MANOR MAP: a cut-away illustration drawn on the fly as inline SVG ─────
// Current room = glowing + detective pawn, visited = lit, unvisited = dim, locked = padlocked.
// Rooms not listed in MAP_LAYOUT are added as plain tiles under the house.
const MAP_LAYOUT = {
  library:    { x: 30,  y: 98,  w: 140, h: 100, floor: 84, px: 47 },
  kitchen:    { x: 170, y: 98,  w: 120, h: 100, floor: 84, px: 60 },
  greenhouse: { x: 290, y: 126, w: 92,  h: 72,  floor: 58, px: 46 },
  cellar:     { x: 30,  y: 210, w: 260, h: 76,  floor: 62, px: 130 },
};
let currentRoom = ''; // set by the room / item views

const mapProps = {
  library: () => {
    const cols = ['#8a2f2f', '#2f4f8a', '#3f7350', '#9a7430', '#5d3a73', '#a65a32'];
    const shelf = (x, seed) => {
      let s = `<rect x="${x}" y="10" width="38" height="74" fill="#24130a" stroke="#6a4526"/>`;
      for (let r = 0; r < 4; r++) {
        let bx = x + 2, i = 0;
        while (bx < x + 34) {
          const bw = 3 + ((seed + r * 7 + i * 3) % 3), bh = 12 + ((seed + i * 5 + r * 3) % 6);
          s += `<rect x="${bx}" y="${10 + (r + 1) * 18 - 2 - bh}" width="${bw}" height="${bh}" fill="${cols[(seed + i + r * 2) % 6]}"/>`;
          bx += bw + 0.7; i++;
        }
        s += `<rect x="${x}" y="${10 + (r + 1) * 18 - 2}" width="38" height="2.5" fill="#6a4526"/>`;
      }
      return s;
    };
    return `<rect width="140" height="84" fill="url(#pLib)" opacity=".5"/>
      ${shelf(5, 1)}${shelf(97, 4)}
      <rect x="58" y="12" width="24" height="28" rx="2" fill="#2a1a0a" stroke="#c9a227" stroke-width="2"/>
      <ellipse cx="70" cy="22" rx="5" ry="6" fill="#8a6a4a"/><path d="M62 38 Q70 26 78 38Z" fill="#4a3a5a"/>
      <rect x="52" y="42" width="36" height="5" fill="#6a4526"/>
      <path d="M56 84 V50 H84 V84Z" fill="#120d0a" stroke="#7a6a58" stroke-width="2"/>
      <circle cx="70" cy="76" r="20" fill="url(#gFire)"/>
      <path class="flame" d="M70 83 C60 75 65 66 70 56 C75 66 80 75 70 83Z" fill="#ff8a1e"/>
      <path class="flame" d="M70 83 C65 78 67 72 70 66 C73 72 75 78 70 83Z" fill="#ffd45a"/>
      <rect x="0" y="84" width="140" height="16" fill="#2a1a10"/>
      <path d="M96 84 l-3 -22 h-8 l-3 22Z" fill="#4a2a2a" stroke="#6a3a3a"/>`;
  },
  kitchen: () => {
    let s = `<rect width="120" height="84" fill="url(#pTile)" opacity=".35"/>
      <rect x="8" y="14" width="28" height="32" fill="url(#gSky)" stroke="#7a6a58" stroke-width="3"/>
      <path d="M22 14 V46 M8 30 H36" stroke="#7a6a58" stroke-width="2"/><circle cx="29" cy="22" r="3" fill="#f3ead0"/>
      <path d="M44 14 H114" stroke="#8a7a68" stroke-width="2"/>`;
    [52, 68, 84, 100].forEach((x, i) => {
      s += `<path d="M${x} 14 V${22 + i}" stroke="#8a7a68"/><circle cx="${x}" cy="${28 + i}" r="${6 - (i % 2)}" fill="#b0642e" stroke="#e2a15c"/>`;
    });
    return s + `<rect x="64" y="52" width="46" height="32" fill="#1f1d1c" stroke="#5a5450" stroke-width="2"/>
      <circle cx="76" cy="52" r="5" fill="#ff7a2e" opacity=".7"/><circle cx="98" cy="52" r="5" fill="#ff7a2e" opacity=".5"/>
      <rect x="71" y="42" width="18" height="11" rx="2" fill="#6a6e78"/><path d="M76 38 q-4 -6 0 -10 M84 38 q-4 -6 0 -10" stroke="#d8d4cc" stroke-opacity=".4" fill="none"/>
      <rect x="8" y="62" width="46" height="5" fill="#6a4526"/><path d="M12 67 V84 M50 67 V84" stroke="#4a2f1a" stroke-width="3"/>
      <rect x="16" y="58" width="24" height="4" rx="1" fill="#c9a227"/><path d="M22 58 q3 -8 8 0Z" fill="#f3ead0"/>
      <rect x="0" y="84" width="120" height="16" fill="#2e2620"/>`;
  },
  greenhouse: () => {
    let s = `<path d="M0 0 H92" stroke="#9fd6b8" stroke-opacity=".4"/>`;
    for (let x = 12; x < 92; x += 16) s += `<path d="M${x} 0 V58" stroke="#9fd6b8" stroke-opacity=".35"/>`;
    [14, 38, 62, 80].forEach((x, i) => {
      const h = 22 + (i % 2) * 8;
      s += `<path d="M${x} 56 V${56 - h}" stroke="#2f7a4a" stroke-width="2"/>`;
      for (let k = 0; k < 4; k++) s += `<ellipse cx="${x + (k % 2 ? 2 : -2)}" cy="${56 - h + k * 5}" rx="2.6" ry="3.4" fill="#a45ad0"/>`;
      s += `<path d="M${x} 52 q-8 -4 -9 -10 M${x} 50 q8 -4 9 -10" stroke="#3f9a5a" fill="none"/>`;
    });
    return s + `<rect x="2" y="56" width="88" height="5" fill="#6a4526"/><rect x="0" y="62" width="92" height="10" fill="#3a2a1e"/>`;
  },
  cellar: () => {
    let s = `<rect width="260" height="76" fill="url(#pStone)" opacity=".6"/>`;
    [0, 1, 2].forEach((i) => { s += `<path d="M${22 + i * 94} 62 V30 Q${69 + i * 94} -6 ${116 + i * 94} 30 V62" fill="none" stroke="#6a6a76" stroke-width="3"/>`; });
    const rack = (x) => {
      let r = `<rect x="${x}" y="22" width="50" height="40" fill="#24150b" stroke="#6a4526"/>`;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) r += `<circle cx="${x + 7 + j * 12}" cy="${30 + i * 12}" r="4.3" fill="${(i + j) % 3 ? '#143a22' : '#4a1a2a'}" stroke="#0a0a0a"/>`;
      return r;
    };
    s += rack(8) + rack(202);
    s += `<ellipse cx="100" cy="52" rx="14" ry="10" fill="#6a4526" stroke="#3a2412" stroke-width="2"/><path d="M87 48 H113 M87 56 H113" stroke="#c9a227" stroke-opacity=".6"/>
      <ellipse cx="160" cy="52" rx="14" ry="10" fill="#6a4526" stroke="#3a2412" stroke-width="2"/><path d="M147 48 H173 M147 56 H173" stroke="#c9a227" stroke-opacity=".6"/>`;
    return s + `<rect x="0" y="62" width="260" height="14" fill="#1e1e24"/>`;
  },
};

const mapSvg = () => {
  let extra = 0;
  const boxes = Object.keys(GAME.rooms).map((id) => {
    let b = MAP_LAYOUT[id];
    if (!b) { b = { x: 30 + (extra % 3) * 120, y: 302 + Math.floor(extra / 3) * 56, w: 112, h: 44, floor: 30, px: 56, plain: true }; extra++; }
    return [id, b];
  });
  const H = Math.max(300, ...boxes.map(([, b]) => b.y + b.h + 14));

  const stars = Array.from({ length: 34 }, (_, i) =>
    `<circle cx="${(i * 97) % 400}" cy="${(i * 53) % 90}" r="${i % 5 ? 0.7 : 1.2}" fill="#fff" opacity="${0.3 + (i % 4) * 0.17}"/>`).join('');

  const rooms = boxes.map(([id, b]) => {
    const locked = !roomUnlocked(id), cur = id === currentRoom, vis = visited.has(id);
    const label = GAME.rooms[id].name.replace(/^The\s+/i, '');
    const lw = label.length * 6.4 + 22, lx = b.w / 2 - lw / 2, ly = b.h - 15;
    const wall = b.plain ? '#2a231d' : `url(#w-${id})`;
    return `<a href="?room=${esc(id)}" aria-label="${esc(GAME.rooms[id].name)}${cur ? ' (you are here)' : locked ? ' (locked)' : ''}">
  <g class="room${cur ? ' cur' : locked ? ' lock' : vis ? ' vis' : ''}" transform="translate(${b.x} ${b.y})">
    ${cur ? `<rect x="-5" y="-5" width="${b.w + 10}" height="${b.h + 10}" rx="9" fill="#ffc83a" filter="url(#blur)" opacity=".75"/>` : ''}
    <rect class="frame" width="${b.w}" height="${b.h}" rx="4" fill="${wall}"/>
    <g clip-path="url(#c-${esc(id)})">${mapProps[id] ? mapProps[id]() : ''}
      ${cur ? `<rect width="${b.w}" height="${b.h}" fill="url(#gLamp)"/>` : ''}
      ${!cur && !vis && !locked ? `<rect width="${b.w}" height="${b.h}" fill="#05040a" opacity=".42"/>` : ''}
      ${locked ? `<rect width="${b.w}" height="${b.h}" fill="#05040a" opacity=".62"/>
        <g transform="translate(${b.w / 2} ${b.h / 2 - 4})"><path d="M-9 -2 V-9 a9 9 0 0 1 18 0 V-2" fill="none" stroke="#c9a227" stroke-width="3.5"/>
        <rect x="-13" y="-3" width="26" height="20" rx="3" fill="#c9a227" stroke="#7a5f10" stroke-width="1.5"/><circle cx="0" cy="6" r="2.6" fill="#3a2d08"/><rect x="-1" y="7" width="2" height="6" fill="#3a2d08"/></g>` : ''}
    </g>
    <rect class="edge" width="${b.w}" height="${b.h}" rx="4" fill="none" stroke="${cur ? '#ffd45a' : vis ? '#4d8f5f' : '#5a4d40'}" stroke-width="${cur ? 3 : 2}"${locked ? ' stroke-dasharray="6 4"' : ''}/>
    ${cur ? `<g transform="translate(${b.px} ${b.floor})"><g class="pawn"><ellipse cy="1" rx="7" ry="2" fill="#000" opacity=".4"/><path d="M-6 0 Q-6 -12 0 -13 Q6 -12 6 0Z" fill="#ffd45a" stroke="#14110f" stroke-width="1.2"/><circle cy="-17" r="4.5" fill="#ffd45a" stroke="#14110f" stroke-width="1.2"/><path d="M-6 -19 H6 M-3.5 -21 Q0 -26 3.5 -21Z" fill="#14110f" stroke="#14110f" stroke-width="1.5"/></g></g>` : ''}
    <rect x="${lx}" y="${ly}" width="${lw}" height="12" rx="3" fill="${cur ? '#ffd45a' : '#14110f'}" fill-opacity="${cur ? 1 : 0.78}" stroke="#c9a227" stroke-opacity=".7"/>
    <text class="lab" x="${b.w / 2}" y="${ly + 9}" text-anchor="middle" fill="${cur ? '#14110f' : locked ? '#9a8f80' : '#eadfcf'}">${cur ? '● ' : ''}${esc(label)}</text>
  </g></a>`;
  }).join('');

  const clips = boxes.map(([id, b]) => `<clipPath id="c-${esc(id)}"><rect width="${b.w}" height="${b.h}" rx="4"/></clipPath>`).join('');
  const walls = {
    library: ['#5a3624', '#34190f'], kitchen: ['#6e5c46', '#463a2e'],
    greenhouse: ['#35705a', '#1d3f33'], cellar: ['#3a3a46', '#1f1f27'],
  };
  const wallDefs = boxes.map(([id]) => { const w = walls[id] || ['#3a322b', '#211c18']; return `<linearGradient id="w-${esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w[0]}"/><stop offset="1" stop-color="${w[1]}"/></linearGradient>`; }).join('');

  return `<svg class="map" viewBox="0 0 400 ${H}" role="img" aria-label="Cut-away map of ${esc(GAME.title)}">
  <defs>
    <linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0e1d"/><stop offset=".6" stop-color="#2a2145"/><stop offset="1" stop-color="#5a3a55"/></linearGradient>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a38"/><stop offset="1" stop-color="#3a3a66"/></linearGradient>
    <linearGradient id="gRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4d66"/><stop offset="1" stop-color="#1f2133"/></linearGradient>
    <linearGradient id="gSoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f17"/><stop offset="1" stop-color="#120d0a"/></linearGradient>
    <linearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d4a30"/><stop offset="1" stop-color="#1a2a1c"/></linearGradient>
    <radialGradient id="gMoon"><stop offset="0" stop-color="#fff6d0" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></radialGradient>
    <radialGradient id="gFire"><stop offset="0" stop-color="#ff9a2e" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a2e" stop-opacity="0"/></radialGradient>
    <radialGradient id="gLamp" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#ffd878" stop-opacity=".42"/><stop offset="1" stop-color="#ffd878" stop-opacity="0"/></radialGradient>
    <radialGradient id="gFog"><stop offset="0" stop-color="#cfd6e8" stop-opacity=".28"/><stop offset="1" stop-color="#cfd6e8" stop-opacity="0"/></radialGradient>
    <pattern id="pLib" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M5 0 V10" stroke="#c9a227" stroke-opacity=".25"/><circle cx="0" cy="5" r="1.2" fill="#c9a227" fill-opacity=".25"/></pattern>
    <pattern id="pTile" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="none" stroke="#f3ead0" stroke-opacity=".35"/></pattern>
    <pattern id="pStone" width="26" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 H26 M13 0 V7 M0 7 V14 M26 7 V14" stroke="#000" stroke-opacity=".5" fill="none"/></pattern>
    <pattern id="pSlate" width="12" height="8" patternUnits="userSpaceOnUse"><path d="M0 7.5 H12 M6 0 V7.5" stroke="#000" stroke-opacity=".35" fill="none"/></pattern>
    <pattern id="pBrick" width="14" height="8" patternUnits="userSpaceOnUse"><path d="M0 4 H14 M7 0 V4 M0 4 V8" stroke="#000" stroke-opacity=".4" fill="none"/></pattern>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
    ${wallDefs}${clips}
  </defs>
  <rect width="400" height="${H}" fill="url(#gNight)"/>
  ${stars}
  <circle cx="340" cy="38" r="34" fill="url(#gMoon)"/><circle cx="340" cy="38" r="15" fill="#f6edc8"/><circle cx="335" cy="34" r="3" fill="#e2d6a8"/><circle cx="346" cy="44" r="2" fill="#e2d6a8"/>
  <path d="M296 62 q5 -5 9 0 q4 -5 9 0 q-5 1 -9 6 q-4 -5 -9 -6Z" fill="#0a0814"/><path d="M262 40 q4 -4 7 0 q3 -4 7 0 q-4 1 -7 5 q-3 -4 -7 -5Z" fill="#0a0814"/>
  <path d="M0 150 q10 -40 24 -8 q8 -34 22 4 L46 198 H0Z" fill="#0b0a12"/><path d="M0 120 v-12 M0 134 l12 -12" stroke="#0b0a12" stroke-width="3"/>
  <rect y="196" width="400" height="14" fill="url(#gGrass)"/><rect y="208" width="400" height="${H - 208}" fill="url(#gSoil)"/>
  <rect y="208" width="400" height="${H - 208}" fill="url(#pStone)" opacity=".08"/>
  <ellipse class="fog" cx="200" cy="198" rx="210" ry="9" fill="url(#gFog)"/>
  <rect x="20" y="196" width="284" height="14" fill="#3a3640"/><rect x="20" y="196" width="284" height="14" fill="url(#pStone)" opacity=".7"/>
  <rect x="18" y="92" width="14" height="106" fill="#4a3a36"/><rect x="18" y="92" width="14" height="106" fill="url(#pBrick)"/>
  <rect x="288" y="92" width="14" height="106" fill="#4a3a36"/><rect x="288" y="92" width="14" height="106" fill="url(#pBrick)"/>
  <rect x="58" y="34" width="14" height="30" fill="#4a3a36"/><rect x="58" y="34" width="14" height="30" fill="url(#pBrick)"/><rect x="55" y="31" width="20" height="5" fill="#2a2220"/>
  <rect x="246" y="38" width="14" height="26" fill="#4a3a36"/><rect x="246" y="38" width="14" height="26" fill="url(#pBrick)"/><rect x="243" y="35" width="20" height="5" fill="#2a2220"/>
  <g class="smoke" fill="#cfd6e8"><circle cx="65" cy="24" r="4" opacity=".25"/><circle cx="70" cy="14" r="5" opacity=".18"/><circle cx="76" cy="4" r="6" opacity=".1"/></g>
  <polygon points="14,98 74,48 246,48 306,98" fill="url(#gRoof)" stroke="#14121c" stroke-width="2"/>
  <polygon points="14,98 74,48 246,48 306,98" fill="url(#pSlate)"/>
  <path d="M150 48 V32 L160 20 L170 32 V48Z" fill="#35364a" stroke="#14121c" stroke-width="2"/><rect x="154" y="32" width="12" height="14" fill="#ffd878" opacity=".85"/><path d="M160 32 V46 M154 39 H166" stroke="#14121c"/>
  <path d="M160 20 V8" stroke="#8a7a68" stroke-width="1.5"/><path d="M160 8 L176 13 L160 18Z" fill="#b3392f"/>
  ${rooms}
</svg>`;
};

const page = (inner) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(GAME.title)}</title>
<style>
  :root{--bg:#14110f;--card:#211c18;--ink:#eadfcf;--muted:#9a8f80;--gold:#c9a227;--red:#b3392f;--green:#4d8f5f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 Georgia,'Times New Roman',serif}
  .wrap{max-width:560px;margin:0 auto;padding:20px 16px 48px}
  .bar{display:flex;justify-content:space-between;gap:8px;font:13px system-ui,sans-serif;color:var(--muted);border-bottom:1px solid #3a322b;padding-bottom:10px;margin-bottom:18px}
  h1,h2,h3{font-weight:normal;color:var(--gold);margin:.2em 0 .4em}
  h1{font-size:30px}h2{font-size:24px}h3{font-size:18px}
  .card{background:var(--card);border:1px solid #3a322b;border-radius:10px;padding:14px 16px;margin:14px 0;overflow:hidden}
  .quote{font-style:italic}
  .muted{color:var(--muted);font-size:14px}
  .ok{color:var(--green)}.bad{color:var(--red)}
  a.btn{display:block;text-align:center;text-decoration:none;background:var(--gold);color:#14110f;padding:13px;border-radius:8px;font:600 16px system-ui,sans-serif;margin:10px 0}
  a.btn.alt{background:transparent;color:var(--gold);border:1px solid var(--gold)}
  a.btn.red{background:var(--red);color:#fff}
  a.btn.locked{opacity:.55;border-style:dashed}
  a.spot{color:var(--gold)}
  .mapbox{margin:0 0 14px;border-radius:12px;overflow:hidden;border:1px solid #3a322b;box-shadow:0 6px 22px rgba(0,0,0,.5)}
  svg.map{display:block;width:100%;height:auto}
  svg.map a{cursor:pointer;outline:none}
  svg.map .lab{font:600 9px Georgia,serif;letter-spacing:.3px}
  svg.map a:hover .edge,svg.map a:focus-visible .edge{stroke:#ffd45a}
  svg.map .cur .edge{animation:mapPulse 1.8s ease-in-out infinite}
  svg.map .pawn{animation:mapBob 1.4s ease-in-out infinite}
  svg.map .flame{transform-box:fill-box;transform-origin:50% 100%;animation:mapFlick .45s ease-in-out infinite alternate}
  svg.map .smoke{animation:mapSmoke 5s ease-in-out infinite alternate}
  svg.map .fog{animation:mapFog 9s ease-in-out infinite alternate}
  @keyframes mapPulse{50%{stroke-opacity:.35}}
  @keyframes mapBob{50%{transform:translateY(-2px)}}
  @keyframes mapFlick{to{transform:scaleY(1.18) scaleX(.92)}}
  @keyframes mapSmoke{to{transform:translate(6px,-4px);opacity:.6}}
  @keyframes mapFog{to{transform:translateX(14px)}}
  @media (prefers-reduced-motion:reduce){svg.map *{animation:none!important}}
  .btn.disabled{background:#3a322b;color:#7a7065;cursor:not-allowed;pointer-events:none}
  ul{padding-left:20px}li{margin:6px 0}
  img.pic{display:block;width:100%;height:auto;border-radius:8px;border:1px solid #3a322b;margin:10px 0}
  img.portrait{float:right;width:96px;height:96px;object-fit:cover;border-radius:50%;border:2px solid var(--gold);margin:0 0 8px 12px}
  img.thumb{display:block;width:100%;max-width:220px;height:auto;border-radius:6px;margin:6px 0}
  .sup-btn{position:relative;flex:none;width:44px;height:44px;margin:-8px -4px -8px 0;padding:0;background:none;border:0;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .sup-btn svg{width:40px;height:40px;display:block;margin:2px;transition:transform .15s,filter .15s}
  .sup-btn:hover svg,.sup-btn:focus-visible svg{transform:scale(1.08);filter:drop-shadow(0 0 6px rgba(201,162,39,.7))}
  .sup-btn:focus-visible{outline:2px solid var(--gold);outline-offset:1px}
  .sup-btn .dot{position:absolute;top:3px;right:3px;width:9px;height:9px;border-radius:50%;background:var(--red);border:2px solid var(--bg);animation:supDot 2s ease-in-out infinite}
  .sup-btn.seen .dot{display:none}
  @keyframes supDot{50%{transform:scale(1.35)}}
  .bar .stats{margin-left:auto;margin-right:10px;align-self:center}
  .bar{align-items:center}
  body.sup-open{overflow:hidden}
  #sup-modal{position:fixed;inset:0;z-index:50;display:none;align-items:flex-end;justify-content:center;background:rgba(5,4,8,.72);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
  #sup-modal.open{display:flex;animation:supFade .18s ease-out}
  .sup-panel{width:100%;max-width:520px;height:min(640px,100dvh);display:flex;flex-direction:column;background:var(--bg);border:1px solid #5a4d40;border-radius:16px 16px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.6);animation:supUp .22s ease-out;overflow:hidden}
  @media (min-width:600px){#sup-modal{align-items:center}.sup-panel{border-radius:16px;height:min(640px,90dvh)}}
  @media (max-width:599px){.sup-panel{height:100dvh;border-radius:0;border:0}}
  .sup-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#1b1612;border-bottom:1px solid #3a322b;font-family:system-ui,sans-serif}
  .sup-head svg{width:38px;height:38px;flex:none}
  .sup-head .t{flex:1;min-width:0;line-height:1.25}
  .sup-head .t b{display:block;color:var(--gold);font:600 15px Georgia,serif}
  .sup-head .t span{font-size:12px;color:var(--muted)}
  .sup-x{width:40px;height:40px;border:0;border-radius:50%;background:transparent;color:var(--ink);font-size:26px;line-height:1;cursor:pointer}
  .sup-x:hover,.sup-x:focus-visible{background:#2a231d}
  .sup-log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:14px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch}
  .msg{max-width:86%;padding:9px 13px;border-radius:14px;font:15px/1.45 system-ui,sans-serif;white-space:pre-wrap;word-wrap:break-word}
  .msg.boss{align-self:flex-start;background:var(--card);border:1px solid #3a322b;border-bottom-left-radius:4px}
  .msg.me{align-self:flex-end;background:var(--gold);color:#14110f;border-bottom-right-radius:4px}
  .msg.err{align-self:center;background:transparent;color:var(--red);font-size:13px;text-align:center}
  .typing{align-self:flex-start;display:none;gap:4px;padding:12px 14px;background:var(--card);border:1px solid #3a322b;border-radius:14px;border-bottom-left-radius:4px}
  .typing.on{display:flex}
  .typing i{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:supType 1.1s infinite}
  .typing i:nth-child(2){animation-delay:.18s}.typing i:nth-child(3){animation-delay:.36s}
  @keyframes supType{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  @keyframes supFade{from{opacity:0}}
  @keyframes supUp{from{transform:translateY(24px);opacity:0}}
  .sup-form{display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #3a322b;background:#1b1612}
  .sup-form input{flex:1;min-width:0;padding:11px 14px;border-radius:22px;border:1px solid #5a4d40;background:#120f0d;color:var(--ink);font:16px system-ui,sans-serif}
  .sup-form input:focus{outline:2px solid var(--gold);outline-offset:0;border-color:transparent}
  .sup-form button{flex:none;width:44px;height:44px;border:0;border-radius:50%;background:var(--gold);color:#14110f;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .sup-form button:disabled{opacity:.5;cursor:default}
  @media (prefers-reduced-motion:reduce){.sup-btn .dot,.sup-panel,#sup-modal.open,.typing i{animation:none!important}}
</style></head><body><div class="wrap">
<div class="bar"><span>${esc(player.codename)}</span><span class="stats">Clues ${found.size}/${totalItems} · Rooms ${visited.size}/${totalRooms}</span>
  <button type="button" class="sup-btn" id="sup-btn" aria-label="Call Superintendent McGarrigle" aria-haspopup="dialog" title="Call the Superintendent"><svg viewBox="0 0 40 40" aria-hidden="true">
  <defs><clipPath id="supClipA"><circle cx="20" cy="20" r="18.5"/></clipPath>
  <radialGradient id="supBgA" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#3a2f22"/><stop offset="1" stop-color="#17120e"/></radialGradient></defs>
  <circle cx="20" cy="20" r="19" fill="url(#supBgA)" stroke="#c9a227" stroke-width="1.6"/>
  <g clip-path="url(#supClipA)">
    <path d="M2 40 Q4 28 14 26 L26 26 Q36 28 38 40Z" fill="#4a4a5c"/>
    <path d="M14 26 L20 33 L17 40 H8 Z M26 26 L20 33 L23 40 H32 Z" fill="#363646" stroke="#6a6a7c" stroke-width=".6"/>
    <path d="M17 29 L20 34 L23 29Z" fill="#e8e0d0"/><path d="M19 30 L20 40 L21 30Z" fill="#8a2f2f"/>
    <rect x="17.6" y="22" width="4.8" height="6" fill="#d9b28a"/>
    <ellipse cx="20" cy="19.5" rx="6.3" ry="7.4" fill="#ecc9a2"/>
    <path d="M14 22 Q20 28 26 22 Q26 25.5 20 27 Q14 25.5 14 22Z" fill="#5a4630" opacity=".35"/>
    <ellipse cx="20" cy="14.6" rx="13" ry="3.4" fill="#2a2018"/>
    <path d="M12 14.4 Q12.5 5 20 5 Q27.5 5 28 14.4Z" fill="#5a4630"/>
    <path d="M12.1 12.7 Q20 15.4 27.9 12.7 V10.6 Q20 13.2 12.1 10.6Z" fill="#14110f"/>
    <path d="M17 3.8 Q20 6.5 23 3.8" stroke="#3a2d1e" stroke-width="1.4" fill="none"/>
    <path d="M14.8 19.2 H18.4 M21.6 19.2 H25.2" stroke="#14110f" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M16.6 24.2 Q20 22.4 23.4 24.2 Q20 23.6 16.6 24.2Z" fill="#3a2d1e"/>
    <circle cx="30" cy="30" r="5.3" fill="rgba(255,216,120,.22)" stroke="#c9a227" stroke-width="1.8"/>
    <path d="M33.8 33.8 L38 38" stroke="#c9a227" stroke-width="2.4" stroke-linecap="round"/>
  </g></svg><span class="dot"></span></button></div>
<div class="mapbox">${mapSvg()}</div>
${inner}
${accuseBar()}
</div>
<div id="sup-modal" role="dialog" aria-modal="true" aria-labelledby="sup-title" aria-hidden="true">
  <div class="sup-panel">
    <div class="sup-head"><svg viewBox="0 0 40 40" aria-hidden="true">
  <defs><clipPath id="supClipB"><circle cx="20" cy="20" r="18.5"/></clipPath>
  <radialGradient id="supBgB" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#3a2f22"/><stop offset="1" stop-color="#17120e"/></radialGradient></defs>
  <circle cx="20" cy="20" r="19" fill="url(#supBgB)" stroke="#c9a227" stroke-width="1.6"/>
  <g clip-path="url(#supClipB)">
    <path d="M2 40 Q4 28 14 26 L26 26 Q36 28 38 40Z" fill="#4a4a5c"/>
    <path d="M14 26 L20 33 L17 40 H8 Z M26 26 L20 33 L23 40 H32 Z" fill="#363646" stroke="#6a6a7c" stroke-width=".6"/>
    <path d="M17 29 L20 34 L23 29Z" fill="#e8e0d0"/><path d="M19 30 L20 40 L21 30Z" fill="#8a2f2f"/>
    <rect x="17.6" y="22" width="4.8" height="6" fill="#d9b28a"/>
    <ellipse cx="20" cy="19.5" rx="6.3" ry="7.4" fill="#ecc9a2"/>
    <path d="M14 22 Q20 28 26 22 Q26 25.5 20 27 Q14 25.5 14 22Z" fill="#5a4630" opacity=".35"/>
    <ellipse cx="20" cy="14.6" rx="13" ry="3.4" fill="#2a2018"/>
    <path d="M12 14.4 Q12.5 5 20 5 Q27.5 5 28 14.4Z" fill="#5a4630"/>
    <path d="M12.1 12.7 Q20 15.4 27.9 12.7 V10.6 Q20 13.2 12.1 10.6Z" fill="#14110f"/>
    <path d="M17 3.8 Q20 6.5 23 3.8" stroke="#3a2d1e" stroke-width="1.4" fill="none"/>
    <path d="M14.8 19.2 H18.4 M21.6 19.2 H25.2" stroke="#14110f" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M16.6 24.2 Q20 22.4 23.4 24.2 Q20 23.6 16.6 24.2Z" fill="#3a2d1e"/>
    <circle cx="30" cy="30" r="5.3" fill="rgba(255,216,120,.22)" stroke="#c9a227" stroke-width="1.8"/>
    <path d="M33.8 33.8 L38 38" stroke="#c9a227" stroke-width="2.4" stroke-linecap="round"/>
  </g></svg><div class="t"><b id="sup-title">Superintendent McGarrigle</b><span>Your superior · on the line</span></div>
      <button type="button" class="sup-x" id="sup-close" aria-label="Hang up">&times;</button></div>
    <div class="sup-log" id="sup-log" aria-live="polite"><div class="typing" id="sup-typing"><i></i><i></i><i></i></div></div>
    <form class="sup-form" id="sup-form" autocomplete="off">
      <input id="sup-input" type="text" enterkeyhint="send" maxlength="500" placeholder="Report to the Superintendent..." aria-label="Message">
      <button type="submit" id="sup-send" aria-label="Send"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>
    </form>
  </div>
</div>
<script>
(function(){
  var SUP = ${JSON.stringify({ url: SUPERINTENDENT_URL, pid: player.pid, room: currentRoom, found: [...found], visited: [...visited] }).replace(/</g, '\\u003c')};
  var KEY = 'sup-chat-' + SUP.pid;
  var modal = document.getElementById('sup-modal'), log = document.getElementById('sup-log'),
      typing = document.getElementById('sup-typing'), form = document.getElementById('sup-form'),
      input = document.getElementById('sup-input'), send = document.getElementById('sup-send'),
      btn = document.getElementById('sup-btn');
  var GREETING = 'Detective. McGarrigle here. Lord Ashworth is dead, the doors were locked from the inside, and I have four suspects and no patience. What have you got for me?';
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) {}
  try { if (localStorage.getItem('sup-seen')) btn.classList.add('seen'); } catch (e) {}
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-40))); } catch (e) {} }
  function add(cls, text, keep) {
    var d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = text;
    log.insertBefore(d, typing); log.scrollTop = log.scrollHeight;
    if (keep) { history.push({ c: cls, t: text }); save(); }
  }
  function render() {
    if (!history.length) { history.push({ c: 'boss', t: GREETING }); save(); }
    history.forEach(function (m) { add(m.c, m.t, false); });
  }
  render();
  function open() {
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('sup-open');
    btn.classList.add('seen'); try { localStorage.setItem('sup-seen', '1'); } catch (e) {}
    log.scrollTop = log.scrollHeight; setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('sup-open'); btn.focus();
  }
  btn.addEventListener('click', open);
  document.getElementById('sup-close').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  function pick(j) {
    var o = Array.isArray(j) ? j[0] : j; if (!o) return '';
    if (typeof o === 'string') return o;
    return o.output || o.text || o.message || o.response || o.reply || '';
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim(); if (!text || send.disabled) return;
    input.value = ''; add('me', text, true);
    send.disabled = true; typing.classList.add('on'); log.scrollTop = log.scrollHeight;
    var ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, 60000);
    fetch(SUP.url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
      body: JSON.stringify({ action: 'sendMessage', sessionId: SUP.pid, chatInput: text, message: text,
        context: { room: SUP.room, found: SUP.found, visited: SUP.visited } })
    }).then(function (r) {
      return r.text().then(function (raw) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var out = raw; try { out = pick(JSON.parse(raw)) || raw; } catch (x) {}
        return out;
      });
    }).then(function (out) {
      add('boss', String(out).trim() || 'Hmph. Say that again, Detective.', true);
    }).catch(function () {
      add('err', 'The line went dead. Try again in a moment.', false);
    }).then(function () {
      clearTimeout(timer); typing.classList.remove('on'); send.disabled = false; input.focus();
    });
  });
})();
</script>
</body></html>`;

const notebook = () => {
  if (!found.size) return '<p class="muted">Your notebook is empty. Explore the rooms to find clues.</p>';
  return '<ul>' + [...found].map((id) => `<li><strong>${esc(GAME.items[id].name)}</strong> <span class="muted">(${esc(GAME.rooms[GAME.items[id].room].name)})</span>${img(GAME.items[id], 'thumb')}${esc(GAME.items[id].text)}</li>`).join('') + '</ul>';
};

const lockedView = (roomId) => `
  <h2>🔒 ${esc(GAME.rooms[roomId].name)}</h2>
  <div class="card"><p>${esc(GAME.rooms[roomId].locked || 'This room is locked.')}</p></div>
  ${nav(roomId)}
  <a class="btn alt" href="?">My case file</a>`;

let body = '';

if (q.room && GAME.rooms[q.room]) {
  // ───── ROOM SCAN ─────
  const id = q.room;
  const room = GAME.rooms[id];
  if (!roomUnlocked(id)) {
    body = lockedView(id);
  } else {
    visited.add(id);
    currentRoom = id;
    const s = GAME.suspects[room.suspect];
    const here = itemsIn(id);
    body = `
      <h2>${esc(room.name)}</h2>
      ${img(room)}
      <p>${esc(room.desc)}</p>
      <div class="card">
        ${img(s, 'portrait')}
        <h3>${esc(s.name)} <span class="muted">– ${esc(s.role)}</span></h3>
        <p class="quote">“${esc(s.statement)}”</p>
      </div>
      <h3>Look around</h3>
      ${here.length ? '<ul>' + here.map(([k, it]) => found.has(k)
        ? `<li>✔ <a class="spot" href="?item=${k}">${esc(it.name)}</a></li>`
        : `<li>🔍 <a class="spot" href="?item=${k}">${esc(it.spot || 'Something catches your eye')}</a></li>`).join('') + '</ul>'
        : '<p class="muted">Nothing of interest here.</p>'}
      ${nav(id)}
      <a class="btn alt" href="?">My case file</a>`;
  }
} else if (q.item && GAME.items[q.item]) {
  // ───── ITEM SCAN ─────
  const id = q.item;
  const it = GAME.items[id];
  if (!roomUnlocked(it.room)) {
    body = lockedView(it.room);
  } else {
    visited.add(it.room);
    currentRoom = it.room;
    const isNew = !found.has(id);
    found.add(id);
    const unlocks = Object.entries(GAME.rooms).filter(([, r]) => r.requires === id).map(([, r]) => r.name);
    body = `
      <h2>${isNew ? 'Clue found!' : 'Already in your notebook'}</h2>
      <div class="card"><h3>${esc(it.name)}</h3>${img(it)}<p>${esc(it.text)}</p></div>
      ${isNew && unlocks.length ? `<p class="ok"><strong>New location unlocked:</strong> ${esc(unlocks.join(', '))}</p>` : ''}
      <p class="muted">${found.size} of ${totalItems} clues collected.</p>
      <a class="btn" href="?room=${it.room}">Back to ${esc(GAME.rooms[it.room].name)}</a>
      <a class="btn alt" href="?">My case file</a>`;
  }
} else if (q.accuse !== undefined) {
  // ───── ACCUSATION ─────
  const guess = q.accuse;
  if (solved) {
    body = `<h2>Case closed</h2><div class="card"><p class="ok">You already solved this one. Final score: <strong>${player.score}</strong>.</p></div><a class="btn alt" href="?">My case file</a>`;
  } else if (!allDone()) {
    body = `
      <h2>Not yet, detective</h2>
      <div class="card"><p>You haven’t gathered enough evidence to accuse anyone. Visit every room and find every clue first.</p></div>
      <a class="btn alt" href="?">Back to my case file</a>`;
  } else if (GAME.suspects[guess]) {
    if (guess === GAME.killer) {
      const elapsed = Math.round((now - new Date(player.started_at).getTime()) / 1000);
      player.finished_at = new Date(now).toISOString();
      player.score = Math.max(0, Math.round(1200 - elapsed / 2 - player.wrong * 150));
      const k = GAME.suspects[guess];
      body = `
        <h2>🎉 Case solved!</h2>
        <div class="card">
          ${img(k, 'portrait')}
          <p><strong>${esc(k.name)}</strong> did it. Cornered by the evidence, the butler confesses: the cellar was being quietly sold off, and Lord Ashworth was about to call in the auditors.</p>
          <p>Time: <strong>${Math.floor(elapsed / 60)}m ${elapsed % 60}s</strong> · Wrong accusations: <strong>${player.wrong}</strong></p>
          <p>Score: <strong>${player.score}</strong></p>
        </div>
        <p class="muted">Show this screen at the booth to claim your prize.</p>`;
    } else {
      player.wrong += 1;
      body = `
        <h2 class="bad">Not quite...</h2>
        <div class="card"><p>${esc(GAME.suspects[guess].name)} has an answer for everything, and your accusation falls flat. (-150 points)</p></div>
        <a class="btn" href="?accuse">Try again</a><a class="btn alt" href="?">Back to my case file</a>`;
    }
  } else {
    body = `
      <h2>Make your accusation</h2>
      <p class="muted">Careful: each wrong accusation costs you points.</p>
      ${Object.entries(GAME.suspects).map(([id, s]) => `<a class="btn red" href="?accuse=${id}">${esc(s.name)} <span style="opacity:.8">– ${esc(s.role)}</span></a>`).join('')}
      <a class="btn alt" href="?">Not yet, back to my case file</a>`;
  }
} else {
  // ───── LOBBY / CASE FILE ─────
  const fresh = !visited.size && !found.size;
  body = `
    <h1>${esc(GAME.title)}</h1>
    ${fresh ? `<p>${esc(GAME.intro)}</p><p>Choose a room below to step inside.</p>` : '<h3>Your case file</h3>' + notebook()}
    ${nav('')}`;
}

// ───────────────────────── OUTPUT ─────────────────────────
return [{
  json: {
    html: page(body),
    player: {
      pid: player.pid,
      codename: player.codename,
      found: [...found].join(','),
      visited: [...visited].join(','),
      started_at: player.started_at,
      finished_at: player.finished_at,
      wrong: player.wrong,
      score: player.score,
    },
  },
}];