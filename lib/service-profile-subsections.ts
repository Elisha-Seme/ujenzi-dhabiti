/**
 * Named sub-services and descriptions from the supplied UJENZI DHABITI COMPANY
 * PROFILE. These are client-supplied service claims, not generated offerings.
 * Source: Downloads/Documents/Word Docs/UJENZI DHABITI COMPANY PROFILE (3).docx
 * Import is insert-only: admins retain ownership of any existing CMS copy.
 */
export type ProfileSubsection = {
  serviceSlug: string;
  sectionId: string;
  title: string;
  body: string;
};

const groups: Record<string, Array<[string, string, string]>> = {
  "civil-works": [
    ["standard-murram-roads", "Standard Compacted Murram Roads", "These are the most common type of murram roads, constructed using well-selected lateritic material that is spread, graded, and mechanically compacted."],
    ["heavy-duty-murram-roads", "Heavy-Duty Murram Roads", "Designed for areas with high traffic volumes or heavy vehicles, these roads are reinforced with thicker murram layers and improved subgrade stabilization."],
    ["graded-murram-roads", "Graded and Shaped Murram Roads", "These roads focus on proper profiling and shaping to enhance water runoff and driving comfort. They are carefully graded to achieve the correct camber and alignment."],
    ["murram-roads-with-drainage", "Murram Roads with Drainage Systems", "We construct murram roads integrated with effective drainage features such as side drains, mitre drains, and culverts."],
    ["stabilized-murram-roads", "Stabilized Murram Roads", "These roads are enhanced using stabilizing agents such as cement, lime, or mechanical stabilization techniques to improve strength and reduce dust."],
    ["estate-murram-roads", "Estate and Internal Access Murram Roads", "Specifically designed for residential developments, these roads prioritize smooth finishes, proper drainage, and aesthetic integration with the surrounding environment."],
  ],
  "cabro-road-works": [
    ["driveway-cabro-paving", "Driveway Cabro Paving", "We design and install durable and visually appealing cabro driveways for residential and commercial properties."],
    ["parking-yard-cabro-paving", "Parking Yard Cabro Paving", "We construct cabro-paved parking areas designed for high traffic and efficient space utilization."],
    ["cabro-walkways", "Walkways & Pedestrian Paths", "We create cabro walkways and footpaths that provide safe and attractive pedestrian access."],
    ["estate-cabro-roads", "Estate Roads & Internal Cabro Roads", "We construct cabro-paved estate roads that offer an alternative to murram or tarmac."],
    ["industrial-cabro-yards", "Cabro Paving for Commercial & Industrial Yards", "We install heavy-duty cabro paving for areas subjected to intense use and heavy loads."],
    ["decorative-cabro-paving", "Decorative & Patterned Cabro Paving", "We offer customized decorative cabro designs that enhance the visual appeal of outdoor spaces."],
    ["cabro-repairs", "Cabro Paving Repairs & Maintenance", "We provide cabro repair and maintenance services to restore damaged or worn-out surfaces, including re-leveling sunken areas and replacing broken blocks."],
  ],
  plumbing: [
    ["side-drains", "Side Drains (Open Channel Drains)", "We construct side drains alongside roads to effectively channel surface water away from the road structure."],
    ["culvert-installation", "Culvert Installation", "We install culverts to allow water to pass beneath roads, ensuring uninterrupted natural water flow."],
    ["storm-water-drainage", "Storm Water Drainage Systems", "We design and construct stormwater drainage systems to manage runoff during heavy rainfall."],
    ["mitre-drains", "Mitre Drains", "We construct mitre drains that divert water from side drains into surrounding land, reducing water pressure along the road."],
    ["french-drains", "French Drains (Subsurface Drainage)", "We install French drains to manage underground water and prevent waterlogging."],
    ["concrete-drainage-channels", "Concrete Drainage Channels", "We construct reinforced concrete drainage channels for high-capacity water flow and long-term durability."],
    ["gabion-drainage", "Gabion Drainage & Erosion Control Systems", "We install gabion structures to control erosion and stabilize drainage paths in areas prone to soil movement."],
    ["drainage-maintenance", "Drainage Maintenance & Rehabilitation", "We offer drainage repair and maintenance services to restore and improve existing systems."],
  ],
  "interior-design": [
    ["gypsum-office-partitions", "Gypsum (Drywall) Partitions", "Ideal for creating permanent office layouts, gypsum partitions are a popular choice for enclosed offices, meeting rooms, and executive spaces."],
    ["glass-office-partitions", "Glass Partitions (Frameless & Framed)", "Glass partitions bring a modern look while maintaining an open and collaborative feel. We offer frameless and aluminum-framed options."],
    ["aluminum-glass-partitions", "Aluminum & Glass Partition Systems", "A combination of aluminum frames and glass panels creates a strong yet elegant partition system."],
    ["modular-partitions", "Modular (Demountable) Partitions", "These are flexible, reusable partition systems designed for businesses that anticipate growth or frequent layout changes."],
    ["timber-partitions", "Wooden (Timber) Partitions", "Wooden partitions add warmth and a premium feel to office interiors. We offer both full timber and engineered wood options."],
    ["acoustic-partitions", "Acoustic (Soundproof) Partitions", "Designed for privacy and noise control, acoustic partitions are suited to busy office environments."],
    ["pvc-partitions", "PVC & Lightweight Partitions", "PVC partitions are a cost-effective and quick solution for dividing spaces. They are lightweight, easy to install, and resistant to moisture."],
    ["sliding-folding-partitions", "Sliding & Folding Partitions", "These partitions offer flexibility by allowing spaces to be opened up or closed off as needed."],
    ["cubicle-partitions", "Half-Height (Cubicle) Partitions", "Cubicle partitions create individual workstations while maintaining an open office feel."],
    ["aluminum-windows", "Aluminum Windows Installation", "We design and install aluminum windows for residential and commercial properties, including sliding, casement, tilt-and-turn, and louvered designs."],
    ["aluminum-doors", "Aluminum Doors Solutions", "Our aluminum doors are designed to deliver both functionality and style, from sliding patio doors to commercial entrances."],
    ["interior-glazing", "Glass Office Partitions & Interior Glazing", "We offer frameless and framed glass partitioning systems with clear, frosted, or branded finishes."],
    ["curtain-walling", "Curtain Walling & Glass Facades", "We specialize in non-structural glass facades that improve lighting, energy efficiency, and the appearance of buildings."],
    ["glass-shopfronts", "Shopfronts & Commercial Glass Installations", "We design glass shopfronts that maximize product visibility while ensuring safety and durability."],
    ["shower-cubicles", "Shower Cubicles Installation", "We install customizable glass shower cubicles designed for style, comfort, and durability."],
    ["glass-balustrades", "Glass Balustrades & Railings", "Our glass balustrades provide a clean look while maintaining safety for staircases, balconies, and terraces."],
    ["aluminum-louvers", "Aluminum Louvers & Ventilation Systems", "We install aluminum louver systems designed for ventilation, durability, and weather resistance."],
    ["skylights", "Skylights & Roof Glazing Solutions", "Our skylights and roof glazing systems brighten interiors while reducing energy costs."],
    ["decorative-glass", "Mirrors & Decorative Glass Installations", "We supply and install mirrors and decorative glass for interior spaces."],
    ["automatic-glass-doors", "Frameless & Automatic Glass Doors", "We install frameless glass doors and automated systems for high-traffic areas."],
    ["aluminum-cladding", "Aluminum Cladding & Composite Panels (ACP)", "We install aluminum composite panels that provide a weather-resistant exterior finish."],
  ],
  "gypsum-ceilings": [
    ["gypsum-ceiling-designs", "Gypsum Ceiling Designs (False Ceilings)", "We design and install gypsum ceilings, from flat ceilings to bulkhead and layered designs, that can conceal wiring and improve acoustics."],
    ["gypsum-partition-walls", "Gypsum Partition Walls", "Gypsum partitions create rooms or office layouts without heavy masonry work. They are lightweight and can be finished to match the interior."],
    ["gypsum-bulkheads", "Bulkheads & Ceiling Features", "We create bulkheads that add depth to ceilings while helping to conceal beams, ducts, and wiring."],
    ["gypsum-cornices", "Gypsum Cornices & Decorative Mouldings", "We install decorative gypsum cornices and mouldings at wall-to-ceiling transitions."],
    ["gypsum-feature-walls", "TV Walls & Feature Walls", "We design gypsum TV units and feature walls that can include shelving, lighting, and hidden cable management."],
    ["acoustic-gypsum", "Acoustic (Soundproof) Gypsum Systems", "Our acoustic gypsum systems incorporate insulation materials to reduce noise transmission and improve sound quality."],
    ["suspended-ceilings", "Suspended (Drop) Ceilings", "Suspended ceilings provide access to electrical and mechanical systems while maintaining a uniform finish."],
    ["moisture-resistant-gypsum", "Moisture-Resistant Gypsum Works", "We install moisture-resistant gypsum boards for areas exposed to humidity, including kitchens, bathrooms, and utility areas."],
    ["fire-resistant-gypsum", "Fire-Resistant Gypsum Systems", "Our fire-rated gypsum systems are designed to slow the spread of fire."],
    ["gypsum-repairs", "Gypsum Repairs & Renovations", "We repair damaged ceilings, partitions, and finishes or upgrade them to new designs."],
  ],
  flooring: [
    ["tile-flooring", "Tile Flooring Installation (Ceramic & Porcelain)", "We install ceramic and porcelain tiles for residential and commercial spaces, with a focus on durability and easy maintenance."],
    ["hardwood-laminate-flooring", "Hardwood & Laminate Flooring Services", "We install hardwood and laminate flooring that brings natural beauty and comfort into a space."],
    ["vinyl-flooring", "Vinyl Flooring Installation (PVC & LVT)", "Our vinyl flooring is available in finishes that mimic wood and stone for modern interiors."],
    ["epoxy-flooring", "Epoxy Flooring", "We provide seamless epoxy flooring resistant to chemicals, heavy loads, and wear."],
    ["terrazzo-flooring", "Terrazzo Flooring Installation", "We install traditional and modern terrazzo flooring systems with a polished finish."],
    ["stone-flooring", "Natural Stone Flooring (Marble & Granite)", "We install natural stone flooring for homes, hotels, and commercial spaces."],
    ["outdoor-flooring", "Cabro Paving & Outdoor Flooring Solutions", "We design and install cabro paving systems for residential and commercial outdoor areas."],
    ["carpet-flooring", "Carpet & Carpet Tile Installation", "Our carpet flooring solutions provide a soft feel while reducing noise in indoor environments."],
    ["raised-access-flooring", "Raised Access Flooring Systems", "We install raised flooring systems that allow access to electrical and data systems beneath the floor."],
    ["floor-screeding", "Floor Screeding & Surface Preparation Services", "We provide screeding and surface preparation to create a smooth, level base for flooring installations."],
  ],
  "paint-finishes": [
    ["interior-painting", "Interior Painting Services", "We provide interior painting services with smooth finishes tailored to living and working spaces."],
    ["exterior-painting", "Exterior Painting", "We offer weather-resistant exterior painting designed to withstand sun, rain, and dust."],
    ["decorative-painting", "Decorative & Textured Wall Finishes", "We create decorative textures and wall finishes for interior spaces."],
    ["commercial-painting", "Commercial & Industrial Painting Services", "We provide painting services for commercial and industrial properties."],
    ["roof-painting", "Roof Painting & Waterproof Coatings", "We apply roof painting and coatings to protect against rust, leaks, and heat damage."],
    ["protective-coatings", "Waterproofing & Protective Coatings", "We provide waterproofing solutions for basements, roofs, external walls, and wet areas."],
    ["wood-metal-painting", "Wood & Metal Painting Services", "We treat and finish wooden and metal surfaces to enhance their lifespan and appearance."],
    ["spray-painting", "Spray Painting Services", "Our spray-painting technique provides a uniform finish for large or detailed surfaces."],
    ["repainting", "Repainting & Renovation Painting Services", "We repaint worn spaces to improve their appearance and value."],
    ["surface-preparation", "Surface Preparation & Finishing Services", "We prepare surfaces before painting to improve durability and finish quality."],
  ],
};

export const profileSubsections: ProfileSubsection[] = Object.entries(groups).flatMap(
  ([serviceSlug, rows]) => rows.map(([sectionId, title, body]) => ({ serviceSlug, sectionId, title, body })),
);
