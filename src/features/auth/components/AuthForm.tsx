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
        <div className="flex flex-col gap-3 self-start" >

            <span className="font-heading text-2xl text-brand-navy">
                {"Correo:"}
            </span>

            <input
                type = "email"
                ref = {emailInputRef}
                defaultValue={email}
                className={
                    "bg-white text-blue-700 text-md rounded-md px-2 py-1 shadow-sm " +
                    "outline-none w-full "
                }
                onBlur={() => {
                    onEmailChanged(emailInputRef.current?.value ?? "")
                    cleanIssueMessage()
                }}
            />

            <span className="font-heading text-2xl text-brand-navy">
                {"Contraseña:"}
            </span>

            <input
                type = "password"
                ref = {passwordInputRef}
                defaultValue={password}
                className={
                    "bg-white text-blue-700 text-md rounded-md px-2 py-1 shadow-sm " +
                    "outline-none w-full "
                }
                onBlur = {() => {
                    onPasswordChanged(passwordInputRef.current?.value ?? "")
                    cleanIssueMessage()
                }}
            />
            
        </div>
  )

}