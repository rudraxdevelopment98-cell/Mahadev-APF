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
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Why Us", href: "#why" },
  { label: "Clients", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: 1200, suffix: "+", label: "Projects Delivered" },
  { value: 480, suffix: "+", label: "Clients Served" },
  { value: 27, suffix: "", label: "Years of Experience" },
  { value: 32, suffix: "", label: "Countries Served" },
];

export type Product = {
  title: string;
  category: string;
  blurb: string;
  specs: string[];
};

export const products: Product[] = [
  {
    title: "Structural Steel Systems",
    category: "Heavy Fabrication",
    blurb:
      "Pre-engineered structural assemblies machined to micron tolerances for high-load infrastructure.",
    specs: ["Grade S355 / IS 2062", "Up to 120 m spans", "Galvanised finish"],
  },
  {
    title: "Precision Aluminium Profiles",
    category: "Extrusion",
    blurb:
      "Architectural-grade extruded profiles with anodised and powder-coated luxury finishes.",
    specs: ["6063-T6 alloy", "Custom dies", "20 micron anodising"],
  },
  {
    title: "Modular Cleanroom Panels",
    category: "Built Environment",
    blurb:
      "Hermetically sealed panel systems engineered for pharma and semiconductor facilities.",
    specs: ["ISO Class 5–8", "PUF / honeycomb core", "Antibacterial skin"],
  },
  {
    title: "Power Distribution Enclosures",
    category: "Electrical",
    blurb:
      "IP66-rated enclosures and busbar systems for utility-scale energy distribution.",
    specs: ["Up to 6300 A", "IP66 / IK10", "Type-tested to IEC 61439"],
  },
  {
    title: "Industrial Conveyance",
    category: "Material Handling",
    blurb:
      "Automated conveyance and handling lines designed for continuous heavy-duty operation.",
    specs: ["Modular belt / roller", "PLC controlled", "Predictive sensors"],
  },
  {
    title: "Custom OEM Engineering",
    category: "Bespoke",
    blurb:
      "End-to-end design, prototyping and series production for one-off engineering programs.",
    specs: ["DFM consulting", "Rapid prototyping", "Series production"],
  },
];

export const industries = [
  "Infrastructure",
  "Construction",
  "Energy & Power",
  "Oil & Gas",
  "Pharmaceuticals",
  "Aerospace",
  "Automotive",
  "Water Treatment",
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
