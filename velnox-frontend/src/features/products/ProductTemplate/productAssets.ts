// Product-specific images per slug
export const PRODUCT_IMAGES: Record<string, string[]> = {
    'buq-207-104-2x3h': [
        '/velnox/images/products/buq-207-104-2x3h/main.png',
        '/velnox/images/products/buq-207-104-2x3h/drawing-1.png',
        '/velnox/images/products/buq-207-104-2x3h/drawing-2.png',
        '/velnox/images/products/buq-207-104-2x3h/drawing-3.png',
    ],
    'buq-207-106-2x3h': [
        '/velnox/images/products/buq-207-106-2x3h/main.png',
        '/velnox/images/products/buq-207-106-2x3h/drawing-1.png',
        '/velnox/images/products/buq-207-106-2x3h/drawing-2.png',
        '/velnox/images/products/buq-207-106-2x3h/drawing-3.png',
    ],
    'buq-207-2x3h': [
        '/velnox/images/products/buq-207-2x3h/main.png',
        '/velnox/images/products/buq-207-2x3h/drawing-1.png',
        '/velnox/images/products/buq-207-2x3h/drawing-2.png',
        '/velnox/images/products/buq-207-2x3h/drawing-3.png',
        '/velnox/images/products/buq-207-2x3h/schema.png',
    ],
    'buq-208-108-2x3h': [
        '/velnox/images/products/buq-208-108-2x3h/main.png',
        '/velnox/images/products/buq-208-108-2x3h/drawing-1.png',
        '/velnox/images/products/buq-208-108-2x3h/drawing-2.png',
        '/velnox/images/products/buq-208-108-2x3h/drawing-3.png',
        '/velnox/images/products/buq-208-108-2x3h/schema.png',
    ],
    'buq-208-2x3h': [
        '/velnox/images/products/buq-208-2x3h/main.png',
        '/velnox/images/products/buq-208-2x3h/drawing-1.png',
        '/velnox/images/products/buq-208-2x3h/drawing-2.png',
        '/velnox/images/products/buq-208-2x3h/drawing-3.png',
        '/velnox/images/products/buq-208-2x3h/schema.png',
    ],
    'buq-209-2t3h': [
        '/velnox/images/products/buq-209-2t3h/main.png',
        '/velnox/images/products/buq-209-2t3h/drawing-1.png',
        '/velnox/images/products/buq-209-2t3h/drawing-2.png',
        '/velnox/images/products/buq-209-2t3h/schema.png',
    ],
    'buq-210-2x3h': [
        '/velnox/images/products/buq-210-2x3h/main.png',
        '/velnox/images/products/buq-210-2x3h/drawing-1.png',
        '/velnox/images/products/buq-210-2x3h/drawing-2.png',
        '/velnox/images/products/buq-210-2x3h/drawing-3.png',
        '/velnox/images/products/buq-210-2x3h/schema.png',
    ],
    'buq-214-2t3h': [
        '/velnox/images/products/buq-214-2t3h/main.png',
        '/velnox/images/products/buq-214-2t3h/drawing-1.png',
        '/velnox/images/products/buq-214-2t3h/drawing-2.png',
        '/velnox/images/products/buq-214-2t3h/drawing-3.png',
    ],
    'buq-308-2t3h-ds': [
        '/velnox/images/products/buq-308-2t3h-ds/main.png',
        '/velnox/images/products/buq-308-2t3h-ds/overview.png',
        '/velnox/images/products/buq-308-2t3h-ds/drawing-1.png',
        '/velnox/images/products/buq-308-2t3h-ds/drawing-2.png',
        '/velnox/images/products/buq-308-2t3h-ds/drawing-3.png',
    ],
    'buq-309-2t3h': [
        '/velnox/images/products/buq-309-2t3h/main.png',
        '/velnox/images/products/buq-309-2t3h/drawing-1.png',
        '/velnox/images/products/buq-309-2t3h/drawing-2.png',
        '/velnox/images/products/buq-309-2t3h/drawing-3.png',
    ],
    'bucr-sg-309-s2': [
        '/velnox/images/products/bucr-sg-309-s2/main.png',
        '/velnox/images/products/bucr-sg-309-s2/drawing-1.png',
        '/velnox/images/products/bucr-sg-309-s2/drawing-2.png',
        '/velnox/images/products/bucr-sg-309-s2/drawing-3.png',
        '/velnox/images/products/bucr-sg-309-s2/schema.png',
    ],
    'bup-207-x3l': [
        '/velnox/images/products/bup-207-x3l/main.png',
        '/velnox/images/products/bup-207-x3l/drawing-1.png',
        '/velnox/images/products/bup-207-x3l/drawing-2.png',
        '/velnox/images/products/bup-207-x3l/drawing-3.png',
        '/velnox/images/products/bup-207-x3l/schema.png',
    ],
    // ── Hubs ──────────────────────────────────────────────────────────────
    '28071300-VX': [
        '/velnox/images/products/28071300-vx/main.png',
        '/velnox/images/products/28071300-vx/drawing-1.png',
        '/velnox/images/products/28071300-vx/drawing-2.png',
        '/velnox/images/products/28071300-vx/drawing-3.png',
        '/velnox/images/products/28071300-vx/schema.png',
    ],
};

// 3D GLB models per slug
export const PRODUCT_3D: Record<string, { file: string; sizeMb: string }> = {
    'buq-309-2t3h':   { file: '/velnox/models/BUQ-309-2T3H.glb',   sizeMb: '10' },
    'bucr-sg-309-s2': { file: '/velnox/models/BUCR-SG-309-S2.glb',  sizeMb: '8'  },
    'bup-207-x3l':    { file: '/velnox/models/BUP-207-X3L.glb',     sizeMb: '11' },
};

// Shared images per table_group (all products in same table share assets)
export const TABLE_GROUP_IMAGES: Record<string, string[]> = {
    'bearings-t1': [
        '/velnox/images/products/_shared/bearings-t1/main.jpeg',
        '/velnox/images/products/_shared/bearings-t1/drawing-1.png',
        '/velnox/images/products/_shared/bearings-t1/drawing-2.png',
        '/velnox/images/products/_shared/bearings-t1/drawing-3.png',
        '/velnox/images/products/_shared/bearings-t1/schema.png',
    ],
    'bearings-t2': [
        '/velnox/images/products/_shared/bearings-t2/main.jpeg',
        '/velnox/images/products/_shared/bearings-t2/drawing-1.png',
        '/velnox/images/products/_shared/bearings-t2/drawing-2.png',
        '/velnox/images/products/_shared/bearings-t2/drawing-3.png',
        '/velnox/images/products/_shared/bearings-t2/schema.png',
    ],
    'bearings-t3': [
        '/velnox/images/products/_shared/bearings-t3/main.jpeg',
        '/velnox/images/products/_shared/bearings-t3/drawing-1.png',
        '/velnox/images/products/_shared/bearings-t3/drawing-2.png',
        '/velnox/images/products/_shared/bearings-t3/drawing-3.png',
        '/velnox/images/products/_shared/bearings-t3/schema.png',
    ],
    'bearings-t4': [
        '/velnox/images/products/_shared/bearings-t4/main.jpeg',
        '/velnox/images/products/_shared/bearings-t4/drawing-1.png',
        '/velnox/images/products/_shared/bearings-t4/drawing-2.png',
        '/velnox/images/products/_shared/bearings-t4/schema.png',
    ],
    'bearings-t5': [
        '/velnox/images/products/_shared/bearings-t5/main.jpeg',
        '/velnox/images/products/_shared/bearings-t5/drawing-1.png',
        '/velnox/images/products/_shared/bearings-t5/drawing-2.png',
        '/velnox/images/products/_shared/bearings-t5/drawing-3.png',
        '/velnox/images/products/_shared/bearings-t5/schema.png',
    ],
    'hubs-t1': [
        '/velnox/images/products/_shared/hubs-t1/main.jpeg',
        '/velnox/images/products/_shared/hubs-t1/drawing-1.png',
        '/velnox/images/products/_shared/hubs-t1/drawing-2.png',
        '/velnox/images/products/_shared/hubs-t1/drawing-3.png',
        '/velnox/images/products/_shared/hubs-t1/schema.png',
    ],
};

// Slug → table_group mapping (used until API returns table_group directly)
const SLUG_TO_TABLE_GROUP: Record<string, string> = {
    // bearings-t1: BUQ standard 2xx series
    'buq-207-104-2x3h': 'bearings-t1',
    'buq-207-106-2x3h': 'bearings-t1',
    'buq-207-2x3h':     'bearings-t1',
    'buq-208-108-2x3h': 'bearings-t1',
    'buq-208-2x3h':     'bearings-t1',
    'buq-209-2t3h':     'bearings-t1',
    'buq-210-2x3h':     'bearings-t1',
    'buq-214-2t3h':     'bearings-t1',
    // bearings-t2: BUQ-308-2T3H-DS
    'buq-308-2t3h-ds':  'bearings-t2',
    // bearings-t3: BUQ-309-2T3H
    'buq-309-2t3h':     'bearings-t3',
    // bearings-t4: BUCR-SG-309-S2
    'bucr-sg-309-s2':   'bearings-t4',
    // bearings-t5: BUP-207-X3L
    'bup-207-x3l':      'bearings-t5',
    // hubs-t1
    '28071300-vx':      'hubs-t1',
};

// Fallback galleries
const BUQ_FALLBACK = [
    '/velnox/images/products/buq-bearing-photo.png',
    '/velnox/images/products/buq-drawing-1.png',
    '/velnox/images/products/buq-drawing-2.png',
    '/velnox/images/products/buq-drawing-3.png',
];
const DEFAULT_FALLBACK = [
    '/velnox/images/products/bearing-photo-1.webp',
    '/velnox/images/products/bearing-photo-2.webp',
];

export function getProductImages(slug: string, article: string, tableGroup?: string | null): string[] {
    const tg = tableGroup ?? SLUG_TO_TABLE_GROUP[slug];
    if (tg && TABLE_GROUP_IMAGES[tg]) return TABLE_GROUP_IMAGES[tg];
    if (PRODUCT_IMAGES[slug]) return PRODUCT_IMAGES[slug];
    if (article.toUpperCase().startsWith('BUQ')) return BUQ_FALLBACK;
    return DEFAULT_FALLBACK;
}
