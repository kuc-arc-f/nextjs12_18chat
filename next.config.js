/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['pages/', 'components/']
  },
  env: {
    APP_NAME: "ChatApp",
    MAX_USER_LIMIT: 5,
    COOKIE_KEY_USER_ID: "uid_chat2022",
    CSRF_SECRET: "secret1234",
    MY_API_URL : "http://localhost:4000",
    MY_MAX_USER: 3,
  },  
}

module.exports = nextConfig
