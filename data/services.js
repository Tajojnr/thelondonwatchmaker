// data/services.js

export const WORKSHOP_SERVICES = [
  {
    id: "diagnostic",
    category: "diagnostics",
    title: "On-the-Spot Live Diagnostic",
    description: "Case unsealed directly in front of you. Live amplitude, beat error, and rate assessment on Witschi timing equipment.",
    price: "Complimentary / £0",
    turnaround: "15–30 Mins",
    icon: "🔬",
    features: [
      "Live bench microscope inspection",
      "Witschi timing & beat error analysis",
      "Dry vacuum seal diagnostic",
      "Immediate upfront written quotation"
    ],
    highlights: [
      "Microscope live feed",
      "Demagnetisation test",
      "Immediate written quote"
    ]
  },
  {
    id: "movement",
    category: "overhaul",
    title: "Full Calibre Overhaul",
    description: "Complete movement strip-down, 4-stage ultrasonic wash, epilame treatment, Moebius synthetic lubrication & 5-position regulation.",
    price: "From £250",
    turnaround: "7–14 Days",
    icon: "⚙️",
    features: [
      "100% complete movement disassembly",
      "Ultrasonic multi-bath chemical wash",
      "Moebius Swiss synthetic lubrication",
      "5-position Witschi COSC regulation",
      "Up to 24-month mechanical warranty"
    ],
    highlights: [
      "COSC rate precision",
      "Worn pivots repolished",
      "Up to 24-Month warranty"
    ]
  },
  {
    id: "refurbishment",
    category: "restoration",
    title: "Case & Bracelet Refinishing",
    description: "Precision lapping machine geometry restoration. Razor-sharp factory chamfers, satin brush grains, and mirror polish without rounding lugs.",
    price: "From £120",
    turnaround: "3–5 Days",
    icon: "✨",
    features: [
      "Lapping machine geometric preservation",
      "Satin brush grain and mirror polishing",
      "Micro-laser welding for deep dings",
      "Ultrasonic case and link bath"
    ],
    highlights: [
      "Chamfer restoration",
      "Ultrasonic grime flush",
      "Zero case edge loss"
    ]
  },
  {
    id: "waterproof",
    category: "diagnostics",
    title: "Hydrostatic Pressure Testing",
    description: "Multi-stage vacuum and wet pressure testing up to 100 bar (1,000m) with genuine Swiss gasket replacement.",
    price: "From £40",
    turnaround: "Same Day",
    icon: "💧",
    features: [
      "Swiss synthetic gasket replacement",
      "Dry vacuum seal chamber test",
      "Wet hydrostatic pressure testing",
      "Official waterproof test certificate"
    ],
    highlights: [
      "Dry vacuum chamber",
      "Wet pressure tank",
      "Certificate printout"
    ]
  },
  {
    id: "authentication",
    category: "diagnostics",
    title: "Authentication & Valuation",
    description: "Complete serial number, calibre authenticity, dial originality, and case verification for insurance or resale peace of mind.",
    price: "£80",
    turnaround: "Same Day",
    icon: "🛡️",
    features: [
      "Movement serial and bridge verification",
      "Dial, hands, and bezel period accuracy check",
      "Stolen register database check",
      "Official signed valuation certificate"
    ],
    highlights: [
      "Internal movement check",
      "Archive database match",
      "Signed report"
    ]
  },
  {
    id: "crystal",
    category: "restoration",
    title: "Sapphire & Plexiglass Replacement",
    description: "OEM and bespoke Swiss sapphire, mineral, or vintage domed hesalite crystals fitted with authentic tension rings.",
    price: "From £75",
    turnaround: "24–48 Hours",
    icon: "💎",
    features: [
      "Scratch-resistant sapphire or hesalite",
      "Anti-reflective interior coating",
      "Gasket seal and pressure test included",
      "Vintage domed profile matching"
    ],
    highlights: [
      "Anti-reflective coating",
      "Pressure seal guaranteed",
      "Vintage dome options"
    ]
  }
];

// Dual export for backwards compatibility
export const services = WORKSHOP_SERVICES;