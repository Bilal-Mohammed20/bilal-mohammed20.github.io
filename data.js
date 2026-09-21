/* ============================================================
   PORTFOLIO CONTENT
   Edit this file to update the site. No HTML/CSS knowledge needed.
   Each array below maps directly to a section of the page.
   To add a new project, role, or skill, copy an existing object
   in the array and change the values.
   ============================================================ */

const CONTENT = {

  profile: {
    name: "Bilal Ahmed Mohammed",
    location: "Hobart, Tasmania, Australia",
    email: "bmoham20@gmail.com",
    linkedin: "https://www.linkedin.com/in/bilal-ahmed-mohammed",
    linkedinLabel: "linkedin.com/in/bilal-ahmed-mohammed",
    resumeUrl: "assets/Bilal-Ahmed-Mohammed-Resume.pdf",
    availability: "Australian Permanent Resident · Open to relocating to Victoria for the right opportunity",
    heroEyebrow: "ICT Program Officer · Tasmanian Department of Health",
    heroHeadline: "I take digital systems from pilot to full-scale adoption.",
    heroSub: "The Research Ethics & Governance Information System (REGIS) is my proof: I designed and delivered its staged statewide rollout across 146 departments in Tasmania, and built the migration program, Power BI reporting, and automation that keep it running.",
    stackLayers: [
      { id: "requirements", label: "Requirements", sub: "Stakeholder mapping & needs, workflows, policy", color: "var(--layer-coral)" },
      { id: "systems", label: "Systems", sub: "REGIS, platform config, migration", color: "var(--layer-violet)" },
      { id: "automation", label: "Build", sub: "R, VBA, Power Automate, Power Apps, JavaScript", color: "var(--layer-gold)" },
      { id: "insight", label: "Insight", sub: "Power BI dashboards & reporting", color: "var(--layer-teal)" },
      { id: "impact", label: "Adoption", sub: "Training, rollout, sustained adoption", color: "var(--layer-pink)" }
    ]
  },

  stats: [
    { value: "146", label: "Departments across 4 regions", href: "#journey-regis-rollout" },
    { value: "650+", label: "Research projects administered in REGIS statewide" },
    { value: "150+", label: "Studies migrated", href: "#pillar-migration" },
    { value: "Since 2022", label: "NSW Health/vendor relationship", href: "#pillar-vendor" },
    { value: "TechAG", label: "National technical advisory group", href: "#journey-regis-rollout" }
  ],

  journey: [
    {
      period: "Nov 2022 — Present",
      role: "ICT Program Officer",
      org: "Department of Health, Tasmanian Government",
      layer: "insight",
      current: true,
      id: "journey-regis-rollout",
      summary: "Administer REGIS for the Department of Health, Tasmania (TAS Health): its structure, its vendor relationship, and the statewide adoption program built on top of it. <a href=\"#platform\">Full REGIS case study below&nbsp;↓</a>",
      details: [
        "Designed and delivered a staged statewide rollout of both the Research Governance and Research Ethics modules across 146 departments and supporting departments in the South, North, North West, and Statewide Services regions, piloting first with the largest departments in the South and North to test the platform and validate user acceptance before full rollout. REGIS is now the sole system for research ethics and governance submissions across TAS Health, replacing the prior paper-based process entirely",
        "TAS Health's primary technical liaison with NSW Health and the platform vendor since 2022: replicating and testing issues myself in the REGIS sandpit environment, translating them into precise specifications, and providing stakeholders with a solution or workaround while driving the fix through to resolution. Issues are frequent and varied, from permissions and access faults to process-level problems, on a live, statewide, mandatory production system",
        "Piloted new REGIS features including Teletrial functionality, and designed the milestone-based workaround Researchers and Health Research Officers still rely on for TAS annual and progress reports, since REGIS can only route these to the Human Research Ethics Committee (HREC), including a decision tree and cheat sheets used statewide",
        "Designed and delivered the migration process that's grown paper-based projects from 2 pilot studies to 150+ and counting, authoring the published migration guides and providing direct, one-on-one support to researchers and departments throughout. Personally identified a structural risk in the original process: migration access defaulted to whichever individual first registered a project, who for multi-site or national studies could sit in NSW Health, ACT Health, or another jurisdiction entirely and could leave or become unreachable. Negotiated a fix with NSW Health so access now defaults to research coordinators instead",
        "Represents TAS Health on the Technical Advisory Group (TechAG) for the <a href=\"https://www.australianclinicaltrials.gov.au/national-reforms/national-one-stop-shop-health-and-medical-research\" target=\"_blank\" rel=\"noopener\">National One Stop Shop (NOSS) Program</a>, supporting TAS Health's transition to the NOSS platform",
        "Authored REGIS's entire TAS-specific resource library from scratch (FAQs, training resources, migration guide, and annual report instructions), all live and public on the Department of Health website",
        "Designs and maintains the intranet and <a href=\"https://www.health.tas.gov.au/professionals/health-research-office\" target=\"_blank\" rel=\"noopener\">public internet pages</a> for the Health Research Office (HRO), updating both regularly as stakeholder needs change, with editor and publisher access on the intranet",
        "Separately administers Vision6 for the unit's monthly newsletter, mapping stakeholders into categories for targeted sending",
        "Champion for the department's shift to Microsoft Teams channels for internal communication, and runs ongoing training sessions and one-on-one consultations for every REGIS stakeholder: Site and Coordinating Principal Investigators, Researchers, Heads of Department, Chief Executives, Ethics Reviewers and Committee Members, and Health Research Officers, spanning not just TAS Health's internal departments but external research institutions, including the University of Tasmania",
        "Built a Power Automate flow reconciling application-tracking spreadsheets into a single, always-current SharePoint list, alongside a Power Apps tool for logging and surfacing email communications against each application (since retired)",
        "Directed the build of R-based analysis and VBA/Power Automate/JavaScript workflows, while designing Power BI executive dashboards hands-on for senior medical leadership; recently also picked up data analysis and reporting duties for the wider team"
      ]
    },
    {
      period: "Dec 2021 — Nov 2022",
      role: "Telehealth Coordinator",
      org: "Department of Health, Tasmanian Government",
      layer: "systems",
      summary: "Managed a statewide remote-care platform during the pandemic scale-up, keeping services running and improving the workflows around it.",
      details: [
        "Managed Telstra's MyCare Manager platform for remote patient and clinician support statewide, and worked with ICT teams to enhance it, including integrating patient reports into the department's clinical patient portal",
        "Supported statewide delivery of the COVID@HomePlus (now Care@Home) remote monitoring program, providing day-to-day technical support and troubleshooting for clinicians, patients and admin staff",
        "Developed Standard Operating Procedures (SOPs) and delivered staff training on remote patient monitoring, letting the service scale fast without losing safety or consistency",
        "Drove service improvements through process mapping, data validation and end-user feedback analysis",
        "Handled sustained, high-volume technical support during peak pandemic periods, across a statewide platform",
        "Supported the early operations that grew into what's now <a href=\"https://www.health.tas.gov.au/news/news/carehome-expands-deliver-more-care-options\" target=\"_blank\" rel=\"noopener\">Care@Home</a>, a 24/7 statewide virtual care service that has since supported 50,000+ Tasmanians"
      ]
    },
    {
      period: "Aug 2020 — Mar 2021",
      role: "Website Designer & Virtual Tour Creator",
      org: "National Trust of Tasmania",
      layer: "automation",
      summary: "Designed a public website and shot 360° VR heritage tours for a statewide heritage campaign.",
      details: [
        "Designed the website and produced 360° VR tours for the \"This Place Matters\" campaign using Matterport",
        "Wrote the narrative and interpretive storytelling presented across each heritage site, not just the technical build",
        "Led performance optimisation and cross-device testing for a smooth public-facing experience"
      ]
    },
    {
      period: "Aug 2020 — Mar 2021",
      role: "Director",
      org: "123D Studio Pty Ltd",
      layer: "automation",
      concurrent: true,
      summary: "Co-founding director alongside two other directors, working concurrently as a website designer using WordPress and Squarespace.",
      details: []
    },
    {
      period: "Apr 2017 — Nov 2019",
      role: "Customer Service Representative",
      org: "BP Box Hill South, Victoria",
      layer: "requirements",
      summary: "100+ customer interactions a day. Where the instinct for reading people under pressure started.",
      details: [
        "Managed POS systems and daily site operations",
        "Resolved technical and service issues on the spot while holding customer satisfaction high"
      ]
    }
  ],

  platform: {
    eyebrow: "Flagship · REGIS, administered locally",
    title: "REGIS: administered locally for TAS Health",
    intro: "I administer everything about how REGIS works for TAS Health: the structure it runs on, the vendor relationship that keeps it reliable, the resources that teach stakeholders to use it, and the program that moved a state's research off paper.",
    pillars: [
      {
        id: "structure",
        label: "Stakeholder mapping",
        color: "var(--layer-coral)",
        tint: "var(--tint-coral)",
        title: "Built the stakeholder structure REGIS runs on",
        body: "TAS Health's stakeholders, 146 departments across four regions (South, North, North West, and Statewide Services), are mapped directly into REGIS, built from a blank slate. I designed and delivered this as a staged rollout, piloting first with the largest departments in the South and North to test the platform and validate user acceptance before extending statewide. It's what determines which project centre and site a researcher can even select when registering a study, and it's kept current every time a department changes."
      },
      {
        id: "vendor",
        label: "Vendor relationship",
        color: "var(--layer-violet)",
        tint: "var(--tint-violet)",
        title: "Drives platform issues through to a verified fix",
        body: "I'm TAS Health's primary technical liaison with NSW Health and the platform vendor since 2022: replicating and testing issues myself in the REGIS sandpit environment, translating them into precise specifications, and providing stakeholders with a solution or workaround while driving the fix through to resolution. Issues are frequent and varied, from permissions and access faults to process-level problems, on a live, statewide, mandatory production system."
      },
      {
        id: "resources",
        label: "Stakeholder support",
        color: "var(--layer-gold)",
        tint: "var(--tint-gold)",
        title: "Trains and supports every stakeholder",
        body: "Every stakeholder gets support built for them: Site and Coordinating Principal Investigators, Researchers, Heads of Department, Chief Executives, Ethics Reviewers and Committee Members, and the Health Research Officers working alongside them, spanning TAS Health's internal departments and external research institutions, including the University of Tasmania. Training sessions run in person, one-on-one consultations resolve real submission problems, and a written resource library covering FAQs, training and migration, all authored from scratch and published live on the Department of Health site. Also designs and maintains HRO's intranet and public pages directly, with editor and publisher access on the intranet, updating both regularly as stakeholder needs change.",
        links: [
          { label: "TAS-Specific FAQs", url: "https://www.health.tas.gov.au/publications/regis-tas-specific-faqs" },
          { label: "Training Resources", url: "https://www.health.tas.gov.au/publications/regis-training-resources" },
          { label: "Project Migration Guide", url: "https://www.health.tas.gov.au/publications/regis-project-migration-guide" },
          { label: "Annual Report Instructions", url: "https://www.health.tas.gov.au/publications/regis-tas-annual-site-progress-and-final-report-submission-instructions" }
        ]
      },
      {
        id: "migration",
        label: "Migration program",
        color: "var(--layer-teal)",
        tint: "var(--tint-teal)",
        title: "Designed the migration program",
        body: "Moving TAS Health's research portfolio off paper started with 2 pilot studies. I designed the migration process, authored the published migration guides, and supported researchers directly through it, region by region, department by department, growing to 150+ and counting projects migrated onto REGIS.",
        riskBreakdown: {
          situation: "Migration access defaulted to whichever individual first registered a project.",
          risk: "For multi-site studies, that person could be based in another jurisdiction and become unreachable.",
          action: "Identified the risk and negotiated a fix with NSW Health.",
          outcome: "Access now defaults to research coordinators instead."
        },
        stat: { from: "2", to: "150+", label: "pilot studies → projects migrated off paper" }
      }
    ]
  },

  decisionFramework: {
    eyebrow: "Process design",
    title: "Designing for the ambiguous cases",
    intro: "Genericised from a real decision-support tool built for an ambiguous, multi-record workflow, illustrated here with an everyday example, a retail chain reviewing compliance reports across linked store locations, so the same four-scenario branching logic (including side-effects that ripple across linked records) is easy to follow at a glance. The original stays internal; this is the shape of the thinking, not the document itself."
  },

  assistantFeature: {
    eyebrow: "Featured build · self-service support system",
    title: "Self-Service Knowledge Assistant",
    intro: "A support system I designed end-to-end (structured content architecture, a hand-tuned fuzzy-matching search engine with no external libraries, and an onboarding flow), then directed AI to build. Live inside TAS Health as the TAS REGIS Assistant, but the pattern (content design plus custom search) applies to any internal knowledge base. Ask it something worded slightly wrong and it still finds the right answer.",
    stats: [
      { value: "5", label: "Match tiers: exact, token, prefix, substring, and fuzzy scoring" },
      { value: "696", label: "Keyword variants hand-mapped across the knowledge base for match coverage" }
    ],
    body: "The matching logic falls through five tiers: exact match, token, prefix, substring, and finally a hand-tuned Levenshtein edit-distance scorer for anything still unmatched. Every question in the library renders as a structured card (Summary, Steps, Exceptions, Resources) mapped across 10 lifecycle phases into a full taxonomy, with a searchable glossary covering the acronyms. The whole thing runs fully client-side, with zero external matching libraries or backend, as a mobile-first, draggable widget.",
    demoNote: "A working preview of the fuzzy-matching logic behind the real tool, running here on a small original dataset about this site. Typos and rephrasing are handled. Try it."
  },

  assistantDemo: {
    chips: ["What does Bilal do?", "What has he built?", "Does he know Power BI?", "What certifications does he have?", "Is he open to relocating?", "What is this chat box?"],
    qa: [
      { q: "What does Bilal do?", cat: "Role & Responsibilities", a: "Bilal takes digital systems from pilot to full-scale adoption, currently as ICT Program Officer at the Tasmanian Department of Health, with REGIS as his primary proof. He wears a lot of hats delivering that, genuinely cross-functional, not just a platform administrator:", list: [
          "<b>Project Manager:</b> manages full implementation of REGIS for TAS Health, from statewide rollout through the ongoing migration program",
          "<b>Business/Systems Analyst:</b> translates stakeholder needs into system requirements across REGIS and the other platforms he works on",
          "<b>Stakeholder Mapping Lead:</b> maps TAS Health's regions, departments, sites and Heads of Department into the org structures his systems run on",
          "<b>Platform Administrator:</b> administers REGIS, Vision6 and other systems for TAS Health, covering structure, configuration, and vendor relationship",
          "<b>Data &amp; Reporting Analyst:</b> Power BI dashboards hands-on, plus data and reporting duties for the wider team",
          "<b>Trainer &amp; Change Manager:</b> runs training sessions and one-on-one consultations, authors the resource library, leads adoption of new tools and processes",
          "<b>Single Point of Contact:</b> TAS Health's primary contact, diagnosing platform issues precisely enough for NSW Health and the vendor to resolve",
          "<b>Automation Developer:</b> R, VBA, Power Automate, JavaScript. Specifies requirements, directs the AI-assisted build",
          "<b>Process Designer:</b> designs migration processes, decision trees and workaround logic stakeholders rely on daily"
        ], k: ["what does bilal do", "his role", "job title", "what do you do", "current role", "what is his job", "occupation", "project manager", "responsibilities", "roles", "hats"], follow: ["Has he worked nationally?", "What is REGIS?", "What has he built?"] },
      { q: "Has he worked nationally?", cat: "Role & Responsibilities", a: "Yes, he represents TAS Health on the Technical Advisory Group (TechAG) for the National One Stop Shop (NOSS) Program, supporting TAS Health's transition to the NOSS platform.", k: ["national", "noss", "one stop shop", "technical advisory group", "techag", "national work"], follow: ["What does Bilal do?", "What is REGIS?"] },
      { q: "What is REGIS?", cat: "Background & Logistics", a: "The Research Ethics and Governance Information System (REGIS) is the online portal for submitting, approving, monitoring and managing human research projects, used by investigators, sponsors, site administrators, Human Research Ethics Committees and Research Governance Offices. Every health and medical research project using Tasmania's publicly funded health system must go through it. Bilal administers REGIS for TAS Health: the org structure, the vendor relationship, and the resources that teach stakeholders to use it.", k: ["what is regis", "regis meaning", "explain regis", "regis platform", "define regis"], follow: ["What does Bilal do?", "Has he worked nationally?"] },
      { q: "Is he open to relocating?", cat: "Background & Logistics", a: "Yes. Bilal is based in Hobart, Tasmania, and open to relocating to Victoria for the right opportunity. He is an Australian Permanent Resident, so there are no work-rights restrictions.", k: ["relocate", "relocating", "victoria", "move", "location", "willing to move", "where does he live"], follow: ["How do I contact him?", "What does Bilal do?"] },
      { q: "How do I contact him?", cat: "Background & Logistics", a: "Email bmoham20@gmail.com or connect on LinkedIn; both are linked in the Contact section below.", k: ["contact", "email", "reach him", "linkedin", "get in touch", "how to contact"], follow: ["Is he open to relocating?", "What does Bilal do?"] },
      { q: "What is this chat box?", cat: "Background & Logistics", a: "A small working demo of the same fuzzy-matching search engine Bilal built for his self-service support assistant, same Levenshtein-based logic, a different and much smaller dataset. Ask it something about his career.", k: ["what is this", "this widget", "this chat", "how does this work", "demo", "this box"], follow: ["What has he built?", "Does he use AI tools?"] },
      { q: "Is he a generalist or a specialist?", cat: "Background & Logistics", a: "Neither, exactly: he has one clear specialty, taking government systems from pilot to statewide adoption, proven through REGIS. Getting there draws on a genuinely broad skill set (stakeholder engagement, Power BI, data and automation), but the throughline is delivery, not breadth for its own sake.", k: ["generalist", "specialist", "range", "breadth", "jack of all trades", "narrow"], follow: ["What does Bilal do?", "What's his education?"] },
      { q: "What has he built?", cat: "Skills & Tools", a: "A self-built REGIS support assistant with a hand-written fuzzy-search engine, standalone data-consolidation tools, a Word-form data extractor built twice (in R and in VBA), and Power BI dashboards for senior leadership.", k: ["what has he built", "projects", "tools", "portfolio", "what did he make", "builds", "his work"], follow: ["Does he use AI tools?", "What is this chat box?"] },
      { q: "Does he know Power BI?", cat: "Skills & Tools", a: "Yes, Power BI report and dashboard design is hands-on for Bilal, distinct from the AI-assisted automation work described elsewhere on this site. He's built multi-page executive dashboards for senior medical leadership, including statewide summary views and a live, filterable study register.", k: ["power bi", "does he know power bi", "dashboards", "bi skills", "powerbi"], follow: ["Does he know R?", "Does he know Power Automate or VBA?"] },
      { q: "Does he use AI tools?", cat: "Skills & Tools", a: "Yes. Bilal uses tools like Claude, ChatGPT and Cursor for AI-assisted development of R, VBA, JavaScript and automation work, while Power BI design stays hands-on. He specifies the requirements, logic and edge cases and validates the result. AI speeds up the build; it doesn't replace the thinking behind it.", k: ["ai tools", "claude", "chatgpt", "ai directed", "ai assisted", "uses ai", "ai development", "cursor"], follow: ["Does he know R?", "Does he know Power Automate or VBA?"] },
      { q: "Does he know R?", cat: "Skills & Tools", a: "Yes, R and automation work follows the same AI-assisted build pattern used across most tools on this site: Bilal specifies requirements precisely and directs the implementation.", k: ["r programming", "does he know r", "r language", "r skills", "shiny"], follow: ["Does he know Power BI?", "Does he use AI tools?"] },
      { q: "Does he know Power Automate, Power Apps or VBA?", cat: "Skills & Tools", a: "Yes. All three follow the same AI-assisted build pattern. He built a Power Automate flow that reconciles three separate Excel tracking tables into one always-current SharePoint list, a companion Power Apps tool for logging email communications against each application (since retired), and a VBA-based tool (also built in R) that extracts structured data from completed Word forms.", k: ["power automate", "power apps", "powerapps", "vba", "does he know vba", "does he know power automate", "does he know power apps", "flow", "macros", "automation tools", "sharepoint"], follow: ["Does he know R?", "Does he use AI tools?"] },
      { q: "What's his education?", cat: "Education & Certifications", a: "Master of Information Technology from Charles Sturt University (2019), a Bachelor of Computer Science Engineering, and several professional certifications.", k: ["education", "degree", "qualifications", "university", "study", "masters"], follow: ["What certifications does he have?", "Is he a generalist or a specialist?"] },
      { q: "What certifications does he have?", cat: "Education & Certifications", a: "Bilal is a Computer Science Engineer with a Master of Information Technology; beyond the degrees, he holds a Certified Project Officer (CPO) certification, an ITIL 4 Foundation Certificate, and completed the ACS Professional Year program, plus a Project Management Short Course and an Advanced Diploma in Leadership & Management.", k: ["certifications", "certified", "what certifications", "certs", "cpo", "itil", "professional year", "acs professional year", "qualifications", "project management course"], follow: ["What's his education?", "Is he a generalist or a specialist?"] }
    ]
  },

  projects: [
    {
      id: "consolidator",
      title: "Health Research Activity Dashboard: Data Consolidator",
      tag: "Flagship build",
      layer: "automation",
      stack: ["R / Shiny", "JavaScript", "SheetJS", "Power BI"],
      liveLinks: [
        { label: "Live performance dashboard (Power BI)", url: "https://app.powerbi.com/view?r=eyJrIjoiMmE1MzM4MjctYzg1Ni00OGMzLWI2OWUtOTg4MjViY2YwNzVmIiwidCI6IjEyNmZkODkzLTJmMWYtNGI1MC1iZWZmLTJmMTQ2Y2JiNzc0MCIsImMiOjEwfQ%3D%3D" },
        { label: "Featured on the Health Research Office page", url: "https://www.health.tas.gov.au/professionals/health-research-office" }
      ],
      summary: "A tool that reconciles multiple REGIS report exports against a master reference dataset into one clean, Power BI–ready file, turning a manual, error-prone reconciliation job into a five-minute upload.",
      problem: "A recurring, error-prone manual reconciliation job: multiple REGIS report exports needed to be checked against a manually-maintained master reference dataset (weekly, monthly, quarterly, and as needed), with site, LHD and district/region mappings that broke silently whenever a source export changed shape.",
      build: "Originally built as an R/Shiny app (with a hardcoded site-to-LHD lookup table covering every TAS Health site and department), and rebuilt as a standalone offline HTML tool that runs the entire pipeline client-side via SheetJS: no server, no install, works entirely offline. Also resolves Site through LHD through District down to Region, merges in a second REGIS governance download, and pre-computes a full Region × Sponsor Type × Study Type × Status cross-tab that sidesteps a specific Power BI limitation where zero-count combinations disappear from a matrix by default. Every join and edge case was validated end-to-end against real data before being signed off.",
      impact: "One consolidated, Power BI–ready export (now a five-minute upload) replaces what used to be a manual cross-referencing exercise repeated weekly, monthly, quarterly, and as needed, with every transformation handled upstream in the tool itself. The resulting dashboard is published live on the Department of Health's own HRO page: not just a personal build, but something the department has adopted and put its name behind."
    },
    {
      id: "annual-report",
      title: "Annual Report Reconciliation Tool",
      tag: "Offline HTML app",
      layer: "insight",
      stack: ["JavaScript", "SheetJS", "PDF.js", "Excel & Word export"],
      summary: "Cross-checks tracking sheets against REGIS overdue-progress-report data and exports the reconciled result straight into Excel and Word.",
      problem: "Ahead of each annual and final report cycle, confirming which progress reports were actually overdue meant manually comparing a tracking sheet against a REGIS export, project by project, whatever format that export happened to be in.",
      build: "Runs entirely offline in the browser: accepts the REGIS overdue export as a spreadsheet or a raw PDF, reconstructing the table from the PDF's text positions when needed. Automatically sorts every discrepancy into four categories (reports marked received on the tracking sheet but missing from REGIS, projects on REGIS but absent from the tracking sheet entirely, genuine overdue reports flagged by both sources, and recently migrated projects still carrying their pre-migration paper status), and exports the result as a 4-sheet Excel workbook or a formatted Word report.",
      impact: "Turns a manual, format-inconsistent cross-check into a one-click offline tool used by HRO staff each annual and final report cycle, handling whichever export format shows up, sorting every discrepancy into the right category automatically, and handing back a ready-to-use Excel workbook or Word report."
    },
    {
      id: "weekly-report",
      title: "Weekly Report Generator",
      tag: "Offline HTML app",
      layer: "insight",
      stack: ["JavaScript", "SheetJS", "Excel & Word export"],
      summary: "Processes multiple REGIS report exports across five reporting sections into a consistent weekly report.",
      problem: "Every week, checking which authorised projects were missing required details (ethics pathway, study type, clinical trial phase, Head of Department sign-off) meant manually cross-referencing two separate REGIS exports by reference number, project by project.",
      build: "Combines multiple REGIS exports into one dataset and matches approval dates across files by reference number, filtered to one of ten date-range presets: last 7/14/30/60/90 days, this/last month, this year, year-to-date, or custom. Automatically sorts every authorised project into five checks (missing ethics pathway, missing study type, missing clinical trial phase, missing Head of Department sign-off, and investigator-initiated trials needing a sponsor listed), and exports the result as a 5-sheet Excel workbook or a formatted Word report. Originally an interactive R console script, rebuilt as a client-side offline HTML app sharing the same visual system as the office's other tools.",
      impact: "Turns a manual weekly cross-reference into a one-click check used by HRO staff, catching missing ethics pathways, study types, trial phases and sign-offs before they become a problem, with a ready-to-use Excel workbook or Word report every time."
    },
    {
      id: "power-bi",
      title: "REGIS Executive Dashboards",
      tag: "Power BI · multi-page report",
      layer: "systems",
      stack: ["Power BI", "DAX", "R", "SQL"],
      summary: "Multi-page Power BI reporting for REGIS (from statewide summary views down to a live, filterable study register), built hands-on for both senior leadership and the team's own internal reporting.",
      problem: "Senior stakeholders and the team needed a trustworthy, current view of statewide research activity and KPI performance, built from cleaned, analysis-ready data that meets internal, national, and executive reporting requirements, without waiting on manual reporting cycles or second-guessing what a number on the page actually meant.",
      build: "Cleans and analyses the underlying REGIS export data from scratch, and designs a multi-page Power BI report serving three distinct audiences (internal staff reporting, national reporting, and executive reporting) from that single prepared dataset. The report includes a statewide summary page down into a KPI page tracking authorisation turnaround against named service-level targets, broken down by process stage, into monthly detail, down to a fully filterable study-level register. Documented the calculation logic directly in the report itself (including how edge cases like a zero result versus a genuinely empty month are meant to be read), so the numbers don't need to be taken on faith. Upstream data logic directed in R, keeping manual processing out of the pipeline before a number ever reaches the page.",
      impact: "Leadership and the team get the same self-service, drill-down view of statewide research governance performance instead of a static monthly export, and a report they can trust, because the logic behind every number is documented, not hidden."
    },
    {
      id: "form-extractor",
      title: "TAS Form Extractor",
      tag: "R + VBA · built twice",
      layer: "automation",
      stack: ["R (docxtractr)", "VBA", "Regex", "Excel formatting"],
      summary: "Pulls structured answers out of completed Word-based TAS forms (including which checkbox was actually ticked) straight into a formatted Excel sheet.",
      problem: "Completed progress-report forms come back as filled-in Word documents: checkbox lists, inconsistent 2- or 3-column table layouts, and instructional boilerplate mixed in with the real answers. None of it was structured data.",
      build: "Built the extraction logic twice, for two different audiences: an R version (via docxtractr) that detects which checkbox was actually checked amid the form's checkbox lists, and a VBA macro so colleagues without R installed could run the same extraction natively from Word and Excel. Both parse every completed form's table structure, pull out question-answer pairs, and filter out section headers and instructional boilerplate via pattern matching.",
      impact: "A stack of filled-in Word forms becomes one clean spreadsheet (one row per form, one column per question) without anyone touching a form by hand."
    },
    {
      id: "research-combiner",
      title: "Research Data Combiner",
      tag: "Shiny app",
      layer: "automation",
      stack: ["R", "Shiny", "dplyr", "DT"],
      summary: "Merges researcher and PI contact lists into one deduplicated, export-ready table.",
      problem: "Contact lists arrived from different sources with inconsistent column naming (email, Email Address, PI Email, pi.email) and needed deduplicating before they were usable for anything.",
      build: "A two-tab Shiny app, Researcher Contacts and PI (Principal Investigator) Data, that reads any mix of CSV or Excel files, normalises column names automatically, checks a list of likely email-column spellings to find the right one, and deduplicates against it.",
      impact: "Multiple messy contact exports become one clean list in a few clicks, instead of a manual merge-and-check exercise."
    },
    {
      id: "sharepoint-sync",
      title: "Application Status Sync: Power Automate",
      tag: "Power Automate",
      layer: "automation",
      stack: ["Power Automate", "SharePoint", "Excel Online"],
      summary: "A monthly flow that reconciles three separate Excel tracking tables into one always-current SharePoint list, upserting each record by Application ID.",
      problem: "Three separate Excel tables tracked applications at different stages (eligible for review, authorised, and post-authorised), each needing to be reflected accurately in a shared SharePoint list without manual copy-paste or duplicate entries creeping in.",
      build: "A Power Automate flow that runs monthly and works through each of the three tables in turn: for every row with an Application ID, it searches SharePoint for a matching item, updates it if found, or creates a new one tagged with the correct stage (Pre Authorised, Authorised Projects & Amendments, or Post Authorised) if not. Built to handle up to 5,000 rows per table per run. A small companion flow, a single button trigger that loops through and clears every item in a test SharePoint list, supports resetting a clean environment while developing and testing the main sync.",
      impact: "Removes manual data entry and the errors that come with it; SharePoint stays a reliable, current single source of truth stitched together from three separate spreadsheets."
    },
    {
      id: "email-log",
      title: "Application Email Log: Power Apps",
      tag: "Power Apps · retired",
      layer: "automation",
      stack: ["Power Apps", "SharePoint", "Power Query", "Excel"],
      summary: "A Power Apps tool for logging every email exchanged about a research application and pulling up its full communication history in one view. Since retired.",
      problem: "Email communication about a research application was scattered across inboxes with no shared record; there was no single place to see every email ever sent about a given application, so building that picture meant searching manually through past correspondence.",
      build: "Built a Power Apps interface backed by a SharePoint list (\"EmailLog\") that captured each entry's Application ID, email text, and date logged, with the underlying application data consolidated in Excel using Power Query so Power Apps had one clean source to read from. Selecting an application in the app surfaced every email ever logged against it, most recent first.",
      impact: "Gave a single, always-current view of an application's full email history in place of manual searching through past correspondence. The tool has since been retired."
    }
  ],

  competencies: [
    {
      id: "delivery",
      title: "Digital Transformation & Delivery",
      color: "var(--layer-coral)",
      items: ["End-to-end system implementation", "Requirements gathering & translation", "Stakeholder mapping", "Stakeholder engagement", "Change management", "Vendor liaison"]
    },
    {
      id: "data",
      title: "Data, Reporting & Automation",
      color: "var(--layer-gold)",
      items: ["Power BI report & dashboard design", "AI-assisted development (R, SQL, JavaScript, automation)", "VBA / Power Automate / Power Apps workflows", "Process mapping (Mermaid)", "Custom tooling & search/matching engines"]
    },
    {
      id: "enablement",
      title: "User Enablement",
      color: "var(--layer-teal)",
      items: ["Training design & delivery", "Documentation", "Technical support", "Platform configuration", "User research & feedback loops"]
    }
  ],

  toolkit: [
    { label: "Platforms Administered", items: ["REGIS", "REDCap", "SiteDocs Portal", "Vision6", "MyCare Manager", "Adobe Acrobat Pro for enterprise"] },
    { label: "Data & Automation", items: ["Power BI", "R", "SQL", "VBA", "Power Automate", "Power Apps", "JavaScript", "Mermaid", "MySQL", "Claude Code", "ChatGPT", "Cursor", "VS Code"] },
    { label: "Design & Web", items: ["WordPress", "Squarespace", "Matterport", "Canva"] }
  ],

  education: [
    { qual: "Master of Information Technology", org: "Charles Sturt University", year: "2019" },
    { qual: "Bachelor of Computer Science Engineering", org: "Osmania University", year: "2016" },
    { qual: "Advanced Diploma in Leadership & Management", org: "Clinton Institute", year: "2020" },
    { qual: "Project Management Short Course", org: "University of Tasmania", year: "2024" },
    { qual: "Certified Project Officer (CPO)", org: "Centre for Project Innovation", year: "" },
    { qual: "ITIL 4 Foundation Certificate", org: "IT Service Management", year: "" },
    { qual: "ACS Professional Year (IT)", org: "Indus Institute", year: "2020" }
  ]

};
