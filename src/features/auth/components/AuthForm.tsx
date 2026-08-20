
export function AuthForm(){

  return(
    <div className="flex flex-col gap-3 self-start" >

        <span className="font-heading text-2xl text-brand-navy">
            {"Correo:"}
        </span>

        <input
            readOnly
            // value={value}
            value={"mockmail@gmail.com"}
            className={
                "bg-white text-blue-700 text-md rounded-md px-2 py-1 shadow-sm " +
                "outline-none w-full "
            }
        />

        <span className="font-heading text-2xl text-brand-navy">
            {"Correo:"}
        </span>

        <input
            readOnly
            // value={value}
            value={"mock password"}
            className={
                "bg-white text-blue-700 text-md rounded-md px-2 py-1 shadow-sm " +
                "outline-none w-full "
            }
        />
        
    </div>
  )

}