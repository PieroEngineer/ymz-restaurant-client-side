import chefThinkingImagePath from "@/assets/images/double-thinking-in-cooking_image.webp"
import horizontaYummiziLogo from  "@/assets/images/horizontal-yummizi-logo.webp"

export function PresentationCard(){
        return(
            <div className="flex w-full shrink-0 flex-col items-center gap-2 rounded-2xl bg-brand-tertiary p-3 text-white shadow-lg md:w-auto md:gap-2.5 md:p-4 max-md:landscape:w-[min(42%,20rem)] max-md:landscape:min-h-0 max-md:landscape:justify-center max-md:landscape:gap-1.5 max-md:landscape:p-2">
                {/* Horizontal Yummizi logo */}
                <img src={horizontaYummiziLogo} alt="Yummizi's horizontal logo" className="h-16 w-auto max-w-full object-contain md:h-30 max-md:landscape:h-12" loading="lazy" />

                <span className="text-center text-lg font-bold md:text-3xl max-md:landscape:text-sm max-md:landscape:leading-tight whitespace-pre-line">{"Una experiencia ágil, fácil y deliciosa\npara tus clientes"}</span>

                {/* chef cooking image */}
                <img src={chefThinkingImagePath} alt="Chef thinking while cooking and customers arrive" className="hidden h-55 w-auto max-w-full object-contain md:block" loading="lazy" />

            </div>
        )

}
