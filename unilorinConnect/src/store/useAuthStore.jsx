import { create } from 'zustand';
import { axiosInstance } from "../lib/utils";
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const BASE_URL = "https://unilorinconnectserver.onrender.com"
export const authStore = create((set, get) => ({
  creatingUser: false,
  isUserCreated: false,
  logginUser: false,
  isUserLoggedIn: false,
  user: null,
  checkingAuth: true, // Start as true so App shows loader until checked
  socket: null,
  onlineUsers: [],
  verifyingEmail: false,

  register: async (userData) => {
    set({ creatingUser: true, isUserCreated: false });
    try {
      const response = await axiosInstance.post('/users/register', userData);
      set({
        creatingUser: false,
        isUserCreated: true,
        user: response.data.user,
      });
      get().connectSocket()
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      set({ creatingUser: false, isUserCreated: false });
      return false;
    }
  },
  verifyEmail: async (code) => {
    set({ verifyingEmail: true });
    try {
      const response = await axiosInstance.post("/users/verify-email", { code });
      console.log(response);
      set({ verifyingEmail: false });
      return true;
    } catch (error) {
      console.log(error)
      set({ verifyingEmail: false })
      return false;
    }
  },


  login: async (userData, navigate) => {
    set({ logginUser: true, isUserLoggedIn: false });
    console.log(userData)
    try {
      const response = await axiosInstance.post("/users/login", userData);
      set({
        logginUser: false,
        isUserLoggedIn: true,
        user: response.data.user,
      });

      get().connectSocket()
      toast.success("Login successful!");
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      set({ logginUser: false });
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/users/check-auth", {}, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        }
      });
      console.log("hi")
      get().connectSocket();
      set({
        user: response.data.user,
        isUserLoggedIn: true,
        checkingAuth: false,
      });


      console.log("Auth check:", response.data.user);
    } catch (error) {
      console.error("Auth check error:", error);
      set({ user: null, isUserLoggedIn: false, checkingAuth: false });
    }
  },
  userProfile: async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      console.log("User profile response:", response.data);
      set({ user: response.data });
      console.log("User profile:", response.data.user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch user profile.");
    }
  },

  logout: async (navigate) => {
    try {
      const response = await axiosInstance.get("/users/logout");
      //  toast.success(response.data);
      toast.success("You have been logged Out")
      get().disconnectSocket()
      console.log(response)
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
  },
  connectSocket: () => {

    const { user } = get();
    if (!user || get().socket?.connected) return
    const socket = io(BASE_URL, {
      query: {
        userId: user._id
      }
    });
    set({ socket: socket })
    socket.connect();

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })

  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect()
  }

}));
