/**
 * Central content for Mahadev APF.
 * Edit values here to re-brand the whole site without touching components.
 */

export const company = {
  name: "Mahadev APF",
  legalName: "Mahadev APF Industries",
  tagline: "Engineering the Infrastructure of Tomorrow",
  intro:
    "A premium industrial manufacturing house delivering precision-engineered systems for infrastructure, construction and energy across the globe.",
  email: "sales@mahadevapf.com",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  address: "Industrial Estate, Phase IV, Ahmedabad, Gujarat, India",
};

export const nav = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 1200, suffix: "+", label: "Projects Delivered" },
  { value: 480, suffix: "+", label: "Clients Served" },
  { value: 27, suffix: "", label: "Years of Experience" },
  { value: 32, suffix: "", label: "Countries Served" },
];

export type Product = {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  blurb: string;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  gallery: string[];
  downloads: { label: string; size: string }[];
  leadTime: string;
};

export const products: Product[] = [
  {
    slug: "structural-steel-systems",
    title: "Structural Steel Systems",
    category: "Heavy Fabrication",
    subcategory: "Structural",
    blurb:
      "Pre-engineered structural assemblies machined to micron tolerances for high-load infrastructure.",
    description:
      "Our structural steel systems are engineered for the most demanding load cases in modern infrastructure. Each assembly is modelled in BIM, fabricated on robotic welding cells and verified through ultrasonic and dimensional inspection before despatch. Hot-dip galvanising and duplex coatings deliver multi-decade corrosion protection.",
    specs: [
      { label: "Material grade", value: "S355 / IS 2062 E350" },
      { label: "Max span", value: "Up to 120 m" },
      { label: "Finish", value: "Hot-dip galvanised" },
      { label: "Tolerance", value: "±0.02 mm" },
      { label: "Certification", value: "EN 1090 EXC4" },
    ],
    features: [
      "BIM-modelled connections",
      "Robotic MIG/MAG welding",
      "Ultrasonic weld inspection",
      "Duplex corrosion protection",
    ],
    gallery: ["Assembly", "Detail", "Finish", "On-site"],
    downloads: [
      { label: "Technical datasheet (PDF)", size: "2.4 MB" },
      { label: "Product brochure (PDF)", size: "5.1 MB" },
    ],
    leadTime: "6–10 weeks",
  },
  {
    slug: "precision-aluminium-profiles",
    title: "Precision Aluminium Profiles",
    category: "Extrusion",
    subcategory: "Architectural",
    blurb:
      "Architectural-grade extruded profiles with anodised and powder-coated luxury finishes.",
    description:
      "Custom aluminium extrusions for façades, fenestration and industrial framing. We design and cut bespoke dies in-house, then extrude on calibrated presses with tight dimensional control. A full anodising and powder-coat line delivers architectural finishes in any RAL with class-leading consistency.",
    specs: [
      { label: "Alloy", value: "6063-T6 / 6061-T6" },
      { label: "Die", value: "Custom in-house tooling" },
      { label: "Anodising", value: "Up to 25 micron" },
      { label: "Coating", value: "Powder coat, any RAL" },
      { label: "Length", value: "Up to 7.5 m" },
    ],
    features: [
      "Bespoke die design",
      "Calibrated extrusion presses",
      "20–25 micron anodising",
      "Architectural powder coating",
    ],
    gallery: ["Profile", "Cross-section", "Finish", "Application"],
    downloads: [
      { label: "Profile catalogue (PDF)", size: "8.7 MB" },
      { label: "Finish guide (PDF)", size: "1.9 MB" },
    ],
    leadTime: "4–7 weeks",
  },
  {
    slug: "modular-cleanroom-panels",
    title: "Modular Cleanroom Panels",
    category: "Built Environment",
    subcategory: "Cleanroom",
    blurb:
      "Hermetically sealed panel systems engineered for pharma and semiconductor facilities.",
    description:
      "Turnkey modular panel systems for controlled environments. Flush, gasketed joints and antibacterial skins create hermetic, particle-controlled spaces validated to ISO 14644. Integrated services routing, coving and door systems make installation fast and contamination-free.",
    specs: [
      { label: "Classification", value: "ISO Class 5–8" },
      { label: "Core", value: "PUF / honeycomb" },
      { label: "Skin", value: "Antibacterial GI / SS" },
      { label: "Thickness", value: "50 / 80 / 100 mm" },
      { label: "Fire rating", value: "Up to 2 hr" },
    ],
    features: [
      "Hermetic gasketed joints",
      "Antibacterial surfaces",
      "Integrated services routing",
      "ISO 14644 validated",
    ],
    gallery: ["Panel", "Joint", "Interior", "Door system"],
    downloads: [
      { label: "System specification (PDF)", size: "3.3 MB" },
      { label: "Validation pack (PDF)", size: "6.0 MB" },
    ],
    leadTime: "8–12 weeks",
  },
  {
    slug: "power-distribution-enclosures",
    title: "Power Distribution Enclosures",
    category: "Electrical",
    subcategory: "Switchgear",
    blurb:
      "IP66-rated enclosures and busbar systems for utility-scale energy distribution.",
    description:
      "Type-tested low-voltage switchgear and busbar systems for utility and industrial power distribution. Engineered to IEC 61439 with full short-circuit withstand verification, our enclosures combine robust IP66/IK10 protection with thermally optimised busbar architecture.",
    specs: [
      { label: "Rated current", value: "Up to 6300 A" },
      { label: "Protection", value: "IP66 / IK10" },
      { label: "Standard", value: "IEC 61439-1/2" },
      { label: "Short-circuit", value: "100 kA / 1 s" },
      { label: "Busbar", value: "Tinned copper" },
    ],
    features: [
      "Type-tested assemblies",
      "Thermally optimised busbars",
      "IP66 / IK10 protection",
      "Arc-fault containment",
    ],
    gallery: ["Enclosure", "Busbar", "Internal", "Installed"],
    downloads: [
      { label: "Type-test certificate (PDF)", size: "2.8 MB" },
      { label: "Configuration guide (PDF)", size: "4.5 MB" },
    ],
    leadTime: "7–11 weeks",
  },
  {
    slug: "industrial-conveyance",
    title: "Industrial Conveyance",
    category: "Material Handling",
    subcategory: "Automation",
    blurb:
      "Automated conveyance and handling lines designed for continuous heavy-duty operation.",
    description:
      "Modular belt and roller conveyance engineered for continuous, heavy-duty material flow. PLC-controlled drives, predictive condition sensors and a modular frame architecture deliver high uptime and simple reconfiguration as your process evolves.",
    specs: [
      { label: "Type", value: "Modular belt / roller" },
      { label: "Control", value: "PLC + HMI" },
      { label: "Throughput", value: "Up to 240 m/min" },
      { label: "Monitoring", value: "Predictive sensors" },
      { label: "Duty", value: "Continuous 24/7" },
    ],
    features: [
      "Modular reconfigurable frames",
      "PLC-controlled drives",
      "Predictive condition monitoring",
      "Continuous duty rating",
    ],
    gallery: ["Line", "Drive", "Control", "Sensor"],
    downloads: [
      { label: "Layout planning kit (PDF)", size: "5.6 MB" },
      { label: "Maintenance manual (PDF)", size: "7.2 MB" },
    ],
    leadTime: "10–14 weeks",
  },
  {
    slug: "custom-oem-engineering",
    title: "Custom OEM Engineering",
    category: "Bespoke",
    subcategory: "Engineering",
    blurb:
      "End-to-end design, prototyping and series production for one-off engineering programs.",
    description:
      "A dedicated engineering practice for OEM partners who need a single accountable manufacturing partner. From design-for-manufacture consulting through rapid prototyping to validated series production, we co-engineer your program from concept to commissioning.",
    specs: [
      { label: "Service", value: "Concept to production" },
      { label: "Prototyping", value: "Rapid, in-house" },
      { label: "Volumes", value: "1 to 100k+" },
      { label: "Quality", value: "PPAP / APQP" },
      { label: "IP", value: "NDA protected" },
    ],
    features: [
      "Design-for-manufacture consulting",
      "Rapid in-house prototyping",
      "Validated series production",
      "Full PPAP documentation",
    ],
    gallery: ["Concept", "Prototype", "Tooling", "Production"],
    downloads: [
      { label: "Capability statement (PDF)", size: "3.0 MB" },
      { label: "Process overview (PDF)", size: "2.2 MB" },
    ],
    leadTime: "Programme-dependent",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const industries = [
  {
    name: "Infrastructure",
    body: "Bridges, transit and large-scale civil programs backed by precision structural systems.",
  },
  {
    name: "Construction",
    body: "Façade, framing and modular building systems delivered on uncompromising timelines.",
  },
  {
    name: "Energy & Power",
    body: "Switchgear, busbar and enclosure systems for utility-scale generation and distribution.",
  },
  {
    name: "Oil & Gas",
    body: "Corrosion-resistant fabrication and skids engineered for hazardous environments.",
  },
  {
    name: "Pharmaceuticals",
    body: "Validated cleanroom and process environments meeting global GMP standards.",
  },
  {
    name: "Aerospace",
    body: "Tight-tolerance precision components produced under AS9100-aligned processes.",
  },
  {
    name: "Automotive",
    body: "Series production of structural and electromechanical assemblies with full PPAP.",
  },
  {
    name: "Water Treatment",
    body: "Tanks, skids and conveyance for municipal and industrial water infrastructure.",
  },
];

export const advantages = [
  {
    title: "Precision Manufacturing",
    body: "Five-axis CNC and robotic welding cells holding tolerances to ±0.02 mm across every batch.",
  },
  {
    title: "Vertically Integrated",
    body: "Design, fabrication, finishing and QA under one roof — full control of cost and lead time.",
  },
  {
    title: "Global Compliance",
    body: "ISO 9001, CE, ASME and IEC certified processes trusted on six continents.",
  },
  {
    title: "Sustainable by Design",
    body: "Closed-loop material recovery and a roadmap to carbon-neutral production by 2030.",
  },
  {
    title: "Engineering Partnership",
    body: "Dedicated program managers co-engineer solutions from concept to commissioning.",
  },
  {
    title: "Lifetime Support",
    body: "Predictive maintenance, spares guarantee and 24/7 field service worldwide.",
  },
];

export const testimonials = [
  {
    quote:
      "Mahadev APF delivered a 90-metre structural program three weeks ahead of schedule with flawless tolerances. They have become our default engineering partner.",
    name: "Arjun Mehta",
    role: "Director of Projects, Meridian Infra",
  },
  {
    quote:
      "The quality of finish and the discipline of their QA process is on par with the best European suppliers we have worked with — at a fraction of the lead time.",
    name: "Sofia Brandt",
    role: "Head of Procurement, Nordvolt Energy",
  },
  {
    quote:
      "From prototype to series production their team simply executes. Documentation, compliance and communication are world class.",
    name: "Daniel Okafor",
    role: "VP Operations, Atlas Pharma",
  },
];

export const milestones = [
  { year: "1998", title: "Founded", body: "Established as a precision fabrication workshop in Ahmedabad." },
  { year: "2006", title: "ISO 9001", body: "Certified and expanded into structural steel programs." },
  { year: "2013", title: "Global reach", body: "First international commissioning across the Middle East." },
  { year: "2019", title: "Smart factory", body: "Commissioned robotic welding and five-axis CNC cells." },
  { year: "2024", title: "32 countries", body: "Serving critical infrastructure across six continents." },
];

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
  author: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "precision-at-scale",
    title: "Precision at Scale: How Robotic Welding Transformed Our Tolerances",
    category: "Manufacturing",
    excerpt:
      "Moving from manual to robotic welding cells let us guarantee ±0.02 mm across full production runs. Here is what changed.",
    date: "2026-05-28",
    readingTime: "6 min",
    author: "Engineering Team",
    content: [
      "For decades, structural fabrication lived with a quiet compromise: the tolerance you could promise on a single piece was rarely the tolerance you could hold across a thousand. Robotic welding changed that equation.",
      "By moving our high-volume programs onto six-axis robotic cells with adaptive seam tracking, we removed the largest source of variation — the human hand under fatigue. The result is repeatability measured in microns, batch after batch.",
      "Just as important as the robots is the data they produce. Every weld is logged, parametrised and traceable, which means our QA team can spot drift long before it becomes a defect. Precision, in other words, is now a system rather than a skill.",
    ],
  },
  {
    slug: "carbon-neutral-roadmap",
    title: "Our Roadmap to Carbon-Neutral Manufacturing by 2030",
    category: "Sustainability",
    excerpt:
      "Closed-loop material recovery, renewable energy and process electrification — the concrete steps behind our 2030 commitment.",
    date: "2026-04-15",
    readingTime: "8 min",
    author: "Sustainability Office",
    content: [
      "Heavy manufacturing and decarbonisation are often framed as opposites. We disagree. Our 2030 roadmap treats carbon as just another tolerance to engineer out of the process.",
      "The first lever is energy. Our facilities are transitioning to on-site solar and renewable power purchase agreements, with process electrification replacing combustion wherever metallurgy allows.",
      "The second is materials. Closed-loop recovery of aluminium and steel offcuts already returns the majority of our scrap to productive use. Combined with supplier engagement on embodied carbon, this is how a foundry becomes a climate asset rather than a liability.",
    ],
  },
  {
    slug: "designing-for-the-field",
    title: "Designing for the Field: Why Commissioning Starts at the Drawing Board",
    category: "Engineering",
    excerpt:
      "The best on-site installation is the one you designed for months earlier. A look at how DFM thinking saves weeks on the ground.",
    date: "2026-03-02",
    readingTime: "5 min",
    author: "Program Management",
    content: [
      "A flawless factory acceptance test means little if the assembly fights the crew on site. That is why our program managers treat commissioning as a design input, not an afterthought.",
      "Design-for-manufacture and design-for-assembly reviews happen before a single cut is made. We model crane access, bolt-up sequences and tolerance stack-up against the real site, not an idealised one.",
      "The payoff is measured in weeks. Programs engineered for the field commission faster, with fewer reworks and far less standing time — the single most expensive line item on any project.",
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
