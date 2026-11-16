import * as THREE from 'three';

// Snowy night-village backdrop: gradient sky, stars, aurora, moon, hills,
// pines with fairy lights, little houses and ~3000 falling snowflakes.
export function createScene(canvas, { mobile = false, reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  const baseCam = new THREE.Vector3(0, 3, 16);
  camera.position.copy(baseCam);

  const uniforms = { uTime: { value: 0 } };
  const updaters = [];

  /* ---- sky ---- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(300, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: {},
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 vP;
        void main(){
          float h = normalize(vP).y;
          vec3 top = vec3(0.012,0.03,0.12);
          vec3 mid = vec3(0.06,0.14,0.38);
          vec3 low = vec3(0.45,0.33,0.62);
          vec3 c = mix(low, mid, smoothstep(-0.05,0.35,h));
          c = mix(c, top, smoothstep(0.3,0.95,h));
          gl_FragColor = vec4(c,1.);
        }`,
    })
  );
  scene.add(sky);

  /* ---- stars ---- */
  {
    const n = mobile ? 700 : 1600;
    const pos = new Float32Array(n * 3), phase = new Float32Array(n), size = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = Math.random(), v = Math.random() * 0.9 + 0.05;
      const th = u * Math.PI * 2, y = v;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(th) * r * 250, y * 250, Math.sin(th) * r * 250 - 20], i * 3);
      phase[i] = Math.random() * 6.28; size[i] = Math.random() * 2.2 + 0.8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
      vertexShader: `attribute float phase; attribute float size; uniform float uTime; varying float vA;
        void main(){ vA = .55 + .45*sin(uTime*1.6 + phase*5.); gl_PointSize = size*(1.3+vA*.5)*${renderer.getPixelRatio().toFixed(1)}; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,0.,d)*vA; gl_FragColor = vec4(vec3(.85,.92,1.), a); }`,
    });
    scene.add(new THREE.Points(g, m));
  }

  /* ---- aurora ---- */
  {
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec2 vUv; uniform float uTime;
        void main(){
          float x = vUv.x*6.;
          float wave = sin(x*1.7 + uTime*.35)*.5 + sin(x*3.1 - uTime*.5)*.25 + sin(x*.7 + uTime*.15)*.4;
          float ray = .5 + .5*sin(x*40. + sin(x*7. + uTime)*2.);
          float y = vUv.y - .25 - wave*.12;
          float band = smoothstep(0.,.25,y) * smoothstep(1.,.15,y);
          vec3 col = mix(vec3(.1,1.,.55), vec3(.65,.3,1.), smoothstep(.2,.9,vUv.y + wave*.15));
          col = mix(col, vec3(1.,.4,.7), smoothstep(.75,1.,vUv.y)*.5);
          float a = band * (.25 + .35*ray) * smoothstep(0.,.1,vUv.x) * smoothstep(1.,.9,vUv.x);
          gl_FragColor = vec4(col, a*.55);
        }`,
    });
    const aur = new THREE.Mesh(new THREE.PlaneGeometry(260, 80, 1, 1), m);
    aur.position.set(0, 60, -170);
    aur.rotation.x = -0.12;
    scene.add(aur);
  }

  /* ---- moon ---- */
  {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 20, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,252,235,.85)'); g.addColorStop(.2, 'rgba(255,244,210,.8)');
    g.addColorStop(.24, 'rgba(255,240,205,.4)'); g.addColorStop(.5, 'rgba(180,200,255,.18)'); g.addColorStop(1, 'rgba(180,200,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    moon.scale.set(90, 90, 1); moon.position.set(-70, 62, -200);
    scene.add(moon);
  }

  /* ---- hills ---- */
  const hillRoot = new THREE.Group(); scene.add(hillRoot);
  const hillFns = [
    (x) => Math.sin(x * .018 + 1) * 9 + Math.sin(x * .05) * 3,
    (x) => Math.sin(x * .03 + 3) * 6 + Math.sin(x * .08 + 1) * 2,
    (x) => Math.sin(x * .045 + 5) * 4 + Math.sin(x * .11) * 1.2,
  ];
  const hillCfg = [
    { z: -110, y: -1,  color: 0x4a5fa8 },
    { z: -70,  y: -9,  color: 0x8fa5de },
    { z: -34,  y: -14, color: 0xdbe9ff },
  ];
  const hillSurface = [];
  hillCfg.forEach((cfg, i) => {
    const s = new THREE.Shape();
    const W = 260;
    s.moveTo(-W, -60);
    for (let x = -W; x <= W; x += 4) s.lineTo(x, hillFns[i](x));
    s.lineTo(W, -60);
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: cfg.color }));
    mesh.position.set(0, cfg.y, cfg.z);
    hillRoot.add(mesh);
    hillSurface.push((x) => hillFns[i](x) + cfg.y);
  });

  /* ---- pines with fairy lights ---- */
  const lightPts = [];
  function pine(x, z, h, surf) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.25, .35, h * .18, 6), new THREE.MeshBasicMaterial({ color: 0x3b2a2a }));
    trunk.position.y = h * .09; g.add(trunk);
    const tiers = 4;
    for (let t = 0; t < tiers; t++) {
      const r = h * .34 * (1 - t / (tiers + 0.6));
      const ch = h * .36;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, ch, 9), new THREE.MeshBasicMaterial({ color: 0x0f3a4a }));
      cone.position.y = h * .2 + t * h * .2 + ch / 2 - h * .06; g.add(cone);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(r * .78, ch * .5, 9), new THREE.MeshBasicMaterial({ color: 0xf2f8ff }));
      cap.position.y = cone.position.y + ch * .22; g.add(cap);
      // fairy lights spiral
      for (let k = 0; k < 4; k++) {
        const a = Math.random() * 6.28, rr = r * (.55 + Math.random() * .3);
        lightPts.push(new THREE.Vector3(x + Math.cos(a) * rr, surf(x) + cone.position.y - ch * .15 + Math.random() * ch * .3, z + Math.sin(a) * rr));
      }
    }
    g.position.set(x, surf(x) - .4, z);
    scene.add(g);
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  [-55, -42, -30, -18, 20, 32, 44, 58].forEach((x) => pine(x + rnd(-3, 3), -30 + rnd(-3, 3), rnd(10, 16), hillSurface[2]));
  [-80, -62, -48, 50, 66, 84].forEach((x) => pine(x + rnd(-2, 2), -66, rnd(12, 18), hillSurface[1]));
  [-30, -4, 22, 40].forEach((x) => pine(x, -104, rnd(10, 14), hillSurface[0]));

  {
    const n = lightPts.length;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), ph = new Float32Array(n);
    const palette = [[1, .35, .5], [1, .82, .4], [.4, .8, 1], [.6, 1, .6]];
    lightPts.forEach((p, i) => { pos.set([p.x, p.y, p.z], i * 3); col.set(palette[i % 4], i * 3); ph[i] = Math.random() * 6; });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
    scene.add(new THREE.Points(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
      vertexShader: `attribute vec3 color; attribute float phase; uniform float uTime; varying vec3 vC; varying float vA;
        void main(){ vC = color; vA = .5+.5*sin(uTime*2.2+phase); gl_PointSize = (9.+ vA*8.)*${renderer.getPixelRatio().toFixed(1)}; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,0.,d); gl_FragColor = vec4(vC, a*a*(.45+vA*.55)); }`,
    })));
  }

  /* ---- cosy houses ---- */
  function house(x, z, s, surf) {
    const g = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.BoxGeometry(5 * s, 3.4 * s, 4 * s), new THREE.MeshBasicMaterial({ color: 0x3a2f5c }));
    wall.position.y = 1.7 * s; g.add(wall);
    const roofGeo = new THREE.ConeGeometry(4.2 * s, 2.4 * s, 4);
    const roof = new THREE.Mesh(roofGeo, new THREE.MeshBasicMaterial({ color: 0xf5faff }));
    roof.rotation.y = Math.PI / 4; roof.position.y = 3.4 * s + 1.1 * s; g.add(roof);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffc766 });
    [[-1.2, 2], [1.2, 2]].forEach(([wx, wy]) => {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(1.1 * s, 1.1 * s), winMat);
      w.position.set(wx * s, wy * s, 2.02 * s); g.add(w);
    });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(.9 * s, 1.6 * s), new THREE.MeshBasicMaterial({ color: 0xff6a8a }));
    door.position.set(0, .8 * s, 2.02 * s); g.add(door);
    g.position.set(x, surf(x) - .2, z);
    scene.add(g);
    // glow halo
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(9 * s, 7 * s), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec2 vUv; void main(){ float d = length(vUv-.5)*2.; gl_FragColor = vec4(1.,.7,.3, pow(max(0.,1.-d),2.)*.22); }`,
    }));
    halo.position.set(x, surf(x) + 2.2 * s, z + 2.2 * s); scene.add(halo);
  }
  house(-36, -34, 1, hillSurface[2]);
  house(-10, -33, .8, hillSurface[2]);
  house(14, -36, 1.1, hillSurface[2]);
  house(38, -33, .9, hillSurface[2]);
  house(-52, -68, 1.2, hillSurface[1]);
  house(30, -70, 1.4, hillSurface[1]);

  /* ---- falling snow ---- */
  {
    const n = reduced ? 600 : mobile ? 1500 : 3200;
    const pos = new Float32Array(n * 3), seed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      pos.set([rnd(-50, 50), rnd(0, 45), rnd(-45, 18)], i * 3);
      seed.set([Math.random(), Math.random()], i * 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 2));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { ...uniforms, uWind: { value: 1 }, uPx: { value: renderer.getPixelRatio() } },
      vertexShader: `attribute vec2 seed; uniform float uTime; uniform float uWind; uniform float uPx; varying float vA;
        void main(){
          vec3 p = position;
          float speed = 1.2 + seed.x*2.0;
          p.y = mod(p.y - uTime*speed, 45.) - 4.;
          p.x += sin(uTime*.6*seed.y + seed.x*20.)*1.6 + uTime*.4*uWind;
          p.x = mod(p.x + 50., 100.) - 50.;
          vec4 mv = viewMatrix*modelMatrix*vec4(p,1.);
          gl_PointSize = (35.*(0.4+seed.y)) * uPx / -mv.z;
          vA = .45 + .55*seed.y;
          gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.12,d); gl_FragColor = vec4(1.,1.,1.,a*vA); }`,
    });
    const snow = new THREE.Points(g, m);
    snow.frustumCulled = false;
    scene.add(snow);
    scene.userData.snow = m;
  }

  /* ---- interaction & loop ---- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - .5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    mouse.tx = Math.max(-1, Math.min(1, e.gamma / 30));
    mouse.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });

  let dollyTarget = 0, dolly = 0;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 70 : 55;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) clock.getDelta(); });

  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.uTime.value += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    dolly += (dollyTarget - dolly) * 0.05;
    camera.position.set(baseCam.x + mouse.x * 2.2, baseCam.y - mouse.y * 1.0, baseCam.z - dolly);
    camera.lookAt(mouse.x * 1.2, 7 + dolly * .3, -20);
    if (scene.userData.snow) scene.userData.snow.uniforms.uWind.value = 1 + dolly * .6;
    updaters.forEach((u) => u(dt));
    renderer.render(scene, camera);
  }
  frame();

  return {
    /** push the camera into the scene; strength 0 returns to rest */
    dolly(v) { dollyTarget = v; },
  };
}
