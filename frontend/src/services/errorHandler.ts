import { toastService } from './toastService';

export interface ApiErrorData {
  status?: number;
  message?: string;
  errors?: Record<string, string>;
}

export class AppApiError extends Error {
  status?: number;
  errors?: Record<string, string>;

  constructor(message: string, status?: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const errorHandler = {
  handle: (error: unknown): never => {
    console.error('Error occurred:', error);

    if (error instanceof AppApiError) {
      return errorHandler.handleApiError(error);
    }

    if (error instanceof Error) {
      return errorHandler.handleGenericError(error);
    }

    return errorHandler.handleUnknownError();
  },

  handleApiError: (error: AppApiError): never => {
    const { status, message, errors } = error;

    if (status === 401) {
      toastService.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      // Aquí podrías redirigir al login
      throw error;
    }

    if (status === 403) {
      toastService.error('No tienes permisos para realizar esta acción.');
      throw error;
    }

    if (status === 404) {
      toastService.error('Recurso no encontrado.');
      throw error;
    }

    if (status === 400) {
      if (errors && Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toastService.error(firstError || 'Error de validación');
      } else {
        toastService.error(message || 'Solicitud inválida');
      }
      throw error;
    }

    if (status === 500) {
      toastService.error('Error del servidor. Por favor, intenta más tarde.');
      throw error;
    }

    toastService.error(message || 'Error desconocido');
    throw error;
  },

  handleGenericError: (error: Error): never => {
    toastService.error(error.message || 'Ocurrió un error inesperado');
    throw error;
  },

  handleUnknownError: (): never => {
    toastService.error('Ocurrió un error inesperado');
    throw new Error('Unknown error');
  },

  parseApiError: async (response: Response): Promise<AppApiError> => {
    try {
      const data = await response.json();
      return new AppApiError(
        data.message || data.error || 'Error en la solicitud',
        response.status,
        data.errors
      );
    } catch {
      return new AppApiError(
        'Error en la solicitud',
        response.status
      );
    }
  },
};