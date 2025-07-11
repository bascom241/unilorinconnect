import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Layout from "@/components/Layout";
import { Loader } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Events from "@/pages/Events";
import Chat from "@/pages/Chat";
import Resources from "@/pages/Resources";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import LostFound from "@/pages/LostFound";
import NotFound from "@/pages/NotFound";
import VerifyEmail from "@/pages/VerifyEmail";

// Auth store
import { authStore } from "./store/useAuthStore";

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth, checkingAuth, user, onlineUsers} = authStore();


  console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin w-8 h-8 text-uniblue-500" />
      </div>
    );
  }




  return (

      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
       
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/events" element={<Events />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/lost-found" element={<LostFound />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>

  );
};

export default App;
