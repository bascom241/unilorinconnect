import {create} from 'zustand';
import { axiosInstance } from '../lib/utils';


export const useResources = create((set)=> ({
    resources: [],
    fetchResources: async () => {
        try {
            const response = await axiosInstance.get('/resources');
            set({ resources: response.data.resources });
            console.log("Resources fetched successfully:", response.data.resources);
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    },
    addResource: async (resourceData) => {
        try {
            const response = await axiosInstance.post('/resources', resourceData);
            set((state) => ({
                resources: [...state.resources, response.data.resource]
            }));
            return true;
        } catch (error) {
            console.error("Error adding resource:", error);
            return false;
        }
    },
    fetchMyResources: async () => {
        try {
            const response = await axiosInstance.get('/resources/my');
            set({ resources: response.data.resources });
            console.log("My resources fetched successfully:", response.data.resources);
        } catch (error) {
            console.error("Error fetching my resources:", error);
        }
    }
    
}));

