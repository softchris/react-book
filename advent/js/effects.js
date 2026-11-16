import * as THREE from 'three';

// Particle layer drawn above the whole page. Coordinates are CSS pixels (y down).
// One ShaderMaterial draws every particle shape: glow, ornament, shard, star.
const MAX = 4000;

export function createEffects(canvas, { mobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  const pr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pr);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10);

  const pos = new Float32Array(MAX * 3), col = new Float32Array(MAX * 3);
  const size = new Float32Array(MAX), alpha = new Float32Array(MAX), shape = new Float32Array(MAX), rot = new Float32Array(MAX);
  const geo = new THREE.BufferGeometry();
  const attr = (name, arr, n) => { const a = new THREE.BufferAttribute(arr, n); a.setUsage(THREE.DynamicDrawUsage); geo.setAttribute(name, a); return a; };
  const aPos = attr('position', pos, 3), aCol = attr('color', col, 3), aSize = attr('size', size, 1),
        aAlpha = attr('alpha', alpha, 1), aShape = attr('shape', shape, 1), aRot = attr('rot', rot, 1);

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uPx: { value: pr } },
    vertexShader: `
      attribute vec3 color; attribute float size; attribute float alpha; attribute float shape; attribute float rot;
      uniform float uPx; varying vec3 vC; varying float vA; varying float vS; varying float vR;
      void main(){ vC = color; vA = alpha; vS = shape; vR = rot; gl_PointSize = size*uPx;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `
      varying vec3 vC; varying float vA; varying float vS; varying float vR;
      void main(){
        vec2 p = gl_PointCoord - .5;
        float c = cos(vR), s = sin(vR);
        vec2 q = vec2(c*p.x - s*p.y, s*p.x + c*p.y);
        float d = length(p);
        if (vS < .5) {                      // soft glow
          float a = smoothstep(.5, 0., d); gl_FragColor = vec4(vC*(1.+a), a*a*vA);
        } else if (vS < 1.5) {              // ornament ball
          if (d > .5) discard;
          vec2 h = p + vec2(.14,.16);
          float spec = smoothstep(.16, 0., length(h));
          float shade = smoothstep(-.5,.5, -p.y*.9 - p.x*.4);
          vec3 base = vC*(.45 + .7*shade);
          float rim = smoothstep(.38,.5,d);
          vec3 colr = base + spec*.9 - rim*.25;
          if (abs(p.y + .46) < .05 && abs(p.x) < .09) colr = vec3(1.,.85,.4);   // gold cap
          gl_FragColor = vec4(colr, vA);
        } else if (vS < 2.5) {              // ice shard (diamond)
          float k = abs(q.x)/.17 + abs(q.y)/.48;
          if (k > 1.) discard;
          float edge = smoothstep(1., .75, k);
          vec3 colr = mix(vec3(1.), vC, .5 + .5*k) * (.7 + .5*(1.-k) + .3*step(0., q.x));
          gl_FragColor = vec4(colr, vA*(.55 + .45*edge));
        } else {                            // six-point star / snowflake
          float ang = atan(q.y, q.x);
          float spikes = pow(abs(cos(ang*3.)), 6.);
          float r = d/(.18 + .32*spikes);
          float a = smoothstep(1., .6, r) + smoothstep(.12,0.,d);
          gl_FragColor = vec4(vC*1.2, clamp(a,0.,1.)*vA);
        }
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // particle store
  const ps = [];
  const tasks = [];     // { t, fn } delayed calls
  const streams = [];   // { t, dur, fn(dt, k) } per-frame emitters
  let W = 1, H = 1;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  const R = (a, b) => a + Math.random() * (b - a);
  const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
  const pick = (arr) => hex(arr[(Math.random() * arr.length) | 0]);
  const GOLD = [0xffd36b, 0xffb347, 0xfff1b8], PINK = [0xea4b71, 0xff7a98, 0xffa6bb], ICE = [0xcfe6ff, 0xffffff, 0x9fd0ff], FEST = [0xea4b71, 0xffd36b, 0x3fa386, 0x5f86e6, 0xffffff];

  function emit(o) {
    if (ps.length >= MAX) return;
    ps.push({
      x: o.x, y: o.y, vx: o.vx || 0, vy: o.vy || 0, g: o.g || 0, drag: o.drag ?? 0.6,
      life: o.life || 1.5, age: 0, size: o.size || 10, grow: o.grow || 0, col: o.col || [1, 1, 1],
      shape: o.shape || 0, rot: o.rot || 0, spin: o.spin || 0, bounce: o.bounce || 0, a: o.a ?? 1, fade: o.fade ?? 1,
      sway: o.sway || 0, swayF: o.swayF || 0, ph: Math.random() * 6.28, tw: o.tw || 0,
    });
  }

  /* ---------- the six door effects ---------- */
  function fireworks(x, y, big) {
    const bursts = big ? 9 : 5;
    for (let b = 0; b < bursts; b++) {
      tasks.push({ t: b * 0.16, fn: () => {
        const bx = b === 0 ? x : x + R(-.35, .35) * W * (big ? 1.2 : .7), by = b === 0 ? y : y + R(-.4, .1) * H;
        const palette = [GOLD, PINK, ICE, FEST[2] ? [0x3fa386, 0x7ee0b8] : GOLD][b % 4];
        const n = mobile ? 70 : 120;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 6.283 + R(-.05, .05), sp = R(120, 420) * (i % 2 ? 1 : .65);
          emit({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 240, drag: 1.3, life: R(1.1, 1.9), size: R(8, 18), col: pick(palette), tw: 1 });
        }
        for (let i = 0; i < 14; i++) emit({ x: bx, y: by, vx: R(-200, 200), vy: R(-200, 200), g: 60, drag: 1, life: 1.5, size: R(22, 36), col: pick(palette), shape: 3, spin: R(-4, 4), rot: R(0, 6) });
      } });
    }
  }

  function snowstorm(x, y) {
    streams.push({ t: 0, dur: 1.5, fn: (dt, k) => {
      const n = Math.round((mobile ? 90 : 160) * dt * (1.2 - k * .5)) + 1;
      for (let i = 0; i < n * 2; i++) {
        const a = (k * 14) + R(0, 6.283), sp = R(120, 520) * (1 - k * .3);
        emit({ x, y, vx: Math.cos(a) * sp + 60, vy: Math.sin(a) * sp - 90, g: 40, drag: .9, life: R(1.4, 2.6), size: R(8, 26), col: pick(ICE), shape: Math.random() < .35 ? 3 : 0, spin: R(-3, 3), a: .9 });
      }
    } });
    tasks.push({ t: .2, fn: () => ring(x, y, ICE) });
  }

  function ornaments(x, y) {
    const cols = [0xea4b71, 0xffd36b, 0x3fa386, 0x5f86e6, 0xc673d8, 0xff7a98];
    for (let i = 0; i < (mobile ? 10 : 16); i++) {
      tasks.push({ t: i * .05, fn: () => emit({
        x, y, vx: R(-380, 380), vy: R(-900, -450), g: 1500, drag: .05, life: 4.2, size: R(34, 64), col: hex(cols[i % cols.length]), shape: 1, bounce: .62, fade: .4,
      }) });
    }
    for (let i = 0; i < 40; i++) emit({ x, y, vx: R(-300, 300), vy: R(-500, 50), g: 500, life: R(.8, 1.4), size: R(8, 16), col: pick(GOLD), tw: 1 });
  }

  function shatter(x, y) {
    const n = mobile ? 110 : 200;
    for (let i = 0; i < n; i++) {
      const a = R(0, 6.283), sp = R(150, 700);
      emit({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, g: 700, drag: .35, life: R(1.4, 2.6), size: R(18, 58), col: pick(ICE), shape: 2, rot: R(0, 6.28), spin: R(-9, 9), a: .95 });
    }
    for (let i = 0; i < 70; i++) emit({ x, y, vx: R(-250, 250), vy: R(-250, 150), g: 300, life: R(.6, 1.2), size: R(10, 22), col: [1, 1, 1], tw: 1 });
    ring(x, y, ICE);
  }

  function aurora(x, y) {
    streams.push({ t: 0, dur: 1.8, fn: (dt, k) => {
      const n = Math.round(220 * dt) + 2;
      for (let i = 0; i < n; i++) {
        const sx = x + R(-1, 1) * W * .45 * Math.min(1, k * 2 + .15);
        const cols = [0x4dffb0, 0x37e2d5, 0x9a7bff, 0xff7ac8];
        emit({ x: sx, y: y + R(-40, 80), vx: R(-20, 20), vy: R(-420, -180), g: -20, drag: .3, life: R(1.8, 3), size: R(40, 100), col: pick(cols), a: .35, sway: R(20, 70), swayF: R(1.5, 3.5) });
      }
    } });
    tasks.push({ t: .3, fn: () => ring(x, y, [0x4dffb0, 0x9a7bff]) });
    tasks.push({ t: .6, fn: () => { for (let i = 0; i < 50; i++) emit({ x: x + R(-300, 300), y: y + R(-300, 100), vx: R(-30, 30), vy: R(-60, 0), life: R(1, 2), size: R(6, 12), col: [1, 1, 1], tw: 1 }); } });
  }

  function candy(x, y) {
    streams.push({ t: 0, dur: 1.3, fn: (dt, k) => {
      for (let arm = 0; arm < 4; arm++) {
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const kk = k + (s / steps) * dt / 1.3;
          const th = kk * 16 + arm * 1.5708, r = 30 + kk * Math.max(W, H) * .5;
          const red = (Math.floor(kk * 40) % 2) === 0;
          emit({ x: x + Math.cos(th) * r, y: y + Math.sin(th) * r * .8, vx: Math.cos(th) * 30, vy: Math.sin(th) * 30, drag: .4, life: R(1.1, 1.7), size: red ? 16 : 14, col: red ? hex(0xe53555) : [1, 1, 1], shape: red ? 0 : 0, a: .95 });
        }
      }
    } });
    for (let i = 0; i < 26; i++) tasks.push({ t: .15 + i * .04, fn: () => emit({ x: x + R(-60, 60), y: y + R(-60, 60), vx: R(-260, 260), vy: R(-420, -80), g: 520, life: R(1.2, 2), size: R(26, 44), col: pick(FEST), shape: 3, spin: R(-5, 5), rot: R(0, 6) }) });
  }

  function ring(x, y, palette) {
    const n = mobile ? 50 : 90;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283;
      emit({ x: x + Math.cos(a) * 20, y: y + Math.sin(a) * 20, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, drag: 2.2, life: .9, size: R(10, 18), col: pick(palette), a: .9 });
    }
  }

  /* ---------- sleigh flyover (day 24) ---------- */
  function sleighFlyover(el) {
    const dur = 6.5; let t = 0;
    el.style.opacity = 1;
    streams.push({ t: .4, dur, fn: (dt, k) => {
      const sx = -200 + (W + 400) * k, sy = H * (.22 - Math.sin(k * Math.PI) * .12) + Math.sin(k * 9) * 10;
      const ang = Math.atan2(-Math.cos(k * Math.PI) * 60, W) * 2;
      el.style.transform = `translate(${sx}px, ${sy}px) rotate(${ang}rad)`;
      for (let i = 0; i < 6; i++) emit({ x: sx + R(-20, 80), y: sy + 30 + R(-10, 20), vx: R(-120, -40), vy: R(-20, 50), g: 20, life: R(.8, 1.6), size: R(8, 22), col: pick(GOLD), tw: 1 });
      if (k > .98) el.style.opacity = 0;
    } });
  }

  /* ---------- engine ---------- */
  function play(day, x, y, opts = {}) {
    const variant = (day - 1) % 6;
    const finale = day % 6 === 0;
    [fireworks, snowstorm, ornaments, shatter, aurora, candy][variant](x, y);
    if (finale) {
      tasks.push({ t: .5, fn: () => fireworks(x, y, true) });
      tasks.push({ t: 1.4, fn: () => fireworks(W / 2, H * .4, true) });
    }
    if (day === 24 && opts.sleigh) { tasks.push({ t: .8, fn: () => sleighFlyover(opts.sleigh) }); tasks.push({ t: 2.5, fn: () => fireworks(W / 2, H * .35, true) }); }
    return { variant, finale };
  }

  let last = performance.now(), time = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;

    for (let i = tasks.length - 1; i >= 0; i--) { tasks[i].t -= dt; if (tasks[i].t <= 0) { const f = tasks[i].fn; tasks.splice(i, 1); f(); } }
    for (let i = streams.length - 1; i >= 0; i--) {
      const s = streams[i];
      if (s.t > 0) { s.t -= dt; continue; }
      s.elapsed = (s.elapsed || 0) + dt;
      const k = Math.min(1, s.elapsed / s.dur);
      s.fn(dt, k);
      if (k >= 1) streams.splice(i, 1);
    }

    let n = 0;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.age += dt;
      if (p.age >= p.life) { ps[i] = ps[ps.length - 1]; ps.pop(); continue; }
    }
    for (let i = 0; i < ps.length && n < MAX; i++, n++) {
      const p = ps[i];
      p.vy += p.g * dt;
      const d = Math.exp(-p.drag * dt); p.vx *= d; p.vy *= d;
      p.x += p.vx * dt + (p.sway ? Math.sin(time * p.swayF + p.ph) * p.sway * dt : 0);
      p.y += p.vy * dt;
      if (p.bounce && p.y > H - p.size / 2 && p.vy > 0) { p.y = H - p.size / 2; p.vy *= -p.bounce; p.vx *= .85; }
      p.rot += p.spin * dt;
      const k = p.age / p.life;
      let a = p.a * (1 - Math.pow(k, 2.2 * p.fade + .4));
      if (p.tw) a *= .6 + .4 * Math.sin(time * 30 + p.ph * 7);
      if (p.sway || p.size > 38 && p.shape === 0) a *= Math.min(1, k * 6);
      pos[n * 3] = p.x; pos[n * 3 + 1] = -p.y; pos[n * 3 + 2] = 0;
      col[n * 3] = p.col[0]; col[n * 3 + 1] = p.col[1]; col[n * 3 + 2] = p.col[2];
      size[n] = p.size * (1 + p.grow * k); alpha[n] = a; shape[n] = p.shape; rot[n] = p.rot;
    }
    geo.setDrawRange(0, n);
    [aPos, aCol, aSize, aAlpha, aShape, aRot].forEach((a) => { a.needsUpdate = true; });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return { play };
}
