import type { Credentials } from "@/features/auth/types/credentials.types";
import { useState } from "react";


export function useCredentials(

){
    const [credentials, setCredentials] = useState<Credentials>({email: '', password: ''})
    
    return{
        typedEmail: credentials.email,

        typedPassword: credentials.password,

        onPasswordChange: (newPassword: string) => {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                password: newPassword
            }))
        },
        
        onEmailChange: (newEmail: string) => {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                email: newEmail
            }))
        }
    }
}