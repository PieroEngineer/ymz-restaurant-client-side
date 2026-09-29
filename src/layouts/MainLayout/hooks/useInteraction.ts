import { useState } from "react";


export const useInteraction = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return {
        isSidebarOpen,

        toggleSidebar
    }
}