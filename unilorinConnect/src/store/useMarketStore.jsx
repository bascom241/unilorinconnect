import { create } from "zustand"
import { axiosInstance } from "../lib/utils"
import toast from "react-hot-toast";


export const marketStore = create((set) => ({
    creatingItem: false,
    itemList: [],
    fetchingItems: false,
    topThreeList: [],


    createItem: async (formData) => {
        set({ creatingItem: true })
        try {
            const response = await axiosInstance.post("/item", formData);
            toast.success(response.data.message);
            set({ creatingItem: false })
            console.log(response);
            return true
        } catch (error) {
            console.log(error)
            set({ creatingItem: false })
            toast.error(error.message);
            return false
        } finally {
            set({ creatingItem: false });
            return
        }
    },
    fetchItems: async (params = {}) => {
        set({ fetchingItems: false });
        try {

            const query = new URLSearchParams();

            if (params.search) query.append("search", params.search);
            if (params.category) query.append('category', params.category);
            if (params.condition) query.append('condition', params.condition);
            if (params.sort) query.append('sort', params.sort);

            query.append('page', params.page || 1);
            query.append('limit', params.limit || 10);

            const response = await axiosInstance.get(`/items?${query.toString()}`);
            set({ itemList: response.data.items });
            console.log(response.data.items)
            set({ fetchingItems: false })
        } catch (error) {
            toast.error("Failed To fetch Items");
            console.log(error.message);
        }
    }, 

    fetchTopThreeItems: async () => {
        try {
            const response = await axiosInstance.get("/items/top-three");
            set({ topThreeList: response.data.marketItems });
            console.log(response.data.marketItems);
        } catch (error) {
            toast.error("Failed To fetch Top Three Items");
            console.log(error.message);
        }
    }
    
}))