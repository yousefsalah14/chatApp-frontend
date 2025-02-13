import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";
const BASE_URL =import.meta.env.MODE === "development" ? "http://localhost:3000" :"https://chat-app-backend-wheat-phi.vercel.app";
// it is a global state management -> we use it here like context
export const useAuthStore = create((set ,get)=>({ // this obj has a initial value
authUser : null,
isCheckingAuth : true , //loading 
isSigningUp : false ,
isLoggining : false ,
isUpdatedingProfile : false,
onlineUsers:[],
socket : null,
checkAuth : async()=>{
    try {
        const res = await axiosInstance.get("/auth/user")
        set({authUser : res.data})
        console.log(res.data);
        
        get().connectSocket();
    } catch (error) {
        console.log(error)
    }finally{
        set({isCheckingAuth:false})
    }
},
signup: async(data)=>{
    set({isSigningUp : true})
    try {
        const res = await axiosInstance.post('/auth/signup',data)
        set({authUser : res.data})
        toast.success("Account Created Successfully")
        get().connectSocket();
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
    }finally{
        set({isSigningUp:false})
    }
},
logout : async()=>{
    try {
    await axiosInstance.post("/auth/logout")
    set({authUser : null})
    toast.success("Logged Out Successfully")
    get().diaconnectSocket();
        
    } catch (error) {
        toast.error(error.response?.data.message)
    }
},
login: async (data) => {
    try {
        set({ isLoggingIn: true });
        const res = await axiosInstance.post('/auth/login', data);
        set({ authUser: res.data });
        toast.success("Logged In Successfully");
        get().connectSocket();
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);


    } finally {
        set({ isLoggingIn: false });
    }
},

updateProfilePic :async(data)=>{
    set({isUpdatedingProfile : true})
    try {
        const formData = new FormData();
        formData.append("profilePic", data);
    const res =await axiosInstance.patch('/auth/updatePic',formData)
    set({authUser : res.data})
    toast.success("profile picture updated successfully")
    console.log(res.data);
    
        
    } catch (error) {
        toast.error(error.response.data.message)
        
    }finally{
        set({isUpdatedingProfile : false})
    }
},
connectSocket: async () => {
        const { authUser } = get();
        
        // Ensure authUser is valid
        if (!authUser || !authUser.user || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
            query: {
                userId: authUser.user._id, // ✅ Now safe
            }
        });
    socket.on("connect")
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers : userIds });
    })
},
diaconnectSocket: async () => {
    if(get().socket?.connected){
        get().socket?.disconnect();
        set({ socket: null}); // Clear online users on disconnect
    }
    
}
}))