import { useState } from "react"
import { isBlank, isValidEmail, isValidPassword } from "@/features/auth/helpers/credentialValidators";

export function useAuthentification(
    email: string,
    password: string
){
    const [termsAcceptance, setTermsAcceptance] = useState(false)
    
    const [errorMessageInAuth, setErrorMessageInAuth] = useState("")

    return{
        trySignIn: () => {

            if (isBlank(email)) {
                setErrorMessageInAuth('El correo electrónico es obligatorio.')
                return
            }

            if (!isValidEmail(email)) {
                setErrorMessageInAuth('Debe ingresar un correo con formato válido')
                return
            }

            if (isBlank(password)) {
                setErrorMessageInAuth('El contraseña es obligatoria.')
                return
            }

            console.log(`🔎  Trying to sign in with ${email} ${password}`)
            ///✏️Try to sign In
        },
        
        trySignUp: () => {
            
            if (isBlank(email)) {
                setErrorMessageInAuth('El correo electrónico es obligatorio.')
                return
            }

            if (!isValidEmail(email)) {
                setErrorMessageInAuth('Debe ingresar un correo con formato válido')
                return
            }

            if (isBlank(password)) {
                setErrorMessageInAuth('El contraseña es obligatoria.')
                return
            }
            
            if (!isValidPassword(password)) {
                setErrorMessageInAuth('La contraseña debe tener al menos 5 caracteres.')
                return
            }

            if (!termsAcceptance) {
                setErrorMessageInAuth('Debes aceptar los términos y condiciones.')
                return
            }
            
            console.log(`🔎  Trying to sign Up with ${email} ${password}`)
            ///✏️Try to sign up
        },

        termsAcceptance,
        
        toggleTermsAcceptance: () => setTermsAcceptance((prev) => !prev),
    
        issueMessage: errorMessageInAuth,

        cleanIssueMessage: () => setErrorMessageInAuth('')
    }
}
