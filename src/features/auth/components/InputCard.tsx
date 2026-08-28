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
    cleanIssueMessage: () => void
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
    cleanIssueMessage
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
                        {"Acepto los "}
                    </span>
                    <span className="underline font-accent text-brand-secondary">
                        {" Términos y Condiciones"}
                    </span>
                </div>
                )}

                {/* Red italic text below */}
                <span className="italic text-md text-red-600">
                    {issueMessage}
                </span>

                <div className="grow"></div>
                <div className={`flex gap-4 ${authMode.mode == "signingUp" ? 'flex-row-reverse' : ''}`}>
                    
                    {/** FIXME: Include the conditional "isLoading" to hide the buttons when it's loading  */}
                    
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

            </div>
        )
}