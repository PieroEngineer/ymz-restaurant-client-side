/**
 * Maps Cognito SDK exceptions to localized, user-friendly error messages.
 */
export const getAuthErrorMessage = (error: unknown): string => {  // TODO: Create a similar one for the mobile app
  if (error instanceof Error) {
    switch (error.name) {
      case 'UsernameExistsException':
        return 'Ya existe una cuenta con este correo electrónico.';
      case 'InvalidPasswordException':
        return 'La contraseña no cumple con los requisitos de seguridad. Asegúrate de incluir números y caracteres especiales.';
      case 'InvalidParameterException':
        return 'Los datos ingresados no son válidos. Por favor, verifica el formato de tu correo y teléfono.';
      case 'CodeDeliveryFailureException':
        return 'No se pudo enviar el correo de verificación. Por favor, revisa bien tu dirección de correo electrónico.';
      case 'TooManyRequestsException':
      case 'LimitExceededException':
        return 'Demasiados intentos de registro. Por favor, espera unos minutos antes de intentarlo de nuevo.';
      default:
        return error.message || 'Ocurrió un error de autenticación inesperado.';
    }
  }
  return 'Ocurrió un error desconocido durante el registro.';
};
