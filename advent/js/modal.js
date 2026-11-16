const $ = (id) => document.getElementById(id);

export function createModal({ onClose, onToggleBuilt, isBuilt, toast }) {
  const root = $('modal');
  let current = null, lastFocus = null;

  function fill(c) {
    $('mDay').textContent = c.day;
    $('mTitle').textContent = `${c.icon} ${c.title}`;
    $('mHook').textContent = c.hook;
    $('mDiff').textContent = ['', 'Elf apprentice', 'Workshop pro', "Santa's chief engineer"][c.difficulty] + '  ' + '❄'.repeat(c.difficulty) + '·'.repeat(3 - c.difficulty);
    $('mStory').textContent = c.story;
    $('mStretch').textContent = c.stretch;
    $('mReq').replaceChildren(...c.requirements.map((r) => Object.assign(document.createElement('li'), { textContent: r })));
    $('mNodes').replaceChildren(...c.nodes.map((n) => Object.assign(document.createElement('li'), { textContent: n })));
    syncBuilt();
  }

  function syncBuilt() {
    const b = $('builtBtn'), done = isBuilt(current.day);
    b.textContent = done ? '✓ Built! (click to undo)' : 'Mark as built';
    b.classList.toggle('done', done);
  }

  function markdown(c) {
    return [
      `# Day ${c.day}: ${c.title}`, `_${c.hook}_`, '', c.story, '', '## Requirements',
      ...c.requirements.map((r) => `- [ ] ${r}`), '', `**Nodes:** ${c.nodes.join(', ')}`, '', `**Stretch goal:** ${c.stretch}`,
    ].join('\n');
  }

  function open(c) {
    current = c; lastFocus = document.activeElement;
    fill(c);
    root.hidden = false;
    root.querySelector('.card').scrollTop = 0;
    root.querySelector('.close').focus({ preventScroll: true });
  }

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    current = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    onClose();
  }

  root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {   // simple focus trap
      const f = [...root.querySelectorAll('button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('builtBtn').addEventListener('click', () => { onToggleBuilt(current.day); syncBuilt(); });
  $('copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(markdown(current)); toast('Challenge copied. Time to open n8n!'); }
    catch { toast('Copy failed: select the text manually'); }
  });

  return { open, close, get isOpen() { return !root.hidden; } };
}
