import { InputCard } from "@/features/auth/components/InputCard";
import { PresentationCard } from "@/features/auth/components/PresentationCard";
import { useAuthentification } from "@/features/auth/hooks/useAuthentication";
import { useCredentials } from "@/features/auth/hooks/useCredentials";
import { useAuthUser } from "@/shared/hooks/useAuthUser";
import { useTermsModal } from "@/features/auth/hooks/useTermsModal";
import { TermsModal } from "@/features/auth/components/termsModal";
import { AuthPageShell } from "@/features/auth/components/AuthPageShell";
import { AuthCardsLayout } from "@/features/auth/components/AuthCardsLayout";
import { AuthWelcomeBanner } from "@/features/auth/components/AuthWelcomeBanner";

export function AuthScreen(){

    const authUser = useAuthUser()

    const credentials = useCredentials()
    const auth = useAuthentification(credentials.typedEmail, credentials.typedPassword, authUser.data?.userId)

    const termsModal = useTermsModal()

    return (
        <AuthPageShell>
            <AuthCardsLayout>
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
                    isLoading={auth.isLoading}
                    onOpenTermsModal={termsModal.toggleOpening}
                />
            </AuthCardsLayout>

            <AuthWelcomeBanner />

            <TermsModal
                isOpen={termsModal.isOpen}
                onClose={termsModal.toggleOpening}
            />
        </AuthPageShell>
    )
}
