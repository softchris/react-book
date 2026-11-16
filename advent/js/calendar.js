import { CHALLENGES } from './challenges.js';

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const store = {
  get(k) { try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); } },
  set(k, s) { try { localStorage.setItem(k, JSON.stringify([...s])); } catch { /* private mode */ } },
};

export function createCalendar(root, { onOpen, onLocked }) {
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo') === '1' || location.hash === '#demo';
  // ?today=12-07 pretends it is that date (handy for testing)
  const fake = (params.get('today') || '').match(/^(\d{1,2})-(\d{1,2})$/);
  const now = new Date();
  const month = fake ? +fake[1] : now.getMonth() + 1;
  const dayOfMonth = fake ? +fake[2] : now.getDate();

  const unlocked = (n) => demo || (month === 12 && dayOfMonth >= n);
  const opened = store.get('n8n-advent-opened');
  const built = store.get('n8n-advent-built');

  // fixed shuffle so the layout is stable between visits
  const rnd = mulberry32(2025);
  const order = [...CHALLENGES].sort(() => rnd() - .5);
  const slots = new Map();

  order.forEach((c, i) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.color = String(c.day % 6);
    slot.innerHTML = `
      <div class="inside"><span class="tick" aria-hidden="true">✅</span><span class="ico">${c.icon}</span><span class="ttl">${c.title}</span></div>
      <button class="door" type="button"><span class="num">${c.day}</span><span class="sprig" aria-hidden="true">❄</span></button>`;
    const btn = slot.querySelector('.door');
    slots.set(c.day, slot);
    root.appendChild(slot);

    // tilt toward the cursor
    slot.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || slot.classList.contains('opening')) return;
      const r = slot.getBoundingClientRect();
      slot.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 14}deg`);
      slot.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 14}deg`);
    });
    slot.addEventListener('pointerleave', () => { slot.style.removeProperty('--rx'); slot.style.removeProperty('--ry'); });
    btn.addEventListener('click', () => click(c, slot, btn));
  });

  function label(c, slot) {
    const btn = slot.querySelector('.door');
    btn.setAttribute('aria-label', slot.classList.contains('locked')
      ? `Door ${c.day}, locked until December ${c.day}`
      : `Door ${c.day}, ${opened.has(c.day) ? 'opened' : 'ready to open'}`);
  }

  function refresh() {
    CHALLENGES.forEach((c) => {
      const s = slots.get(c.day);
      s.classList.toggle('locked', !unlocked(c.day));
      s.classList.toggle('today', unlocked(c.day) && !opened.has(c.day) && (demo ? false : dayOfMonth === c.day));
      s.classList.toggle('ajar', opened.has(c.day) && !s.classList.contains('opening'));
      s.classList.toggle('built', built.has(c.day));
      label(c, s);
    });
  }

  function click(c, slot, btn) {
    if (slot.classList.contains('opening')) return;
    if (!unlocked(c.day)) {
      slot.classList.remove('shake'); void slot.offsetWidth; slot.classList.add('shake');
      onLocked(c.day, month, dayOfMonth);
      return;
    }
    const r = btn.getBoundingClientRect();
    slot.classList.remove('ajar');
    slot.classList.add('opening');
    opened.add(c.day); store.set('n8n-advent-opened', opened);
    onOpen(c, { x: r.left + r.width / 2, y: r.top + r.height / 2, rect: r, done: () => { slot.classList.remove('opening'); refresh(); } });
  }

  function toggleBuilt(day) {
    built.has(day) ? built.delete(day) : built.add(day);
    store.set('n8n-advent-built', built);
    refresh();
    return built.has(day);
  }

  refresh();
  return {
    c: CHALLENGES, demo, month, dayOfMonth,
    isBuilt: (d) => built.has(d),
    toggleBuilt,
    counts: () => ({ built: built.size, opened: opened.size, total: CHALLENGES.length }),
    daysToStart() {
      if (month === 12) return 0;
      const y = now.getFullYear();
      const start = new Date(y, 11, 1), t = new Date(y, now.getMonth(), now.getDate());
      return Math.max(0, Math.round((start - t) / 864e5));
    },
  };
}
