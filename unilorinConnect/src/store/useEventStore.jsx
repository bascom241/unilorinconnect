import { create } from "zustand";
import { axiosInstance } from "../lib/utils";
import toast from "react-hot-toast";



export const eventStore = create((set)=> ({
    creatingEvent:false,
    events:[],
    fetchingEvents:false,
    addingUsertoEvent:false,
    event:null,
    fetchingSingleEvent: false,
    topThreeEvents:[],

    createEvent: async(formData) => {
        set({creatingEvent:true})
        try {
            const response = await axiosInstance.post("/event", formData);
            console.log(response);
            toast.success(response.data.message);
            set({creatingEvent:false})
        } catch (error) {
            console.log(error);
            set({creatingEvent:false})
        }
    },
    fetchEvents:async(params={})=>{
        set({fetchingEvents:true})
        try {

            const query = new URLSearchParams();
            if(params.category) query.append("category", params.category);
            
            const response = await axiosInstance.get(`events?${query.toString()}`);
            console.log(response.data.events)
            set({fetchingEvents:false, events:response.data.events})
            
        } catch (error) {
            set({fetchingEvents:false});
            console.log(error);
        }
    },
    addUserToEvent:async(id) => {
        set({addingUsertoEvent:true})
        try {
            const response = await axiosInstance.post(`/event/${id}`);
            console.log(response);
            set({addingUsertoEvent:false});
            
        } catch (error) {
            console.log(error)
            set({addingUsertoEvent:false});
        }
    },
    fetchSingleEvent:async(id)=> {
           set({fetchingSingleEvent:true})
        try {
            const response = await axiosInstance.get(`/event/${id}`);
            console.log(response)
            set({fetchingSingleEvent:false,event:response.data.event})
        } catch (error) {
            console.log(error)
            set({fetchingSingleEvent:false})
        }
    },

    fetchTopThreeEvents:async() => {
        console.log("Fetching Top Three Events")
        try {
            console.log("Fetching Top Three Events")
            const response = await axiosInstance.get("/event");
            console.log(response.data.events);
            set({topThreeEvents:response.data.events})
        } catch (error) {
            console.log(error);
        }
    }

}))