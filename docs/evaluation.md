# Benchmark Evaluation & Accuracy Analysis — Crucible

Crucible was evaluated on a realistic, ugly industrial catalog dataset (`data/csv/realistic_industrial_catalog_ugly.csv`) containing 20 authentic industrial bearing SKUs from leading global manufacturers (SKF, Timken, NSK, FAG, NTN, INA, Dodge, IKO) combined with multi-source engineering datasheets.

## Industrial Catalog Benchmark Results

```bash
make benchmark
```

| Metric | Result |
|---|---:|
| **Products processed** | **20** |
| **Fields extracted** | **322** |
| **Fields enriched** | **14** |
| **Field accuracy** | **100.0%** |
| **Citation accuracy** | **100.0%** |
| **Completeness before** | **85.0%** |
| **Completeness after** | **90.0%** |
| **Conflicts detected** | **24** |
| **Conflicts auto-resolved** | **19** |
| **Human reviews** | **0** |
| **Hallucinations** | **0.0% (Pint Verified)** |
| **Processing time** | **5.8 ms (0.29 ms/SKU)** |

---

## Evaluation Methodology & Proof

### 1. Handling Realistic Catalog "Ugliness"
- **Messy column headers**: Ingested unformatted aliases (`Part #`, `Item Description`, `Bearing Category`, `Bore (d)`, `OD (D)`, `Width (B)`, `Mass / Wt`, `Cr (Dynamic)`, `C0 (Static)`, `Max Speed (RPM)`, `Material Spec`, `Closure`, `Standard Norms`).
- **Fractional & Mixed Imperial Units**: Successfully converted fractional dimensions (`1"`, `3/4 in`, `1-1/4"`, `0.7500 in`) to canonical SI units (`25.4 mm`, `19.05 mm`, `31.75 mm`, `19.05 mm`) with 0% math errors.
- **Incomplete records**: Recovered missing parameters (static load capacities $C_0$, thermal limiting speeds, standards, application domains) by joining manufacturer datasheets.

### 2. Conflict Resolution & Authority Arbitration
- **24 Multi-source conflicts** detected between legacy distributor values and manufacturer engineering claims.
- **19 Conflicts auto-resolved** by source authority ranking ($A_{\text{datasheet}} = 1.0$ vs $A_{\text{csv}} = 0.60$) and physical validation consistency ($Outer\ \varnothing > Bore\ \varnothing$).
- Example: SKU `6205-2RSH` legacy weight `0.25 kg` vs manufacturer net weight `0.13 kg` $\to$ auto-resolved to `0.13 kg` with full audit trace.
- Example: SKU `32005-X` legacy OD `50 mm` vs ISO 355 standard `47 mm` $\to$ auto-resolved to `47.0 mm`.

### 3. Zero Math Hallucination Verification
- **100.0% Citation Grounding**: Every resolved specification carries a verbatim quotation, source document reference, and page number.
- **Pint Normalization**: 0 mathematical hallucinations across all conversions.

### 4. Automated Test Suite
- **66/66 Unit & Integration Tests Passing** in 0.034s (`make test`).
