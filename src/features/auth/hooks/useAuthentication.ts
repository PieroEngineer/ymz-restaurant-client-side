import { useEffect, useState } from "react"
import { isBlank, isValidEmail, isValidPassword } from "@/features/auth/helpers/credentialValidators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/api/authService";
import type { SignInPayload, SignUpPayload } from "@/features/auth";
import { useNavigate } from "@tanstack/react-router";
import { getAuthErrorMessage } from "@/features/auth/utils/authErrorMapper";
import { NavigationPaths } from "@/shared/constants/navigation-names";

export function useAuthentification(
    email: string,
    password: string,
    loggedUserId: string | undefined
){  
    const navigate = useNavigate()

    useEffect(() => {
        if( loggedUserId !== undefined ){
            console.log(`✅  User is already logged in with userId: ${loggedUserId}. Redirecting to Hub page.`)
            navigate({ to: NavigationPaths.Hub })   // TODO: Maybe it's going to have a race condition with the navigation in the onSuccess of the signInMutation.
        }
        else{
            console.log(`🔎  No user is currently logged in. Staying on the Auth page. ${loggedUserId}`)
        }
    }, [loggedUserId])

    const [termsAcceptance, setTermsAcceptance] = useState(false)    
    const [errorMessageInAuth, setErrorMessageInAuth] = useState("")
    const queryClient = useQueryClient();

    const singInMutation = useMutation({
        mutationFn: async () => {

            if (isBlank(email)) {
                throw new Error('El correo electrónico es obligatorio.')
            }

            if (!isValidEmail(email)) {
                throw new Error('Debe ingresar un correo con formato válido')
            }

            if (isBlank(password)) {
                throw new Error('El contraseña es obligatoria.')
            }

            console.log(`🔎  Trying to sign in with ${email} ${password}`)

            const credentialsPayload: SignInPayload = {
                email,
                password
            }

            await authService.signIn(credentialsPayload)

        },
        onSuccess: async () => {
            console.log('✅  Sign in successful from the auth page')

            // Refresh user profile query state immediately after login
            queryClient.invalidateQueries({ queryKey: ['authUser'] });

            navigate({ to: NavigationPaths.Hub })
        },

        onError: (error: any) => {
            
            console.log(`❌  Sign in failed ${error.name}: ${error.message}`, )

            setErrorMessageInAuth(error.message)
        }
    })

    const signUpMutation = useMutation({
        mutationFn: async () => {
            if (isBlank(email)) {
                throw new Error('El correo electrónico es obligatorio.')
            }

            if (!isValidEmail(email)) {
                throw new Error('Debe ingresar un correo con formato válido')
            }

            if (isBlank(password)) {
                throw new Error('El contraseña es obligatoria.')
            }
            
            if (!isValidPassword(password)) {
                throw new Error('La contraseña debe tener al menos 8 caracteres.')
            }

            if (!termsAcceptance) {
                throw new Error('Debes aceptar los términos y condiciones.')
            }
            
            console.log(`🔎  Trying to sign Up with ${email} ${password}`)

            const credentialsPayload: SignUpPayload = {
                email,
                password
            }

            try{
                await authService.signUp(credentialsPayload)

                await authService.signIn(credentialsPayload)

            } catch(error){
                throw new Error(getAuthErrorMessage(error));
            }
        },
        onSuccess: () => {
            navigate({ to: NavigationPaths.RestaurantInitialization })
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
