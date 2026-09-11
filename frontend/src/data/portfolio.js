export const PROFILE_IMG = "/profile.jpg";

export const RESUME_URL = "/resume.pdf";

export const GREETINGS = ["Npm | I am", "hola | I am"];

export const CHIPS = [
  "Fresh Graduate",
  "Full-Stack Dev",
  "Laravel Engineer",
  "AI / ML",
  "Mobile Dev",
  "Cybersecurity",
  "Networking",
];

export const MARQUEE_ITEMS = [
  "Laravel",
  "React & Vite",
  "Firebase",
  "Node.js / Express",
  "Capacitor",
  "Cisco CCNA",
  "AI & Machine Learning",
  "PHP & MySQL",
  "Tailwind CSS",
  "Code. Ship. Rep.",
];

export const STATS = [
  { value: 3, suffix: "", label: "Shipped Projects" },
  { value: 2, suffix: "+", label: "Cisco Certs", gold: true },
  { value: 6, suffix: "+", label: "Tech Stacks" },
  { value: 2, suffix: "", label: "Languages Spoken", gold: true },
];

export const SKILL_BARS = [
  { name: "Laravel / PHP", pct: 90 },
  { name: "React / Node.js", pct: 86 },
  { name: "Firebase & Deployment", pct: 83, gold: true },
  { name: "Cisco Networking", pct: 88 },
  { name: "AI / ML (PyTorch)", pct: 76, gold: true },
];

export const TAG_GROUPS = [
  {
    title: "Web & Vibe Coding",
    color: "cyan",
    tags: ["HTML / CSS", "JavaScript", "React", "Tailwind CSS", "TypeScript", "REST APIs"],
  },
  {
    title: "Laravel & Backend",
    color: "red",
    tags: ["Laravel", "PHP", "MySQL", "Eloquent ORM", "Livewire", "Filament"],
  },
  {
    title: "AI & Machine Learning",
    color: "purple",
    tags: ["Python", "PyTorch", "HuggingFace", "scikit-learn", "LLM Fine-tuning", "LangChain"],
  },
  {
    title: "Mobile Development",
    color: "gold",
    tags: ["Flutter", "Dart", "React Native", "Capacitor", "Firebase"],
  },
  {
    title: "Networking & Security",
    color: "green",
    tags: ["Cisco IOS", "VLANs / STP", "OSPF", "Cybersecurity", "Wireshark"],
  },
];

export const DISCIPLINES = [
  {
    icon: "wand",
    title: "Vibe Coding",
    desc: "AI-assisted rapid prototyping. I use Cursor, Claude, and modern LLM tools to go from idea to working product faster than ever.",
    techs: ["Cursor", "Claude AI", "GitHub Copilot"],
  },
  {
    icon: "layers",
    title: "Full-Stack Web & Laravel",
    desc: "Full-stack apps with clean architecture — Laravel REST APIs and Blade dashboards, or React/Vite front ends when the project calls for it.",
    techs: ["Laravel", "React", "Tailwind CSS", "MySQL"],
  },
  {
    icon: "mobile",
    title: "Mobile App Development",
    desc: "Cross-platform apps that feel native — packaging React web apps into Android builds with Capacitor, or building with Flutter when needed.",
    techs: ["Capacitor", "Flutter", "Firebase"],
  },
  {
    icon: "brain",
    title: "AI & Machine Learning",
    desc: "Training, fine-tuning, and deploying ML models — from text classification to LLM fine-tuning and AI-powered app features.",
    techs: ["PyTorch", "HuggingFace", "LangChain"],
  },
  {
    icon: "shield",
    title: "Networking & Security",
    desc: "CCNA-certified. I design Cisco network topologies, configure VLANs and routing, and apply security hardening across infra.",
    techs: ["Cisco IOS", "CCNA", "VLANs", "OSPF"],
  },
  {
    icon: "diagram",
    title: "Systems Integration & Automation",
    desc: "Reading a system end to end — gathering requirements, monitoring performance for bottlenecks, and revising workflows as business needs shift.",
    techs: ["Requirements Analysis", "Workflow Design", "Control Logic"],
  },
];

export const TIMELINE = [
  {
    title: "Bachelor of Information Technology",
    date: "Graduated 2026",
    org: "Bukidnon State University",
    icon: "grad",
    graduate: true,
    points: [
      "Dean's Lister, with a Test of Practical Competency in IT (TOPCIT) Level 2 rating.",
      "Earned the Wadhwani Job Ready Certificate alongside coursework.",
      "Completed two Cisco Networking Academy CCNA credentials during the program.",
    ],
  },
  {
    title: "System Integrator Trainee",
    date: "2026",
    org: "Project Moonshot Information Technology Solutions",
    icon: "building",
    points: [
      "Studied industrial systems integration and automated control logic fundamentals.",
      "Monitored system performance to flag weaknesses, bottlenecks, and inefficiencies.",
      "Gathered and defined user requirements for system updates.",
      "Revised workflow processes to match changing business requirements.",
    ],
  },
  {
    title: "Independent Full-Stack Developer",
    date: "Ongoing",
    org: "Freelance & Personal Projects",
    icon: "branch",
    points: [
      "Built and deployed BuildHub end to end — React/Vite/Capacitor frontend on Firebase Hosting, Express backend on Render.",
      "Built the BuKSU Motorpool fleet-management system for the university's PPMU, including an Android port via Capacitor.",
      "Built BookMe, a Laravel 13 multi-role booking marketplace with a unified Blade/Tailwind dashboard system.",
    ],
  },
];

export const PROJECTS = [
  {
    icon: "helmet",
    title: "BuildHub",
    desc: "A full-stack SaaS marketplace connecting construction & trades clients with contractors — job posting and bidding, a materials marketplace, admin verification, reviews, messaging, and an analytics dashboard.",
    tags: ["React", "Express", "Firebase", "Capacitor"],
    links: [
      { label: "Code", href: "https://github.com/caelum-sky" },
      { label: "Live", href: "https://buildhub-d44e3.web.app/" },
    ],
  },
  {
    icon: "truck",
    title: "BuKSU Motorpool",
    desc: "Fleet-management system for Bukidnon State University's PPMU — vehicle-maintenance tracking, driver accept/decline workflows, a scheduling conflict checker, and real-time notifications, ported to Android with Capacitor.",
    tags: ["React", "Express", "Firebase", "Capacitor"],
    links: [
      { label: "Code", href: "https://github.com/caelum-sky" },
      { label: "API", href: "https://motorpool-gllh.onrender.com/" },
    ],
  },
  {
    icon: "calendar",
    title: "BookMe",
    desc: "Multi-role Laravel booking marketplace for accommodations and dining in the Philippines — customer, business-owner, and super-admin dashboards, an Airbnb-style browse/detail page with a photo-grid lightbox, and native CRUD modals.",
    tags: ["Laravel", "PHP", "MySQL"],
    links: [{ label: "Code", href: "https://github.com/caelum-sky" }],
  },
];

export const ACHIEVEMENTS = [
  {
    icon: "star",
    title: "Dean's Lister",
    desc: "Consistent academic recognition throughout the BSIT program at Bukidnon State University.",
  },
  {
    icon: "chart",
    title: "TOPCIT Level 2",
    desc: "Scored Level 2 on the Test of Practical Competency in IT, a national IT competency assessment.",
  },
  {
    icon: "award",
    title: "Wadhwani Job Ready Certificate",
    desc: "Completed the Wadhwani Foundation employability program for job-ready professionals.",
  },
  {
    icon: "network",
    title: "Cisco CCNA Certified",
    desc: "Two Cisco Networking Academy credentials earned through the CCNAv7 curriculum.",
  },
];

export const CERTIFICATIONS = [
  {
    icon: "network",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    meta: [
      "Completed May 13, 2024",
      "CCNAv7 Curriculum",
      "Network fundamentals, IP addressing, routing basics",
    ],
    badge: "Cisco Certified",
    download:
      "https://github.com/user-attachments/files/22842922/3.pdf",
    downloadName: "CCNA_Intro_to_Networks_John_Dagooc.pdf",
  },
  {
    icon: "server",
    title: "CCNA: Switching, Routing & Wireless Essentials",
    issuer: "Cisco Networking Academy",
    meta: [
      "Completed December 5, 2024",
      "CCNAv7 Curriculum",
      "VLANs, STP, WLAN config, advanced routing",
    ],
    badge: "Cisco Certified",
    download:
      "https://github.com/user-attachments/files/22842921/2.pdf",
    downloadName: "CCNA_Switching_Routing_Wireless_John_Dagooc.pdf",
  },
  {
    icon: "shield",
    title: "CCNA: Enterprise Networking, Security & Automation",
    issuer: "Cisco Networking Academy",
    meta: ["CCNAv7 Curriculum", "Enterprise WAN, ACLs, VPN, network automation"],
    badge: "Certificate on file",
    pending: true,
  },
  {
    icon: "lock",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    meta: ["Foundational Security Course", "Threat landscape, vulnerabilities, security principles"],
    badge: "Certificate on file",
    pending: true,
  },
];

export const SOCIALS = [
  { icon: "github", label: "GitHub", sub: "caelum-sky", href: "https://github.com/caelum-sky" },
  {
    icon: "linkedin",
    label: "LinkedIn",
    sub: "john-symaiah-dagooc",
    href: "https://www.linkedin.com/in/john-symaiah-dagooc-931334337/",
  },
  { icon: "mail", label: "Email", sub: "johndagooc2@gmail.com", href: "mailto:johndagooc2@gmail.com" },
  { icon: "facebook", label: "Facebook", sub: "john.dagooc.7", href: "https://www.facebook.com/john.dagooc.7/" },
];

export const AMA = [
  {
    id: "stack",
    q: "What's your stack?",
    keywords: ["stack", "tech", "technology", "tools", "language"],
    a: "Laravel + PHP for backends, React/Vite + Tailwind for frontends, Node.js/Express + Firebase for realtime systems, Capacitor for Android builds, and Python/PyTorch + HuggingFace when AI enters the picture.",
  },
  {
    id: "projects",
    q: "What have you built?",
    keywords: ["project", "built", "build", "portfolio", "work"],
    a: "Three production systems: BuildHub (construction & trades marketplace), BuKSU Motorpool (university fleet management with an Android port), and BookMe (Laravel multi-role booking marketplace). All shipped, all live.",
  },
  {
    id: "certs",
    q: "Any certifications?",
    keywords: ["cert", "ccna", "credential", "cisco"],
    a: "Two Cisco CCNA credentials (Introduction to Networks, and Switching/Routing/Wireless Essentials), plus TOPCIT Level 2 and the Wadhwani Job Ready Certificate. CCNA ENSA and Intro to Cybersecurity certificates are on file.",
  },
  {
    id: "hire",
    q: "Available for work?",
    keywords: ["hire", "available", "job", "work", "freelance", "open"],
    a: "Yes — fresh BSIT graduate (Class of 2026) and open to full-time roles, freelance builds, and collaborations. Fastest way to reach me: johndagooc2@gmail.com.",
  },
  {
    id: "contact",
    q: "How do I reach you?",
    keywords: ["contact", "reach", "email", "message", "connect"],
    a: "Email me at johndagooc2@gmail.com, find me on GitHub (caelum-sky) or LinkedIn (john-symaiah-dagooc), or use the contact form at the bottom of this page.",
  },
  {
    id: "grad",
    q: "Did you graduate?",
    keywords: ["graduat", "degree", "school", "university", "college", "bsit"],
    a: "Yes! BSIT graduate, Bukidnon State University — Class of 2026. Dean's Lister, with two CCNA credentials earned along the way.",
  },
];

export const AMA_FALLBACK =
  "Good question — that one's outside my pre-loaded answers. Ask John directly at johndagooc2@gmail.com, or try one of the quick questions below.";
