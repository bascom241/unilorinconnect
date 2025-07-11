import { axiosInstance } from "../lib/utils";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useLostAndFound = create((set) => ({
  lostAndFoundItems: [],
  creatingLostAndFoundItem: false,
  loadingLostAndFoundItems: false,
  fetchLostAndFoundItems: async () => {
    try {
      const response = await axiosInstance.get("/items-lost");
      set({ lostAndFoundItems: response.data.data });
        console.log("Lost and Found items fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching lost and found items:", error);
    }
  },
  createLostAndFoundItem: async (itemData) => {
    set({ creatingLostAndFoundItem: true });
    try {
      const response = await axiosInstance.post("/item-lost", itemData);
      set((state) => ({
        lostAndFoundItems: [response.data.data, ...state.lostAndFoundItems],
      }));
      toast.success("Lost and Found item created successfully!");
      set({ creatingLostAndFoundItem: false });
      return true;
      
    } catch (error) {
      console.error("Error creating lost and found item:", error);
      toast.error("Failed to create Lost and Found item.");
      set({ creatingLostAndFoundItem: false });
      return false;
    }
  },
  getMyLostAndFoundItems: async () => {
    try {
      const response = await axiosInstance.get("/my-items-lost");
      set({ lostAndFoundItems: response.data.data });
      console.log("User's Lost and Found items fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user's Lost and Found items:", error);
    }
  }
}));
