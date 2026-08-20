import type { AuthenticationMode } from "@/features/auth/types/credentials.types";
import { useState } from "react";

export function useAuthMode(

){
    const [mode, setAuthMode] = useState<AuthenticationMode>('signingIn')

    return{
        mode,
        setSignInMode: () => setAuthMode('signingIn'),
        setSignUpMode: () => setAuthMode('signingUp')   
    }
    
}