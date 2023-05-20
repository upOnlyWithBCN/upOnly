/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL_DEV: 'http://localhost:3000',
        BASE_URL_PROD: 'http://localhost:3000',
    },
}

module.exports = nextConfig
