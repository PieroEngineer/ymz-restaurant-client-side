import { AuthForm } from "@/features/auth/components/AuthForm";


export function InputCard(){

    return(
            <div className="bg-white/40 text-brand-navy rounded-2xl shadow-lg flex flex-col items-center gap-5 p-4">
                <span className="font-heading text-4xl text-brand-navy" style={{ color: "brand-navy", backgroundColor: "white",  padding: "4px 10px",  borderRadius: "10px"  }}>
                    {"Creando cuenta"}
                </span>

                <AuthForm/>
                
                {/* Terms and condition*/}
                <div className="flex">
                    <div className="size-5 bg-white rounded-sm"></div>
                    <span className="font-accent text-brand-navy pl-2">
                        {"Acepto los "}
                    </span>
                    <span className="underline font-accent text-brand-secondary">
                        {" Términos y Condiciones"}
                    </span>
                </div>

                {/* Red italic text below */}
                <span className="italic text-md text-red-600">
                    {"Por favor, complete los campos todos los campos"}
                </span>

                <div className="flex gap-4">
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md bg-brand-primary px-4 py-1.5 shadow-sm"
                        style={{ backgroundColor: "brand-primary" }}
                    >
                        <span className="text-white text-xl font-medium">
                            {"Crear cuenta"}
                        </span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 bg-brand-blue rounded-md px-4 py-1.5 shadow-sm"
                        style={{ backgroundColor: "brand-blue" }}
                    >
                        <span className="text-white text-xl font-medium">
                            {"Acceder"}
                        </span>
                    </button>
                </div>

            </div>
        )
}