# PDF Report Design - Credit Scoring Result

## Overview
Rebuild PDF export in `pdfGenerator.ts` to be professional & complete — resembling formal bank document.

## Requirements

### Content Sections (in order)
1. **Header**
   - Logo Aksesa
   - Title: "Laporan Analisis Skor Kredit"

2. **Skor Utama**
   - Score value (large, centered)
   - Risk category with color indicator
   - Date of analysis

3. **Ringkasan Bisnis**
   - Business name
   - Data source used (invoice / marketplace / manual)

4. **Faktor Pembentuk Skor**
   - Positive factors (green bullets)
   - Negative factors (red bullets)

5. **Rekomendasi**
   - Numbered recommendations (amber bullets)

6. **Simulasi Pinjaman**
   - Table: Tenor | Estimated Monthly Payment
   - Include multiple tenor options (6, 12, 18, 24 months)

7. **Footer**
   - Copyright: "Aksesa - Platform Credit Scoring UMKM"
   - Disclaimer about non-binding result

### Visual Style
- Color scheme: Professional (blue accent for score, green/red for factors)
- Font: Clean, readable
- Spacing: Adequate between sections
- Page: A4 portrait

### Data Input
The PDF generator receives:
- `score: number`
- `risk_category: string`
- `positiveFactors: string[]`
- `negativeFactors: string[]`
- `recommendations: string[]`
- (existing interface)

Need to extend to include:
- Business name
- Data source type
- Loan simulation data (amount, multiple tenor options)

## Implementation
- Update `frontend/lib/pdfGenerator.ts`
- Add new types for extended report data
- Implement multi-section PDF layout with jsPDF

## Acceptance Criteria
- [ ] PDF contains all 7 sections above
- [ ] Professional appearance suitable for bank submission
- [ ] Simulation table shows 4 tenor options
- [ ] All user data from result page reflected in PDF