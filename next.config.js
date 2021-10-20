/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
module.exports = withPWA({
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		})

		return config
	},
	target: "serverless",
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === "development",
	},
})
