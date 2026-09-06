import { useState } from "react"
import { isBlank, isValidEmail, isValidPassword } from "@/features/auth/helpers/credentialValidators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/api/authService";
import type { SignInPayload, SignUpPayload } from "@/features/auth";
import { useNavigate } from "@tanstack/react-router";
import { getAuthErrorMessage } from "@/features/auth/utils/authErrorMapper";

export function useAuthentification(
    email: string,
    password: string
){
    const navigate = useNavigate()

    const [termsAcceptance, setTermsAcceptance] = useState(false)    
    const [errorMessageInAuth, setErrorMessageInAuth] = useState("")
    const queryClient = useQueryClient();

    const singInMutation = useMutation({
        mutationFn: async () => {

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

            const credentialsPayload: SignInPayload = {
                email,
                password
            }

            await authService.signIn(credentialsPayload)
        },
        onSuccess: async () => {
            console.log('✅  Sign in successful')

            // Refresh user profile query state immediately after login
            queryClient.invalidateQueries({ queryKey: ['authUser'] });

            navigate({ to: '/' })
        },

        onError: (error: any) => {
            console.log('❌  Sign in failed', error)
            setErrorMessageInAuth('Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.')
        }
    })

    const signUpMutation = useMutation({
        mutationFn: async () => {
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
                setErrorMessageInAuth('La contraseña debe tener al menos 8 caracteres.')
                return
            }

            if (!termsAcceptance) {
                setErrorMessageInAuth('Debes aceptar los términos y condiciones.')
                return
            }
            
            console.log(`🔎  Trying to sign Up with ${email} ${password}`)

            const credentialsPayload: SignUpPayload = {
                email,
                password
            }

            try{
                await authService.signUp(credentialsPayload)
            } catch(error){
                throw new Error(getAuthErrorMessage(error));
            }
        },
        onSuccess: () => {
            navigate({ to: '/restaurantProfile' })
        },

        onError: (error: any) => {
            console.log('❌  Sign up failed', error)
            setErrorMessageInAuth(error.message)
        }
    })

    return{
        isLoading: singInMutation.isPending || signUpMutation.isPending,

        trySignIn: () => singInMutation.mutate(),
        
        trySignUp: () => signUpMutation.mutate(),

        termsAcceptance,
        
        toggleTermsAcceptance: () => setTermsAcceptance((prev) => !prev),
    
        issueMessage: errorMessageInAuth,

        cleanIssueMessage: () => setErrorMessageInAuth('')
    }
}
