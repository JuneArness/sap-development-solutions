/* ==========================================================================
   SAP DEVELOPMENT SOLUTIONS | data.js : THE FILE YOU EDIT
   --------------------------------------------------------------------------
   Contact details, services, the "Selected Work" projects and the contact
   form options all live here. Change something once and every page updates.

   RULES (a small typo can blank a section):
   - Keep text inside "double quotes". Need a quote inside? Use ’ or \".
   - Every item in a list ends with a comma, EXCEPT the last one.
   - "" (empty quotes) hides that item.
   - After editing on GitHub, open the site and press Ctrl+Shift+R.
   ========================================================================== */
window.SAP = {

  /* ------------------------------------------------------------------------
     1. COMPANY DETAILS
     ------------------------------------------------------------------------ */
  company: {
    name: "SAP Development Solutions, LLC",
    shortName: "SAP Development Solutions",

    email: "sapdevelopmentsolutions@gmail.com",   // confirmed by the owner
    phone: "616-729-2203",

    founder: "Stephen Arness Parks Jr.",
    founderTitle: "Founder & Owner",
    founderPhoto: "",          // EDIT: e.g. "founder.jpg" once you upload a photo
    founderBio: [],            // EDIT: add paragraphs, e.g. ["First paragraph.", "Second."]

    /* Social links. Only filled-in links are shown. */
    socials: [
      { label: "GitHub", url: "https://github.com/JuneArness" }
      // { label: "LinkedIn",  url: "https://www.linkedin.com/company/YOUR-PAGE" },
      // { label: "Instagram", url: "https://www.instagram.com/YOUR-HANDLE" }
    ],

    /* FORM ENDPOINT
       The contact form does NOT send anywhere until this is filled in.
       Free option: create a form at https://formspree.io and paste its
       address here, e.g. "https://formspree.io/f/abcdwxyz".
       Until then the form offers to open the visitor's email app instead. */
    formEndpoint: ""
  },

  /* ------------------------------------------------------------------------
     2. SERVICES (Services page + home page snapshot)
       id        used in links (services.html#web)
       icon      one of: code, web, design, pos, launch, audio, video
       summary   one sentence
       items     what's included
       note      optional small print shown under the card
     ------------------------------------------------------------------------ */
  services: [
    {
      id: "software", icon: "code", name: "Software Development",
      summary: "Custom applications and business software built around how your team actually works.",
      items: ["Custom applications", "Web applications", "Business software", "Automation", "Data-driven systems"]
    },
    {
      id: "web", icon: "web", name: "Web Development",
      summary: "Fast, responsive websites you own, from a single landing page to a full business site.",
      items: ["Business websites", "Landing pages", "Responsive design", "Custom interfaces", "GitHub Pages and static deployments", "Website modernization"]
    },
    {
      id: "design", icon: "design", name: "Graphic Design",
      summary: "Brand and marketing visuals that make a business look as good as it is.",
      items: ["Branding", "Logos", "Marketing graphics", "Digital assets", "Business materials"]
    },
    {
      id: "business-tech", icon: "pos", name: "Business Technology",
      summary: "Systems that keep day-to-day operations organized, from the front counter to the back office.",
      items: ["POS systems", "Digital ordering", "Digital workflows", "Custom business tools", "Data entry and digital organization", "Automation"]
    },
    {
      id: "formation", icon: "launch", name: "Business Formation Support",
      summary: "Practical, organized support for getting a business or nonprofit off the ground.",
      items: ["Digital launch support", "Business and organization setup guidance", "Nonprofit formation support"],
      note: "SAP Development Solutions is not a law firm or accounting firm and does not provide legal, tax or accounting advice. For those, consult a licensed professional."
    },
    {
      id: "audio", icon: "audio", name: "Audio Engineering",
      summary: "Clean, professional sound for music, podcasts and digital content.",
      items: ["Audio production", "Mixing", "Editing", "Podcast and audio support", "Music production support"]
    },
    {
      id: "video", icon: "video", name: "Video Engineering",
      summary: "Video editing and production support that turns footage into finished content.",
      items: ["Video editing", "Digital content", "Motion graphics", "Production support"]
    }
  ],

  /* ------------------------------------------------------------------------
     3. SELECTED WORK (home page)
     ONLY verified, live work belongs here. Never add demo or unfinished
     projects. Fields:
       status   "Live" for public sites
       type     e.g. "Client website", "Internal project"
       built    short facts about what was built (no invented results)
       url      the live address
     To add a project when it's live, copy one block and edit it.
     ------------------------------------------------------------------------ */
  work: [
    {
      name: "REC 517",
      client: "REC 517 LLC · Jackson, Michigan",
      type: "Client website",
      status: "Live",
      image: "work-rec-517.jpg",
      imageSm: "work-rec-517-sm.jpg",
      imageAlt: "REC 517 website home page with the headline Train. Compete. Develop. Belong. and the REC 517 logo",
      summary: "Public website for a planned multi-sport indoor recreation and training facility.",
      built: ["Six-page responsive site", "Programs directory with category filters", "Facility, impact and contact pages", "Photo gallery with full-screen viewer"],
      url: "https://junearness.github.io/rec-517/"
    },
    {
      name: "June Arness Official",
      client: "Founder’s own artist website",
      type: "In-house project",
      status: "Live",
      image: "work-june-arness.jpg",
      imageSm: "work-june-arness-sm.jpg",
      imageAlt: "June Arness Official website home page with a large artist photo and Listen Now button",
      summary: "Artist website rebuilt from a Base44 prototype into a fast static site.",
      built: ["Music releases with streaming links", "Video and gallery pages", "Community and music submission pages", "Press kit page"],
      url: "https://junearness.github.io/June-Arness-The-Artist/"
    },
    {
      name: "Mel’s Dress Up Studio",
      client: "Interactive web game",
      type: "Web app",
      status: "Live",
      image: "work-mel-dress-up.jpg",
      imageSm: "work-mel-dress-up-sm.jpg",
      imageAlt: "Mel’s Dress Up Studio game screen with a character picker, wardrobe tiles and a 3D character",
      summary: "A kid-friendly dress-up game that runs entirely in the browser.",
      built: ["Interactive dress-up with eight characters", "Save to an on-device gallery", "Play-money shop and animated scenes", "Works offline once installed"],
      url: "https://junearness.github.io/mel-dress-up/"
    }
  ],

  /* ------------------------------------------------------------------------
     4. CONTACT FORM OPTIONS
     ------------------------------------------------------------------------ */
  projectTypes: ["Website", "Web Application", "Software", "POS / Business System", "Graphic Design", "Branding", "Audio", "Video", "Business Formation Support", "Other"],
  budgets: ["Not sure yet", "Under $1,000", "$1,000 – $2,500", "$2,500 – $5,000", "$5,000 – $10,000", "$10,000+"],
  timelines: ["As soon as possible", "Within 1 month", "1 – 3 months", "3+ months", "Flexible"]
};
