import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
 function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 const axiosInstance = axios.create({
  baseURL:"https://unilorinconnectserver.onrender.com/api",
  withCredentials: true,
});


export { cn, axiosInstance }


