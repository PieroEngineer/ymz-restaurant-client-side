import type { ReactNode } from "react";

interface AuthCardsLayoutProps {
    children: ReactNode;
}

export function AuthCardsLayout({ children }: AuthCardsLayoutProps) {
    return (
        <div className="flex w-full max-w-6xl flex-col items-stretch justify-center gap-3 md:flex-row md:items-center md:gap-2 max-md:landscape:h-full max-md:landscape:min-h-0 max-md:landscape:flex-1 max-md:landscape:flex-row max-md:landscape:items-stretch max-md:landscape:gap-2">
            {children}
        </div>
    );
}
