import axios from "axios";
export const axiosInstance = axios.create({
    url: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://chat-app-backend-wheat-phi.vercel.app/api",
    withCredentials :true , // to send cookie to every single request 
})
