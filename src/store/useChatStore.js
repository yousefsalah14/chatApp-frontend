import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { use } from "react";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set,get)=>({
    messages :[],
    users :[],
    selectedUser :null,
    isUsersLoading: false ,
    isMessagesLoading: false ,

    getUsers:async()=>{
        set({isUsersLoading : true})
        try {
            const {data} = await axiosInstance.get("/message/users")
            set({users : data.users})
            
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading :false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading : true})
        try {
            const {data} = await axiosInstance.get(`/message/${userId}`)
            set({messages : data.messages})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading :false})
        }
    },
    setSelectedUser : async(selectedUser)=>{
        //TODO
        set({selectedUser})
    },
    subscribeToMessages : async()=>{
        const socket = useAuthStore.getState().socket
        const{selectedUser} = get()
        if(!selectedUser) return;
        socket.on("newMessage", (newMessage) => {

            
            if(newMessage.sender !== selectedUser._id) return
            set({ messages: [...get().messages, newMessage] });    
        });
    },
    unsubscribeFromMessages : async()=>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },
    sendMessage : async (text, img) => {
        const formData = new FormData();
        formData.append("text", text);
        if (img) formData.append("img", img); // Use 'file' to match backend key
    
        try {
            const { selectedUser, messages } = get();
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true, // Required if using cookies/session-based auth
            });
    
            set({ messages: [...messages, res.data.newMessage] });
            console.log(formData);
             // Fix: Use res.data.message
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },


    

}))