
interface TermsModalProps{
    isOpen: boolean,
    onClose: () => void,
    // onContactUser: () => void
}

export function TermsModal({
    isOpen,
    onClose,
}: TermsModalProps){
    if (!isOpen) return null; 

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in">
             <div
                className="w-200 h-100 rounded-2xl p-3 shadow-xl flex flex-col gap-5 bg-white items-center"
            >
                <article className="prose dark:prose-invert max-w-none text-justify overflow-y-auto">
                    <h1 className="text-brand-navy">TÉRMINOS Y CONDICIONES DE USO Y ASOCIACIÓN PARA RESTAURANTES ALIADOS - YUMMIZI</h1>
                    <p className="font-semibold text-sm text-brand-navy dark:text-brand-navy">
                        Última actualización: Septiembre 2026
                    </p>

                    <p className="text-brand-navy">
                        El presente documento establece los Términos y Condiciones (en adelante, los "Términos B2B") que regulan la relación entre Piero Stephano Olivas Tuesta, en representación del proyecto Yummizi (en formación, en adelante "Yummizi"), y los establecimientos gastronómicos, restaurantes o comercios de alimentos (en adelante, el "Restaurante Aliado" o el "Restaurante") que se registren o utilicen la plataforma tecnológica de Yummizi.
                    </p>

                    <h2 className="text-brand-navy">1. NATURALEZA DEL SERVICIO (ROL DE INTERMEDIARIO TECNOLÓGICO)</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">1.1.</strong> Yummizi es una plataforma virtual y herramienta tecnológica (software) cuyo único propósito es actuar como un puente de intermediación entre el cliente final (en adelante, el "Comensal") y el Restaurante Aliado.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">1.2. No es un servicio gastronómico ni de restauración:</strong> Yummizi no prepara, elabora, vende, distribuye ni entrega alimentos ni bebidas. Asimismo, Yummizi no opera como un servicio de reservas tradicional con garantía de mesa exclusiva, ni como empresa de entrega a domicilio (delivery).
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">1.3.</strong> La relación contractual derivada de la preparación, venta, calidad, salubridad y entrega de los alimentos y bebidas, así como la asignación física de la mesa en el local, se establece única y exclusivamente entre el Restaurante Aliado y el Comensal.
                    </p>

                    <h2 className="text-brand-navy">2. MECÁNICA OPERATIVA DEL MVP Y ALCANCE DEL TIEMPO DE ESPERA</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">2.1. Solicitudes de Mesa y Anticipación:</strong> A través de la plataforma, el Comensal envía una solicitud de mesa informando un tiempo estimado de llegada (menor a 15 minutos) y realiza el pago anticipado de los alimentos seleccionados de la carta del Restaurante.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">2.2. Confirmación Obligatoria del Restaurante:</strong> La solicitud del Comensal no constituye una orden confirmada hasta que el Restaurante Aliado la revise y la confirme mediante la interfaz de Yummizi.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">2.3. Exención de Garantía de "Tiempo Cero":</strong>
                    </p>
                    <ul>
                        <li className="text-brand-navy">El objetivo de Yummizi es reducir sensiblemente el tiempo de espera del Comensal mediante la notificación previa del pedido.</li>
                        <li className="text-brand-navy">Bajo ninguna circunstancia Yummizi ni el Restaurante garantizan un "tiempo cero de espera". La preparación de los alimentos, la liberación y limpieza de mesas y la atención presencial dependen de la capacidad operativa diaria del Restaurante.</li>
                        <li className="text-brand-navy">El Restaurante asume la responsabilidad de gestionar de forma razonable y diligente los tiempos de cocina una vez aceptada la solicitud.</li>
                    </ul>

                    <h2 className="text-brand-navy">3. OBLIGACIONES Y DECLARACIONES DEL RESTAURANTE ALIADO</h2>
                    <p className="text-brand-navy">Al aceptar estos Términos, el Restaurante Aliado declara y se compromete a:</p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">3.1. Licencias y Normativa Sanitaria:</strong> Contar con todas las licencias municipales de funcionamiento, autorizaciones sanitarias (MINSA/DIGESA/Municipalidad) y cumplir estrictamente las normas de inocuidad alimentaria aplicables en el Perú.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">3.2. Veracidad de la Carta y Precios:</strong> Mantener actualizada en la plataforma Yummizi la información sobre su carta, precios, disponibilidad de platos, ingredientes principales y alérgenos.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">3.3. Emisión de Comprobantes de Pago (SUNAT):</strong> El Restaurante es el único responsable legal y tributario de emitir y entregar al Comensal el correspondiente comprobante de pago (boleta de venta o factura) por el consumo de alimentos y bebidas. Yummizi no emitirá comprobantes por los consumos de comida del Restaurante.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">3.4. Atención Diligente:</strong> Enfriar o pausar la recepción de pedidos en la plataforma si su cocina o local se encuentran saturados, a fin de no perjudicar la experiencia del Comensal.
                    </p>

                    <h2 className="text-brand-navy">4. PRECIOS, COMISIONES Y LIQUIDACIONES</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">4.1. Cobro a Comensales:</strong> Yummizi permitirá al comensal enviar su confirmación de pago por medio de una imagen al restaurante dentro de la misma aplicación. Este método se mantendrá hasta que Yummizi cobre por sus servicios, lo cual será avisado con considerable anticipación. Esto se debe a que Yummizi está en un periodo de pruebas piloto.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">4.2. Comisión:</strong> Yummizi no cobrará comisiones mientras el periodo de prubas piloto. El fin de este periodo será anticipado con considerable anticipación.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">4.3. Liquidación:</strong> El restaurante en cuestión recibirá todos los pagos directamente.
                    </p>

                    <h2 className="text-brand-navy">5. POLÍTICA DE CANCELACIONES Y "NO SHOW" (NO PRESENTACIÓN)</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">5.1. No presentación del Comensal (No-Show):</strong> Si el Comensal no se presenta al local dentro del margen de tolerancia establecido tras realizar el pago y confirmar la solicitud, el pago realizado no será reembolsado al Comensal y se liquidará al Restaurante conforme a las reglas aplicables del MVP, cubriendo el costo de los alimentos preparados.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">5.2. Rechazo o Cancelación por el Restaurante:</strong> Si el Restaurante acepta la solicitud pero posteriormente no puede atender al Comensal por falta de insumos, falta de mesas u otra causa imputable a su cocina, el Restaurante deberá asumir la devolución total al Comensal y las posibles penalidades por costos transaccionales de la pasarela.
                    </p>

                    <h2 className="text-brand-navy">6. PROPIEDAD INTELECTUAL Y LICENCIA DE MARCA</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">6.1. Autorización de Uso de Marca:</strong> El Restaurante otorga a Yummizi una licencia gratuita, no exclusiva y temporal para utilizar su nombre comercial, logotipo, fotos de platos y menús dentro de la aplicación, página web y materiales promocionales de Yummizi.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">6.2. Titularidad del Software:</strong> Todos los derechos de propiedad intelectual de la plataforma, código fuente, interfaz, diseños y marca Yummizi pertenecen en su totalidad a Piero Stephano Olivas Tuesta / Yummizi.
                    </p>

                    <h2 className="text-brand-navy">7. DESLINDE Y LIMITACIÓN DE RESPONSABILIDAD DE YUMMIZI</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">7.1. Desvinculación Operativa:</strong> Yummizi no será responsable bajo ninguna circunstancia por:
                    </p>
                    <ul>
                        <li className="text-brand-navy">Casos de intoxicación alimentaria, mala calidad, mal estado o presencia de alérgenos en la comida provista por el Restaurante.</li>
                        <li className="text-brand-navy">Retrasos excesivos en la cocina o indisponibilidad de mesas en el local.</li>
                        <li className="text-brand-navy">Mala atención o trato por parte del personal del Restaurante hacia el Comensal.</li>
                        <li className="text-brand-navy">Incumplimientos tributarios del Restaurante frente a SUNAT o INDECOPI.</li>
                    </ul>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">7.2. Indemnización:</strong> El Restaurante Aliado acepta defender, indemnizar y mantener indemne a Yummizi, sus fundadores y colaboradores ante cualquier reclamo, denuncia administrativa (INDECOPI, SUNAT, Municipalidades) o demanda judicial interpuesta por un Comensal o tercero debido a fallas en el producto alimenticio o servicio presencial del Restaurante.
                    </p>

                    <h2 className="text-brand-navy">8. MODIFICACIONES Y TERMINACIÓN</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">8.1.</strong> Yummizi se reserva el derecho de modificar estos Términos B2B en cualquier momento, notificando al Restaurante por correo electrónico o mediante la interfaz de la aplicación.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">8.2.</strong> Cualquiera de las partes podrá dar por terminada la relación y dar de baja el perfil del Restaurante en la plataforma notificándolo por escrito con un previo aviso de al menos cinco (5) días hábiles, sin que ello afecte el cumplimiento de las transacciones ya confirmadas y pendientes de liquidación.
                    </p>

                    <h2 className="text-brand-navy">9. LEY APLICABLE Y JURISDICCIÓN</h2>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">9.1.</strong> Estos Términos se rigen e interpretan conforme a las leyes de la República del Perú.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">9.2.</strong> Toda controversia derivada de la interpretación o ejecución de este acuerdo será sometida a la competencia de los Jueces y Tribunales del Distrito Judicial de Lima Cercado, Perú.
                    </p>


                    <h1 className="text-brand-navy">POLÍTICA DE PRIVACIDAD UNIFICADA - YUMMIZI</h1>
                    <p className="font-semibold text-sm text-brand-navy dark:text-brand-navy">
                        (Para Comensales y Restaurantes Aliados)
                    </p>
                    <p className="font-semibold text-sm text-brand-navy dark:text-brand-navy">
                        Última actualización: Septiembre 2026
                    </p>

                    <p className="text-brand-navy">
                        En cumplimiento de la Ley N° 29733 (Ley de Protección de Datos Personales del Perú) y su Reglamento (D.S. N° 003-2013-JUS), se presenta la Política de Privacidad que regula el tratamiento de los datos personales recopilados a través de la aplicación móvil, sitio web y formularios virtuales de Yummizi.
                    </p>

                    <h2 className="text-brand-navy">1. IDENTIDAD Y DOMICILIO DEL RESPONSABLE</h2>
                    <p className="text-brand-navy">
                        El responsable del tratamiento de sus datos personales es Piero Stephano Olivas Tuesta, en representación del proyecto Yummizi (en formación), con domicilio para estos efectos en la ciudad de Lima, Perú, y con correo de contacto: <a className="text-brand-navy" href="mailto:yummizi.mkt@gmail.com">yummizi.mkt@gmail.com</a>.
                    </p>

                    <h2 className="text-brand-navy">2. DATOS PERSONALES RECOPILADOS Y FINALIDADES</h2>
                    <p className="text-brand-navy">
                        Yummizi recopila y trata datos personales diferenciados según el perfil del usuario, exclusivamente para los fines descritos a continuación:
                    </p>

                    <h3 className="text-brand-navy">A. Frente Comensal (Usuario Consumidor)</h3>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">Datos recopilados:</strong> Nombre completo, correo electrónico, número de teléfono, contraseña elegida, tiempo estimado de llegada, selecciones del menú y capturas de pantalla o imágenes de comprobantes de pago (vouchers de Yape, Plin o transferencia).
                    </p>
                    <p className="text-brand-navy"><strong className="text-brand-navy">Finalidades principales:</strong></p>
                    <ul>
                        <li className="text-brand-navy">Crear y gestionar su cuenta de usuario en la aplicación.</li>
                        <li className="text-brand-navy">Facilitar la intermediación de solicitudes de mesa y pedidos con el Restaurante.</li>
                        <li className="text-brand-navy">Transmitir la imagen del comprobante de pago al Restaurante seleccionado para su verificación directa.</li>
                        <li className="text-brand-navy">Enviar notificaciones del estado de la solicitud y alertas de tiempo.</li>
                        <li className="text-brand-navy">Contactarle para encuestas de satisfacción, pruebas de producto y retroalimentación durante la fase piloto (MVP).</li>
                    </ul>

                    <h3 className="text-brand-navy">B. Frente Restaurante (Socio Comercial / Representante)</h3>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">Datos recopilados:</strong> Nombre del representante, correo electrónico, teléfono de contacto, nombre comercial del restaurante, dirección del local, datos de identificación tributaria (RUC / Razón Social) y datos para recepción de transferencias (cuentas bancarias o números asociados a Yape/Plin).
                    </p>
                    <p className="text-brand-navy"><strong className="text-brand-navy">Finalidades principales:</strong></p>
                    <ul>
                        <li className="text-brand-navy">Crear y verificar el perfil del Restaurante en la plataforma.</li>
                        <li className="text-brand-navy">Notificar la recepción de solicitudes de Comensales e imágenes de comprobantes de pago.</li>
                        <li className="text-brand-navy">Gestionar la relación operativa y soporte técnico durante el periodo piloto.</li>
                        <li className="text-brand-navy">Enviar actualizaciones comerciales, cambios en los términos del servicio y avisos del cierre de la fase piloto.</li>
                    </ul>

                    <h2 className="text-brand-navy">3. BANCO DE DATOS Y TIEMPO DE CONSERVACIÓN</h2>
                    <p className="text-brand-navy">
                        Los datos personales serán almacenados en el banco de datos denominado "Yummizi App", de titularidad de Yummizi.
                    </p>
                    <p className="text-brand-navy">
                        <strong className="text-brand-navy">Plazo de conservación:</strong> Los datos se conservarán durante el tiempo que la cuenta permanezca activa o durante el periodo de dos (2) años tras la finalización de la fase piloto, salvo que el titular revoque su consentimiento o solicite la cancelación de sus datos de forma anticipada.
                    </p>

                    <h2 className="text-brand-navy">4. FLUJO TRANSFRONTERIZO Y PROCESADORES (TERCEROS)</h2>
                    <p className="text-brand-navy">
                        Para garantizar la infraestructura técnica del servicio, Yummizi utiliza herramientas cloud de proveedores internacionales cuyas bases de datos y servidores se encuentran ubicados fuera del Perú (principalmente en Estados Unidos). Esto constituye un flujo transfronterizo de datos personales, el cual se ejecuta bajo medidas adecuadas de seguridad:
                    </p>
                    <ul>
                        <li className="text-brand-navy"><strong className="text-brand-navy">Supabase Inc.:</strong> Almacenamiento de base de datos relacional y autenticación de usuarios.</li>
                        <li className="text-brand-navy"><strong className="text-brand-navy">Amazon Web Services (AWS):</strong> Almacenamiento en la nube de imágenes (capturas de comprobantes de pago y recursos multimedia).</li>
                    </ul>
                    <p className="text-brand-navy">
                        <em>(Nota: Los servicios de alojamiento de interfaz o hosting de frontend como Netlify únicamente procesan el tráfico web sin almacenar datos personales de los usuarios).</em>
                    </p>

                    <h2 className="text-brand-navy">5. CONFIDENCIALIDAD Y SEGURIDAD DE LAS IMÁGENES DE PAGO</h2>
                    <p className="text-brand-navy">
                        Las imágenes de los comprobantes de pago cargadas por el Comensal serán compartidas únicamente con el Restaurante receptor de la solicitud a fin de validar la transacción. Yummizi no comercializa, transfiere ni utiliza dichas imágenes para ningún fin distinto a la verificación operativa del pedido.
                    </p>

                    <h2 className="text-brand-navy">6. EJERCICIO DE DERECHOS ARCO</h2>
                    <p className="text-brand-navy">
                        Como titular de los datos personales, usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (Derechos ARCO) al tratamiento de su información personal en cualquier momento.
                    </p>
                    <p className="text-brand-navy">Para ejercer estos derechos, debe enviar una solicitud formal por correo electrónico a:</p>
                    <ul>
                        <li className="text-brand-navy"><strong className="text-brand-navy">Correo:</strong> <a className="text-brand-navy" href="mailto:yummizi.mkt@gmail.com">yummizi.mkt@gmail.com</a></li>
                        <li className="text-brand-navy"><strong className="text-brand-navy">Asunto:</strong> Derechos ARCO - [Su Nombre / Nombre del Restaurante]</li>
                    </ul>
                    <p className="text-brand-navy">
                        La solicitud deberá contener su nombre completo, copia de su documento de identidad (DNI o CE) y la descripción clara del derecho que desea ejercer. La atención se procesará dentro de los plazos fijados por la Ley N° 29733.
                    </p>

                    <h2 className="text-brand-navy">7. OBLIGATORIEDAD DEL CONSENTIMIENTO</h2>
                    <p className="text-brand-navy">
                        La entrega de los datos personales solicitados en la aplicación es de carácter obligatorio para poder utilizar las funciones del MVP de Yummizi. De no proporcionar esta información (o no adjuntar la imagen del pago en el caso de las solicitudes), no será posible enlazar la orden con el Restaurante.
                    </p>

                    <h2 className="text-brand-navy">8. MODIFICACIONES A LA POLÍTICA</h2>
                    <p className="text-brand-navy">
                        Yummizi se reserva el derecho de actualizar esta Política de Privacidad ante cambios normativos o evolución de la plataforma (por ejemplo, al constituirse formalmente como empresa o al integrar pasarelas de pago automáticas). Cualquier modificación será notificada a través de la aplicación o al correo registrado.
                    </p>
                </article>

                <div className="w-1/2 h-1 bg-brand-primary shrink-0" />

                <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xl font-bold rounded-lg bg-brand-secondary text-white hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    )
}