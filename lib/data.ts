/**
 * Central content for the Mahadev APF public website.
 * Edit values here to re-brand the whole site without touching components.
 */

export const company = {
  name: "Mahadev APF",
  legalName: "Mahadev Aluminium, PVC & Furniture",
  tagline: "Furniture · Aluminium & uPVC Windows · Glass Works",
  intro:
    "Your one-stop workshop for custom furniture, aluminium and uPVC windows & doors, and glass works — designed, fabricated and fitted by our own team.",
  email: "mahadevapf@gmail.com",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  address: "Main Road, Near Bus Stand, Ahmedabad, Gujarat 380001",
};

export const nav = [
  { label: "Our Work", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Spaces", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 5000, suffix: "+", label: "Windows & Doors Fitted" },
  { value: 1200, suffix: "+", label: "Happy Customers" },
  { value: 15, suffix: "", label: "Years in Business" },
  { value: 6, suffix: "", label: "Cities Served" },
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
    slug: "aluminium-windows-doors",
    title: "Aluminium Windows & Doors",
    category: "Aluminium",
    subcategory: "Windows",
    blurb:
      "Sliding and openable aluminium windows and doors in powder-coated finishes, built to measure.",
    description:
      "Strong, low-maintenance aluminium windows and doors fabricated in our own workshop. Choose 2-track or 3-track sliding, openable casements or partitions, in any powder-coated colour. Every frame is cut, assembled and fitted by our team for a clean, weather-tight finish.",
    specs: [
      { label: "Type", value: "Sliding / Openable / Partition" },
      { label: "Finish", value: "Powder coat — any shade" },
      { label: "Glass", value: "Clear / tinted / frosted" },
      { label: "Mesh", value: "Optional SS mosquito net" },
      { label: "Warranty", value: "On fabrication & fittings" },
    ],
    features: [
      "Made to exact opening size",
      "Smooth rollers & locks",
      "Weather-sealed joints",
      "Powder-coated colours",
    ],
    gallery: ["Sliding", "Openable", "Partition", "Finish"],
    downloads: [
      { label: "Window options guide (PDF)", size: "1.8 MB" },
      { label: "Colour chart (PDF)", size: "0.9 MB" },
    ],
    leadTime: "5–10 days",
  },
  {
    slug: "upvc-windows-doors",
    title: "uPVC Windows & Doors",
    category: "uPVC",
    subcategory: "Windows",
    blurb:
      "Premium uPVC sliding and casement windows — sound-proof, dust-proof and weather-proof.",
    description:
      "uPVC windows and doors that keep out dust, noise and rain while staying maintenance-free for years. Multi-chambered profiles with steel reinforcement and quality hardware give a smooth, secure operation. Ideal for bedrooms, kitchens and road-facing rooms.",
    specs: [
      { label: "Profile", value: "Multi-chamber, steel reinforced" },
      { label: "Type", value: "Sliding / Casement / Fixed" },
      { label: "Glazing", value: "Single / double glazed" },
      { label: "Benefits", value: "Sound, dust & water proof" },
      { label: "Colour", value: "White / wood-laminate" },
    ],
    features: [
      "Up to 60% noise reduction",
      "Dust & water tight",
      "Lockable multi-point handles",
      "Zero repainting",
    ],
    gallery: ["Sliding", "Casement", "Profile", "Hardware"],
    downloads: [
      { label: "uPVC system brochure (PDF)", size: "2.6 MB" },
      { label: "Glazing options (PDF)", size: "1.1 MB" },
    ],
    leadTime: "7–14 days",
  },
  {
    slug: "modular-kitchens",
    title: "Modular Kitchens",
    category: "Furniture",
    subcategory: "Kitchen",
    blurb:
      "Custom modular kitchens with smart storage, durable finishes and quality fittings.",
    description:
      "We design and build modular kitchens around how you cook. Base and wall units, tall storage and loft cabinets in laminate, acrylic or PU finishes, with soft-close hinges and channels. Free design consultation and 3D layout before we start.",
    specs: [
      { label: "Carcass", value: "BWP / BWR ply" },
      { label: "Shutters", value: "Laminate / Acrylic / PU" },
      { label: "Hardware", value: "Soft-close hinges & channels" },
      { label: "Counter", value: "Granite / quartz options" },
      { label: "Design", value: "Free 3D layout" },
    ],
    features: [
      "Made to your kitchen size",
      "Soft-close everything",
      "Tall & loft storage",
      "Water-resistant ply",
    ],
    gallery: ["Layout", "Storage", "Finish", "Fitted"],
    downloads: [
      { label: "Kitchen design guide (PDF)", size: "4.2 MB" },
      { label: "Finish & shade chart (PDF)", size: "1.5 MB" },
    ],
    leadTime: "3–5 weeks",
  },
  {
    slug: "wardrobes-storage",
    title: "Wardrobes & Storage",
    category: "Furniture",
    subcategory: "Wardrobe",
    blurb:
      "Sliding and openable wardrobes, TV units and storage built to fit your room perfectly.",
    description:
      "Custom wardrobes that use every inch — sliding or openable, with mirrors, drawers, hanging space and loft units. We also build TV units, study tables, shoe racks and full bedroom sets in matching finishes.",
    specs: [
      { label: "Type", value: "Sliding / Openable" },
      { label: "Material", value: "Ply / MDF with laminate" },
      { label: "Inside", value: "Drawers, shelves, hanging" },
      { label: "Extras", value: "Mirror, loft, lighting" },
      { label: "Finish", value: "Laminate / acrylic" },
    ],
    features: [
      "Floor-to-ceiling storage",
      "Custom internal layout",
      "Matching room furniture",
      "Durable laminates",
    ],
    gallery: ["Sliding", "Openable", "Interior", "Bedroom set"],
    downloads: [
      { label: "Wardrobe ideas (PDF)", size: "3.4 MB" },
      { label: "Laminate catalogue (PDF)", size: "6.1 MB" },
    ],
    leadTime: "2–4 weeks",
  },
  {
    slug: "glass-partitions",
    title: "Glass & Partitions",
    category: "Glass",
    subcategory: "Glazing",
    blurb:
      "Toughened glass railings, shower partitions, shopfronts and office glass partitions.",
    description:
      "Toughened and laminated glass works for homes, offices and shops — shower enclosures, glass railings, table tops, shopfront glazing and framed or frameless office partitions. Supplied, fabricated and installed with quality fittings.",
    specs: [
      { label: "Glass", value: "Toughened 8/10/12 mm" },
      { label: "Use", value: "Shower / railing / partition" },
      { label: "Type", value: "Framed / frameless" },
      { label: "Hardware", value: "SS spider / patch fittings" },
      { label: "Edge", value: "Polished & buffed" },
    ],
    features: [
      "Toughened safety glass",
      "Frameless options",
      "Shopfront glazing",
      "Office partitions",
    ],
    gallery: ["Shower", "Railing", "Partition", "Shopfront"],
    downloads: [
      { label: "Glass works guide (PDF)", size: "2.1 MB" },
      { label: "Fittings catalogue (PDF)", size: "1.7 MB" },
    ],
    leadTime: "4–9 days",
  },
  {
    slug: "office-commercial-interiors",
    title: "Office & Shop Interiors",
    category: "Furniture",
    subcategory: "Commercial",
    blurb:
      "Complete interior fit-outs for offices, showrooms and shops — furniture, glass and aluminium together.",
    description:
      "One team for your full commercial fit-out: reception and workstation furniture, storage, glass cabins, aluminium partitions, false ceiling and shopfronts. We handle design to handover so your space opens on time.",
    specs: [
      { label: "Scope", value: "Furniture + glass + aluminium" },
      { label: "Spaces", value: "Offices / showrooms / shops" },
      { label: "Includes", value: "Cabins, counters, storage" },
      { label: "Add-ons", value: "False ceiling, signage" },
      { label: "Delivery", value: "Design to handover" },
    ],
    features: [
      "Single accountable team",
      "Workstations & cabins",
      "Glass & aluminium partitions",
      "On-time handover",
    ],
    gallery: ["Reception", "Workstations", "Cabin", "Shopfront"],
    downloads: [
      { label: "Commercial portfolio (PDF)", size: "5.8 MB" },
      { label: "Fit-out checklist (PDF)", size: "0.8 MB" },
    ],
    leadTime: "Project-based",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const industries = [
  {
    name: "Homes & Apartments",
    body: "Windows, wardrobes, modular kitchens and glass works for flats and bungalows.",
  },
  {
    name: "Offices",
    body: "Workstations, cabins, glass partitions and aluminium fronts for workplaces.",
  },
  {
    name: "Showrooms & Shops",
    body: "Shopfront glazing, display units and storage built to pull customers in.",
  },
  {
    name: "Restaurants & Cafés",
    body: "Custom seating, counters, partitions and durable, easy-clean surfaces.",
  },
  {
    name: "Builders & Contractors",
    body: "Bulk windows, doors and fit-outs for residential and commercial projects.",
  },
  {
    name: "Hospitals & Clinics",
    body: "Hygienic partitions, storage and aluminium works for healthcare spaces.",
  },
  {
    name: "Schools & Institutes",
    body: "Sturdy furniture, windows and partitions made to handle daily use.",
  },
  {
    name: "Hotels & Resorts",
    body: "Room furniture, wardrobes and glass works with a premium finish.",
  },
];

export const advantages = [
  {
    title: "Our Own Workshop",
    body: "We fabricate in-house — so quality, cost and timelines stay in our control, not a middleman's.",
  },
  {
    title: "Quality Materials",
    body: "Branded profiles, BWP ply, toughened glass and trusted hardware on every job.",
  },
  {
    title: "Made to Measure",
    body: "Everything is built to your exact size and design — no off-the-shelf compromises.",
  },
  {
    title: "On-Time Fitting",
    body: "Our own fitting team installs cleanly and on schedule, with minimal mess.",
  },
  {
    title: "Transparent Pricing",
    body: "Clear written estimates and GST bills — you always know what you are paying for.",
  },
  {
    title: "After-Sales Service",
    body: "Quick support for adjustments, servicing and spares long after handover.",
  },
];

export const testimonials = [
  {
    quote:
      "They fitted uPVC windows in our whole flat — the road noise and dust dropped completely. Neat work and finished on time.",
    name: "Rajesh Patel",
    role: "Homeowner, Satellite",
  },
  {
    quote:
      "Our modular kitchen came out exactly like the 3D design. Good materials, soft-close everything, and a fair price with a proper bill.",
    name: "Meena Shah",
    role: "Homeowner, Bopal",
  },
  {
    quote:
      "We did our showroom's glass front and aluminium partitions with Mahadev. One team handled everything and opened us on schedule.",
    name: "Imran Sheikh",
    role: "Shop Owner, CG Road",
  },
];

export const milestones = [
  { year: "2010", title: "Started", body: "Opened as a small aluminium fabrication workshop in Ahmedabad." },
  { year: "2014", title: "Furniture", body: "Added modular furniture and wardrobes to our work." },
  { year: "2018", title: "uPVC & Glass", body: "Introduced uPVC windows and a full glass works section." },
  { year: "2021", title: "Showroom", body: "Opened our display showroom with live samples." },
  { year: "2024", title: "1200+ homes", body: "Crossed 1200 happy customers across 6 cities." },
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
    slug: "aluminium-vs-upvc-windows",
    title: "Aluminium vs uPVC Windows: Which Should You Choose?",
    category: "Windows",
    excerpt:
      "Both are great — but the right pick depends on noise, budget and where the window faces. A simple guide.",
    date: "2026-05-28",
    readingTime: "5 min",
    author: "Mahadev APF",
    content: [
      "Aluminium and uPVC are the two most popular window choices today, and both are far better than old wooden frames. The right one for you depends on a few simple things.",
      "Choose uPVC when noise and dust are the priority — road-facing rooms, bedrooms and bungalows near traffic benefit most from its multi-chamber profiles and tight seals. It never needs painting and handles rain beautifully.",
      "Choose aluminium when you want slim frames, large openings and a wide range of powder-coated colours at a friendlier price. It is strong, light and ideal for sliding windows, balconies and partitions. Still unsure? Send us your room sizes and we will recommend the best fit.",
    ],
  },
  {
    slug: "modular-kitchen-materials-guide",
    title: "A Simple Guide to Modular Kitchen Materials",
    category: "Furniture",
    excerpt:
      "Ply or MDF? Laminate or acrylic? Here is what actually matters for a kitchen that lasts.",
    date: "2026-04-15",
    readingTime: "6 min",
    author: "Mahadev APF",
    content: [
      "A kitchen lives with water, heat and daily use, so the materials matter more than the colour. Start with the carcass — we recommend BWP or BWR plywood because it resists moisture far better than regular board.",
      "For shutters, laminate is the practical all-rounder, acrylic gives a glossy premium look, and PU is for a rich painted finish. All three work well; it is about your budget and style.",
      "Finally, hardware is what you feel every day. Soft-close hinges and channels from a trusted brand are worth every rupee — they keep the kitchen quiet and working smoothly for years.",
    ],
  },
  {
    slug: "caring-for-toughened-glass",
    title: "Caring for Toughened Glass at Home",
    category: "Glass",
    excerpt:
      "Toughened glass is tough, not indestructible. A few easy habits keep railings and showers looking new.",
    date: "2026-03-02",
    readingTime: "4 min",
    author: "Mahadev APF",
    content: [
      "Toughened glass is heat-treated to be several times stronger than ordinary glass, and if it ever breaks it crumbles into small, blunt pieces instead of sharp shards. That makes it ideal for railings, showers and tabletops.",
      "To keep it clear, wipe with a soft cloth and a mild glass cleaner — avoid abrasive scrubs that can scratch the surface. For shower glass, a quick squeegee after use prevents hard-water spots.",
      "Avoid sharp knocks on the edges and corners, which is where glass is most sensitive. Treated well, a good toughened glass installation stays crystal clear for many years.",
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
