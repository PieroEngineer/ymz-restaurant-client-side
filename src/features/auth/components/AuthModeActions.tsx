import type { AuthenticationMode } from "@/features/auth/types/credentials.types";

interface AuthModeActionsProps {
    mode: AuthenticationMode;
    onSetSignInMode: () => void;
    onSetSignUpMode: () => void;
    onTryToSignIn: () => void;
    onTryToSignUp: () => void;
}

export function AuthModeActions({
    mode,
    onSetSignInMode,
    onSetSignUpMode,
    onTryToSignIn,
    onTryToSignUp,
}: AuthModeActionsProps) {
    return (
        <div className={`flex flex-wrap justify-center gap-3 md:gap-4 ${mode === "signingUp" ? "flex-row-reverse" : ""}`}>
            <button
                type="button"
                onClick={() => {
                    if (mode === "signingIn") {
                        onSetSignUpMode();
                    } else {
                        onTryToSignUp();
                    }
                }}
                className={`flex min-h-11 items-center gap-2 rounded-md px-4 py-2 shadow-sm ${mode === "signingIn" ? "bg-brand-primary" : "bg-brand-blue"}`}
            >
                <span className="text-base font-medium text-white md:text-xl">
                    {mode === "signingUp" ? "Crear" : "Crear cuenta"}
                </span>
            </button>

            <button
                type="button"
                onClick={() => {
                    if (mode === "signingUp") {
                        onSetSignInMode();
                    } else {
                        onTryToSignIn();
                    }
                }}
                className={`flex min-h-11 items-center gap-2 rounded-md px-4 py-2 shadow-sm ${mode === "signingIn" ? "bg-brand-blue" : "bg-brand-primary"}`}
            >
                <span className="text-base font-medium text-white md:text-xl">
                    {mode === "signingIn" ? "Acceder" : "Ya tengo cuenta"}
                </span>
            </button>
        </div>
    );
}
