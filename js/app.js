/* Köybaşı Hukuk — shared behaviour: header, footer, bag, reveals, parallax. No build step. */
(function () {
  "use strict";
  var P = window.PRODUCTS || [];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KEY = "kh-bag-v1", MAXQ = 9;
  var ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ICON = {
    plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M5 12h14"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M3 8h18M3 16h18"/></svg>'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var fmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  var money = function (n) { return fmt.format(n); };
  var bySlug = function (s) { return P.filter(function (p) { return p.slug === s; })[0]; };
  window.KH = { P: P, money: money, esc: esc, bySlug: bySlug, ICON: ICON, ARROW: ARROW, $: $, $$: $$ };

  /* ---------- cart ---------- */
  var items = [];
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || "[]");
      items = (Array.isArray(d) ? d : []).filter(function (i) { return i && bySlug(i.slug) && typeof i.quantity === "number"; })
        .map(function (i) { return { slug: i.slug, quantity: Math.min(MAXQ, Math.max(1, Math.round(i.quantity))) }; });
    } catch (e) { items = []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function clamp(n) { return Math.min(MAXQ, Math.max(1, n)); }
  var Cart = window.KH.Cart = {
    add: function (slug, q) {
      var f = items.filter(function (i) { return i.slug === slug; })[0];
      if (f) f.quantity = clamp(f.quantity + q); else items.push({ slug: slug, quantity: clamp(q) });
      save(); render();
    },
    remove: function (slug) { items = items.filter(function (i) { return i.slug !== slug; }); save(); render(); },
    set: function (slug, q) { items.forEach(function (i) { if (i.slug === slug) i.quantity = clamp(q); }); save(); render(); },
    count: function () { return items.reduce(function (s, i) { return s + i.quantity; }, 0); },
    open: openBag, close: closeBag
  };

  /* ---------- chrome ---------- */
  var page = document.body.getAttribute("data-page") || "";
  var home = page === "home";
  var NAV = [["objects.html", "Objects", "objects"], ["materials.html", "Materials", "materials"], ["our-approach.html", "Our Approach", "approach"]];

  function buildChrome() {
    var skip = '<a class="skip" href="#main">Skip to content</a>';
    var nav = NAV.map(function (n) { return '<li><a class="nav" href="' + n[0] + '"' + (page === n[2] || (n[2] === "objects" && page === "product") ? ' aria-current="page"' : "") + ">" + n[1] + "</a></li>"; }).join("");
    var mnav = NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("");
    var header = '<header class="hdr' + (home ? " dark on-dark" : "") + '" id="hdr"><div class="shell hdr-in">' +
      '<nav aria-label="Primary"><ul>' + nav + '</ul><button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu" style="display:flex">' + ICON.menu + "</button></nav>" +
      '<a class="logo" href="index.html" aria-label="Köybaşı Hukuk — home">Köybaşı Hukuk</a>' +
      '<div class="bag-wrap"><button class="bag-btn" id="bagBtn" type="button" aria-label="Open bag, empty">Bag <span aria-hidden="true" id="bagCount">(0)</span></button></div></div>' +
      '<nav class="mnav" id="mnav" aria-label="Mobile">' + mnav + "</nav></header>";
    var footer = '<footer class="ft"><div class="shell"><div class="ft-top"><div><p style="font-family:var(--serif);font-size:2.4rem;font-weight:300">Köybaşı Hukuk</p><p style="margin-top:16px;font-family:var(--serif);font-size:1.5rem;font-weight:300;font-style:italic;color:var(--muted-strong)">Light, shaped.</p></div>' +
      '<nav aria-label="Footer" class="cols"><div><h2 class="eyebrow">Collection</h2><ul><li><a href="objects.html">Objects</a></li><li><a href="materials.html">Materials</a></li><li><a href="our-approach.html">Our Approach</a></li></ul></div>' +
      '<div><h2 class="eyebrow">Types</h2><ul><li><a href="objects.html#Pendant">Pendants</a></li><li><a href="objects.html#Table">Table</a></li><li><a href="objects.html#Floor">Floor</a></li><li><a href="objects.html#Wall">Wall</a></li></ul></div></nav>' +
      '<div><h2 class="eyebrow">Studio</h2><p style="margin-top:24px;font-size:15px;line-height:1.7">Viewings by appointment.<br><a href="mailto:studio@koybasihukuk.com" style="text-decoration:underline;text-underline-offset:4px">studio@koybasihukuk.com</a></p></div></div>' +
      '<div class="ft-bot"><p>© ' + new Date().getFullYear() + " Köybaşı Hukuk</p><p>Made to order · Shipped worldwide</p></div></div></footer>";
    var drawer = '<div class="scrim" id="scrim" aria-hidden="true"></div><div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="bagTitle"></div>';
    document.body.insertAdjacentHTML("afterbegin", skip + header);
    document.body.insertAdjacentHTML("beforeend", footer + drawer);
    var main = $("main"); if (main) { main.id = "main"; main.tabIndex = -1; }

    var menuBtn = $("#menuBtn"), mn = $("#mnav");
    menuBtn.addEventListener("click", function () {
      var o = mn.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", o);
      menuBtn.setAttribute("aria-label", o ? "Close menu" : "Open menu");
      menuBtn.innerHTML = o ? ICON.x : ICON.menu;
      setHeader();
    });
    $("#bagBtn").addEventListener("click", openBag);
    $("#scrim").addEventListener("click", closeBag);
    window.addEventListener("scroll", setHeader, { passive: true });
    setHeader();
  }
  function setHeader() {
    var h = $("#hdr"); if (!h) return;
    var menuOpen = $("#mnav").classList.contains("open");
    var dark = home && window.scrollY <= 24 && !menuOpen;
    h.classList.toggle("dark", dark); h.classList.toggle("on-dark", dark);
  }

  /* ---------- bag drawer ---------- */
  var lastFocus = null;
  function lines() { return items.map(function (i) { var p = bySlug(i.slug); return { p: p, q: i.quantity, t: p.price * i.quantity }; }); }
  function render() {
    var L = lines(), n = Cart.count(), sub = L.reduce(function (s, l) { return s + l.t; }, 0);
    var b = $("#bagBtn"); if (!b) return;
    $("#bagCount").textContent = "(" + n + ")";
    b.setAttribute("aria-label", n ? "Open bag, " + n + (n === 1 ? " item" : " items") : "Open bag, empty");
    var head = '<div class="d-head"><h2 id="bagTitle">Bag <small>(' + n + ')</small></h2><button type="button" id="bagClose" aria-label="Close bag" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center">' + ICON.x + "</button></div>";
    var body;
    if (!L.length) {
      body = '<div class="d-empty"><p>Your bag is empty.</p><p style="max-width:300px;font-size:15px;line-height:1.7;color:var(--muted-strong)">Objects you add will wait here until you are ready.</p><a class="link-line" href="objects.html">View objects</a></div>';
    } else {
      body = '<ul class="d-list" aria-label="Items in your bag">' + L.map(function (l) {
        return '<li><a class="th" href="product.html?slug=' + l.p.slug + '" tabindex="-1" aria-hidden="true"><img src="' + l.p.images[0].src + '" alt=""></a><div class="info"><div class="top"><div><h3><a href="product.html?slug=' + l.p.slug + '">' + esc(l.p.name) + "</a></h3><small>" + esc(l.p.materials[0]) + " · " + l.p.category + '</small></div><p style="font-size:13px">' + money(l.t) + '</p></div><div class="bot"><div class="mini" role="group" aria-label="Quantity for ' + esc(l.p.name) + '"><button type="button" data-dec="' + l.p.slug + '" aria-label="Decrease quantity of ' + esc(l.p.name) + '"' + (l.q <= 1 ? " disabled" : "") + ">" + ICON.minus + "</button><span>" + l.q + '</span><button type="button" data-inc="' + l.p.slug + '" aria-label="Increase quantity of ' + esc(l.p.name) + '"' + (l.q >= MAXQ ? " disabled" : "") + ">" + ICON.plus + '</button></div><button type="button" class="rm" data-rm="' + l.p.slug + '" aria-label="Remove ' + esc(l.p.name) + ' from bag">Remove</button></div></div></li>';
      }).join("") + '</ul><div class="d-foot"><div class="tot"><span class="eyebrow">Subtotal</span><b>' + money(sub) + '</b></div><small>Delivery, import duties and installation are confirmed with you at checkout.</small><button class="btn" type="button" id="checkout">Checkout</button><small id="bagNote" role="status" aria-live="polite" style="min-height:1.2em"></small></div>';
    }
    var d = $("#drawer"); d.innerHTML = head + body;
    $("#bagClose").addEventListener("click", closeBag);
    $$("[data-dec]", d).forEach(function (e) { e.addEventListener("click", function () { var i = items.filter(function (x) { return x.slug === e.dataset.dec; })[0]; Cart.set(i.slug, i.quantity - 1); refocus('[data-dec="' + i.slug + '"]'); }); });
    $$("[data-inc]", d).forEach(function (e) { e.addEventListener("click", function () { var i = items.filter(function (x) { return x.slug === e.dataset.inc; })[0]; Cart.set(i.slug, i.quantity + 1); refocus('[data-inc="' + i.slug + '"]'); }); });
    $$("[data-rm]", d).forEach(function (e) { e.addEventListener("click", function () { Cart.remove(e.dataset.rm); var c = $("#bagClose"); if (c) c.focus(); }); });
    var co = $("#checkout"); if (co) co.addEventListener("click", function () { $("#bagNote").textContent = "Checkout is not connected in this demo. Your bag is saved on this device."; });
  }
  function refocus(sel) { var e = $(sel, $("#drawer")); if (e && !e.disabled) e.focus(); }
  function openBag() {
    lastFocus = document.activeElement;
    document.body.classList.add("bag-open");
    setTimeout(function () { var c = $("#bagClose"); if (c) c.focus(); }, 60);
  }
  function closeBag() {
    document.body.classList.remove("bag-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("keydown", function (e) {
    if (!document.body.classList.contains("bag-open")) return;
    if (e.key === "Escape") { closeBag(); return; }
    if (e.key !== "Tab") return;
    var n = $$('#drawer a[href], #drawer button:not([disabled])').filter(function (x) { return x.tabIndex !== -1; });
    if (!n.length) return;
    var f = n[0], l = n[n.length - 1];
    if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
    else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
  });
  window.addEventListener("storage", function (e) { if (e.key === KEY) { load(); render(); } });

  /* ---------- shared renderers ---------- */
  KH.card = function (p, i) {
    var n = p.id.replace("kh-", "No. ");
    return '<article class="card"><a href="product.html?slug=' + p.slug + '" aria-label="' + esc(p.name) + ", " + p.category + ", " + money(p.price) + '"><div class="ph"><img src="' + p.images[0].src + '" alt="' + esc(p.images[0].alt) + '" width="1200" height="1500"' + (i > 1 ? ' loading="lazy"' : "") + '><img src="' + p.images[1].src + '" alt="" aria-hidden="true" loading="lazy" width="1200" height="1500"><span class="tag">View object</span></div>' +
      '<div class="cap"><div style="min-width:0"><p class="eyebrow">' + n + " · " + p.category + "</p><h3>" + esc(p.name) + '</h3><p class="mat">' + esc(p.materials.join(" · ")) + '</p></div><p class="pr">' + money(p.price) + "</p></div></a></article>";
  };
  KH.parallaxFrame = function (src, alt, cls, eager) {
    return '<div class="frame mask ' + (cls || "") + '" data-par><img src="' + src + '" alt="' + esc(alt) + '"' + (eager ? "" : ' loading="lazy"') + "></div>";
  };

  /* ---------- reveals + parallax ---------- */
  function motion() {
    // Masks are clipped to nothing until revealed, so IntersectionObserver cannot see them; they use a scroll check instead.
    var masks = $$(".mask");
    var checkMasks = function () {
      var vh = window.innerHeight;
      masks = masks.filter(function (m) {
        if (m.getBoundingClientRect().top < vh * 0.92) { m.classList.add("in"); return false; }
        return true;
      });
    };
    if (reduce) { masks.forEach(function (m) { m.classList.add("in"); }); masks = []; }
    else if (masks.length) {
      checkMasks();
      window.addEventListener("scroll", function () { if (masks.length) requestAnimationFrame(checkMasks); }, { passive: true });
      window.addEventListener("resize", checkMasks);
    }
    var rv = $$(".reveal, .dusk");
    if (reduce || !("IntersectionObserver" in window)) { rv.forEach(function (e) { e.classList.add("in"); }); }
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
      rv.forEach(function (e) { io.observe(e); });
    }
    var pars = $$("[data-par] > img");
    if (!reduce && pars.length) {
      var ticking = false;
      var upd = function () {
        var vh = window.innerHeight;
        pars.forEach(function (img) {
          var r = img.parentNode.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) return;
          var t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
          img.style.transform = "translateY(" + (-t * 4).toFixed(2) + "%)";
        });
        ticking = false;
      };
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
      upd();
    }
  }

  /* ---------- hero (home only) ---------- */
  function hero() {
    var h = $("#hero"); if (!h) return;
    var spot = $("#spot"), hz = $("#horizon");
    var tx = 50, ty = 40, cx = 50, cy = 40, raf = 0;
    function draw() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      spot.style.background = "radial-gradient(circle at " + cx.toFixed(2) + "% " + cy.toFixed(2) + "%, rgba(244,220,160,.22) 0, rgba(244,220,160,.07) 18vmax, rgba(244,220,160,0) 42vmax)";
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(draw); else raf = 0;
    }
    draw();
    if (reduce) { hz.style.opacity = ".6"; return; }
    h.addEventListener("pointermove", function (e) {
      var r = h.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(draw);
    });
    var copy = $("#heroCopy");
    window.addEventListener("scroll", function () {
      var p = Math.min(1, Math.max(0, window.scrollY / h.offsetHeight));
      hz.style.opacity = Math.min(1, Math.max(0, (p - 0.1) / 0.8));
      copy.style.opacity = 1 - Math.min(1, p / 0.75);
      copy.style.transform = "translateY(" + (-48 * p).toFixed(1) + "px)";
    }, { passive: true });
  }

  /* ---------- accordion ---------- */
  KH.accordion = function (root) {
    $$("[data-acc]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        $$("[data-acc]", root).forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
          $("#" + b.getAttribute("aria-controls")).parentNode.setAttribute("data-open", "false");
          b.querySelector("span").innerHTML = ICON.plus;
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          $("#" + btn.getAttribute("aria-controls")).parentNode.setAttribute("data-open", "true");
          btn.querySelector("span").innerHTML = ICON.minus;
        }
      });
    });
  };

  load();
  document.addEventListener("DOMContentLoaded", function () {
    buildChrome(); render(); hero();
    if (typeof window.KH_PAGE === "function") window.KH_PAGE(KH);
    motion();
  });
})();
