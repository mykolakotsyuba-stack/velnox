import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/lib/i18n.ts');

// On the shared dev server VELNOX is served under the /velnox sub-path.
// On the dedicated prod server (velnox.eu) it is served at the domain root.
// Toggle via DEPLOY_TARGET=prod at build time. Default keeps dev behaviour.
const isProd = process.env.DEPLOY_TARGET === 'prod';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    basePath: isProd ? '' : '/velnox',
    assetPrefix: isProd ? undefined : '/velnox',
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
            },
            {
                protocol: 'http',
                hostname: 'mx.irbis.ua',
            },
            {
                protocol: 'https',
                hostname: 'velnox.eu',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withNextIntl(nextConfig);
