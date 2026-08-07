/* ==========================================================================
   SARİBAY STUDIO - INTERACTIVE ENGINE & ANIMATIONS (Three.js & Anime.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    soundEnabled: false,
    audioCtx: null,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
  };

  /* ==========================================================================
     1. PRELOADER & ENTRANCE ANIMATIONS
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderPercent = document.getElementById('loader-percent');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);

      setTimeout(() => {
        preloader.classList.add('exit');
        document.body.classList.remove('loading');
        initScrollAnimations();
        initTypingEffect();
        initCookieBanner();
      }, 400);
    }
    loaderFill.style.width = `${progress}%`;
    loaderPercent.textContent = `${progress}%`;
  }, 40);

  /* ==========================================================================
     2. COOKIE CONSENT BANNER POPUP
     ========================================================================== */
  function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-accept-cookies');
    const btnNecessary = document.getElementById('btn-necessary-cookies');

    if (!cookieBanner) return;

    const cookieConsent = localStorage.getItem('saribay_cookie_consent');
    if (!cookieConsent) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 2000);
    }

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        localStorage.setItem('saribay_cookie_consent', 'accepted_all');
        cookieBanner.classList.remove('show');
        playSynthBeep(600);
      });
    }

    if (btnNecessary) {
      btnNecessary.addEventListener('click', () => {
        localStorage.setItem('saribay_cookie_consent', 'necessary_only');
        cookieBanner.classList.remove('show');
        playSynthBeep(400);
      });
    }
  }

  /* ==========================================================================
     3. THREE.JS 3D WEBGL AMBIENT CANVAS (Embers & Gold Mesh)
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Ember System
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 60;
      scales[i / 3] = Math.random() * 0.4 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xC9A84C,
      size: 0.6,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating Golden Wireframe Octahedron
    const geoWire = new THREE.OctahedronGeometry(12, 1);
    const matWire = new THREE.MeshBasicMaterial({
      color: 0xC9A84C,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireMesh = new THREE.Mesh(geoWire, matWire);
    wireMesh.position.set(20, -5, -10);
    scene.add(wireMesh);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xC9A84C, 2, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    function animate() {
      requestAnimationFrame(animate);

      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      wireMesh.rotation.x += 0.002;
      wireMesh.rotation.y += 0.003;

      camera.position.x = state.mouse.x * 3;
      camera.position.y = -state.mouse.y * 3;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Mouse move listener for 3D camera parallax
  window.addEventListener('mousemove', (e) => {
    state.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ==========================================================================
     4. SCROLL PROGRESS & NAVBAR CONTROLS
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (progressBar) progressBar.style.width = `${scrollPercent}%`;

    if (header) {
      if (scrollTop > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  });

  /* Mobile Drawer Toggle */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     5. TYPING EFFECT IN HERO SECTION
     ========================================================================== */
  function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const phrases = [
      "Teknoloji & Sanatın Sarıbay Yazılım İmzalı Birleşimi.",
      "İki Oyuncu. Tek Ruh. Unutulmaz Co-Op Hikayeler.",
      "Tüm Projelerimiz Üretim Aşamasına Başladı & Coming Soon.",
      "Unreal Engine 5 İle Geleceğin Co-Op Evrenini İnşa Ediyoruz."
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
      const currentPhrase = phrases[phraseIdx];
      
      if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingText.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let typeSpeed = isDeleting ? 30 : 60;

      if (!isDeleting && charIdx === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* ==========================================================================
     6. ANIME.JS SCROLL REVEALS & NUMERICAL COUNTERS
     ========================================================================== */
  function initScrollAnimations() {
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.hero-container .animate-target',
        translateY: [40, 0],
        opacity: [0, 1],
        delay: anime.stagger(150, { start: 200 }),
        duration: 1000,
        easing: 'easeOutExpo'
      });
    }

    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          if (typeof anime !== 'undefined' && entry.target.classList.contains('reveal-left')) {
            anime({
              targets: entry.target,
              translateX: [-50, 0],
              opacity: [0, 1],
              duration: 900,
              easing: 'easeOutQuad'
            });
          }
          if (typeof anime !== 'undefined' && entry.target.classList.contains('reveal-right')) {
            anime({
              targets: entry.target,
              translateX: [50, 0],
              opacity: [0, 1],
              duration: 900,
              easing: 'easeOutQuad'
            });
          }
          if (typeof anime !== 'undefined' && entry.target.classList.contains('reveal-up')) {
            anime({
              targets: entry.target,
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 800,
              easing: 'easeOutQuad'
            });
          }

          const metricNum = entry.target.querySelector('[data-target]');
          if (metricNum && !metricNum.dataset.counted) {
            metricNum.dataset.counted = "true";
            const targetVal = parseInt(metricNum.dataset.target, 10);
            let current = 0;
            const countInterval = setInterval(() => {
              current++;
              metricNum.textContent = current;
              if (current >= targetVal) clearInterval(countInterval);
            }, 180);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .hero-metrics').forEach(el => {
      observer.observe(el);
    });
  }

  /* 3D Tilt Effect on Cards */
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     7. WEB AUDIO FX SYNTHESIZER
     ========================================================================== */
  const soundToggle = document.getElementById('sound-toggle');
  const soundOnIcon = document.getElementById('sound-on-icon');
  const soundOffIcon = document.getElementById('sound-off-icon');

  function initAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioCtx = new AudioCtx();
    }
  }

  function playSynthBeep(freq = 440) {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.25);
    } catch (e) { console.error(e); }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudioContext();
      state.soundEnabled = !state.soundEnabled;
      if (state.soundEnabled) {
        soundOnIcon.classList.remove('hidden');
        soundOffIcon.classList.add('hidden');
        if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
        playSynthBeep(659.25);
      } else {
        soundOnIcon.classList.add('hidden');
        soundOffIcon.classList.remove('hidden');
      }
    });
  }

  // Hover sound effect on buttons
  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (state.soundEnabled) playSynthBeep(330);
    });
  });
});
