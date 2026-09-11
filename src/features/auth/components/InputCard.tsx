import { AuthForm } from "@/features/auth/components/AuthForm";
import { useAuthMode } from "@/features/auth/hooks/useAuthMode";

interface InputCardProps{
    email: string,
    onEmailChanged: (newEmail: string) => void,
    password: string,
    onPasswordChanged: (newPassword: string) => void,

    termsAccepted: boolean,
    onTermsAcceptanceToggled: () => void,

    onTryToSignIn: () => void,
    onTryToSignUp: () => void,

    issueMessage: string,
    cleanIssueMessage: () => void,

    isLoading: boolean,

    onOpenTermsModal: () => void
}

export function InputCard({ 
    email,
    onEmailChanged,
    password,
    onPasswordChanged,
    termsAccepted,
    onTermsAcceptanceToggled,
    onTryToSignIn,
    onTryToSignUp,
    issueMessage,
    cleanIssueMessage,
    isLoading,
    onOpenTermsModal
}: InputCardProps) {

    const authMode = useAuthMode()

    return(
            <div className="bg-white/40 text-brand-navy rounded-2xl shadow-lg flex flex-col items-center gap-5 p-4">
                <span className="font-heading text-4xl text-brand-navy" style={{ color: "brand-navy", backgroundColor: "white",  padding: "4px 10px",  borderRadius: "10px"  }}>
                    {authMode.mode=="signingIn" ? "Accediendo cuenta": "Creando cuenta"}
                </span>

                <AuthForm
                    email={email}
                    onEmailChanged={onEmailChanged}
                    password={password}
                    onPasswordChanged={onPasswordChanged}
                    cleanIssueMessage = {cleanIssueMessage}
                />
                
                {/* Terms and condition*/}
                {authMode.mode == "signingUp" && (
                    <div className="flex">
                    <div 
                    className= {`size-5 ${termsAccepted ? 'bg-brand-tertiary' : 'bg-white'} rounded-sm`}
                    onClick = {onTermsAcceptanceToggled}
                    ></div>
                    <span className="font-accent text-brand-navy pl-2">
                        {"Acepto los"}
                    </span>
                    <span 
                        className="underline font-accent text-brand-secondary"
                        onClick={onOpenTermsModal}
                    >
                        {"Términos y Condiciones"}
                    </span>
                </div>
                )}

                {/* Red italic text below */}
                {issueMessage !== "" && (
                    <span className="italic text-md text-red-600">
                        {issueMessage}
                    </span>
                )}

                {authMode.mode == "signingUp" && (
                    <span className="font-accent text-brand-navy pl-2 whitespace-pre-line">
                        {"Al menos:\n+ 8 caracteres + 1 mayúscula\n+ 1 minúscula + 1 número\n+ 1 símbolo"}
                    </span>
                )}

                <div className="grow"></div>

                {/** FIXME: Include the conditional "isLoading" to hide the buttons when it's loading  */}
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                ):(
                    <div className={`flex gap-4 ${authMode.mode == "signingUp" ? 'flex-row-reverse' : ''}`}>
                
                        <button
                            type="button"
                            onClick={()=>{
                                if(authMode.mode == "signingIn") {
                                    authMode.setSignUpMode()
                                }
                                else{
                                    onTryToSignUp()
                                }

                            }}
                            className={`flex items-center gap-2 rounded-md ${authMode.mode == "signingIn" ? 'bg-brand-primary' : 'bg-brand-blue'} px-4 py-1.5 shadow-sm`}
                            style={{ backgroundColor: "brand-primary" }}
                        >
                            <span className="text-white text-xl font-medium">
                                {authMode.mode=="signingUp" ? "Crear" : "Crear cuenta"}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if(authMode.mode == "signingUp") {
                                    authMode.setSignInMode()
                                }
                                else{
                                    onTryToSignIn()
                                }
                            }}
                            className={`flex items-center gap-2 ${authMode.mode == "signingIn" ? 'bg-brand-blue' : 'bg-brand-primary'} rounded-md px-4 py-1.5 shadow-sm`}
                            style={{ backgroundColor: "brand-blue" }}
                        >
                            <span 
                            className="text-white text-xl font-medium">
                                {authMode.mode=="signingIn" ? "Acceder" : "Ya tengo cuenta"}
                            </span>
                        </button>
                    </div>
                )}
                

            </div>
        )
}