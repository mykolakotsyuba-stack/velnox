/**
 * Table-based asset registry — ЄДИНЕ ДЖЕРЕЛО ПРАВДИ для схем, галерей, 3D моделей.
 *
 * ╔═══════════════════════════════════════════════════════════════════════╗
 * ║  ПРАВИЛА ДЛЯ НОВИХ КАРТОК І ТАБЛИЦЬ                                  ║
 * ║                                                                       ║
 * ║  1. SVG-схема: public/images/schemes/{cat}-t{N}-schema.svg            ║
 * ║     (тільки ця папка rsync'ується при деплої)                         ║
 * ║                                                                       ║
 * ║  2. WebP галерея: public/images/products/_shared/{cat}-t{N}/         ║
 * ║     main.webp, drawing-1..3.webp, schema.webp (PNG fallback)         ║
 * ║                                                                       ║
 * ║  3. schemaSize = розміри viewBox SVG (w×h з бокового скрипта)        ║
 * ║                                                                       ║
 * ║  4. markers = % координати літер на схемі (з Python-скрипту)         ║
 * ║     Скрипт: /tmp/extract_coords.py (витягує з CorelDRAW SVG)         ║
 * ║                                                                       ║
 * ║  5. Продукт зберігає лише category_id + table_group + свої specs.    ║
 * ║     Всі assets автоматично підтягуються з цього файлу.               ║
 * ╚═══════════════════════════════════════════════════════════════════════╝
 */

export interface SpecMarker {
    x: number; // 0–100 % від ширини контейнера
    y: number; // 0–100 % від висоти контейнера
}

/** Zoom config for CSS absolute-positioned img overlay.
 *  img is positioned: absolute; width=wRatio×W; height=hRatio×H; top=topRatio×H
 *  Marker transform: wrapperX = svgX × wRatio
 *                   wrapperY = (topRatio + (hRatio-wRatio)/2) × 100 + svgY × wRatio
 */
export interface ImgZoom {
    wRatio: number;   // img width as fraction of wrapper width (e.g. 1.07)
    hRatio: number;   // img height as fraction of wrapper height (e.g. 2.66)
    topRatio: number; // img top offset as fraction of wrapper height (e.g. -0.70)
}

export interface TableAssets {
    schema?: string;
    /** w × h = viewBox SVG — задає aspect-ratio враппера */
    schemaSize?: { w: number; h: number };
    /** CSS zoom for portrait SVGs in landscape wrapper */
    imgZoom?: ImgZoom;
    gallery?: string[];
    /** spec-key → позиція літери на схемі (% від schemaSize) */
    markers?: Record<string, SpecMarker>;
    hasData: boolean;
}

const shared = (cat: string, t: number) => `/velnox/images/products/_shared/${cat}-t${t}`;
const svgSchema = (group: string) => `/velnox/images/schemes/${group}-schema.svg`;

const filledTable = (cat: string, t: number, gallerySize = 3): TableAssets => {
    const b = shared(cat, t);
    const gallery = [`${b}/main.webp`];
    for (let i = 1; i <= gallerySize; i++) gallery.push(`${b}/drawing-${i}.webp`);
    return { schema: `${b}/schema.webp`, gallery, hasData: true };
};

const emptyTable: TableAssets = { hasData: false };

export const TABLE_ASSETS: Record<string, TableAssets> = {

    // ════════════════════════════════════════════════════════════
    //  BEARINGS
    // ════════════════════════════════════════════════════════════

    'bearings-t1': {
        ...filledTable('bearings', 1),
        schema: svgSchema('bearings-t1'),
        // viewBox "160 910 2270 1060" — auto-computed: paths + image + labels, aspect 2.142
        schemaSize: { w: 2270, h: 1060 },
        markers: {
            // Auto-computed: label center → % of viewBox
            d_mm: { x: 51.1, y: 47.7 }, // 'd'
            J:    { x: 17.3, y: 82.9 }, // 'J'
            L:    { x: 17.5, y: 87.4 }, // 'L'
            A:    { x: 43.9, y: 90.4 }, // 'A'
            A1:   { x: 42.6, y: 86.7 }, // 'A1'
            A2:   { x: 39.9, y: 82.7 }, // 'A2'
            N:    { x:  5.0, y:  7.4 }, // 'N'
        },
    },

    'bearings-t2': {
        ...filledTable('bearings', 2),
        schema: svgSchema('bearings-t2'),
        schemaSize: { w: 1250, h: 950 }, // viewBox "100 620 1250 950" — cropped to drawing area
        markers: {
            // Coords recalculated for cropped viewBox (vx=100, vy=620, vw=1250, vh=950)
            bore_diameter_d_mm:             { x: 76.0, y: 47.3 }, // 'd'
            total_housing_width_a1_mm:      { x: 64.4, y: 83.5 }, // 'A1'
            housing_flange_thickness_a2_mm: { x: 60.5, y: 78.6 }, // 'A2'
            overall_width_a_mm:             { x: 22.9, y: 87.2 }, // 'A'
            distance_between_holes_j_mm:    { x: 27.8, y: 78.6 }, // 'J'
            total_length_l_mm:              { x: 28.0, y: 83.0 }, // 'L'
            hole_thread_ht:                 { x: 11.9, y: 12.0 }, // 'H/T'
        },
    },

    'bearings-t3': {
        ...filledTable('bearings', 3),
        schema: svgSchema('bearings-t3'),
        // viewBox "95 1694 2243 1204" — full drawing incl. right detail view, aspect 1.863
        schemaSize: { w: 2243, h: 1204 },
        markers: {
            // Coords for viewBox 95 1694 2243 1204, font 41.66px Helvetica
            bore_diameter_d_mm:             { x: 41.0, y: 58.7 }, // 'd'
            distance_between_holes_j_mm:    { x: 15.2, y: 81.8 }, // 'J'
            total_length_l_mm:              { x: 15.2, y: 84.8 }, // 'L'
            overall_width_a_mm:             { x: 12.3, y: 88.4 }, // 'A'
            total_housing_width_a1_mm:      { x: 34.7, y: 85.4 }, // 'A1'
            housing_flange_thickness_a2_mm: { x: 32.6, y: 82.0 }, // 'A2'
            hole_thread_ht_mm:              { x:  6.6, y: 32.3 }, // 'H/T'
            width_inner_ring_b_mm:          { x: 48.8, y: 35.9 }, // 'B'
        },
    },

    'bearings-t4': {
        ...filledTable('bearings', 4, 2),
        schema: svgSchema('bearings-t4'),
        // viewBox "-63 322 2776 1508" — BUCR-SG-309-S2, covers image+transforms, aspect 1.841
        schemaSize: { w: 2776, h: 1508 },
        markers: {
            // Coords for viewBox -63 322 2776 1508, font 41.66px Helvetica
            bore_diameter_d_mm:                   { x: 44.3, y: 45.2 }, // 'd'
            centering_diameter_d1_mm:             { x: 56.7, y: 45.2 }, // 'd1'
            distance_between_holes_j1_mm:         { x: 24.0, y: 72.6 }, // 'J1'
            distance_between_holes_j2_mm:         { x: 36.0, y: 26.7 }, // 'J2'
            housing_overall_width_l1_mm:          { x: 24.1, y: 75.9 }, // 'L1'
            housing_overall_width_l2_mm:          { x: 37.7, y: 23.5 }, // 'L2'
            overall_width_a_mm:                   { x: 51.0, y: 75.9 }, // 'A'
            flange_width_a1_mm:                   { x: 54.1, y: 72.8 }, // 'A1'
            flange_width_a2_mm:                   { x: 47.7, y: 70.8 }, // 'A2'
            centering_diameter_height_a3_mm:      { x: 47.7, y: 66.5 }, // 'A3'
            hole_diameter_h_mm:                   { x:  7.3, y: 45.5 }, // 'H'
            threaded_hole_size_t:                 { x: 11.0, y: 30.0 }, // 'T'
        },
    },

    'bearings-t5': {
        ...filledTable('bearings', 5),
        schema: svgSchema('bearings-t5'),
        // viewBox "75 1805 2304 877" — BUP-207, aspect 2.628
        schemaSize: { w: 2304, h: 877 },
        markers: {
            // Coords for viewBox 75 1805 2304 877, font 41.66px Helvetica
            bore_diameter_d_mm:             { x: 14.1, y: 44.1 }, // 'd'
            outside_diameter_d_mm:          { x: 29.7, y: 46.7 }, // 'D'
            pitch_circle_diameter_j_mm:     { x: 14.7, y: 81.4 }, // 'J'
            hole_thread_ht:                 { x: 43.5, y: 23.7 }, // 'H/T'
            overall_width_a_mm:             { x: 11.9, y:  7.8 }, // 'A'
            housing_flange_thickness_a2_mm: { x: 34.5, y: 79.1 }, // 'A2'
            width_inner_ring_b_mm:          { x: 37.8, y: 41.9 }, // 'B'
        },
    },

    // ════════════════════════════════════════════════════════════
    //  HUBS
    // ════════════════════════════════════════════════════════════

    'hubs-t1': {
        ...filledTable('hubs', 1),
        schema: svgSchema('hubs-t1'),
        schemaSize: { w: 2938, h: 1495 },
        markers: {
            // 28071300 VX: j_mm, D_mm, D1_mm, d_mm, C_mm, L_mm, L1_mm, F_mm
            D_mm:  { x: 34.1, y: 39.8 }, // 'D'
            j_mm:  { x: 52.9, y: 38.2 }, // 'J'
            L_mm:  { x: 20.2, y: 7.1  }, // 'L'
            L1_mm: { x: 24.1, y: 10.6 }, // 'L1'
        },
    },

    'hubs-t2': {
        ...filledTable('hubs', 2),
        schema: svgSchema('hubs-t2'),
        schemaSize: { w: 2492, h: 1042 },
        markers: {
            // BAA-0004 VX
            d_mm:  { x: 49.1, y: 53.1 }, // 'd'
            D1_mm: { x: 45.9, y: 53.4 }, // 'D1'
        },
    },

    'hubs-t3': {
        ...filledTable('hubs', 3),
        schema: svgSchema('hubs-t3'),
        schemaSize: { w: 3172, h: 1785 },
        markers: {
            // PL-140 VX
            d_mm: { x: 9.1,  y: 45.1 }, // 'd'
            D_mm: { x: 6.1,  y: 45.4 }, // 'D'
        },
    },

    // ════════════════════════════════════════════════════════════
    //  AGRO
    // ════════════════════════════════════════════════════════════

    'agro-t1': {
        ...filledTable('agro', 1),
        schema: svgSchema('agro-t1'),
        schemaSize: { w: 1982, h: 1223 },
        markers: {
            // 1726xxx-2RS1: DB keys d_mm, D_mm, B_mm, d1_mm
            d_mm:  { x: 66.1, y: 51.5 }, // 'd'
            D_mm:  { x: 50.5, y: 50.8 }, // 'D'
            B_mm:  { x: 56.7, y: 55.2 }, // 'B'
        },
    },

    'agro-t2': {
        ...filledTable('agro', 2),
        schema: svgSchema('agro-t2'),
        schemaSize: { w: 2024, h: 1207 },
        markers: {
            // DHU 1/2 R209
            'd (mm)':  { x: 20.9, y: 48.1 }, // 'd'
            'D (mm)':  { x: 50.7, y: 49.1 }, // 'D'
            'A (mm)':  { x: 58.4, y: 17.0 }, // 'A'
            'A1 (mm)': { x: 55.1, y: 21.1 }, // 'A1'
        },
    },

    'agro-t3': {
        ...filledTable('agro', 3, 4),
        schema: svgSchema('agro-t3'),
        schemaSize: { w: 2726, h: 1205 },
        markers: {
            // DHU 1/4 S209
            'd (mm)':  { x: 48.2, y: 39.8 }, // 'd'
            'D (mm)':  { x: 62.3, y: 41.7 }, // 'D'
            'D1 (mm)': { x: 60.5, y: 41.7 }, // 'D1'
            'J (mm)':  { x: 18.7, y: 40.6 }, // 'J'
            'A (mm)':  { x: 55.2, y: 76.7 }, // 'A'
            'C (mm)':  { x: 55.2, y: 72.7 }, // 'C'
        },
    },

    'agro-t4': emptyTable, // AA30941 — треба папку з файлами

    // ════════════════════════════════════════════════════════════
    //  KIT
    // ════════════════════════════════════════════════════════════

    'kit-t1': {
        ...filledTable('kit', 1),
        schema: svgSchema('kit-t1'),
        schemaSize: { w: 2288, h: 1255 },
        markers: {
            // kit-t1: d (mm), D (mm), B (mm), C (mm)
            'd (mm)': { x: 7.9,  y: 43.7 }, // 'd' bore
            'D (mm)': { x: 5.7,  y: 43.5 }, // 'D' outer
            'B (mm)': { x: 48.1, y: 71.4 }, // 'B'
            'C (mm)': { x: 47.9, y: 11.8 }, // 'C'
        },
    },

    'kit-t2':  emptyTable,
    'kit-t3':  emptyTable,

    'kit-t5': {
        ...filledTable('kit', 5),
        schema: svgSchema('kit-t5'),
        schemaSize: { w: 3167, h: 1668 },
        markers: {
            'd (mm)': { x: 9.2,  y: 43.9 }, // 'd'
            'D (mm)': { x: 5.6,  y: 44.0 }, // 'D'
            'B (mm)': { x: 52.1, y: 76.0 }, // 'B'
            'C (mm)': { x: 52.2, y: 10.9 }, // 'C'
            'A (mm)': { x: 30.4, y: 68.2 }, // 'A' (bottom)
        },
    },

    'kit-t6':  emptyTable,
    'kit-t7':  emptyTable,
    'kit-t8':  emptyTable,
    'kit-t9':  emptyTable,
    'kit-t10': emptyTable,
    'kit-t11': emptyTable,
    'kit-t12': emptyTable,
};

// ─────────────────────────────────────────────────────────────────────────────
//  PER-PRODUCT 3D MODELS (keyed by slug)
// ─────────────────────────────────────────────────────────────────────────────
export const PRODUCT_3D: Record<string, { file: string; sizeMb?: number }> = {
    // Bearings
    'buq-309-2t3h':       { file: '/velnox/models/BUQ-309-2T3H.glb' },
    'bucr-sg-309-s2':     { file: '/velnox/models/BUCR-SG-309-S2.glb' },
    'bup-207-x3l':        { file: '/velnox/models/BUP-207-X3L.glb' },

    // Hubs
    'baa-0004-vx-table2': { file: '/velnox/models/BAA-0004.glb' },
    'pl-140-vx-table3':   { file: '/velnox/models/PL-140.glb' },

    // Agro table 1 (7 products, each has own 3D)
    '1726206-2rs1-vx':    { file: '/velnox/models/1726206-2RS1.glb' },
    '1726207-2rs1-vx':    { file: '/velnox/models/1726207-2RS1.glb' },
    '1726208-2rs1-vx':    { file: '/velnox/models/1726208-2RS1.glb' },
    '1726209-2rs1-vx':    { file: '/velnox/models/1726209-2RS1.glb' },
    '1726210-2rs1-vx':    { file: '/velnox/models/1726210-2RS1.glb' },
    '1726306-2rs1-vx':    { file: '/velnox/models/1726306-2RS1.glb' },
    '1726309-2rs1-vx':    { file: '/velnox/models/1726309-2RS1.glb' },

    // Agro table 2 and 3
    'dhu-1-12r209-vx':    { file: '/velnox/models/DHU-1-12R209.glb' },
    'dhu-1-14s209-vx':    { file: '/velnox/models/DHU-1-14S209.glb' },

    // Kit table 1
    '203krr2-r3-vx-kit-t1':         { file: '/velnox/models/203-KRR2-R3.glb' },

    // Kit table 2
    '204py3-vx-kit-t2':              { file: '/velnox/models/204-PY3.glb' },

    // Kit table 3
    '5203kyy3-vx-kit-t3':            { file: '/velnox/models/5203-KYY3.glb' },

    // Kit table 5
    '5206kpp3-vx-kit-t5':            { file: '/velnox/models/5206-KPP3.glb' },

    // Kit table 6
    '885154b-vx-kit-t6':             { file: '/velnox/models/885154B.glb' },

    // Kit table 9
    'f-56202402klq-vx-kit-t9':        { file: '/velnox/models/F-562024-02-KLQ.glb' },

    // Kit table 10
    'gw212-kpp52-r-gx-vx-kit-t10':   { file: '/velnox/models/GW212KPP52-R-GX.glb' },

    // Kit table 11
    'w247647b-vx-kit-t11':           { file: '/velnox/models/W247647B.glb' },

    // Kit table 12
    '207krrb12-vx-kit-t12':          { file: '/velnox/models/207-KRRB12.glb' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export interface ResolvedProductAssets {
    schema?: string;
    schemaSize?: { w: number; h: number };
    imgZoom?: ImgZoom;
    gallery: string[];
    markers?: Record<string, SpecMarker>;
    model3d?: { file: string; sizeMb?: number };
    hasSchema: boolean;
    hasGallery: boolean;
    has3d: boolean;
}

const warned = new Set<string>();
const warnOnce = (key: string, msg: string) => {
    if (warned.has(key)) return;
    warned.add(key);
    if (typeof window !== 'undefined') console.warn(msg);
};

export function getProductAssets(
    slug: string,
    tableGroup: string | undefined | null,
): ResolvedProductAssets {
    const model3d = PRODUCT_3D[slug];
    const emptyResult: ResolvedProductAssets = {
        schema: undefined, gallery: [], model3d,
        hasSchema: false, hasGallery: false, has3d: !!model3d,
    };

    if (!tableGroup) {
        warnOnce(`no-group:${slug}`, `[tableAssets] Product "${slug}" has no table_group`);
        return emptyResult;
    }
    const t = TABLE_ASSETS[tableGroup];
    if (!t) {
        warnOnce(`unknown:${tableGroup}`, `[tableAssets] Unknown table_group "${tableGroup}" (product "${slug}")`);
        return emptyResult;
    }
    if (!t.hasData) {
        warnOnce(`empty:${tableGroup}`, `[tableAssets] Table "${tableGroup}" has no assets yet`);
        return emptyResult;
    }
    return {
        schema: t.schema, schemaSize: t.schemaSize, imgZoom: t.imgZoom,
        gallery: t.gallery ?? [], markers: t.markers, model3d,
        hasSchema: !!t.schema, hasGallery: (t.gallery?.length ?? 0) > 0, has3d: !!model3d,
    };
}

export function getTableAssets(tableGroup: string): TableAssets | null {
    const t = TABLE_ASSETS[tableGroup];
    if (!t) { warnOnce(`unknown:${tableGroup}`, `[tableAssets] Unknown table_group "${tableGroup}"`); return null; }
    if (!t.hasData) { warnOnce(`empty:${tableGroup}`, `[tableAssets] Table "${tableGroup}" has no assets yet`); return null; }
    return t;
}
