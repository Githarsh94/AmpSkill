// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*` // Your backend API URL
            }
        ];
    }
};

export default nextConfig;