import chefThinkingImagePath from "@/assets/images/double-thinking-in-cooking_image.webp"
import horizontaYummiziLogo from  "@/assets/images/horizontal-yummizi-logo.webp"

export function PresentationCard(){
        return(
            <div className="bg-brand-tertiary text-white rounded-2xl shadow-lg flex flex-col items-center gap-2.5 p-4">
                {/* Horizontal Yummizi logo */}
                <img src={horizontaYummiziLogo} alt="Yummizi's horizontal logo" className="h-30" loading="lazy" />

                <span className="text-sans text-3xl font-bold text-center whitespace-pre-line">{"Una experiencia ágil, fácil y deliciosa\npara tus clientes"}</span>

                {/* chef cooking image */}
                <img src={chefThinkingImagePath} alt="Chef thinking while cooking and customers arrive" className="h-55" loading="lazy" />

            </div>
        )

}