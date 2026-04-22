// SVG blueprint config per product slug.
// When adding a new product: copy the right key set (short or long)
// and map to the correct SVG + viewBox.

export interface DimLabel {
    key: string;         // spec key in product.specs
    label: string;       // letter shown in the SVG
    point: { x: number; y: number }; // center of circle in SVG user units
}

export interface BlueprintConfig {
    svgSrc: string;
    viewBox: string;
    aspectW: number;
    aspectH: number;
    dimLabels: DimLabel[];
}

// ── BUQ series — short spec keys (d_mm, J, L, A, A1, A2, N) ─────────────────
const BUQ_SHORT_LABELS: DimLabel[] = [
    { key: 'N',      label: 'N',  point: { x: 1074.8, y: -13798.5 } },
    { key: 'A',      label: 'A',  point: { x: 1254.4, y: -13759.2 } },
    { key: 'd_mm',   label: 'd',  point: { x: 1838.0, y: -13487.1 } },
    { key: 'd_inch', label: 'd',  point: { x: 1838.0, y: -13487.1 } },
    { key: 'J',      label: 'J',  point: { x: 1261.7, y: -13226.6 } },
    { key: 'A2',     label: 'A2', point: { x: 1565.3, y: -13233.1 } },
    { key: 'A1',     label: 'A1', point: { x: 1674.6, y: -13197.0 } },
    { key: 'L',      label: 'L',  point: { x: 1265.6, y: -13175.7 } },
    { key: 'A',      label: 'A',  point: { x: 1266.0, y: -13135.3 } },
    { key: 'A',      label: 'A',  point: { x: 1708.6, y: -13157.1 } },
];

// ── BUQ series — long spec keys (bore_diameter_d_mm, etc.) ──────────────────
const BUQ_LONG_LABELS: DimLabel[] = [
    { key: 'bore_diameter_d_mm',             label: 'd',  point: { x: 1838.0, y: -13487.1 } },
    { key: 'distance_between_holes_j_mm',    label: 'J',  point: { x: 1261.7, y: -13226.6 } },
    { key: 'housing_flange_thickness_a2_mm', label: 'A2', point: { x: 1565.3, y: -13233.1 } },
    { key: 'total_housing_width_a1_mm',      label: 'A1', point: { x: 1674.6, y: -13197.0 } },
    { key: 'total_length_l_mm',              label: 'L',  point: { x: 1265.6, y: -13175.7 } },
    { key: 'overall_width_a_mm',             label: 'A',  point: { x: 1254.4, y: -13759.2 } },
    { key: 'overall_width_a_mm',             label: 'A',  point: { x: 1266.0, y: -13135.3 } },
    { key: 'overall_width_a_mm',             label: 'A',  point: { x: 1708.6, y: -13157.1 } },
];

const BUQ_SVG: Pick<BlueprintConfig, 'svgSrc' | 'viewBox' | 'aspectW' | 'aspectH'> = {
    svgSrc:  '/velnox/images/schemes/bearings-schema.svg',
    viewBox: '892 -13810 1480 720',
    aspectW: 1480,
    aspectH: 720,
};

// ── Schema-key based config (DB-driven — schema_key from API) ────────────────
export const SCHEMA_CONFIG: Record<string, BlueprintConfig> = {
    'buq-2xx-square': { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-308':        { ...BUQ_SVG, dimLabels: BUQ_LONG_LABELS },
    'buq-309-round':  { ...BUQ_SVG, dimLabels: BUQ_LONG_LABELS },
};

// ── Slug-based fallback (legacy, used when schema_key not yet in DB) ──────────
export const BLUEPRINT_MAP: Record<string, BlueprintConfig> = {
    // ── BUQ 2xx series (old seeder — short keys) ──────────────────────────────
    'buq-207-104-2x3h': { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-207-106-2x3h': { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-207-2x3h':     { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-208-108-2x3h': { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-208-2x3h':     { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-209-2t3h':     { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-210-2x3h':     { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },
    'buq-214-2t3h':     { ...BUQ_SVG, dimLabels: BUQ_SHORT_LABELS },

    // ── BUQ 3xx series (new seeder — long keys) ───────────────────────────────
    'buq-308-2t3h-ds':  { ...BUQ_SVG, dimLabels: BUQ_LONG_LABELS },
    'buq-309-2t3h':     { ...BUQ_SVG, dimLabels: BUQ_LONG_LABELS },
};
