/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL_DEV: 'http://localhost:3000',
        BASE_URL_PROD: 'https://up-only.vercel.app/',
    },
}

module.exports = nextConfig
