import { InputCard } from "@/features/auth/components/InputCard";
import { PresentationCard } from "@/features/auth/components/PresentationCard";
import authBackground from "@/assets/images/auth-bg.webp";
import { useAuthentification } from "@/features/auth/hooks/useAuthentication";
import { useCredentials } from "@/features/auth/hooks/useCredentials";

export function AuthScreen(){

    const credentials = useCredentials()
    const auth = useAuthentification(credentials.typedEmail, credentials.typedPassword)

    return (
        <div
            className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center gap-5"
            style={{ backgroundImage: `url(${authBackground})` }}
        >
            
            <div className="flex gap-2 items center">
                <PresentationCard/>
                <InputCard
                    email={credentials.typedEmail}
                    onEmailChanged={credentials.onEmailChange}
                    password={credentials.typedPassword}
                    onPasswordChanged={credentials.onPasswordChange}
                    termsAccepted={auth.termsAcceptance}
                    onTermsAcceptanceToggled={auth.toggleTermsAcceptance}
                    onTryToSignIn={auth.trySignIn}
                    onTryToSignUp={auth.trySignUp}
                    issueMessage={auth.issueMessage}
                    cleanIssueMessage = {auth.cleanIssueMessage}
                />
            </div>

            <span className="font-heading text-2xl text-brand-primary shadow-lg" style={{ color: "brand-navy", backgroundColor: "white",  padding: "2px 6px",  borderRadius: "4px"  }}>
                {"¡Yummizi les da la bienvenida!"}
            </span>
        </div>
    )
}