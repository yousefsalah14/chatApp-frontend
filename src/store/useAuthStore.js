import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = "http://localhost:3000";

// Global state management (like context)
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true, // Loading state
    isSigningUp: false,
    isLoggingIn: false, // ✅ Fixed typo
    isUpdatingProfile: false, // ✅ Fixed typo
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/user");
            set({ authUser: res.data });
            console.log(res.data);

            get().connectSocket();
        } catch (error) {
            console.log(error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
            console.log(error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged Out Successfully");
            get().disconnectSocket(); // ✅ Fixed typo
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfilePic: async (data) => {
        set({ isUpdatingProfile: true }); // ✅ Fixed typo
        try {
            const formData = new FormData();
            formData.append("profilePic", data);
            const res = await axiosInstance.patch("/auth/updatePic", formData);
            set({ authUser: res.data });
            toast.success("Profile picture updated successfully");
            console.log(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile picture");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser, socket } = get();
        if (!authUser?.user || socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: { userId: authUser.user._id },
        });

        newSocket.on("connect", () => console.log("Socket connected!")); // ✅ Corrected
        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: async () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] }); // ✅ Clear online users on disconnect
        }
    },
}));
