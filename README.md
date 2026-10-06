# SAP Development Solutions, LLC | Official Website

The official public website for **SAP Development Solutions, LLC**, a technology and
creative-solutions company. It is plain HTML, CSS and JavaScript, with no backend, no build
step and no paid platform, and it runs on GitHub Pages.

- **Public pages:** Home, Services, Solutions, Portfolio, About, Contact, Free SEO Audit, plus a 404 page
- **Internal tool:** `seo-grader.html`, the SEO grader (not in the menu, hidden from search engines)
- **Removed from the Base44 prototype:**
  - the old portfolio's demo projects (the new Portfolio shows real work only)
  - the Dashboard and Packages/Tiers tools, and the grader's fake "Admin access" button
  - unverified claims ("5+ certifications", "5+ years", "100% client satisfaction", "Certified software developer")

## Folder structure (34 files, one folder, no subfolders)

```text
sap-development-solutions/
├── index.html               Home: hero, what we do, services, process, why us, selected work
├── services.html            7 service areas in detail
├── solutions.html           Help by audience (small business, entrepreneurs, nonprofits, creators, established)
├── about.html               Company story, approach, capabilities, founder
├── portfolio.html           Live projects + in-progress builds + free audit offer
├── contact.html             Project form, direct contact, FAQ
├── free-seo-audit.html      Public "request a free SEO audit" form
├── seo-grader.html          INTERNAL: the SEO grader tool (see "Using the SEO grader")
├── seo-grader.js            The grader's logic
├── seo-grader.css           The grader's styles and printable report
├── 404.html                 "Page not found"
├── data.js                  THE FILE YOU EDIT: contact info, services, work, form options
├── app.js                   Menu, services/work cards, both forms, animations
├── style.css                All styling (brand colors at the top)
├── responsive.css           Phone/tablet/desktop layouts, reduced motion
├── logo-full.jpg            Official SAP logo artwork
├── logo-mark.png            Square "SAP" crop of the logo (header and footer)
├── favicon.png              Browser tab icon
├── apple-touch-icon.png     Phone home-screen icon
├── og-image.jpg             Picture shown when the link is shared
├── work-rec-517.jpg (+ -sm) Selected Work screenshots (large + small)
├── work-june-arness.jpg (+ -sm)
├── work-mel-dress-up.jpg (+ -sm)
├── work-psp-entertainment.jpg (+ -sm)   In-progress previews (Portfolio page)
├── work-grap-hub.jpg (+ -sm)
├── work-pangea-shores.jpg (+ -sm)
├── README.md
└── .gitignore
```

**Why no folders?** The brief suggested `css/`, `js/` and `images/` folders. Uploading
through GitHub's website can drop folders and break every page, but a flat folder can't
break that way. The site works the same either way. Files keep the brief's names
(`style.css`, `responsive.css`, `app.js`, `data.js`).

## Step 1: Preview on your computer

1. Right-click the zip → **Extract All** → **Extract**. Never open pages from inside the zip.
2. Run this with Python 3.11:

```bash
cd sap-development-solutions
python -m http.server 8000
```

3. Open http://localhost:8000. Press `Ctrl + C` in the terminal to stop.

## Step 2: Put it on GitHub

1. Sign in at https://github.com → **+** → **New repository**.
2. Name it `sap-development-solutions`, choose **Public**, and leave README, .gitignore and
   license **unchecked**. Click **Create repository**.
3. Click **uploading an existing file**.
4. Open the extracted folder, press **Ctrl + A**, and drag all the files (not the folder)
   into the browser.
5. When all the files are listed, type `Initial SAP Development Solutions website` and click
   **Commit changes**.
6. Check that `index.html` is at the top level of the repository.

Or with Git:

```bash
cd sap-development-solutions
git init
git add .
git commit -m "Initial SAP Development Solutions website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Step 3: Turn on GitHub Pages

1. In the repository, go to **Settings** → **Pages**.
2. Set **Source** to **Deploy from a branch**, then choose **main** and **/ (root)**, and click
   **Save**.
3. Wait 1 to 3 minutes. The site will be at
   `https://YOUR-ACCOUNT.github.io/sap-development-solutions/`.
4. Open it and press **Ctrl + Shift + R**.

## Step 4: Check the site address (important for Google)

Every page already points Google and link previews at
`https://junearness.github.io/sap-development-solutions/`. That's correct if you upload to
the **JuneArness** GitHub account with the repository name `sap-development-solutions`.

If you use a different account, a different repository name, or a custom domain, replace
that address near the top of every `.html` file (canonical, og:url, og:image,
twitter:image, and on `index.html` the ld+json block). On GitHub: open the file →
**pencil** → **Ctrl + F** → change → **Commit changes**. Skipping this tells Google the
real pages live somewhere else.

## Custom domain (recommended for the company site)

1. **Settings → Pages → Custom domain**: enter the domain (e.g. `www.yourdomain.com`) and
   click **Save**.
2. At the registrar:
   - Add a **CNAME** record for `www` pointing to `YOUR-ACCOUNT.github.io`.
   - Add four **A** records for the bare domain: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` and `185.199.111.153`.
3. Once DNS updates (up to 24 hours), tick **Enforce HTTPS** and redo Step 4 with the new
   domain.

## Before launch: please confirm

1. **Email:** set to `sapdevelopmentsolutions@gmail.com`, as you confirmed. To change it later, edit
   `data.js` (`company.email`) and the copies in each page's footer and mobile menu
   (**Ctrl + F** on GitHub).
2. **Logo:** the official SAP logo is in place. `logo-full.jpg` is the full artwork (About
   page and share image) and `logo-mark.png` is the center "SAP" crop (header, footer,
   browser tab). The site colors in `style.css` come from the logo.
3. **Services.** Remove any service you don't want to offer yet from `data.js`.
4. **Process promises.** Check you're comfortable with the wording about written
   estimates, progress previews, testing, step-by-step guides and support after launch.
   It's in the "How we work" section of `index.html`.
5. **Founder section.** Add a bio and photo (`company.founderBio`, `company.founderPhoto`),
   and the matching text on `about.html`.
6. **In-progress previews.** The Portfolio shows PSP Entertainment, G Rap Community Hub and
   Pangea Shores as "In progress" with a screenshot. Check that each owner is OK with a
   preview before launch, or remove their block from `upcoming:` in `data.js`.

## Using the SEO grader (internal)

Open `https://YOUR-ACCOUNT.github.io/sap-development-solutions/seo-grader.html` and bookmark
it. It isn't linked anywhere on the site.

**Grade a site:**

1. Type the client's website address (for example `theirbusiness.com`).
2. Leave **Mobile** selected. Google ranks sites by their mobile version.
3. Optional: add the business name (shown on the report), their main keyword (like
   `roofing`) and their city.
4. **For the full report (recommended):** click **Add page source**, then follow the steps
   shown: open their site, press **Ctrl + U** (Mac: **Option + Cmd + U**), then **Ctrl + A**,
   **Ctrl + C** (Mac: **Cmd + A**, **Cmd + C**), and paste into the box. Without this, Content and Local SEO are marked "Not checked".
5. Click **Grade this site** and wait 15 to 60 seconds while Google tests the page.

**What you get:** an A to F grade, scores in five areas (On-page, Technical, Content, UX &
Mobile, Local SEO), Google's Lighthouse scores, and a fix path in three steps: quick wins,
high-impact fixes and bigger projects. Each item says what's wrong, how to fix it, and
which SAP service covers it.

**Client version vs. your copy:** every report opens in the **client version**. It shows
the grade, what's wrong and why it matters, plus a "Ready to fix this?" box with your
contact details, but **not** the how-to-fix steps or the "Check by hand" list. Tick
**Show fix steps (your copy only)** at the top of the report to see the full playbook for
yourself. Print and Copy summary always follow the current setting, so untick it before
you print or copy anything for a client.

**Before you share it:** click the yellow recommendation box and edit it in your own words.
Then use **Print or save as PDF** (choose "Save as PDF" as the printer) or **Copy summary**
to paste into an email.

**If Google says its limit is busy:** get a free Google API key (steps are inside the
grader under **Settings: Google API key**). The key is saved only in your browser, never in
the website files. Restrict it two ways, as the steps say: to your website's address
(Application restrictions → Websites) and to the PageSpeed Insights API only. Then a
copied key is useless to anyone else.

**Good to know:**

- The grader checks one page at a time. Grade the home page first, then key service pages.
- Some things can't be checked automatically, such as the Google Business Profile, reviews,
  and directory listings. The report lists them under "Check by hand".
- It's a snapshot from automated checks. Don't promise clients rankings.
- **Privacy:** the page is hidden from search engines, but anyone with the link can open
  it. That's fine, because it only reads public websites. A password on this page would be
  for show only (anyone can read a static site's code), so there isn't one. If you ever
  need truly private tools, they belong on a server with real logins.

## Free SEO Audit page (public)

`free-seo-audit.html` collects name, phone, email, website and consent. It uses the same
`formEndpoint` as the contact form (see "Connecting the contact form"). Until that's set,
it says plainly that nothing was sent and offers the visitor's email app instead. It's
linked from the footer and the Portfolio page.

## Portfolio: how projects were verified

The old portfolio was **not** migrated. GitHub Pages sites under `junearness.github.io`
were checked one by one on October 5, 2026:

| Project | Status | Shown? |
| --- | --- | --- |
| REC 517 (`/rec-517/`) | Verified client project, live | Yes |
| June Arness Official (`/June-Arness-The-Artist/`) | Verified in-house project (founder's artist site), live | Yes |
| Mel's Dress Up Studio (`/mel-dress-up/`) | Verified project, live | Yes |
| PSP Entertainment | Not live yet (404) | Portfolio only, labeled "In progress", no link |
| G Rap Community Hub | Not live yet (404) | Portfolio only, labeled "In progress", no link |
| Pangea Shores | Not live yet (404) | Portfolio only, labeled "In progress", no link |
| Base44 portfolio entries (ERP, E-Commerce, Mobile Banking and others) | Demo / unverified | Removed |

**When an in-progress project goes live:** in `data.js`, move its block from `upcoming:`
up into `work:`, add `client:` and `url:`, change `status` to `"Live"`, and take a fresh
screenshot. To hide the whole "In progress" section, change it to `upcoming: [],`.

**To add a new live project:** in `data.js`, copy one block in `work:` and update
the name, client, summary, built list and URL. Take a screenshot of the live home page,
save it as `work-NAME.jpg` (about 1200 × 750) and a smaller `work-NAME-sm.jpg` (about
720 × 450), and upload both. Only add live, real work, with no invented results.

## Where to update things (data.js)

| To change | Where |
| --- | --- |
| Email, phone, founder | `company:` |
| Social links | `company.socials` |
| Contact form sending | `company.formEndpoint` (see below) |
| Services and what's included | `services:` |
| Live projects (home + Portfolio) | `work:` |
| In-progress projects (Portfolio) | `upcoming:` |
| Form dropdowns (project type, budget, timeline) | `projectTypes`, `budgets`, `timelines` |

Edit on GitHub (**pencil** → **Commit changes**), wait about 2 minutes, then press
**Ctrl + Shift + R**. Keep text in "double quotes" and a comma after every item except the
last.

## Connecting the contact form

Until it's connected, the form checks the fields and then says plainly that the message
was **not sent**. It offers a link to open the visitor's email app with everything filled
in.

1. Create a free account at https://formspree.io → **New Form** → enter the company inbox.
2. Copy the endpoint (for example `https://formspree.io/f/abcdwxyz`).
3. In `data.js`, set `formEndpoint: "https://formspree.io/f/abcdwxyz",`.
4. Send a test from the live site.

Netlify Forms, EmailJS or a future backend can be connected the same way. The form already
sends standard form fields: name, email, phone, company, type, budget, timeline and
description.

## Security

This is a public, static site. There are no passwords, keys, trackers or analytics in the
files. The only internal page is the SEO grader, which reads public information only (see
above). Don't add real admin tools here: anything on GitHub Pages is visible to everyone.
Never upload saved Base44 pages; they can contain login tokens.

## Checked before delivery

- All 9 pages load with no script errors, served from a subfolder the way GitHub Pages
  serves them. No broken images or links.
- No sideways scrolling at 1920, 1440, 1280, 1024, 768, 480, 430, 390 and 375px.
- The mobile menu opens and closes with Escape, keeps focus inside while open, and links
  navigate.
- Service links like `services.html#audio` jump to the right section.
- The contact form:
  - checks required fields and the phone format;
  - pre-selects the project type from the service links;
  - shows an honest "not sent" notice with the email-app fallback.
- The FAQ items open and close.
- The free audit form checks every field (including consent and the website address) and
  shows the honest "not sent" notice with the email-app fallback.
- The SEO grader was tested with simulated Google responses (a normal result, the "busy"
  limit error and a failed page load), with pasted page source alone, and with both. Also
  tested: saving the API key, Copy summary, and the printed report. Live Google calls
  couldn't be run from the build machine, so run one real grade after launch.
- No demo projects or unverified claims remain.
- A separate reviewer checked every claim against the brief, and its suggestions were
  applied.
