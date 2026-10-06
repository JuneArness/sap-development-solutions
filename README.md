# SAP Development Solutions, LLC | Official Website

The official public website for **SAP Development Solutions, LLC**, a technology and
creative-solutions company. It is plain HTML, CSS and JavaScript, with no backend, no build
step and no paid platform, and it runs on GitHub Pages.

- **Pages:** Home, Services, Solutions, About, Contact, plus a 404 page
- **Removed from the Base44 prototype:**
  - the Portfolio page and its demo projects
  - the Dashboard, SEO Audit and Packages/Tiers tools
  - unverified claims ("5+ certifications", "5+ years", "100% client satisfaction")

## Folder structure (23 files, one folder, no subfolders)

```text
sap-development-solutions/
├── index.html               Home: hero, what we do, services, process, why us, selected work
├── services.html            7 service areas in detail
├── solutions.html           Help by audience (small business, entrepreneurs, nonprofits, creators, established)
├── about.html               Company story, approach, capabilities, founder
├── contact.html             Project form, direct contact, FAQ
├── 404.html                 "Page not found"
├── data.js                  THE FILE YOU EDIT: contact info, services, selected work, form options
├── app.js                   Menu, services/work cards, contact form, animations
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

## Step 4: Fix link previews (after it's live)

In each `.html` file, replace `https://www.example.com/` near the top with the live
address: canonical, og:url, og:image, twitter:image, and on `index.html` the ld+json block.
On GitHub: open the file → **pencil** → **Ctrl + F** → change → **Commit changes**.

## Custom domain (recommended for the company site)

1. **Settings → Pages → Custom domain**: enter the domain (e.g. `www.yourdomain.com`) and
   click **Save**.
2. At the registrar:
   - Add a **CNAME** record for `www` pointing to `YOUR-ACCOUNT.github.io`.
   - Add four **A** records for the bare domain: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` and `185.199.111.153`.
3. Once DNS updates (up to 24 hours), tick **Enforce HTTPS** and redo Step 4.

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

## Selected Work: how projects were verified

The old portfolio was **not** migrated. GitHub Pages sites under `junearness.github.io`
were checked one by one on October 5, 2026:

| Project | Status | Shown? |
| --- | --- | --- |
| REC 517 (`/rec-517/`) | Verified client project, live | Yes |
| June Arness Official (`/June-Arness-The-Artist/`) | Verified in-house project (founder's artist site), live | Yes |
| Mel's Dress Up Studio (`/mel-dress-up/`) | Verified project, live | Yes |
| PSP Entertainment | Active project, built but not live yet (404) | No |
| G Rap Community Hub | Active project, not live yet (404) | No |
| Pangea Shores | Active project, not live yet (404) | No |
| Base44 portfolio entries (ERP, E-Commerce, Mobile Banking and others) | Demo / unverified | Removed |

**To add a project once it's live:** in `data.js`, copy one block in `work:` and update
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
| Selected Work | `work:` |
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

This is a public, static site. There are no admin pages, passwords, keys, trackers or
analytics. Don't add admin tools here: anything on GitHub Pages is visible to everyone.

## Checked before delivery

- All 6 pages load with no script errors, served from a subfolder the way GitHub Pages
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
- No Portfolio, admin tools, demo projects or unverified claims remain.
- A separate reviewer checked every claim against the brief, and its suggestions were
  applied.
