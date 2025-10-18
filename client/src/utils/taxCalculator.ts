// US State Sales Tax Rates (2024)
export const US_SALES_TAX_RATES: Record<string, number> = {
  'AL': 0.04,    // Alabama
  'AK': 0.0,     // Alaska (no state sales tax)
  'AZ': 0.056,   // Arizona
  'AR': 0.065,   // Arkansas
  'CA': 0.075,   // California
  'CO': 0.029,   // Colorado
  'CT': 0.0635,  // Connecticut
  'DE': 0.0,     // Delaware (no state sales tax)
  'FL': 0.06,    // Florida
  'GA': 0.04,    // Georgia
  'HI': 0.04,    // Hawaii
  'ID': 0.06,    // Idaho
  'IL': 0.0625,  // Illinois
  'IN': 0.07,    // Indiana
  'IA': 0.06,    // Iowa
  'KS': 0.065,   // Kansas
  'KY': 0.06,    // Kentucky
  'LA': 0.0445,  // Louisiana
  'ME': 0.055,   // Maine
  'MD': 0.06,    // Maryland
  'MA': 0.0625,  // Massachusetts
  'MI': 0.06,    // Michigan
  'MN': 0.06875, // Minnesota
  'MS': 0.07,    // Mississippi
  'MO': 0.04225, // Missouri
  'MT': 0.0,     // Montana (no state sales tax)
  'NE': 0.055,   // Nebraska
  'NV': 0.0685,  // Nevada
  'NH': 0.0,     // New Hampshire (no state sales tax)
  'NJ': 0.06625, // New Jersey
  'NM': 0.05125, // New Mexico
  'NY': 0.08,    // New York
  'NC': 0.0475,  // North Carolina
  'ND': 0.05,    // North Dakota
  'OH': 0.0575,  // Ohio
  'OK': 0.045,   // Oklahoma
  'OR': 0.0,     // Oregon (no state sales tax)
  'PA': 0.06,    // Pennsylvania
  'RI': 0.07,    // Rhode Island
  'SC': 0.06,    // South Carolina
  'SD': 0.045,   // South Dakota
  'TN': 0.07,    // Tennessee
  'TX': 0.0625,  // Texas
  'UT': 0.061,   // Utah
  'VT': 0.06,    // Vermont
  'VA': 0.053,   // Virginia
  'WA': 0.065,   // Washington
  'WV': 0.06,    // West Virginia
  'WI': 0.05,    // Wisconsin
  'WY': 0.04,    // Wyoming
  'DC': 0.06,    // District of Columbia
};

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

export interface TaxCalculation {
  subtotal: number;
  salesTax: number;
  salesTaxRate: number;
  customsDuty: number;
  importFee: number;
  total: number;
  stateName: string;
}

export function calculateSalesTax(subtotal: number, stateCode: string): number {
  const taxRate = US_SALES_TAX_RATES[stateCode.toUpperCase()] || 0;
  return subtotal * taxRate;
}

export function calculateCustomsDuty(subtotal: number, productCategory: string): number {
  // US Customs duty rates for common Indian products
  const dutyRates: Record<string, number> = {
    'spices': 0.0,        // Most spices are duty-free
    'tea': 0.0,           // Tea is duty-free
    'rice': 0.0215,       // 2.15% duty on rice
    'lentils': 0.0125,    // 1.25% duty on lentils
    'snacks': 0.065,      // 6.5% duty on processed foods
    'sweets': 0.065,      // 6.5% duty on confectionery
    'oils': 0.192,        // 19.2% duty on vegetable oils
    'flour': 0.0055,      // 0.55% duty on wheat flour
    'default': 0.05       // 5% default duty rate
  };

  const dutyRate = dutyRates[productCategory.toLowerCase()] || dutyRates.default;
  return subtotal * dutyRate;
}

export function calculateImportFee(subtotal: number): number {
  // US Customs processing fee (0.3464% of value, minimum $25, maximum $485)
  const feeRate = 0.003464;
  const calculatedFee = subtotal * feeRate;
  
  return Math.max(25, Math.min(485, calculatedFee));
}

export function calculateTotalTax(
  subtotal: number, 
  stateCode: string, 
  productCategories: string[] = ['default']
): TaxCalculation {
  const salesTaxRate = US_SALES_TAX_RATES[stateCode.toUpperCase()] || 0;
  const salesTax = subtotal * salesTaxRate;
  
  // Calculate average customs duty for mixed categories
  const avgCustomsDuty = productCategories.reduce((sum, category) => {
    return sum + calculateCustomsDuty(subtotal, category);
  }, 0) / productCategories.length;
  
  const importFee = calculateImportFee(subtotal);
  const total = subtotal + salesTax + avgCustomsDuty + importFee;
  
  const stateName = US_STATES.find(state => state.code === stateCode.toUpperCase())?.name || 'Unknown';
  
  return {
    subtotal,
    salesTax,
    salesTaxRate,
    customsDuty: avgCustomsDuty,
    importFee,
    total,
    stateName
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getTaxBreakdown(calculation: TaxCalculation): string[] {
  const breakdown = [
    `Subtotal: ${formatCurrency(calculation.subtotal)}`,
    `${calculation.stateName} Sales Tax (${(calculation.salesTaxRate * 100).toFixed(2)}%): ${formatCurrency(calculation.salesTax)}`,
    `US Customs Duty: ${formatCurrency(calculation.customsDuty)}`,
    `Import Processing Fee: ${formatCurrency(calculation.importFee)}`,
    `Total: ${formatCurrency(calculation.total)}`
  ];
  
  return breakdown;
}
