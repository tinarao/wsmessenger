export const getLocalUrl = () => {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000"
    } else {
        return "https://wsmessenger.vercel.app"
    }
}