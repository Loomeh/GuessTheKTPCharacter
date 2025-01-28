/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL,
  }
}

module.exports = nextConfig