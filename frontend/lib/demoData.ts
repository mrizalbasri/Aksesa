/**
 * Demo Data for Testing
 * Provides sample UMKM data for quick scoring demonstration
 */

export const DEMO_PROFILES = {
  eligible: {
    name: "High-Performing UMKM",
    businessAge: 5,
    employees: 8,
    location: "Jakarta, Indonesia",
    transactions: [
      { date: "2026-04-15", amount: 5000000 },
      { date: "2026-04-16", amount: 7500000 },
      { date: "2026-04-17", amount: 4500000 },
      { date: "2026-04-18", amount: 8000000 },
      { date: "2026-04-19", amount: 6000000 },
    ],
    tokopedia: 25000000,
    shopee: 18000000,
    expectedScore: "90-100",
    expectedRisk: "Layak Kredit",
  },
  medium: {
    name: "Developing UMKM",
    businessAge: 2,
    employees: 3,
    location: "Bandung, Indonesia",
    transactions: [
      { date: "2026-04-15", amount: 2000000 },
      { date: "2026-04-16", amount: 2500000 },
      { date: "2026-04-17", amount: 2200000 },
    ],
    tokopedia: 8000000,
    shopee: 5000000,
    expectedScore: "50-65",
    expectedRisk: "Risiko Sedang",
  },
  high: {
    name: "Early-Stage UMKM",
    businessAge: 0.5,
    employees: 1,
    location: "Surabaya, Indonesia",
    transactions: [
      { date: "2026-04-15", amount: 500000 },
      { date: "2026-04-16", amount: 750000 },
    ],
    tokopedia: 0,
    shopee: 2000000,
    expectedScore: "20-35",
    expectedRisk: "Risiko Tinggi",
  },
};

/**
 * Get sample data for form pre-population
 */
export function getDemoData(profile: keyof typeof DEMO_PROFILES) {
  const data = DEMO_PROFILES[profile];
  return {
    businessAge: data.businessAge,
    employees: data.employees,
    location: data.location,
    transactions: data.transactions,
    tokopedia: data.tokopedia,
    shopee: data.shopee,
  };
}

/**
 * Check if browser has demo mode enabled
 * Usage: ?demo=eligible or ?demo=medium or ?demo=high
 */
export function getDemoModeFromURL(): keyof typeof DEMO_PROFILES | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");
  if (demo && demo in DEMO_PROFILES) {
    return demo as keyof typeof DEMO_PROFILES;
  }
  return null;
}
