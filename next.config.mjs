/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**"
            }
        ]
    },
    async headers() {
        return [
            {
                source: "/login",
                headers: [
                    {
                        key: "Referrer-Policy",
                        value: "no-referrer-when-downgrade"
                    }
                ]
            }
        ]
    }
};

export default nextConfig;
