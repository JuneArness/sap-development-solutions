/* ==========================================================================
   SAP DEVELOPMENT SOLUTIONS | app.js
   Menu, contact details, services and work cards (from data.js), the
   contact form and scroll reveals. Vanilla JavaScript, no libraries.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.SAP || {};
  var CO = DATA.company || {};
  var ICONS = /*ICONS*/{"arrow-right":"<path d=\"M5 12h14M13 6l6 6-6 6\"/>","external":"<path d=\"M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5\"/>","check":"<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>","info":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5.5M12 7.6v.1\"/>","mail":"<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3.5 6.5l8.5 6 8.5-6\"/>","phone":"<path d=\"M5 3h3.6l1.9 4.8-2.4 1.5a11.3 11.3 0 0 0 6.6 6.6l1.5-2.4L21 15.4V19a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 3 5.2 2 2 0 0 1 5 3z\"/>","plus":"<path d=\"M12 5v14M5 12h14\"/>","code":"<path d=\"M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15\"/>","web":"<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 9h18M7 6.5h.01M10 6.5h.01M7 13h6M7 16h10\"/>","design":"<path d=\"M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1-2.2H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3z\"/><circle cx=\"7.5\" cy=\"11\" r=\"1.2\"/><circle cx=\"10.5\" cy=\"7.5\" r=\"1.2\"/><circle cx=\"15\" cy=\"8\" r=\"1.2\"/>","pos":"<rect x=\"4\" y=\"3\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M8 18h8M12 14v4M6 21h12M8 7h8M8 10h4\"/>","launch":"<path d=\"M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2M9 15l-3-3c1.8-4.8 5.9-8.7 12.5-9 .3 6.6-4.2 10.7-9 12.5z\"/><circle cx=\"14.5\" cy=\"9.5\" r=\"1.6\"/>","audio":"<path d=\"M3 12h2M7 8v8M11 4v16M15 7v10M19 10v4M21 12h0\"/>","video":"<rect x=\"3\" y=\"6\" width=\"13\" height=\"12\" rx=\"2\"/><path d=\"M16 10.5l5-3v9l-5-3z\"/>","layers":"<path d=\"M12 3l9 5-9 5-9-5z\"/><path d=\"M3 13l9 5 9-5\"/>","key":"<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M17 6l3 3M15 8l2 2\"/>","chat":"<path d=\"M4 5h16v11H9l-5 4z\"/><path d=\"M8 9.5h8M8 12.5h5\"/>","shield":"<path d=\"M12 3l8 3v6c0 5-3.4 8.3-8 9.4-4.6-1.1-8-4.4-8-9.4V6z\"/><path d=\"M8.5 12l2.3 2.3 4.7-4.7\"/>","bolt":"<path d=\"M13 3L5 13.5h6L10 21l8-10.5h-6z\"/>","book":"<path d=\"M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20\"/>"}/*END-ICONS*/;

  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function safeUrl(u) { u = String(u || "").trim(); if (!u) return ""; if (/^(https?:|mailto:|tel:)/i.test(u)) return u; if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return ""; return u; }
  function icon(n, cls) { return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[n] || "") + "</svg>"; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function tel(p) { return "tel:" + String(p || "").replace(/[^\d+]/g, ""); }

  /* ---------- Header ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 16); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-toggle"), menu = $("#mobile-menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open); menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("no-scroll", open);
    if (header) header.classList.toggle("is-solid", open);
    $$("a, button", menu).forEach(function (el) { el.tabIndex = open ? 0 : -1; });
    if (open) setTimeout(function () { var f = $("a", menu); if (f) f.focus(); }, 60);
  }
  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") { setMenu(false); toggle.focus(); }
      if (e.key === "Tab") {
        var items = [toggle].concat($$("a", menu)), i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1080 && toggle.getAttribute("aria-expanded") === "true") setMenu(false); });
  }

  /* ---------- Contact details everywhere ---------- */
  $$("[data-email]").forEach(function (el) { el.innerHTML = CO.email ? '<a href="mailto:' + esc(CO.email) + '">' + icon("mail") + esc(CO.email) + "</a>" : ""; });
  $$("[data-phone]").forEach(function (el) { el.innerHTML = CO.phone ? '<a href="' + esc(tel(CO.phone)) + '">' + icon("phone") + esc(CO.phone) + "</a>" : ""; });
  $$("[data-socials]").forEach(function (el) {
    var list = (CO.socials || []).filter(function (s) { return safeUrl(s.url); });
    if (!list.length) { el.hidden = true; return; }
    el.innerHTML = list.map(function (s) { return '<li><a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '<span class="sr-only"> (opens in a new tab)</span></a></li>'; }).join("");
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Services: home snapshot ---------- */
  var services = DATA.services || [];
  $$("[data-service-list]").forEach(function (el) {
    el.innerHTML = services.map(function (s, i) {
      return '<a class="svc-row" href="./services.html#' + esc(s.id) + '"><span class="num">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<span><h3>" + esc(s.name) + "</h3><p>" + esc(s.summary) + '</p></span><span class="go" aria-hidden="true">' + icon("arrow-right") + "</span></a>";
    }).join("");
  });

  /* ---------- Services: full page ---------- */
  $$("[data-service-detail]").forEach(function (el) {
    el.innerHTML = services.map(function (s, i) {
      return '<section class="svc-detail reveal" id="' + esc(s.id) + '" aria-labelledby="svc-' + esc(s.id) + '">' +
        '<div class="sd-head"><span class="num">' + String(i + 1).padStart(2, "0") + " / " + String(services.length).padStart(2, "0") + '</span><span class="ico">' + icon(s.icon) + "</span>" +
        '<h2 id="svc-' + esc(s.id) + '">' + esc(s.name) + "</h2><p>" + esc(s.summary) + "</p>" +
        '<a class="text-link" href="./contact.html?type=' + encodeURIComponent(s.name) + '">Discuss a project' + icon("arrow-right") + "</a></div>" +
        '<div><ul class="checks">' + (s.items || []).map(function (it) { return "<li>" + icon("check") + "<span>" + esc(it) + "</span></li>"; }).join("") + "</ul>" +
        (s.note ? '<div class="notice">' + icon("info") + "<p>" + esc(s.note) + "</p></div>" : "") + "</div></section>";
    }).join("");
  });

  // Links like services.html#audio: jump to the section now that it exists
  if (location.hash && $("[data-service-detail]")) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(function () { target.scrollIntoView({ behavior: "instant", block: "start" }); target.classList.add("in"); }, 60);
  }

  /* ---------- Selected work (verified projects only) ---------- */
  function shot(w, label) {
    return '<div class="shot"><span class="browser" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(label) + "</span></span>" +
      (w.image ? '<img src="./' + esc(w.imageSm || w.image) + '" srcset="./' + esc(w.imageSm || w.image) + " 720w, ./" + esc(w.image) + ' 1200w" sizes="(min-width: 900px) 33vw, 100vw" alt="' + esc(w.imageAlt || "") + '" loading="lazy" width="720" height="450">' : "") + "</div>";
  }
  function builtList(w) { return "<ul>" + (w.built || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>"; }
  $$("[data-work]").forEach(function (el) {
    var work = (DATA.work || []).filter(function (w) { return w.name && safeUrl(w.url); });
    if (!work.length) { var wrap = el.closest("[data-hide-if-empty]"); if (wrap) wrap.hidden = true; return; }
    el.innerHTML = work.map(function (w) {
      var url = safeUrl(w.url);
      return '<article class="card work">' + shot(w, url.replace(/^https?:\/\//, "")) +
        '<div class="w-body"><div class="w-top"><span class="status">' + esc(w.status || "Live") + '</span><span class="pill">' + esc(w.type) + "</span></div>" +
        "<h3>" + esc(w.name) + '</h3><p class="client">' + esc(w.client) + "</p><p class=\"muted\">" + esc(w.summary) + "</p>" + builtList(w) +
        '<a class="text-link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Visit live site' + icon("external") + '<span class="sr-only"> (opens in a new tab)</span></a></div></article>';
    }).join("");
  });
  // In-progress builds (Portfolio page): clearly labeled, no links
  $$("[data-upcoming]").forEach(function (el) {
    var list = (DATA.upcoming || []).filter(function (w) { return w.name; });
    if (!list.length) { var wrap = el.closest("[data-hide-if-empty]"); if (wrap) wrap.hidden = true; return; }
    el.innerHTML = list.map(function (w) {
      return '<article class="card work is-upcoming">' + shot(w, "Not live yet") +
        '<div class="w-body"><div class="w-top"><span class="status soon">' + esc(w.status || "In progress") + '</span><span class="pill">' + esc(w.type) + "</span></div>" +
        "<h3>" + esc(w.name) + "</h3><p class=\"muted\">" + esc(w.summary) + "</p>" + builtList(w) +
        '<p class="fine">Link coming when it launches.</p></div></article>';
    }).join("");
  });

  /* ---------- Forms (contact + free SEO audit) ----------
     Until company.formEndpoint is set in data.js, NOTHING is sent: the form
     says so plainly and offers to open the visitor's own email app instead. */
  var endpoint = safeUrl(CO.formEndpoint);
  function check(f) {
    var v = f.type === "checkbox" ? (f.checked ? "y" : "") : f.value.trim(), ok = !(f.required && !v);
    if (ok && v && f.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (ok && v && f.type === "tel") ok = v.replace(/\D/g, "").length >= 10;
    if (ok && v && f.type === "url") ok = /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v);
    var w = f.closest(".field"); if (w) w.classList.toggle("bad", !ok);
    f.setAttribute("aria-invalid", ok ? "false" : "true"); return ok;
  }
  function setupForm(form, opts) {
    var status = $(".form-status", form);
    function show(kind, msg) { status.className = "form-status show " + kind; status.innerHTML = icon(kind === "ok" ? "check" : "info") + "<p>" + msg + "</p>"; }
    var fields = $$("input, select, textarea", form).filter(function (f) { return f.name !== "_gotcha"; });
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value.trim() && f.type !== "checkbox") check(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
      f.addEventListener("change", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($('[name="_gotcha"]', form).value) return;
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { bad[0].focus(); show("err", "Please check the highlighted field" + (bad.length > 1 ? "s" : "") + "."); return; }
      var fd = new FormData(form);
      if (!endpoint) {
        var href = "mailto:" + CO.email + "?subject=" + encodeURIComponent(opts.subject(fd)) + "&body=" + encodeURIComponent(opts.body(fd));
        show("info", "Online sending isn’t set up yet, so your message has <strong>not been sent</strong>. <a href=\"" + esc(href) + "\">Open it in your email app</a> to send it, or call " + esc(CO.phone) + ".");
        return;
      }
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); show("ok", opts.ok); })
        .catch(function () { show("err", "Sorry, that didn’t go through. Please email " + esc(CO.email) + " or call " + esc(CO.phone) + "."); })
        .then(function () { btn.disabled = false; });
    });
  }

  var form = $("#contact-form");
  if (form) {
    function fill(sel, list, first) { sel.innerHTML = '<option value="">' + first + "</option>" + list.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join(""); }
    var typeSel = $("#f-type", form);
    fill(typeSel, DATA.projectTypes || [], "Choose one…");
    fill($("#f-budget", form), DATA.budgets || [], "Choose a range…");
    fill($("#f-timeline", form), DATA.timelines || [], "Choose a timeline…");

    // Pre-select the project type from links like contact.html?type=Web%20Development
    var q = (location.search.match(/[?&]type=([^&]*)/) || [])[1];
    if (q) {
      var want = decodeURIComponent(q.replace(/\+/g, " ")).toLowerCase();
      var map = { "software development": "Software", "web development": "Website", "graphic design": "Graphic Design", "business technology": "POS / Business System", "business formation support": "Business Formation Support", "audio engineering": "Audio", "video engineering": "Video" };
      var target = map[want] || want;
      $$("option", typeSel).forEach(function (o) { if (o.value && o.value.toLowerCase() === String(target).toLowerCase()) typeSel.value = o.value; });
    }
    setupForm(form, {
      subject: function (fd) { return "Project inquiry: " + fd.get("type") + " (" + fd.get("name") + ")"; },
      body: function (fd) {
        return ["Name: " + fd.get("name"), "Email: " + fd.get("email"), "Phone: " + (fd.get("phone") || ""), "Company / organization: " + (fd.get("company") || ""),
          "Project type: " + fd.get("type"), "Budget: " + (fd.get("budget") || ""), "Timeline: " + (fd.get("timeline") || ""), "", fd.get("description")].join("\n");
      },
      ok: "Thanks! Your project details were sent. We’ll be in touch soon."
    });
  }

  var audit = $("#audit-form");
  if (audit) {
    setupForm(audit, {
      subject: function (fd) { return "Free SEO audit request: " + fd.get("website"); },
      body: function (fd) {
        return ["Name: " + fd.get("name"), "Email: " + fd.get("email"), "Phone: " + fd.get("phone"), "Business: " + (fd.get("business") || ""),
          "Website: " + fd.get("website"), "", "Consent to be contacted about this audit: yes"].join("\n");
      },
      ok: "Thanks! Your audit request was sent. We’ll review your site and reach out with your grade and plan."
    });
  }

  /* ---------- Scroll reveals ---------- */
  var els = $$(".reveal, .stagger");
  if (!("IntersectionObserver" in window) || reduced()) { els.forEach(function (el) { el.classList.add("in"); }); }
  else {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -6% 0px", threshold: .08 });
    els.forEach(function (el) { io.observe(el); });
  }
})();
