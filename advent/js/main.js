import { createScene } from './scene.js';
import { createEffects } from './effects.js';
import { createAudio } from './audio.js';
import { createCalendar } from './calendar.js';
import { createModal } from './modal.js';

const $ = (id) => document.getElementById(id);
const mobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let world = null, fx = null;
try {
  world = createScene($('bg'), { mobile, reduced });
  fx = createEffects($('fx'), { mobile });
} catch (err) {
  // No WebGL? The calendar still works on a plain gradient.
  console.warn('WebGL unavailable', err);
  document.body.style.background = 'linear-gradient(#050b24, #2a2f6e)';
}

const audio = createAudio();
const app = $('app');
let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function updateProgress() {
  const { built, opened, total } = cal.counts();
  $('progressFill').style.width = `${(built / total) * 100}%`;
  $('progressText').textContent = `${built} / ${total} built · ${opened} doors opened`;
}

const modal = createModal({
  toast,
  isBuilt: (d) => cal.isBuilt(d),
  onToggleBuilt: (d) => {
    const nowBuilt = cal.toggleBuilt(d);
    updateProgress();
    if (nowBuilt && fx) { fx.play(1, innerWidth / 2, innerHeight * .4); audio.chime(d); toast('🎉 Workflow built. Nicely done!'); }
  },
  onClose: () => { document.body.classList.remove('zooming'); world?.dolly(0); },
});

let pendingDone = null;
const cal = createCalendar($('calendar'), {
  onLocked(day, month, today) {
    audio.thud();
    toast(month === 12 ? `🔒 Door ${day} opens on December ${day}. Only ${day - today} more sleeps!` : `🔒 The doors open from December 1st. Door ${day} on December ${day}.`);
  },
  onOpen(c, { x, y, done }) {
    pendingDone = done;
    app.style.setProperty('--ox', `${x}px`); app.style.setProperty('--oy', `${y}px`);
    const flash = $('flash');
    flash.style.setProperty('--fx', `${x}px`); flash.style.setProperty('--fy', `${y}px`);
    flash.className = 'flash ' + ['', 'ice', '', 'ice', 'aurora', ''][(c.day - 1) % 6];
    void flash.offsetWidth; flash.classList.add('go');

    document.body.classList.add('zooming');
    world?.dolly(7);
    audio.chime(c.day);
    fx?.play(c.day, x, y, { sleigh: $('sleigh') });
    setTimeout(() => modal.open(c), c.day === 24 ? 1700 : 1000);
    setTimeout(() => { pendingDone?.(); pendingDone = null; }, 1000);
  },
});

updateProgress();

// sound
$('soundBtn').addEventListener('click', () => {
  const on = audio.toggle();
  $('soundBtn').setAttribute('aria-pressed', String(on));
  $('soundBtn').innerHTML = `<span aria-hidden="true">${on ? '🔔' : '🔇'}</span> <span class="label">Sound ${on ? 'on' : 'off'}</span>`;
});

// pre-December banner / today banner
const banner = $('banner');
if (cal.demo) {
  banner.hidden = false; banner.textContent = '🎅 Preview mode: every door is unlocked.';
  $('previewLink').textContent = 'Back to the real calendar'; $('previewLink').href = '#home';
} else if (cal.month !== 12) {
  const d = cal.daysToStart();
  banner.hidden = false;
  banner.innerHTML = `⏳ The first door opens on <b>December 1st</b>${d ? ` — just ${d} day${d === 1 ? '' : 's'} to go` : ''}.`;
}

addEventListener('hashchange', () => location.reload());
