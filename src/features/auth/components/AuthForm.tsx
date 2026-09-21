import { useRef } from "react";

interface AuthFormProps {
    email: string;
    onEmailChanged: (newEmail: string) => void;
    password: string;
    onPasswordChanged: (newPassword: string) => void;
    cleanIssueMessage: () => void;
}

export function AuthForm({ email, onEmailChanged, password, onPasswordChanged, cleanIssueMessage }: AuthFormProps) {

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    return(
        <div className="flex w-full flex-col gap-2 self-stretch md:gap-3 md:self-start max-md:landscape:gap-1.5" >

            <span className="font-heading text-xl text-brand-navy md:text-2xl max-md:landscape:text-lg">
                {"Correo:"}
            </span>

            <input
                type = "email"
                ref = {emailInputRef}
                defaultValue={email}
                autoComplete="email"
                className="min-h-11 w-full rounded-md bg-white px-3 py-2 text-base text-blue-700 shadow-sm outline-none max-md:landscape:min-h-10"
                onBlur={() => {
                    onEmailChanged(emailInputRef.current?.value ?? "")
                    cleanIssueMessage()
                }}
            />

            <span className="font-heading text-xl text-brand-navy md:text-2xl max-md:landscape:text-lg">
                {"Contraseña:"}
            </span>

            <input
                type = "password"
                ref = {passwordInputRef}
                defaultValue={password}
                autoComplete="current-password"
                className="min-h-11 w-full rounded-md bg-white px-3 py-2 text-base text-blue-700 shadow-sm outline-none max-md:landscape:min-h-10"
                onBlur = {() => {
                    onPasswordChanged(passwordInputRef.current?.value ?? "")
                    cleanIssueMessage()
                }}
            />
            
        </div>
  )

}
