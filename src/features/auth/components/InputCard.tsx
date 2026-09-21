import { AuthForm } from "@/features/auth/components/AuthForm";
import { AuthModeActions } from "@/features/auth/components/AuthModeActions";
import { TermsAcceptanceRow } from "@/features/auth/components/TermsAcceptanceRow";
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
            <div className="flex w-full min-w-0 flex-col items-center gap-3 rounded-2xl bg-white/40 p-3 text-brand-navy shadow-lg md:w-auto md:min-w-[22rem] md:gap-5 md:p-4 max-md:landscape:min-h-0 max-md:landscape:flex-1 max-md:landscape:overflow-y-auto max-md:landscape:gap-2 max-md:landscape:p-2">
                <span className="rounded-[10px] bg-white px-2.5 py-1 text-center font-heading text-2xl text-brand-navy md:px-2.5 md:text-4xl max-md:landscape:px-2 max-md:landscape:py-0.5 max-md:landscape:text-xl">
                    {authMode.mode=="signingIn" ? "Accediendo cuenta": "Creando cuenta"}
                </span>

                <AuthForm
                    email={email}
                    onEmailChanged={onEmailChanged}
                    password={password}
                    onPasswordChanged={onPasswordChanged}
                    cleanIssueMessage = {cleanIssueMessage}
                />
                
                {authMode.mode == "signingUp" && (
                    <TermsAcceptanceRow
                        termsAccepted={termsAccepted}
                        onTermsAcceptanceToggled={onTermsAcceptanceToggled}
                        onOpenTermsModal={onOpenTermsModal}
                    />
                )}

                {issueMessage !== "" && (
                    <span className="italic text-md text-red-600 text-center">
                        {issueMessage}
                    </span>
                )}

                {authMode.mode == "signingUp" && (
                    <span className="font-accent text-brand-navy pl-2 whitespace-pre-line text-sm md:text-base max-md:landscape:text-xs">
                        {"Al menos:\n+ 8 caracteres + 1 mayúscula\n+ 1 minúscula + 1 número\n+ 1 símbolo"}
                    </span>
                )}

                <div className="grow max-md:landscape:hidden"></div>

                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                ):(
                    <AuthModeActions
                        mode={authMode.mode}
                        onSetSignInMode={authMode.setSignInMode}
                        onSetSignUpMode={authMode.setSignUpMode}
                        onTryToSignIn={onTryToSignIn}
                        onTryToSignUp={onTryToSignUp}
                    />
                )}
                

            </div>
        )
}
