import type { ReactNode } from "react";
import authBackground from "@/assets/images/auth-bg.webp";

interface AuthPageShellProps {
    children: ReactNode;
}

export function AuthPageShell({ children }: AuthPageShellProps) {
    return (
        <div
            className="flex min-h-dvh w-full flex-col items-center justify-start gap-3 overflow-x-hidden overflow-y-auto bg-cover bg-center bg-no-repeat px-[max(0.75rem,env(safe-area-inset-left))] pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:h-dvh md:justify-center md:gap-5 md:overflow-hidden max-md:landscape:h-dvh max-md:landscape:min-h-0 max-md:landscape:justify-center max-md:landscape:gap-2 max-md:landscape:overflow-hidden"
            style={{ backgroundImage: `url(${authBackground})` }}
        >
            {children}
        </div>
    );
}
