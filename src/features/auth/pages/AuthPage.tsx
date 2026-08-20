import { InputCard } from "@/features/auth/components/InputCard";
import { PresentationCard } from "@/features/auth/components/PresentationCard";
import authBackground from "@/assets/images/auth-bg.webp";

export function AuthScreen(){
    return (
        <div
            className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center gap-5"
            style={{ backgroundImage: `url(${authBackground})` }}
        >
            
            <div className="flex gap-2 items center">
                <PresentationCard/>
                <InputCard/>
            </div>

            <span className="font-heading text-2xl text-brand-primary shadow-lg" style={{ color: "brand-navy", backgroundColor: "white",  padding: "2px 6px",  borderRadius: "4px"  }}>
                {"¡Yummizi les da la bienvenida!"}
            </span>
        </div>
    )
}