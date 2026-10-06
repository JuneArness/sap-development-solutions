/* ==========================================================================
   SAP DEVELOPMENT SOLUTIONS | seo-grader.js
   Internal SEO grader. Two sources, use one or both:
     1. Google PageSpeed Insights (free Google API): speed, mobile, accessibility,
        best practices and Google's own SEO checks for any public URL.
     2. Pasted page source: deeper on-page, content and local SEO checks, done
        right here in the browser. Pasted code is only read, never run.
   Nothing is sent anywhere except the URL to Google's PageSpeed API.
   The optional Google API key is saved only in this browser (localStorage).
   ========================================================================== */
(function () {
  "use strict";

  var CO = (window.SAP || {}).company || {};
  var form = document.getElementById("grader-form");
  if (!form) return;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function clip(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function mdStrip(s) {
    return String(s || "").replace(/\[Learn (more|how)[^\]]*\]\([^)]*\)\.?/gi, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/`([^`]*)`/g, "$1").replace(/\s+/g, " ").trim();
  }
  function firstSentence(s) { var m = String(s).match(/^.*?[.!?](\s|$)/); return (m ? m[0] : s).trim(); }
  function pct(n) { return Math.round(n * 100); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ""; if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { return ""; } }

  var CATS = [
    { id: "onpage", name: "On-page SEO", weight: 25, blurb: "Titles, descriptions, headings and images" },
    { id: "technical", name: "Technical SEO", weight: 25, blurb: "Indexing, security and code Google reads" },
    { id: "content", name: "Content", weight: 15, blurb: "Enough useful words, keywords and structure" },
    { id: "ux", name: "UX & Mobile", weight: 20, blurb: "Speed, mobile use and accessibility" },
    { id: "local", name: "Local SEO", weight: 15, blurb: "Signals that help nearby customers find you" }
  ];
  var SVC = {
    web: ["Web Development", "web"], design: ["Graphic Design", "design"],
    software: ["Software Development", "software"], biz: ["Business Technology", "business-tech"]
  };
  var PHASES = [
    { id: "quick", name: "Quick wins", when: "Suggested: first week", note: "Small edits with a real payoff." },
    { id: "medium", name: "High-impact fixes", when: "Suggested: next 30 days", note: "More work, bigger improvement." },
    { id: "project", name: "Bigger projects", when: "Suggested: 1 to 3 months", note: "Structural work. Often the reason a site underperforms." }
  ];
  var MANUAL = [
    "Google Business Profile is claimed, verified and fully filled in (hours, photos, services, categories).",
    "Google Search Console is set up and a sitemap has been submitted.",
    "Business name, address and phone match exactly across Google, Facebook, Yelp, Apple Maps and Bing.",
    "There's a simple, regular way to ask happy customers for Google reviews.",
    "Check the other important pages too (services, contact). This report grades one page."
  ];

  /* A check: one finding. status = pass | warn | fail | info.
     weight 0 = shown in the plan but not counted in the grade. */
  function C(cat, key, label, status, o) {
    o = o || {};
    return { cat: cat, key: key, label: label, status: status, detail: o.detail || "", fix: o.fix || "",
      impact: o.impact || 2, effort: o.effort || "quick", svc: o.svc || "web",
      weight: o.weight === undefined ? (o.impact || 2) : o.weight, score: o.score, src: o.src || "page" };
  }
  function val(c) { return typeof c.score === "number" ? c.score : c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0; }

  /* ======================================================================
     1. GOOGLE PAGESPEED INSIGHTS
     ====================================================================== */
  var PSI_MAP = {
    "document-title": ["onpage", "title", "Page title", 3, "quick", "Give the page a unique title of about 50 to 60 characters that names the main service and the city."],
    "meta-description": ["onpage", "desc", "Meta description", 2, "quick", "Write a 120 to 160 character description that says what the business does, where, and why to click."],
    "image-alt": ["onpage", "alt", "Image alt text", 2, "quick", "Add short, descriptive alt text to every meaningful image (for example: \"Roof replacement in Lowell, MI\")."],
    "link-text": ["onpage", "linktext", "Descriptive link text", 1, "quick", "Replace links like \"click here\" or \"learn more\" with words that say where the link goes."],
    "http-status-code": ["technical", "status", "Page loads successfully", 3, "medium", "The page returned an error code. Fix the server or redirect so it returns a normal 200 response."],
    "is-crawlable": ["technical", "noindex", "Page can appear in Google", 3, "quick", "Remove the \"noindex\" setting (a robots meta tag or X-Robots-Tag header) so Google can list this page."],
    "robots-txt": ["technical", "robots", "robots.txt file", 2, "quick", "Fix the robots.txt file so it is valid and doesn't block important pages."],
    "crawlable-anchors": ["technical", "anchors", "Links Google can follow", 2, "medium", "Use real links (<a href=\"...\">) for navigation instead of buttons or script-only links."],
    "canonical": ["technical", "canonical", "Canonical URL", 2, "quick", "Point the canonical tag at this page's own preferred address."],
    "hreflang": ["technical", "hreflang", "Language tags", 1, "quick", "Fix the hreflang tags so each language version points to a valid page."],
    "viewport": ["ux", "viewport", "Mobile viewport", 3, "quick", "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> so the page fits phones."],
    "font-size": ["ux", "fontsize", "Readable text on phones", 2, "medium", "Use at least 16px body text so visitors don't have to zoom."],
    "tap-targets": ["ux", "taps", "Buttons easy to tap", 2, "medium", "Make buttons and links at least 48px tall with space between them."],
    "is-on-https": ["technical", "https", "Secure connection (HTTPS)", 3, "medium", "Install an SSL certificate and redirect every http:// address to https://. Browsers warn visitors about insecure sites."]
  };

  function psiUrl(url, strategy, key) {
    return "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" + encodeURIComponent(url) + "&strategy=" + strategy +
      "&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO" + (key ? "&key=" + encodeURIComponent(key) : "");
  }
  function runPSI(url, strategy, key) {
    var ctl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 120000);
    return fetch(psiUrl(url, strategy, key), ctl ? { signal: ctl.signal } : {})
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) { var e = new Error((j.error && j.error.message) || ("HTTP " + r.status)); e.status = r.status; throw e; }
          return j;
        });
      })
      .finally(function () { clearTimeout(t); });
  }
  function psiError(e) {
    var m = String((e && e.message) || "");
    if (e && e.name === "AbortError") return "Google took more than two minutes to respond. Try again, or switch to Desktop.";
    if (e && e.status === 429 || /quota|rate.?limit|RESOURCE_EXHAUSTED/i.test(m)) return "Google's free shared limit is busy right now. Add your own free API key under <b>Settings</b> (steps are there), then try again.";
    if (e && (e.status === 400 || e.status === 403) && /key/i.test(m)) return "Google didn't accept the API key. Check it under <b>Settings</b>, or clear it to use the shared limit.";
    if (/FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS|NO_FCP|unreachable/i.test(m)) return "Google couldn't load that page. Check the address, and make sure the site is live and public.";
    if (e && e.status) return "Google PageSpeed returned an error: " + esc(clip(m, 220));
    return "Couldn't reach Google PageSpeed. Check your internet connection and try again.";
  }

  function fromPSI(j) {
    var lr = j.lighthouseResult || {}, cats = lr.categories || {}, A = lr.audits || {}, out = [];
    function sc(id) { return cats[id] && typeof cats[id].score === "number" ? cats[id].score : null; }
    var scores = { performance: sc("performance"), accessibility: sc("accessibility"), "best-practices": sc("best-practices"), seo: sc("seo") };
    function dv(id) { return A[id] && A[id].displayValue ? A[id].displayValue : ""; }
    var metrics = [["Largest Contentful Paint", "largest-contentful-paint"], ["Total Blocking Time", "total-blocking-time"], ["Cumulative Layout Shift", "cumulative-layout-shift"], ["First Contentful Paint", "first-contentful-paint"], ["Speed Index", "speed-index"]]
      .map(function (m) { return { name: m[0], value: dv(m[1]), score: A[m[1]] ? A[m[1]].score : null }; }).filter(function (m) { return m.value; });

    function band(s) { return s >= 0.9 ? "pass" : s >= 0.5 ? "warn" : "fail"; }
    if (scores.performance !== null) {
      var p = scores.performance;
      out.push(C("ux", "perf", "Page speed (Google performance score " + pct(p) + ")", band(p), {
        score: p, weight: 4, impact: 3, effort: p < 0.5 ? "project" : "medium", src: "Google",
        detail: metrics.slice(0, 3).map(function (m) { return m.name + ": " + m.value; }).join(" · "),
        fix: "Compress and resize images, remove unused scripts and plugins, and use fast hosting. On heavy page-builder sites, a lean rebuild is often the most reliable fix."
      }));
    }
    if (scores.accessibility !== null) {
      out.push(C("ux", "a11y", "Accessibility (Google score " + pct(scores.accessibility) + ")", band(scores.accessibility), {
        score: scores.accessibility, weight: 2, impact: 2, effort: "medium", src: "Google",
        fix: "Fix the contrast, labels and alt text issues Google lists. An accessible site is easier for every visitor to use."
      }));
    }
    if (scores["best-practices"] !== null) {
      out.push(C("technical", "bp", "Best practices (Google score " + pct(scores["best-practices"]) + ")", band(scores["best-practices"]), {
        score: scores["best-practices"], weight: 1.5, impact: 1, effort: "medium", src: "Google",
        fix: "Clear up browser errors, outdated libraries and insecure requests flagged by Google."
      }));
    }

    // Google's individual SEO checks (plus HTTPS from best practices)
    var refs = ((cats.seo || {}).auditRefs || []).slice();
    if (A["is-on-https"]) refs.push({ id: "is-on-https", weight: 3 });
    if (A["viewport"] && !refs.some(function (r) { return r.id === "viewport"; })) refs.push({ id: "viewport", weight: 3 });
    refs.forEach(function (ref) {
      var a = A[ref.id];
      if (!a || typeof a.score !== "number" || /notApplicable|manual|informative|error/.test(a.scoreDisplayMode || "")) return;
      var m = PSI_MAP[ref.id] || ["technical", ref.id, a.title, 1, "medium", firstSentence(mdStrip(a.description))];
      var n = a.details && a.details.items ? a.details.items.length : 0;
      out.push(C(m[0], m[1], m[2], a.score >= 0.9 ? "pass" : a.score >= 0.5 ? "warn" : "fail", {
        impact: m[3], effort: m[4], fix: m[5], src: "Google", weight: m[3],
        detail: a.score >= 0.9 ? "" : (a.displayValue || (n ? n + " item" + (n > 1 ? "s" : "") + " flagged by Google" : mdStrip(a.title)))
      }));
    });

    // Biggest speed opportunities (listed in the plan, not counted twice in the grade)
    var perfRefs = ((cats.performance || {}).auditRefs || []).filter(function (r) { return r.group !== "metrics" && r.group !== "hidden"; });
    function savings(a) {
      if (a.details && typeof a.details.overallSavingsMs === "number") return a.details.overallSavingsMs;
      var ms = a.metricSavings || {}; return Object.keys(ms).reduce(function (t, k) { return t + (k === "CLS" ? 0 : (+ms[k] || 0)); }, 0);
    }
    perfRefs.map(function (r) { return A[r.id]; }).filter(function (a) {
      return a && typeof a.score === "number" && a.score < 0.9 && !/notApplicable|manual|informative|error/.test(a.scoreDisplayMode || "");
    }).sort(function (x, y) { return savings(y) - savings(x); })
      .slice(0, 5).forEach(function (a) {
        out.push(C("ux", "perf-" + a.id, "Speed: " + mdStrip(a.title), a.score < 0.5 ? "fail" : "warn", {
          weight: 0, impact: a.score < 0.5 ? 2 : 1, effort: "medium", src: "Google",
          detail: a.displayValue || "", fix: firstSentence(mdStrip(a.description))
        }));
      });
    // Accessibility issues Google flagged (top 5)
    ((cats.accessibility || {}).auditRefs || []).filter(function (r) { return r.weight > 0; }).map(function (r) { return A[r.id]; })
      .filter(function (a) { return a && a.score === 0 && a.scoreDisplayMode === "binary" && a.id !== "image-alt"; }).slice(0, 5)
      .forEach(function (a) {
        out.push(C("ux", "a11y-" + a.id, "Accessibility: " + mdStrip(a.title), "warn", {
          weight: 0, impact: 1, effort: "quick", src: "Google", fix: firstSentence(mdStrip(a.description))
        }));
      });

    var le = j.loadingExperience || {};
    var field = le.overall_category ? { overall: le.overall_category, origin: !!le.origin_fallback } : null;
    return { checks: out, scores: scores, metrics: metrics, field: field,
      finalUrl: lr.finalDisplayedUrl || lr.finalUrl || j.id || "", fetchTime: lr.fetchTime || "" };
  }

  /* ======================================================================
     2. PASTED PAGE SOURCE
     ====================================================================== */
  var LOCAL_TYPES = /LocalBusiness|Store|Restaurant|Dentist|Physician|Attorney|LegalService|Plumber|Electrician|RoofingContractor|HVACBusiness|GeneralContractor|HomeAndConstructionBusiness|AutomotiveBusiness|AutoRepair|BeautySalon|HairSalon|DaySpa|HealthClub|ExerciseGym|SportsActivityLocation|FoodEstablishment|CafeOrCoffeeShop|Bakery|BarOrPub|LodgingBusiness|Hotel|RealEstateAgent|InsuranceAgency|AccountingService|FinancialService|ProfessionalService|MedicalBusiness|ChildCare|EntertainmentBusiness|MovingCompany|Locksmith|HousePainter|EmergencyService|ShoppingCenter|LegalService/;
  var PHONE = /(?:\+?1[\s.\-]?)?\(?\b[2-9]\d{2}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}\b/;
  var STREET = /\b\d{1,6}\s+(?:[NSEW]\.?\s+)?(?:[A-Z0-9][A-Za-z0-9.'\-]*\s){1,4}(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Ct|Court|Pkwy|Parkway|Hwy|Highway|Pl|Place|Cir|Circle|Ter|Terrace|Trl|Trail|Sq|Square)\b/;
  var STATEZIP = /\b(?:A[LKZR]|C[AOT]|DE|DC|FL|GA|HI|I[DLNA]|K[SY]|LA|M[EDAINSOT]|N[EVHJMYCD]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[TA]|W[AVIY])\s+\d{5}(?:-\d{4})?\b/;

  function schemaTypes(doc) {
    var types = [], hasAddress = false, bad = 0;
    function walk(n) {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) { n.forEach(walk); return; }
      var t = n["@type"]; if (t) types = types.concat(Array.isArray(t) ? t : [t]);
      if (n.address) hasAddress = true;
      Object.keys(n).forEach(function (k) { if (typeof n[k] === "object") walk(n[k]); });
    }
    Array.prototype.forEach.call(doc.querySelectorAll('script[type="application/ld+json"]'), function (s) {
      try { walk(JSON.parse(s.textContent)); } catch (e) { bad++; }
    });
    Array.prototype.forEach.call(doc.querySelectorAll("[itemtype]"), function (el) { types.push(String(el.getAttribute("itemtype")).split("/").pop()); });
    return { types: types, hasAddress: hasAddress, bad: bad };
  }
  function platform(doc, src) {
    var gen = (doc.querySelector('meta[name="generator" i]') || {}).content || "";
    var tests = [["WordPress", /wp-content|wp-includes|WordPress/i], ["Wix", /wixstatic|wix\.com|Wix\.com Website Builder/i], ["Squarespace", /squarespace/i],
      ["Shopify", /cdn\.shopify|Shopify/], ["GoDaddy Website Builder", /godaddy|img1\.wsimg/i], ["Weebly", /weebly/i], ["Webflow", /webflow/i],
      ["Base44", /base44/i], ["Duda", /dudaone|multiscreensite/i], ["Joomla", /joomla/i], ["Drupal", /drupal/i]];
    for (var i = 0; i < tests.length; i++) if (tests[i][1].test(gen) || tests[i][1].test(src.slice(0, 400000))) return tests[i][0];
    return gen ? clip(gen, 40) : "";
  }

  function fromHTML(src, pageUrl, o) {
    var doc = new DOMParser().parseFromString(src, "text/html"), out = [], info = {};
    function q(s) { return doc.querySelector(s); }
    function qa(s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
    function metaName(n) { var m = q('meta[name="' + n + '" i]'); return m ? (m.getAttribute("content") || "").trim() : null; }
    function metaProp(n) { var m = q('meta[property="' + n + '" i]'); return m ? (m.getAttribute("content") || "").trim() : null; }
    var host = ""; try { host = new URL(pageUrl).host.replace(/^www\./, ""); } catch (e) { /* no URL */ }
    var kw = (o.keyword || "").trim().toLowerCase(), city = (o.city || "").trim().toLowerCase();

    // visible text
    var body = doc.body ? doc.body.cloneNode(true) : doc.createElement("body");
    Array.prototype.forEach.call(body.querySelectorAll("script,style,noscript,template,svg,iframe"), function (n) { n.remove(); });
    var text = (body.textContent || "").replace(/\s+/g, " ").trim();
    var words = text ? text.split(" ").filter(function (w) { return /[a-z0-9]/i.test(w); }) : [];
    var lowText = text.toLowerCase();
    info.words = words.length; info.platform = platform(doc, src);

    /* ---------- On-page ---------- */
    var title = (q("title") ? q("title").textContent : "").replace(/\s+/g, " ").trim();
    if (!title) out.push(C("onpage", "title", "Page title", "fail", { impact: 3, detail: "No title found.", fix: PSI_MAP["document-title"][5] }));
    else if (title.length < 30) out.push(C("onpage", "title", "Page title", "warn", { impact: 3, detail: "“" + title + "” is only " + title.length + " characters, which wastes space Google gives you.", fix: "Lengthen it to about 50 to 60 characters: main service, city, business name." }));
    else if (title.length > 65) out.push(C("onpage", "title", "Page title", "warn", { impact: 3, detail: "“" + clip(title, 90) + "” is " + title.length + " characters and will be cut off in Google.", fix: "Trim it to about 60 characters, keeping the most important words first." }));
    else out.push(C("onpage", "title", "Page title", "pass", { impact: 3, detail: "“" + title + "” (" + title.length + " characters)" }));

    var desc = metaName("description");
    if (!desc) out.push(C("onpage", "desc", "Meta description", "fail", { impact: 2, detail: "Missing. Google will pick random text from the page for the search snippet.", fix: PSI_MAP["meta-description"][5] }));
    else if (desc.length < 70 || desc.length > 160) out.push(C("onpage", "desc", "Meta description", "warn", { impact: 2, detail: desc.length + " characters" + (desc.length > 160 ? " (will be cut off)" : " (too short to sell the click)") + ": “" + clip(desc, 120) + "”", fix: "Rewrite it at 120 to 160 characters with the service, the city and a reason to click." }));
    else out.push(C("onpage", "desc", "Meta description", "pass", { impact: 2, detail: desc.length + " characters" }));

    var h1s = qa("h1");
    if (!h1s.length) out.push(C("onpage", "h1", "Main heading (H1)", "fail", { impact: 3, detail: "No H1 heading on the page.", fix: "Add one clear H1 that says what the business does and where, for example “Roofing in Grand Rapids, MI”." }));
    else if (h1s.length > 1) out.push(C("onpage", "h1", "Main heading (H1)", "pass", { impact: 3, detail: h1s.length + " H1 headings. That's allowed; one clear H1 is still the tidiest setup." }));
    else out.push(C("onpage", "h1", "Main heading (H1)", "pass", { impact: 3, detail: "“" + clip(h1s[0].textContent, 90) + "”" }));

    var last = 0, skip = "";
    qa("h1,h2,h3,h4,h5,h6").forEach(function (h) { var l = +h.tagName[1]; if (last && l > last + 1 && !skip) skip = "H" + last + " → H" + l; last = l; });
    out.push(C("onpage", "order", "Heading order", skip ? "warn" : "pass", { impact: 1, detail: skip ? "Skips a level (" + skip + ")." : "", fix: "Use headings in order (H1, then H2, then H3) so the page outline makes sense." }));

    var imgs = qa("img"), noAlt = imgs.filter(function (i) { return !i.hasAttribute("alt"); });
    if (imgs.length) {
      var share = noAlt.length / imgs.length;
      out.push(C("onpage", "alt", "Image alt text", !noAlt.length ? "pass" : share <= 0.2 ? "warn" : "fail", { impact: 2,
        detail: noAlt.length ? noAlt.length + " of " + imgs.length + " images have no alt text." : imgs.length + " images, all with alt text.", fix: PSI_MAP["image-alt"][5] }));
    }

    var og = ["og:title", "og:description", "og:image"].filter(function (p) { return !metaProp(p); });
    out.push(C("onpage", "og", "Social sharing preview", og.length ? (og.length === 3 ? "fail" : "warn") : "pass", { impact: 1, svc: "design",
      detail: og.length ? "Missing: " + og.join(", ") + ". Links shared on Facebook or texts won't show a proper preview." : "",
      fix: "Add Open Graph tags (og:title, og:description, og:image) with a 1200×630 share image." }));

    /* ---------- Technical ---------- */
    var robots = (metaName("robots") || "") + " " + (metaName("googlebot") || "");
    out.push(C("technical", "noindex", "Page can appear in Google", /noindex/i.test(robots) ? "fail" : "pass", { impact: 3,
      detail: /noindex/i.test(robots) ? "This page tells Google NOT to list it (robots: “" + clip(robots, 60) + "”)." : "", fix: PSI_MAP["is-crawlable"][5] }));

    if (pageUrl && o.urlKnown) out.push(C("technical", "https", "Secure connection (HTTPS)", /^https:/i.test(pageUrl) ? "pass" : "fail", { impact: 3, effort: "medium", fix: PSI_MAP["is-on-https"][5] }));

    var canon = q('link[rel="canonical" i]'), ch = canon ? canon.getAttribute("href") || "" : "";
    var chost = ""; try { chost = new URL(ch, pageUrl || "https://x.invalid/").host.replace(/^www\./, ""); } catch (e) { /* bad */ }
    if (!canon) out.push(C("technical", "canonical", "Canonical URL", "warn", { impact: 2, detail: "No canonical tag.", fix: "Add <link rel=\"canonical\" href=\"...\"> with the page's preferred address to prevent duplicate-page problems." }));
    else if (host && chost && chost !== host && chost !== "x.invalid") out.push(C("technical", "canonical", "Canonical URL", "fail", { impact: 3, detail: "Points to a different site: " + clip(ch, 80), fix: "Point the canonical tag at this site's own address. Right now it tells Google to credit another site." }));
    else out.push(C("technical", "canonical", "Canonical URL", "pass", { impact: 2, detail: clip(ch, 80) }));

    var sch = schemaTypes(doc);
    info.schema = sch.types;
    out.push(C("technical", "schema", "Structured data (schema)", sch.bad ? "warn" : sch.types.length ? "pass" : "warn", { impact: 2,
      detail: sch.bad ? sch.bad + " structured data block(s) have code errors." : sch.types.length ? "Found: " + clip(sch.types.filter(function (t, i, a) { return a.indexOf(t) === i; }).join(", "), 90) : "None found.",
      fix: "Add JSON-LD structured data (Organization or LocalBusiness) so Google understands the business. Test it with Google's Rich Results Test." }));

    out.push(C("technical", "lang", "Page language set", q("html[lang]") ? "pass" : "warn", { impact: 1, fix: "Add lang=\"en\" to the <html> tag." }));
    out.push(C("technical", "favicon", "Browser tab icon (favicon)", q('link[rel~="icon" i]') ? "pass" : "warn", { impact: 1, svc: "design", fix: "Add a favicon so the brand shows in browser tabs and Google's mobile results." }));

    if (/^https:/i.test(pageUrl || "")) {
      var mixed = qa("img[src],script[src],iframe[src],link[rel~='stylesheet'][href],source[src]").filter(function (n) { return /^http:\/\//i.test(n.getAttribute("src") || n.getAttribute("href") || ""); });
      out.push(C("technical", "mixed", "No insecure files on a secure page", mixed.length ? "warn" : "pass", { impact: 2, detail: mixed.length ? mixed.length + " file(s) load over http://" : "", fix: "Change every http:// image, script and stylesheet address to https://." }));
    }
    var dead = qa("a").filter(function (a) { var h = (a.getAttribute("href") || "").trim(); return !h || h === "#" || /^javascript:/i.test(h); });
    out.push(C("technical", "deadlinks", "Links that go somewhere", dead.length > 3 ? "warn" : "pass", { impact: 1, detail: dead.length ? dead.length + " link(s) with no real address (\"#\" or script)." : "", fix: "Give every link a real address or turn it into a button." }));

    var appRoot = q("#root, #app, #__next, #__nuxt, [data-reactroot]");
    if (words.length < 80 && (appRoot || qa("script[src]").length > 4)) {
      out.push(C("technical", "jsrender", "Content is in the page code", "fail", { impact: 3, effort: "project",
        detail: "Only " + words.length + " words are in the page code. The rest is built by JavaScript after loading, which makes Google's job harder and slower.",
        fix: "Rebuild key pages as real HTML (a static or server-rendered site) so the content is there the moment Google loads it." }));
    }

    /* ---------- Content ---------- */
    out.push(C("content", "words", "Amount of content", words.length >= 300 ? "pass" : words.length >= 150 ? "warn" : "fail", { impact: 2, effort: "medium",
      detail: words.length + " words of visible text.", fix: "Add useful, original text: what you do, where, for whom, and answers to common questions. Google has no minimum word count, but thin pages rarely give it enough to rank. A few hundred words is a sensible rough guide." }));
    var h2 = qa("h2").length;
    out.push(C("content", "h2", "Subheadings that organize the page", h2 >= 2 ? "pass" : "warn", { impact: 1, detail: h2 + " H2 subheading(s).", fix: "Break the content into sections with clear H2 subheadings (one per service or topic)." }));
    var internal = qa("a[href]").filter(function (a) {
      var h = a.getAttribute("href"); if (/^(mailto:|tel:|#|javascript:)/i.test(h)) return false;
      try { var u = new URL(h, pageUrl || "https://x.invalid/"); return !host || u.host.replace(/^www\./, "") === host || u.host === "x.invalid"; } catch (e) { return false; }
    }).length;
    out.push(C("content", "internal", "Links to other pages on the site", internal >= 3 ? "pass" : "warn", { impact: 1, detail: internal + " internal link(s).", fix: "Link to the main service, about and contact pages from the content, not just the menu." }));
    if (/lorem ipsum/i.test(lowText)) out.push(C("content", "lorem", "No placeholder text", "fail", { impact: 2, detail: "“Lorem ipsum” placeholder text is on the page.", fix: "Replace all placeholder text with real copy." }));
    var yrs = (text.match(/(?:©|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi) || []).map(function (m) { return +m.match(/(\d{4})\s*$/)[1]; });
    if (yrs.length) {
      var yr = Math.max.apply(null, yrs), now = new Date().getFullYear();
      out.push(C("content", "fresh", "Site looks maintained", yr < now - 1 ? "warn" : "pass", { impact: 1, detail: "Footer says © " + yr + ".", fix: "Update the footer year (or make it automatic) and refresh outdated content. Old dates make visitors wonder if the business is still open." }));
    }
    if (kw) {
      var spots = [["title", title], ["main heading", h1s.map(function (h) { return h.textContent; }).join(" ")], ["meta description", desc || ""], ["first 100 words", words.slice(0, 100).join(" ")]];
      var hit = spots.filter(function (s) { return s[1].toLowerCase().indexOf(kw) > -1; }).map(function (s) { return s[0]; });
      var miss = spots.map(function (s) { return s[0]; }).filter(function (s) { return hit.indexOf(s) < 0; });
      out.push(C("content", "keyword", "Main keyword “" + o.keyword.trim() + "” where it counts", hit.length >= 3 ? "pass" : hit.length ? "warn" : "fail", { impact: 3,
        score: hit.length / spots.length, detail: (hit.length ? "Found in: " + hit.join(", ") + ". " : "") + (miss.length ? "Missing from: " + miss.join(", ") + "." : ""),
        fix: "Use the main keyword naturally in the title, the H1, the meta description and the opening paragraph." }));
    }

    /* ---------- UX & Mobile ---------- */
    out.push(C("ux", "viewport", "Mobile viewport", q('meta[name="viewport" i]') ? "pass" : "fail", { impact: 3, fix: PSI_MAP.viewport[5] }));
    if (imgs.length) {
      var unsized = imgs.filter(function (i) { return !(i.getAttribute("width") && i.getAttribute("height")); }).length;
      out.push(C("ux", "imgsize", "Images reserve their space", unsized ? "warn" : "pass", { impact: 1, detail: unsized ? unsized + " image(s) have no width and height, so the page jumps while loading." : "", fix: "Add width and height to images so the layout doesn't shift while they load." }));
    }
    var hasPhone = PHONE.test(text), telLink = !!q('a[href^="tel:" i]');
    if (hasPhone) out.push(C("ux", "tel", "Tap-to-call phone link", telLink ? "pass" : "warn", { impact: 2, fix: "Make the phone number a tap-to-call link (<a href=\"tel:...\">) so phone visitors can call in one tap." }));
    var contact = !!(q("form") || q('a[href*="contact" i]') || q('a[href^="mailto:" i]'));
    out.push(C("ux", "cta", "Clear way to get in touch", contact ? "pass" : "warn", { impact: 2, fix: "Add a visible “Contact” or “Get a quote” button that leads to a form, phone number or email." }));
    var scripts = qa("script[src]").length;
    if (scripts > 20) out.push(C("ux", "scripts", "Not overloaded with scripts", "warn", { impact: 1, effort: "medium", detail: scripts + " external scripts.", fix: "Remove unused plugins, trackers and widgets. Each one slows the page." }));

    /* ---------- Local SEO ---------- */
    out.push(C("local", "phone", "Phone number on the page", hasPhone || telLink ? "pass" : "fail", { impact: 3, fix: "Show the business phone number on every page, usually in the header and footer." }));
    var hasAddr = STREET.test(text) || STATEZIP.test(text) || sch.hasAddress || !!q("address");
    out.push(C("local", "address", "Address or service area shown", hasAddr ? "pass" : "warn", { impact: 2,
      fix: "Show the street address (storefronts) or the cities served (service-area businesses), matching the Google Business Profile exactly." }));
    var localSchema = sch.types.some(function (t) { return LOCAL_TYPES.test(t); });
    out.push(C("local", "localschema", "LocalBusiness structured data", localSchema ? "pass" : "fail", { impact: 2,
      detail: localSchema ? "" : "Google can't read the name, address, phone and hours as structured data.", fix: "Add LocalBusiness JSON-LD with name, address, phone, hours, service area and links to the business's social profiles." }));
    var map = !!(q('iframe[src*="google.com/maps" i], iframe[src*="maps.google" i]') || q('a[href*="google.com/maps" i], a[href*="maps.google" i], a[href*="goo.gl/maps" i], a[href*="maps.app.goo.gl" i]'));
    out.push(C("local", "map", "Map or directions link", map ? "pass" : "warn", { impact: 1, fix: "Add a Google Maps embed or a “Get directions” link, ideally on the contact page." }));
    var socials = qa("a[href]").filter(function (a) { return /(^|\/\/|\.)(facebook|instagram|linkedin|youtube|tiktok|yelp|x|twitter|nextdoor)\.com(\/|$)|g\.page\/|business\.google\.com/i.test(a.getAttribute("href")); }).length;
    out.push(C("local", "social", "Links to social and review profiles", socials ? "pass" : "warn", { impact: 1, detail: socials ? socials + " link(s)." : "", fix: "Link to the Google Business Profile, Facebook and other active profiles from the footer." }));
    if (city) {
      var inHead = (title + " " + h1s.map(function (h) { return h.textContent; }).join(" ")).toLowerCase().indexOf(city) > -1;
      out.push(C("local", "citytitle", "“" + o.city.trim() + "” in the title or main heading", inHead ? "pass" : "fail", { impact: 3, fix: "Put the main city in the page title and H1, for example “Roofing Contractor in " + o.city.trim() + "”." }));
      out.push(C("local", "citytext", "“" + o.city.trim() + "” mentioned in the content", lowText.indexOf(city) > -1 ? "pass" : "warn", { impact: 2, fix: "Mention the city and nearby areas served naturally in the page text." }));
    }
    return { checks: out, info: info, canonical: ch, title: title };
  }

  /* ======================================================================
     3. GRADING AND THE PLAN
     ====================================================================== */
  function letter(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F"; }
  function grade(checks) {
    var cats = CATS.map(function (c) {
      var list = checks.filter(function (x) { return x.cat === c.id && x.status !== "info"; });
      var w = list.filter(function (x) { return x.weight > 0; });
      var tw = w.reduce(function (a, x) { return a + x.weight; }, 0);
      return { id: c.id, name: c.name, blurb: c.blurb, weight: c.weight, checks: list,
        score: tw ? Math.round(100 * w.reduce(function (a, x) { return a + x.weight * val(x); }, 0) / tw) : null };
    });
    var graded = cats.filter(function (c) { return c.score !== null; });
    var tw = graded.reduce(function (a, c) { return a + c.weight; }, 0);
    var overall = tw ? Math.round(graded.reduce(function (a, c) { return a + c.weight * c.score; }, 0) / tw) : null;
    return { cats: cats, overall: overall, letter: overall === null ? "?" : letter(overall), graded: graded.length };
  }
  function plan(checks) {
    var todo = checks.filter(function (c) { return c.status === "fail" || c.status === "warn"; });
    todo.sort(function (a, b) { return (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1) || b.impact - a.impact || b.weight - a.weight; });
    return PHASES.map(function (p) { return { phase: p, items: todo.filter(function (c) { return c.effort === p.id; }) }; });
  }
  function suggestion(g, checks) {
    var fails = checks.filter(function (c) { return c.status === "fail"; }).length;
    var big = checks.some(function (c) { return c.effort === "project" && c.status === "fail"; });
    if (g.overall === null) return "";
    if (g.overall < 60 || (big && g.overall < 75)) return "Suggested approach: website modernization. Several problems are structural (" + fails + " failed checks), so a clean rebuild will likely fix more, for less, than patching the current site one issue at a time.";
    if (g.overall < 80) return "Suggested approach: an SEO tune-up. Work through the quick wins and high-impact fixes below, then re-grade the site to confirm the improvement.";
    return "Suggested approach: a light touch. The foundation is solid. Clear the remaining items below, then focus on fresh content, reviews and local listings.";
  }

  /* ======================================================================
     4. RENDERING
     ====================================================================== */
  var STATUS = { pass: "Pass", warn: "Needs work", fail: "Fix", info: "Info" };
  function ring(score, label) {
    var s = score === null ? 0 : score, cls = score === null ? "na" : s >= 90 ? "good" : s >= 50 ? "mid" : "bad";
    return '<div class="ring ' + cls + '" style="--p:' + s + '"><span>' + (score === null ? "–" : s) + "</span><small>" + esc(label) + "</small></div>";
  }
  function item(c) {
    return '<li class="fix-item">' + badge(c.status) + '<div><b>' + esc(c.label) + "</b>" + (c.detail ? '<p class="muted">' + esc(c.detail) + "</p>" : "") +
      (c.fix ? '<p class="how"><span>How to fix:</span> ' + esc(c.fix) + "</p>" : "") + '<p class="meta">' + ["", "Low", "Medium", "High"][c.impact] + " impact · " + svcTag(c) + (c.src === "Google" ? " · from Google" : "") + "</p></div></li>";
  }
  function badge(st) { return '<span class="st st-' + st + '">' + STATUS[st] + "</span>"; }
  function svcTag(c) { var s = SVC[c.svc] || SVC.web; return '<a class="svc-tag" href="./services.html#' + s[1] + '">' + esc(s[0]) + "</a>"; }

  function render(R) {
    var g = R.grade, host = R.url ? R.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : (R.business || "Pasted page");
    var date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    var phases = plan(R.checks), total = phases.reduce(function (a, p) { return a + p.items.length; }, 0);
    var cls = g.overall === null ? "na" : g.overall >= 80 ? "good" : g.overall >= 60 ? "mid" : "bad";

    var cats = g.cats.map(function (c) {
      var fails = c.checks.filter(function (x) { return x.status === "fail"; }).length, warns = c.checks.filter(function (x) { return x.status === "warn"; }).length;
      return '<div class="cat' + (c.score === null ? " is-na" : "") + '"><div class="cat-top"><b>' + esc(c.name) + "</b><span>" + (c.score === null ? "Not checked" : c.score + "/100 · " + letter(c.score)) + "</span></div>" +
        '<div class="bar"><i style="width:' + (c.score || 0) + '%" class="' + (c.score >= 80 ? "good" : c.score >= 60 ? "mid" : "bad") + '"></i></div>' +
        '<p class="fine">' + (c.score === null ? (c.id === "content" || c.id === "local" ? "Paste the page source to grade this area." : "Run the Google test or paste the page source to grade this area.") : esc(c.blurb) + " · " + fails + " to fix, " + warns + " need work") + "</p></div>";
    }).join("");

    var lh = "";
    if (R.psi) {
      var s = R.psi.scores;
      lh = '<section class="r-block"><h3>Google Lighthouse scores <span class="fine">(' + esc(R.strategy) + ")</span></h3>" +
        '<div class="rings">' + ring(s.performance === null ? null : pct(s.performance), "Performance") + ring(s.accessibility === null ? null : pct(s.accessibility), "Accessibility") +
        ring(s["best-practices"] === null ? null : pct(s["best-practices"]), "Best practices") + ring(s.seo === null ? null : pct(s.seo), "SEO") + "</div>" +
        (R.psi.metrics.length ? '<ul class="metrics">' + R.psi.metrics.map(function (m) { return "<li><span>" + esc(m.name) + "</span><b>" + esc(m.value) + "</b></li>"; }).join("") + "</ul>" : "") +
        (R.psi.field ? '<p class="fine">Real visitor data from Chrome users' + (R.psi.field.origin ? " (whole site)" : "") + ": <b>" + esc(String(R.psi.field.overall).toLowerCase()) + "</b>.</p>" : '<p class="fine">Not enough real-visitor data in Google’s Chrome report for this site, so these are lab results from a single test load.</p>') +
        "</section>";
    }

    var steps = phases.map(function (p, i) {
      if (!p.items.length) return "";
      // Lead with what matters most; tuck low-impact warnings into a "smaller items" list
      var main = p.items.filter(function (c) { return c.status === "fail" || c.impact >= 2; }).slice(0, 10);
      var more = p.items.filter(function (c) { return main.indexOf(c) < 0; });
      if (!main.length) { main = more.slice(0, 10); more = more.slice(10); }
      return '<section class="phase"><div class="ph-head"><span class="ph-n">Step ' + (i + 1) + "</span><h4>" + esc(p.phase.name) + '</h4><span class="fine">' + esc(p.phase.when) + " · " + p.items.length + " item" + (p.items.length > 1 ? "s" : "") + "</span></div>" +
        "<ol>" + main.map(item).join("") + "</ol>" +
        (more.length ? '<details class="more"><summary>' + more.length + " smaller item" + (more.length > 1 ? "s" : "") + " in this step</summary><ol>" + more.map(item).join("") + "</ol></details>" : "") + "</section>";
    }).join("");

    var used = {};
    phases.forEach(function (p) { p.items.forEach(function (c) { (used[c.svc] = used[c.svc] || []).push(c); }); });
    var help = Object.keys(used).map(function (k) {
      var s = SVC[k] || SVC.web;
      return '<li><a href="./services.html#' + s[1] + '"><b>' + esc(s[0]) + "</b></a> · " + used[k].length + " item" + (used[k].length > 1 ? "s" : "") + ", including " + esc(used[k].slice(0, 3).map(function (c) { return c.label.replace(/\s*\(.*\)$/, ""); }).join("; ")) + "</li>";
    }).join("");

    var all = g.cats.filter(function (c) { return c.checks.length; }).map(function (c) {
      return "<h4>" + esc(c.name) + '</h4><ul class="all-list">' + c.checks.map(function (x) { return "<li>" + badge(x.status) + "<span>" + esc(x.label) + (x.detail && x.status === "pass" ? ' <span class="fine">' + esc(x.detail) + "</span>" : "") + "</span></li>"; }).join("") + "</ul>";
    }).join("");

    var notes = [];
    if (R.notes.length) notes = R.notes;
    var info = R.html ? R.html.info : null;

    $("#report").innerHTML =
      '<article class="report is-client" aria-labelledby="r-title">' +
      '<div class="view-bar no-print"><label class="check-line"><input type="checkbox" data-act="view"><span><b>Show fix steps</b> (your copy only)</span></label>' +
      '<p class="fine">Off = client version: shows what’s wrong and why it matters, but not how to fix it. Print and Copy follow this setting.</p></div>' +
      '<header class="r-head"><div><p class="label">SEO report card</p><h2 id="r-title">' + esc(R.business || host) + "</h2>" +
      '<p class="mono">' + esc(R.url || "Pasted page source") + "</p><p class=\"fine\">" + esc(date) + " · Prepared by " + esc(CO.name || "SAP Development Solutions, LLC") + " · " + esc(CO.email || "") + " · " + esc(CO.phone || "") + "</p></div>" +
      '<div class="grade ' + cls + '"><b>' + g.letter + "</b><span>" + (g.overall === null ? "–" : g.overall + "/100") + "</span></div></header>" +
      (notes.length ? '<div class="notice">' + "<p>" + notes.join("<br>") + "</p></div>" : "") +
      '<p class="fine">Overall grade from ' + g.graded + " of 5 areas" + (g.graded < 5 ? ". Add the missing source to grade all five." : ".") +
      (info ? " · " + info.words + " words on the page" + (info.platform ? " · Built with " + esc(info.platform) : "") : "") + "</p>" +
      '<section class="r-block"><h3>Scores by area</h3><div class="cats">' + cats + "</div></section>" + lh +
      '<section class="r-block"><h3>Your path to a better grade</h3>' +
      '<div class="advice" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Recommendation (you can edit this before printing)">' + esc(suggestion(g, R.checks)) + "</div>" +
      '<p class="fine no-print">You can click the recommendation above and edit it before printing.</p>' +
      (total ? steps : '<p>No problems found in the checks that ran. Nice work.</p>') + "</section>" +
      '<section class="r-block client-cta"><h3>Ready to fix this?</h3><p>' + esc(CO.shortName || "SAP Development Solutions") +
      " can take care of the items in this plan for you, starting with the quick wins. Contact us for a quote: " + esc(CO.email || "") + " · " + esc(CO.phone || "") + "</p></section>" +
      (help ? '<section class="r-block"><h3>Where ' + esc(CO.shortName || "SAP Development Solutions") + ' can help</h3><ul class="help">' + help + "</ul></section>" : "") +
      '<section class="r-block r-manual"><h3>Check by hand</h3><p class="fine">This tool can’t see these, but they matter a lot for local search.</p><ul class="manual">' + MANUAL.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul></section>" +
      '<details class="r-block all"><summary>All checks (' + R.checks.length + ")</summary>" + all + "</details>" +
      '<p class="fine disclaimer">This report is a snapshot from automated checks on ' + esc(date) + ". Search rankings depend on many things outside a website, including competition, reviews and Google’s own changes, so no ranking result is guaranteed.</p>" +
      '<div class="btn-row no-print"><button type="button" class="btn btn-primary" data-act="print">Print or save as PDF</button><button type="button" class="btn btn-secondary on-light" data-act="copy">Copy summary</button><button type="button" class="btn btn-secondary on-light" data-act="new">Grade another site</button></div>' +
      '<p class="fine no-print" id="copy-status" role="status" aria-live="polite"></p>' +
      "</article>";
    R.date = date; R.phases = phases;
    LAST = R;
    $("#report").hidden = false;
    $("#report").scrollIntoView({ behavior: "smooth", block: "start" });
    $("#r-title").setAttribute("tabindex", "-1"); $("#r-title").focus({ preventScroll: true });
  }

  function summaryText(R) {
    var g = R.grade, L = [], rep = document.querySelector(".report"), client = !rep || rep.classList.contains("is-client");
    L.push("SEO REPORT CARD: " + (R.business || R.url || "Pasted page"));
    if (R.url) L.push(R.url);
    L.push(R.date + " · Prepared by " + (CO.name || "SAP Development Solutions, LLC") + " · " + (CO.email || "") + " · " + (CO.phone || ""), "");
    L.push("OVERALL GRADE: " + g.letter + (g.overall === null ? "" : " (" + g.overall + "/100)") + ", based on " + g.graded + " of 5 areas", "");
    g.cats.forEach(function (c) { L.push("- " + c.name + ": " + (c.score === null ? "not checked" : c.score + "/100 (" + letter(c.score) + ")")); });
    if (R.psi) { var s = R.psi.scores; L.push("", "Google Lighthouse (" + R.strategy + "): Performance " + (s.performance === null ? "n/a" : pct(s.performance)) + ", Accessibility " + (s.accessibility === null ? "n/a" : pct(s.accessibility)) + ", Best practices " + (s["best-practices"] === null ? "n/a" : pct(s["best-practices"])) + ", SEO " + (s.seo === null ? "n/a" : pct(s.seo))); }
    var adv = $(".advice"); if (adv && adv.textContent.trim()) L.push("", adv.textContent.trim());
    R.phases.forEach(function (p, i) {
      if (!p.items.length) return;
      L.push("", "STEP " + (i + 1) + ": " + p.phase.name.toUpperCase() + " (" + p.phase.when + ")");
      p.items.forEach(function (c) { L.push("- [" + STATUS[c.status] + "] " + c.label + (c.detail ? ": " + c.detail : "")); if (c.fix && !client) L.push("  Fix: " + c.fix); });
    });
    if (client) L.push("", "READY TO FIX THIS?", (CO.shortName || "SAP Development Solutions") + " can take care of the items in this plan for you, starting with the quick wins. Contact us for a quote: " + (CO.email || "") + " · " + (CO.phone || ""));
    else { L.push("", "CHECK BY HAND"); MANUAL.forEach(function (m) { L.push("- " + m); }); }
    L.push("", "Automated snapshot. No ranking result is guaranteed.");
    return L.join("\n");
  }

  /* ======================================================================
     5. WIRING
     ====================================================================== */
  var LAST = null;
  var status = $("#grader-status"), btn = $('button[type="submit"]', form);
  function say(kind, msg) { status.className = "form-status show " + kind; status.innerHTML = "<p>" + msg + "</p>"; }
  function normUrl(u) {
    u = String(u || "").trim(); if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try { var x = new URL(u); if (!/\./.test(x.hostname)) return null; return x.href; } catch (e) { return null; }
  }

  // Settings: API key kept only in this browser
  var keyIn = $("#g-key");
  if (keyIn) {
    keyIn.value = store("sapSeoGraderKey");
    $("#g-key-save").addEventListener("click", function () { store("sapSeoGraderKey", keyIn.value.trim()); $("#g-key-msg").textContent = keyIn.value.trim() ? "Saved in this browser only." : "Cleared."; });
    $("#g-key-clear").addEventListener("click", function () { keyIn.value = ""; store("sapSeoGraderKey", ""); $("#g-key-msg").textContent = "Cleared."; });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var rawUrl = $("#g-url").value, url = normUrl(rawUrl), src = $("#g-src").value.trim(), usePsi = $("#g-psi").checked;
    var urlField = $("#g-url").closest(".field");
    urlField.classList.remove("bad"); $("#g-url").setAttribute("aria-invalid", "false");
    if (url && !usePsi && !src) { say("err", "Turn on Google’s PageSpeed test, or paste the page source, so there’s something to grade."); return; }
    if (url === null || (!url && !src) || (!url && usePsi && !src)) {
      urlField.classList.add("bad"); $("#g-url").setAttribute("aria-invalid", "true"); $("#g-url").focus();
      say("err", url === null ? "That doesn't look like a web address. Try something like example.com." : "Enter the website address (or paste the page source below).");
      return;
    }
    if (src && !/<(html|head|body|title|meta|div)\b/i.test(src)) { say("err", "The pasted text doesn't look like page source. On the site, press Ctrl+U (Mac: Option+Cmd+U), then Ctrl+A and Ctrl+C (Mac: Cmd+A, Cmd+C), and paste here."); $("#g-src").focus(); return; }
    var strategy = (form.querySelector('input[name="strategy"]:checked') || {}).value || "mobile";
    var opts = { keyword: $("#g-kw").value, city: $("#g-city").value, urlKnown: /^https?:\/\//i.test(rawUrl.trim()) };
    var R = { url: url, business: $("#g-biz").value.trim(), strategy: strategy === "desktop" ? "Desktop" : "Mobile", checks: [], notes: [], psi: null, html: null };

    btn.disabled = true; $("#report").hidden = true;
    var started = Date.now(), timer = null;
    function tick() { say("info", '<span class="spinner" aria-hidden="true"></span>Google is loading and testing the page… ' + Math.round((Date.now() - started) / 1000) + "s. This usually takes 15 to 60 seconds."); }

    var job = Promise.resolve();
    if (usePsi && url) {
      tick(); timer = setInterval(tick, 1000);
      job = runPSI(url, strategy, store("sapSeoGraderKey")).then(function (j) { R.psi = fromPSI(j); }, function (err) {
        if (!src) throw err;
        R.notes.push("Google PageSpeed didn't finish (" + psiError(err) + "), so this report only uses the pasted page source.");
      });
    }
    var psiFailed = null;
    job = job.catch(function (err) { psiFailed = err; throw err; });
    job.then(function () {
      clearInterval(timer);
      if (R.psi && R.psi.finalUrl && /^https?:/i.test(R.psi.finalUrl)) {
        if (/^https:/i.test(R.url) && /^http:/i.test(R.psi.finalUrl)) R.notes.push("This site sends visitors from the secure https:// address to the insecure http:// version.");
        R.url = R.psi.finalUrl; opts.urlKnown = true;
      }
      if (src) {
        R.html = fromHTML(src, R.url || "", opts);
        if (!url && R.html.canonical && /^https?:/i.test(R.html.canonical)) R.url = R.html.canonical;
      } else {
        R.notes.push("Content and Local SEO weren't checked. For the full report, paste the page source (see “Add page source” above) and grade again.");
      }
      // Overlapping checks: Google sees the real server response (redirects, HTTP headers),
      // so its result wins for these. For the rest, the deeper pasted-source check wins.
      var GOOGLE_WINS = { https: 1, noindex: 1, viewport: 1, status: 1 };
      var google = R.psi ? R.psi.checks : [], gkeys = {}, pkeys = {};
      google.forEach(function (c) { gkeys[c.key] = 1; });
      var paste = (R.html ? R.html.checks : []).filter(function (c) { return !(GOOGLE_WINS[c.key] && gkeys[c.key]); });
      paste.forEach(function (c) { pkeys[c.key] = 1; });
      R.checks = paste.concat(google.filter(function (c) { return !pkeys[c.key]; }));
      if ((opts.keyword || opts.city) && !src) R.notes.push("Keyword and city checks need the pasted page source.");
      R.grade = grade(R.checks);
      status.className = "form-status"; status.innerHTML = "";
      render(R);
    }).catch(function (err) {
      clearInterval(timer);
      if (psiFailed) say("err", psiError(err) + " You can also paste the page source below and grade without Google.");
      else { say("err", "Something went wrong building the report. Try again, or paste a smaller part of the page source."); if (window.console) console.error(err); }
    }).then(function () { btn.disabled = false; });
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b || !LAST) return;
    var act = b.getAttribute("data-act");
    if (act === "view") { var r = document.querySelector(".report"); if (r) r.classList.toggle("is-client", !b.checked); return; }
    if (act === "print") window.print();
    if (act === "new") { form.reset(); if (keyIn) keyIn.value = store("sapSeoGraderKey"); $("#report").hidden = true; window.scrollTo({ top: 0, behavior: "smooth" }); $("#g-url").focus({ preventScroll: true }); }
    if (act === "copy") {
      var t = summaryText(LAST), msg = $("#copy-status");
      (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(t) : Promise.reject())
        .then(function () { msg.textContent = "Summary copied. Paste it into an email or document."; })
        .catch(function () {
          var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
          var ok = false; try { ok = document.execCommand("copy"); } catch (x) { ok = false; }
          ta.remove(); msg.textContent = ok ? "Summary copied. Paste it into an email or document." : "Couldn't copy automatically. Use Print or save as PDF instead.";
        });
    }
  });
  window.addEventListener("beforeprint", function () { Array.prototype.forEach.call(document.querySelectorAll(".report details.more"), function (d) { d.open = true; }); });

  // Expose the pure functions for testing in the browser console
  window.SAPGrader = { fromPSI: fromPSI, fromHTML: fromHTML, grade: grade };
})();
