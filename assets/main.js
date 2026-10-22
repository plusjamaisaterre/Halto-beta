// Halto – animations du site : roue de démonstration, mini-roues, apparitions, FAQ.
(function () {
  var root = document.documentElement;
  root.classList.remove('nojs');
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var assets = document.body.getAttribute('data-assets') || 'assets/';
  var fr = root.lang === 'fr';

  // Icônes au trait, dessinées d'après les symboles utilisés par l'app.
  var ICONS = {
    wand: 'M4 20L14 10M12.5 8.5l3 3M18 3v4M16 5h4M20.5 10v2.5M19.25 11.25h2.5M9.5 3v2.5M8.25 4.25h2.5',
    convert: 'M3 5.5h12v10H3zM3 13.5l3.5-3.5 3 3 2-2 3.5 3.5M19 11v9M16 17l3 3 3-3',
    resize: 'M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7',
    compress: 'M20 4l-6 6M14 5v5h5M4 20l6-6M10 19v-5H5',
    gps: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4M4 4l16 16',
    ocr: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9h8M8 12h8M8 15h5',
    airdrop: 'M12 10.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3M8.6 8.6a4.8 4.8 0 0 0 0 6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8',
    send: 'M21 3L3 10.5l7.5 3L13.5 21zM10.5 13.5L21 3',
    merge: 'M9 8h10v13H9zM6 16H5V3h10v2',
    split: 'M3 6h18v12H3zM9 6v12M15 6v12',
    images: 'M7 7h14v12H7zM4 4h13M4 4v12M7 17l4-4 3 3 2-2 5 5',
    film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4',
    wave: 'M3 11v2M6.5 8.5v7M10 5v14M13.5 8v8M17 4v16M20.5 10v4',
    zip: 'M6 3h9l4 4v14H6zM11 5h1M11 7.5h1M11 10h1M11 12.5h1M10.5 15h2v3h-2z',
    terminal: 'M3 5h18v14H3zM7 9.5l3 2.5-3 2.5M12.5 15h4.5',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg>';
  }

  // Roues par défaut de l'app (QuickAction.defaultIDs), dans le même ordre : l'élément 0 est en haut.
  var L = fr ? {
    image: ['Prêt à partager', 'Convertir', 'Redimensionner', 'Compresser', 'Retirer les métadonnées', 'Copier le texte', 'Détourer', 'AirDrop'],
    pdf: ['Compresser', 'Prêt à envoyer', 'Fusionner', 'Séparer les pages', 'PDF → images', 'Copier le texte', 'AirDrop'],
    video: ['Compresser', "Extraire l'audio", 'AirDrop', 'Archiver (.zip)'],
    folder: ['Archiver (.zip)', 'Terminal ici', 'Copier le chemin', 'AirDrop']
  } : {
    image: ['Ready to share', 'Convert', 'Resize', 'Compress', 'Remove metadata', 'Copy text', 'Remove background', 'AirDrop'],
    pdf: ['Compress', 'Ready to send', 'Merge', 'Split pages', 'PDF → images', 'Copy text', 'AirDrop'],
    video: ['Compress', 'Extract audio', 'AirDrop', 'Compress (.zip)'],
    folder: ['Compress (.zip)', 'Terminal here', 'Copy path', 'AirDrop']
  };
  var SETS = {
    image: ['wand', 'convert', 'resize', 'compress', 'gps', 'ocr', 'wand', 'airdrop'],
    pdf: ['compress', 'send', 'merge', 'split', 'images', 'ocr', 'airdrop'],
    video: ['film', 'wave', 'airdrop', 'zip'],
    folder: ['zip', 'terminal', 'link', 'airdrop']
  };

  function placeIcons(el, set, size, radius, iconSize) {
    var n = set.length, html = '';
    for (var i = 0; i < n; i++) {
      var a = i * 2 * Math.PI / n;
      var x = size / 2 + radius * Math.sin(a), y = size / 2 - radius * Math.cos(a);
      html += '<span class="ic" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' + icon(set[i]) + '</span>';
    }
    return html;
  }

  // Mini-roues statiques (types de fichiers, schéma d'installation).
  document.querySelectorAll('.mini[data-set]').forEach(function (el) {
    var size = el.offsetWidth || 168;
    el.innerHTML = placeIcons(el, SETS[el.getAttribute('data-set')], size, size * 0.355) +
      '<img src="' + assets + 'halto-logo-sombre.png" alt="">';
  });

  // Apparitions au défilement.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  // FAQ : ouverture et fermeture en douceur.
  document.querySelectorAll('details').forEach(function (d) {
    var ans = d.querySelector('.ans'), sum = d.querySelector('summary');
    if (d.open) ans.style.height = 'auto';
    sum.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (d.open) {
        ans.style.height = ans.scrollHeight + 'px';
        requestAnimationFrame(function () { ans.style.height = '0px'; });
        setTimeout(function () { d.open = false; }, 400);
      } else {
        d.open = true;
        ans.style.height = ans.scrollHeight + 'px';
        setTimeout(function () { if (d.open) ans.style.height = 'auto'; }, 420);
      }
    });
  });

  // ---- Démo : la roue dans le Finder ----
  var wrap = document.querySelector('.stage-wrap');
  if (!wrap) return;
  var stage = wrap.querySelector('.stage');
  function fit() { stage.style.setProperty('--s', wrap.clientWidth / 960); }
  fit();
  window.addEventListener('resize', fit);

  var list = stage.querySelector('.rows');
  var wheel = stage.querySelector('.wheel');
  var cursor = stage.querySelector('.cursor');
  var hud = stage.querySelector('.hud');
  var hudText = hud.querySelector('span');
  var key = stage.querySelector('.key');
  var segPath = wheel.querySelector('svg.seg path');
  var hubTitle = wheel.querySelector('.hub b');

  var T = fr ? { today: "Aujourd'hui à ", yest: 'Hier à ' } : { today: 'Today at ', yest: 'Yesterday at ' };
  var FILES = [
    { id: 'pdf', name: fr ? 'Rapport.pdf' : 'Report.pdf', cls: 'pdf', date: T.today + '09:12', size: '8,4 Mo' },
    { id: 'img', name: fr ? 'Vacances.heic' : 'Holiday.heic', cls: 'img', date: T.yest + '18:40', size: '3,1 Mo' },
    { id: 'mov', name: fr ? 'Démo.mov' : 'Demo.mov', cls: 'mov', date: T.yest + '16:05', size: '214 Mo' },
    { id: 'doc', name: fr ? 'Notes.docx' : 'Notes.docx', cls: 'doc', date: T.yest + '11:27', size: '96 Ko' }
  ];
  if (!fr) FILES.forEach(function (f) { f.size = f.size.replace(',', '.').replace('Mo', 'MB').replace('Ko', 'KB'); });

  function rowHTML(f) {
    return '<span class="nm"><i class="' + f.cls + '"></i>' + f.name + '</span><span>' + f.date + '</span><span>' + f.size + '</span>';
  }
  function resetRows() {
    list.innerHTML = '';
    FILES.forEach(function (f) {
      var r = document.createElement('div');
      r.className = 'row'; r.setAttribute('data-id', f.id); r.innerHTML = rowHTML(f);
      list.appendChild(r);
    });
  }
  resetRows();

  // Coordonnées dans la scène (960 × 580) : la liste commence sous l'en-tête.
  var LIST_X = 70 + 170 + 12, LIST_Y = 46 + 52 + 8 + 29 + 4;
  function rowPoint(id) {
    var rows = list.children, y = LIST_Y;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute('data-id') === id) return { x: LIST_X + 60, y: y + 15, el: rows[i] };
      y += rows[i].offsetHeight;
    }
    return { x: LIST_X + 60, y: LIST_Y + 15, el: null };
  }

  var pos = { x: 760, y: 430 };
  function setCursor(x, y) { pos.x = x; pos.y = y; cursor.style.transform = 'translate3d(' + (x - 3) + 'px,' + (y - 3) + 'px,0)'; }
  setCursor(pos.x, pos.y);
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var running = true, token = 0;
  function wait(ms) {
    var my = token;
    return new Promise(function (res, rej) { setTimeout(function () { my === token ? res() : rej('stop'); }, ms); });
  }
  function move(x, y, ms, onStep) {
    var x0 = pos.x, y0 = pos.y, t0 = performance.now(), my = token;
    return new Promise(function (res, rej) {
      function step(now) {
        if (my !== token) return rej('stop');
        var t = Math.min(1, (now - t0) / ms), k = ease(t);
        setCursor(x0 + (x - x0) * k, y0 + (y - y0) * k);
        if (onStep) onStep();
        t < 1 ? requestAnimationFrame(step) : res();
      }
      requestAnimationFrame(step);
    });
  }

  // Secteur de la roue (même géométrie que RingSegment : marge de 6 pt, écart 0,025 rad).
  function segment(i, n) {
    var c = 130, ro = 124, ri = 56, step = 2 * Math.PI / n, mid = i * step - Math.PI / 2, half = step / 2 - 0.025;
    var a0 = mid - half, a1 = mid + half;
    function p(r, a) { return (c + r * Math.cos(a)).toFixed(2) + ' ' + (c + r * Math.sin(a)).toFixed(2); }
    var large = half * 2 > Math.PI ? 1 : 0;
    return 'M' + p(ro, a0) + ' A' + ro + ' ' + ro + ' 0 ' + large + ' 1 ' + p(ro, a1) + ' L' + p(ri, a1) + ' A' + ri + ' ' + ri + ' 0 ' + large + ' 0 ' + p(ri, a0) + 'Z';
  }

  var current = null;
  function openWheel(set, title, cx, cy) {
    var n = SETS[set].length;
    wheel.style.left = cx + 'px'; wheel.style.top = cy + 'px';
    wheel.querySelectorAll('.ic').forEach(function (e) { e.remove(); });
    wheel.insertAdjacentHTML('beforeend', placeIcons(wheel, SETS[set], 260, 90));
    current = { set: set, n: n, cx: cx, cy: cy, title: title, sel: -1 };
    hubTitle.textContent = title;
    segPath.setAttribute('d', '');
    segPath.style.opacity = 0;
    wheel.classList.add('open');
  }
  function track() {
    if (!current) return;
    var dx = pos.x - current.cx, dy = pos.y - current.cy, idx = -1;
    if (Math.hypot(dx, dy) > 24) {
      var a = Math.atan2(dx, -dy); if (a < 0) a += 2 * Math.PI;
      var step = 2 * Math.PI / current.n;
      idx = Math.floor((a + step / 2) / step) % current.n;
    }
    if (idx === current.sel) return;
    current.sel = idx;
    var ics = wheel.querySelectorAll('.ic');
    ics.forEach(function (e, j) { e.classList.toggle('on', j === idx); });
    if (idx < 0) { segPath.style.opacity = 0; hubTitle.textContent = current.title; return; }
    segPath.setAttribute('d', segment(idx, current.n));
    segPath.style.opacity = 1;
    hubTitle.textContent = L[current.set][idx];
  }
  function iconPoint(i, n, r) {
    var a = i * 2 * Math.PI / n;
    return { x: current.cx + r * Math.sin(a), y: current.cy - r * Math.cos(a) };
  }

  function select(el) {
    list.querySelectorAll('.row').forEach(function (r) { r.classList.remove('sel'); });
    if (el) el.classList.add('sel');
  }
  function addRow(afterId, f) {
    var ref = rowPoint(afterId).el, r = document.createElement('div');
    r.className = 'row out added'; r.setAttribute('data-id', f.id); r.innerHTML = rowHTML(f);
    ref.parentNode.insertBefore(r, ref.nextSibling);
    requestAnimationFrame(function () { requestAnimationFrame(function () { r.classList.remove('out'); r.classList.add('fresh'); }); });
  }
  function showHud(text, x, y) {
    hudText.textContent = text;
    hud.style.left = x + 'px'; hud.style.top = y + 'px';
    hud.classList.add('show');
  }

  var SCRIPT = [
    { file: 'img', set: 'image', target: 1, hud: fr ? 'Converti en JPG' : 'Converted to JPG',
      out: { id: 'img2', name: fr ? 'Vacances.jpg' : 'Holiday.jpg', cls: 'img', date: T.today + '09:41', size: fr ? '1,2 Mo' : '1.2 MB' } },
    { file: 'pdf', set: 'pdf', target: 0, hud: fr ? 'Rapport (compressé).pdf' : 'Report (compressed).pdf',
      out: { id: 'pdf2', name: fr ? 'Rapport (compressé).pdf' : 'Report (compressed).pdf', cls: 'pdf', date: T.today + '09:41', size: fr ? '1,9 Mo' : '1.9 MB' } },
    { file: 'mov', set: 'video', target: 1, hud: fr ? 'Audio extrait' : 'Audio extracted',
      out: { id: 'aud', name: fr ? 'Démo.m4a' : 'Demo.m4a', cls: 'aud', date: T.today + '09:42', size: fr ? '3,4 Mo' : '3.4 MB' } }
  ];

  async function play(s) {
    var f = FILES.filter(function (x) { return x.id === s.file; })[0];
    var p = rowPoint(s.file);
    await move(p.x + 70, p.y + 2, 900);
    cursor.classList.add('down'); select(p.el); await wait(120); cursor.classList.remove('down');
    await wait(350);
    key.classList.add('pressed');
    await wait(320);
    openWheel(s.set, f.name, pos.x, pos.y);
    await wait(520);
    var t = iconPoint(s.target, SETS[s.set].length, 92);
    await move(t.x, t.y, 520, track);
    await wait(650);
    key.classList.remove('pressed');
    wheel.classList.remove('open');
    var c = current; current = null;
    await wait(220);
    showHud(s.hud, c.cx, Math.min(c.cy + 40, 470));
    addRow(s.file, s.out);
    await wait(1700);
    hud.classList.remove('show');
    await wait(500);
  }

  async function loop() {
    while (running) {
      try {
        for (var i = 0; i < SCRIPT.length; i++) await play(SCRIPT[i]);
        select(null);
        await move(760, 430, 900);
        await wait(900);
        list.querySelectorAll('.added').forEach(function (r) { r.classList.add('out'); });
        await wait(600);
        resetRows();
        await wait(500);
      } catch (e) { return; }
    }
  }

  function staticFrame() {
    var p = rowPoint('pdf');
    select(p.el); key.classList.add('pressed');
    openWheel('pdf', FILES[0].name, p.x + 70, p.y + 110);
    var t = iconPoint(0, 7, 92); setCursor(t.x, t.y); track();
  }

  if (reduce) { staticFrame(); return; }
  // La démo ne tourne que lorsqu'elle est visible.
  var started = false;
  function start() { if (started) return; started = true; running = true; token++; resetRows(); setCursor(760, 430); loop(); }
  function stop() { if (!started) return; started = false; running = false; token++; wheel.classList.remove('open'); hud.classList.remove('show'); key.classList.remove('pressed'); current = null; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }, { threshold: 0.2 }).observe(wrap);
  } else start();
})();
