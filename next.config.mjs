/** @type {import('next').NextConfig} */
const nextConfig = {
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
