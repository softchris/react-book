// Tiny Web Audio music box: no audio files. Plays a looping carol + door chimes.
const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99 };
// "Jingle Bells" (public domain), [note, beats]
const TUNE = [
  ['E4', 1], ['E4', 1], ['E4', 2], ['E4', 1], ['E4', 1], ['E4', 2], ['E4', 1], ['G4', 1], ['C4', 1.5], ['D4', .5], ['E4', 4],
  ['F4', 1], ['F4', 1], ['F4', 1.5], ['F4', .5], ['F4', 1], ['E4', 1], ['E4', 1], ['E4', .5], ['E4', .5], ['E4', 1], ['D4', 1], ['D4', 1], ['E4', 1], ['D4', 2], ['G4', 2],
];

export function createAudio() {
  let ctx = null, master = null, enabled = false, timer = null, step = 0;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.35;
    const delay = ctx.createDelay(); delay.delayTime.value = 0.28;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
  }

  function bell(freq, when = 0, vol = 0.25, dur = 1.4) {
    const t = ctx.currentTime + when;
    [[1, 1], [2.76, .25], [5.4, .08]].forEach(([mul, amp]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq * mul;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * amp, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / mul ** .3);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .1);
    });
  }

  function loop() {
    if (!enabled) return;
    const [note, beats] = TUNE[step % TUNE.length];
    bell(N[note], 0, .22, 1.1);
    const ms = beats * 330;
    step++;
    timer = setTimeout(loop, ms + (step % TUNE.length === 0 ? 1800 : 0));
  }

  return {
    get enabled() { return enabled; },
    toggle() {
      init(); if (ctx.state === 'suspended') ctx.resume();
      enabled = !enabled;
      clearTimeout(timer);
      if (enabled) { step = 0; loop(); }
      return enabled;
    },
    chime(day = 1) {
      if (!enabled || !ctx) return;
      const seq = [N.C5, N.E5, N.G5, N.E5 * 2 / 2 + 130, N.G5 * 1.25];
      seq.forEach((f, i) => bell(f, i * 0.09, .2, 1.8));
      if (day % 6 === 0) [N.C5, N.G5, N.E5 * 2].forEach((f, i) => bell(f, .5 + i * .1, .18, 2.4));
    },
    thud() {
      if (!enabled || !ctx) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(50, t + .2);
      g.gain.setValueAtTime(.4, t); g.gain.exponentialRampToValueAtTime(.001, t + .25);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .3);
    },
  };
}
